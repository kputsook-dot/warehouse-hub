'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WarehouseCard from '@/components/WarehouseCard'
import { WAREHOUSES as MOCK_DATA, PROVINCES, TYPES } from '@/lib/data'
import { createClient } from '@/lib/supabase/client'
import type { Warehouse } from '@/lib/data'
import { useLang } from '@/contexts/LanguageContext'

function mapRow(r: Record<string, unknown>): Warehouse {
  return {
    id: String(r.id),
    name: String(r.name),
    location: String(r.location),
    province: String(r.province ?? 'กรุงเทพฯ'),
    area: Number(r.area),
    pricePerMonth: Number(r.price_per_month),
    pricePerSqm: Number(r.price_per_sqm ?? (Number(r.price_per_month) / Number(r.area)).toFixed(1)),
    type: String(r.type ?? 'ทั่วไป') as Warehouse['type'],
    available: Boolean(r.available ?? true),
    rating: Number(r.rating ?? 5),
    reviewCount: Number(r.review_count ?? 0),
    image: (r.images as string[])?.[0] ?? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    images: (r.images as string[]) ?? [],
    ceilingHeight: Number(r.ceiling_height ?? 8),
    loadingDocks: Number(r.loading_docks ?? 0),
    hasSprinkler: Boolean(r.has_sprinkler),
    hasForklift: Boolean(r.has_forklift),
    hasSecurity: Boolean(r.has_security ?? true),
    hasCCTV: Boolean(r.has_cctv ?? true),
    minRentMonths: Number(r.min_rent_months ?? 1),
    ownerName: String(r.owner_name ?? ''),
    ownerPhone: String(r.owner_phone ?? ''),
    description: String(r.description ?? ''),
    lat: 13.75,
    lng: 100.5,
    nearbyHighways: (r.nearby_highways as string[]) ?? [],
  }
}

export default function WarehousesPage() {
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('ทั้งหมด')
  const [type, setType] = useState('ทั้งหมด')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [minArea, setMinArea] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'area_desc' | 'rating'>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [dbWarehouses, setDbWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLang()
  const s = t.search

  useEffect(() => {
    // Read ?q= param from URL on load
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) setSearch(q)
  }, [])

  useEffect(() => {
    async function fetchWarehouses() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('warehouses')
          .select('*')
          .order('created_at', { ascending: false })

        if (error || !data) throw error
        setDbWarehouses(data.length > 0 ? data.map(mapRow) : MOCK_DATA)
      } catch {
        setDbWarehouses(MOCK_DATA)
      } finally {
        setLoading(false)
      }
    }
    fetchWarehouses()
  }, [])

  const results = useMemo(() => {
    let list = dbWarehouses.filter(w => {
      const q = search.toLowerCase()
      const matchSearch = !q || w.name.toLowerCase().includes(q) || w.location.toLowerCase().includes(q) || w.province.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
      const matchProvince = province === 'ทั้งหมด' || w.province === province
      const matchType = type === 'ทั้งหมด' || w.type === type
      const matchAvail = !availableOnly || w.available
      const matchArea = !minArea || w.area >= parseInt(minArea)
      const matchPrice = !maxPrice || w.pricePerMonth <= parseInt(maxPrice)
      return matchSearch && matchProvince && matchType && matchAvail && matchArea && matchPrice
    })
    return list.sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerMonth - b.pricePerMonth
      if (sortBy === 'price_desc') return b.pricePerMonth - a.pricePerMonth
      if (sortBy === 'area_desc') return b.area - a.area
      return b.rating - a.rating
    })
  }, [dbWarehouses, search, province, type, availableOnly, minArea, maxPrice, sortBy])

  const activeFilters = [
    province !== 'ทั้งหมด' && province,
    type !== 'ทั้งหมด' && type,
    availableOnly && (t.warehouse.available),
    minArea && `≥${minArea} ${t.warehouse.sqm}`,
    maxPrice && `≤฿${parseInt(maxPrice).toLocaleString()}`,
  ].filter(Boolean)

  function clearFilters() {
    setProvince('ทั้งหมด')
    setType('ทั้งหมด')
    setMinArea('')
    setMaxPrice('')
    setAvailableOnly(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-1">{s.title}</h1>
          <p className="text-blue-200 text-sm mb-5">{t.home.heroDesc}</p>
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input type="text" placeholder={s.placeholder}
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 text-gray-800 text-sm outline-none" />
              {search && <button onClick={() => setSearch('')}><X size={16} className="text-gray-400" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${showFilters ? 'bg-yellow-400 text-blue-900' : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'}`}>
              <SlidersHorizontal size={16} />
              {s.activeFilters}
              {activeFilters.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilters.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{s.allProvinces}</label>
                <select value={province} onChange={e => setProvince(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white">
                  {PROVINCES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{s.allTypes}</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{s.minArea}</label>
                <input type="number" placeholder="500" value={minArea} onChange={e => setMinArea(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{s.maxPrice}</label>
                <input type="number" placeholder="100000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} className="w-4 h-4 accent-blue-700" />
                  <span className="text-sm font-medium text-gray-700">{s.availableOnly}</span>
                </label>
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium underline">
                  {s.clearFilters}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-wrap gap-2">
          {activeFilters.map(f => (
            <span key={String(f)} className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{String(f)}</span>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            {loading
              ? <><RefreshCw size={14} className="animate-spin text-blue-500" />Loading...</>
              : <><span className="font-bold text-blue-700">{results.length}</span> {s.results}</>
            }
          </p>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white">
            <option value="rating">{s.sortOptions.rating}</option>
            <option value="price_asc">{s.sortOptions.price_asc}</option>
            <option value="price_desc">{s.sortOptions.price_desc}</option>
            <option value="area_desc">{s.sortOptions.area_desc}</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">{s.noResults}</h3>
            <p className="text-gray-400">{s.noResultsSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map(w => <WarehouseCard key={w.id} w={w} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
