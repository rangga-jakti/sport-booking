'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@sportbook.com'
const TYPES = ['Futsal', 'Badminton', 'Basket', 'Tenis']
export default function AdminCourtsPage() {
  const router = useRouter()
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCourt, setEditCourt] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Futsal', price_per_hour: '', description: '', image_url: '', is_active: true })
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.email !== ADMIN_EMAIL) { router.push('/'); return }
      fetchCourts()
    }
    checkAuth()
  }, [])
  const fetchCourts = async () => {
    const { data } = await supabase.from('courts').select('*').order('created_at')
    setCourts(data || [])
    setLoading(false)
  }
  const resetForm = () => {
    setForm({ name: '', type: 'Futsal', price_per_hour: '', description: '', image_url: '', is_active: true })
    setEditCourt(null)
    setShowForm(false)
  }
  const handleEdit = (court) => {
    setForm({
      name: court.name,
      type: court.type,
      price_per_hour: court.price_per_hour,
      description: court.description,
      image_url: court.image_url,
      is_active: court.is_active,
    })
    setEditCourt(court)
    setShowForm(true)
  }
  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus lapangan ini?')) return
    await supabase.from('courts').delete().eq('id', id)
    fetchCourts()
  }
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = Math.random().toString(36).slice(2) + '.' + fileExt
    const filePath = 'courts/' + fileName
    const { error } = await supabase.storage.from('products').upload(filePath, file)
    if (error) { setUploading(false); alert('Gagal upload foto'); return }
    const { data } = supabase.storage.from('products').getPublicUrl(filePath)
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }))
    setUploading(false)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      type: form.type,
      price_per_hour: parseInt(form.price_per_hour),
      description: form.description,
      image_url: form.image_url,
      is_active: form.is_active,
    }
    if (editCourt) {
      await supabase.from('courts').update(payload).eq('id', editCourt.id)
    } else {
      await supabase.from('courts').insert(payload)
    }
    setSaving(false)
    resetForm()
    fetchCourts()
  }
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-[#64748B]">Loading...</div></div>
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F1923]">Kelola Lapangan</h1>
          <p className="text-[#64748B] text-sm mt-1">{courts.length} lapangan terdaftar</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/admin')} className="text-sm text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-full hover:border-[#16A34A] hover:text-[#16A34A] transition-colors">
            Dashboard
          </button>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm px-5 py-2 rounded-full font-medium">
            + Tambah Lapangan
          </button>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#0F1923] mb-6">{editCourt ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Nama Lapangan', type: 'text', placeholder: 'Lapangan Futsal A' },
                { id: 'price_per_hour', label: 'Harga per Jam (Rp)', type: 'number', placeholder: '100000' },
                { id: 'description', label: 'Deskripsi', type: 'text', placeholder: 'Deskripsi singkat lapangan' },
              ].map((field) => (
                <div key={field.id}>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">{field.label}</label>
                  <input type={field.type} required placeholder={field.placeholder}
                    value={form[field.id]} onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Jenis Lapangan</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white">
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Status</label>
                <div className="flex gap-3">
                  {[{ val: true, label: 'Aktif' }, { val: false, label: 'Nonaktif' }].map((opt) => (
                    <button key={opt.label} type="button" onClick={() => setForm({ ...form, is_active: opt.val })}
                      className={"flex-1 py-2.5 rounded-xl text-sm font-medium transition-all " + (form.is_active === opt.val ? "bg-[#16A34A] text-white" : "bg-white border border-[#E2E8F0] text-[#64748B]")}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">Foto Lapangan</label>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-4 text-center hover:border-[#16A34A] transition-colors">
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="court-photo" />
                  <label htmlFor="court-photo" className="cursor-pointer">
                    {uploading ? (
                      <div className="text-sm text-[#64748B]">Mengupload...</div>
                    ) : form.image_url ? (
                      <div>
                        <img src={form.image_url} alt="preview" className="w-full h-40 object-cover rounded-xl mb-2" />
                        <div className="text-xs text-[#16A34A]">Klik untuk ganti foto</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-3xl mb-2">📷</div>
                        <div className="text-sm text-[#64748B]">Klik untuk upload foto</div>
                        <div className="text-xs text-[#64748B] mt-1">JPG, PNG, WebP</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 border border-[#E2E8F0] text-[#64748B] py-3 rounded-full text-sm font-medium hover:border-red-300 hover:text-red-400 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving || uploading || !form.image_url} className="flex-1 btn-primary py-3 rounded-full text-sm font-semibold disabled:opacity-50">
                  {saving ? 'Menyimpan...' : editCourt ? 'Simpan Perubahan' : 'Tambah Lapangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {courts.map((court) => (
          <div key={court.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex gap-4 p-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F0F4F8] flex-shrink-0">
              <img src={court.image_url} alt={court.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-[#0F1923] text-sm">{court.name}</h3>
                <span className={"text-[10px] font-mono px-2 py-0.5 rounded-full " + (court.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                  {court.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{court.type}</p>
              <div className="font-bold text-[#16A34A] text-sm mt-1">{formatPrice(court.price_per_hour)}/jam</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(court)} className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-full hover:border-[#16A34A] hover:text-[#16A34A] transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(court.id)} className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}