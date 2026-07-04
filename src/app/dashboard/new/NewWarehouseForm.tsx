'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Upload, X, CheckCircle, Loader2, ArrowLeft,
  Building2, ImageIcon, AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PROVINCES = ['กรุงเทพฯ', 'ปทุมธานี', 'สมุทรปราการ', 'ชลบุรี', 'นนทบุรี', 'ระยอง', 'ฉะเชิงเทรา', 'สมุทรสาคร', 'นครปฐม', 'อื่นๆ']
const TYPES = ['ทั่วไป', 'ควบคุมอุณหภูมิ', 'ขนาดใหญ่', 'Bonded']

interface ImageFile { file: File; preview: string; uploading: boolean; url?: string; error?: string }

export default function NewWarehouseForm({ userId }: { userId: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<ImageFile[]>([])
  const [form, setForm] = useState({
    name: '', location: '', province: 'กรุงเทพฯ', area: '',
    price: '', type: 'ทั่วไป', ceilingH: '', docks: '', minMonths: '1',
    forklift: false, sprinkler: false, cctv: true, security: true,
    desc: '', ownerName: '', ownerPhone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [newId, setNewId] = useState('')

  function setF(k: string, v: string | boolean) { setForm(p => ({ ...p, [k]: v })) }

  // Handle image file selection
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
    setImages(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i) })
  }

  // Upload single image to Supabase Storage
  async function uploadImage(img: ImageFile, supabase: ReturnType<typeof createClient>): Promise<string> {
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

    // Upload images first
    const imageUrls: string[] = []
    for (let i = 0; i < images.length; i++) {
      setImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: true } : img))
      try {
        const url = await uploadImage(images[i], supabase)
        imageUrls.push(url)
        setImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, url } : img))
      } catch (err) {
        setImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, error: 'Upload ไม่สำเร็จ' } : img))
        // continue without this image
      }
    }

    // Insert warehouse record
    const { data, error: insertErr } = await supabase
      .from('warehouses')
      .insert({
        user_id: userId,
        name: form.name,
        location: form.location,
        province: form.province,
        area: parseInt(form.area),
        price_per_month: parseInt(form.price),
        type: form.type,
        available: true,
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
        rating: 5.0,
        review_count: 0,
      })
      .select('id')
      .single()

    if (insertErr) {
      setError('บันทึกไม่สำเร็จ: ' + insertErr.message)
      setSubmitting(false)
      return
    }

    setNewId(data.id)
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
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">ลง Listing สำเร็จ! 🎉</h2>
          <p className="text-gray-500 mb-6">คลังสินค้าของคุณถูกบันทึกและแสดงในระบบแล้ว</p>
          <div className="flex gap-3">
            <Link href={`/warehouses/${newId}`}
              className="flex-1 bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm">
              ดู Listing
            </Link>
            <Link href="/dashboard"
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm">
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
            <h1 className="font-extrabold text-gray-900">ลงประกาศคลังสินค้าใหม่</h1>
            <p className="text-xs text-gray-400">ข้อมูลจะแสดงในหน้าค้นหาทันที</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-20">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />{error}
          </div>
        )}

        {/* ===== รูปภาพ ===== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-1">รูปภาพคลังสินค้า</h2>
          <p className="text-xs text-gray-400 mb-4">รูปคุณภาพสูงช่วยให้ได้ลูกค้าเร็วขึ้น 3 เท่า · สูงสุด 10 รูป</p>

          {/* Upload zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
          >
            <ImageIcon size={32} className="text-blue-400 mx-auto mb-2" />
            <p className="font-semibold text-blue-700 text-sm">คลิกเพื่อเลือกรูป</p>
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
                  {img.url && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-0.5">
                      <CheckCircle size={12} className="text-white" />
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

        {/* ===== ข้อมูลพื้นฐาน ===== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">ข้อมูลพื้นฐาน</h2>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">ชื่อคลังสินค้า *</label>
            <input required value={form.name} onChange={e => setF('name', e.target.value)}
              placeholder="เช่น คลังสินค้า บางนา Zone A"
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
                placeholder="เช่น บางนา, กรุงเทพฯ"
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

        {/* ===== ขนาดและราคา ===== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">ขนาดและราคา</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'พื้นที่ (ตร.ม.) *', key: 'area', placeholder: 'เช่น 2000', req: true },
              { label: 'ราคา/เดือน (฿) *', key: 'price', placeholder: 'เช่น 45000', req: true },
              { label: 'ความสูงเพดาน (ม.)', key: 'ceilingH', placeholder: 'เช่น 8' },
              { label: 'Loading Docks', key: 'docks', placeholder: 'เช่น 2' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{f.label}</label>
                <input type="number" required={f.req}
                  value={(form as unknown as Record<string, string>)[f.key]}
                  onChange={e => setF(f.key, e.target.value)}
                  placeholder={f.placeholder}
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

        {/* ===== สิ่งอำนวยความสะดวก ===== */}
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

        {/* ===== รายละเอียด ===== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">รายละเอียดและข้อมูลผู้ติดต่อ</h2>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">คำอธิบาย</label>
            <textarea value={form.desc} onChange={e => setF('desc', e.target.value)} rows={3}
              placeholder="อธิบายจุดเด่น, ทำเล, การเดินทาง, สิ่งพิเศษ..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">ชื่อเจ้าของ/บริษัท</label>
              <input value={form.ownerName} onChange={e => setF('ownerName', e.target.value)}
                placeholder="บริษัท ABC จำกัด"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">เบอร์ติดต่อ</label>
              <input type="tel" value={form.ownerPhone} onChange={e => setF('ownerPhone', e.target.value)}
                placeholder="08x-xxx-xxxx"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
        </section>

        {/* Submit */}
        <button type="submit" disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-lg">
          {submitting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {submitting ? 'กำลังบันทึก...' : 'ลงประกาศคลังสินค้า'}
        </button>
      </form>
    </div>
  )
}
