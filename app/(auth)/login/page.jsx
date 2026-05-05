'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (error) { setError('Email atau password salah'); setLoading(false); return }
    router.push('/courts')
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F0F4F8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#16A34A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F1923]">Masuk ke SportBook</h1>
          <p className="text-[#64748B] text-sm mt-1">Selamat datang kembali!</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map((field) => (
              <div key={field.id}>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder}
                  value={form[field.id]} onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 rounded-full font-semibold text-sm disabled:opacity-50 mt-2">
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
          <p className="text-center text-sm text-[#64748B] mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#16A34A] font-semibold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  )
}