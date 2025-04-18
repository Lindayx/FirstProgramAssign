import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import app from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
export default function PetInfo({ pet }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useUser(); // Get the logged-in user
  const router = useRouter();

  const handleDelete = async () => {
      try {
        console.log(user?.emailAddress);
        const primaryEmail = user?.emailAddresses?.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
        if (primaryEmail !== pet.email) {
          Alert.alert('Error', 'You are not authorized to delete this pet.');
          return;
        }
  
        const db = getFirestore(app);
        const petDocRef = doc(db, 'Pets', pet.id);
        await deleteDoc(petDocRef);
        Alert.alert('Success', 'Pet deleted successfully');
        router.push('/(tabs)/home');
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    };


  // Get the logged-in user's primary email
  const primaryEmail = user?.emailAddresses?.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

  return (
    <View>
      <Image
        source={{ uri: pet.imageUrl }}
        style={{
          width: '100%',
          height: 500,
          objectFit: 'cover',
        }}
      />
      <View
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: 'ourfit-bold',
              fontSize: 27,
            }}
          >
            {pet?.name}
          </Text>

          <Text
            style={{
              fontFamily: 'outfit',
              fontSize: 16,
              color: Colors.GRAY,
            }}
          >
            {pet?.address}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* Conditionally render the delete button if the logged-in user added the pet */}
          {primaryEmail === pet.email && (
            <Text
              style={{
                fontSize: 20,
                marginLeft: 10,
                backgroundColor: 'red',
                color: 'white',
                borderWidth: 1,
                borderColor: 'red',
                borderRadius: 15,
                width: 30,
                height: 30,
                textAlign: 'center',
                lineHeight: 30,
              }}
              onPress={handleDelete}
            >
              X
            </Text>
          )}
        </View>
      </View>
      
    </View>
  );
}