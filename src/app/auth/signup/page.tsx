'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', confirm: '', company: '', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('รหัสผ่านไม่ตรงกัน'); return }
    if (form.password.length < 6) { setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return }

    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { company_name: form.company, phone: form.phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (err) {
      setError(err.message); setLoading(false)
    } else if (data.session) {
      // Auto-confirmed (email confirm disabled)
      router.push('/dashboard')
    } else {
      setSuccess(true); setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">ตรวจสอบอีเมลของคุณ</h2>
          <p className="text-gray-500 text-sm mb-4">เราส่งลิงก์ยืนยันไปที่ <strong>{form.email}</strong> แล้ว กรุณาคลิกลิงก์เพื่อเปิดใช้งานบัญชี</p>
          <Link href="/auth/login" className="text-blue-700 font-semibold hover:underline text-sm">
            ไปหน้า Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-white text-blue-700 p-2 rounded-xl shadow">
            <Building2 size={24} />
          </div>
          <span className="text-white font-bold text-2xl">WarehouseOK</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">สมัครสมาชิกฟรี</h1>
          <p className="text-gray-500 text-sm mb-6">เริ่มลงประกาศคลังสินค้าได้เลย</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={16} className="shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">ชื่อบริษัท / ชื่อ</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.company} onChange={e => set('company', e.target.value)}
                  placeholder="บริษัท ABC จำกัด"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">เบอร์โทรศัพท์</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="08x-xxx-xxxx"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">อีเมล *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">รหัสผ่าน *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => set('password', e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">ยืนยันรหัสผ่าน *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิกฟรี'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            มีบัญชีแล้ว?{' '}
            <Link href="/auth/login" className="text-blue-700 font-semibold hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </div>
        <p className="text-center text-blue-200 text-xs mt-6">
          <Link href="/" className="hover:text-white">← กลับหน้าแรก</Link>
        </p>
      </div>
    </div>
  )
}
