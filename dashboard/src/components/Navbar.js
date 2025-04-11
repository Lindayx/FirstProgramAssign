import React from "react";


export default function Navbar() {
    return (
        // <nav className="fixed top-10 flex justify-around items-center p-4 text-white w-1/3 bg-gray-800 bg-opacity-75 rounded-2xl">
        //     <a href="#" className="hover:text-gray-400">Home</a>
        //     <a href="#" className="hover:text-gray-400">About</a>
        //     <a href="#" className="hover:text-gray-400">Contact</a>
        // </nav>

        
        <nav className="fixed top-0 flex justify-between items-center w-full px-8 py-4 text-white bg-gray-800 bg-opacity-75 ">
            <div className="text-xl font-bold">Dashboard</div>
            <div className="flex gap-8">
                <a href="#" className="hover:text-gray-400">Home</a>
                <a href="#" className="hover:text-gray-400">About</a>
                <a href="#" className="hover:text-gray-400">Contact</a>
            </div>
        </nav>
    );
}
