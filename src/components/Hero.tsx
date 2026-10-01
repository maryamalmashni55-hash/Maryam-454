import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { 
  Activity, 
  Sparkles, 
  HeartPulse, 
  Flame, 
  ArrowLeft,
  Award,
  ShieldCheck,
  Bot,
  GraduationCap,
  School,
  HeartHandshake,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface HeroProps {
  onStartExploration: () => void;
  onOpenDiabetes: () => void;
  onOpenObesity: () => void;
  onOpenPrevention: () => void;
  onOpenQuiz: () => void;
  onOpenAiAssistant: () => void;
  onReplayIntro?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onStartExploration,
  onOpenDiabetes,
  onOpenObesity,
  onOpenPrevention,
  onOpenQuiz,
  onOpenAiAssistant,
  onReplayIntro
}) => {
  const handleStart = () => {
    sound.playClick(1400);
    sound.playHoloOpen();
    onStartExploration();
  };

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      
      {/* Ambient background soft glowing lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/15 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-24 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Top Status Pill: Slogan */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>غذاء متوازن • نشاط مستمر • ووعي يحمينا من السمنة والسكري</span>
        </motion.div>

        {/* Master Initiative Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.2] mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 drop-shadow-[0_0_35px_rgba(16,185,129,0.5)]">
            مبادرة صحتي مسؤوليتي
          </span>
          <br />
          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-200 mt-2 inline-block">
            دليلك التفاعلي للوقاية من السمنة والسكري
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8 text-balance"
        >
          منصة تعليمية وسريرية تفاعلية تقدمها 
          <strong className="text-cyan-300 font-black"> المتوسطة الأولى بالراكة </strong> 
          لترسيخ الوعي الصحي السليم، وفهم التغيرات الخلوية، والتحكم في مؤشرات الدم والسعرات ونمط الحياة اليومي.
        </motion.p>

        {/* Supervisors & School Honor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-4xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 mb-10 shadow-[0_0_35px_rgba(16,185,129,0.12)] flex flex-col md:flex-row items-center justify-between gap-5 text-right"
        >
          {/* School */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-cyan-400 block font-bold">المدرسة:</span>
              <span className="text-base font-black text-white">المتوسطة الأولى بالراكة</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden md:block" />

          {/* Supervisors Teachers */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">إشراف المعلمات الفاضلات:</span>
              <span className="text-sm sm:text-base font-black text-emerald-300">
                أ. مريم • أ. هيا • أ. بشاير
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden md:block" />

          {/* Admin Assistant & Team */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/90 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">المساعد الإداري:</span>
              <span className="text-sm sm:text-base font-black text-amber-300">أ. جواهر</span>
              <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">تصميم وإخراج: فريق إمـَـا</span>
            </div>
          </div>
        </motion.div>

        {/* The Two Main Dedicated Pillars (Cards: Diabetes & Obesity) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mb-10 text-right">
          
          {/* Card 1: Diabetes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={onOpenDiabetes}
            onMouseEnter={() => sound.playClick(1300)}
            className="p-6 sm:p-7 rounded-3xl bg-slate-900/85 border border-orange-500/40 hover:border-orange-400 transition-all cursor-pointer group shadow-xl hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient hover glow reflector */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-950 text-orange-300 border border-orange-500/40 shadow-sm group-hover:bg-orange-900/80 transition-colors">
                  القسم الأول
                </span>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-300 flex items-center justify-center group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-200 transition-colors mb-2">
                قسم مرض السكري (Diabetes)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                استكشف آلية عمل البنكرياس والأنسولين، أنواع السكري (1 و 2 وما قبل السكري وسكري الحمل)، ومحاكي الجلوكوز التفاعلي، والأرقام الذهبية المخبرية.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-bold text-orange-300 pt-3 border-t border-slate-800 group-hover:border-orange-500/40 transition-colors">
              <span className="group-hover:translate-x-1 transition-transform">استكشاف قسم السكري والمحاكي</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Obesity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={onOpenObesity}
            onMouseEnter={() => sound.playClick(1300)}
            className="p-6 sm:p-7 rounded-3xl bg-slate-900/85 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group shadow-xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient hover glow reflector */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm group-hover:bg-amber-900/80 transition-colors">
                  القسم الثاني
                </span>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-115 group-hover:-rotate-6 transition-all duration-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <Flame className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-200 transition-colors mb-2">
                قسم مرض السمنة (Obesity)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                تعرف على مخاطر الدهون الحشوية، وحاسبة مؤشر كتلة الجسم (BMI) ومحيط الخصر، وعلاقة السمنة المباشرة بمقاومة الأنسولين.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-bold text-amber-300 pt-3 border-t border-slate-800 group-hover:border-amber-500/40 transition-colors">
              <span className="group-hover:translate-x-1 transition-transform">استكشاف قسم السمنة والحاسبة</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            </div>
          </motion.div>

        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3 border border-emerald-300/40"
          >
            <span>بدء الجولة التثقيفية التفاعلية</span>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenPrevention}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>حاسبة السعرات والتمثيل الغذائي</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>اختبار تحدي الوعي</span>
          </button>

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              title="إعادة مشاهدة الدخول السينمائي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة المشهد السينمائي</span>
            </button>
          )}
        </div>

      </div>

    </section>
  );
};
