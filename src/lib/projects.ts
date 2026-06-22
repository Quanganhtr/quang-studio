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
  category: string;
  thumbnail: string;
  liveUrl: string;
  comingSoon?: boolean;
  tagline?: string;
  description?: string;
  scope?: string[];
  statsCaption?: string;
  stats?: ProjectStat[];
  coverVideo?: string;
  gridLeftVideo?: string;
  gridRightImage?: string;
  closingVideo?: string;
  closingImage?: string;
  testimonial?: ProjectTestimonial;
};

export const PROJECTS: Project[] = [
  {
    index: "My Proudest Child", title: "Minswap", slug: "minswap", category: "Product Design",
    thumbnail: "/minswap-thumbnail.gif", liveUrl: "https://minswap.org",
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
    closingVideo: "/minswap-shot-4.mp4",
    closingImage: "/minswap-shot-5.png",
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
  { index: "02",                title: "Reviewnha",  slug: "reviewnha",  category: "UX Research",    thumbnail: "/reviewnha-thumbnail.png",  liveUrl: "#", comingSoon: true },
  { index: "03",                title: "Ada.fun",    slug: "ada-fun",    category: "Product Design", thumbnail: "/adafun-thumbnail.png",     liveUrl: "#", comingSoon: true },
  { index: "04",                title: "Noodles.fi", slug: "noodles-fi", category: "Branding",       thumbnail: "/noodles-thumbnail.gif",    liveUrl: "#", comingSoon: true },
  { index: "05",                title: "Fruit map",  slug: "fruit-map",  category: "Motion",         thumbnail: "/vietnam-thumbnail.png",    liveUrl: "#", comingSoon: true },
  { index: "06",                title: "My Gu",      slug: "my-gu",      category: "Product Design", thumbnail: "/mygu-thumbnail.png",       liveUrl: "#", comingSoon: true },
];
