// =============================================================================
// S&D Media - Wedding Video Editing Configuration
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "S&D Media – Professional Wedding Video Editing",
  description:
    "Fast, cinematic wedding video editing services for videographers. 24-48 hour highlights, 7-8 day full films, reliable post-production partner.",
  language: "en",
  keywords: [
    "wedding video editing",
    "professional video editing",
    "wedding videographer post production",
    "cinematic wedding films",
    "fast turnaround video editing",
    "wedding highlight editing",
  ],
  ogImage: "/og-image.jpg", // recommended size: 1200×630
  canonical: "https://sndmedia.co",
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavLink {
  name: string;
  href: string;
  icon?: string; // optional – used if your nav renders icons
}

export interface NavigationConfig {
  brandName: string;
  brandHighlight: string; // the part in green/yellow
  tagline?: string;
  navLinks: NavLink[];
  ctaButtonText: string;
  ctaButtonHref: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "S&D",
  brandHighlight: "Media",
  tagline: "Wedding Video Editing",
  navLinks: [
    { name: "Home", href: "#home" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Pricing", href: "#pricing" },
    { name: "Our Team", href: "/team" }, // external page
     { name: "Made For",  href: "/made-for" }, // new page
  ],
  ctaButtonText: "Start a Project",
  ctaButtonHref: "#pricing",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export type PreloaderConfig = {
  brandName: string;
  brandHighlight?: string;
  tagline?: string; // add this
  yearText?: string;
};

export const preloaderConfig: PreloaderConfig = {
  brandName: "S&D",
  brandHighlight: "Media",
  tagline: "Wedding Video Editing",
  yearText: "Est. 2021",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number | string;
  suffix?: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
  stats: HeroStat[];
  decorativeText: string;
  // videoPoster: string;
  videoSrc: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "WEDDING VIDEO EDITING",
  mainTitle: "Wedding Films That Couples\n Remember",
  subtitle: "Professional postproduction for wedding videographers who refuse to compromise on quality or deadlines even during peak season.",
  ctaPrimaryText: "View Pricing",
  ctaPrimaryHref: "#pricing",
  ctaSecondaryText: "See Portfolio",
  ctaSecondaryHref: "#portfolio",
  stats: [
    { value: 500, suffix: "+", label: "Weddings Edited" },
    { value: "24-48", suffix: "hr", label: "Highlight Turnaround" },
    { value: 98, suffix: "%", label: "Client Satisfaction" },
  ],
  decorativeText: "CINEMATIC · EMOTIONAL · TIMELESS",

  // Your local video
  // videoPoster: "/couple.jpg", // updated poster image
  videoSrc: "/77929-564459462_tiny.mp4",
};

// -----------------------------------------------------------------------------
// Trusted By Config
// -----------------------------------------------------------------------------
export interface ClientLogo {
  name: string;
  logo?: string; // path or url – if missing, can use name as fallback
  href?: string;
}

export interface TrustedByConfig {
  heading: string;
  subheading?: string;
  clients: ClientLogo[];
}

export const trustedByConfig: TrustedByConfig = {
  heading: "Trusted By Leading Wedding Videographers",
  subheading: "Across the UK, Europe & beyond",
  clients: [
    { name: "Forever Films", href: "#" },
    { name: "Moments Studio", href: "#" },
    { name: "Love Story Studios", href: "#" },
    { name: "Eternal Captures", href: "#" },
    { name: "Bliss Weddings", href: "#" },
    { name: "Vow & Vision", href: "#" },
    { name: "Cherish Films", href: "#" },
    { name: "Timeless Reels", href: "#" },
  ],
};

// -----------------------------------------------------------------------------
// Built for Videographers (WineShowcase)
// -----------------------------------------------------------------------------
export interface FeaturePoint {
   title: string;
  description: string;
  logo?: string; 
}

export interface BuiltForConfig {
  scriptText: string;
  mainTitle: string;
  subtitle: string;
  features: FeaturePoint[];
}

export const builtForConfig: BuiltForConfig = {
  scriptText: "BUILT FOR WEDDING VIDEOGRAPHERS",
  mainTitle: "Your Post-Production Partner",
  subtitle: "We handle editing so you can focus on getting more clients.",
  features: [
    {
      title: "Time Saving",
      description:
        " Stuck in editing delays your ability to shoot more weddings and scale your business. We streamline post-production so you can focus on filming and growth.",
      logo: "/Time Saving.png",
    },
    {
      title: "Quality",
      description:
        "Achieving cinematic quality and modern wedding styles requires focus and expertise. Since post production is our sole priority, we're dedicated to elevating the final film beyond standard edits.",
      logo: "/Q u a l i t y.png",
    },
    {
      title: "Peak Season Burnout",
      description:
        "During peak season, edits often become rushed and repetitive due to workload. We ensure each wedding film remains creatively distinct and crafted like a story.",
      logo: "/Peak Season Burnout.png",
    },
    {
      title: "Reliability",
      description:
        "Wedding footage demands trust, security, and dependable timelines. With a system refined over 3 years, we deliver consistency you can rely on especially when it matters most.",
      logo: "/trust.png",  // updated from /Reliable-Editing-Partner.png
    },
  ],
};

// -----------------------------------------------------------------------------
// What Makes Us Different (Museum)
// -----------------------------------------------------------------------------
export interface SpecialFeature {
  number: string;
  title: string;
  description: string;
}

export interface WhatMakesSpecialConfig {
  scriptText: string;
  mainTitle: string;
  subtitle: string;
  introText: string;
  features: SpecialFeature[];

}

export const whatMakesSpecialConfig: WhatMakesSpecialConfig = {
  scriptText: "WHY VIDEOGRAPHERS CHOOSE US",
  mainTitle: "What Makes Us Different",
  subtitle: "Six reasons wedding videographers trust us with their clients footage.",
  introText: "We don’t just edit — we protect your time, your brand, and your reputation.",
  features: [
    { number: "01", title: "LARGE DATA MANAGEMENT:", description: "Over the last 3 years, we have securely handled more than 500TB of wedding footage, with a system built to manage large files smoothly and efficiently. " },
    { number: "02", title: "Wedding Specialists", description: "Our editors are not just technicians many have filmmaking backgrounds and understand emotional pacing, narrative flow, and cinematic wedding storytelling." },
    { number: "03", title: "High-End Workstations", description: "Equipped with high-performance Windows and Apple systems optimized for 4K 10-bit Log footage from cameras like Sony FX3, Canon R6, and Sony A7S III." },
    { number: "04", title: "4 REVISIONS WORKFLOW ", description: "We offer 4 sets of revisions, one between you and our team for alignment, followed by 3 revision rounds for your client to ensure the final film matches their expectations perfectly" },
    { number: "05", title: "FAST TURNAROUND TIME:", description: "Our dedicated workflow and specialized wedding editing pipeline allow us to deliver highlights within 48-72 hours, even during peak season, without compromising quality." },
    { number: "06", title: "DATA PRIVACY:", description: "All projects are managed exclusively by our in-house team of 9 carefully selected editors, ensuring complete confidentiality and secure handling of every client’s footage." },
  ],
};
// -----------------------------------------------------------------------------
// Portfolio Config
// -----------------------------------------------------------------------------
export interface PortfolioItem {
  id: string;
  title: string;
  couple: string;
  image: string;
  category: string;
  videoUrl?: string;
}

export interface PortfolioConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  tabs: string[];
  items: PortfolioItem[];
}

export const portfolioConfig: PortfolioConfig = {
  scriptText: "CURATED WORK",
  subtitle: "PORTFOLIO",
  mainTitle: "Wedding Films We've Edited",
  tabs: ["All", "Teaser", "Highlight", "Full Film", "Reels"],
  items: [
    { id: "1", title: "Golden Hour Vows", couple: "Emma & James", image: "/portfolio/1.jpg", category: "Highlight" },
    { id: "2", title: "First Dance Magic", couple: "Sarah & Liam", image: "/portfolio/2.jpg", category: "Teaser" },
    { id: "3", title: "Rustic Romance", couple: "Olivia & Noah", image: "/portfolio/3.jpg", category: "Full Film" },
    { id: "4", title: "Sunset Tears", couple: "Ava & Ethan", image: "/portfolio/4.jpg", category: "Reels" },
    { id: "5", title: "Church Bells", couple: "Mia & Lucas", image: "/portfolio/5.jpg", category: "Highlight" },
    { id: "6", title: "Beach Forever", couple: "Isabella & Mason", image: "/portfolio/6.jpg", category: "Teaser" },
  ],
};

// -----------------------------------------------------------------------------
// Video Testimonials Config
// -----------------------------------------------------------------------------
export interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  thumbnail: string;
  videoUrl?: string;
  rating?: number;
}

export interface VideoTestimonialsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  testimonials: VideoTestimonial[];
}

export const videoTestimonialsConfig: VideoTestimonialsConfig = {
  scriptText: "REAL VOICES",
  subtitle: "VIDEO TESTIMONIALS",
  mainTitle: "What Our Clients Say",
  testimonials: [
    {
      id: "1",
      name: "Mark Thompson",
      role: "Lead Videographer",
      company: "Forever Films",
      thumbnail: "/testimonials/mark.jpg",
      rating: 5,
    },
    {
      id: "2",
      name: "Lisa Anderson",
      role: "Creative Director",
      company: "Love Story Studios",
      thumbnail: "/testimonials/lisa.jpg",
      rating: 5,
    },
    {
      id: "3",
      name: "David Chen",
      role: "Founder",
      company: "Eternal Moments",
      thumbnail: "/testimonials/david.jpg",
      rating: 5,
    },
    {
      id: "4",
      name: "Emma Wilson",
      role: "Senior Editor",
      company: "Bliss Weddings",
      thumbnail: "/testimonials/emma.jpg",
      rating: 5,
    },
  ],
};

// -----------------------------------------------------------------------------
// Pricing Config (updated structure)
// -----------------------------------------------------------------------------
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price?: string | number;
  popular?: boolean;
  buttonText: string;
  features: string[];
}

export interface PricingConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  turnaroundNote: string;
  plans: PricingPlan[];
}

export const pricingConfig: PricingConfig = {
  scriptText: "CLEAR & FAIR",
  subtitle: "PRICING",
  mainTitle: "Choose How You Work With Us",
  turnaroundNote: "All editing delivered in 7–8 working days • Highlights in 24–48 hours during peak",
  plans: [
    {
      id: "bundle",
      name: "The Wedding Bundle",
      description: "Teaser + Highlight + Full Film",
      price: 499,
      popular: true,
      buttonText: "Order Bundle",
      features: [
        "1 Teaser (30–60 sec)",
        "1 Highlight Film (3–5 min)",
        "1 Full Length Film (15–40 min)",
        "4 revision rounds",
        "Priority support",
      ],
    },
    {
      id: "custom",
      name: "Custom Order",
      description: "Pick exactly what you need",
      buttonText: "Build Your Package",
      features: [
        "Any combination of videos",
        "Per-video pricing",
        "Volume discounts (3+ videos)",
        "4 revision rounds",
        "Fast-track delivery available",
      ],
    },
    {
      id: "dedicated",
      name: "Dedicated Editor",
      description: "Your own full-time editor",
      buttonText: "Book Discovery Call",
      features: [
        "8 hrs/day – 5 days/week",
        "Dedicated workstation",
        "2 TB secure cloud storage",
        "In-house QC every project",
        "Unlimited small revisions",
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Text Reviews Config
// -----------------------------------------------------------------------------
export interface TextReview {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  image?: string;
  avatar?: string;
  rating?: number;
}

export interface TextReviewsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  reviews: TextReview[];
}

export const textReviewsConfig: TextReviewsConfig = {
  scriptText: "TRUSTED REVIEWS",
  subtitle: "WHAT VIDEOGRAPHERS SAY",
  mainTitle: "Loved by Wedding Filmmakers",
  reviews: [
    {
      id: "1",
      name: "James Richardson",
      role: "Founder",
      company: "Forever Films",
      text: "S&D turned editing from a bottleneck into a superpower. 24–48 hr highlights during summer? Game changer.",
      image: "/avatars/james.jpg",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
    },
    {
      id: "2",
      name: "Amanda Foster",
      role: "Creative Director",
      company: "Love Story Studios",
      text: "They understand wedding emotion better than most shooters I know. Every film feels personal, never cookie-cutter.",
      image: "/avatars/amanda.jpg",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
    },
    {
      id: "3",
      name: "Michael Chen",
      role: "Lead Videographer",
      company: "Eternal Moments",
      text: "4 revision rounds built into the process means happy clients and zero stress for me.",
      image: "/avatars/michael.jpg",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
    },
    {
      id: "4",
      name: "Sarah Williams",
      role: "Owner",
      company: "Bliss Weddings",
      text: "500 TB+ handled without a single issue. That level of experience gives total peace of mind.",
      image: "/avatars/sarah.jpg",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
    },
    {
      id: "5",
      name: "David Park",
      role: "Director",
      company: "Romance Reels",
      text: "Dedicated editor option let us double our bookings without hiring in-house. Best ROI decision we made.",
      image: "/avatars/david.jpg",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
    },
  ],
};

// -----------------------------------------------------------------------------
// Team Config
// -----------------------------------------------------------------------------
export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface TeamConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  members: TeamMember[];
  behindScenesImage: string;
}

export const teamConfig: TeamConfig = {
  scriptText: "THE EDITORS BEHIND THE MAGIC",
  subtitle: "OUR TEAM",
  mainTitle: "Meet the People Who Bring Your Films to Life",
  introText:
    "9 full-time specialists who live and breathe wedding storytelling — no freelancers, no compromises.",
  members: [
    { id: "1", name: "Saad Ahmed", title: "Founder & Lead Editor", bio: "...", image: "/team/saad.jpg" },
    { id: "2", name: "Danish Malik", title: "Co-Founder & Senior Editor", bio: "...", image: "/team/danish.jpg" },
    // add remaining 7 members similarly
  ],
  behindScenesImage: "/behind-scenes.jpg",
};

// -----------------------------------------------------------------------------
// Contact Form Config
// -----------------------------------------------------------------------------
export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ContactFormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  submittingText: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  form: ContactFormFields;
  privacyNotice: string;
  formEndpoint: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Get In Touch",
  subtitle: "CONTACT US",
  mainTitle: "Let's Discuss Your Project",
  introText: "Ready to elevate your wedding films? Get in touch and let's discuss how we can help you deliver cinematic masterpieces to your couples.",
  contactInfoTitle: "Contact Information",
  contactInfo: [
    {
      icon: "MapPin",
      label: "Address",
      value: "32 Hollywall Ln, Stoke-on-Trent ST6 5PP, UK",
      subtext: "Visit our editing studio",
    },
    {
      icon: "Phone",
      label: "Phone",
      value: "+44 7962 696177",
      subtext: "Mon-Fri, 9am-6pm GMT",
    },
    {
      icon: "Mail",
      label: "Email",
      value: "Info@sndmedia.co",
      subtext: "We reply within 24 hours",
    },
    {
      icon: "Clock",
      label: "Working Hours",
      value: "Monday - Friday, 9AM - 6PM GMT",
      subtext: "Weekend support available",
    },
  ],
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "John Smith",
    emailLabel: "Email Address",
    emailPlaceholder: "john@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+44 1234 567890",
    companyLabel: "Company Name",
    companyPlaceholder: "Your Wedding Film Company",
    messageLabel: "Your Message",
    messagePlaceholder: "Tell us about your project and requirements...",
    submitText: "Send Message",
    submittingText: "Sending...",
    successMessage: "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
    errorMessage: "Oops! Something went wrong. Please try again or contact us directly.",
  },
  privacyNotice: "By submitting this form, you agree to our privacy policy. Your information will be kept confidential.",
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContactItem {
  icon: string;
  text: string;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  contactItems: FooterContactItem[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: string[];
  backToTopText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "S&D Media",
  tagline: "Wedding Video Editing",
  description: "Professional post-production services for wedding videographers. Fast turnaround, cinematic quality, and reliable partnership.",
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://www.instagram.com/snd_media_/" },
    { icon: "Facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61564998653910" },
    { icon: "Linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/snd-media-ltd/" },
    { icon: "Youtube", label: "YouTube", href: "http://www.youtube.com/@SplicenDiceMedia" },
  ],
  linkGroups: [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "#home" },
        { name: "Portfolio", href: "#portfolio" },
        { name: "Pricing", href: "#pricing" },
        { name: "Our Team", href: "#team" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Video Editing", href: "#pricing" },
        { name: "Color Grading", href: "#pricing" },
        { name: "Sound Design", href: "#pricing" },
        { name: "Motion Graphics", href: "#pricing" },
      ],
    },
  ],
  contactItems: [
    { icon: "MapPin", text: "32 Hollywall Ln, Stoke-on-Trent ST6 5PP, UK" },
    { icon: "Phone", text: "+44 7962 696177" },
    { icon: "Mail", text: "Info@sndmedia.co" },
  ],
  newsletterLabel: "Subscribe to our newsletter",
  newsletterPlaceholder: "Enter your email",
  newsletterButtonText: "Subscribe",
  newsletterSuccessText: "Thank you for subscribing!",
  newsletterErrorText: "Something went wrong. Please try again.",
  newsletterEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
  copyrightText: "© 2026 S&D Media. All rights reserved.",
  legalLinks: ["Privacy Policy", "Terms of Service"],
  backToTopText: "Back to top",
};

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export interface ScrollToTopConfig {
  ariaLabel: string;
}

export const scrollToTopConfig: ScrollToTopConfig = {
  ariaLabel: "Back to top",
};
