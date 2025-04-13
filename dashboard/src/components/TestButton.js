"use client";


//this function is purely just to test javascript jargon
import { useEffect,  useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { firebaseConfig, db} from '@/lib/firebaseConfig';

export default function TestButton() {

    const [testData, setTestData] = useState(null);

    useEffect(() =>{
      const readDoc = async () => {
        console.log("calling readDoc");
        try {
          const docRef = doc(db, "Category", "URdeA6yaKEOLaZut7unI");
          const docSnap = await getDoc(docRef);
          setTestData(docSnap.data());
        } catch (err) {
          console.log('javascript is ass');
        }
      }

      readDoc();
    }, []);

    return (
        <button onClick={
            () => {
              console.log("from process.env: ");
              console.log(process.env.NEXT_PUBLIC_TEST_ENV);
              console.log("from firebaseConfig: ");
              console.log(firebaseConfig.TEST_ENV);
              console.log(firebaseConfig);
              console.log(db);

              console.log(testData);
            }
          }className="fixed bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Click Me
          </button>
    )
}