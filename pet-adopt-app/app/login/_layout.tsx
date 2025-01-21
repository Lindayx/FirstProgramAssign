import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'


export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth()
    // useAuth hook is used to access user auth state

    if (isSignedIn) {
        // if user already signed in, redirect to home page
        return <Redirect href={'/'} />
    }

    return <Stack />
}