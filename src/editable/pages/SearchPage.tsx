import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', bull: '•', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
}
const decodeEntities = (value: string) => value.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec))).replace(/&([a-z]+);/gi, (m, name) => HTML_ENTITIES[name.toLowerCase()] ?? m)
const stripHtml = (value: string) => value.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ')
const plainText = (value: unknown, limit = 0) => { if (typeof value !== 'string') return ''; const text = stripHtml(decodeEntities(stripHtml(value))).replace(/\s+/g, ' ').trim(); return limit > 0 && text.length > limit ? text.slice(0, limit) + '…' : text }
const compactText = (value: unknown) => plainText(value).toLowerCase()
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || asText(content.featuredImage) || asText(content.image) || asText(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => plainText(post.summary) || plainText(getContent(post).description) || plainText(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#122a1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-[#1a3d28] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122a1b] via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5">
        {!image ? <span className="rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">{taskLabel}</span> : null}
        <h2 className="mt-3 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em] text-white">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/50">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#c9a227]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task) && getPostTaskKey(post) === 'image').slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="bg-[#0d1f14] text-[#f0ece4]">
        <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-6 md:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.92] tracking-[-0.08em] text-white">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/55">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
                <Search className="h-5 w-5 text-white/40" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3">
                  <Filter className="h-4 w-4 text-white/40" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
                </label>
                <select name="task" defaultValue={task} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-black uppercase tracking-[0.18em] text-[#0d1f14] transition hover:opacity-90" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/image" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white/80">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.6rem] border border-dashed border-white/10 bg-[#122a1b] p-10 text-center">
              <p className="text-2xl font-black tracking-[-0.04em] text-white">No matching posts found.</p>
              <p className="mt-3 text-sm leading-7 text-white/45">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
