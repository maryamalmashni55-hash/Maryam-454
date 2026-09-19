import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { 
  Activity, 
  ChevronDown, 
  Sparkles, 
  HeartPulse, 
  Zap, 
  Microscope, 
  Flame, 
  ArrowLeft,
  Award,
  ShieldCheck,
  Stethoscope,
  Bot,
  GraduationCap
} from 'lucide-react';

interface HeroProps {
  onStartExploration: () => void;
  onOpenMicroscope?: () => void;
  onOpenPrevention?: () => void;
  onOpenQuiz?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onStartExploration, 
  onOpenMicroscope,
  onOpenPrevention,
  onOpenQuiz,
  onOpenAiAssistant
}) => {
  const handleStart = () => {
    sound.playClick(1400);
    sound.playHoloOpen();
    onStartExploration();
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
      
      {/* Ambient background soft glowing lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-24 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Top Status Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>المنصة الطبية التفاعلية لاستكشاف الأمراض المزمنة</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.2] mb-6"
        >
          رحلة داخل{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
            آلة الحياة
          </span>
          <br />
          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-200 mt-2 inline-block">
            كيف تفهم جسدك وتحميه من الأمراض؟
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8 text-balance"
        >
          جسدك ليس مجرد أعضاء منفصلة، بل هو المعجزة الأكثر تعقيداً ودقة.
          اكتشف كيف تتشابك وظائفه الحيوية، وتعرّف بعمق وبساطة على أسرار:
          <span className="text-cyan-400 font-bold"> السكري</span>،
          <span className="text-rose-400 font-bold"> ضغط الدم</span>،
          <span className="text-emerald-400 font-bold"> الأنيميا</span>،
          و<span className="text-amber-400 font-bold"> السمنة والتمثيل الغذائي</span>.
        </motion.p>

        {/* Supervisor Teachers & Team Honor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row items-center justify-around gap-4"
        >
          {/* Teachers */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">إشراف المعلمات الفاضلات:</span>
              <span className="text-sm sm:text-base font-black text-cyan-300">أ. مريم • أ. هيا • أ. بشاير</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          {/* Team Ima */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">تصميم وتنفيذ وإخراج:</span>
              <span className="text-sm sm:text-base font-black text-emerald-300">فريق إمـَـا</span>
            </div>
          </div>
        </motion.div>

        {/* 3-Step Quick Guide: Clear, Intuitive, Not Confusing */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-4xl bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 mb-10 text-right backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>دليلك السريع: كيف تستكشف الموقع في 3 خطوات؟</span>
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">سهل • تفاعلي • موثوق</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Step 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sound.playClick(1200);
                onStartExploration();
              }}
              className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-900/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-sm flex items-center justify-center">1</span>
                <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">خريطة الأعضاء</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                اضغط على أي عضو (البنكرياس، القلب، الدم، الأيض) لمعرفة أسراره وكيف يمرض وطرق حمايته.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sound.playClick(1300);
                if (onOpenMicroscope) onOpenMicroscope();
              }}
              className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-900/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 font-black text-sm flex items-center justify-center">2</span>
                <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">المجهر الحيوي</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ادخل أعماق الخلية وقارن مباشرة بين الخلية السليمة والمصابة تحت تكبير نانوي مذهل.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sound.playClick(1400);
                if (onOpenPrevention) onOpenPrevention();
              }}
              className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-900/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center">3</span>
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">حاسبة السعرات</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                أدخل وزنك وطولك لتحصل على احتياجك الدقيق من السعرات والماء وخطة الماكروز الوقائية.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Live Clinical Indicators (Clean Arabic) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mb-10"
        >
          
          {/* Card 1: Heart */}
          <div className="bg-slate-900/70 border border-rose-500/30 rounded-2xl p-3.5 text-right backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:border-rose-500/60 transition-all group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-rose-300">القلب والشرايين</span>
              <HeartPulse className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">72 <span className="text-xs text-rose-300 font-normal">نبضة/د</span></div>
            <div className="text-[11px] text-slate-400 mt-1">المعدل الطبيعي للراحة</div>
          </div>

          {/* Card 2: Glucose */}
          <div className="bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-3.5 text-right backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-500/60 transition-all group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-cyan-300">سكر الصائم</span>
              <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">92 <span className="text-xs text-cyan-300 font-normal">مغ/دل</span></div>
            <div className="text-[11px] text-slate-400 mt-1">كفاءة إفراز الأنسولين</div>
          </div>

          {/* Card 3: Oxygen */}
          <div className="bg-slate-900/70 border border-emerald-500/30 rounded-2xl p-3.5 text-right backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 transition-all group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-emerald-300">أكسجين الدم</span>
              <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">98.5 <span className="text-xs text-emerald-300 font-normal">%</span></div>
            <div className="text-[11px] text-slate-400 mt-1">كفاءة الهيموجلوبين</div>
          </div>

          {/* Card 4: Metabolic */}
          <div className="bg-slate-900/70 border border-amber-500/30 rounded-2xl p-3.5 text-right backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-500/60 transition-all group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-300">التوازن الأيضي</span>
              <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">متوازن <span className="text-xs text-amber-300 font-normal">نشط</span></div>
            <div className="text-[11px] text-slate-400 mt-1">حرق السعرات اليومي</div>
          </div>

        </motion.div>

        {/* Action Gateways Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          {/* Primary Action: Start Exploration */}
          <button
            id="start-exploration-btn"
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-sm sm:text-base font-black rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Stethoscope className="w-5 h-5 text-slate-950" />
            <span>ابدأ استكشاف الأعضاء والأمراض</span>
            <ArrowLeft className="w-4 h-4 text-slate-950" />
          </button>

          {/* Secondary Action: Calorie Calculator */}
          {onOpenPrevention && (
            <button
              onClick={() => {
                sound.playClick(1400);
                onOpenPrevention();
              }}
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white text-sm sm:text-base font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>حاسبة السعرات والوقاية</span>
            </button>
          )}

          {/* Tertiary Action: Microscope */}
          {onOpenMicroscope && (
            <button
              onClick={() => {
                sound.playClick(1300);
                onOpenMicroscope();
              }}
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white text-sm sm:text-base font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Microscope className="w-4 h-4 text-purple-400" />
              <span>المجهر الحيوي</span>
            </button>
          )}

          {/* Quaternary Action: Quiz */}
          {onOpenQuiz && (
            <button
              onClick={() => {
                sound.playClick(1200);
                onOpenQuiz();
              }}
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-white text-sm sm:text-base font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>التحدي الطبي</span>
            </button>
          )}

          {/* AI Medical Assistant Action */}
          {onOpenAiAssistant && (
            <button
              id="hero-ai-assistant-btn"
              onClick={() => {
                sound.playClick(1400);
                onOpenAiAssistant();
              }}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-400/60 hover:border-cyan-400 text-cyan-300 hover:text-white text-sm sm:text-base font-bold transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center gap-2.5 cursor-pointer backdrop-blur-md group"
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span>المساعد الطبي الذكي</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

        </motion.div>

      </div>
    </section>
  );
};
