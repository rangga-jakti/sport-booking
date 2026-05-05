import './globals.css'
import Navbar from '@/components/Navbar'
export const metadata = {
  title: 'SportBook - Booking Lapangan Olahraga',
  description: 'Booking lapangan futsal, badminton, basket, dan tenis dengan mudah.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
