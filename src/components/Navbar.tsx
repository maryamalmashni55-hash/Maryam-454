import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Sparkles, 
  Bot, 
  GraduationCap, 
  School,
  RotateCcw,
  Flame,
  Award,
  HeartPulse,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onReplayIntro?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeSection, 
  onNavigate, 
  onReplayIntro,
  onOpenAiAssistant
}) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick(1000);
    }
  };

  const navItems = [
    { id: 'hero', label: 'الرئيسية', icon: '🏠' },
    { id: 'hub', label: 'قسم السكري والسمنة', icon: '🧬' },
    { id: 'prevention-rules', label: 'حاسبة السعرات والتمثيل الغذائي', icon: '🔥' },
    { id: 'quiz', label: 'تحدي الوعي', icon: '🧠' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060913]/95 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        
        {/* Top Slim Honor Banner: School, Supervision & Design */}
        <div className="bg-[#02050e] border-b border-emerald-950/40 px-3 sm:px-4 py-1 text-[11px] text-slate-400 text-center flex flex-wrap items-center justify-between gap-x-3 gap-y-1 select-none">
          <div className="flex flex-wrap items-center gap-1.5 text-emerald-300 mx-auto sm:mx-0">
            <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <strong className="text-white font-bold">المتوسطة الأولى بالراكة</strong>
            <span className="text-slate-600">•</span>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400">إشراف:</span>
            <strong className="text-emerald-200 font-bold">معلمات العلوم • معلمات المهارات الحياتية الأسرية • المرشدة الصحية</strong>
          </div>

          <div className="flex items-center gap-2 mx-auto sm:mx-0 text-amber-300 font-medium">
            <span className="text-slate-400">تصميم وإخراج:</span>
            <strong className="text-amber-300 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[10px] shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              ميِم
            </strong>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="nav-brand-logo"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
              <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>
            <div className="text-right">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                مبادرة صحتي مسؤوليتي
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                «غذاء متوازن • نشاط مستمر • ووعي يحمينا من السمنة والسكري»
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick(1100);
                  onNavigate(item.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Controls: AI Assistant, Intro Replay, Mute Toggle */}
          <div className="flex items-center gap-2">
            
            {/* AI Assistant Quick Trigger */}
            {onOpenAiAssistant && (
              <button
                onClick={() => {
                  sound.playClick(1300);
                  onOpenAiAssistant();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="المساعد الطبي الذكي للمبادرة"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="hidden lg:inline">المساعد الذكي</span>
              </button>
            )}

            {/* Replay Intro */}
            {onReplayIntro && (
              <button
                onClick={() => {
                  sound.playClick(1200);
                  onReplayIntro();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs text-emerald-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="إعادة مشاهدة الدخول السينمائي"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">المشهد السينمائي</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم المؤثرات'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-850 px-2 py-1.5 bg-slate-950/90 overflow-x-auto gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick(1100);
                onNavigate(item.id);
              }}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </header>
    </>
  );
};
