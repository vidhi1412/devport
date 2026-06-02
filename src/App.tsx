import { useState } from "react";
import { 
  Sparkles, 
  Palette, 
  Activity, 
  FileText, 
  Laptop, 
  Smartphone, 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Twitter, 
  Plus, 
  Trash2, 
  PlusCircle, 
  CheckCircle2, 
  Layers, 
  Send, 
  ArrowRight,
  MonitorPlay,
  Heart,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  initialPortfolioData, 
  PortfolioData, 
  THEME_PRESETS, 
  ANIMATION_PRESETS, 
  PortfolioTheme, 
  AnimationSettings,
  Project,
  SkillNode
} from "./types";
import { cn } from "./lib/utils";
import { generateAIPortfolio } from "./services/gemini";

export default function App() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [activeTab, setActiveTab] = useState<"ai" | "theme" | "motion" | "content">("ai");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState("brutalist-slate");
  const [selectedAnimationPresetId, setSelectedAnimationPresetId] = useState("raw-brutal");
  const [aiError, setAiError] = useState<string | null>(null);

  // Project item edit state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState("");
  
  // Custom manual color settings
  const [customPrimaryColor, setCustomPrimaryColor] = useState(data.theme.primaryColor);
  const [customBgColor, setCustomBgColor] = useState(data.theme.bgColor);
  const [customTextColor, setCustomTextColor] = useState(data.theme.textColor);
  const [customAccentColor, setCustomAccentColor] = useState(data.theme.accentColor);
  const [customCardBgColor, setCustomCardBgColor] = useState(data.theme.cardBgColor);

  // Active project filter in the Live Preview
  const [previewFilter, setPreviewFilter] = useState<string>("All");

  // Contact form submission test in preview
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const applyThemePreset = (theme: PortfolioTheme) => {
    setData(prev => ({ ...prev, theme }));
    setSelectedPresetId(theme.id);
    
    // Sync custom color pickers
    setCustomPrimaryColor(theme.primaryColor);
    setCustomBgColor(theme.bgColor);
    setCustomTextColor(theme.textColor);
    setCustomAccentColor(theme.accentColor);
    setCustomCardBgColor(theme.cardBgColor);
  };

  const applyAnimationPreset = (preset: { id: string; settings: AnimationSettings }) => {
    setData(prev => ({ ...prev, animations: preset.settings }));
    setSelectedAnimationPresetId(preset.id);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);
    try {
      const resultData = await generateAIPortfolio(aiPrompt, data);
      setData(resultData);
      
      // Update local pickers
      setCustomPrimaryColor(resultData.theme.primaryColor);
      setCustomBgColor(resultData.theme.bgColor);
      setCustomTextColor(resultData.theme.textColor);
      setCustomAccentColor(resultData.theme.accentColor);
      setCustomCardBgColor(resultData.theme.cardBgColor);
    } catch (e: any) {
      console.error(e);
      setAiError(e.message || "An unexpected error occurred during generation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddField = (category: "languages" | "frameworks" | "tools" | "design") => {
    const defaultNames: Record<string, string> = {
      languages: "Python",
      frameworks: "Vue.js",
      tools: "Figma",
      design: "User Experience"
    };
    
    const nodeCat: Record<string, "Languages" | "Frameworks" | "Tools" | "Design"> = {
      languages: "Languages",
      frameworks: "Frameworks",
      tools: "Tools",
      design: "Design"
    };

    const newNode: SkillNode = {
      name: defaultNames[category],
      level: 4,
      category: nodeCat[category]
    };

    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newNode]
    }));
  };

  const removeSkillNode = (index: number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCustomProject = () => {
    if (!projectTitle.trim()) return;
    const newProj: Project = {
      id: "custom-" + Date.now(),
      title: projectTitle,
      description: projectDesc || "A custom engineered experience.",
      techStack: projectTech ? projectTech.split(",").map(t => t.trim()) : ["React", "Motion"],
      image: "https://images.unsplash.com/photo-1541462608141-2f58c6e6a351?auto=format&fit=crop&q=80&w=400"
    };

    setData(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));

    setProjectTitle("");
    setProjectDesc("");
    setProjectTech("");
  };

  const removeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Convert font selection to style class
  const getFontFamilyStyle = (font: string) => {
    switch (font) {
      case "Space Grotesk": return { fontFamily: "'Space Grotesk', sans-serif" };
      case "JetBrains Mono": return { fontFamily: "'JetBrains Mono', monospace" };
      case "Playfair Display": return { fontFamily: "'Playfair Display', serif" };
      default: return { fontFamily: "'Inter', sans-serif" };
    }
  };

  // Animation Transition Helpers based on current slider setting
  const getFramerMotionTransition = (): any => {
    const intensity = data.animations.interactivity;
    if (intensity === "spring-heavy") {
      return { type: "spring", stiffness: 280, damping: 12 };
    } else if (intensity === "smooth-glide") {
      return { type: "tween", ease: "easeInOut", duration: 0.7 };
    } else if (intensity === "ultra-fast") {
      return { type: "spring", stiffness: 500, damping: 45 };
    } else {
      // dreamy slow
      return { type: "tween", ease: "easeOut", duration: 1.5 };
    }
  };

  // Border formatting helpers
  const getBorderStyleClass = (style: string, customAccent = "") => {
    switch (style) {
      case "bold-brutalist": 
        return "border-3 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]";
      case "glowing-neon": 
        return "border border-[var(--accent-glow)] shadow-[0_0_15px_rgba(255,255,255,0.05)]";
      case "thin": 
        return "border border-slate-200 shadow-sm";
      default: 
        return "border-0 shadow-none";
    }
  };

  const getBorderRadiusClass = (radius: string) => {
    switch (radius) {
      case "none": return "rounded-none";
      case "md": return "rounded-md";
      case "2xl": return "rounded-2xl";
      case "full": return "rounded-3xl";
      default: return "rounded-xl";
    }
  };

  // Hover animations preset helper
  const getHoverAnimationProps = () => {
    const effect = data.animations.hoverEffect;
    if (effect === "lift-up") {
      return { whileHover: { y: -6, scale: 1.01 } };
    } else if (effect === "glow-neon") {
      return { whileHover: { scale: 1.015, boxShadow: `0px 0px 20px ${data.theme.accentColor}80` } };
    } else if (effect === "scale-up") {
      return { whileHover: { scale: 1.04 } };
    } else if (effect === "brutalist-offset") {
      return { whileHover: { x: -4, y: -4, boxShadow: `8px 8px 0px 0px ${data.theme.primaryColor}` } };
    } else if (effect === "magnetic-shift") {
      return { whileHover: { rotate: 0.8, scale: 1.02 } };
    }
    return {};
  };

  const entryPresetsVariants = {
    slideUp: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
    fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    scaleUp: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
    "staggered-reveal": { hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0 } }
  };

  const samplePrompts = [
    "An interactive high-energy futuristic neon green cyberpunk programmer landing page",
    "A clean, sophisticated, ultra-minimal warm editorial portfolio for an interaction designer",
    "A gorgeous vaporwave layout with springy, elastic motions and retro digital boxes"
  ];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 font-sans flex flex-col overflow-hidden selection:bg-amber-400 selection:text-slate-900">
      
      {/* Dynamic Variables Style tag to support active color rendering */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary-theme: ${data.theme.primaryColor};
          --secondary-theme: ${data.theme.secondaryColor};
          --accent-theme: ${data.theme.accentColor};
          --accent-glow: ${data.theme.accentColor};
          --bg-theme: ${data.theme.bgColor};
          --text-theme: ${data.theme.textColor};
          --card-bg-theme: ${data.theme.cardBgColor};
        }
      `}} />

      {/* Primary Header */}
      <header className="h-16 px-6 bg-[#13151a] border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Code className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              DevPort <span className="text-[10px] bg-rose-500/20 text-rose-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Interactive Portfolio & Motion Builder</p>
          </div>
        </div>

        {/* Top Control Bar details */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setPreviewMode("desktop")}
              className={cn(
                "p-1.5 rounded transition-all",
                previewMode === "desktop" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              )}
              title="Desktop preview"
            >
              <Laptop size={15} />
            </button>
            <button 
              onClick={() => setPreviewMode("mobile")}
              className={cn(
                "p-1.5 rounded transition-all",
                previewMode === "mobile" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              )}
              title="Mobile preview"
            >
              <Smartphone size={15} />
            </button>
          </div>

          <a 
            href="https://vercel.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium text-xs rounded-lg shadow-md transition-all active:scale-95"
          >
            <Globe size={13} />
            Publish Portfolio
          </a>
        </div>
      </header>

      {/* Main Workspace Frame split into Control Panel vs. Live Interactive Sandbox Preview */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Customizer Sidebar */}
        <aside className="w-[430px] border-r border-[#1e222b] bg-[#13151a] flex flex-col shrink-0 z-10">
          
          {/* Navigation Sub-Tabs */}
          <div className="grid grid-cols-4 border-b border-[#252a36] bg-[#0e1014] p-1 shrink-0">
            {[
              { id: "ai", label: "AI Prompt", icon: Sparkles },
              { id: "theme", label: "Themes", icon: Palette },
              { id: "motion", label: "Physics", icon: Activity },
              { id: "content", label: "Content", icon: FileText }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  "py-2.5 flex flex-col items-center gap-1 text-[11px] font-semibold transition-all rounded-md",
                  activeTab === t.id 
                    ? "text-amber-400 bg-[#1a1d24] shadow-sm shadow-black/10" 
                    : "text-slate-400 hover:bg-[#15181f] hover:text-slate-200"
                )}
              >
                <t.icon size={15} className={activeTab === t.id ? "text-amber-400 animate-pulse" : "text-slate-400"} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            <AnimatePresence mode="wait">
              {activeTab === "ai" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <div className="bg-amber-500/10 text-amber-300 p-3 rounded-lg border border-amber-500/20 text-[11px] leading-relaxed flex gap-2">
                      <Sparkles size={16} className="shrink-0 text-amber-500" />
                      <span>
                        <strong>AI UI Orchestrator:</strong> Describe your target identity, creative style desires, or dynamic theme keywords. The AI writes code systems to craft layouts instantly.
                      </span>
                    </div>

                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., A minimalist clean layout with Space Grotesk fonts, thin borders, neon purple headers and ultra smooth slow cinematic scroll motions"
                      className="w-full h-28 bg-[#181a20] border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />

                    {aiError && (
                      <div className="bg-rose-500/10 text-rose-300 p-3 rounded-lg border border-rose-500/20 text-xs leading-relaxed flex flex-col gap-1">
                        <div className="flex gap-1.5 font-bold items-center text-rose-400 uppercase tracking-wide text-[10px]">
                          <Activity size={12} />
                          <span>AI Generation Status</span>
                        </div>
                        <p className="opacity-90">{aiError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleAiGenerate}
                      disabled={isAiLoading || !aiPrompt.trim()}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-medium text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {isAiLoading ? (
                        <>
                          <RefreshCw className="animate-spin w-4 h-4 text-white" />
                          <span>Generating theme mechanics...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="text-white" />
                          <span>Apply AI Theme Settings</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sample suggestions for swift generation */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Popular AI Seed Prompts:</h4>
                    <div className="space-y-2">
                      {samplePrompts.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAiPrompt(sample)}
                          className="w-full text-left p-3 rounded-lg bg-[#181a20] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 hover:bg-[#1d2027] transition-all flex items-start gap-2 group"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] font-bold text-slate-300 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-tight">{sample}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "theme" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Theme Presets List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                      <Layers size={14} className="text-slate-400" />
                      Visual Theme Presets
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {THEME_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => applyThemePreset(preset)}
                          className={cn(
                            "p-3 rounded-lg text-left border transition-all text-xs focus:outline-none",
                            selectedPresetId === preset.id 
                              ? "bg-slate-800 border-amber-500" 
                              : "bg-[#181a20] border-slate-800 hover:border-slate-700"
                          )}
                        >
                          <div className="font-bold text-slate-100">{preset.name}</div>
                          <div className="flex gap-1.5 mt-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: preset.primaryColor }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: preset.accentColor }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: preset.bgColor }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Palette adjustments */}
                  <div className="space-y-4 pt-3 border-t border-slate-800">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Custom Color Tuning</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Canvas Background</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={customBgColor} 
                            onChange={(e) => {
                              setCustomBgColor(e.target.value);
                              setData(p => ({ ...p, theme: { ...p.theme, bgColor: e.target.value } }));
                            }}
                            className="bg-transparent border border-slate-700 rounded p-0.5 w-10 h-8 cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={customBgColor} 
                            onChange={(e) => {
                              setCustomBgColor(e.target.value);
                              setData(p => ({ ...p, theme: { ...p.theme, bgColor: e.target.value } }));
                            }} 
                            className="bg-[#181a20] border border-slate-700 text-xs rounded px-2.5 py-1 w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Primary Accents & Buttons</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={customPrimaryColor} 
                            onChange={(e) => {
                              setCustomPrimaryColor(e.target.value);
                              setData(p => ({ ...p, theme: { ...p.theme, primaryColor: e.target.value } }));
                            }}
                            className="bg-transparent border border-slate-700 rounded p-0.5 w-10 h-8 cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={customPrimaryColor} 
                            onChange={(e) => {
                              setCustomPrimaryColor(e.target.value);
                              setData(p => ({ ...p, theme: { ...p.theme, primaryColor: e.target.value } }));
                            }} 
                            className="bg-[#181a20] border border-slate-700 text-xs rounded px-2.5 py-1 w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Interactive Glowing highlights</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={customAccentColor} 
                            onChange={(e) => {
                              setCustomAccentColor(e.target.value);
                              setData(p => ({ ...p, theme: { ...p.theme, accentColor: e.target.value } }));
                            }}
                            className="bg-transparent border border-slate-700 rounded p-0.5 w-10 h-8 cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={customAccentColor} 
                            onChange={(e) => {
                              setCustomAccentColor(e.target.value);
                              setData(p => ({ ...p, theme: { ...p.theme, accentColor: e.target.value } }));
                            }} 
                            className="bg-[#181a20] border border-slate-700 text-xs rounded px-2.5 py-1 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Typography and spacing variables adjustment */}
                  <div className="space-y-4 pt-3 border-t border-slate-800">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Typography & Spacing Preset</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "Inter", label: "Inter UI" },
                        { id: "Space Grotesk", label: "Space Grotesk" },
                        { id: "JetBrains Mono", label: "Developer Mono" },
                        { id: "Playfair Display", label: "Playfair Serif" }
                      ].map(font => (
                        <button
                          key={font.id}
                          onClick={() => setData(prev => ({ ...prev, theme: { ...prev.theme, fontFamily: font.id as any } }))}
                          className={cn(
                            "py-2 px-3 text-xs rounded-lg border text-center font-medium",
                            data.theme.fontFamily === font.id 
                              ? "bg-slate-800 border-amber-500 text-white" 
                              : "bg-[#181a20] border-slate-800 text-slate-300 hover:border-slate-700"
                          )}
                          style={getFontFamilyStyle(font.id)}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Border Mechanics</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "none", label: "No Borders" },
                          { id: "thin", label: "Subtle Thin border" },
                          { id: "bold-brutalist", label: "Bold Brutalist" },
                          { id: "glowing-neon", label: "Neon Cyber Glow" }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => setData(prev => ({ ...prev, theme: { ...prev.theme, borderStyle: st.id as any } }))}
                            className={cn(
                              "py-2 px-3 text-[11px] rounded-lg border text-center font-medium",
                              data.theme.borderStyle === st.id 
                                ? "bg-slate-800 border-amber-500 text-white" 
                                : "bg-[#181a20] border-slate-800 text-slate-300 hover:border-slate-700"
                            )}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "motion" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Presets Gallery */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Physics presets</h3>
                    <div className="space-y-2">
                      {ANIMATION_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => applyAnimationPreset(preset)}
                          className={cn(
                            "w-full p-3.5 rounded-xl text-left border transition-all text-xs focus:outline-none flex justify-between items-center",
                            selectedAnimationPresetId === preset.id 
                              ? "bg-slate-800 border-amber-500 text-white" 
                              : "bg-[#181a20] border-slate-800 hover:border-slate-700 text-slate-300"
                          )}
                        >
                          <div>
                            <div className="font-bold">{preset.name}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Style: {preset.settings.entryPreset} • Hover: {preset.settings.hoverEffect}
                            </div>
                          </div>
                          <MonitorPlay size={16} className="text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Slider adjustments of Spring/Tween coefficients */}
                  <div className="space-y-4 pt-3 border-t border-slate-800">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Micro-Interaction Physics</h3>
                    
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Interactivity Speed Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "spring-heavy", label: "Springy Bounce" },
                          { id: "smooth-glide", label: "Smooth Linear" },
                          { id: "ultra-fast", label: "Snappy Burst" },
                          { id: "dreamy-slow", label: "Cinematic Slow" }
                        ].map(itm => (
                          <button
                            key={itm.id}
                            onClick={() => setData(prev => ({ ...prev, animations: { ...prev.animations, interactivity: itm.id as any } }))}
                            className={cn(
                              "py-2 px-3 text-[11px] rounded-lg border text-center font-medium",
                              data.animations.interactivity === itm.id 
                                ? "bg-slate-800 border-amber-500 text-white" 
                                : "bg-[#181a20] border-slate-800 text-slate-300 hover:border-slate-700"
                            )}
                          >
                            {itm.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Elements Hover Preset</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "lift-up", label: "3D Lift" },
                          { id: "glow-neon", label: "Neon Pulse Glow" },
                          { id: "scale-up", label: "Elastic Scale" },
                          { id: "brutalist-offset", label: "Offset Translation" },
                          { id: "magnetic-shift", label: "Magnetic Rotate" }
                        ].map(eff => (
                          <button
                            key={eff.id}
                            onClick={() => setData(prev => ({ ...prev, animations: { ...prev.animations, hoverEffect: eff.id as any } }))}
                            className={cn(
                              "py-2 px-3 text-[11px] rounded-lg border text-center font-medium",
                              data.animations.hoverEffect === eff.id 
                                ? "bg-slate-800 border-amber-500 text-white" 
                                : "bg-[#181a20] border-[#181a20] text-slate-300 hover:border-slate-700"
                            )}
                          >
                            {eff.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "content" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 text-xs"
                >
                  {/* Personal Bio Title details */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Biographical DNA</h3>
                    
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={data.personalInfo.fullName} 
                          onChange={(e) => setData(p => ({ ...p, personalInfo: { ...p.personalInfo, fullName: e.target.value } }))}
                          className="w-full bg-[#181a20] border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Professional Title</label>
                        <input 
                          type="text" 
                          value={data.personalInfo.roleTitle} 
                          onChange={(e) => setData(p => ({ ...p, personalInfo: { ...p.personalInfo, roleTitle: e.target.value } }))}
                          className="w-full bg-[#181a20] border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Headline Abstract</label>
                        <textarea 
                          value={data.personalInfo.summary} 
                          onChange={(e) => setData(p => ({ ...p, personalInfo: { ...p.personalInfo, summary: e.target.value } }))}
                          className="w-full h-20 bg-[#181a20] border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:border-amber-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Node builder */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Skills Matrix</h3>
                      <button 
                        onClick={() => handleAddField("languages")}
                        className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        <PlusCircle size={12} /> Add Skill
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 bg-[#181a20] p-2 rounded-lg border border-slate-800">
                      {data.skills.map((sk, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-800/80 p-1.5 rounded-md">
                          <input 
                            type="text" 
                            value={sk.name} 
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[idx].name = e.target.value;
                              setData(p => ({ ...p, skills: updated }));
                            }}
                            className="w-1/2 bg-transparent text-xs text-white border-none focus:outline-none focus:ring-0 p-0 font-medium"
                          />
                          <select
                            value={sk.level}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[idx].level = parseInt(e.target.value);
                              setData(p => ({ ...p, skills: updated }));
                            }}
                            className="bg-slate-700 text-[10px] rounded border-none px-1 py-0.5"
                          >
                            <option value={1}>1 (Beg)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4 (Adv)</option>
                            <option value={5}>5 (Expert)</option>
                          </select>
                          <button 
                            onClick={() => removeSkillNode(idx)}
                            className="text-red-400 hover:text-red-300 p-1 ml-auto"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customized Projects section creator */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Engineered Showcases</h3>
                    
                    <div className="bg-[#181a20] p-3 rounded-xl border border-slate-800 space-y-2.5">
                      <input 
                        type="text" 
                        placeholder="Project Title (e.g., Omni Engine)" 
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full bg-[#13151a] border border-slate-700 rounded py-1.5 px-2.5 text-xs text-white"
                      />
                      <textarea 
                        placeholder="Clean technical description details..." 
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        className="w-full h-12 bg-[#13151a] border border-slate-700 rounded py-1 px-2 text-xs text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="Tag, Separated, By, Comma" 
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        className="w-full bg-[#13151a] border border-slate-700 rounded py-1.5 px-2.5 text-xs text-white animate-pulse"
                      />
                      <button
                        onClick={addCustomProject}
                        className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-[10px] uppercase tracking-wider"
                      >
                        Insert Project Card
                      </button>
                    </div>

                    {/* Active items list for Swift Delete */}
                    <div className="space-y-1.5">
                      {data.projects.map((p) => (
                        <div key={p.id} className="flex justify-between items-center bg-[#181a20] p-2 rounded-lg border border-slate-800">
                          <span className="font-bold text-slate-300 truncate max-w-[200px]">{p.title}</span>
                          <button onClick={() => removeProject(p.id)} className="text-red-400 hover:text-red-300 p-1">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </aside>

        {/* Browser Sandbox Interactive Preview Canvas */}
        <section className="flex-1 bg-[#090a0f] p-6 overflow-hidden flex flex-col items-center justify-center relative">
          
          {/* Subtle decoration dots in backdrop preview layout */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

          {/* Browser Container Frame with native header */}
          <div className={cn(
            "bg-[#13151a] border-2 border-slate-800 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full",
            previewMode === "desktop" ? "w-full max-w-[950px]" : "w-[370px]"
          )}>
            
            {/* Top address bar mockup simulation */}
            <div className="h-10 bg-[#0e1013] px-4 border-b border-slate-800 flex items-center justify-between shrink-0 gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Dynamic Host address mockup */}
              <div className="flex-1 max-w-sm bg-slate-900 rounded-lg px-3 py-1 text-[11px] text-slate-400 border border-slate-800/60 truncate text-center flex items-center justify-center gap-1.5 font-mono">
                <Globe size={11} className="text-slate-500" />
                <span>{data.personalInfo.fullName.toLowerCase().replace(/\s+/g, "") || "portfolio"}.vercel.app</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-800/80 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider">PREVIEW</span>
              </div>
            </div>

            {/* Simulated Live browser content - renders fully responsive customized portfolio styled on customized properties */}
            <div 
              style={{ backgroundColor: data.theme.bgColor, color: data.theme.textColor, ...getFontFamilyStyle(data.theme.fontFamily) }}
              className="flex-1 overflow-y-auto flex flex-col relative transition-all"
            >
              
              {/* Floating Social Badge Widgets if enabled */}
              {data.layouts.showSocialWidgets && (
                <div className="sticky top-0 z-40 bg-[var(--card-bg-theme)]/80 backdrop-blur-md px-6 py-4 border-b border-slate-200/20 flex justify-between items-center">
                  <span className="font-extrabold tracking-tight text-xs uppercase" style={{ color: data.theme.primaryColor }}>
                    {data.personalInfo.fullName || "Portfolio Pro"}
                  </span>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <a href="#about" className="hover:opacity-80 transition-opacity font-semibold">About</a>
                    <a href="#skills" className="hover:opacity-80 transition-opacity font-semibold">Skills</a>
                    <a href="#projects" className="hover:opacity-80 transition-opacity font-semibold">Projects</a>
                    <a href="#contact" className="hover:opacity-80 transition-opacity font-semibold">Contact</a>
                  </div>
                </div>
              )}

              {/* Live Portfolio Sections Renderer */}
              <div className="px-8 py-10 space-y-16">
                
                {/* Hero Section Container */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={entryPresetsVariants[data.animations.entryPreset]}
                  transition={getFramerMotionTransition()}
                  className="space-y-6 pt-6"
                >
                  <div className="space-y-3">
                    <span 
                      style={{ color: data.theme.accentColor }} 
                      className="text-xs font-bold uppercase tracking-widest block"
                    >
                      {data.personalInfo.roleTitle || "Digital Sculptor"}
                    </span>
                    <h2 
                      className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase font-sans" 
                      style={{ color: data.theme.primaryColor }}
                    >
                      {data.personalInfo.fullName || "Your Portfolio"}
                    </h2>
                    <p className="text-sm md:text-base max-w-xl leading-relaxed opacity-85">
                      {data.personalInfo.summary || "This represents the abstract summary details that showcase your professional engineering vision."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.button 
                      {...getHoverAnimationProps()}
                      style={{ backgroundColor: data.theme.primaryColor, color: data.theme.bgColor }}
                      className={cn(
                        "font-bold text-xs px-5 py-2.5 inline-flex items-center gap-1.5 transition-all text-white",
                        getBorderRadiusClass(data.theme.borderRadius)
                      )}
                    >
                      Explore Creative Projects <ArrowRight size={14} />
                    </motion.button>
                    
                    <motion.div className="flex gap-2">
                      <a href="#" className="p-2.5 rounded-lg border border-slate-300/30 hover:bg-slate-100/10 transition-colors">
                        <Github size={15} />
                      </a>
                      <a href="#" className="p-2.5 rounded-lg border border-slate-300/30 hover:bg-slate-100/10 transition-colors">
                        <Linkedin size={15} />
                      </a>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Animated Skills Grid Showcase Section */}
                <div id="skills" className="space-y-6 pt-4 border-t border-slate-300/10">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-black tracking-widest uppercase opacity-60">Engineered Architecture Skills</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: data.theme.accentColor }}>Core Stack</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {data.skills.map((skill, idx) => (
                      <motion.div
                        key={idx}
                        {...getHoverAnimationProps()}
                        style={{ backgroundColor: data.theme.cardBgColor }}
                        className={cn(
                          "px-4 py-2.5 transition-all text-xs flex items-center justify-between gap-4 border cursor-pointer",
                          getBorderStyleClass(data.theme.borderStyle),
                          getBorderRadiusClass(data.theme.borderRadius)
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.theme.accentColor }} />
                          <span className="font-bold opacity-90">{skill.name}</span>
                        </div>
                        <div className="flex gap-0.5 opacity-60">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={cn(
                                "w-1 h-3 rounded-full",
                                i < skill.level ? "bg-amber-500" : "bg-slate-300/10"
                              )} 
                              style={{ 
                                backgroundColor: i < skill.level ? data.theme.accentColor : undefined 
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Projects Showcase grid featuring custom tech card highlights */}
                <div id="projects" className="space-y-6 pt-4 border-t border-slate-300/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-3">
                    <div>
                      <h3 className="text-xs font-black tracking-widest uppercase opacity-60">Featured Applications Showcase</h3>
                    </div>
                    
                    {/* Active dynamic visual Filter toggling in browser frame */}
                    <div className="flex bg-slate-200/10 p-0.5 rounded-lg border border-slate-300/10 gap-1 text-[10px] font-bold">
                      {["All", "React", "Docker", "Audio"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setPreviewFilter(cat)}
                          className={cn(
                            "px-2 py-1 rounded transition-all",
                            previewFilter === cat 
                              ? "bg-amber-400 text-slate-900" 
                              : "opacity-60 hover:opacity-100"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.projects
                      .filter(p => previewFilter === "All" || p.techStack.includes(previewFilter) || p.techStack.some(t => t.toLowerCase() === previewFilter.toLowerCase()))
                      .map((proj) => (
                        <motion.div
                          key={proj.id}
                          layout
                          {...getHoverAnimationProps()}
                          style={{ backgroundColor: data.theme.cardBgColor }}
                          className={cn(
                            "p-5 flex flex-col justify-between transition-all group overflow-hidden border",
                            getBorderStyleClass(data.theme.borderStyle),
                            getBorderRadiusClass(data.theme.borderRadius)
                          )}
                        >
                          <div className="space-y-3">
                            {proj.image && (
                              <div className="h-28 w-full rounded-lg overflow-hidden relative border border-slate-300/10 mb-2">
                                <img src={proj.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute top-2 right-2 p-1 bg-black/40 backdrop-blur-md rounded-full text-white">
                                  <ExternalLink size={12} />
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.theme.accentColor }} />
                              <h4 className="font-extrabold text-sm uppercase tracking-tight" style={{ color: data.theme.primaryColor }}>{proj.title}</h4>
                            </div>
                            <p className="text-xs opacity-75 leading-relaxed">{proj.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-4">
                            {proj.techStack.map((tech, i) => (
                              <span 
                                key={i} 
                                className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-300/10 rounded tracking-wide"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                    ))}
                  </div>
                </div>

                {/* Experience listings */}
                {data.experience.length > 0 && (
                  <div id="experience" className="space-y-6 pt-4 border-t border-slate-300/10">
                    <h3 className="text-xs font-black tracking-widest uppercase opacity-60">Industry Career Timeline</h3>
                    <div className="space-y-6">
                      {data.experience.map((exp) => (
                        <div key={exp.id} className="relative pl-6 border-l-2 border-slate-300/10 space-y-2">
                          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: data.theme.accentColor }} />
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-xs uppercase" style={{ color: data.theme.primaryColor }}>{exp.role}</h4>
                            <span className="text-[10px] font-semibold opacity-60">{exp.startDate} — {exp.endDate}</span>
                          </div>
                          <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{exp.company}</div>
                          <ul className="space-y-1 pt-1 opacity-75 text-xs">
                            {exp.description.map((b, idx) => (
                              <li key={idx} className="flex gap-2 items-start text-xs">
                                <span className="opacity-60 shrink-0">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact form mockup container styled matching theme selection */}
                <div id="contact" className="space-y-4 pt-4 border-t border-slate-300/10 pb-8">
                  <h3 className="text-xs font-black tracking-widest uppercase opacity-60">Initiate Collaboration</h3>
                  
                  {contactSubmitted ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                    >
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto animate-bounce" />
                      <h4 className="font-bold text-xs uppercase text-slate-200">Interactive form sent successfully</h4>
                      <p className="text-[11px] text-slate-400">Your visual style layout test passes standard UI form validation.</p>
                      <button onClick={() => setContactSubmitted(false)} className="text-[10px] text-amber-400 hover:underline">Submit Another Test</button>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Collaborator Name" 
                          className="bg-slate-300/5 placeholder-slate-500 text-xs py-2 px-3 focus:outline-none border border-slate-300/10 rounded" 
                        />
                        <input 
                          type="email" 
                          placeholder="Your email coordinates" 
                          className="bg-slate-300/5 placeholder-slate-500 text-xs py-2 px-3 focus:outline-none border border-slate-300/10 rounded" 
                        />
                      </div>
                      <textarea 
                        rows={3} 
                        placeholder="Say hello, describe your venture concept details..." 
                        className="w-full bg-slate-300/5 placeholder-slate-500 text-xs py-2 px-3 focus:outline-none border border-slate-300/10 rounded" 
                      />
                      <motion.button
                        whileHover={{ scale: 1.015 }}
                        onClick={() => setContactSubmitted(true)}
                        style={{ backgroundColor: data.theme.primaryColor, color: data.theme.bgColor }}
                        className="w-full py-2.5 rounded font-black text-xs uppercase tracking-wider text-white bg-slate-900 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Send size={12} className="text-white" /> Ship Coordinates
                      </motion.button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}
