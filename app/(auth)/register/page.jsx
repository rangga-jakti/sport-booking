'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Password tidak cocok'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#F0F4F8]">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-[#0F1923] mb-2">Cek Email Kamu!</h2>
          <p className="text-[#64748B] mb-6">Kami kirim link konfirmasi ke <strong>{form.email}</strong>.</p>
          <Link href="/login" className="btn-primary px-8 py-3 rounded-full font-semibold text-sm inline-block">
            Ke Halaman Login
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F0F4F8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#16A34A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F1923]">Daftar ke SportBook</h1>
          <p className="text-[#64748B] text-sm mt-1">Buat akun dan mulai booking sekarang!</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com' },
              { id: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 karakter' },
              { id: 'confirm', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password' },
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
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>
          <p className="text-center text-sm text-[#64748B] mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#16A34A] font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}