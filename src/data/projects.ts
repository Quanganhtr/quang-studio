export type Project = {
  id: string;
  title: string;
  category: string;       // e.g. "Product Design", "Branding", "UX Research"
  year: string;           // e.g. "2024"
  description: string;    // short summary shown on the card
  tags: string[];         // e.g. ["Figma", "iOS", "B2B"]
  coverImage: string;     // path to image in /public/images/ folder
  featured: boolean;      // show in featured section?
  slug: string;           // URL: /work/your-slug
  // Case study page (leave empty if no case study)
  caseStudy?: {
    overview: string;
    role: string;
    duration: string;
    tools: string[];
    sections: {
      title: string;
      body: string;
      image?: string;
    }[];
  };
};

const projects: Project[] = [
  {
    id: "1",
    title: "Project Title",
    category: "Product Design",
    year: "2024",
    description: "A short one or two sentence description of what this project is about and the problem it solved.",
    tags: ["Figma", "iOS", "B2B"],
    coverImage: "/images/project-1.jpg",
    featured: true,
    slug: "project-title",
    caseStudy: {
      overview: "Write a detailed overview of the project here.",
      role: "Lead Product Designer",
      duration: "3 months",
      tools: ["Figma", "Maze", "Notion"],
      sections: [
        {
          title: "The Problem",
          body: "Describe the problem you were solving.",
          image: "/images/project-1-problem.jpg",
        },
        {
          title: "The Solution",
          body: "Describe how you solved it.",
          image: "/images/project-1-solution.jpg",
        },
      ],
    },
  },
  // ── Add more projects below by copying the block above ──
];

export default projects;
