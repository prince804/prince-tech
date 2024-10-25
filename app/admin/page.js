"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Admin = () => {
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
        const req = await fetch("/api/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const res = await req.json();
        if (req.ok) {
            toast('Signed In Successfully!', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            router.push(`/admin/adminpanel`);
        } else {
            console.log(res.error);
            setError("formErrors", { message: res.error })
        }
    }

    return (
        <section className="bg-gray-900 h-screen flex">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Sign in to Admin account
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Admin Username</label>
                                <input onBeforeInput={() => { clearErrors("formErrors") }} type="text" {...register("username", { required: true })} className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Username" />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Admin Password</label>
                                <input onBeforeInput={() => { clearErrors("formErrors") }} type={showPass ? "text" : "password"} {...register("password", { required: true })} placeholder="••••••••" className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
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

                                <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#2563eb] hover:bg-[#1d4ed8] focus:ring-[#1e40af]">Sign in</button>
                            }
                            {isSubmitting &&

                                <button disabled type="button" className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 inline-flex items-center justify-center">

                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 animate-spin text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                    </svg>
                                    Signing In...
                                </button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Admin

