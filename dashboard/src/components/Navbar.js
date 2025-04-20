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
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="text-2xl font-bold">Dashboard</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-200">Pet Categories</a>
              <a href="#" className="hover:text-gray-200">Contact</a>
              <a href="#" className="hover:text-gray-200">Settings</a>
            </div>
          </div>
        </nav>
      );
}
