'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import CourtCard from '@/components/CourtCard'
const types = ['Semua', 'Futsal', 'Badminton', 'Basket', 'Tenis']
export default function CourtsPage() {
  const [courts, setCourts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeType, setActiveType] = useState('Semua')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchCourts = async () => {
      const { data } = await supabase.from('courts').select('*').order('created_at')
      setCourts(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    fetchCourts()
  }, [])
  useEffect(() => {
    if (activeType === 'Semua') setFiltered(courts)
    else setFiltered(courts.filter((c) => c.type === activeType))
  }, [activeType, courts])
  const btnClass = (type) => type === activeType
    ? 'px-5 py-2.5 rounded-full text-sm font-medium bg-[#16A34A] text-white'
    : 'px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A] hover:text-[#16A34A]'
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F1923] mb-2">Pilih Lapangan</h1>
        <p className="text-[#64748B]">Temukan lapangan yang tersedia dan booking sekarang</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {types.map((type) => (
          <button key={type} onClick={() => setActiveType(type)} className={btnClass(type)}>
            {type}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-[#E2E8F0]" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-[#E2E8F0] rounded w-3/4" />
                <div className="h-3 bg-[#E2E8F0] rounded w-full" />
                <div className="h-3 bg-[#E2E8F0] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏟️</div>
          <h3 className="font-semibold text-[#0F1923] mb-2">Lapangan tidak ditemukan</h3>
          <p className="text-[#64748B] text-sm">Coba pilih jenis lapangan lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </div>
  )
}