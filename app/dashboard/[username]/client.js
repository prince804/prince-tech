'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function ClientComponent({ username }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const utm = searchParams.get('utm_campaign')
    if (utm !== username) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('utm_campaign', username)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [username, pathname, searchParams, router])

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold">Welcome, {username}</h1>
      <p>UTM fixed dynamically via Client Component 🚀</p>
    </div>
  )
}
