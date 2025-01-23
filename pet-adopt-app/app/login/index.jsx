import { ScrollView, View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from "expo-router"


export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor:Colors.WHITE,
        paddingBottom:20,
      }}
    >
      <Image source={require('../../assets/images/login.png')}
        style={{
            width:'100%',
            height:500
        }}
      />
      <View style={{
        padding:20,
        display:'flex',
        alignItems:'center'
      }}>
        <Text style={{
            fontFamily:'outfit-bold',
            fontSize:30,
            textAlign:'center'
        }}>Ready to make a new friend?</Text>
        <Text style={{
            fontFamily:'outfit',
            fontSize:18,
            textAlign:'center',
            color:Colors.GRAY
        }}>Let's adopt the pet which you like and make their life happy again</Text>
          {/* <Pressable 
              style={{
                  padding:14,
                  marginTop:20,
                  backgroundColor:Colors.PRIMARY,
                  width:'100%',
                  borderRadius:14
              }}

              onPress={() => router.push('/login/sign-up')}
          > 
            
              <Text style={{
                  fontFamily:'outfit-medium',
                  fontSize:20,
                  textAlign:'center'
              }}>Get Started & Sign up with us!</Text>
              
           </Pressable>

           <Pressable 
              style={{
                  padding:14,
                  marginTop:20,
                  backgroundColor:Colors.PRIMARY,
                  width:'100%',
                  borderRadius:14
              }}

              onPress={() => router.push('/login/sign-in')}
          > 
            
              <Text style={{
                  fontFamily:'outfit-medium',
                  fontSize:20,
                  textAlign:'center'
              }}>Sign In!</Text>
              
           </Pressable> */}

           <Pressable 
              style={{
                  padding:14,
                  marginTop:20,
                  backgroundColor:Colors.PRIMARY,
                  width:'100%',
                  borderRadius:14
              }}

              onPress={() => router.push('/login/google-sign-in')}
          > 
            
              <Text style={{
                  fontFamily:'outfit-medium',
                  fontSize:20,
                  textAlign:'center'
              }}>Google Sign In!</Text>
              
           </Pressable>
      </View>
    </ScrollView>
  )
}