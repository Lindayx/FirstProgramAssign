import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as React from 'react'
import { Text, TextInput, Button, View } from 'react-native'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp(); // 
    // useSignUp hook is being used to create our sign up flow.
    // User signs up using their email and password, receiving an email verification code to confirm their email
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');

    //handle submission for the sign up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // starting sign up process using email and password given 
        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // send user an email with a verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code'});

            // Set 'pendingVerification' to true in order to display second form, getting the One time pad code/one time password (otp)
            setPendingVerification(true);

        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }

    };

const onVerifyPress = async() => {
    if (!isLoaded) return;

    try {
        // use code user provider to check for attempted verification
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
            code,
        }); 

        if (signUpAttempt.status == 'complete') {
            await setActive({ session: signUpAttempt.createdSessionId });
            router.replace('../'); // replaces current route in the history stack (so cant navigate back to the previous page) 
            
        } else {
            // if status is not complete, check why and user may need to complete additional steps
            console.error(JSON.stringify(signUpAttempt, null, 2));
        }

    } catch (err) {
        console.error(JSON.stringify(err, null, 2));
    }
}

if (pendingVerification) {
    return (
        <> 
            <Text>Verify your email</Text>
            
            <TextInput
                value={code}
                placeholder='Enter your verification code please..'
                onChangeText={(otp)=> setCode(otp)} // callback function triggered when text input changes, updates state with new text val
            />

            <Button title="Verify" onPress={onVerifyPress}/>
        </>
    )
}

return (
    <View>
        <> {/* shorthand way to group multiple elements without intropucing wrappers into struct */}
        <Text>Sign Up Cat Wizard!</Text>

        <TextInput 
            value={emailAddress} // var controlled by state
            placeholder='Enter your email please...'
            onChangeText={(email)=>setEmailAddress(email)} // temp var to update state
            autoCapitalize='none'
        />

        <TextInput
            value={password}
            placeholder='Enter your password please...'
            onChangeText={(pass)=>setPassword(pass)}
            secureTextEntry={true}
        />

        <Button
         title="Continue"
         onPress={onSignUpPress}
        />

        </>
    </View>
)

}

