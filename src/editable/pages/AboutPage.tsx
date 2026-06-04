import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-[2.6rem] border border-black/10 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 text-[clamp(3rem,7vw,5.8rem)] font-black leading-[0.92] tracking-[-0.1em]">About {SITE_CONFIG.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
            <div className="mt-8 space-y-4 text-sm leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="space-y-4">
            {pagesContent.about.values.map((value) => (
              <div key={value.title} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                <h2 className="text-2xl font-black tracking-[-0.05em]">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
