"use client"
import Link from 'next/link'
import React from 'react'
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import logo from "../images/logo.png"
import Image from 'next/image';
import { toast } from 'react-toastify';

const Header = () => {
    // Assuming username is stored in cookies
    const [username, setUsername] = useState('');
    const [hideSignout, setHideSignout] = useState(true);
    const router = useRouter();
    const currentPath = usePathname();

    // Fetch username from cookies on client-side
    useEffect(() => {
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = async () => {
        try {
            // Make a request to the logout API route
            const response = await fetch('/api/logout', {
                method: 'GET',
            });
            toast('You have been Logged Out!', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            // Redirect to login or home page after successful logout
            if (response.ok) {
                router.push('/login');
            }
        } catch (err) {
            console.error('Failed to logout:', err);
        }
    };
    return (
        <header className="text-gray-400 bg-[#11182770] body-font relative z-50">
            <div className="container mx-auto flex flex-wrap p-5 md:flex-row items-center justify-between">
                <Link href={"/"} className="flex title-font font-medium items-center text-white md:mb-0">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl">FTT Dashboard</span> */}
                    <Image src={logo} alt='Logo' width={180}/>
                </Link>

                {(currentPath == "/login" || currentPath == "/") &&
                    <Link href={"/login"} className='md:ml-auto flex flex-wrap items-center justify-center'>
                        <button className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base  md:mt-0">Go to Dashboard
                            <lord-icon
                                src="https://cdn.lordicon.com/vduvxizq.json"
                                trigger="hover"
                                colors="primary:#9ca3af"
                                style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                        </button>
                    </Link>
                }

                {!(currentPath == "/login" || currentPath == "/") &&
                    <>
                        <nav className="md:ml-auto hidden md:flex flex-wrap items-center text-base justify-center">
                            <Link href={`/dashboard/${username}`} className="mr-5 hover:text-white">Dashboard</Link>
                            <Link href={`/dashboard/${username}/utmlinks`} className="mr-5 hover:text-white">UTM-Links</Link>
                            <Link href={`/dashboard/${username}/utmgenerator`} className="mr-5 hover:text-white">UTM Generator</Link>
                            <Link href={`/dashboard/${username}/statistics`} className="mr-5 hover:text-white">Statistics</Link>
                            <Link href={`/dashboard/${username}/earnings`} className="mr-5 hover:text-white">Eainings</Link>
                        </nav>
                        <button onClick={() => { setHideSignout(false) }} className="inline-flex items-center border-0 py-1 px-3 rounded text-base font-bold md:mt-0 text-white focus:ring-4 focus:outline-none bg-red-600 hover:bg-red-700 focus:ring-red-800">Log Out
                            <lord-icon
                                src="https://cdn.lordicon.com/vduvxizq.json"
                                trigger="hover"
                                colors="primary:#ffffff"
                                style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                        </button>
                        <div className={`bg-[#37415130] ${hideSignout ? "hidden" : "flex"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full`}>
                            <div className="h-screen flex items-center justify-center relative p-4 w-full max-w-md md:h-auto">
                                <div className="relative p-4 text-center rounded-lg shadow bg-gray-800 sm:p-5">
                                    <button onClick={() => { setHideSignout(true) }} className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <svg className="text-gray-500 w-11 h-11 mb-3.5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                                    </svg>
                                    <p className="mb-4 text-gray-300">Are you sure you want to Log Out</p>
                                    <div className="flex justify-center items-center space-x-4">
                                        <button onClick={() => { setHideSignout(true) }} className="py-2 px-3 text-sm font-medium rounded-lg border focus:ring-4 focus:outline-none focus:ring-primary-300 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">
                                            No, cancel
                                        </button>
                                        <button onClick={() => { handleLogout(); setHideSignout(true) }} className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-red-900">
                                            Yes, I am sure
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }

            </div>
        </header>
    )
}

export default Header
