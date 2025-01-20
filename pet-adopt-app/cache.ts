import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { TokenCache } from '@clerk/clerk-expo/dist/cache/types'

/*

Clerk will store the active user's session token in memory by default.

We use expo-secure-store since it encrypts data such as tokens before storing it. 

*/
const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const item = await SecureStore.getItemAsync(key)
                if (item) {
                    console.log(`${key} was used 🔐 \n`)
                } else {
                    console.log('No values stored under key: ' + key)
                }
                return item
            } catch (error) {
                console.error('Secure store GetItem error: ', error)
                await SecureStore.deleteItemAsync(key)
                return null
            } 
        },
        saveToken: (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token)
        }
    }
}

// SecureStore is not supported on the web
export const tokenCache = Platform.OS != 'web' ? createTokenCache() : undefined