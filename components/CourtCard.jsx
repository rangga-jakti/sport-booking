'use client'
import Link from 'next/link'
export default function CourtCard({ court }) {
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const typeEmoji = (type) => {
    if (type === 'Futsal') return '⚽'
    if (type === 'Badminton') return '🏸'
    if (type === 'Basket') return '🏀'
    if (type === 'Tenis') return '🎾'
    return '🏟️'
  }
  return (
    <div className="card overflow-hidden group">
      <div className="aspect-[4/3] overflow-hidden bg-[#F0F4F8] relative">
        <img
          src={court.image_url}
          alt={court.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
          <span>{typeEmoji(court.type)}</span>
          <span className="text-xs font-semibold text-[#0F1923]">{court.type}</span>
        </div>
        {!court.is_active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-4 py-2 rounded-full">Tidak Tersedia</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#0F1923] text-lg mb-1">{court.name}</h3>
        <p className="text-sm text-[#64748B] leading-relaxed mb-4 line-clamp-2">{court.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-[#16A34A] text-lg">{formatPrice(court.price_per_hour)}</span>
            <span className="text-xs text-[#64748B]">/jam</span>
          </div>
          {court.is_active ? (
            <Link href={"/book?court=" + court.id}
              className="btn-primary text-sm px-5 py-2.5 rounded-full font-semibold">
              Booking
            </Link>
          ) : (
            <span className="text-xs text-red-400 font-medium">Tidak tersedia</span>
          )}
        </div>
      </div>
    </div>
  )
}