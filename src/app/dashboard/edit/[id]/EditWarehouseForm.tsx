'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Upload, X, CheckCircle, Loader2, ArrowLeft,
  ImageIcon, AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PROVINCES = ['กรุงเทพฯ', 'ปทุมธานี', 'สมุทรปราการ', 'ชลบุรี', 'นนทบุรี', 'ระยอง', 'ฉะเชิงเทรา', 'สมุทรสาคร', 'นครปฐม', 'อื่นๆ']
const TYPES = ['ทั่วไป', 'ควบคุมอุณหภูมิ', 'ขนาดใหญ่', 'Bonded']

interface ImageFile { file?: File; preview: string; uploading: boolean; url?: string; error?: string }

interface WarehouseRow {
  id: string
  name: string
  location: string
  province: string
  area: number
  price_per_month: number
  type: string
  available: boolean
  ceiling_height: number | null
  loading_docks: number | null
  has_sprinkler: boolean
  has_forklift: boolean
  has_security: boolean
  has_cctv: boolean
  min_rent_months: number
  owner_name: string | null
  owner_phone: string | null
  description: string | null
  images: string[] | null
}

export default function EditWarehouseForm({ warehouse: w, userId }: { warehouse: WarehouseRow; userId: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pre-populate images from existing URLs
  const [images, setImages] = useState<ImageFile[]>(
    (w.images ?? []).map(url => ({ preview: url, url, uploading: false }))
  )

  const [form, setForm] = useState({
    name: w.name ?? '',
    location: w.location ?? '',
    province: w.province ?? 'กรุงเทพฯ',
    area: String(w.area ?? ''),
    price: String(w.price_per_month ?? ''),
    type: w.type ?? 'ทั่วไป',
    ceilingH: String(w.ceiling_height ?? ''),
    docks: String(w.loading_docks ?? ''),
    minMonths: String(w.min_rent_months ?? '1'),
    forklift: w.has_forklift ?? false,
    sprinkler: w.has_sprinkler ?? false,
    cctv: w.has_cctv ?? true,
    security: w.has_security ?? true,
    desc: w.description ?? '',
    ownerName: w.owner_name ?? '',
    ownerPhone: w.owner_phone ?? '',
    available: w.available ?? true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function setF(k: string, v: string | boolean) { setForm(p => ({ ...p, [k]: v })) }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newImgs: ImageFile[] = files.slice(0, 10 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }))
    setImages(prev => [...prev, ...newImgs])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(i: number) {
    setImages(prev => {
      const img = prev[i]
      if (img.file) URL.revokeObjectURL(img.preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  async function uploadImage(img: ImageFile, supabase: ReturnType<typeof createClient>): Promise<string> {
    if (!img.file) return img.url!
    const ext = img.file.name.split('.').pop()
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('warehouse-images')
      .upload(path, img.file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('warehouse-images').getPublicUrl(data.path)
    return publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.area || !form.price) { setError('กรุณากรอกข้อมูลที่จำเป็น'); return }
    setSubmitting(true); setError('')

    const supabase = createClient()

    // Upload only new images (those with a file object); keep existing URLs as-is
    const imageUrls: string[] = []
    for (let i = 0; i < images.length; i++) {
      if (!images[i].file) {
        imageUrls.push(images[i].url!)
        continue
      }
      setImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: true } : img))
      try {
        const url = await uploadImage(images[i], supabase)
        imageUrls.push(url)
        setImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, url } : img))
      } catch {
        setImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, error: 'Upload ไม่สำเร็จ' } : img))
      }
    }

    const { error: updateErr } = await supabase
      .from('warehouses')
      .update({
        name: form.name,
        location: form.location,
        province: form.province,
        area: parseInt(form.area),
        price_per_month: parseInt(form.price),
        price_per_sqm: Math.round(parseInt(form.price) / parseInt(form.area)),
        type: form.type,
        available: form.available,
        ceiling_height: form.ceilingH ? parseFloat(form.ceilingH) : null,
        loading_docks: form.docks ? parseInt(form.docks) : 0,
        has_sprinkler: form.sprinkler,
        has_forklift: form.forklift,
        has_security: form.security,
        has_cctv: form.cctv,
        min_rent_months: parseInt(form.minMonths),
        owner_name: form.ownerName,
        owner_phone: form.ownerPhone,
        description: form.desc,
        images: imageUrls,
      })
      .eq('id', w.id)

    if (updateErr) {
      setError('บันทึกไม่สำเร็จ: ' + updateErr.message)
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">บันทึกสำเร็จ!</h2>
          <p className="text-gray-500 mb-6">ข้อมูลคลังสินค้าถูกอัปเดตแล้ว</p>
          <div className="flex gap-3">
            <Link href={`/warehouses/${w.id}`}
              className="flex-1 bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm text-center">
              ดู Listing
            </Link>
            <Link href="/dashboard"
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm text-center">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="font-extrabold text-gray-900">แก้ไขข้อมูลคลังสินค้า</h1>
            <p className="text-xs text-gray-400 truncate max-w-xs">{w.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-20">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />{error}
          </div>
        )}

        {/* สถานะ */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">สถานะคลัง</h2>
          <div className="flex gap-3">
            <button type="button" onClick={() => setF('available', true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.available ? 'bg-green-600 border-green-600 text-white' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
              ✓ ว่าง (รับผู้เช่า)
            </button>
            <button type="button" onClick={() => setF('available', false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${!form.available ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600 hover:border-red-300'}`}>
              ✗ ไม่ว่าง
            </button>
          </div>
        </section>

        {/* รูปภาพ */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-1">รูปภาพคลังสินค้า</h2>
          <p className="text-xs text-gray-400 mb-4">คลิกลบรูปเก่า หรือเพิ่มรูปใหม่ · สูงสุด 10 รูป</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-2xl p-6 text-center cursor-pointer transition-colors mb-4"
          >
            <ImageIcon size={28} className="text-blue-400 mx-auto mb-2" />
            <p className="font-semibold text-blue-700 text-sm">คลิกเพื่อเพิ่มรูป</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG · ไม่เกิน 5MB ต่อไฟล์</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                  {!img.uploading && (
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 transition-colors">
                      <X size={12} />
                    </button>
                  )}
                  {i === 0 && <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">หลัก</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ข้อมูลพื้นฐาน */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">ข้อมูลพื้นฐาน</h2>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">ชื่อคลังสินค้า *</label>
            <input required value={form.name} onChange={e => setF('name', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">จังหวัด *</label>
              <select value={form.province} onChange={e => setF('province', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white">
                {PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">ที่ตั้ง *</label>
              <input required value={form.location} onChange={e => setF('location', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">ประเภทคลัง *</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button key={t} type="button" onClick={() => setF('type', t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${form.type === t ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ขนาดและราคา */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">ขนาดและราคา</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'พื้นที่ (ตร.ม.) *', key: 'area', req: true },
              { label: 'ราคา/เดือน (฿) *', key: 'price', req: true },
              { label: 'ความสูงเพดาน (ม.)', key: 'ceilingH' },
              { label: 'Loading Docks', key: 'docks' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{f.label}</label>
                <input type="number" required={f.req}
                  value={(form as unknown as Record<string, string>)[f.key]}
                  onChange={e => setF(f.key, e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">เช่าขั้นต่ำ</label>
            <div className="flex gap-2">
              {['1', '3', '6', '12'].map(m => (
                <button key={m} type="button" onClick={() => setF('minMonths', m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${form.minMonths === m ? 'bg-blue-700 border-blue-700 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {m} เดือน
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* สิ่งอำนวยความสะดวก */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">สิ่งอำนวยความสะดวก</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'forklift', label: '🚜 Forklift / รถยก' },
              { key: 'sprinkler', label: '💧 Sprinkler ดับเพลิง' },
              { key: 'cctv', label: '📹 กล้อง CCTV' },
              { key: 'security', label: '🛡️ รปภ. 24 ชั่วโมง' },
            ].map(item => (
              <label key={item.key}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${(form as unknown as Record<string, boolean>)[item.key] ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                <input type="checkbox" checked={(form as unknown as Record<string, boolean>)[item.key]}
                  onChange={e => setF(item.key, e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* รายละเอียด */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">รายละเอียดและข้อมูลผู้ติดต่อ</h2>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">คำอธิบาย</label>
            <textarea value={form.desc} onChange={e => setF('desc', e.target.value)} rows={3}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">ชื่อเจ้าของ/บริษัท</label>
              <input value={form.ownerName} onChange={e => setF('ownerName', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">เบอร์ติดต่อ</label>
              <input type="tel" value={form.ownerPhone} onChange={e => setF('ownerPhone', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-lg">
          {submitting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
      </form>
    </div>
  )
}
