import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Articles with a calmer editorial rhythm.',
    description: 'Use this page for guides, essays, stories, and longer posts that need breathing room.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Long-form content works best when hierarchy stays clear and distractions stay low.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving offers and time-sensitive posts.',
    description: 'Classified content should feel quick to scan, practical, and action-oriented.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Bookmark collections arranged like useful shelves.',
    description: 'Bookmark pages should feel calm, structured, and easy to skim.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and clear metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Profiles with identity and clear trust cues.',
    description: 'Profile pages should make people, brands, and creators feel easy to discover.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Creator cards'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'PDFs and documents presented as a useful archive.',
    description: 'Document pages should feel like downloadable guides, reports, and reference files.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Documents need archive cues, file context, and clear browsing.',
    chips: ['Documents', 'Guides', 'Archive ready'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Listings built for discovery and comparison.',
    description: 'Listing pages should behave like a directory with trust cues and practical browsing.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Prioritize comparison, location, and direct action paths.',
    chips: ['Directory', 'Compare', 'Business discovery'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with a gallery-first browsing experience.',
    description: 'Image pages should lead with visual impact, stronger cards, and a portfolio-like rhythm.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
