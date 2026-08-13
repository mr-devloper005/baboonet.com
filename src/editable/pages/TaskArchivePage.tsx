import Link from 'next/link'
import { ArrowRight, Camera, Filter, FileText, Building2, Bookmark, Image as ImageIcon, Search, UserRound, Megaphone } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', bull: '•', hellip: '…',
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
}
const decodeEntities = (value: string) => value.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec))).replace(/&([a-z]+);/gi, (m, name) => HTML_ENTITIES[name.toLowerCase()] ?? m)
const stripHtml = (value: string) => value.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ')
const plainText = (value: unknown, limit = 0) => { if (typeof value !== 'string') return ''; const text = stripHtml(decodeEntities(stripHtml(value))).replace(/\s+/g, ' ').trim(); return limit > 0 && text.length > limit ? text.slice(0, limit) + '…' : text }
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const summaryText = (post: SitePost) => plainText(post.summary, 260) || plainText(getContent(post).description, 260) || plainText(getContent(post).excerpt, 260) || ''
const categoryOf = (post: SitePost, fallback: string) => plainText(getContent(post).category, 60) || post.tags?.[0] || fallback

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Editorial cards for stories, guides, and visual essays.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-6 lg:grid-cols-2', promise: 'Directory cards with trust cues and direct contact details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-6 lg:grid-cols-2', promise: 'Offer boards with strong price and status details.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Visual browsing with image-first pacing.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources with a concise text-led rhythm.', badge: 'Bookmark' },
  pdf: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards for files, reports, and downloads.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards for people, brands, and creators.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  return (
    <EditableSiteShell>
      <main className="bg-[#0d1f14] text-[#f0ece4]">
        <section className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#122a1b] p-6 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#c9a227]/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]">
                  <Icon className="h-4 w-4" /> {label}
                </div>
                <span className="hidden rounded-full bg-[#c9a227] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#0d1f14] sm:inline-flex">{deck.badge}</span>
              </div>
              <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.92] tracking-[-0.08em] text-white">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {voice?.chips?.length ? voice.chips.slice(0, 4).map((chip) => <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">{chip}</span>) : null}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
                <form action={basePath} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
                    <Search className="h-4 w-4 text-white/40" />
                    <input name="q" placeholder={`Search ${label.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/30" />
                  </div>
                </form>
                <div className="rounded-xl border border-white/10 bg-[#091710] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]/60">Shown now</p>
                  <p className="mt-2 text-sm leading-7 text-white/55">{deck.promise}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {(posts.slice(0, 4).length ? posts.slice(0, 4) : posts).slice(0, 4).map((post, index) => (
                <Link key={post.id || post.slug} href={buildPostUrl(task, post.slug)} className="group grid gap-4 overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-[#1a3d28]">
                    <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a227]">Top pick {String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em] text-white">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">{getEditableExcerpt(post, 95)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c9a227]">{categoryLabel}</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">Latest {label.toLowerCase()} entries</h2>
            </div>
            <form action={basePath} className="flex flex-wrap gap-3">
              <select name="category" defaultValue={category} className="h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-black text-white outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#c9a227] px-5 text-sm font-black uppercase tracking-[0.18em] text-[#0d1f14]">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </form>
          </div>

          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-[#122a1b] p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-white/30" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white">No posts found</h2>
              <p className="mt-2 text-sm leading-7 text-white/45">Try another category or refresh the page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white/80">Previous</Link> : null}
            <span className="rounded-full bg-[#c9a227] px-5 py-3 text-sm font-black text-[#0d1f14]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white/80">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  return (
    <Link href={href} className="group overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a3d28]">
        <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#0d1f14]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a227]">Story {String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.06em] text-white">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = asText(getContent(post).location || getContent(post).address || getContent(post).city)
  const phone = asText(getContent(post).phone || getContent(post).telephone)
  const website = asText(getContent(post).website || getContent(post).url)
  return (
    <Link href={href} className="group grid gap-5 overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:grid-cols-[120px_minmax(0,1fr)]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-[#1a3d28] ring-1 ring-white/10">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-white/30" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0d1f14]">Directory</span>
          {location ? <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/70">{location}</span> : null}
        </div>
        <h3 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em] text-white">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">{summaryText(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-white/40 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = asText(getContent(post).price || getContent(post).amount || getContent(post).budget)
  const location = asText(getContent(post).location || getContent(post).address || getContent(post).city)
  const condition = asText(getContent(post).condition || getContent(post).type || getContent(post).availability)
  return (
    <Link href={href} className="group overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#091710] p-5 text-white">
          <span className="rounded-full bg-[#c9a227]/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Classified</span>
          <h3 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.08em]">{price || 'Open offer'}</h3>
          <p className="mt-4 text-sm font-bold text-white/55">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-xl object-cover opacity-85" /> : null}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-black leading-tight tracking-[-0.05em] text-white">{post.title}</h3>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/45">{summaryText(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-xl border border-white/8 bg-[#122a1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0d1f14]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h3 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.05em] text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = asText(getContent(post).website || getContent(post).url || getContent(post).link)
  return (
    <Link href={href} className="group rounded-xl border border-white/8 bg-[#122a1b] p-6 transition duration-300 hover:-translate-y-1 hover:bg-[#163222]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5 text-[#c9a227]" />
      </div>
      <h3 className="mt-8 text-2xl font-black leading-tight tracking-[-0.06em] text-white">{post.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/50">{summaryText(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] text-white/35">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post, 'PDF')
  return (
    <Link href={href} className="group rounded-xl border border-white/8 bg-[#122a1b] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-xl bg-[#091710] p-5"><FileText className="h-8 w-8 text-[#c9a227]" /></div>
        <span className="rounded-full bg-[#c9a227]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a227]">{category}</span>
      </div>
      <h3 className="mt-8 text-2xl font-black leading-tight tracking-[-0.06em] text-white">{post.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/45">{summaryText(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Open document <ArrowRight className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = asText(getContent(post).role || getContent(post).designation || getContent(post).company || getContent(post).location)
  return (
    <Link href={href} className="group rounded-xl border border-white/8 bg-[#122a1b] p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#1a3d28] ring-1 ring-white/10">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-white/30" />}
      </div>
      <h3 className="mt-5 text-xl font-black leading-tight tracking-[-0.05em] text-white">{post.title}</h3>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/45">{summaryText(post)}</p>
    </Link>
  )
}
