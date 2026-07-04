import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Ruler, DoorOpen, Phone, ArrowLeft, CheckCircle, XCircle, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WAREHOUSES } from '@/lib/data';
import BookingForm from './BookingForm';

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return WAREHOUSES.map(w => ({ id: w.id }));
}

export default async function WarehouseDetailPage({ params }: Props) {
  const { id } = await params;
  const w = WAREHOUSES.find(x => x.id === id);
  if (!w) notFound();

  const TYPE_COLORS: Record<string, string> = {
    '​ทั่วไป': 'bg-blue-100 text-blue-700',
    'ควบคุมอุณหภูมิ': 'bg-cyan-100 text-cyan-700',
    'ขนาดใหญ่': 'bg-purple-100 text-purple-700',
    'Bonded': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-700">หน้าแรก</Link>
          <span>/</span>
          <Link href="/warehouses" className="hover:text-blue-700">คลังสินค้า</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{w.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-72 md:h-96">
                <Image src={w.images[0]} alt={w.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" priority />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[w.type] ?? 'bg-gray-100 text-gray-700'}`}>{w.type}</span>
                  {w.available
                    ? <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">✓ ว่าง</span>
                    : <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">✗ ไม่ว่าง</span>
                  }
                </div>
              </div>
              {w.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {w.images.slice(1).map((img, i) => (
                    <div key={i} className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title + info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{w.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                <MapPin size={14} className="text-blue-600" />
                {w.location}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={15} className={s <= Math.floor(w.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />)}
                </div>
                <span className="font-semibold text-gray-800 text-sm">{w.rating}</span>
                <span className="text-gray-400 text-sm">({w.reviewCount} รีวิว)</span>
              </div>

              {/* Price highlight */}
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-blue-700">฿{w.pricePerMonth.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">ต่อเดือน · ฿{w.pricePerSqm}/ตร.ม.</div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>เช่าขั้นต่ำ</div>
                  <div className="font-bold text-gray-800 text-lg">{w.minRentMonths} เดือน</div>
                </div>
              </div>
            </div>

            {/* Specs grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ข้อมูลคลังสินค้า</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'พื้นที่', value: `${w.area.toLocaleString()} ตร.ม.`, icon: '📐' },
                  { label: 'ความสูงเพดาน', value: `${w.ceilingHeight} ม.`, icon: '↕️' },
                  { label: 'Loading Docks', value: `${w.loadingDocks} จุด`, icon: '🚛' },
                  { label: 'ประเภท', value: w.type, icon: '🏭' },
                ].map(spec => (
                  <div key={spec.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{spec.icon}</div>
                    <div className="font-bold text-gray-900">{spec.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{spec.label}</div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <h3 className="text-sm font-bold text-gray-700 mb-3">สิ่งอำนวยความสะดวก</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Forklift / รถยก', val: w.hasForklift },
                  { label: 'Sprinkler ระบบดับเพลิง', val: w.hasSprinkler },
                  { label: 'กล้อง CCTV', val: w.hasCCTV },
                  { label: 'รปภ. 24 ชั่วโมง', val: w.hasSecurity },
                ].map(item => (
                  <div key={item.label} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${item.val ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                    {item.val ? <CheckCircle size={15} className="text-green-500" /> : <XCircle size={15} className="text-gray-300" />}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">รายละเอียด</h2>
              <p className="text-gray-600 leading-relaxed">{w.description}</p>
              {w.nearbyHighways.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">เส้นทางใกล้เคียง:</div>
                  <div className="flex flex-wrap gap-2">
                    {w.nearbyHighways.map(h => (
                      <span key={h} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ติดต่อเจ้าของคลัง</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 shrink-0">
                  <Building2 size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{w.ownerName}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{w.ownerPhone}</div>
                </div>
                <a href={`tel:${w.ownerPhone}`} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                  <Phone size={15} />
                  โทรเลย
                </a>
              </div>
            </div>
          </div>

          {/* Right: Booking form (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm warehouse={w} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
