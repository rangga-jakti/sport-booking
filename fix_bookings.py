import os
content = '''\'use client\'
import { useEffect } from \'react\'
import { useRouter } from \'next/navigation\'
export default function AdminBookingsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace(\'/admin\')
  }, [])
  return null
}'''
with open('app/admin/bookings/page.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
