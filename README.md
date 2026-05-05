# SportBook - Booking Lapangan Olahraga
Full-stack sports court booking system built with Next.js and Supabase.
## Live Demo
https://sport-booking-azure.vercel.app
## Features
- Browse lapangan berdasarkan jenis olahraga
- Kalender availabilitas real-time
- Booking dengan pilihan jam dan durasi
- Riwayat booking untuk user
- Admin dashboard - konfirmasi/tolak booking
- Kelola lapangan (tambah, edit, hapus, upload foto)
- Notifikasi WhatsApp otomatis setelah booking
- Role-based access (admin vs user)
## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
## Getting Started
`ash
npm install
npm run dev
`
## Environment Variables
`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
`
## License
MIT - free to use for personal and commercial projects.
