import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Creative work, profiles, and visual stories',
      description: 'Explore featured posts, portfolio-led profiles, and image-rich content in a bold editorial layout.',
      openGraphTitle: 'Creative work, profiles, and visual stories',
      openGraphDescription: 'A magazine-style home for visual discovery and professional profiles.',
      keywords: ['creative portfolio', 'visual discovery', 'profiles', 'editorial layout'],
    },
    hero: {
      badge: 'Fresh selections',
      title: ['Creative work', 'with a strong visual rhythm.'],
      description: 'Move through standout images, professional profiles, and supporting posts in a layout that feels bold, direct, and polished.',
      primaryCta: { label: 'Browse latest', href: '/article' },
      secondaryCta: { label: 'Explore visuals', href: '/image' },
      searchPlaceholder: 'Search posts, profiles, or categories',
      focusLabel: 'Focus',
      featureCardBadge: 'featured rotation',
      featureCardTitle: 'A homepage built around imagery, profiles, and quick discovery.',
      featureCardDescription: 'Recent posts, profiles, and supporting pages stay easy to scan without losing the visual energy of the page.',
    },
    intro: {
      badge: 'About this site',
      title: 'A connected space for public content, creative discovery, and professional profiles.',
      paragraphs: [
        'This site brings together image-led posts, portfolio-style profiles, and practical supporting pages in one clear browsing flow.',
        'Visitors can move naturally between featured content, archive pages, and details without losing context or momentum.',
        'The design keeps the layout lively while still being easy to scan on desktop and mobile.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Image-first browsing with a strong editorial stage.',
        'Profile and listing content presented with clear metadata.',
        'Archive pages that use different card treatments for variety.',
        'A responsive layout that stays polished on smaller screens.',
      ],
      primaryLink: { label: 'Browse profiles', href: '/profile' },
      secondaryLink: { label: 'See images', href: '/image' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'A clean visual system for posts, profiles, and featured pages.',
      description: 'Move between archive pages, detail pages, and discovery sections with a simple and consistent flow.',
      primaryCta: { label: 'Browse articles', href: '/article' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A clear space for visual discovery and public-facing profiles.',
    description: `${slot4BrandConfig.siteName} is designed to make browsing feel calm, expressive, and easy to follow.`,
    paragraphs: [
      'The site gives featured content a stronger stage while keeping the overall structure simple and readable.',
      'It is built to support images, profiles, and other public content types without making the layout feel generic.',
    ],
    values: [
      {
        title: 'Visual first',
        description: 'Images and covers lead the experience, with supporting text kept concise and readable.',
      },
      {
        title: 'Profile friendly',
        description: 'People, brands, and creators get a layout that gives identity and context more room.',
      },
      {
        title: 'Responsive by design',
        description: 'The page stays polished across desktop and mobile with clean spacing and clear hierarchy.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A simple way to ask about publishing, featured placements, or general support.',
    description: 'Send a note if you need help with a post, a profile, or a visual update. Keep it concise and clear.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, people, and categories across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find posts, profiles, and visuals faster.',
      description: 'Use keywords and categories to discover content across every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Log in to create a new post.',
      description: 'Use your account to open the publishing workspace and prepare content for the active sections.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Log in to continue browsing, managing submissions, and creating new content.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then log in.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
