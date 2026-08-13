'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)

  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
            ]

  return (
    <EditableSiteShell>
      <main className="bg-[#0d1f14] px-4 py-14 text-[#f0ece4] sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <article className="rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)] lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.92] tracking-[-0.08em] text-white">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/50">{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-xl border border-white/8 bg-white/5 p-5">
                  <lane.icon className="h-5 w-5 text-[#c9a227]" />
                  <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-white">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/50">{lane.body}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-black tracking-[-0.04em] text-white">Quick contact</h2>
              <p className="mt-3 text-sm leading-7 text-white/50">
                Use the form below for publishing requests, partnership questions, or support updates.
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-black tracking-[-0.04em] text-white">{pagesContent.contact.formTitle}</h2>
              <EditableContactLeadForm />
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
