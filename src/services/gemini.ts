import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummary(name: string, skills: string[], experience: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a professional 2-3 sentence summary for a software engineer named ${name}. 
    Skills: ${skills.join(", ")}. 
    Experience context: ${experience}. 
    Make it punchy, technical, and modern.`,
  });
  return response.text;
}

export async function generateBulletPoints(role: string, company: string, description: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3-4 professional, impact-oriented bullet points for a software engineer role.
    Role: ${role} at ${company}.
    Context: ${description}.
    Use strong action verbs and quantify achievements where possible (e.g., "Improved performance by 20%").`,
  });
  return response.text;
}

export async function optimizeProjectDescription(title: string, tech: string[], description: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Rewrite this project description to be more professional and technical for a software engineering portfolio.
    Project: ${title}
    Tech Stack: ${tech.join(", ")}
    Current Description: ${description}
    Focus on the technical challenges solved and the impact.`,
  });
  return response.text;
}

export const demoData: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    email: "alex.rivera@dev.io",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    github: "https://github.com/arivera",
    linkedin: "https://linkedin.com/in/arivera",
    website: "https://arivera.dev",
    summary: "Senior Full-Stack Engineer with 6+ years of experience building scalable distributed systems and high-performance web applications. Specialized in React, Node.js, and cloud-native architecture with a focus on developer experience and system reliability.",
  },
  skills: {
    languages: ["TypeScript", "Go", "Python", "Rust"],
    frameworks: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
    tools: ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions"],
    databases: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch"],
  },
  experience: [
    {
      id: "1",
      company: "TechFlow Systems",
      role: "Senior Software Engineer",
      location: "Remote",
      startDate: "03/2021",
      endDate: "Present",
      current: true,
      description: [
        "Architected and led the migration of a legacy monolithic application to a microservices architecture, reducing deployment time by 60%.",
        "Implemented a real-time analytics dashboard using WebSocket and Redis, handling over 10k concurrent users with sub-100ms latency.",
        "Mentored a team of 5 junior developers and established code review standards that reduced production bugs by 30%."
      ]
    },
    {
      id: "2",
      company: "CloudScale Inc.",
      role: "Software Engineer",
      location: "Austin, TX",
      startDate: "06/2018",
      endDate: "02/2021",
      current: false,
      description: [
        "Developed and maintained core API services using Node.js and PostgreSQL, supporting a user base of 500k active monthly users.",
        "Optimized database queries and implemented caching strategies that improved API response times by 45%.",
        "Collaborated with the DevOps team to implement automated CI/CD pipelines using Jenkins and AWS."
      ]
    }
  ],
  projects: [
    {
      id: "p1",
      title: "DevStream: Real-time Collaboration Platform",
      description: "A collaborative code editor with real-time sync, integrated terminal, and video chat capabilities. Built to facilitate remote pair programming and technical interviews.",
      techStack: ["React", "Socket.io", "WebRTC", "Docker"],
      github: "https://github.com/arivera/devstream",
      link: "https://devstream.io"
    },
    {
      id: "p2",
      title: "KubeWatch: Kubernetes Monitoring Tool",
      description: "A lightweight monitoring agent for Kubernetes clusters that provides real-time resource usage metrics and automated alerting via Slack and Discord.",
      techStack: ["Go", "Kubernetes API", "Prometheus", "Grafana"],
      github: "https://github.com/arivera/kubewatch"
    }
  ],
  education: [
    {
      id: "e1",
      school: "Stanford University",
      degree: "B.S.",
      field: "Computer Science",
      graduationDate: "2018"
    }
  ]
};
