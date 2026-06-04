'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': 'var(--slot4-dark-bg, #0b0b0b)',
    '--editable-footer-text': 'var(--slot4-dark-text, #fff)',
    '--editable-footer-border': 'rgba(255,255,255,0.12)',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-[var(--editable-footer-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:px-8 lg:py-16">
        <div className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] border border-white/10 bg-white text-black">
              <img src="/favicon.ico" alt={SITE_CONFIG.name} className="h-full w-full object-contain" />
            </span>
            <span className="text-2xl font-black tracking-[-0.07em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">
              <Mail className="h-4 w-4" />
              Search the archive
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/90">
              Get in touch
            </Link>
          </div>
        </div>


        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-white/50">Site</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
              ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10">
                {label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-bold text-white/80 transition hover:bg-white/10">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--editable-footer-border)] px-4 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white/45">
        © {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote || ''}
      </div>
    </footer>
  )
}
