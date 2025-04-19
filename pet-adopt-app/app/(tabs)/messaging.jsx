import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { collection, query, where, getDocs, addDoc, serverTimestamp, getDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'

export default function Messaging() {
  const [emailSearch, setEmailSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  // Simple email regex for validation
  const emailRegex = /^\S+@\S+\.\S+$/

  const router = useRouter()
  const { user, isLoaded } = useUser()
  // Trigger search only when email is valid
  const handleSearch = async () => {
    const trimmed = emailSearch.trim()
    if (!trimmed || !emailValid) {
      setResults([])
      setSearchPerformed(false)
      return
    }
    setSearchPerformed(true)
    setLoading(true)
    try {
      const q = query(
        collection(db, 'UserFavPet'),
        where('email', '==', trimmed)
      )
      const snapshot = await getDocs(q)
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setResults(users)
    } catch (error) {
      console.error('Error searching users:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Open existing chat or create a new one, then navigate
  const openChat = async (otherEmail) => {
    if (!isLoaded) return
    // Determine current user's email
    const currentEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      ''
    // Fetch current user's UserFavPet document
    const userFavQ = query(
      collection(db, 'UserFavPet'),
      where('email', '==', currentEmail)
    )
    const userFavSnap = await getDocs(userFavQ)
    if (userFavSnap.empty) return
    const userFavDoc = userFavSnap.docs[0]
    const userFavRef = doc(db, 'UserFavPet', userFavDoc.id)
    const userFavData = userFavDoc.data()
    const chatIds = Array.isArray(userFavData.chatIds) ? userFavData.chatIds : []
    let existingChatId
    // Check existing chats
    for (const id of chatIds) {
      const chatDocRef = doc(db, 'Chat', id)
      const chatDocSnap = await getDoc(chatDocRef)
      if (chatDocSnap.exists()) {
        const cd = chatDocSnap.data()
        if (Array.isArray(cd.participants) && cd.participants.includes(otherEmail)) {
          existingChatId = id
          break
        }
      }
    }
    let chatId
    if (existingChatId) {
      chatId = existingChatId
    } else {
      // Create new chat document with generated ID
      const newChatRef = await addDoc(collection(db, 'Chat'), {
        participants: [currentEmail, otherEmail],
        createdAt: serverTimestamp(),
      })
      chatId = newChatRef.id
      // Update chatIds for both users
      await updateDoc(userFavRef, { chatIds: arrayUnion(chatId) })
      // Also update other user's UserFavPet doc
      const otherFavQ = query(
        collection(db, 'UserFavPet'),
        where('email', '==', otherEmail)
      )
      const otherFavSnap = await getDocs(otherFavQ)
      if (!otherFavSnap.empty) {
        const otherFavDoc = otherFavSnap.docs[0]
        const otherFavRef = doc(db, 'UserFavPet', otherFavDoc.id)
        await updateDoc(otherFavRef, { chatIds: arrayUnion(chatId) })
      }
    }
    router.push(`/chat/${encodeURIComponent(chatId)}`)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by email"
        value={emailSearch}
        onChangeText={(text) => {
          setEmailSearch(text)
          setEmailValid(emailRegex.test(text.trim()))
        }}
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {emailSearch.length > 0 && !emailValid && (
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      )}
      <TouchableOpacity
        style={[styles.button, !emailValid && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={!emailValid}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Loading...</Text>
      ) : searchPerformed && results.length === 0 ? (
        <Text style={styles.notFoundText}>Email is not found!</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => openChat(item.email)}
            >
              <Text style={styles.resultText}>Email: {item.email}</Text>
              <Text style={styles.resultText}>
                Favorites: {Array.isArray(item.favorites) ? item.favorites.join(', ') : 'N/A'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 14,
  },
})