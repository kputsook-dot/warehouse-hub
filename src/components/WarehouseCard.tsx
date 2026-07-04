import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Ruler, DoorOpen, Thermometer, Package, Shield } from 'lucide-react';
import { Warehouse } from '@/lib/data';

const TYPE_COLORS: Record<string, string> = {
  '​ทั่วไป': 'bg-blue-100 text-blue-700',
  'ควบคุมอุณหภูมิ': 'bg-cyan-100 text-cyan-700',
  'ขนาดใหญ่': 'bg-purple-100 text-purple-700',
  'Bonded': 'bg-amber-100 text-amber-700',
};

export default function WarehouseCard({ w }: { w: Warehouse }) {
  return (
    <Link href={`/warehouses/${w.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={w.image}
          alt={w.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[w.type] ?? 'bg-gray-100 text-gray-700'}`}>
            {w.type}
          </span>
        </div>
        {!w.available && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ไม่ว่าง
          </div>
        )}
        {w.available && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ว่าง
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
          {w.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin size={13} className="shrink-0" />
          <span className="line-clamp-1">{w.location}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-gray-800">{w.rating}</span>
          <span className="text-sm text-gray-400">({w.reviewCount} รีวิว)</span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 border-t border-gray-50 pt-3">
          <span className="flex items-center gap-1">
            <Ruler size={12} />
            {w.area.toLocaleString()} ตร.ม.
          </span>
          <span className="flex items-center gap-1">
            <DoorOpen size={12} />
            {w.loadingDocks} Docks
          </span>
          <span className="flex items-center gap-1">
            <Package size={12} />
            {w.ceilingHeight}ม.
          </span>
        </div>

        {/* Icons */}
        <div className="flex gap-1.5 mb-3">
          {w.hasForklift && <span title="Forklift" className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-md">Forklift</span>}
          {w.hasSprinkler && <span title="Sprinkler" className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-md">Sprinkler</span>}
          {w.hasSecurity && <span title="รปภ." className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-md">รปภ.</span>}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-blue-700">฿{w.pricePerMonth.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">/เดือน</span>
          </div>
          <span className="text-xs text-gray-400">฿{w.pricePerSqm}/ตร.ม.</span>
        </div>
      </div>
    </Link>
  );
}
