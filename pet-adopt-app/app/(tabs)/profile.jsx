import { View, Text } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { useNavigation  } from 'expo-router'
import React from 'react'

export default function Profile() {
  const { signOut } = useAuth()

  const navigation = useNavigation()

  const handleSignOut = async () => {
    await signOut()
    navigation.navigate('/login')
  }

  return (
    <View>
      <Text>Profile hjahahahahha</Text>
      <button onClick={handleSignOut}>Sign Out</button>

    </View>
  )
}