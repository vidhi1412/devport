import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side lazy-initialized Gemini API proxy route to prevent client errors and key exposure
  app.post("/api/generate-portfolio", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not defined. Please configure the Gemini API key in your terminal environment, or in a local .env file, or via the Settings > Secrets menu of AI Studio."
      });
    }

    try {
      const { prompt, currentData } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      // Lazy initialize the GoogleGenAI instance on the server side
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const model = "gemini-3.5-flash";

      const systemInstructions = `
You are a master creative UI engineer and creative design director.
The user wants to generate or modify a personalized developer portfolio website through a natural language request.
Analyze the user's prompt: "${prompt}".

You must return a raw JSON object matching the TypeScript type definition below.

Type Definition reference:
\`\`\`typescript
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
  level: number; // 1-5
  category: "Languages" | "Frameworks" | "Tools" | "Design" | "Other";
}

export interface PortfolioTheme {
  id: string;
  name: string;
  primaryColor: string; // Tailwind-compatible color hex (e.g., "#06b6d4" or "#10b981")
  secondaryColor: string; // Soft complementary light/dark shade
  accentColor: string; // Pop color hex (e.g., "#ec4899")
  bgColor: string; // Page background hex
  textColor: string; // High contrast text color hex
  cardBgColor: string; // Card element background hex
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
    sectionOrder: string[]; // e.g. ["hero", "skills", "projects", "experience"]
    heroVariant: "split";
    showSocialWidgets: boolean;
  };
}
\`\`\`

Rules for Theme Generation aligned with user terms:
- If the user hints at "cyberpunk", "neon", "retro computing", "hacker": choose dark backgrounds (e.g., "#0a0a0f"), JetBrains Mono font, glowing-neon border style, and bright neon accents.
- If they ask for "clean", "minimal", "sleek", "modern", "apple style": select Inter or Space Grotesk, high contrast soft colors, rounded corners like "2xl", thin borders, and highly fluid, dreamy smooth animations.
- If they ask for "brutalist", "creative director", "news", "offset": select Space Grotesk/Playfair Display, strong borders ("bold-brutalist"), zero border radius ("none"), offset hover effects.
- If they specify dynamic projects or personal info, tailor the projects, skills, biography, and titles specifically to their prompt! E.g. if they say "I want a smart contract auditor portfolio", populate the projects with smart contract audits, security tooling, and Solidity skills.

CRITICAL: Return ONLY valid, minified, parseable JSON. Do not write markdown tags (like \`\`\`json) or standard conversational preamble around your response. Your entire reply must be the parseable JSON object itself. Include logical personalInfo, skills, projects, experience, theme structures, and animation presets.
`;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { text: systemInstructions },
          { text: `Here is the current state of the portfolio. If the user wants to adjust it, perform delta edits. Otherwise, build it afresh. CurrentData: ${JSON.stringify(currentData)}` },
          { text: `Prompt: ${prompt}` }
        ]
      });

      const rawText = response.text || "{}";
      const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanedJson);
      res.json(parsedData);
    } catch (e: any) {
      console.error("Gemini API Error on Server:", e);
      res.status(500).json({ error: e.message || "An error occurred while generating your portfolio." });
    }
  });

  // Mount Vite or static file serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Fallback wildcard route in development to load and serve transformed index.html
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(process.cwd(), "index.html");
        if (fs.existsSync(templatePath)) {
          let template = fs.readFileSync(templatePath, "utf-8");
          // Transform index.html to inject Vite client and establish ESM routing
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } else {
          next();
        }
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running!\nLocal Development URL: http://localhost:${PORT}\nContainer Bind Address: http://0.0.0.0:${PORT}`);
  });
}

startServer();
