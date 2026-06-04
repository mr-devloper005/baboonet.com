'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, Plus } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = {
    '--editable-nav-bg': preset.colors.background,
    '--editable-nav-text': preset.colors.foreground,
    '--editable-nav-border': `${preset.colors.muted}30`,
    '--editable-nav-accent': preset.colors.accent,
    '--editable-nav-surface': preset.colors.surface,
    '--editable-container': '1480px',
  } as CSSProperties

  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Search', href: '/search' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  )

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--editable-container)] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-[var(--editable-nav-border)] bg-white shadow-sm">
            <img src="/favicon.ico" alt={SITE_CONFIG.name} className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[1.4rem] font-black leading-none tracking-[-0.07em] sm:text-[1.75rem]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition ${active ? 'bg-[var(--editable-nav-text)] text-[var(--editable-nav-bg)]' : 'hover:bg-black/5'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          
          {session ? (
            <>
              <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[var(--editable-nav-text)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--editable-nav-bg)]">
                <Plus className="h-4 w-4" />
                Create
              </Link>
              <button type="button" onClick={logout} className="rounded-full border border-[var(--editable-nav-border)] bg-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-nav-border)] bg-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--editable-nav-text)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--editable-nav-bg)]">
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-nav-border)] bg-white xl:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)] px-4 py-4 xl:hidden">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-3 sm:grid-cols-2">
            <form action="/search" className="sm:col-span-2">
              <label className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--editable-nav-border)] bg-white px-4 py-3">
                <Search className="h-4 w-4 opacity-60" />
                <input name="q" type="search" placeholder="Search posts, people, or images" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-current/35" />
              </label>
            </form>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.25rem] border border-[var(--editable-nav-border)] bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.16em]">
                {item.label}
              </Link>
            ))}
            {(session ? [{ label: 'Create', href: '/create' }, { label: 'Logout', href: '#' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }]).map((item) =>
              item.href === '#' ? (
                <button key={item.label} type="button" onClick={logout} className="rounded-[1.25rem] border border-[var(--editable-nav-border)] bg-white px-4 py-3 text-left text-sm font-black uppercase tracking-[0.16em]">
                  {item.label}
                </button>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.25rem] border border-[var(--editable-nav-border)] bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.16em]">
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
