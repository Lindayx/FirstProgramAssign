"use client";

import React, { useRef, useEffect, useState } from "react";


export default function Navbar() {
    const navRef = useRef(null);
    const [height, setHeight] = useState(null);

    useEffect(() => {
        if (navRef.current) {
            const height = navRef.current.offsetHeight;
            setHeight(height);
        }
    }, []);

    return (        
        <nav 
        ref={navRef}
        className="fixed top-0 flex justify-between items-center w-full h-16 px-8 py-4 text-white bg-gray-800 bg-opacity-75 "
        >
            <div className="text-xl font-bold">Dashboard</div>
            <div className="flex gap-8">
                <a href="#" className="hover:text-gray-400">Pet Categories</a>
                <a href="#" className="hover:text-gray-400">Contact</a>
            </div>
        </nav>
    );
}
