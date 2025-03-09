import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { collection, doc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from "@clerk/clerk-expo";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: ''
    });
  }, []);

  const InitiateChat = async () => {
    console.log("User object:", user); // Debugging
    console.log("Pet object:", pet);   // Debugging

    const userEmail = user?.primaryEmailAddress?.emailAddress; 
    const petEmail = pet?.email;
    
    if (!userEmail || !petEmail) {
      console.error("User or Pet Email is missing.");
      return;
    }

    const docId1 = `${userEmail}_${petEmail}`;
    const docId2 = `${petEmail}_${userEmail}`;

    const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => console.log(doc.data()));
    } else {
      try {
        await setDoc(doc(db, 'Chat', docId1), {
          user1: {
            email: userEmail,
            imageUrl: user?.imageUrl,
            name: user?.fullName,
          },
          user2: {
            email: petEmail,
            imageUrl: pet?.imageUrl,
            name: pet?.username,
          },
          id: docId1,
        });

        console.log("New chat document created.");
      } catch (error) {
        console.error("Error creating chat document:", error);
        return;
      }
    }

    // Navigate to Chat Screen
    router.push({
      pathname: `/chat/`,
      params: { id: docId1 },
    });
  };

  return (
    <View>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
        <View style={{ height: 70 }}></View>
      </ScrollView>

      {/* Adopt Me Button */}
      <TouchableOpacity style={styles.adoptBtn} onPress={InitiateChat}>
        <Text style={{
          textAlign: 'center',
          fontFamily: 'outfit-medium',
          fontSize: 20
        }}>
          Adopt Me
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center'
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0
  }
});
