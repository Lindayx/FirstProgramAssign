# Pet Adoption App

## Overview
We developed a prototype for a mobile application focused on pet adoption. This prototype includes:
- **Secure authentication** through Google Login.
- A **user-friendly interface** with organized tabs (Home, Inbox, and Profile).
- A **home screen** featuring:
  - Slider images to introduce the app.
  - Categories of pets.
  - A list of pets within each category, displayed with images.
- Interactions such as ‘like’ buttons to mark favorite pets.
- A placeholder for **‘Add New Pet’** functionality, planned for future updates.

---

## Key Features

1. **Multiple tabs**: 
   - **Home**: Main screen with pet categories and listings.
   - **Inbox**: Planned for future messaging features.
   - **Profile**: User details and preferences.

   > **Note**: Currently, only the Home tab is fully implemented in this prototype.

2. **Secure Google Authentication**:
   - Utilizes Clark authentication service for simplified login and centralized identity management.

### Screenshots (Conceptual)
1. **Login Screen**  
   - Allows users to sign in with Google.
2. **Home Screen**  
   - Displays slider images.
   - Showcases category list (dogs, birds, cats, fish) with “dogs” as the default.
   - Displays pet listings for the selected category.
   - Shows user info at the top after login.
3. **Inbox (Future)**  
   - Placeholder for chat/messaging feature.
4. **Profile (Future)**  
   - Placeholder for user profile details and settings.

---

## Implementation - Backend

- **Firebase** is used for the backend. There are four main collections:
  1. **Category**  
     - Stores images and names of category buttons.
  2. **Pets**  
     - Contains documents for each pet; `id` is the unique identifier.
  3. **Sliders**  
     - Holds data for the slider images.
  4. **UserFavPet**  
     - Stores an array of pet `id`s that each user has marked as favorites.

- **Favorite Pets**:
  - Each user document in `UserFavPet` has a `favorites` array that stores pet IDs.
  - When a user is added for the first time, this array is initialized to `[]`.
  - Clicking the heart button uses `updateDoc` (Firebase/Firestore) to append or remove a pet ID from this array.

---

## Implementation - Frontend

- Built with **React Native**.
- Expo is used to run and test the application on both iOS and Android devices.
- The interface is modular and connects to Firebase for data retrieval and updates.

---

## Version Control (Git)

- Collaboration was done using **VSCode Live Share** for pair programming.
- Each new feature was developed on a separate branch, then merged into `main` upon completion and testing.
- Some branches have been preserved for future reference.
- The Git commit history is attached in the repository for detailed changes.

---

## Authentication

- **Clark authentication service** handles Google sign-in via a middleware layer.
- This approach simplifies security concerns and centralizes identity management.
- Once authenticated, users are redirected to the Home screen, where their login info is displayed at the top.

---

## How to Use

1. **Clone the Repository**  
   - `git clone <your-repo-url>`
2. **Install Dependencies**  
   - `cd pet-adopt-app`
   - `npm install`
3. **Start the App**  
   - `npx expo start --tunnel`
4. **Run on Your Phone**  
   - Scan the generated QR code with your phone camera or the Expo Go app.
   - If prompted, install **Expo Go** on your device.
   - Once installed, the app will open automatically.

---

## Future Improvements

- **Chat Messaging Feature**:  
  - Implement an in-app chat where users can directly communicate with adoption centers.
- **Enhanced Profile Features**:  
  - Enable users to track their adoption history, personal details, and more.

---

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)

