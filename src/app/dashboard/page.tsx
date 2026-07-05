import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Building2, Plus, Eye, Edit, BarChart3, CheckCircle, Star, TrendingUp, MessageSquare } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch this user's warehouses
  const { data: warehouses } = await supabase
    .from('warehouses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const wList = warehouses ?? []
  const avgRating = wList.length ? (wList.reduce((s: number, w: { rating: number }) => s + (w.rating ?? 5), 0) / wList.length).toFixed(1) : '—'

  // Fetch real inquiry count for this user's warehouses
  const warehouseIds = wList.map((w: { id: string }) => w.id)
  let inquiryCount = 0
  if (warehouseIds.length > 0) {
    const { count } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .in('warehouse_id', warehouseIds)
    inquiryCount = count ?? 0
  }

  const company = user.user_metadata?.company_name || user.email

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + Content layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0">
          <div className="p-5 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
              <div className="bg-blue-700 text-white p-1.5 rounded-lg"><Building2 size={18} /></div>
              WarehouseOK
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { icon: BarChart3, label: 'ภาพรวม', href: '/dashboard', active: true },
              { icon: Building2, label: 'คลังของฉัน', href: '/dashboard' },
              { icon: Plus, label: 'ลงประกาศใหม่', href: '/dashboard/new' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <item.icon size={18} />{item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-1 truncate">{user.email}</div>
            <LogoutButton />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">สวัสดี, {company} 👋</h1>
              <p className="text-gray-500 text-sm mt-0.5">จัดการคลังสินค้าของคุณ</p>
            </div>
            <Link href="/dashboard/new"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
              <Plus size={16} />ลงประกาศใหม่
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'คลังทั้งหมด', value: wList.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', href: null },
              { label: 'ว่างอยู่', value: wList.filter((w: { available: boolean }) => w.available).length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', href: null },
              { label: 'Inquiries ทั้งหมด', value: inquiryCount, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/inquiries' },
              { label: 'Rating เฉลี่ย', value: avgRating, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', href: null },
            ].map(s => (
              s.href ? (
                <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer">
                  <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  <div className="text-xs text-purple-600 font-semibold mt-1">ดูรายละเอียด →</div>
                </Link>
              ) : (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              )
            ))}
          </div>

          {/* Warehouse list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">คลังสินค้าของคุณ</h2>
              <Link href="/dashboard/new" className="text-sm text-blue-700 font-semibold hover:underline flex items-center gap-1">
                <Plus size={14} />เพิ่มใหม่
              </Link>
            </div>

            {wList.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 size={28} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700 mb-2">ยังไม่มีคลังสินค้า</h3>
                <p className="text-gray-400 text-sm mb-4">เริ่มลงประกาศคลังแรกของคุณเลย</p>
                <Link href="/dashboard/new"
                  className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm">
                  <Plus size={15} />ลงประกาศคลังแรก
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {wList.map((w: {
                  id: string; name: string; location: string; area: number;
                  price_per_month: number; available: boolean; images: string[]; type: string
                }) => (
                  <div key={w.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {w.images?.[0]
                        ? <img src={w.images[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Building2 size={20} className="text-gray-300" /></div>
                      }
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{w.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{w.location} · {w.area.toLocaleString()} ตร.ม.</div>
                    </div>
                    {/* Price */}
                    <div className="text-right hidden sm:block">
                      <div className="font-bold text-blue-700 text-sm">฿{w.price_per_month.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">/เดือน</div>
                    </div>
                    {/* Status */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${w.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {w.available ? 'ว่าง' : 'ไม่ว่าง'}
                    </span>
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/warehouses/${w.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={15} />
                      </Link>
                      <Link href={`/dashboard/edit/${w.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={15} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tip for demo */}
          <div className="mt-6 bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-3">
              <TrendingUp size={20} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-1">อัปเกรดเป็น Pro — ฿990/เดือน</div>
                <div className="text-blue-100 text-sm">ลง listing ไม่จำกัด · Verified Badge · Analytics · ขึ้นอันดับการค้นหา</div>
              </div>
              <Link href="/#pricing" className="shrink-0 bg-white text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                ดูรายละเอียด
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
