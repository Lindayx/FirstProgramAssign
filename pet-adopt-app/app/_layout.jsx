import { useFonts } from "expo-font"
import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@/cache' 

export default function RootLayout() {

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Publishable Key is missing. Please set the EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in the .env file..."
    )
  };


  useFonts({
    'outfit':require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium':require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold':require('./../assets/fonts/Outfit-Bold.ttf'),
  })

  return (
    // ClerkProvider component providers session and user context to Clerk's hooks and components
    // By wrapping the entire app at the entry point with Clerk, we are making auth globally accessible
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>  
    <ClerkLoaded>
    <Stack>
      {/* <Stack.Screen name="index" /> */}
      {/* <Stack.Screen name="login/index"
      options={{
        headerShown:false
      }}
      /> */}
    </Stack>
    </ClerkLoaded>
    </ClerkProvider>
  );
}
