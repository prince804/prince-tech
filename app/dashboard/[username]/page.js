"use client"
import { useRouter } from 'next/navigation'
import Header from '@/app/components/header';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React from 'react'
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

export default function Dashboard() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalRPM, setTotalRPM] = useState(0);
    const [maxRevenue, setMaxRevenue] = useState(0.0);
    const [maxRPM, setMaxRPM] = useState(0);
    const [dataLegth, setDataLegth] = useState(0);
    const [campaignData, setCampaignData] = useState([]);
    const [hideReset, setHideReset] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const utm = username;

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm()

    // Utility function to format date as YYYY-MM-DD
    const firstDateofMonth = () => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // 1st of the current month
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        // Get the username from cookies after the component has mounted
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        setTotalRevenue(Number(localStorage.getItem("totalRevenue")));
        setTotalRPM(Number(localStorage.getItem("totalRPM")));
        setMaxRevenue(Number(localStorage.getItem("MaxRevenue")));
        setMaxRPM(Number(localStorage.getItem("MaxRPM")));
        setDataLegth(Number(localStorage.getItem("dataLength")));
    }, []);

    useEffect(() => {
        fetchUtmData();
        if (username != "") {
            getPaymentsData(username);
        }
    }, [utm]);
    useEffect(() => {
        if (totalRevenue != 0) {
            localStorage.setItem("totalRevenue", totalRevenue);
            localStorage.setItem("totalRPM", totalRPM);
            localStorage.setItem("MaxRevenue", maxRevenue);
            localStorage.setItem("MaxRPM", maxRPM);
            localStorage.setItem("dataLength", dataLegth);
        }
    }, [totalRevenue, totalRPM, maxRevenue, maxRPM, dataLegth])

    const getPaymentsData = async (username) => {
        // console.log("Fetching Payments Details....")
        const response = await fetch('/api/userPayments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        }).catch((error) => console.error('Error fetching data:', error));
        const data = await response.json();
        setCampaignData(data);
    }

    const fetchUtmData = async () => {
        const response = await fetch('/api/utmdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ utm: utm, startDate: firstDateofMonth(), endDate: "today" }),
        });
        const data = await response.json();
        setDataLegth(data.length);
        if (data.length > 0) {
            setTotalRevenue(await data.reduce((total, campaign) => total + Number(campaign.revenue), 0));
            setTotalRPM(await data.reduce((total, campaign) => total + Number(campaign.rpm), 0));
            setMaxRevenue(await data.reduce((max, campaign) => Math.max(max, Number(campaign.revenue)), 0));
            setMaxRPM(await data.reduce((max, campaign) => Math.max(max, Number(campaign.rpm)), 0));
        } else {
            setTotalRevenue(0);
            setTotalRPM(0);
            setMaxRevenue(0);
            setMaxRPM(0);
        }
    };

    const onSubmit = async (data) => {
        data.oldUsername = data.oldUsername.toLowerCase();
        const req = await fetch("/api/resetuserpass", {
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
        }
    }

    // Conditionally render the content once the username is set
    if (!username) {
        return <div role="status" className="w-screen h-screen flex justify-center items-center">
            <svg aria-hidden="true" className="inline w-20 h-20 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
        </div>
    }

    return (
        <>
            <Header />
            <section className="text-gray-400 body-font bg-gray-900">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap w-full mb-10 flex-col items-center text-center">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">Wellcome to Dashboard {username}</h1>
                        <p className="lg:w-1/2 w-full leading-relaxed text-opacity-80">This is your currect Month Progress</p>
                    </div>
                    <div className="container px-5 py-2 mx-auto">
                        <div className="flex flex-wrap -m-4 text-center">
                            <div className="p-4 sm:w-1/4 w-1/2">
                                <h2 className="title-font font-medium sm:text-4xl text-3xl text-white">${(totalRevenue - ((campaignData.commission / 100) * totalRevenue)).toFixed(2)}</h2>
                                <p className="leading-relaxed">Revenue</p>
                            </div>
                            <div className="p-4 sm:w-1/4 w-1/2">
                                <h2 className="title-font font-medium sm:text-4xl text-3xl text-white">${(maxRevenue - campaignData.commission / 100 * maxRevenue).toFixed(2)}</h2>
                                <p className="leading-relaxed">Best Campaign</p>
                            </div>
                            <div className="p-4 sm:w-1/4 w-1/2">
                                <h2 className="title-font font-medium sm:text-4xl text-3xl text-white">${(totalRPM / dataLegth).toFixed(2)}</h2>
                                <p className="leading-relaxed">Average RPM</p>
                            </div>
                            <div className="p-4 sm:w-1/4 w-1/2">
                                <h2 className="title-font font-medium sm:text-4xl text-3xl text-white">${maxRPM}</h2>
                                <p className="leading-relaxed">Best RPM</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        <Link href={`/dashboard/${username}/utmlinks`} className="xl:w-1/3 md:w-1/2 p-4">
                            <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
                                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-blue-400 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5694e0"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" /></svg>
                                </div>
                                <h2 className="text-lg text-white font-medium title-font mb-2">UTM Links</h2>
                                <p className="leading-relaxed text-base">Here you can find Links to use in your Social Media handlers.</p>
                            </div>
                        </Link>
                        <Link href={`/dashboard/${username}/utmgenerator`} className="xl:w-1/3 md:w-1/2 p-4">
                            <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
                                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-blue-400 mb-4">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                        <circle cx="6" cy="6" r="3"></circle>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg text-white font-medium title-font mb-2">UTM Generator</h2>
                                <p className="leading-relaxed text-base">Here you can add Utm Parameters to other Links.</p>
                            </div>
                        </Link>
                        <Link href={`/dashboard/${username}/statistics`} className="xl:w-1/3 md:w-1/2 p-4">
                            <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
                                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-blue-400 mb-4">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <h2 className="text-lg text-white font-medium title-font mb-2">Statistics</h2>
                                <p className="leading-relaxed text-base">Here you can analyze your Progress, Stats and Reports.</p>
                            </div>
                        </Link>
                        <Link href={`/dashboard/${username}/earnings`} className="xl:w-1/3 md:w-1/2 p-4">
                            <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
                                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-blue-400 mb-4">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg text-white font-medium title-font mb-2">Earnings</h2>
                                <p className="leading-relaxed text-base">Here you can find details of your hard earned money.</p>
                            </div>
                        </Link>
                        <span onClick={() => { setHideReset(false) }} className="xl:w-1/3 md:w-1/2 p-4 cursor-pointer">
                            <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
                                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-blue-400 mb-4">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg text-white font-medium title-font mb-2">Reset Password?</h2>
                                <p className="leading-relaxed text-base">Reset your password for your account security.</p>
                            </div>
                        </span>
                    </div>
                </div>
            </section>
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

                                <div className='relative'>
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-white">Confirm Password</label>
                                    <input type={showPass ? "text" : "password"} onBeforeInput={() => { clearErrors("formErrors") }} {...register("confirmPassword", { required: true })} placeholder="Confirm New Password" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" />
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
