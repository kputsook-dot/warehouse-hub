'use client';
import { useState } from 'react';
import { Upload, CheckCircle, Building2, Zap, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ListWarehousePage() {
  const [form, setForm] = useState({
    name: '', location: '', province: 'กรุงเทพฯ', area: '', price: '',
    type: '​ทั่วไป', ceilingH: '', docks: '', minMonths: '1',
    forklift: false, sprinkler: false, cctv: true, security: true, desc: '',
    ownerName: '', ownerPhone: '', ownerEmail: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');

  function set(key: string, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">ลง Listing สำเร็จ!</h2>
            <p className="text-gray-500 mb-6">ทีมงานจะตรวจสอบและอนุมัติ listing ของคุณภายใน 24 ชั่วโมง หลังจากนั้นคลังของคุณจะปรากฏในระบบค้นหา</p>
            <div className="bg-blue-50 rounded-xl p-4 text-left text-sm space-y-1 mb-6">
              <div className="font-semibold text-blue-800 mb-2">สิ่งที่จะเกิดขึ้นต่อไป:</div>
              {['ทีมงานตรวจสอบ listing ของคุณ', 'ได้รับอีเมลยืนยันการอนุมัติ', 'Listing ปรากฏในผลการค้นหา', 'รับ inquiry จากผู้เช่าโดยตรง'].map(s => (
                <div key={s} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
            <button onClick={() => setSubmitted(false)} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors">
              ลง Listing อีกแห่ง
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-2">ลงประกาศคลังสินค้า</h1>
          <p className="text-blue-200">เข้าถึงบริษัทกว่า 1,000 แห่งที่กำลังมองหาคลัง — เริ่มต้นฟรี</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

            {/* Plan selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">เลือกแพ็กเกจ</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'free', label: 'Free', price: '฿0', desc: 'listing สูงสุด 3 แห่ง', features: ['listing 1-3 แห่ง', 'รูปภาพ 5 รูป', 'รับ inquiry'] },
                  { key: 'pro', label: 'Pro', price: '฿990/เดือน', desc: 'listing ไม่จำกัด + analytics', features: ['listing ไม่จำกัด', 'รูปไม่จำกัด', 'Verified Badge', 'Analytics'] },
                ].map(p => (
                  <button key={p.key} type="button" onClick={() => setPlan(p.key as 'free' | 'pro')} className={`text-left p-4 rounded-xl border-2 transition-all ${plan === p.key ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900">{p.label}</span>
                      {plan === p.key && <CheckCircle size={16} className="text-blue-600" />}
                    </div>
                    <div className="text-blue-700 font-semibold text-sm mb-1">{p.price}</div>
                    <div className="text-xs text-gray-500">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">ข้อมูลคลังสินค้า</h2>

              {/* Photo upload */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">รูปภาพ *</label>
                <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <Upload size={28} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-700">คลิกหรือลากไฟล์รูปมาวาง</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG · สูงสุด 10 รูป · แต่ละไฟล์ไม่เกิน 5MB</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">ชื่อคลังสินค้า *</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="เช่น คลังสินค้า บางนา Zone A" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">จังหวัด *</label>
                  <select value={form.province} onChange={e => set('province', e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white">
                    {['กรุงเทพฯ', 'ปทุมธานี', 'สมุทรปราการ', 'ชลบุรี', 'นนทบุรี', 'ระยอง', 'อื่นๆ'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">ที่ตั้งโดยละเอียด *</label>
                  <input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="เช่น บางนา, กรุงเทพฯ" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">ประเภทคลัง *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['​ทั่วไป', 'ควบคุมอุณหภูมิ', 'ขนาดใหญ่', 'Bonded'].map(t => (
                    <button key={t} type="button" onClick={() => set('type', t)} className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${form.type === t ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Size & Price */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">ขนาดและราคา</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">พื้นที่ (ตร.ม.) *</label>
                  <input required type="number" value={form.area} onChange={e => set('area', e.target.value)} placeholder="เช่น 2000" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">ราคา/เดือน (฿) *</label>
                  <input required type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="เช่น 45000" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">ความสูงเพดาน (ม.)</label>
                  <input type="number" value={form.ceilingH} onChange={e => set('ceilingH', e.target.value)} placeholder="เช่น 8" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Loading Docks (จุด)</label>
                  <input type="number" value={form.docks} onChange={e => set('docks', e.target.value)} placeholder="เช่น 2" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">เช่าขั้นต่ำ (เดือน)</label>
                <select value={form.minMonths} onChange={e => set('minMonths', e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white">
                  {['1', '3', '6', '12'].map(m => <option key={m} value={m}>{m} เดือน</option>)}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">สิ่งอำนวยความสะดวก</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'forklift', label: 'Forklift / รถยก' },
                  { key: 'sprinkler', label: 'Sprinkler ดับเพลิง' },
                  { key: 'cctv', label: 'กล้อง CCTV' },
                  { key: 'security', label: 'รปภ. 24 ชั่วโมง' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                    <input type="checkbox" checked={Boolean((form as Record<string, unknown>)[item.key])} onChange={e => set(item.key, e.target.checked)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">คำอธิบายเพิ่มเติม</h2>
              <textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={4} placeholder="อธิบายจุดเด่น, การเดินทาง, ทำเล, รายละเอียดพิเศษ..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 resize-none" />
            </div>

            {/* Owner info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">ข้อมูลผู้ติดต่อ</h2>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">ชื่อบริษัท / เจ้าของ *</label>
                <input required value={form.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder="บริษัท ABC จำกัด" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">เบอร์โทร *</label>
                  <input required type="tel" value={form.ownerPhone} onChange={e => set('ownerPhone', e.target.value)} placeholder="08x-xxx-xxxx" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">อีเมล</label>
                  <input type="email" value={form.ownerEmail} onChange={e => set('ownerEmail', e.target.value)} placeholder="owner@company.com" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <Zap size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-blue-800">แพลตฟอร์มเก็บค่าบริการ <strong>7% เมื่อมีการจองสำเร็จเท่านั้น</strong> — ไม่มีค่าใช้จ่ายล่วงหน้า นอกจากแพ็กเกจ Pro ที่เสียค่าบริการรายเดือน</p>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-base">
              {loading ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={18} />}
              {loading ? 'กำลังส่ง...' : 'ส่ง Listing เพื่อตรวจสอบ'}
            </button>
          </form>

          {/* Right sidebar: Tips */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-blue-600" />เคล็ดลับ listing ที่ดี</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {['ใส่รูปภาพคุณภาพสูงอย่างน้อย 5 รูป', 'ระบุ spec ให้ครบ โดยเฉพาะความสูงเพดาน', 'เขียนคำอธิบายทำเลและการเดินทางให้ชัดเจน', 'อัปเดตสถานะว่าง/ไม่ว่างสม่ำเสมอ'].map(t => (
                  <li key={t} className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-700 to-blue-600 text-white rounded-2xl p-5">
              <Building2 size={24} className="mb-3 text-blue-200" />
              <h3 className="font-bold mb-1">ทำไมต้องลงกับเรา?</h3>
              <ul className="text-sm text-blue-100 space-y-1.5">
                {['ผู้เช่าในระบบ 1,000+ บริษัท', 'ค้นหาโดยเฉพาะ ไม่ใช่บอร์ดรวม', 'Verified badge สร้างความน่าเชื่อถือ', 'ได้รับ inquiry เฉลี่ย 5-10 ราย/เดือน'].map(t => (
                  <li key={t} className="flex items-start gap-2"><CheckCircle size={12} className="text-yellow-300 shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
