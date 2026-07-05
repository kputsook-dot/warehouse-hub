import Link from 'next/link';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Building2 size={18} />
              </div>
              WarehouseOK
            </div>
            <p className="text-sm leading-relaxed">
              แพลตฟอร์มค้นหาคลังสินค้าให้เช่าทั่วประเทศไทย เชื่อมต่อผู้เช่าและเจ้าของคลังอย่างมีประสิทธิภาพ
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">บริการ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/warehouses" className="hover:text-white transition-colors">ค้นหาคลังสินค้า</Link></li>
              <li><Link href="/list" className="hover:text-white transition-colors">ลงประกาศคลัง</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">วิธีใช้งาน</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">แพ็กเกจราคา</Link></li>
            </ul>
          </div>

          {/* Provinces */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">คลังตามจังหวัด</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/warehouses?province=กรุงเทพฯ" className="hover:text-white transition-colors">กรุงเทพฯ</Link></li>
              <li><Link href="/warehouses?province=ปทุมธานี" className="hover:text-white transition-colors">ปทุมธานี</Link></li>
              <li><Link href="/warehouses?province=สมุทรปราการ" className="hover:text-white transition-colors">สมุทรปราการ</Link></li>
              <li><Link href="/warehouses?province=ชลบุรี" className="hover:text-white transition-colors">ชลบุรี (EEC)</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-white font-semibold mb-3 text-sm">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /><a href="tel:0960705558" className="hover:text-white">096-070-5558</a></li>
              <li className="flex items-center gap-2"><Mail size={14} /><a href="mailto:nathasa@warehouseok.com" className="hover:text-white">nathasa@warehouseok.com</a></li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /><span>กรุงเทพมหานคร ประเทศไทย</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          © 2025 WarehouseOK · สงวนลิขสิทธิ์ · <Link href="/privacy" className="hover:text-white">นโยบายความเป็นส่วนตัว</Link>
        </div>
      </div>
    </footer>
  );
}
