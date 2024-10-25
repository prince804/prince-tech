"use client"
import Header from '@/app/components/header';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React from 'react'
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [username, setUsername] = useState('');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalRPM, setTotalRPM] = useState(0);
    const [maxRevenue, setMaxRevenue] = useState(0.0);
    const [maxRPM, setMaxRPM] = useState(0);
    const [dataLegth, setDataLegth] = useState(0);
    const [campaignData, setCampaignData] = useState([]);
    const utm = username;

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
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg text-white font-medium title-font mb-2">UTM Links</h2>
                                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
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
                                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
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
                                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
