export interface Link {
  label: string;
  href: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface FloatingCard {
  title: string;
  description: string;
  icon: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: Link;
  secondaryCta: Link;
  stats: HeroStat[];
  image: ImageAsset;
  floatingCards: FloatingCard[];
}

export interface TrustItem {
  label: string;
  value: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  stat: string;
  icon: string;
}

export interface FeatureSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  items: FeatureItem[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  tagline: string;
  image: ImageAsset;
  specs: ProductSpec[];
  primaryCta: Link;
}

export interface InventoryHighlight {
  eyebrow: string;
  title: string;
  description: string;
  cta: Link;
  image: ImageAsset;
}

export interface ProductSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  filters: string[];
  items: ProductItem[];
  inventoryHighlight: InventoryHighlight;
  viewMoreLabel?: string;
  viewMoreHref?: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  highlight: string;
}

export interface TestimonialSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  items: TestimonialItem[];
}

export interface CtaSectionItem {
  id: string;
  variant: 'split' | 'centered';
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: Link;
  secondaryCta?: Link;
  image?: ImageAsset;
  bullets?: string[];
}

export interface HomePageContent {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    openGraphImage: string;
  };
  navigation: {
    announcement: string;
    links: Link[];
    primaryCta: Link;
  };
  hero: HeroContent;
  trustStrip: TrustItem[];
  features: FeatureSectionContent;
  products: ProductSectionContent;
  testimonials: TestimonialSectionContent;
  ctas: CtaSectionItem[];
}

export interface FooterColumn {
  title: string;
  links: Link[];
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultLocale: string;
  brandTagline: string;
  footer: {
    description: string;
    newsletterTitle: string;
    newsletterDescription: string;
    footerColumns: FooterColumn[];
    contact: {
      phone: string;
      email: string;
      address: string;
    };
    socialLinks: Link[];
    legalLinks: Link[];
  };
}
