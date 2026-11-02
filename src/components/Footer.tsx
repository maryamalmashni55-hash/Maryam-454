import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Activity, 
  ArrowUp, 
  GraduationCap, 
  School,
  Flame,
  Apple
} from 'lucide-react';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick(1300);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goldenRules = [
    {
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      title: 'نشاط مستمر وحركة يومية',
      description: '150 دقيقة أسبوعياً من المشي السريع أو التمارين تنشط مستقبلات GLUT-4 وتدخل الجلوكوز للخلايا وتحرق دهون الأحشاء.'
    },
    {
      icon: <Apple className="w-5 h-5 text-emerald-400" />,
      title: 'غذاء متوازن غني بالألياف',
      description: 'الابتعاد الكامل عن المشروبات السكرية والدهون المهدرجة، والاعتماد على الخضروات، البقوليات، والحبوب الكاملة منخفضة المؤشر الجلايسيمي.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: 'وعي مبكر وفحص دوري',
      description: 'قياس محيط الخصر، مراقبة الوزن، وإجراء فحص السكر التراكمي (HbA1c) سنوياً يحميك بنسبة تفوق 80% من تطور السكري.'
    }
  ];

  return (
    <footer id="prevention-rules-footer" className="relative bg-[#02040b] border-t border-emerald-500/20 text-slate-400 text-right overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-emerald-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Golden Prevention Rules Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            INITIATIVE PILLARS • مبادرة صحتي مسؤوليتي
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2">
            «غذاء متوازن • نشاط مستمر • ووعي يحمينا من السمنة والسكري»
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            الركائز الثلاث التي تبني حصناً منيعاً لخلاياك ضد متلازمة الأيض ومقاومة الأنسولين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {goldenRules.map((rule, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {rule.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {rule.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>

        {/* Project Dedication & Supervisors Banner */}
        <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.1)] text-right flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">المتوسطة الأولى بالراكة • مبادرة صحتي مسؤوليتي</span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-slate-300 font-bold">إشراف:</span>
                <span className="text-sm sm:text-base font-black text-emerald-300">
                  معلمات العلوم • معلمات المهارات الحياتية الأسرية • المرشدة الصحية
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-medium">تصميم وإخراج:</span>
              <span className="text-base font-black text-amber-300 bg-amber-500/10 px-3 py-0.5 rounded-xl border border-amber-500/30 inline-block shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                ميِم
              </span>
            </div>
            <button
              onClick={scrollToTop}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
              title="العودة لأعلى الصفحة"
            >
              <ArrowUp className="w-5 h-5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — مبادرة صحتي مسؤوليتي | المتوسطة الأولى بالراكة.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span>إشراف: معلمات العلوم • معلمات المهارات الحياتية الأسرية • المرشدة الصحية</span>
            <span className="text-slate-600">•</span>
            <span>تصميم وإخراج: <strong className="text-amber-300 font-bold">ميِم</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
