'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : err.message)
      setLoading(false)
    } else {
      router.push(redirect); router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">เข้าสู่ระบบ</h1>
      <p className="text-gray-500 text-sm mb-6">จัดการคลังสินค้าของคุณ</p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          <AlertCircle size={16} className="shrink-0" />{error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">อีเมล</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">รหัสผ่าน</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type={showPass ? 'text' : 'password'} required value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-colors text-base mt-2">
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        ยังไม่มีบัญชี?{' '}
        <Link href="/auth/signup" className="text-blue-700 font-semibold hover:underline">สมัครสมาชิกฟรี</Link>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
        <strong>Demo สำหรับนักลงทุน:</strong> สมัครบัญชีใหม่ได้เลย ใช้เวลา 30 วินาที
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-white text-blue-700 p-2 rounded-xl shadow"><Building2 size={24} /></div>
          <span className="text-white font-bold text-2xl">WarehouseOK</span>
        </Link>
        <Suspense fallback={<div className="bg-white rounded-3xl p-8 animate-pulse h-64" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-blue-200 text-xs mt-6">
          <Link href="/" className="hover:text-white">← กลับหน้าแรก</Link>
        </p>
      </div>
    </div>
  )
}
