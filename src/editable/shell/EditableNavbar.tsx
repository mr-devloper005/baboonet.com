'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, Search, UserPlus, LogIn, X, Plus } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const brandName = SITE_CONFIG.name
  const subtitle = globalContent.site?.tagline || SITE_CONFIG.description

  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Search', href: '/search' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0d1f14]/95 text-[#f0ece4] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img src="/favicon.ico" alt={brandName} className="h-9 w-9 shrink-0 object-contain" />
          <span className="min-w-0">
            <span className="block truncate text-lg font-black leading-none tracking-[-0.04em]">{brandName}</span>
            <span className="mt-0.5 block truncate text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a227]">{subtitle?.slice(0, 28)}{(subtitle?.length || 0) > 28 ? '...' : ''}</span>
          </span>
        </Link>

        <form action="/search" className="mx-auto hidden max-w-md flex-1 xl:block">
          <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5">
            <Search className="h-4 w-4 opacity-50" />
            <input name="q" type="search" placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35" />
          </label>
        </form>

        <div className="hidden items-center gap-2 xl:flex">
          {session ? (
            <>
              <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">
                <Plus className="h-4 w-4" />
                Create
              </Link>
              <button type="button" onClick={logout} className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 xl:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/8 bg-[#0d1f14] px-4 py-4 xl:hidden">
          <div className="mx-auto grid max-w-[1480px] gap-3 sm:grid-cols-2">
            <form action="/search" className="sm:col-span-2">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <Search className="h-4 w-4 opacity-50" />
                <input name="q" type="search" placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35" />
              </label>
            </form>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.16em]">
                {item.label}
              </Link>
            ))}
            {(session ? [{ label: 'Create', href: '/create' }, { label: 'Logout', href: '#' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }]).map((item) =>
              item.href === '#' ? (
                <button key={item.label} type="button" onClick={logout} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-black uppercase tracking-[0.16em]">
                  {item.label}
                </button>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.16em]">
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
