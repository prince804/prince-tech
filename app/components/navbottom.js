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
    const checkPath = currentPath === "/" || currentPath === "/login" || currentPath === "/admin" || currentPath === "/admin/adminpanel"

    // Fetch username from cookies on client-side
    useEffect(() => {
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    return (
        <ul className={`${checkPath ? "hidden" : "md:hidden flex"} fixed bottom-0 w-full flex-wrap justify-center text-sm font-medium text-center border-b border-gray-700 text-gray-400`}>
            <li className="me-2">
                <Link href={`/dashboard/${username}`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <span className="material-symbols-outlined">bar_chart_4_bars</span>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}` ? "" : "hidden"}`}>Dashboard</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/utmlinks`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/utmlinks` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <span className="material-symbols-outlined">campaign</span>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/utmlinks` ? "" : "hidden"}`}>UTM Links</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/utmgenerator`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/utmgenerator` ? "bg-gray-800 text-blue-500" : " bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <span className="material-symbols-outlined">add_link</span>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/utmgenerator` ? "" : "hidden"}`}>UTM Generator</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/statistics`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/statistics` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <span className="material-symbols-outlined">query_stats</span>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/statistics` ? "" : "hidden"}`}>Statistics</span>
                    </div>
                </Link>
            </li>
            <li className="me-2">
                <Link href={`/dashboard/${username}/earnings`} className={`inline-block p-2 sm:p-4 rounded-t-lg ${currentPath === `/dashboard/${username}/earnings` ? "bg-gray-800 text-blue-500" : "bg-gray-800 text-gray-300"}`}>
                    <div className='flex items-center justify-center'>
                        <span className="material-symbols-outlined">payments</span>
                        <span className={`font-bold ${currentPath === `/dashboard/${username}/earnings` ? "" : "hidden"}`}>Earnings</span>
                    </div>
                </Link>
            </li>
        </ul>
    )
}

export default NavBottom
