import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

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
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post?: SitePost | null, route = `/${task}`) {
  const slug = post?.slug?.trim()
  return slug ? `${route}/${slug}` : route
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[2.2rem] border border-black/10 bg-[var(--slot4-dark-bg)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)] ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-5 sm:p-7 lg:min-h-[620px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-58 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.82))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className={`${dc.type.eyebrow} text-white/60`}>{label}</span>
          <h3 className="mt-5 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black">
            Open story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block overflow-hidden rounded-[1.8rem] border border-black/10 bg-white ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-5">
        <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>{getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[1.6rem] border border-black/10 bg-white p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-xs font-black text-white">{index + 1}</span>
        <div className="min-w-0">
          <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]`}><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em]">{post.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const strong = index % 3 === 0
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border border-black/10 bg-white p-4 ${dc.motion.lift} ${strong ? 'sm:grid-cols-[260px_minmax(0,1fr)]' : 'sm:grid-cols-[220px_minmax(0,1fr)]'}`}>
      <div className={`relative overflow-hidden rounded-[1.4rem] bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/11]' : 'aspect-[5/4]'}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-1 sm:py-3 sm:pr-4">
        <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em] sm:text-3xl">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black">
          Open entry <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
