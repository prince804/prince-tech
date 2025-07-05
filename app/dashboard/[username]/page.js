"use client";
import { useRouter } from "next-nprogress-bar";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "@/app/components/header";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  // ✅ Set username from cookie once
  useEffect(() => {
    const cookieUser = Cookies.get("username");
    if (cookieUser && /^[a-zA-Z0-9_-]{3,20}$/.test(cookieUser)) {
      setUsername(cookieUser);
    } else {
      toast.error("Invalid or Missing Username. Please login again.");
      router.push("/login");
    }
  }, []);

  if (!username) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="text-white text-center mt-10">
        <h1 className="text-3xl font-bold">Welcome, {username}</h1>
        <p className="mt-2 text-gray-400">You're in your private dashboard.</p>

        <div className="flex flex-wrap justify-center mt-10 gap-4">
          <Link
            href={`/dashboard/${username}/utmlinks`}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-800"
          >
            UTM Links
          </Link>
          <Link
            href={`/dashboard/${username}/utmgenerator`}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-800"
          >
            UTM Generator
          </Link>
          <Link
            href={`/dashboard/${username}/statistics`}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-800"
          >
            Statistics
          </Link>
          <Link
            href={`/dashboard/${username}/earnings`}
            className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-800 text-black"
          >
            Earnings
          </Link>
        </div>
      </div>
    </>
  );
}
