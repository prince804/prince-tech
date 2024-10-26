"use client"
import Link from 'next/link'
import React from 'react'
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react';

const NavBottom = () => {
    // Assuming username is stored in cookies
    const [username, setUsername] = useState('');
    const currentPath = usePathname();
    const checkPath = currentPath.startsWith("/dashboard")
    // Fetch username from cookies on client-side
    useEffect(() => {
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    return (
        <ul className={`${!checkPath ? "hidden" : "md:hidden flex"} fixed bottom-0 w-full flex-wrap justify-center text-sm font-medium text-center border-b border-gray-700 text-gray-400`}>
            <li className="me-2">
                <Link href={`/dashboard/${username}`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={`${currentPath === `/dashboard/${username}` ? "#3b82f6" : "#d1d5db"}`}><path d="M80-120v-80h800v80H80Zm40-120v-280h120v280H120Zm200 0v-480h120v480H320Zm200 0v-360h120v360H520Zm200 0v-600h120v600H720Z" /></svg>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}` ? "" : "hidden"}`}>Dashboard</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/utmlinks`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/utmlinks` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={`${currentPath === `/dashboard/${username}/utmlinks` ? "#3b82f6" : "#d1d5db"}`}><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" /></svg>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/utmlinks` ? "" : "hidden"}`}>UTM Links</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/utmgenerator`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/utmgenerator` ? "bg-gray-800 text-blue-500" : " bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <circle cx="6" cy="6" r="3"></circle>
                            <circle cx="6" cy="18" r="3"></circle>
                            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                        </svg>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/utmgenerator` ? "" : "hidden"}`}>UTM Generator</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/statistics`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/statistics` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/statistics` ? "" : "hidden"}`}>Statistics</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/earnings`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/earnings` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/earnings` ? "" : "hidden"}`}>Earnings</span>
                    </div>
                </Link>
            </li>
        </ul>
    )
}

export default NavBottom
