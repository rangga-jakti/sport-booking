'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function AdminBookingsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin')
  }, [])
  return null
}