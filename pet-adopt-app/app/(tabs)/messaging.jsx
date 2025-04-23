import React, { useState, useEffect } from 'react'
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
import { useIsFocused } from '@react-navigation/native'

export default function Messaging() {
  const [emailSearch, setEmailSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  // track search bar focus
  const [isSearchActive, setIsSearchActive] = useState(false)
  // Simple email regex for validation
  const emailRegex = /^\S+@\S+\.\S+$/

  const router = useRouter()
  const { user, isLoaded } = useUser()
  const isFocused = useIsFocused()
  // check for existing chats
  const [existingChats, setExistingChats] = useState([])
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

  // Reload chats when screen is focused or user state changes
  useEffect(() => {
    const loadChats = async () => {
      if (!isLoaded) return
      const currentEmail =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        ''
      try {
        const favQ = query(
          collection(db, 'UserFavPet'),
          where('email', '==', currentEmail)
        )
        const favSnap = await getDocs(favQ)
        if (favSnap.empty) {
          setExistingChats([])
          return
        }
        const favData = favSnap.docs[0].data()
        const chatIds = Array.isArray(favData.chatIds) ? favData.chatIds : []
        const chats = []
        for (const id of chatIds) {
          const chatDocRef = doc(db, 'Chat', id)
          const chatDocSnap = await getDoc(chatDocRef)
          if (!chatDocSnap.exists()) continue
          const cd = chatDocSnap.data()
          if (Array.isArray(cd.participants)) {
            const other = cd.participants.find((p) => p !== currentEmail)
            if (other) chats.push({ id, otherEmail: other })
          }
        }
        setExistingChats(chats)
      } catch (err) {
        console.error('Error loading existing chats:', err)
        setExistingChats([])
      }
    }
    if (isFocused) {
      loadChats()
    }
  }, [isLoaded, user, isFocused])

  return (
    <View style={styles.container}>
      {/* Search for new user */}
      <TextInput
        style={styles.input}
        placeholder="Search by email"
        value={emailSearch}
        onChangeText={(text) => {
          setEmailSearch(text)
          const valid = emailRegex.test(text.trim())
          setEmailValid(valid)
          if (text.trim() === '') {
            setSearchPerformed(false)
            setResults([])
          }
        }}
        onFocus={() => setIsSearchActive(true)}
        onBlur={() => setIsSearchActive(false)}
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {emailSearch.length > 0 && !emailValid && (
        <Text style={styles.errorText}>
          Please enter a valid email address.
        </Text>
      )}
      <TouchableOpacity
        style={[styles.button, !emailValid && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={!emailValid}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {/* Search results */}
      {(isSearchActive || searchPerformed) && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                setIsSearchActive(false)
                openChat(item.email)
              }}
            >
              <Text style={styles.resultText}>Email: {item.email}</Text>
              <Text style={styles.resultText}>
                Favorites: {Array.isArray(item.favorites) ? item.favorites.join(', ') : 'N/A'}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchPerformed ? (
              <Text style={styles.notFoundText}>Email is not found!</Text>
            ) : null
          }
        />
      )}
      {/* Existing chats */}
      <Text style={styles.sectionTitle}>Chats</Text>
      <View style={styles.divider} />
      <FlatList
        data={existingChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() =>
              router.push(`/chat/${encodeURIComponent(item.id)}`)
            }
          >
            <Text style={styles.resultText}>{item.otherEmail}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.notFoundText}>No chats yet.</Text>
        }
      />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
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