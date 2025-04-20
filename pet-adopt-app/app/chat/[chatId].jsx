import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { io } from 'socket.io-client'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams()
  const { isLoaded, user } = useUser()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  // WebSocket reference
  const socketRef = useRef(null)

  useEffect(() => {
    if (!isLoaded || !chatId) return
    // Initialize WebSocket connection and join room
    const SOCKET_SERVER_URL = 'http://localhost:5000'
    const socket = io(SOCKET_SERVER_URL)
    socketRef.current = socket
    socket.on('connect', () => {
      console.log('Connected to socket server')
      socket.emit('join', { chatId })
    })
    // Optionally handle incoming chat messages (if broadcasting via socket)
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })
    // Fetch initial messages from Firestore
    const messagesRef = collection(db, 'Chat', chatId, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMessages(msgs)
    })
    return () => {
      unsubscribe()
      socket.disconnect()
    }
  }, [isLoaded, chatId])

  // Send message via WebSocket; backend will persist to Firestore
  const handleSend = () => {
    if (!text.trim() || !chatId || !isLoaded || !socketRef.current) return
    const currentEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      ''
    // Emit chat_message event to backend
    socketRef.current.emit('chat_message', {
      chatId,
      text: text.trim(),
      sender: currentEmail,
    })
    setText('')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const currentEmail =
              user.primaryEmailAddress?.emailAddress ||
              user.emailAddresses?.[0]?.emailAddress ||
              ''
            const isMyMessage = item.sender === currentEmail
            return (
              <View
                style={[
                  styles.messageContainer,
                  isMyMessage ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )
          }}
          contentContainerStyle={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 10 },
  backText: { color: '#007bff' },
  messagesList: { padding: 10 },
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: '80%',
  },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#ECECEC', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontSize: 16 },
})