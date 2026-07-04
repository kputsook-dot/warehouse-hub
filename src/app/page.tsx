import Link from 'next/link';
import { Search, Building2, CheckCircle, Star, TrendingUp, Users, Zap, ArrowRight, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WarehouseCard from '@/components/WarehouseCard';
import { WAREHOUSES } from '@/lib/data';

export default function HomePage() {
  const featured = WAREHOUSES.filter(w => w.available).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Zap size={14} className="text-yellow-300" />
              แพลตฟอร์มหาคลังสินค้าแห่งแรกของไทย
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              หาคลังสินค้า<br />
              <span className="text-yellow-300">ให้เช่า</span><br />
              ทั่วประเทศไทย
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
              ค้นหา เปรียบเทียบ และติดต่อเจ้าของคลังโดยตรง — ไม่ต้องผ่านนายหน้า ประหยัดเวลา ได้ราคาดีที่สุด
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg">
                <Search size={18} className="text-gray-400 shrink-0" />
                <span className="text-gray-400 text-sm">ค้นหาทำเล, นิคม, จังหวัด...</span>
                <MapPin size={16} className="text-gray-400 ml-auto" />
              </div>
              <Link href="/warehouses" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-3 rounded-xl transition-colors text-center whitespace-nowrap shadow-lg">
                ค้นหาเลย
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['ลาดกระบัง', 'บางนา', 'รังสิต', 'EEC ชลบุรี', 'นิคมนวนคร'].map(loc => (
                <Link key={loc} href={`/warehouses?q=${loc}`} className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 transition-colors">
                  {loc}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
              {[{ num: '500+', label: 'คลังสินค้า' }, { num: '200+', label: 'เจ้าของคลัง' }, { num: '1,000+', label: 'บริษัทที่ใช้บริการ' }].map(s => (
                <div key={s.label} className="px-4 py-1">
                  <div className="text-2xl font-extrabold text-yellow-300">{s.num}</div>
                  <div className="text-xs text-blue-200">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">ใช้งานง่าย ไม่ซับซ้อน</h2>
            <p className="text-gray-500">หาคลังสินค้าที่ใช่ใน 3 ขั้นตอน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Search, title: 'ค้นหาและกรอง', desc: 'ระบุทำเล ขนาด ประเภท และงบประมาณ ระบบจะแสดงคลังที่ตรงกับความต้องการ' },
              { step: '02', icon: Building2, title: 'ดูรายละเอียดและเปรียบเทียบ', desc: 'ดูรูปจริง spec ครบถ้วน รีวิวจากผู้เช่าจริง และเปรียบเทียบหลายคลังได้ในหน้าเดียว' },
              { step: '03', icon: Phone, title: 'ติดต่อและจอง', desc: 'ติดต่อเจ้าของคลังโดยตรงผ่านแพลตฟอร์ม ไม่ต้องผ่านนายหน้า ประหยัดค่าใช้จ่าย' },
            ].map(s => (
              <div key={s.step} className="relative text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                <div className="text-6xl font-black text-blue-100 group-hover:text-blue-200 absolute top-4 right-6 transition-colors">{s.step}</div>
                <div className="relative inline-flex items-center justify-center w-14 h-14 bg-blue-700 text-white rounded-2xl mb-4 shadow-md">
                  <s.icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">คลังสินค้าแนะนำ</h2>
              <p className="text-gray-500">คัดสรรคลังสินค้าคุณภาพสูง พร้อมเข้าใช้งาน</p>
            </div>
            <Link href="/warehouses" className="hidden md:flex items-center gap-1 text-blue-700 font-semibold hover:gap-2 transition-all text-sm">
              ดูทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(w => <WarehouseCard key={w.id} w={w} />)}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/warehouses" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors">
              ดูคลังสินค้าทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">ทำไมต้องเลือก WarehouseHub?</h2>
              <p className="text-gray-500 mb-8">เราเป็นมากกว่าบอร์ดประกาศ — ออกแบบมาเพื่อธุรกิจโดยเฉพาะ</p>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, title: 'Verified Listings', desc: 'ทุก listing ผ่านการตรวจสอบข้อมูลและรูปภาพจริง' },
                  { icon: Zap, title: 'ข้อมูล Real-time', desc: 'สถานะว่าง/ไม่ว่าง อัปเดตทันที ไม่เสียเวลาโทรถาม' },
                  { icon: TrendingUp, title: 'เปรียบเทียบราคาได้ทันที', desc: 'ดูราคา/ตร.ม. และ spec ครบในหน้าเดียว' },
                  { icon: Users, title: 'ติดต่อโดยตรง', desc: 'ไม่ผ่านนายหน้า ประหยัดค่าคอมมิชชั่น' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '500+', label: 'คลังสินค้าทั่วไทย', color: 'text-blue-700' },
                  { num: '< 1 วัน', label: 'เวลาเฉลี่ยในการหาคลัง', color: 'text-green-600' },
                  { num: '0 บาท', label: 'ค่าบริการค้นหา', color: 'text-blue-700' },
                  { num: '4.8 ★', label: 'คะแนนความพึงพอใจ', color: 'text-amber-500' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                    <div className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.num}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">แพ็กเกจสำหรับเจ้าของคลัง</h2>
            <p className="text-gray-500">เริ่มต้นฟรี ไม่มีค่าสมัคร</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '0', desc: 'เหมาะสำหรับเจ้าของคลังรายย่อย', features: ['ลง listing ได้ 1–3 แห่ง', 'รูปภาพ 5 รูป/listing', 'แสดงเบอร์ติดต่อ', 'รับ inquiry ผ่านระบบ'], cta: 'เริ่มต้นฟรี', highlight: false },
              { name: 'Pro', price: '990', desc: 'เหมาะสำหรับเจ้าของคลังหลายแห่ง', features: ['ลง listing ไม่จำกัด', 'รูปภาพไม่จำกัด', 'Verified Badge', 'Analytics Dashboard', 'ขึ้นอันดับในการค้นหา', 'Priority Support'], cta: 'สมัคร Pro', highlight: true },
              { name: 'Enterprise', price: 'ติดต่อ', desc: 'สำหรับนิคมอุตสาหกรรมและ REIT', features: ['ทุกอย่างใน Pro', 'API Integration', 'Dedicated Account Manager', 'Custom Branding', 'SLA 99.9%'], cta: 'ติดต่อทีม', highlight: false },
            ].map(plan => (
              <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? 'bg-blue-700 border-blue-700 text-white shadow-xl scale-105' : 'bg-white border-gray-200'}`}>
                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  {plan.price !== 'ติดต่อ' && <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>฿</span>}
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  {plan.price !== 'ติดต่อ' && <span className={`text-sm pb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>/เดือน</span>}
                </div>
                <p className={`text-sm mb-5 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.desc}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={15} className={plan.highlight ? 'text-yellow-300' : 'text-green-500'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/list" className={`block text-center font-semibold py-2.5 rounded-xl transition-colors ${plan.highlight ? 'bg-white text-blue-700 hover:bg-blue-50' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10">เสียงจากผู้ใช้งานจริง</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'คุณวิชัย', role: 'ผู้จัดการฝ่าย Logistics บริษัท XYZ', text: 'เคยใช้เวลา 2 สัปดาห์หาคลังสินค้าเพิ่ม ตอนนี้ใช้ WarehouseHub หาเจอภายใน 1 วัน', rating: 5 },
              { name: 'คุณสุภาพร', role: 'เจ้าของคลังสินค้า รังสิต', text: 'ลง listing แล้วได้ลูกค้าใหม่ภายใน 3 วัน ระบบใช้ง่าย ไม่ต้องผ่านนายหน้า ได้เงินเร็วขึ้น', rating: 5 },
              { name: 'คุณอนุชา', role: 'CEO บริษัท e-commerce', text: 'ข้อมูลครบถ้วน มีรูปจริง สเปคจริง ทำให้ตัดสินใจได้เร็ว ไม่ต้องขับรถไปดูทีละที่', rating: 5 },
            ].map(r => (
              <div key={r.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array(r.rating).fill(0).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                <div className="text-xs text-gray-400">{r.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">พร้อมหาคลังสินค้าแล้วหรือยัง?</h2>
          <p className="text-blue-100 mb-8 text-lg">เริ่มต้นได้เลย ฟรี ไม่มีค่าสมาชิก</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/warehouses" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg">
              ค้นหาคลังสินค้า
            </Link>
            <Link href="/list" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg">
              ลงประกาศคลังของคุณ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
