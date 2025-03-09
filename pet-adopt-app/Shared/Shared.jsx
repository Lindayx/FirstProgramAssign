import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "./../config/FirebaseConfig"

const GetFavList = async (user) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
        console.error("User email is missing.");
        return null;
    }

    const docRef = doc(db, 'UserFavPet', user.primaryEmailAddress.emailAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data(); 
    } else {
        const newDoc = {
            email: user.primaryEmailAddress.emailAddress,
            favorites: []
        };

        await setDoc(docRef, newDoc);
        return newDoc; 
    }
};


const UpdateFav=async(user,favorites)=>{
    const docRef=doc(db,'UserFavPet',user?.primaryEmailAddress?.emailAddress);
    try{
        await updateDoc(docRef,{
            favorites:favorites
        })
    }catch(e){

    }
}
export default {
    GetFavList,
    UpdateFav
}