import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { Linking, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig'; // update path as needed

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser(); // Clerk user
   
  
      // Get pet owner's email from Firestore
    
    
  useEffect(()=>{
    navigation.setOptions({
      headerTransparent:true,
      headerTitle:''
    });
  },[])
  const handleAdopt = async () => {
    try {
      console.log("Adopt button pressed");
      const adopterEmail = user.primaryEmailAddress.emailAddress;
      const adopterName = user.fullName || "Someone";
      console.log("Adopter Email:", adopterEmail);
      console.log("Adopter Name:", adopterName);
  
      const petDocRef = doc(db, 'Pets', pet.id); // pet.id = Firestore document ID
      const petDocSnap = await getDoc(petDocRef);
  
      if (!petDocSnap.exists()) {
        Alert.alert("Error", "Pet details not found.");
        return;
      }
  
      const petData = petDocSnap.data();
      const ownerEmail = petData.email;
      const petName = petData.name;
  
      // 🔁 Call backend to send the email
      console.log("Calling the backend to send email...");
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to_email: ownerEmail,
          to_name: petData.username || "Pet Owner",
          pet_name: petName,
          adopter_name: adopterName,
          adopter_email: adopterEmail
        })
      });

      console.log("Response from backend:", response);
  
      if (!response.ok) {
        throw new Error("Email sending failed");
      }
  
      // Alert.alert("Success", "Request sent to the pet owner!");
  
    } catch (err) {
      console.error("Adopt error", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };
  
  
     
  
  return (
    <View>
      <ScrollView>
        {/* Pet Info */}
        <PetInfo pet={pet}/>
        {/* Pet Sub Info */}
        <PetSubInfo pet={pet}/>
        {/* about */}
        <AboutPet pet={pet}/>
        {/* owner details */}
        <OwnerInfo pet={pet} />
        <View style={{
          height:70
        }}></View>
        

      </ScrollView>
    {/* Adopt Me button */}
    <View style={styles.bottomContainer}>
      <TouchableOpacity style={styles.adoptBtn} onPress={handleAdopt}>
        <Text style={{
          textAlign: 'center',
          fontFamily: 'outfit-medium',
          fontSize: 20
        }}>
          Adopt Me
        </Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  adoptBtn:{
    padding: 15,
    backgroundColor:Colors.PRIMARY
  },
  bottomContainer:{
    position:'absolute',
    width:'100%',
    bottom:0
  }
})