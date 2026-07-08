'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, CheckCircle, Star, TrendingUp, Users, Zap, ArrowRight, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WarehouseCard from '@/components/WarehouseCard';
import { WAREHOUSES } from '@/lib/data';
import { useLang } from '@/contexts/LanguageContext';

export default function HomePage() {
  const featured = WAREHOUSES.filter(w => w.available).slice(0, 3);
  const [searchQ, setSearchQ] = useState('');
  const router = useRouter();
  const { t } = useLang()
  const h = t.home

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/warehouses${searchQ ? `?q=${encodeURIComponent(searchQ)}` : ''}`);
  }

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
              {h.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {h.heroTitle[0]}<br />
              <span className="text-yellow-300">{h.heroTitle[1]}</span><br />
              {h.heroTitle[2]}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
              {h.heroDesc}
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder={h.searchPlaceholder}
                  className="flex-1 text-gray-800 text-sm outline-none bg-transparent"
                />
                <MapPin size={16} className="text-gray-400 ml-auto shrink-0" />
              </div>
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-3 rounded-xl transition-colors text-center whitespace-nowrap shadow-lg">
                {h.searchBtn}
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-5">
              {h.quickLinks.map(loc => (
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
              {h.stats.map(s => (
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{h.howTitle}</h2>
            <p className="text-gray-500">{h.howSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {h.steps.map((s, i) => (
              <div key={i} className="relative text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                <div className="text-6xl font-black text-blue-100 group-hover:text-blue-200 absolute top-4 right-6 transition-colors">{s.step}</div>
                <div className="relative inline-flex items-center justify-center w-14 h-14 bg-blue-700 text-white rounded-2xl mb-4 shadow-md">
                  {i === 0 ? <Search size={26} /> : i === 1 ? <Building2 size={26} /> : <Phone size={26} />}
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
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{h.featuredTitle}</h2>
              <p className="text-gray-500">{h.featuredSub}</p>
            </div>
            <Link href="/warehouses" className="hidden md:flex items-center gap-1 text-blue-700 font-semibold hover:gap-2 transition-all text-sm">
              {h.viewAll} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(w => <WarehouseCard key={w.id} w={w} />)}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/warehouses" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors">
              {h.viewAllBtn} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{h.whyTitle}</h2>
              <p className="text-gray-500 mb-8">{h.whySub}</p>
              <div className="space-y-4">
                {h.whyPoints.map((item, i) => {
                  const Icon = [CheckCircle, Zap, TrendingUp, Users][i]
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {h.statsGrid.map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                    <div className={`text-2xl font-extrabold mb-1 ${i === 1 ? 'text-green-600' : i === 3 ? 'text-amber-500' : 'text-blue-700'}`}>{s.num}</div>
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{h.pricingTitle}</h2>
            <p className="text-gray-500">{h.pricingSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {h.plans.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? 'bg-blue-700 border-blue-700 text-white shadow-xl scale-105' : 'bg-white border-gray-200'}`}>
                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  {plan.price !== 'ติดต่อ' && plan.price !== 'Contact' && <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>฿</span>}
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  {plan.price !== 'ติดต่อ' && plan.price !== 'Contact' && <span className={`text-sm pb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{h.perMonth}</span>}
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10">{h.testimonialTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {h.testimonials.map(r => (
              <div key={r.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
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
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{h.ctaTitle}</h2>
          <p className="text-blue-100 mb-8 text-lg">{h.ctaSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/warehouses" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg">
              {h.ctaSearch}
            </Link>
            <Link href="/list" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg">
              {h.ctaList}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
