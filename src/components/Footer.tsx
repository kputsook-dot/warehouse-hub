'use client'
import Link from 'next/link';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLang()
  const f = t.footer

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
            <p className="text-sm leading-relaxed">{f.desc}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{f.services}</h4>
            <ul className="space-y-2 text-sm">
              {f.links.map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Provinces */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{f.provinces}</h4>
            <ul className="space-y-2 text-sm">
              {f.provinceLinks.map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-white font-semibold mb-3 text-sm">{f.contactTitle}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /><a href="tel:0960705558" className="hover:text-white">096-070-5558</a></li>
              <li className="flex items-center gap-2"><Mail size={14} /><a href="mailto:nathasa@warehouseok.com" className="hover:text-white">nathasa@warehouseok.com</a></li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /><span>{f.location}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          {f.copyright} <Link href="/privacy" className="hover:text-white">{f.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
