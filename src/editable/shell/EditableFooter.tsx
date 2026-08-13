'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-white/8 bg-[#091710] text-[#f0ece4]">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:px-8 lg:py-16">
        <div className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/favicon.ico" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            <span className="text-2xl font-black tracking-[-0.07em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#0d1f14]">
              <Mail className="h-4 w-4" />
              Search the archive
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/80">
              Get in touch
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]/60">Site</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
              ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10">
                {label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm font-bold text-white/70 transition hover:bg-white/10">
                Logout
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]/60">Browse</h3>
          <div className="mt-4 grid gap-2">
            {taskLinks.slice(0, 5).map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10">
                {task.label} <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 px-4 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
        &copy; {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote || ''}
      </div>
    </footer>
  )
}
