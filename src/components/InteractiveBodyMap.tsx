import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DiseaseDetail, DISEASES_DATA } from '../data/diseases';
import { sound } from '../utils/audio';
import { Heart, Activity, Droplets, Flame, Sparkles, ExternalLink, Info, ShieldAlert, HelpCircle } from 'lucide-react';

interface InteractiveBodyMapProps {
  onSelectDisease: (disease: DiseaseDetail, initialTab?: 'mechanism' | 'quiz') => void;
  onOpenMicroscope?: (diseaseId: string) => void;
  onOpenCalorieCalculator?: () => void;
}

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({ 
  onSelectDisease, 
  onOpenMicroscope,
  onOpenCalorieCalculator 
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>('pancreas');

  const handleOrganClick = (disease: DiseaseDetail) => {
    sound.playClick(1500);
    sound.playHoloOpen();
    onSelectDisease(disease);
  };

  const handleOrganHover = (id: string | null) => {
    if (id && id !== hoveredId) {
      sound.playClick(900);
    }
    setHoveredId(id);
  };

  return (
    <section id="body-map" className="relative py-20 bg-[#030712] border-t border-b border-cyan-900/30 overflow-hidden cyber-grid">
      
      {/* Background glow pools */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>خريطة الأعضاء الحيوية المباشرة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            جسم الإنسان التفاعلي:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400">
              مجسم آلة الحياة
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            انقر على أي عضو في القائمة أو على النقاط النابضة في المجسم لاكتشاف كيف يعمل، وما هي مسببات الأمراض المزمنة، وطرق الوقاية منها.
          </p>
        </motion.div>

        {/* Main Body Map & Diagnostic Controller Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Top (Mobile) Organ Switcher Cards */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between pb-2 border-b border-slate-800"
            >
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>الأعضاء والأمراض المزمنة</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">4 أعضاء رئيسية</span>
              </span>
              <span className="text-xs text-slate-400">انقر للتشخيص والتفاصيل</span>
            </motion.div>

            {DISEASES_DATA.map((disease, idx) => {
              const isHovered = hoveredId === disease.id;
              const isSelected = activeTabId === disease.organKey;

              const getIcon = () => {
                switch (disease.organKey) {
                  case 'pancreas': return <Activity className="w-5 h-5 text-cyan-400" />;
                  case 'heart': return <Heart className="w-5 h-5 text-rose-400 animate-heartbeat" />;
                  case 'blood': return <Droplets className="w-5 h-5 text-emerald-400" />;
                  case 'digestive': return <Flame className="w-5 h-5 text-amber-400" />;
                }
              };

              return (
                <motion.div
                  key={disease.id}
                  id={`organ-card-${disease.id}`}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => {
                    handleOrganHover(disease.id);
                    setActiveTabId(disease.organKey);
                  }}
                  onMouseLeave={() => handleOrganHover(null)}
                  className={`group relative p-5 rounded-3xl border transition-all duration-300 text-right backdrop-blur-md ${
                    isHovered || isSelected
                      ? `bg-slate-900/95 ${disease.color.borderClass} shadow-xl ring-1 ring-cyan-500/30`
                      : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Icon + Organ Title + Badge + Sound */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-inner"
                        style={{ backgroundColor: `${disease.color.primary}18`, borderColor: `${disease.color.primary}40` }}
                      >
                        {getIcon()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">
                            {disease.organName}
                          </h3>
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                            style={{ 
                              color: disease.color.primary,
                              borderColor: `${disease.color.primary}40`,
                              backgroundColor: `${disease.color.primary}12`
                            }}
                          >
                            {disease.badge}
                          </span>
                        </div>
                        <p className={`text-xs font-bold mt-0.5 ${disease.color.textClass}`}>
                          {disease.diseaseName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {disease.shortDescription}
                  </p>

                  {/* Clear, Spacious Action Buttons (No overcrowding) */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOrganClick(disease)}
                      className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <span>استكشاف المرض والوقاية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {onOpenMicroscope && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick(1400);
                          onOpenMicroscope(disease.id);
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-900 border border-purple-500/40 text-purple-300 hover:bg-purple-950/50 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="فحص الخلية تحت المجهر"
                      >
                        <span>🔬 فحص الخلية</span>
                      </button>
                    )}

                    {onOpenCalorieCalculator && (disease.id === 'obesity' || disease.id === 'diabetes') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick(1450);
                          onOpenCalorieCalculator();
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/50 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="فتح حاسبة السعرات والأيض"
                      >
                        <Flame className="w-3.5 h-3.5 text-emerald-400" />
                        <span>حاسبة السعرات</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right / Center Holographic SVG Human Body Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center justify-center"
          >
            
            <div className="relative w-full max-w-[440px] aspect-[400/680] bg-slate-950/80 rounded-3xl border border-slate-800 p-4 shadow-[0_0_50px_rgba(6,182,212,0.12)] flex items-center justify-center overflow-hidden">
              
              {/* Top HUD scan metadata */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-bold text-cyan-300 border-b border-slate-800 pb-2 z-20">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>مسح تشريحي حيوي تفاعلي</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">انقر على أي نقطة</span>
              </div>

              {/* Bottom HUD instructions */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-bold text-slate-300 border-t border-slate-800 pt-2 z-20">
                <span>المستشعرات: نشطة وطبيعية</span>
                <span className="text-cyan-400 animate-pulse">4 نقاط حيوية قابلة للفحص</span>
              </div>

              {/* Holographic Body SVG */}
              <svg
                viewBox="0 0 400 680"
                className="w-full h-full filter drop-shadow-[0_0_15px_rgba(6,182,212,0.35)] select-none"
              >
                <defs>
                  {/* Glowing gradients */}
                  <linearGradient id="holoBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                    <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                  </linearGradient>

                  <linearGradient id="spineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
                  </linearGradient>

                  <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Hotspot Radar Animation Definition */}
                  <radialGradient id="hotspotGlow">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Cyber Grid Circles in background */}
                <circle cx="200" cy="320" r="160" stroke="#0e7490" strokeOpacity="0.15" strokeWidth="1" fill="none" strokeDasharray="4 6" />
                <circle cx="200" cy="320" r="120" stroke="#0e7490" strokeOpacity="0.2" strokeWidth="1" fill="none" />
                <circle cx="200" cy="320" r="70" stroke="#0e7490" strokeOpacity="0.25" strokeWidth="1" fill="none" strokeDasharray="2 4" />

                {/* Crosshair markers */}
                <line x1="200" y1="40" x2="200" y2="640" stroke="#0e7490" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 6" />
                <line x1="60" y1="320" x2="340" y2="320" stroke="#0e7490" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 6" />

                {/* Holographic Human Body Outline (Anatomical Stylized Silhouette) */}
                <path
                  d="
                    M 200 45
                    C 215 45, 226 56, 226 75
                    C 226 94, 218 108, 213 118
                    C 228 123, 252 135, 270 155
                    C 290 178, 305 215, 312 260
                    C 316 285, 318 335, 315 365
                    C 312 375, 302 380, 296 370
                    C 290 350, 286 300, 280 260
                    C 275 230, 268 210, 255 200
                    L 255 250
                    C 255 295, 250 340, 250 375
                    C 250 395, 245 420, 240 445
                    L 242 530
                    C 243 570, 240 610, 235 635
                    C 232 642, 220 642, 218 635
                    C 215 605, 212 550, 210 500
                    L 205 450
                    C 203 440, 197 440, 195 450
                    L 190 500
                    C 188 550, 185 605, 182 635
                    C 180 642, 168 642, 165 635
                    C 160 610, 157 570, 158 530
                    L 160 445
                    C 155 420, 150 395, 150 375
                    C 150 340, 145 295, 145 250
                    L 145 200
                    C 132 210, 125 230, 120 260
                    C 114 300, 110 350, 104 370
                    C 98 380, 88 375, 85 365
                    C 82 335, 84 285, 88 260
                    C 95 215, 110 178, 130 155
                    C 148 135, 172 123, 187 118
                    C 182 108, 174 94, 174 75
                    C 174 56, 185 45, 200 45
                    Z
                  "
                  fill="url(#holoBodyGrad)"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeOpacity="0.75"
                  className="transition-all duration-300"
                />

                {/* Internal Spinal Cord & Neural Column */}
                <path
                  d="M 200 110 L 200 410"
                  stroke="url(#spineGrad)"
                  strokeWidth="3"
                  strokeDasharray="2 4"
                  strokeLinecap="round"
                />

                {/* Rib Cage Contours (Holographic light lines) */}
                <path d="M 180 180 Q 200 190 220 180" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
                <path d="M 175 198 Q 200 210 225 198" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
                <path d="M 172 216 Q 200 230 228 216" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
                <path d="M 172 234 Q 200 250 228 234" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
                <path d="M 175 252 Q 200 268 225 252" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />

                {/* Major Blood Vessels / Circulatory Highway */}
                {/* Aortic Arch & Descending Aorta */}
                <path
                  d="M 198 210 C 205 195, 215 195, 218 210 C 219 220, 208 235, 204 260 L 204 380"
                  stroke="#f43f5e"
                  strokeWidth="2.2"
                  strokeOpacity="0.75"
                  fill="none"
                />
                {/* Vena Cava and return venous path */}
                <path
                  d="M 194 185 L 194 380"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeOpacity="0.65"
                  fill="none"
                />
                {/* Femoral branches down legs */}
                <path d="M 204 380 Q 212 430 226 510 L 222 610" stroke="#f43f5e" strokeWidth="1.4" strokeOpacity="0.5" fill="none" />
                <path d="M 194 380 Q 188 430 174 510 L 178 610" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.5" fill="none" />

                {/* Organ Vector Glyphs in Silhouette */}
                
                {/* 1. HEART & ARTERIES GLYPH */}
                <g 
                  transform="translate(198, 222)"
                  className="cursor-pointer"
                  onClick={() => handleOrganClick(DISEASES_DATA.find(d => d.id === 'hypertension')!)}
                  onMouseEnter={() => handleOrganHover('hypertension')}
                  onMouseLeave={() => handleOrganHover(null)}
                >
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
                  <path
                    d="M 0 -7 C -6 -13, -13 -6, -13 0 C -13 7, 0 14, 0 17 C 0 14, 13 7, 13 0 C 13 -6, 6 -13, 0 -7 Z"
                    fill="#ef4444"
                    fillOpacity={hoveredId === 'hypertension' ? 0.9 : 0.6}
                    stroke="#fee2e2"
                    strokeWidth="1.5"
                    filter="url(#glowFilter)"
                    className="transition-all duration-300"
                  />
                  {/* Pulsing Hotspot Radar Wave */}
                  <circle cx="0" cy="0" r="24" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping opacity-60" />
                </g>

                {/* 2. PANCREAS GLYPH */}
                <g 
                  transform="translate(195, 292)"
                  className="cursor-pointer"
                  onClick={() => handleOrganClick(DISEASES_DATA.find(d => d.id === 'diabetes')!)}
                  onMouseEnter={() => handleOrganHover('diabetes')}
                  onMouseLeave={() => handleOrganHover(null)}
                >
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 3" />
                  {/* Stylized Pancreatic gland shape */}
                  <path
                    d="M -16 2 C -10 -5, 6 -8, 16 -3 C 18 0, 16 5, 10 6 C 2 7, -8 8, -16 2 Z"
                    fill="#06b6d4"
                    fillOpacity={hoveredId === 'diabetes' ? 0.9 : 0.6}
                    stroke="#cffafe"
                    strokeWidth="1.5"
                    filter="url(#glowFilter)"
                    className="transition-all duration-300"
                  />
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping opacity-60" style={{ animationDuration: '2.2s' }} />
                </g>

                {/* 3. DIGESTIVE & ADIPOSE TISSUE GLYPH */}
                <g 
                  transform="translate(200, 342)"
                  className="cursor-pointer"
                  onClick={() => handleOrganClick(DISEASES_DATA.find(d => d.id === 'obesity')!)}
                  onMouseEnter={() => handleOrganHover('obesity')}
                  onMouseLeave={() => handleOrganHover(null)}
                >
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Visceral abdominal coil */}
                  <path
                    d="M -14 -6 Q 0 -12 14 -6 Q 16 6 0 10 Q -16 6 -14 -6 Z"
                    fill="#f59e0b"
                    fillOpacity={hoveredId === 'obesity' ? 0.85 : 0.55}
                    stroke="#fef3c7"
                    strokeWidth="1.5"
                    filter="url(#glowFilter)"
                    className="transition-all duration-300"
                  />
                  <circle cx="0" cy="0" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-ping opacity-60" style={{ animationDuration: '2.5s' }} />
                </g>

                {/* 4. BLOOD CELLS & CIRCULATION GLYPH */}
                <g 
                  transform="translate(142, 388)"
                  className="cursor-pointer"
                  onClick={() => handleOrganClick(DISEASES_DATA.find(d => d.id === 'anemia')!)}
                  onMouseEnter={() => handleOrganHover('anemia')}
                  onMouseLeave={() => handleOrganHover(null)}
                >
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 3" />
                  {/* Stylized biconcave RBC disk */}
                  <ellipse cx="0" cy="0" rx="9" ry="7" fill="#10b981" fillOpacity={hoveredId === 'anemia' ? 0.9 : 0.6} stroke="#a7f3d0" strokeWidth="1.5" filter="url(#glowFilter)" />
                  <ellipse cx="0" cy="0" rx="4" ry="2.5" fill="#047857" />
                  <circle cx="0" cy="0" r="20" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping opacity-60" style={{ animationDuration: '1.9s' }} />
                </g>

                {/* Callout Pointer Lines & Labels with Neon glow */}

                {/* Callout 1: Heart (to Left HUD) */}
                <g className="transition-opacity duration-300">
                  <path d="M 185 222 L 80 200 L 40 200" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.7" />
                  <circle cx="40" cy="200" r="2.5" fill="#ef4444" />
                  <text x="36" y="192" fill="#fda4af" fontSize="10" fontFamily="Cairo" fontWeight="bold" textAnchor="start">
                    القلب والشرايين
                  </text>
                  <text x="36" y="214" fill="#ef4444" fontSize="8" fontFamily="sans-serif" textAnchor="start">
                    [ضغط الدم]
                  </text>
                </g>

                {/* Callout 2: Pancreas (to Right HUD) */}
                <g className="transition-opacity duration-300">
                  <path d="M 215 292 L 310 270 L 360 270" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.7" />
                  <circle cx="360" cy="270" r="2.5" fill="#06b6d4" />
                  <text x="360" y="262" fill="#67e8f9" fontSize="10" fontFamily="Cairo" fontWeight="bold" textAnchor="end">
                    البنكرياس
                  </text>
                  <text x="360" y="284" fill="#06b6d4" fontSize="8" fontFamily="sans-serif" textAnchor="end">
                    [داء السكري]
                  </text>
                </g>

                {/* Callout 3: Obesity / Visceral Fat (to Right HUD) */}
                <g className="transition-opacity duration-300">
                  <path d="M 220 342 L 310 350 L 360 350" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
                  <circle cx="360" cy="350" r="2.5" fill="#f59e0b" />
                  <text x="360" y="342" fill="#fcd34d" fontSize="10" fontFamily="Cairo" fontWeight="bold" textAnchor="end">
                    الأحشاء والدهون
                  </text>
                  <text x="360" y="364" fill="#f59e0b" fontSize="8" fontFamily="sans-serif" textAnchor="end">
                    [السمنة والأيض]
                  </text>
                </g>

                {/* Callout 4: Blood / Anemia (to Left HUD) */}
                <g className="transition-opacity duration-300">
                  <path d="M 125 388 L 70 410 L 35 410" fill="none" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.7" />
                  <circle cx="35" cy="410" r="2.5" fill="#10b981" />
                  <text x="35" y="402" fill="#6ee7b7" fontSize="10" fontFamily="Cairo" fontWeight="bold" textAnchor="start">
                    خلايا الدم
                  </text>
                  <text x="35" y="424" fill="#10b981" fontSize="8" fontFamily="sans-serif" textAnchor="start">
                    [فقر الدم - الأنيميا]
                  </text>
                </g>

              </svg>
            </div>

            {/* Quick interactive hint below graphic */}
            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>انقر مباشرة على أي نقطة ضوئية في المجسم لفتح المختبر الحيوي</span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
