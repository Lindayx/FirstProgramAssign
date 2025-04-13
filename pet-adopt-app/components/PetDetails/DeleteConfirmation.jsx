import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import app from '../../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo'; // Import useUser to get the current user

export default function DeleteConfirmationModal({ visible, onClose, pet }) {
  const router = useRouter();
  const { user } = useUser();

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
      onClose();
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert('Error', 'Failed to delete the pet. Please try again.');
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: pet.imageUrl }}
            style={styles.petImage}
          />
          <Text style={styles.message}>Are you sure you want to delete this pet?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    opacity: 0.5,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'rgb(24, 122, 192)',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: 'black',
    fontSize: 16,
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
  },
});