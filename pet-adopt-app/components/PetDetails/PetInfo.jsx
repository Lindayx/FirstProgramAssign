import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import Colors from '../../constants/Colors';
import DeleteConfirmationModal from './DeleteConfirmation';
import { useUser } from '@clerk/clerk-expo'; // Import useUser to get the current user

export default function PetInfo({ pet }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useUser(); // Get the logged-in user

  const handleDeletePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
              onPress={handleDeletePress}
            >
              X
            </Text>
          )}
        </View>
      </View>
      <DeleteConfirmationModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        pet={pet}
      />
    </View>
  );
}