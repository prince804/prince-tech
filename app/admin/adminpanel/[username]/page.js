"use client"
import React from 'react'
import AdminHeader from '@/app/components/adminheader'
import { useState, useEffect } from 'react';

const UserStats = ({ params }) => {
    const [username, setUsername] = useState('');
    const [utmData, setUtmData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataFound, setDataFound] = useState(true)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [campaignData, setCampaignData] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [updatingPayments, setupdatingPayments] = useState(false);
    const utm = username; // Replace with actual UTM source value

    // Utility function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        setUsername(params.username);
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        setStartDate(formatDate(thirtyDaysAgo)); // Default start date (30 days ago)
        setEndDate(formatDate(today));           // Default end date (today)
    }, []);

    useEffect(() => {
        fetchUtmData();
        if (username != "") {
            getPaymentsData(username);
            freshData();
        }
    }, [utm]);

    const getPaymentsData = async (username) => {
        // console.log("Fetching Payments Details....")
        setPaymentsLoading(true);
        const response = await fetch('/api/userPayments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        }).catch((error) => console.error('Error fetching data:', error));
        const data = await response.json();
        setPaymentsLoading(false);
        setCampaignData(data);
        // console.log(data);
    }

    const updatePayments = async (id) => {
        setupdatingPayments(true);
        const response = await fetch('/api/updateUserPayments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, id: id }),
        })
        if (response.ok) {
            const data = await response.json();
            setCampaignData(data);
        } else {
            setCampaignData([]);
        }
        setupdatingPayments(false);
    }

    const freshData = async () => {
        const response = await fetch(`/api/updatePayments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        })
        const payments = await response.json();
        const send = await fetch(`/api/refreshData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, payments: payments }),
        })
        const data = await send.json();
        console.log(data.message);
    }

    const fetchUtmData = async () => {
        setDataLoading(true)
        const response = await fetch('/api/utmdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ utm: utm, startDate: startDate, endDate: endDate }),
        });
        const data = await response.json();
        if (data.length <= 0) {
            setDataFound(false);
            setUtmData([]);
        } else {
            setDataFound(true);
            setUtmData(data);
        }
        setDataLoading(false)
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

    // Handle the API call when the user clicks "Apply Date Range"
    const applyDateRange = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end date.");
            return;
        }
        fetchUtmData();
    }
    let totalRevenue = 0;
    let totalRPM = 0;
    let totalUsers = 0;

    for (let i = 0; i < utmData.length; i++) {
        const campaign = utmData[i];
        totalRevenue += Number(campaign.revenue);
        totalRPM += Number(campaign.rpm);
        totalUsers += Number(campaign.users);
    }
    return (
        <>
            <AdminHeader />
            {/* Payments */}

            <h1 className='font-bold text-5xl text-white text-center m-4'>{username} Payments</h1>
            <div className="w-[80vw] mx-auto mt-4 relative shadow-md sm:rounded-lg">
                <div className="relative overflow-auto shadow-md sm:rounded-lg max-h-[70vh]">
                    <table className="w-full text-sm text-center rtl:text-right text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400 sticky top-0">
                            <tr>
                                <th scope="col" className="px-2 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Duration
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Total Earnings
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Final Earnings
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Profit
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsLoading &&
                                <tr className="text-center border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                    <td colSpan={"7"} className="px-6 py-4">
                                        <div className="w-full flex justify-center items-center">
                                            <svg aria-hidden="true" className="w-10 h-10 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {campaignData?.payments?.length > 0 && campaignData.payments.map((item, index) => {
                                return (
                                    <tr key={index} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                                            1
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.dateRange}({item.month})
                                        </td>
                                        <td className="px-6 py-4">
                                            ${item.revenue.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${(item.revenue - ((campaignData.commission / 100) * item.revenue)).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${(campaignData.commission / 100 * item.revenue).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.isPaid &&
                                                <div className='flex items-center justify-center gap-2'>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/lomfljuq.json"
                                                        trigger="hover"
                                                        colors="primary:#22c553"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                    Paid
                                                </div>
                                            }
                                            {!item.isPaid &&
                                                <div className='flex items-center justify-center gap-2'>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/zxvuvcnc.json"
                                                        trigger="hover"
                                                        colors="primary:#dc2626"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                    Pending
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {updatingPayments &&
                                                <button disabled type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1 text-center inline-flex items-center justify-center">
                                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 animate-spin text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                                    </svg>
                                                </button>
                                            }
                                            {!updatingPayments &&
                                                <button onClick={() => { updatePayments(item._id) }} disabled={item.isPaid} className={`text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1 text-center ${item.isPaid ? "bg-gray-900" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"}`}>
                                                    {item.isPaid ? "Paid" : "Mark as Paid"}
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot className='sticky bottom-0 bg-gray-900'>
                            {campaignData?.payments?.length > 0 &&
                                <tr className="font-semibold text-white">
                                    <th colSpan={2} scope="row" className="px-6 py-3 text-base">Total</th>
                                    <td className="px-6 py-3">
                                        {/* Total Earnings */}
                                        ${(campaignData.payments.reduce((total, item) => total + Number(item.revenue), 0)).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        {/* Final Earnings */}
                                        ${(campaignData.payments.reduce((total, item) => total + (item.revenue - campaignData.commission / 100 * item.revenue), 0)).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        {/* Profit */}
                                        ${(campaignData.payments.reduce((total, item) => total + (campaignData.commission / 100 * item.revenue), 0)).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        {/* Total Pending */}
                                        Total Pending: ${(campaignData.currentRevenue - (campaignData.commission / 100 * campaignData.currentRevenue)).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        Total Paid: ${((campaignData.payments.reduce((total, item) => total + (item.revenue - campaignData.commission / 100 * item.revenue), 0)) - (campaignData.currentRevenue - (campaignData.commission / 100 * campaignData.currentRevenue))).toFixed(2)}
                                    </td>
                                </tr>
                            }
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Statistics */}
            <h1 className='font-bold text-5xl text-white text-center m-4'>{username} Statistics</h1>
            <div className="w-[80vw] mx-auto mt-4 relative shadow-md sm:rounded-lg">
                <div className='flex items-center justify-between flex-wrap gap-2 mb-4'>
                    <div className="flex items-center flex-wrap gap-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="cursor-text border text-sm rounded-lg block w-full ps-10 p-2.5 bg-gray-700 border-gray-60 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <span className="mx-4 text-gray-500">to</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type='date' className="cursor-text border text-sm rounded-lg block w-full ps-10 p-2.5 bg-gray-700 border-gray-60 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <button onClick={applyDateRange} className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
                        Apply Date Range
                    </button>
                </div>

                <div className="relative overflow-auto shadow-md sm:rounded-lg max-h-[70vh]">
                    <table className="w-full text-sm text-center rtl:text-right text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400 sticky top-0">
                            <tr>
                                <th scope="col" className="px-2 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Campaign Name
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Total Revenue
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Profit(-20%)
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Final Revenue
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    RPM
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Active Users
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataLoading &&
                                <tr className="text-center border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                    <td colSpan={"7"} className="px-6 py-4">
                                        <div className="w-full flex justify-center items-center">
                                            <svg aria-hidden="true" className="w-10 h-10 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {!dataFound &&
                                <tr className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                    <th colSpan={"5"} scope="row" className="px-6 py-4 font-medium text-center whitespace-nowrap text-white">
                                        No Data Available Yet!
                                    </th>
                                </tr>
                            }
                            {utmData.length > 0 && utmData.map((item, index) => {
                                return (
                                    <tr key={index} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.campaign}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${item.revenue}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${((campaignData.commission / 100) * item.revenue).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${(item.revenue - ((campaignData.commission / 100) * item.revenue)).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${item.rpm}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.users}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot className='sticky bottom-0 bg-gray-900'>
                            <tr className="font-semibold text-white">
                                <th colSpan={"2"} scope="row" className="px-6 py-3 text-base">Total</th>
                                <td className="px-6 py-3">${totalRevenue.toFixed(2)}</td>
                                <td className="px-6 py-3">${((campaignData.commission / 100) * totalRevenue).toFixed(2)}</td>
                                <td className="px-6 py-3">${(totalRevenue - ((campaignData.commission / 100) * totalRevenue)).toFixed(2)}</td>
                                <td className="px-6 py-3">${(totalRPM / utmData.length).toFixed(2)}</td>
                                <td className="px-6 py-3">{totalUsers}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    )
}

export default UserStats
