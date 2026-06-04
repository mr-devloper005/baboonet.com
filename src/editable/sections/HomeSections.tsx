import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Mail, Play, Search, Facebook, Instagram, Youtube, Cloud, Apple, Music2 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditablePostImage, getEditableExcerpt, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const socialIcons = [Facebook, Instagram, Youtube, Music2, Cloud, Apple]

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function safeSummary(post?: SitePost | null, limit = 120) {
  return getEditableExcerpt(post, limit) || 'Fresh posts, visual references, and useful details land here as the archive grows.'
}

function FeaturedPoster({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.14)]">
      <div className="relative aspect-[4/5] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.72))]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-sm">Featured</span>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="line-clamp-2 text-2xl font-black leading-[0.98] tracking-[-0.06em]">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/75">{safeSummary(post, 110)}</p>
        </div>
      </div>
    </Link>
  )
}

function CompactPoster({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 overflow-hidden rounded-[1.6rem] border border-black/10 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(0,0,0,0.1)]">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1.15rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-1 pr-2">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">No. {String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.05em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">{safeSummary(post, 90)}</p>
      </div>
    </Link>
  )
}

function HorizontalStory({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)] sm:grid-cols-[180px_minmax(0,1fr)]">
      <div className="relative min-h-[180px] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Spotlight {String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.06em]">{post.title}</h3>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{safeSummary(post, 150)}</p>
      </div>
    </Link>
  )
}

function ListCard({ post, href, index, label }: { post: SitePost; href: string; index: number; label: string }) {
  return (
    <Link href={href} className="group grid gap-4 rounded-[1.8rem] border border-black/10 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:grid-cols-[130px_minmax(0,1fr)]">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Pick {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="min-w-0 py-1">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{safeSummary(post, 120)}</p>
      </div>
    </Link>
  )
}

function CategoryChip({ label }: { label: string }) {
  return <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black/70">{label}</span>
}

function SocialRail() {
  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center justify-between lg:flex">
      <div className="flex flex-col items-center gap-4 rounded-full border border-black/10 bg-white/80 px-3 py-4 shadow-sm backdrop-blur">
        {socialIcons.map((Icon, index) => (
          <Icon key={index} className="h-4 w-4 text-[var(--slot4-accent)]" />
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-[0.9rem] bg-[var(--slot4-accent)] px-3 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white [writing-mode:vertical-rl] rotate-180">Discover</span>
        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)] [writing-mode:vertical-rl] rotate-180">Portfolio</span>
      </div>
    </aside>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroPost = posts[0]
  const supportPosts = posts.slice(1, 5)
  return (
    <section className="relative overflow-hidden border-b border-black/8 bg-[var(--slot4-page-bg)]">
      <div className="mx-auto flex max-w-[1480px] gap-4 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <SocialRail />

        <div className="relative min-w-0 flex-1 overflow-hidden rounded-[2.5rem] border border-black/10 bg-[var(--slot4-warm)] px-4 py-5 shadow-[0_30px_100px_rgba(0,0,0,0.08)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex items-start justify-between gap-4">
            <CategoryChip label="Featured" />
            <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] lg:inline-flex">
              <Search className="h-4 w-4" />
              Search-ready archive
            </div>
          </div>

          <div className="relative mt-5 grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-end">
            <div className="relative z-10 max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
              <h1 className="mt-4 max-w-4xl text-[clamp(3.5rem,10vw,8.8rem)] font-black leading-[0.88] tracking-[-0.1em]">{SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg">{pagesContent.home.hero.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={primaryRoute} className={dc.button.primary}>
                  Browse {taskLabel(primaryTask).toLowerCase()}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className={dc.button.secondary}>
                  Search the archive
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[640px]">
              <div className="absolute -left-8 top-8 hidden h-24 w-24 rounded-full bg-[var(--slot4-accent-soft)] blur-2xl lg:block" />
              <div className="rounded-[2.2rem] border border-black/10 bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
                <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.6rem] bg-[var(--slot4-media-bg)]">
                  <img src={getEditablePostImage(heroPost)} alt={heroPost?.title || SITE_CONFIG.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.78)_100%)]" />
                  <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                    <CategoryChip label="Image + Profile" />
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">Live feed</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/70">Latest pick</p>
                    <h2 className="mt-3 line-clamp-2 max-w-xl text-3xl font-black leading-[0.95] tracking-[-0.07em]">{heroPost?.title || 'Featured post'}</h2>
                    <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-6 text-white/80">{safeSummary(heroPost, 110)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr_1fr]">
            <div className="rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">New album / new set</p>
              <h3 className="mt-4 max-w-md text-2xl font-black leading-tight tracking-[-0.06em]">A rotating feature lane for images, profiles, and standout posts.</h3>
              <Link href={primaryRoute} className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]">
                Explore now <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-[1.8rem] border border-black/10 bg-[var(--slot4-dark-bg)] p-5 text-white shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Watch now</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                  <Play className="h-6 w-6 fill-current" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black leading-tight tracking-[-0.05em]">Featured visual preview</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">A broad, editorial stage for the most recent post.</p>
                </div>
              </div>
            </div>
            <form action="/search" className="rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Quick search</p>
              <label className="mt-4 flex items-center gap-3 rounded-full border border-black/10 bg-[var(--slot4-warm)] px-4 py-3">
                <Mail className="h-4 w-4 opacity-60" />
                <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
              </label>
              <button className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-xs font-black uppercase tracking-[0.2em] text-white">
                Search posts
              </button>
            </form>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {supportPosts.slice(0, 2).map((post, index) => (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group grid gap-4 rounded-[1.8rem] border border-black/10 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:grid-cols-[140px_minmax(0,1fr)]">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.2rem] bg-[var(--slot4-media-bg)]">
                  <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="min-w-0 py-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Preview {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em]">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{safeSummary(post, 105)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null
  return (
    <section className="relative border-b border-black/8 bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Featured rail</p>
            <h2 className={`${dc.type.sectionTitle} mt-2`}>A row of recent picks, with different card moods.</h2>
          </div>
          <Link href={primaryRoute} className="hidden items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)] sm:inline-flex">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {railPosts.map((post, index) => (
            <div key={post.id || post.slug} className="w-[240px] shrink-0 snap-start">
              <FeaturedPoster post={post} href={postHref(primaryTask, post, primaryRoute)} />
            </div>
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
    <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_36%)]" />
      </div>
      <div className="relative mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Discography / archive</p>
          <h2 className="mt-4 text-[clamp(3rem,7vw,6.8rem)] font-black leading-[0.88] tracking-[-0.1em]">{taskLabel(primaryTask)}</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Link href={postHref(primaryTask, lead, primaryRoute)} className="group overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/10 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-black/30">
              <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Featured cover</p>
                <h3 className="mt-3 max-w-3xl text-3xl font-black leading-[0.95] tracking-[-0.07em] sm:text-4xl">{lead.title}</h3>
              </div>
            </div>
          </Link>

          <div className="grid gap-5">
            {rest.map((post, index) => (
              <HorizontalStory key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts)
  const pool = sectionPosts.length ? sectionPosts : posts.slice(4)
  const lead = pool[0] || posts[0]
  const rest = pool.slice(1, 7)
  if (!lead) {
    return (
      <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
        <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[2.4rem] border border-dashed border-black/10 bg-white p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Search-first discovery</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">No posts available yet</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">The layout stays ready and will populate automatically when content is available.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2.4rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Search-first discovery</p>
            <h2 className="mt-4 text-[clamp(2.7rem,6vw,5.2rem)] font-black leading-[0.92] tracking-[-0.1em]">Browse by topic, mood, or visual style.</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">Use the archive like a studio wall. Mix broad discovery with focused browsing and keep the layout responsive on every screen.</p>
            <form action="/search" className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-full border border-black/10 bg-[var(--slot4-warm)] px-4 py-3">
                <Search className="h-4 w-4 opacity-60" />
                <input name="q" placeholder="Search work, people, services, or inspiration" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
              </label>
              <button className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-xs font-black uppercase tracking-[0.2em] text-white">
                Search
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Featured', 'Profiles', 'Images', 'Guides', 'Fresh', 'Popular'].map((label) => <CategoryChip key={label} label={label} />)}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link href={postHref(primaryTask, lead, primaryRoute)} className="group overflow-hidden rounded-[2.2rem] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/5] bg-[var(--slot4-media-bg)]">
                <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Featured stream</p>
                <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.06em]">{lead.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{safeSummary(lead, 135)}</p>
              </div>
            </Link>

            <div className="grid gap-4">
              {rest.slice(0, 3).map((post, index) => (
                <CompactPoster key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>

            <div className="md:col-span-2 grid gap-4 lg:grid-cols-3">
              {rest.slice(3, 6).map((post, index) => (
                <ListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} label={taskLabel(primaryTask)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta({ primaryRoute }: Pick<HomeSectionProps, 'primaryRoute'>) {
  return (
    <section id="get-app" className="border-t border-black/8 bg-[var(--slot4-dark-bg)] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Stay in the loop</p>
              <h2 className="mt-4 text-[clamp(2.6rem,6vw,5rem)] font-black leading-[0.92] tracking-[-0.1em]">A clean place to follow fresh posts and new profiles.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">Use the site as a living archive. Browse the latest images, profiles, and supporting pages in a layout that stays calm on desktop and mobile.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">Browse</p>
                <h3 className="mt-3 text-2xl font-black tracking-[-0.05em]">Explore the newest highlights.</h3>
                <Link href={primaryRoute} className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white/90">
                  Open archive <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <form action="/search" className="rounded-[1.8rem] border border-white/10 bg-white p-5 text-black">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Search</p>
                <input name="q" placeholder="Search by name, category, or topic" className="mt-4 h-12 w-full rounded-full border border-black/10 bg-[var(--slot4-warm)] px-4 text-sm font-bold outline-none placeholder:text-black/35" />
                <button className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-xs font-black uppercase tracking-[0.2em] text-white">
                  Search posts
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <CategoryChip label="Visuals" />
            <CategoryChip label="Profiles" />
            <CategoryChip label="Story posts" />
            <CategoryChip label="Resources" />
          </div>
        </div>
      </div>
    </section>
  )
}
