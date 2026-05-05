'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const statusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'confirmed') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    if (status === 'done') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }
  const statusLabel = (status) => {
    if (status === 'pending') return 'Menunggu'
    if (status === 'confirmed') return 'Dikonfirmasi'
    if (status === 'rejected') return 'Ditolak'
    if (status === 'done') return 'Selesai'
    return status
  }
  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const { data } = await supabase
        .from('bookings')
        .select('*, courts(name, type, image_url)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    fetchBookings()
  }, [])
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 h-40" />
          ))}
        </div>
      </div>
    )
  }
  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-[#0F1923] mb-2">Belum Ada Booking</h2>
        <p className="text-[#64748B] mb-8">Yuk booking lapangan favoritmu!</p>
        <Link href="/courts" className="btn-primary px-8 py-3 rounded-full font-semibold text-sm inline-block">
          Lihat Lapangan
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0F1923] mb-8">Booking Saya</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="flex gap-4 p-5">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F0F4F8] flex-shrink-0">
                <img src={booking.courts.image_url} alt={booking.courts.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#0F1923]">{booking.courts.name}</h3>
                  <span className={"text-xs font-semibold px-3 py-1 rounded-full " + statusColor(booking.status)}>
                    {statusLabel(booking.status)}
                  </span>
                </div>
                <div className="text-sm text-[#64748B] mt-1">{formatDate(booking.booking_date)}</div>
                <div className="text-sm text-[#64748B]">{booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)} ({booking.duration} jam)</div>
                <div className="font-bold text-[#16A34A] mt-1">{formatPrice(booking.total_price)}</div>
              </div>
            </div>
            {booking.status === 'confirmed' && (
              <div className="border-t border-[#E2E8F0] px-5 py-3 bg-green-50">
                <p className="text-xs text-green-700 font-medium">✓ Booking dikonfirmasi - Selamat bermain!</p>
              </div>
            )}
            {booking.status === 'rejected' && (
              <div className="border-t border-[#E2E8F0] px-5 py-3 bg-red-50">
                <p className="text-xs text-red-600 font-medium">✕ Booking ditolak - Silakan pilih jadwal lain</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}