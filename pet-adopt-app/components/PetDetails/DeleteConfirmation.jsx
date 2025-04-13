import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function DeleteConfirmationModal({ visible, onClose, pet }) {
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
            <TouchableOpacity onPress={() => console.log('Delete confirmed')} style={styles.deleteButton}>
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
        backgroundColor: 'rgb(24, 122, 192)', // Corrected syntax
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