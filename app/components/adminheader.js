"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';

const AdminHeader = () => {
    const router = useRouter();
    const [hideSignout, setHideSignout] = useState(true);
    const [hideReset, setHideReset] = useState(true);
    const [showPass, setShowPass] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm()

    const handleLogout = async () => {
        try {
            // Make a request to the logout API route
            await fetch('/api/adminlogout', {
                method: 'GET',
            });
            toast('You have been Signed Out!', {
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
            router.push('/admin');
        } catch (err) {
            console.error('Failed to logout:', err);
        }
    };
    const onSubmit = async (data) => {
        data.newUsername = data.newUsername.toLowerCase();
        data.oldUsername = data.oldUsername.toLowerCase();
        const req = await fetch("/api/resetpass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const res = await req.json();
        if (!req.ok) {
            setError("formErrors", { message: res.message })
        } else {
            toast(res.message, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setHideReset(true);
            handleLogout();
        }
    }
    return (
        <>
            <header>
                <nav className="border-gray-200 bg-gray-900">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <Link href="/admin/adminpanel" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Image src="https://flowbite.com/docs/images/logo.svg" className="w-auto h-auto" alt="Logo" width="32" height="32" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Admin Panel</span>
                        </Link>
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <button onClick={() => { setHideReset(false) }} className="text-blue-700 font-bold text-sm text-center px-2 hover:text-red-700">
                                Reset Password?
                            </button>
                            <button onClick={() => { setHideSignout(false) }} className="inline-flex items-center text-white focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-4 py-2 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800">
                                Sign Out
                                <lord-icon
                                    src="https://cdn.lordicon.com/vduvxizq.json"
                                    trigger="hover"
                                    colors="primary:#ffffff"
                                    style={{ "width": "25px", "height": "25px" }}>
                                </lord-icon>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
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
                        <p className="mb-4 text-gray-300">Are you sure you want to Sign Out</p>
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

            <div className={`bg-[#37415180] ${hideReset ? "hidden" : "flex"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full`}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative rounded-lg shadow bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-white">
                                Reset Password
                            </h3>
                            <button onClick={() => { setHideReset(true) }} type="button" className="end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="oldUsername" className="block mb-2 text-sm font-medium text-white">Old Username</label>
                                    <input type="text" onBeforeInput={() => { clearErrors("formErrors") }} {...register("oldUsername", { required: true })} placeholder="Enter new Username" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" />
                                </div>
                                <div className='relative'>
                                    <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-white">Old Password</label>
                                    <input type={showPass ? "text" : "password"} onBeforeInput={() => { clearErrors("formErrors") }} {...register("oldPassword", { required: true })} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="Enter Old Password" />
                                    <span onClick={(e) => { e.preventDefault(); setShowPass(!showPass) }} className='absolute top-1/2 right-2 cursor-pointer'>
                                        {!showPass &&
                                            <lord-icon
                                                src="https://cdn.lordicon.com/fmjvulyw.json"
                                                trigger="hover"
                                                stroke="bold"
                                                state="hover-look-around"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        }
                                        {showPass &&
                                            <lord-icon
                                                src="https://cdn.lordicon.com/fmjvulyw.json"
                                                trigger="hover"
                                                stroke="bold"
                                                state="hover-cross"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <label htmlFor="newUsername" className="block mb-2 text-sm font-medium text-white">New Username</label>
                                    <input type="text" onBeforeInput={() => { clearErrors("formErrors") }} {...register("newUsername", { required: true })} placeholder="Enter new Username" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" />
                                </div>
                                <div className='relative'>
                                    <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-white">New Password</label>
                                    <input type={showPass ? "text" : "password"} onBeforeInput={() => { clearErrors("formErrors") }} {...register("newPassword", { required: true })} placeholder="Enter New Password" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" />
                                    <span onClick={(e) => { e.preventDefault(); setShowPass(!showPass) }} className='absolute top-1/2 right-2 cursor-pointer'>
                                        {!showPass &&
                                            <lord-icon
                                                src="https://cdn.lordicon.com/fmjvulyw.json"
                                                trigger="hover"
                                                stroke="bold"
                                                state="hover-look-around"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        }
                                        {showPass &&
                                            <lord-icon
                                                src="https://cdn.lordicon.com/fmjvulyw.json"
                                                trigger="hover"
                                                stroke="bold"
                                                state="hover-cross"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        }
                                    </span>
                                </div>
                                {errors.formErrors && <span className='text-red-600 font-bold'>{errors.formErrors.message}</span>}
                                {!isSubmitting &&

                                    <button className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Reset</button>
                                }
                                {isSubmitting &&

                                    <button disabled type="button" className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 inline-flex items-center justify-center">

                                        <svg role="status" className="inline w-4 h-4 me-3 animate-spin text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                        </svg>
                                        Resetting...
                                    </button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHeader
