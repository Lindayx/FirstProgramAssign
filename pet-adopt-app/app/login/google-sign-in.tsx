import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Text, View, Button, Platform, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

// Custom hook to warm up/cool down the WebBrowser on mobile platforms
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      WebBrowser.warmUpAsync();
    }
    return () => {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

// This ensures auth sessions are completed (only for mobile)
WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL('/(tabs)/home', { scheme: 'myapp' });
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl,
      });

      // If sign-in was successful, set the active session
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        Alert.alert('Success', 'You have successfully signed in!');
      } else {
        // Handle additional steps like MFA
        Alert.alert('Notice', 'Additional steps may be required to complete sign-in.');
      }
    } catch (err) {
      // Error handling with user feedback
      console.error('OAuth Error:', err);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  }, [startOAuthFlow]);

  return (
    <View>
      <Link href="/">
        <Text>Home</Text>
      </Link>
      <Button title="Sign in with Google" onPress={onPress} />
    </View>
  );
}
