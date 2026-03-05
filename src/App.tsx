import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { 
  Briefcase, 
  GraduationCap, 
  Code2, 
  User, 
  Plus, 
  Trash2, 
  Download, 
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronDown,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { initialData, ResumeData, Experience, Project, Education } from "./types";
import { cn } from "./lib/utils";
import { generateSummary, generateBulletPoints, optimizeProjectDescription, demoData } from "./services/gemini";

export default function App() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${data.personalInfo.fullName || "Resume"}_Portfolio`,
  });

  const loadDemo = () => {
    setData(demoData);
  };

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""]
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      techStack: [],
      link: "",
      github: ""
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const handleAISummary = async () => {
    if (!data.personalInfo.fullName) return;
    setIsGenerating(true);
    try {
      const summary = await generateSummary(
        data.personalInfo.fullName,
        [...data.skills.languages, ...data.skills.frameworks],
        data.experience.map(e => `${e.role} at ${e.company}`).join(", ")
      );
      if (summary) updatePersonalInfo("summary", summary);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIBullets = async (expId: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp || !exp.role || !exp.company) return;
    setIsGenerating(true);
    try {
      const bullets = await generateBulletPoints(exp.role, exp.company, exp.description.join(" "));
      if (bullets) {
        const bulletList = bullets.split("\n").filter(b => b.trim().length > 0).map(b => b.replace(/^[•\-\*]\s*/, ""));
        updateExperience(expId, "description", bulletList);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIProject = async (projId: string) => {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || !proj.title) return;
    setIsGenerating(true);
    try {
      const desc = await optimizeProjectDescription(proj.title, proj.techStack, proj.description);
      if (desc) updateProject(projId, "description", desc);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans selection:bg-[#1C1917] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E7E5E4] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1C1917] rounded-lg flex items-center justify-center">
            <Code2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">DevPort</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={loadDemo}
            className="flex items-center gap-2 px-4 py-2 text-[#78716C] hover:text-[#1C1917] transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            Load Demo
          </button>
          <button 
            onClick={() => handlePrint()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-white rounded-full text-sm font-medium hover:bg-[#292524] transition-colors"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-65px)] overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[#E7E5E4] bg-white p-4 flex flex-col gap-2">
          {[
            { id: "personal", icon: User, label: "Personal Info" },
            { id: "skills", icon: Code2, label: "Skills" },
            { id: "experience", icon: Briefcase, label: "Experience" },
            { id: "projects", icon: Sparkles, label: "Projects" },
            { id: "education", icon: GraduationCap, label: "Education" },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                activeSection === section.id 
                  ? "bg-[#F5F5F4] text-[#1C1917]" 
                  : "text-[#78716C] hover:bg-[#FAFAF9] hover:text-[#1C1917]"
              )}
            >
              <section.icon size={18} className={cn(
                "transition-colors",
                activeSection === section.id ? "text-[#1C1917]" : "text-[#A8A29E] group-hover:text-[#1C1917]"
              )} />
              {section.label}
              {activeSection === section.id && (
                <motion.div layoutId="active" className="ml-auto w-1 h-4 bg-[#1C1917] rounded-full" />
              )}
            </button>
          ))}
        </aside>

        {/* Editor Area */}
        <section className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {activeSection === "personal" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Personal Information</h2>
                    <button 
                      onClick={handleAISummary}
                      disabled={isGenerating}
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors disabled:opacity-50"
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      AI Generate Summary
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo("fullName", v)} />
                    <Input label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo("email", v)} />
                    <Input label="Phone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo("phone", v)} />
                    <Input label="Location" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo("location", v)} />
                    <Input label="GitHub URL" value={data.personalInfo.github} onChange={(v) => updatePersonalInfo("github", v)} />
                    <Input label="LinkedIn URL" value={data.personalInfo.linkedin} onChange={(v) => updatePersonalInfo("linkedin", v)} />
                    <Input label="Website" value={data.personalInfo.website} onChange={(v) => updatePersonalInfo("website", v)} className="col-span-2" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-[#A8A29E] tracking-widest">Professional Summary</label>
                    <textarea
                      value={data.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                      className="w-full h-32 p-4 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/5 focus:border-[#1C1917] transition-all resize-none text-sm leading-relaxed"
                      placeholder="Write a brief professional summary..."
                    />
                  </div>
                </motion.div>
              )}

              {activeSection === "skills" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold">Skills & Technologies</h2>
                  <SkillInput 
                    label="Languages" 
                    items={data.skills.languages} 
                    onUpdate={(items) => setData(prev => ({ ...prev, skills: { ...prev.skills, languages: items } }))} 
                  />
                  <SkillInput 
                    label="Frameworks & Libraries" 
                    items={data.skills.frameworks} 
                    onUpdate={(items) => setData(prev => ({ ...prev, skills: { ...prev.skills, frameworks: items } }))} 
                  />
                  <SkillInput 
                    label="Tools & Platforms" 
                    items={data.skills.tools} 
                    onUpdate={(items) => setData(prev => ({ ...prev, skills: { ...prev.skills, tools: items } }))} 
                  />
                  <SkillInput 
                    label="Databases" 
                    items={data.skills.databases} 
                    onUpdate={(items) => setData(prev => ({ ...prev, skills: { ...prev.skills, databases: items } }))} 
                  />
                </motion.div>
              )}

              {activeSection === "experience" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Work Experience</h2>
                    <button 
                      onClick={addExperience}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F4] text-[#1C1917] rounded-full text-sm font-medium hover:bg-[#E7E5E4] transition-colors"
                    >
                      <Plus size={16} />
                      Add Role
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="p-6 rounded-2xl border border-[#E7E5E4] space-y-4 relative group">
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 p-2 text-[#A8A29E] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} />
                          <Input label="Role" value={exp.role} onChange={(v) => updateExperience(exp.id, "role", v)} />
                          <Input label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, "startDate", v)} placeholder="MM/YYYY" />
                          <Input label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, "endDate", v)} placeholder="MM/YYYY or Present" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-[#A8A29E] tracking-widest">Responsibilities</label>
                            <button 
                              onClick={() => handleAIBullets(exp.id)}
                              disabled={isGenerating}
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
                            >
                              <Sparkles size={12} className="text-amber-500" />
                              AI Refine Bullets
                            </button>
                          </div>
                          <textarea
                            value={exp.description.join("\n")}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value.split("\n"))}
                            className="w-full h-32 p-4 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/5 focus:border-[#1C1917] transition-all resize-none text-sm"
                            placeholder="Enter each responsibility on a new line..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "projects" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <button 
                      onClick={addProject}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F4] text-[#1C1917] rounded-full text-sm font-medium hover:bg-[#E7E5E4] transition-colors"
                    >
                      <Plus size={16} />
                      Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="p-6 rounded-2xl border border-[#E7E5E4] space-y-4 relative group">
                        <button 
                          onClick={() => removeProject(proj.id)}
                          className="absolute top-4 right-4 p-2 text-[#A8A29E] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Project Title" value={proj.title} onChange={(v) => updateProject(proj.id, "title", v)} className="col-span-2" />
                          <Input label="GitHub URL" value={proj.github} onChange={(v) => updateProject(proj.id, "github", v)} />
                          <Input label="Live Demo URL" value={proj.link} onChange={(v) => updateProject(proj.id, "link", v)} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-[#A8A29E] tracking-widest">Description</label>
                            <button 
                              onClick={() => handleAIProject(proj.id)}
                              disabled={isGenerating}
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
                            >
                              <Sparkles size={12} className="text-amber-500" />
                              AI Optimize
                            </button>
                          </div>
                          <textarea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            className="w-full h-24 p-4 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/5 focus:border-[#1C1917] transition-all resize-none text-sm"
                            placeholder="Describe the project, challenges, and tech used..."
                          />
                        </div>
                        <SkillInput 
                          label="Tech Stack" 
                          items={proj.techStack} 
                          onUpdate={(items) => updateProject(proj.id, "techStack", items)} 
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "education" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Education</h2>
                    <button 
                      onClick={() => setData(prev => ({ ...prev, education: [...prev.education, { id: crypto.randomUUID(), school: "", degree: "", field: "", graduationDate: "" }] }))}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F4] text-[#1C1917] rounded-full text-sm font-medium hover:bg-[#E7E5E4] transition-colors"
                    >
                      <Plus size={16} />
                      Add Education
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="p-6 rounded-2xl border border-[#E7E5E4] space-y-4 relative group">
                        <button 
                          onClick={() => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                          className="absolute top-4 right-4 p-2 text-[#A8A29E] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="School / University" value={edu.school} onChange={(v) => setData(prev => ({ ...prev, education: prev.education.map(e => e.id === edu.id ? { ...e, school: v } : e) }))} />
                          <Input label="Degree" value={edu.degree} onChange={(v) => setData(prev => ({ ...prev, education: prev.education.map(e => e.id === edu.id ? { ...e, degree: v } : e) }))} />
                          <Input label="Field of Study" value={edu.field} onChange={(v) => setData(prev => ({ ...prev, education: prev.education.map(e => e.id === edu.id ? { ...e, field: v } : e) }))} />
                          <Input label="Graduation Date" value={edu.graduationDate} onChange={(v) => setData(prev => ({ ...prev, education: prev.education.map(e => e.id === edu.id ? { ...e, graduationDate: v } : e) }))} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Preview Area */}
        <section className="w-[50%] bg-[#F5F5F4] overflow-y-auto p-12 border-l border-[#E7E5E4]">
          {Object.values(data.personalInfo).every(v => !v) && data.experience.length === 0 && data.projects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#A8A29E]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Sparkles size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1C1917]">Your Preview Awaits</h3>
                <p className="text-sm max-w-[240px]">Start filling in your details or load the demo to see the magic happen.</p>
              </div>
              <button 
                onClick={loadDemo}
                className="px-6 py-2 bg-white border border-[#E7E5E4] rounded-full text-sm font-bold text-[#1C1917] hover:bg-[#FAFAF9] transition-colors shadow-sm"
              >
                Load Demo Data
              </button>
            </div>
          ) : (
            <div 
              ref={resumeRef}
              className="bg-white shadow-2xl shadow-black/5 min-h-[1123px] w-full max-w-[800px] mx-auto p-12 text-[#1C1917] print:shadow-none print:p-0"
            >
            {/* Resume Content */}
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b-2 border-[#1C1917] pb-6">
                <h1 className="text-4xl font-black tracking-tighter uppercase">{data.personalInfo.fullName || "Your Name"}</h1>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#44403C]">
                  {data.personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {data.personalInfo.email}</span>}
                  {data.personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {data.personalInfo.phone}</span>}
                  {data.personalInfo.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {data.personalInfo.location}</span>}
                  {data.personalInfo.github && <span className="flex items-center gap-1.5"><Github size={12} /> {data.personalInfo.github.replace(/^https?:\/\//, "")}</span>}
                  {data.personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={12} /> {data.personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>}
                  {data.personalInfo.website && <span className="flex items-center gap-1.5"><Globe size={12} /> {data.personalInfo.website.replace(/^https?:\/\//, "")}</span>}
                </div>
              </div>

              {/* Summary */}
              {data.personalInfo.summary && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#A8A29E]">Professional Summary</h3>
                  <p className="text-sm leading-relaxed text-[#44403C]">{data.personalInfo.summary}</p>
                </div>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#A8A29E]">Experience</h3>
                  <div className="space-y-6">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-base font-bold">{exp.role}</h4>
                          <span className="text-xs font-medium text-[#78716C]">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold text-[#44403C]">{exp.company}</span>
                          <span className="text-xs text-[#A8A29E] italic">{exp.location}</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1">
                          {exp.description.filter(d => d.trim()).map((bullet, i) => (
                            <li key={i} className="text-sm text-[#44403C] leading-relaxed">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#A8A29E]">Key Projects</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-base font-bold">{proj.title}</h4>
                          <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
                            {proj.github && <a href={proj.github} className="hover:underline">GitHub</a>}
                            {proj.link && <a href={proj.link} className="hover:underline">Demo</a>}
                          </div>
                        </div>
                        <p className="text-sm text-[#44403C] leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#F5F5F4] rounded text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="grid grid-cols-2 gap-8">
                {Object.entries(data.skills).some(([_, items]) => items.length > 0) && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#A8A29E]">Technical Skills</h3>
                    <div className="space-y-3">
                      {Object.entries(data.skills).map(([category, items]) => items.length > 0 && (
                        <div key={category} className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-[#A8A29E] tracking-wider">{category}</span>
                          <p className="text-sm text-[#44403C] font-medium">{items.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#A8A29E]">Education</h3>
                    <div className="space-y-4">
                      {data.education.map((edu) => (
                        <div key={edu.id} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-sm font-bold">{edu.school}</h4>
                            <span className="text-[10px] font-medium text-[#78716C]">{edu.graduationDate}</span>
                          </div>
                          <p className="text-xs text-[#44403C]">{edu.degree} in {edu.field}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      </main>

      {/* Generating Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#E7E5E4] border-t-[#1C1917] rounded-full"
                />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#1C1917]">AI is crafting your content...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, className }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-bold uppercase text-[#A8A29E] tracking-widest">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/5 focus:border-[#1C1917] transition-all text-sm"
      />
    </div>
  );
}

function SkillInput({ label, items, onUpdate }: { label: string, items: string[], onUpdate: (items: string[]) => void }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() && !items.includes(input.trim())) {
      onUpdate([...items, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (item: string) => {
    onUpdate(items.filter(i => i !== item));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-[#A8A29E] tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F5F4] rounded-full text-xs font-medium text-[#1C1917]">
            {item}
            <button onClick={() => handleRemove(item)} className="hover:text-red-500 transition-colors">
              <Plus size={14} className="rotate-45" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 px-4 py-2 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/5 focus:border-[#1C1917] transition-all text-sm"
        />
        <button 
          onClick={handleAdd}
          className="p-2 bg-[#1C1917] text-white rounded-xl hover:bg-[#292524] transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
