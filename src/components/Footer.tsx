import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, Activity, Dna, ArrowUp, GraduationCap } from 'lucide-react';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick(1300);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goldenRules = [
    {
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      title: 'الحركة هي الدواء الأول',
      description: '150 دقيقة أسبوعياً من النشاط البدني المتنوع تحمي قلبك وتضبط سكر دمك وتنشط أكسجة خلاياك بنسبة 60%.'
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      title: 'اختر طعامك كجرعة علاج',
      description: 'أبعد السكريات الصناعية والمشروبات الغازية والصوديوم المعالج، واجعل الخضروات والألياف هي الأساس.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'الفحص الدوري استثمار مبكر',
      description: 'تحليل السكر التراكمي، قياس ضغط الدم، وصورة الدم السنوية تكشف أي خلل وهو قابل للعكس بالكامل.'
    }
  ];

  return (
    <footer id="prevention-rules" className="relative bg-[#02040a] border-t border-cyan-500/20 text-slate-400 text-right overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Golden Prevention Rules Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            GOLDEN HEALTH & PREVENTION PILLARS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2">
            الركائز الذهبية للوقاية ونمط الحياة الصحي
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            ثلاثة أركان علمية متكاملة تمنح خلاياك وقلبك الحصانة المستدامة في وجه الأمراض المزمنة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {goldenRules.map((rule, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-950/70 border border-slate-850 hover:border-cyan-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {rule.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {rule.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Project Dedication & Supervisors Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.12)] text-right flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">إشراف وتوجيه المعلمات الفاضلات:</span>
              <h4 className="text-lg font-black text-cyan-300 mt-0.5">
                أ. مريم • أ. هيا • أ. بشاير • أ. جواهر
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                كل الشكر والتقدير لجهودهن العظيمة في التوجيه الأكاديمي ودعم نشر الوعي الصحي.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-r border-slate-800 pt-4 md:pt-0 md:pr-6 w-full md:w-auto justify-between md:justify-start">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">تصميم وتنفيذ وإخراج:</span>
              <h4 className="text-lg font-black text-emerald-300 mt-0.5">
                فريق إمـَـا
              </h4>
              <p className="text-xs text-emerald-400/80 font-mono">
                صُمم بشغف وإتقان لخدمة الصحة والتوعية الحيوية
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Footer Summary & Credits */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
              <Dna className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-white">رحلة داخل آلة الحياة: الأمراض المزمنة</p>
              <p className="text-[11px] text-slate-500 font-mono">تجربة تفاعلية سينمائية للتوعية والوقاية الحيوية</p>
            </div>
          </div>

          <div className="text-center sm:text-left text-slate-400 text-[11px]">
            <span>الوقاية خير من قنطار علاج • جسدك هو أثمن ما تملك</span>
          </div>

          <button
            id="scroll-to-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <span>للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </footer>
  );
};
