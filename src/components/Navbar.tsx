'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Building2, Menu, X, Phone, LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useLang } from '@/contexts/LanguageContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [dropOpen, setDropOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <div className="bg-blue-700 text-white p-1.5 rounded-lg">
              <Building2 size={20} />
            </div>
            <span>WarehouseOK</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/warehouses" className="hover:text-blue-700 transition-colors">{t.nav.search}</Link>
            <Link href="/list" className="hover:text-blue-700 transition-colors">{t.nav.list}</Link>
            <Link href="/#how-it-works" className="hover:text-blue-700 transition-colors">{t.nav.howItWorks}</Link>
            <Link href="/#contact" className="hover:text-blue-700 transition-colors">{t.nav.contact}</Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:0960705558" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700">
              <Phone size={14} />096-070-5558
            </a>

            {/* Language toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-bold">
              <button
                onClick={() => setLang('th')}
                className={`px-2.5 py-1 rounded-md transition-colors ${lang === 'th' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                TH
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm px-3 py-2 rounded-xl transition-colors"
                >
                  <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {(user.user_metadata?.company_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {user.user_metadata?.company_name || user.email?.split('@')[0]}
                  </span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link href="/dashboard" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard size={15} />{t.nav.dashboard}
                    </Link>
                    <Link href="/dashboard/new" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Building2 size={15} />{t.nav.newListing}
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { setDropOpen(false); logout() }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut size={15} />{t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login"
                  className="text-sm font-semibold text-gray-600 hover:text-blue-700 px-3 py-2 transition-colors">
                  {t.nav.login}
                </Link>
                <Link href="/auth/signup"
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: language toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-bold">
              <button
                onClick={() => setLang('th')}
                className={`px-2 py-1 rounded-md transition-colors ${lang === 'th' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
              >
                TH
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
              >
                EN
              </button>
            </div>
            <button className="p-2 text-gray-600" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 text-sm font-medium">
          <Link href="/warehouses" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>{t.nav.search}</Link>
          <Link href="/list" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>{t.nav.list}</Link>
          <Link href="/#how-it-works" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>{t.nav.howItWorks}</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-blue-700 font-semibold" onClick={() => setOpen(false)}>{t.nav.dashboard}</Link>
              <button onClick={() => { setOpen(false); logout() }} className="block py-2 text-red-500 w-full text-left">{t.nav.logout}</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>{t.nav.login}</Link>
              <Link href="/auth/signup" className="block bg-blue-700 text-white text-center py-2.5 rounded-xl font-semibold mt-2" onClick={() => setOpen(false)}>{t.nav.register}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
