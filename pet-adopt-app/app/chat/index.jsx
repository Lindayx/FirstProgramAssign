import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { GiftedChat }  from 'react-native-gifted-chat';
import { useState } from 'react';
import { db } from '../../config/FirebaseConfig';
import { getDoc } from 'firebase/firestore';
import { NavigationPreloadManager } from 'react-native';
import moment from 'moment';

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation=useNavigation();
    const {user}= useUser();
    console.log("User object:", user); 
    const [messages,setMessages]=useState([]);

    useEffect(()=>{
        GetUserDetails();

        const unsubscribe=onSnapshot(collection(db,'Chat',params.id,'Messages'),(snapshot)=>{
            const messages=snapshot.docs.map(doc=>({
                _id:doc.id,
                text:doc.data().text,
                createdAt:doc.data().createdAt.toDate(),
                user:doc.data().user
            }))
            setMessages(messages);
        });
        return ()=>unsubscribe();
    }
    ,[])

    const GetUserDetails = async () => {
        try {
            // Fetch user details from Firestore
            const docRef = doc(db, 'Chat', params?.id);
            const docSnap = await getDoc(docRef);
    
            if (!docSnap.exists()) {
                console.error("Chat document does not exist!");
                return;
            }
    
            const result = docSnap.data();
            console.log("User Details:", result); // Debugging
    
         if (!chatData?.user1 || !chatData?.user2) {
        console.error("Missing user1 or user2 fields!");
        return;
        }
    
            // Fix filter syntax (use => instead of =)
            const otherUser = result.users.filter(item => item.email !== user?.primaryEmailAddress?.emailAddress);
            
            console.log("Other User Details:", otherUser); // Debugging
    
            if (otherUser.length === 0) {
                console.error("No other user found in chat!");
                return;
            }
    
            // Update header title safely
            navigation.setOptions({
                headerTitle: otherUser[0]?.name || "Unknown User",
            });
    
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };
    

    const onSend= async (newMessage)=>{
        setMessages(previousMessages=>GiftedChat.append(previousMessages,newMessage));
        newMessage[0].createdAt=moment().format('MM-DD-YYYY HH:mm:ss');
        await addDoc(collection(db,'Chat',params.id, 'Messages'), newMessage[0]);
    }
    return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
    />
    );
}