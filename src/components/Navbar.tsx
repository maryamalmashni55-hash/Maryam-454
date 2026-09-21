import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Heart, Activity, ShieldCheck, Dna, Sparkles, Bot, GraduationCap } from 'lucide-react';

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
  const [isHeartbeatOn, setIsHeartbeatOn] = useState(false);
  const [bpm, setBpm] = useState(72);

  // Sync state with sound engine
  useEffect(() => {
    setIsMuted(sound.getMuted());
    setIsHeartbeatOn(sound.getHeartbeatActive());
  }, []);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (muted) {
      setIsHeartbeatOn(false);
    } else {
      sound.playClick(1000);
    }
  };

  const handleToggleHeartbeat = () => {
    const active = sound.toggleHeartbeat(bpm);
    setIsHeartbeatOn(active);
    if (active) {
      setIsMuted(false);
    }
  };

  const navItems = [
    { id: 'hero', label: 'الرئيسية', icon: '🏠' },
    { id: 'body-map', label: 'خريطة الأمراض', icon: '🫀' },
    { id: 'microscope', label: 'المجهر الحيوي', icon: '🔬' },
    { id: 'prevention-rules', label: 'حاسبة السعرات والوقاية', icon: '🥗' },
    { id: 'quiz', label: 'التحدي الطبي', icon: '🧠' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/95 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        
        {/* Top Slim Honor Banner: Teachers & Team */}
        <div className="bg-[#03060f] border-b border-cyan-950/40 px-3 sm:px-4 py-1 text-[11px] text-slate-400 text-center flex flex-wrap items-center justify-between gap-x-3 gap-y-1 select-none">
          <div className="flex items-center gap-1 text-cyan-300 mx-auto sm:mx-0">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>إشراف المعلمات الفاضلات:</span>
            <strong className="text-white font-bold">أ. مريم • أ. هيا • أ. بشاير • أ. جواهر</strong>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 mx-auto sm:mx-0 font-medium">
            <span className="text-slate-500 hidden sm:inline">✦</span>
            <span>تصميم وتنفيذ:</span>
            <strong className="text-emerald-200 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              فريق إمـَـا
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
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-right">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                رحلة داخل آلة الحياة
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                منصة الاستكشاف الطبي للأمراض المزمنة
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  sound.playClick(1100);
                  onNavigate(item.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Audio Controls & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant Quick Trigger */}
            {onOpenAiAssistant && (
              <button
                id="btn-open-ai-assistant"
                onClick={() => {
                  sound.playClick(1400);
                  onOpenAiAssistant();
                }}
                title="فتح المساعد الطبي الذكي"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all cursor-pointer group"
              >
                <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>المساعد الذكي</span>
                <span className="w-2 h-2 rounded-full bg-emerald-350 animate-ping opacity-75" />
              </button>
            )}

            {/* Replay cinematic intro */}
            {onReplayIntro && (
              <button
                id="btn-replay-intro"
                onClick={() => {
                  sound.playClick(1000);
                  onReplayIntro();
                }}
                title="إعادة تشغيل بوابة الدخول السينمائية ثلاثية الأبعاد"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>مشهد الدخول</span>
              </button>
            )}

            {/* Heartbeat pulse toggle */}
            <button
              id="toggle-heartbeat-btn"
              onClick={handleToggleHeartbeat}
              title={isHeartbeatOn ? "إيقاف صوت نبضات القلب" : "تشغيل صوت نبضات القلب الحية"}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                isHeartbeatOn
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-300 hover:border-rose-500/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isHeartbeatOn ? 'text-rose-500 fill-rose-500 animate-heartbeat' : ''}`} />
              <span className="hidden sm:inline">النبض</span>
              <span className="text-[10px] text-rose-400 font-bold">{bpm} BPM</span>
            </button>

            {/* Master sound mute */}
            <button
              id="toggle-mute-btn"
              onClick={handleToggleMute}
              title={isMuted ? "تفعيل الصوت" : "كتم الصوت"}
              className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                isMuted
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Visible on small screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              sound.playClick(1100);
              onNavigate(item.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              activeSection === item.id
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-base mb-0.5">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}

        {onOpenAiAssistant && (
          <button
            id="mobile-btn-open-ai"
            onClick={() => {
              sound.playClick(1400);
              onOpenAiAssistant();
            }}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30"
          >
            <span className="text-base mb-0.5">🤖</span>
            <span className="whitespace-nowrap">المساعد الذكي</span>
          </button>
        )}
      </nav>
    </>
  );
};
