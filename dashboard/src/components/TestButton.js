"use client";

import { useEffect, useRef } from 'react';
import firebaseConfig from '@/lib/firebaseConfig';

export default function TestButton() {

    return (
        <button onClick={
            () => {
              console.log("from process.env: ")
              console.log(process.env.NEXT_PUBLIC_TEST_ENV)
              console.log("from firebaseConfig: ")
              console.log(firebaseConfig.TEST_ENV)
            }
          }className="fixed bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Click Me
          </button>
    )
}