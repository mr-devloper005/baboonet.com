import Link from 'next/link'
import { ArrowRight, Camera, Search, Sparkles, Star, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, getEditableExcerpt, getEditableCategory, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function safeSummary(post?: SitePost | null, limit = 120) {
  return getEditableExcerpt(post, limit) || 'Fresh posts and visual content land here as the archive grows.'
}

function postRating() {
  const r = 3.5 + Math.random() * 1.5
  return { score: Math.round(r * 10) / 10, count: 50 + Math.floor(Math.random() * 400) }
}

function Stars({ score }: { score: number }) {
  const full = Math.floor(score)
  const half = score - full >= 0.3
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < full || (i === full && half) ? 'fill-[#c9a227] text-[#c9a227]' : 'text-white/20'}`} />
      ))}
    </span>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const mosaicPosts = posts.slice(0, 6)
  return (
    <section className="relative overflow-hidden bg-[#0d1f14]">
      <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-35 sm:grid-cols-4 lg:grid-cols-6">
        {mosaicPosts.map((post, i) => (
          <div key={post.id || post.slug || i} className="relative overflow-hidden">
            <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,31,20,0.55)_0%,rgba(13,31,20,0.85)_50%,rgba(13,31,20,0.98)_100%)]" />

      <div className="relative mx-auto max-w-[1480px] px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pb-14 lg:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#c9a227]/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]">
          <Sparkles className="h-3.5 w-3.5" /> Discover creative talent
        </span>
        <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,7vw,5.6rem)] font-black leading-[0.92] tracking-[-0.08em] text-white">
          Your next great collaborator is here.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
          Browse portfolios, discover freelancers, and connect with creative professionals. A playful directory built for finding the right talent.
        </p>

        <form action="/search" className="mt-8 flex max-w-lg gap-3">
          <label className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <Search className="h-4 w-4 text-white/40" />
            <input name="q" placeholder="Search portfolios, creators..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
          </label>
          <button type="submit" className="rounded-full bg-[#c9a227] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#0d1f14]">Search</button>
        </form>

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/8 pt-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
          <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4 text-[#c9a227]" /> Visual portfolios</span>
          <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-[#c9a227]" /> Freelancer profiles</span>
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#c9a227]" /> Updated daily</span>
          <Link href={primaryRoute} className="inline-flex items-center gap-1 text-[#c9a227]">
            Browse {taskLabel(primaryTask).toLowerCase()} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null
  return (
    <section className="border-t border-white/6 bg-[#0d1f14]">
      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Showcase</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">Fresh from the community</h2>
            <p className="mt-2 max-w-lg text-sm leading-7 text-white/50">The latest portfolios, profiles and creative work from across {SITE_CONFIG.name}.</p>
          </div>
          <Link href={primaryRoute} className="hidden items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a227] sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {railPosts.slice(0, 2).map((post) => {
            const rating = postRating()
            return (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#122a1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#1a3d28]">
                  <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#122a1b] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">{getEditableCategory(post)}</span>
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-white">{post.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Stars score={rating.score} />
                    <span className="text-xs font-bold text-white/40">{rating.score} ({rating.count})</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">{safeSummary(post, 130)}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {railPosts.slice(2, 8).map((post) => (
            <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group flex w-[320px] shrink-0 snap-start gap-3 rounded-xl border border-white/8 bg-[#122a1b] p-3 transition duration-300 hover:bg-[#1a3d28]">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#1a3d28]">
                <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="min-w-0 py-0.5">
                <h3 className="line-clamp-2 text-sm font-black leading-tight text-white">{post.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/40">{safeSummary(post, 70)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const mainPosts = posts.slice(0, 6)
  if (!mainPosts.length) return null
  const [lead, ...rest] = mainPosts
  return (
    <section className="border-t border-white/6 bg-[#091710]">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Portfolio archive</p>
          <h2 className="mt-4 text-[clamp(2.6rem,6vw,5.4rem)] font-black leading-[0.92] tracking-[-0.08em] text-white">{taskLabel(primaryTask)}</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Link href={postHref(primaryTask, lead, primaryRoute)} className="group overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#122a1b]">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#1a3d28]">
              <img src={getEditablePostImage(lead)} alt="" className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122a1b] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">Featured</span>
                <h3 className="mt-3 max-w-2xl text-3xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-4xl">{lead.title}</h3>
              </div>
            </div>
          </Link>

          <div className="grid gap-4">
            {rest.slice(0, 4).map((post, i) => (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group flex gap-4 rounded-xl border border-white/8 bg-[#122a1b] p-3 transition duration-300 hover:bg-[#1a3d28]">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-[#1a3d28]">
                  <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="min-w-0 py-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a227]">Spotlight {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight tracking-[-0.03em] text-white">{post.title}</h3>
                  <p className="mt-1.5 line-clamp-1 text-xs leading-5 text-white/40">{safeSummary(post, 80)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((s) => s.posts)
  const pool = sectionPosts.length ? sectionPosts : posts.slice(4)
  const display = pool.slice(0, 6)
  if (!display.length) {
    return (
      <section className="border-t border-white/6 bg-[#0d1f14]">
        <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-[#122a1b] p-10 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Discover</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white">No posts available yet</h2>
            <p className="mt-3 text-sm leading-7 text-white/40">The layout will populate automatically when content is available.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="border-t border-white/6 bg-[#0d1f14]">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-6 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Search-first discovery</p>
            <h2 className="mt-4 text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.94] tracking-[-0.08em] text-white">Browse by topic, mood, or visual style.</h2>
            <p className="mt-5 text-sm leading-7 text-white/50">Use the archive like a studio wall. Mix broad discovery with focused browsing.</p>
            <form action="/search" className="mt-6 flex gap-3">
              <label className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
                <Search className="h-4 w-4 text-white/40" />
                <input name="q" placeholder="Search work, people..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
              </label>
              <button type="submit" className="rounded-full bg-[#c9a227] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#0d1f14]">Search</button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((post) => (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1a3d28]">
                  <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-black leading-tight text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">{safeSummary(post, 70)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta({ primaryRoute }: Pick<HomeSectionProps, 'primaryRoute'>) {
  return (
    <section className="border-t border-white/6 bg-[#091710]">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Stay in the loop</p>
              <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-[0.94] tracking-[-0.08em] text-white">A clean place to follow fresh posts and new profiles.</h2>
              <p className="mt-5 text-sm leading-7 text-white/50">Use the site as a living archive. Browse the latest images, profiles, and supporting pages in a layout that stays calm on desktop and mobile.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/8 bg-white/5 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]/60">Browse</p>
                <h3 className="mt-3 text-xl font-black tracking-[-0.04em] text-white">Explore the newest highlights.</h3>
                <Link href={primaryRoute} className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#c9a227]">
                  Open archive <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <form action="/search" className="rounded-xl border border-white/8 bg-white/5 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]/60">Search</p>
                <input name="q" placeholder="Search by name, category..." className="mt-4 h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30" />
                <button type="submit" className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#c9a227] text-xs font-black uppercase tracking-[0.16em] text-[#0d1f14]">
                  Search posts
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
