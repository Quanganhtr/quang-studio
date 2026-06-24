export type ProjectStat = {
  value: string;
  share?: string;
  label: string;
};

export type QuotePart = {
  text: string;
  highlight?: boolean;
};

export type ProjectTestimonial = {
  quote: QuotePart[];
  author: string;
  role: string;
};

export type Project = {
  index: string;
  title: string;
  slug: string;
  category?: string;
  thumbnail: string;
  liveUrl: string;
  comingSoon?: boolean;
  comingSoonText?: string;
  comingSoonButton?: { label: string; href: string };
  tagline?: string;
  description?: string;
  scope?: string[];
  statsCaption?: string;
  stats?: ProjectStat[];
  coverVideo?: string;
  gridLeftVideo?: string;
  gridLeftImage?: string;
  gridRightImage?: string;
  closingVideo?: string;
  closingImage?: string;
  testimonial?: ProjectTestimonial;
};

export const isVideoSrc = (src: string) => /\.(webm|mp4)$/i.test(src);

export type AIGeneratedItem = {
  eyebrow: string;
  title: string;
  media: { type: "video" | "image"; src: string };
  linkUrl: string;
};

export const AI_GENERATED: AIGeneratedItem[] = [
  {
    eyebrow: "##1",
    title: "Meow-Potter",
    media: { type: "video", src: "/ai-1.webm" },
    linkUrl: "https://x.com/MinswapDEX/status/2051159771542434037?s=20",
  },
  {
    eyebrow: "##2",
    title: "Meow at the gym",
    media: { type: "video", src: "/ai-2.webm" },
    linkUrl: "https://www.linkedin.com/posts/quanganhtr_another-day-with-minswap-activity-7472871091057676288-2fTu?utm_source=share&utm_medium=member_desktop&rcm=ACoAADXVCPUBTL7JRwX1DDzE4RoanBCOrXLOhxQ",
  },
  {
    eyebrow: "##3",
    title: "Cat-tronaut",
    media: { type: "video", src: "/ai-3.webm" },
    linkUrl: "https://x.com/MinswapDEX/status/2044315918625615993?s=20",
  },
];

export const PROJECTS: Project[] = [
  {
    index: "My Proudest Child", title: "Minswap", slug: "minswap",
    thumbnail: "/minswap-thumbnail.webm", liveUrl: "https://eternl-dapp-browser.minswap.org/",
    tagline: "Cardano's biggest DEX",
    description: "Minswap has grown into Cardano's leading decentralized exchange, serving traders and liquidity providers through swaps, farming, liquidity, and aggregated trade routing.",
    scope: ["Brand Identity", "Design System", "Product & UX Design", "Motion Design", "Creative Strategy", "Content Strategy (for video)", "Growth Design"],
    coverVideo: "/minswap-shot-1.webm",
    gridLeftVideo: "/minswap-shot-2.webm",
    gridRightImage: "/minswap-shot-3.png",
    statsCaption: "Minswap's performance and share of the Cardano market.\nData as of June 21, 2026.",
    stats: [
      { value: "$9.38B",  share: "67.2% share", label: "Total trading volume" },
      { value: "$20.60M", share: "50% share",   label: "Total value locked" },
      { value: "$20.02M", share: "60.6% share", label: "Total fees generated" },
      { value: "220K+",                         label: "Unique users" },
    ],
    closingVideo: "/minswap-shot-4.webm",
    closingImage: "/minswap-shot-5.webp",
    testimonial: {
      quote: [
        { text: "Working with Quang Anh was " },
        { text: "one of the easiest decisions I've made", highlight: true },
        { text: " on the design side of our team. " },
        { text: "His work directly contributed to real outcomes for the business.", highlight: true },
        { text: " He understands that great design is a tool for results, not just aesthetics." },
      ],
      author: "Adrián Elsässer Briones",
      role: "Head of growth",
    },
  },
  {
    index: "The Second-Born Star", title: "Noodles.fi", slug: "noodles-fi",
    thumbnail: "/noodles-thumbnail.webm", liveUrl: "https://app.noodles.fi",
    tagline: "Your Homepage for SUI",
    description: "Noodles is a platform that enables users to discover and act on the best opportunities in Sui. From Analytics to Swaps to Vaults, we aim to be the gateway to Sui",
    scope: ["Brand Identity", "Design System", "Product & UX Design", "Motion Design", "Creative Strategy", "Content Strategy (for video)", "Growth Design"],
    coverVideo: "/noodles-shot-1.webm",
    statsCaption: "Noodles.fi's performance.\nData as of January 01, 2026.",
    stats: [
      { value: "80K+",    label: "Total users" },
      { value: "30K",     label: "Monthly active users" },
      { value: "12,500%", label: "User growth since launch" },
      { value: "13.9K",   label: "Followers gained" },
    ],
    gridLeftVideo: "/noodles-thumbnail.webm",
    gridRightImage: "/noodles-shot-2.webp",
    closingVideo: "/noodles-shot-4.webm",
    closingImage: "/noodles-shot-4.webp",
    testimonial: {
      quote: [
        { text: "At Noodles, he played a key role in translating complex Web3 mechanics into intuitive, clean, and highly scannable UI that our community loved. " },
        { text: "He ship fast, iterate based on real feedback, and are incredibly easy to collaborate with." },
      ],
      author: "Hiep Ho",
      role: "Co-founder of Noodles.fi",
    },
  },
  { index: "03",                title: "Ada.fun",    slug: "ada-fun",    category: "Product Design", thumbnail: "/adafun-thumbnail.webp",     liveUrl: "#", comingSoon: true },
  { index: "04",                title: "Reviewnha",  slug: "reviewnha",  category: "UX Research",    thumbnail: "/reviewnha-thumbnail.webp",  liveUrl: "#", comingSoon: true },
  {
    index: "05", title: "Fruit map", slug: "fruit-map", category: "Motion",
    thumbnail: "/vietnam-thumbnail.webp", liveUrl: "#", comingSoon: true,
    comingSoonText: "It's currently unavailable on the site. You can check it on my Behance",
    comingSoonButton: { label: "Go to Behance", href: "https://www.behance.net/gallery/114116483/Vietnam-Fruit-Map-UXUI-Design" },
  },
  { index: "06",                title: "My Gu",      slug: "my-gu",      category: "Product Design", thumbnail: "/mygu-thumbnail.webp",       liveUrl: "#", comingSoon: true },
];
