export const PROJECTS = [
  { index: "My Proudest Child", title: "Minswap",    slug: "minswap",    category: "Product Design", thumbnail: "/minswap-thumbnail.gif",   liveUrl: "#" },
  { index: "02",                title: "Reviewnha",  slug: "reviewnha",  category: "UX Research",    thumbnail: "/reviewnha-thumbnail.png",  liveUrl: "#" },
  { index: "03",                title: "Ada.fun",    slug: "ada-fun",    category: "Product Design", thumbnail: "/adafun-thumbnail.png",     liveUrl: "#" },
  { index: "04",                title: "Noodles.fi", slug: "noodles-fi", category: "Branding",       thumbnail: "/noodles-thumbnail.gif",    liveUrl: "#" },
  { index: "05",                title: "Fruit map",  slug: "fruit-map",  category: "Motion",         thumbnail: "/vietnam-thumbnail.png",    liveUrl: "#" },
  { index: "06",                title: "My Gu",      slug: "my-gu",      category: "Product Design", thumbnail: "/mygu-thumbnail.png",       liveUrl: "#" },
];

export type Project = typeof PROJECTS[number];
