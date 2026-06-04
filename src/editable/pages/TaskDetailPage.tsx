import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const vars = { '--detail-bg': 'var(--slot4-page-bg)', '--detail-text': 'var(--slot4-page-text)', '--detail-surface': 'var(--slot4-surface-bg)', '--detail-accent': 'var(--slot4-accent)' } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={vars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] shadow-sm">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-[2.6rem] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8 lg:p-10">
        <BackLink task="article" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-5">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
            <h1 className="text-[clamp(2.8rem,7vw,6.2rem)] font-black leading-[0.9] tracking-[-0.1em]">{post.title}</h1>
            <p className="max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post) || 'A detailed page with room for summary text, links, and related content.'}</p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-black/10 bg-[var(--slot4-warm)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">Article</span>
              {post.publishedAt ? <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">Published {new Date(post.publishedAt).toLocaleDateString()}</span> : null}
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[var(--slot4-media-bg)]">
            <img src={images[0] || getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0] || getEditablePostImage(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.6rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] bg-[var(--slot4-warm)] ring-1 ring-black/10">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Business listing</p>
              <h1 className="mt-3 text-[clamp(2.8rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.1em]">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post) || 'A clear listing page with room for contacts, location, and a description block.'}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1480px] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.6rem] border border-black/10 bg-black p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-[11px] font-black uppercase tracking-[0.24em] text-white/55">Classified notice</p>
        <h1 className="mt-4 text-[clamp(2.6rem,6vw,5.2rem)] font-black leading-[0.92] tracking-[-0.1em]">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-black text-black">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-black">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.6rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-9">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ImageStrip images={images} label="Offer images" large />
          <div className="rounded-[2rem] border border-black/10 bg-[var(--slot4-warm)] p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Quick take</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">{price || 'Open offer'}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryText(post) || 'A concise offer page with clear metadata, a strong summary, and quick contact actions.'}</p>
            <ContactAction website={website} phone={phone} email={email} />
          </div>
        </div>
        <BodyContent post={post} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : [getEditablePostImage(post)]
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-[2.6rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-[clamp(2.8rem,6vw,5.6rem)] font-black leading-[0.92] tracking-[-0.1em]">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post) || 'A gallery-first detail page with a soft supporting column and spacious visuals.'}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="grid gap-5 md:grid-cols-2">
          {gallery.map((image, index) => (
            <figure key={`${image}-${index}`} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <img src={image} alt="" className="aspect-[4/5] w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[var(--slot4-muted-text)]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <RelatedPanel task="image" post={post} related={related} />
      </div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.6rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-black text-white"><Bookmark className="h-9 w-9" /></div>
        <h1 className="mt-7 text-[clamp(2.8rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.1em]">{post.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post) || 'Saved resources, tools, and reference material with a clean reading rhythm.'}</p>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.6rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-9">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-black text-white"><FileText className="h-12 w-12" /></div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">PDF resource</p>
            <h1 className="mt-3 text-[clamp(2.8rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.1em]">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-[var(--slot4-warm)]">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-[2.6rem] border border-black/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-warm)] ring-1 ring-black/10">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
        </div>
        <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em]">{post.title}</h1>
        {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.6rem] border border-black/10 bg-white p-7 shadow-sm sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} opacity-80`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-black/10 bg-[var(--slot4-warm)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-muted-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-black/10" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
    
      {related.length ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0] || getEditablePostImage(post)
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-black/10 bg-[var(--slot4-warm)] p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white">
      <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 80)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/10 bg-[var(--slot4-warm)] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
