'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
const HOURS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
function BookForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courtId = searchParams.get('court')
  const [court, setCourt] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    booking_date: '',
    start_time: '',
    duration: 1,
    notes: '',
  })
  useEffect(() => {
    if (!courtId) { router.push('/courts'); return }
    const fetchCourt = async () => {
      const { data } = await supabase.from('courts').select('*').eq('id', courtId).single()
      setCourt(data)
      setLoading(false)
    }
    fetchCourt()
  }, [courtId])
  useEffect(() => {
    if (!courtId || !form.booking_date) return
    const fetchBooked = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('court_id', courtId)
        .eq('booking_date', form.booking_date)
        .neq('status', 'rejected')
      setBookedSlots(data || [])
    }
    fetchBooked()
  }, [courtId, form.booking_date])
  const isSlotBooked = (hour) => {
    return bookedSlots.some((slot) => {
      const start = slot.start_time.slice(0, 5)
      const end = slot.end_time.slice(0, 5)
      return hour >= start && hour < end
    })
  }
  const getEndTime = () => {
    if (!form.start_time) return ''
    const [h, m] = form.start_time.split(':').map(Number)
    const end = h + form.duration
    return end.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0')
  }
  const getTotalPrice = () => {
    if (!court) return 0
    return court.price_per_hour * form.duration
  }
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const endTime = getEndTime()
    const { error } = await supabase.from('bookings').insert({
      court_id: courtId,
      user_id: session.user.id,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      booking_date: form.booking_date,
      start_time: form.start_time,
      end_time: endTime,
      duration: form.duration,
      total_price: getTotalPrice(),
      notes: form.notes,
      status: 'pending',
    })
    if (error) { setSubmitting(false); alert('Gagal booking, coba lagi'); return }
    setSuccess(true)
    setSubmitting(false)
  }
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-[#64748B]">Loading...</div></div>
  if (success) {
    const waMessage = encodeURIComponent("Halo, saya " + form.customer_name + " ingin konfirmasi booking " + court?.name + " pada " + form.booking_date + " jam " + form.start_time + " - " + getEndTime() + ". Total: " + formatPrice(getTotalPrice()))
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-[#0F1923] mb-2">Booking Berhasil!</h2>
        <p className="text-[#64748B] mb-2">Booking kamu sedang menunggu konfirmasi admin.</p>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm"><span className="text-[#64748B]">Lapangan</span><span className="font-semibold">{court?.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#64748B]">Tanggal</span><span className="font-semibold">{form.booking_date}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#64748B]">Jam</span><span className="font-semibold">{form.start_time} - {getEndTime()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#64748B]">Total</span><span className="font-bold text-[#16A34A]">{formatPrice(getTotalPrice())}</span></div>
        </div>
        <div className="flex flex-col gap-3">
          <a href={"https://wa.me/6281234567890?" + "text=" + waMessage} target="_blank" rel="noreferrer"
            className="btn-primary px-6 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2">
            <span>💬</span> Konfirmasi via WhatsApp
          </a>
          <button onClick={() => router.push('/my-bookings')} className="text-sm text-[#64748B] hover:text-[#0F1923] transition-colors">
            Lihat Booking Saya
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0F1923] mb-2">Booking Lapangan</h1>
      {court && <p className="text-[#64748B] mb-8">{court.name} · {formatPrice(court.price_per_hour)}/jam</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { id: 'customer_name', label: 'Nama Lengkap', type: 'text', placeholder: 'Budi Santoso' },
          { id: 'customer_phone', label: 'No. WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx' },
        ].map((field) => (
          <div key={field.id}>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">{field.label}</label>
            <input type={field.type} required placeholder={field.placeholder}
              value={form[field.id]} onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white" />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Tanggal</label>
          <input type="date" required min={new Date().toISOString().split('T')[0]}
            value={form.booking_date} onChange={(e) => setForm({ ...form, booking_date: e.target.value, start_time: '' })}
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white" />
        </div>
        {form.booking_date && (
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Jam Mulai</label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {HOURS.map((hour) => {
                const booked = isSlotBooked(hour)
                const selected = form.start_time === hour
                return (
                  <button key={hour} type="button"
                    disabled={booked}
                    onClick={() => setForm({ ...form, start_time: hour })}
                    className={"py-2 rounded-xl text-xs font-medium transition-all " + (booked ? "bg-red-100 text-red-400 cursor-not-allowed" : selected ? "bg-[#16A34A] text-white" : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A]")}>
                    {hour}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3 mt-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#16A34A] inline-block" /> Dipilih</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Terisi</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-[#E2E8F0] inline-block" /> Tersedia</span>
            </div>
          </div>
        )}
        {form.start_time && (
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Durasi</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((d) => (
                <button key={d} type="button" onClick={() => setForm({ ...form, duration: d })}
                  className={"flex-1 py-3 rounded-xl text-sm font-medium transition-all " + (form.duration === d ? "bg-[#16A34A] text-white" : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A]")}>
                  {d} Jam
                </button>
              ))}
            </div>
            <p className="text-xs text-[#64748B] mt-2">Selesai: {getEndTime()}</p>
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Catatan (opsional)</label>
          <textarea placeholder="Jumlah pemain, kebutuhan khusus, dll..."
            rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white resize-none" />
        </div>
        {form.start_time && court && (
          <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-2xl p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#64748B]">{court.name}</span>
              <span className="font-semibold">{formatPrice(court.price_per_hour)} x {form.duration} jam</span>
            </div>
            <div className="flex justify-between font-bold text-[#16A34A]">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        )}
        <button type="submit" disabled={submitting || !form.start_time || !form.booking_date}
          className="btn-primary w-full py-4 rounded-full font-semibold text-sm disabled:opacity-50">
          {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
        </button>
      </form>
    </div>
  )
}
export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-[#64748B]">Loading...</div></div>}>
      <BookForm />
    </Suspense>
  )
}