import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View } from 'react-native'
import { useState, useCallback } from 'react'

// adding sign in page using the useSignIn hook to create the sign in flow
// user signs in using their email and password

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

    // handling submission of sign in form

    // useCallback returns a memoized version of the callback that only changes if one of the inputs changes
    // inputs/dependencies: emailaddress, password,, isloaded
    const onSignInPress = useCallback( async() => {
        if (!isLoaded) return

        // starting sign in process using email (identifier) and password given to it
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // if sign in process is complete, we set created session as active, redireecting user
            if (signInAttempt.status == 'complete') {
                await setActive( { session: signInAttempt.createdSessionId });
                router.replace('../');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <View>

            <TextInput
                value={emailAddress}
                placeholder="Enter your email please..."
                autoCapitalize="none"
                onChangeText={(email)=>setEmailAddress(email)}
            />
            <TextInput 
                value={password}
                placeholder="Enter your password please..."
                secureTextEntry={true}
                onChangeText={(pass)=>setPassword(pass)}
            />
            <Button title="Sign In" onPress={onSignInPress}/>

            <View>
                <Text>Don't have an account?</Text>
                <Link href="/login/sign-up">
                    <Text>Sign Up</Text>
                </Link>
            </View>
        
        </View>
    )
}