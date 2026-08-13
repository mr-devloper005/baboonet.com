import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--editable-page-bg': '#0d1f14',
  '--editable-page-text': '#f0ece4',
  '--editable-border': 'rgba(255,255,255,0.08)',
  '--editable-container': '1480px',
  '--slot4-page-bg': '#0d1f14',
  '--slot4-page-text': '#f0ece4',
  '--slot4-panel-bg': '#122a1b',
  '--slot4-surface-bg': '#163222',
  '--slot4-muted-text': 'rgba(240,236,228,0.6)',
  '--slot4-soft-muted-text': 'rgba(240,236,228,0.45)',
  '--slot4-accent': '#c9a227',
  '--slot4-accent-fill': '#c9a227',
  '--slot4-accent-soft': 'rgba(201,162,39,0.15)',
  '--slot4-dark-bg': '#091710',
  '--slot4-dark-text': '#f0ece4',
  '--slot4-media-bg': '#1a3d28',
  '--slot4-cream': '#122a1b',
  '--slot4-warm': '#122a1b',
  '--slot4-lavender': '#1a3d28',
  '--slot4-gray': '#163222',
  '--slot4-body-gradient': 'radial-gradient(circle at top left, rgba(201,162,39,0.06), transparent 28%), radial-gradient(circle at right 20%, rgba(13,31,20,0.4), transparent 24%), linear-gradient(180deg, #0d1f14 0%, #0b1a10 45%, #091710 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-white/[0.08]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_12px_40px_rgba(0,0,0,0.3)]',
  shadowStrong: 'shadow-[0_18px_70px_rgba(0,0,0,0.4)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.7))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[148px] shrink-0 snap-start sm:w-[176px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.24em]',
    heroTitle: 'text-4xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl lg:text-[5.5rem]',
    sectionTitle: 'text-3xl font-black tracking-[-0.06em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-[#0d1f14] transition hover:opacity-90`,
    secondary: `inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/5`,
    accent: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-[#0d1f14] transition hover:opacity-90`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.4rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(0,0,0,0.3)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, like the MysteryCoder reference layout.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
