'use client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  return (
    <button onClick={logout}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full">
      <LogOut size={15} />ออกจากระบบ
    </button>
  )
}
