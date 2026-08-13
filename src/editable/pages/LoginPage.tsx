import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0d1f14] text-[#f0ece4]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1480px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.92] tracking-[-0.08em] text-white">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-sm leading-8 text-white/50">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-white">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-white/50">New here? <Link href="/signup" className="font-black text-[#c9a227] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
