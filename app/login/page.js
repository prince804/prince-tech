"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Header from '../components/header'
import { toast } from 'react-toastify'

const Login = () => {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (data) => {
        data.username = data.username.toLowerCase()
        const req = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const res = await req.json();
        if (req.ok) {
            toast('Logged In Successfully!', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            router.push(`/dashboard/${res.username}`); // Redirect to the dashboard and adding username to the url
        } else {
            console.log(res.error);
            setError("formErrors", { message: res.error })
        }
    }

    return (
        <>
            <Header />
            <section className="text-gray-400 bg-gray-900 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                        <h1 className="title-font font-medium text-3xl text-white">Better Solution For Your Social Media Traffic</h1>
                        <p className="leading-relaxed mt-4">Social Media Traffic
                            A technology-first publisher specializing in entertainment, looking to partner with affiliates to drive traffic to our websites</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="lg:w-2/6 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-white text-lg font-medium title-font mb-5">Sign In</h2>
                        <div className="relative mb-4">
                            <label htmlFor="username" className="leading-7 text-sm text-gray-400">Username</label>
                            <input onBeforeInput={() => { clearErrors("formErrors") }} type="text" {...register("username", { required: true })} className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-blue-900 rounded border border-gray-600 focus:border-blue-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-400">Password</label>
                            <input onBeforeInput={() => { clearErrors("formErrors") }} type={showPass ? "text" : "password"} {...register("password", { required: true })} className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-blue-900 rounded border border-gray-600 focus:border-blue-500 text-base outline-none text-gray-100 py-1 pl-3 pr-10 leading-8 transition-colors duration-200 ease-in-out" />
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

                            <button className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">Log In</button>
                        }
                        {isSubmitting &&

                            <button disabled type="button" className="py-2 px-5 text-lg font-medium rounded border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 inline-flex items-center justify-center">

                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 animate-spin text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                </svg>
                                Logging In...
                            </button>
                        }
                        <p className="text-xs mt-3">We are no longer offering <b>Self Registration</b>. If you would like an account, please email us at:
                            <a className='font-bold mx-1' href="mailto:cnstatus310@gmail.com">cnstatus310@gmail.com</a></p>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login

