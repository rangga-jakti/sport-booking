'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@sportbook.com'
export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }
  const isAdmin = user?.email === ADMIN_EMAIL
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-bold text-[#0F1923] text-lg">SportBook</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/courts" className="text-sm text-[#64748B] hover:text-[#0F1923] transition-colors font-medium">Lapangan</Link>
          <Link href="/my-bookings" className="text-sm text-[#64748B] hover:text-[#0F1923] transition-colors font-medium">Booking Saya</Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm text-[#16A34A] hover:text-[#15803D] transition-colors font-semibold">Admin</Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#64748B] font-mono">{user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-sm text-[#16A34A] hover:text-[#15803D] font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#64748B] hover:text-[#0F1923] font-medium transition-colors">Login</Link>
              <Link href="/register" className="btn-primary text-sm px-4 py-2 rounded-full font-medium">Daftar</Link>
            </div>
          )}
        </div>
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={"block w-6 h-0.5 bg-[#0F1923] transition-all duration-300 " + (menuOpen ? "rotate-45 translate-y-2" : "")} />
          <span className={"block w-6 h-0.5 bg-[#0F1923] transition-all duration-300 " + (menuOpen ? "opacity-0" : "")} />
          <span className={"block w-6 h-0.5 bg-[#0F1923] transition-all duration-300 " + (menuOpen ? "-rotate-45 -translate-y-2" : "")} />
        </button>
      </div>
      <div className={"md:hidden transition-all duration-300 overflow-hidden " + (menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0")}>
        <div className="bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col gap-4">
          <Link href="/courts" className="text-sm font-medium text-[#64748B]" onClick={() => setMenuOpen(false)}>Lapangan</Link>
          <Link href="/my-bookings" className="text-sm font-medium text-[#64748B]" onClick={() => setMenuOpen(false)}>Booking Saya</Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-semibold text-[#16A34A]" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-sm text-[#16A34A] font-medium text-left">Logout</button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[#64748B]" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="text-sm font-medium text-[#16A34A]" onClick={() => setMenuOpen(false)}>Daftar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}