export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface SkillNode {
  name: string;
  level: number; // 1-5 representation
  category: "Languages" | "Frameworks" | "Tools" | "Design" | "Other";
}

export interface PortfolioTheme {
  id: string;
  name: string;
  primaryColor: string; // Tailwind color class or hex values
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  cardBgColor: string;
  fontFamily: "Inter" | "Space Grotesk" | "JetBrains Mono" | "Playfair Display";
  borderRadius: "none" | "md" | "2xl" | "full";
  borderStyle: "none" | "thin" | "bold-brutalist" | "glowing-neon";
  badgeStyle: "pill" | "outline" | "flat";
}

export interface AnimationSettings {
  entryPreset: "slideUp" | "fadeIn" | "scaleUp" | "staggered-reveal";
  interactivity: "spring-heavy" | "smooth-glide" | "ultra-fast" | "dreamy-slow";
  hoverEffect: "lift-up" | "glow-neon" | "scale-up" | "brutalist-offset" | "magnetic-shift";
  scrollAnimation: boolean;
}

export interface PortfolioData {
  personalInfo: {
    fullName: string;
    roleTitle: string;
    summary: string;
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
    avatarUrl?: string;
  };
  skills: SkillNode[];
  projects: Project[];
  experience: Experience[];
  theme: PortfolioTheme;
  animations: AnimationSettings;
  layouts: {
    sectionOrder: string[]; // e.g., ["hero", "skills", "projects", "experience", "contact"]
    heroVariant: "minimal" | "split" | "interactive-grid";
    showSocialWidgets: boolean;
  };
}

export const initialPortfolioData: PortfolioData = {
  personalInfo: {
    fullName: "Elena Rostova",
    roleTitle: "Creative Front-End Engineer & Interaction Designer",
    summary: "Crafting highly tailored digital interfaces that blend sophisticated animation with performance-oriented code. Specialized in React, threeJS elements, dynamic Tailwind custom modules, and high-fidelity transitions.",
    email: "elena@rostova.design",
    github: "github.com/elena-rostova",
    linkedin: "linkedin.com/in/elena-rostova",
    twitter: "twitter.com/elena_pixels",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400"
  },
  skills: [
    { name: "TypeScript", level: 5, category: "Languages" },
    { name: "JavaScript", level: 5, category: "Languages" },
    { name: "CSS/Tailwind", level: 5, category: "Languages" },
    { name: "Rust", level: 3, category: "Languages" },
    { name: "React / Next.js", level: 5, category: "Frameworks" },
    { name: "Framer Motion", level: 5, category: "Frameworks" },
    { name: "Three.js", level: 4, category: "Frameworks" },
    { name: "Vite / Webpack", level: 4, category: "Tools" },
    { name: "Git / Workflows", level: 4, category: "Tools" },
    { name: "Figma UX Design", level: 5, category: "Design" }
  ],
  projects: [
    {
      id: "p1",
      title: "Zenith Workspace Layouts",
      description: "An entirely custom orchestrator for workspace templates featuring custom drag-and-drop mechanics, interactive layout grids, and elastic physics animations.",
      techStack: ["React", "Framer Motion", "TailwindCSS"],
      github: "https://github.com/example/zenith",
      link: "https://zenith-workspace.io",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "p2",
      title: "Vesperal Synth Audio Engine",
      description: "An in-browser synthesized sound engine that renders dynamic audio loops into beautiful, audio-reactive canvas visuals with real-time feedback loop processing.",
      techStack: ["Web Audio API", "Vanilla JS", "HTML5 Canvas"],
      github: "https://github.com/example/vesperal",
      link: "https://vesperal-synth.io",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"
    }
  ],
  experience: [
    {
      id: "exp1",
      company: "Aetherial Labs",
      role: "Lead Creative Technologist",
      startDate: "2024",
      endDate: "Present",
      description: [
        "Pioneered the development of modular front-end UI systems leading to a 40% rise in user exploration metrics.",
        "Engineered the layout orchestration engine for high-traffic real-time dashboard analytics, managing fluid canvas components.",
        "Standardized animation guidelines using stateful motion controllers based on lightweight Spring physics."
      ]
    },
    {
      id: "exp2",
      company: "Monolith Media Group",
      role: "Front-End Developer",
      startDate: "2022",
      endDate: "2024",
      description: [
        "Crafted robust immersive agency sites with parallax elements, modular templates, and highly dynamic CSS grids.",
        "Built customized micro-interactions for active elements that reduced customer drop-off by 25%."
      ]
    }
  ],
  theme: {
    id: "brutalist-slate",
    name: "Brutalist Slate",
    primaryColor: "#1a1a1a",
    secondaryColor: "#e0f2fe",
    accentColor: "#f43f5e",
    bgColor: "#f8fafc",
    textColor: "#0f172a",
    cardBgColor: "#ffffff",
    fontFamily: "Space Grotesk",
    borderRadius: "none",
    borderStyle: "bold-brutalist",
    badgeStyle: "pill"
  },
  animations: {
    entryPreset: "slideUp",
    interactivity: "spring-heavy",
    hoverEffect: "brutalist-offset",
    scrollAnimation: true
  },
  layouts: {
    sectionOrder: ["hero", "skills", "projects", "experience"],
    heroVariant: "split",
    showSocialWidgets: true
  }
};

// Preset gallery of themes
export const THEME_PRESETS: PortfolioTheme[] = [
  {
    id: "brutalist-slate",
    name: "Brutalist Slate",
    primaryColor: "#111827",
    secondaryColor: "#f3f4f6",
    accentColor: "#f43f5e",
    bgColor: "#f9fafb",
    textColor: "#111827",
    cardBgColor: "#ffffff",
    fontFamily: "Space Grotesk",
    borderRadius: "none",
    borderStyle: "bold-brutalist",
    badgeStyle: "outline"
  },
  {
    id: "neon-cyberpunk",
    name: "Neon Cyberpunk",
    primaryColor: "#0d0f14",
    secondaryColor: "#171923",
    accentColor: "#10b981", // Emerald Neon
    bgColor: "#09090e",
    textColor: "#e2e8f0",
    cardBgColor: "#0f111c",
    fontFamily: "JetBrains Mono",
    borderRadius: "md",
    borderStyle: "glowing-neon",
    badgeStyle: "outline"
  },
  {
    id: "cosmic-abths",
    name: "Aura Purple",
    primaryColor: "#6366f1",
    secondaryColor: "#e0e7ff",
    accentColor: "#d946ef",
    bgColor: "#f8fafc",
    textColor: "#1e1b4b",
    cardBgColor: "#ffffff",
    fontFamily: "Inter",
    borderRadius: "2xl",
    borderStyle: "thin",
    badgeStyle: "pill"
  },
  {
    id: "minimal-editorial",
    name: "Editorial Serif",
    primaryColor: "#1c1917",
    secondaryColor: "#fafaf9",
    accentColor: "#78716c",
    bgColor: "#faf9f6",
    textColor: "#1c1917",
    cardBgColor: "#ffffff",
    fontFamily: "Playfair Display",
    borderRadius: "none",
    borderStyle: "none",
    badgeStyle: "flat"
  },
  {
    id: "mint-fresh",
    name: "Mint Pastel",
    primaryColor: "#059669",
    secondaryColor: "#ecfdf5",
    accentColor: "#10b981",
    bgColor: "#f0fdf4",
    textColor: "#064e3b",
    cardBgColor: "#ffffff",
    fontFamily: "Inter",
    borderRadius: "full",
    borderStyle: "thin",
    badgeStyle: "pill"
  }
];

export const ANIMATION_PRESETS: { id: string; name: string; settings: AnimationSettings }[] = [
  {
    id: "elastic-fun",
    name: "Elastic Playful",
    settings: {
      entryPreset: "scaleUp",
      interactivity: "spring-heavy",
      hoverEffect: "magnetic-shift",
      scrollAnimation: true
    }
  },
  {
    id: "smooth-pro",
    name: "Cinematic Smooth",
    settings: {
      entryPreset: "staggered-reveal",
      interactivity: "dreamy-slow",
      hoverEffect: "lift-up",
      scrollAnimation: true
    }
  },
  {
    id: "cyber-flash",
    name: "Static & Snappy",
    settings: {
      entryPreset: "fadeIn",
      interactivity: "ultra-fast",
      hoverEffect: "glow-neon",
      scrollAnimation: false
    }
  },
  {
    id: "raw-brutal",
    name: "Bold Offset Brutalism",
    settings: {
      entryPreset: "slideUp",
      interactivity: "spring-heavy",
      hoverEffect: "brutalist-offset",
      scrollAnimation: true
    }
  }
];
