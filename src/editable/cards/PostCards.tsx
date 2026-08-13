import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', bull: '•', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
}
const decodeEntities = (v: string) => v.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d))).replace(/&([a-z]+);/gi, (m, n) => HTML_ENTITIES[n.toLowerCase()] ?? m)
const stripHtml = (v: string) => v.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ')
const cleanText = (v: unknown, limit = 0) => { if (typeof v !== 'string') return ''; const t = stripHtml(decodeEntities(stripHtml(v))).replace(/\s+/g, ' ').trim(); return limit > 0 && t.length > limit ? t.slice(0, limit) + '…' : t }

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  return cleanText(raw, limit)
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return cleanText(content.category, 60) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post?: SitePost | null, route = `/${task}`) {
  const slug = post?.slug?.trim()
  return slug ? `${route}/${slug}` : route
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-xl border border-white/8 bg-[#091710] text-white shadow-[0_24px_70px_rgba(0,0,0,0.4)] ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-5 sm:p-7 lg:min-h-[620px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,23,16,0.1),rgba(9,23,16,0.85))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]/70">{label}</span>
          <h3 className="mt-5 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#c9a227] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#0d1f14]">
            Open story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#c9a227]/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#0d1f14]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]">{getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em] text-white">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/45">{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c9a227] text-xs font-black text-[#0d1f14]">{index + 1}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a227]"><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-white">{post.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/45">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const strong = index % 3 === 0
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] p-4 ${dc.motion.lift} ${strong ? 'sm:grid-cols-[260px_minmax(0,1fr)]' : 'sm:grid-cols-[220px_minmax(0,1fr)]'}`}>
      <div className={`relative overflow-hidden rounded-lg bg-[#1a3d28] ${strong ? 'aspect-[16/11]' : 'aspect-[5/4]'}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-1 sm:py-3 sm:pr-4">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em] text-white sm:text-3xl">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/45">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#c9a227]">
          Open entry <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
