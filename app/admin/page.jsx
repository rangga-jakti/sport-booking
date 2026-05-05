'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@sportbook.com'
export default function AdminPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, done: 0 })
  const [filterStatus, setFilterStatus] = useState('all')
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (session.user.email !== ADMIN_EMAIL) { router.push('/'); return }
      setAuthorized(true)
      fetchBookings()
    }
    checkAuth()
  }, [])
  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, courts(name, type)')
      .order('created_at', { ascending: false })
    const bookings = data || []
    setBookings(bookings)
    setStats({
      total: bookings.reduce((acc, b) => acc + b.total_price, 0),
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      done: bookings.filter((b) => b.status === 'done').length,
    })
    setLoading(false)
  }
  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }
  const filtered = filterStatus === 'all' ? bookings : bookings.filter((b) => b.status === filterStatus)
  const filterBtnClass = (s) => s === filterStatus
    ? 'px-4 py-1.5 rounded-full text-xs font-medium bg-[#16A34A] text-white'
    : 'px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A]'
  if (!authorized || loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-[#64748B]">Loading...</div></div>
  }
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F1923]">Admin Dashboard</h1>
          <p className="text-[#64748B] text-sm mt-1">Kelola semua booking lapangan</p>
        </div>
        <button onClick={() => router.push('/admin/courts')}
          className="btn-primary text-sm px-5 py-2 rounded-full font-medium">
          Kelola Lapangan
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.total), color: 'text-[#16A34A]' },
          { label: 'Menunggu', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Dikonfirmasi', value: stats.confirmed, color: 'text-green-600' },
          { label: 'Selesai', value: stats.done, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className={"text-2xl font-bold " + s.color}>{s.value}</div>
            <div className="text-xs text-[#64748B] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'pending', 'confirmed', 'done', 'rejected'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={filterBtnClass(s)}>
            {s === 'all' ? 'Semua' : statusLabel(s)}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="font-semibold text-[#0F1923]">Belum ada booking</h3>
          </div>
        ) : filtered.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-[#0F1923]">{booking.courts.name}</div>
                <div className="text-xs font-mono text-[#64748B] mt-0.5">#{booking.id.slice(0,8).toUpperCase()}</div>
              </div>
              <span className={"text-xs font-semibold px-3 py-1 rounded-full " + statusColor(booking.status)}>
                {statusLabel(booking.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Nama', value: booking.customer_name },
                { label: 'No. HP', value: booking.customer_phone },
                { label: 'Tanggal', value: formatDate(booking.booking_date) },
                { label: 'Jam', value: booking.start_time.slice(0,5) + ' - ' + booking.end_time.slice(0,5) },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs text-[#64748B]">{item.label}</div>
                  <div className="text-sm font-semibold text-[#0F1923]">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#16A34A]">{formatPrice(booking.total_price)}</span>
              <div className="flex gap-2">
                {booking.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(booking.id, 'confirmed')}
                      className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-600 transition-colors">
                      Konfirmasi
                    </button>
                    <button onClick={() => updateStatus(booking.id, 'rejected')}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-red-600 transition-colors">
                      Tolak
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button onClick={() => updateStatus(booking.id, 'done')}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-blue-600 transition-colors">
                    Selesai
                  </button>
                )}
                {(booking.status === 'done' || booking.status === 'rejected') && (
                  <span className="text-xs text-[#64748B] font-medium">Tidak ada aksi</span>
                )}
                <a href={"https://wa.me/" + booking.customer_phone.replace(/^0/, '62')}
                  target="_blank" rel="noreferrer"
                  className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity">
                  WA
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}