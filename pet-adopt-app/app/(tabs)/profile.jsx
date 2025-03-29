import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useNavigation  } from 'expo-router'

export default function Profile() {
  const { signOut } = useAuth()

  const navigation = useNavigation()

  const handleSignOut = async () => {
    try {
      console.log("fuck")
      await signOut()
      navigation.navigate('login')
    } catch (error) {
      console.error('Error during sign-out:', error)
      // Optionally, display an error message to the user
    }
  }
  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity 
        onPress={handleSignOut} 
        style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5, marginTop: 10 }}
      >
        <Text style={{ textAlign: 'center' }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}