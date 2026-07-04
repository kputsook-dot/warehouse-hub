import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Building2, ArrowLeft, MessageSquare, Phone, Mail, Calendar, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Inquiry {
  id: string
  warehouse_id: string
  company_name: string
  contact_name: string | null
  phone: string
  email: string | null
  months: number
  note: string | null
  total_estimate: number | null
  status: string
  created_at: string
}

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: warehouses } = await supabase
    .from('warehouses')
    .select('id, name')
    .eq('user_id', user.id)

  const wList = (warehouses ?? []) as { id: string; name: string }[]
  const warehouseIds = wList.map(w => w.id)
  const warehouseMap: Record<string, string> = Object.fromEntries(wList.map(w => [w.id, w.name]))

  let inquiries: Inquiry[] = []
  if (warehouseIds.length > 0) {
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .in('warehouse_id', warehouseIds)
      .order('created_at', { ascending: false })
    inquiries = (data ?? []) as Inquiry[]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0">
          <div className="p-5 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
              <div className="bg-blue-700 text-white p-1.5 rounded-lg"><Building2 size={18} /></div>
              WarehouseHub
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: 'ภาพรวม', href: '/dashboard', active: false },
              { label: 'คลังของฉัน', href: '/dashboard', active: false },
              { label: 'ลงประกาศใหม่', href: '/dashboard/new', active: false },
              { label: 'Inquiries', href: '/dashboard/inquiries', active: true },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-1 truncate">{user.email}</div>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Inquiries ทั้งหมด</h1>
              <p className="text-gray-500 text-sm">{inquiries.length} คำขอ</p>
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-purple-400" />
              </div>
              <h3 className="font-bold text-gray-700 mb-2">ยังไม่มี Inquiry</h3>
              <p className="text-gray-400 text-sm">เมื่อมีคนส่งคำขอสนใจคลังของคุณ จะปรากฏที่นี่</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map(inq => {
                const createdAt = new Date(inq.created_at)
                const dateStr = createdAt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
                const timeStr = createdAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={inq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{inq.company_name}</div>
                        {inq.contact_name && <div className="text-gray-500 text-sm">{inq.contact_name}</div>}
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        inq.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {inq.status === 'pending' ? 'รอติดต่อ' : inq.status === 'contacted' ? 'ติดต่อแล้ว' : 'สำเร็จ'}
                      </span>
                    </div>

                    <div className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-lg inline-block mb-3">
                      คลัง: {warehouseMap[inq.warehouse_id] ?? 'ไม่ทราบ'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <a href={`tel:${inq.phone}`} className="hover:text-blue-600 font-medium">{inq.phone}</a>
                      </div>
                      {inq.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <a href={`mailto:${inq.email}`} className="hover:text-blue-600">{inq.email}</a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>เช่า {inq.months} เดือน</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span>{dateStr} {timeStr}</span>
                      </div>
                    </div>

                    {inq.total_estimate && (
                      <div className="bg-blue-50 rounded-xl px-4 py-2 flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">ประมาณการรวม</span>
                        <span className="font-bold text-blue-700">฿{inq.total_estimate.toLocaleString()}</span>
                      </div>
                    )}

                    {inq.note && (
                      <div className="bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-600">
                        <span className="font-semibold text-gray-700">หมายเหตุ: </span>{inq.note}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <a href={`tel:${inq.phone}`}
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm">
                        <Phone size={14} />โทรเลย
                      </a>
                      {inq.email && (
                        <a href={`mailto:${inq.email}`}
                          className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors text-sm">
                          <Mail size={14} />ส่งอีเมล
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
