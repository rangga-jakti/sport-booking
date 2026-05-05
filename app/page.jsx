import Link from 'next/link'
export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F1923] text-white">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1923]/95 via-[#0F1923]/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-28">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#16A34A]/20 border border-[#16A34A]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-[#16A34A] text-xs font-mono tracking-widest uppercase">Buka 06.00 - 23.00</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Booking Lapangan
              <br />
              <span className="text-[#16A34A]">Lebih Mudah</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Futsal, badminton, basket, tenis - semua bisa dipesan online.
              Pilih jadwal, bayar, dan mainkan!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courts" className="btn-primary px-8 py-4 rounded-full font-semibold text-sm">
                Lihat Lapangan
              </Link>
              <Link href="/my-bookings" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                Booking Saya
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Sport Types */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#0F1923] mb-8">Jenis Lapangan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Futsal', emoji: '⚽', desc: '2 lapangan tersedia' },
            { name: 'Badminton', emoji: '🏸', desc: '2 lapangan tersedia' },
            { name: 'Basket', emoji: '🏀', desc: '1 lapangan tersedia' },
            { name: 'Tenis', emoji: '🎾', desc: '1 lapangan tersedia' },
          ].map((sport) => (
            <Link key={sport.name} href={`/courts?type=${sport.name}`}
              className="card p-6 text-center group cursor-pointer">
              <div className="text-4xl mb-3">{sport.emoji}</div>
              <div className="font-semibold text-[#0F1923] group-hover:text-[#16A34A] transition-colors">{sport.name}</div>
              <div className="text-xs text-[#64748B] mt-1">{sport.desc}</div>
            </Link>
          ))}
        </div>
      </section>
      {/* How it works */}
      <section className="bg-white border-t border-[#E2E8F0] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#0F1923] mb-10 text-center">Cara Booking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pilih Lapangan', desc: 'Pilih jenis dan lapangan yang tersedia sesuai kebutuhan' },
              { step: '02', title: 'Tentukan Jadwal', desc: 'Pilih tanggal dan jam yang kosong, sesuai waktu mainmu' },
              { step: '03', title: 'Konfirmasi Booking', desc: 'Isi data diri dan konfirmasi - lapangan langsung tereservasi' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#16A34A] font-mono font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <div className="font-semibold text-[#0F1923] mb-1">{item.title}</div>
                  <div className="text-sm text-[#64748B] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
