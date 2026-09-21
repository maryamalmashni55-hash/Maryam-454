import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Activity, 
  Droplets, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw, 
  Bot, 
  Trophy, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookmarkCheck
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface HealthTip {
  id: string;
  category: 'diabetes' | 'hypertension' | 'anemia' | 'metabolism' | 'general';
  categoryName: string;
  categoryColor: string;
  categoryBg: string;
  categoryBorder: string;
  icon: React.ReactNode;
  title: string;
  shortTip: string;
  scientificExplanation: string;
  dailyChallenge: string;
  metric: string;
  benefit: string;
}

const HEALTH_TIPS_COLLECTION: HealthTip[] = [
  {
    id: 'tip-1',
    category: 'diabetes',
    categoryName: 'صحة البنكرياس والسكري',
    categoryColor: 'text-cyan-400',
    categoryBg: 'bg-cyan-950/40',
    categoryBorder: 'border-cyan-500/30',
    icon: <Activity className="w-5 h-5 text-cyan-400" />,
    title: 'قاعدة الـ 10 دقائق بعد الوجبة',
    shortTip: 'المشي الخفيف لمدة 10 إلى 15 دقيقة بعد وجبتك الرئيسية يخفض ذروة سكر الدم بنسبة تصل إلى 22%.',
    scientificExplanation: 'عند انقباض العضلات أثناء المشي، تُفعّل قنوات GLUT-4 لامتصاص الجلوكوز مباشرة من مجرى الدم دون الحاجة لزيادة إفراز الإنسولين، مما يريح خلايا بيتا في البنكرياس.',
    dailyChallenge: 'امشِ 10 دقائق هادئة فور الانتهاء من وجبة الغداء أو العشاء اليوم.',
    metric: 'خفض 22% من ذروة الجلوكوز',
    benefit: 'تحسين حساسية الإنسولين وحماية الشرايين'
  },
  {
    id: 'tip-2',
    category: 'hypertension',
    categoryName: 'ضغط الدم وصحة القلب',
    categoryColor: 'text-rose-400',
    categoryBg: 'bg-rose-950/40',
    categoryBorder: 'border-rose-500/30',
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    title: 'توازن الصوديوم بالبوتاسيوم الطبيعي',
    shortTip: 'إضافة حصة واحدة غنية بالبوتاسيوم (كموزة أو نصف كوب سبانخ أو حبة أفوكادو) تدعم مرونة الأوعية وتطرد فائض الصوديوم.',
    scientificExplanation: 'يعمل البوتاسيوم كموسع طبيعي للأوعية الدموية ويحفز الكليتين على التخلص من الصوديوم الزائد، مما يقلل الحجم الوعائي والضغط على جدران الشرايين التاجية.',
    dailyChallenge: 'استبدل وجبة خفيفة معالجة بفاكهة أو خضار طازج غني بالبوتاسيوم.',
    metric: 'انخفاض 4-5 ملم زئبق بالضغط الانقباضي',
    benefit: 'حماية عضلة القلب والشرايين من التصلب'
  },
  {
    id: 'tip-3',
    category: 'anemia',
    categoryName: 'خلايا الدم والهيموجلوبين',
    categoryColor: 'text-emerald-400',
    categoryBg: 'bg-emerald-950/40',
    categoryBorder: 'border-emerald-500/30',
    icon: <Droplets className="w-5 h-5 text-emerald-400" />,
    title: 'الثنائي الذهبي لامتصاص الحديد',
    shortTip: 'تناول مصادر الحديد النباتي (كالعدس والفول والسبانخ) مع عصرة ليمون أو حبة كيوي غنية بفيتامين C لمضاعفة الامتصاص 3 مرات.',
    scientificExplanation: 'يحول فيتامين C الحديد غير الهيمي (Fe3+) إلى صورة (Fe2+) الأكثر قابلية للامتصاص في الاثني عشر، بينما يؤدي شرب الشاي أو القهوة أثناء الوجبة إلى إعاقة الامتصاص لاحتوائها على التانين.',
    dailyChallenge: 'أضف الليمون الطازج لطبق السلطة أو الشوربة وأجّل الشاي لمدة ساعة بعد الأكل.',
    metric: 'مضاعفة امتصاص الحديد حتى 300%',
    benefit: 'تجديد كريات الدم الحمراء ومحاربة الدوار والإرهاق'
  },
  {
    id: 'tip-4',
    category: 'metabolism',
    categoryName: 'السمنة والتمثيل الغذائي',
    categoryColor: 'text-amber-400',
    categoryBg: 'bg-amber-950/40',
    categoryBorder: 'border-amber-500/30',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    title: 'تأثير الماء على الحرق الحيوي (NEAT)',
    shortTip: 'شرب 500 مل من الماء البارد أو المعتدل يرفع معدل الأيض الاستراحي بنسبة تقارب 24% لمدة 60 دقيقة.',
    scientificExplanation: 'يحتاج الجسم لطاقة حرارية (Thermogenesis) لمعادلة درجة حرارة السوائل، كما يعزز الترطيب الكافي وظائف الميتوكوندريا في تحلل الأحماض الدهنية وتفكيكها.',
    dailyChallenge: 'اشرب كوبين كبيرين من الماء النقي قبل كل وجبة بربع ساعة.',
    metric: 'رفع التمثيل الغذائي بنسبة 24%',
    benefit: 'تحفيز حرق الدهون ومنع الإفراط في تناول الطعام'
  },
  {
    id: 'tip-5',
    category: 'diabetes',
    categoryName: 'الوقاية من مقاومة الإنسولين',
    categoryColor: 'text-cyan-400',
    categoryBg: 'bg-cyan-950/40',
    categoryBorder: 'border-cyan-500/30',
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    title: 'ترتيب تناول مكونات الطبق الصحي',
    shortTip: 'ابدأ وجبتك بتناول الخضار والألياف أولاً، ثم البروتينات والدهون الصحية، واجعل النشويات في النهاية.',
    scientificExplanation: 'تشكل الألياف شبكة هلامية في الأمعاء الدقيقة تبطئ مرور الجلوكوز إلى الدم، مما يمنع الصدمات السكرية الحادة ويمنع إفراز كميات مفرطة من الإنسولين.',
    dailyChallenge: 'في وجبتك القادمة، تناول طبق السلطة كاملاً قبل البدء بالأرز أو الخبز.',
    metric: 'إبطاء امتصاص النشويات بنسبة 40%',
    benefit: 'استقرار طاقة الجسم ومحاربة الخمول بعد الوجبات'
  },
  {
    id: 'tip-6',
    category: 'hypertension',
    categoryName: 'التنفس وعضلة القلب',
    categoryColor: 'text-rose-400',
    categoryBg: 'bg-rose-950/40',
    categoryBorder: 'border-rose-500/30',
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    title: 'تمرين التنفس البطيء (4-7-8)',
    shortTip: 'دقيقتان فقط من التنفس العميق والبطيء كفيلة بخفض مستويات الكورتيزول وتنشيط العصب الحائر.',
    scientificExplanation: 'يحفز التنفس البطني العميق الجهاز العصبي اللاودي (Parasympathetic)، مما يخفض معدل النبض ويريخ العضلات الملساء في جدران الشرايين، فتنخفض قراءة الضغط فوراً.',
    dailyChallenge: 'مارس 4 دورات من التنفس الهادئ (شهيق 4 ثوانٍ، حبس 7، زفير 8) الآن.',
    metric: 'خفض هرمون التوتر وتوسيع الشرايين',
    benefit: 'هدوء عصبي فوري وتنظيم نبضات القلب'
  },
  {
    id: 'tip-7',
    category: 'metabolism',
    categoryName: 'النوم والدهون الحشوية',
    categoryColor: 'text-amber-400',
    categoryBg: 'bg-amber-950/40',
    categoryBorder: 'border-amber-500/30',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    title: 'هرمون الشبع (اللبتين) وساعات النوم',
    shortTip: 'النوم العميق لمدة 7 إلى 8 ساعات يعيد ضبط هرموني الجوع (الغريلين) والشبع (اللبتين) ويمنع اشتهاء السكريات.',
    scientificExplanation: 'قلة النوم ترفع هرمون الكورتيزول الذي يحفز تخزين الدهون في منطقة البطن (الدهون الحشوية) ويزيد مقاومة الخلايا للإنسولين بمقدار 30% خلال 3 أيام فقط.',
    dailyChallenge: 'أغلق الشاشات والهواتف الذكية قبل موعد نومك المعتاد بـ 45 دقيقة الليلة.',
    metric: 'توازن هرموني يقلل 300 سعرة زائدة',
    benefit: 'حرق الدهون ليلاً وحماية التمثيل الغذائي'
  }
];

interface DailyHealthTipProps {
  onOpenAiWithTip?: (question: string) => void;
}

export const DailyHealthTip: React.FC<DailyHealthTipProps> = ({ onOpenAiWithTip }) => {
  // Day-based automatic tip calculation
  const getDayIndex = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % HEALTH_TIPS_COLLECTION.length;
  };

  const [activeTipIndex, setActiveTipIndex] = useState<number>(getDayIndex());
  const [completedToday, setCompletedToday] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(3);
  const [copied, setCopied] = useState<boolean>(false);

  const todayFormatted = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  // Check localStorage for today's challenge completion
  useEffect(() => {
    const todayKey = `health_tip_completed_${new Date().toISOString().slice(0, 10)}`;
    const saved = localStorage.getItem(todayKey);
    if (saved === 'true') {
      setCompletedToday(true);
    }
    const savedStreak = localStorage.getItem('health_streak');
    if (savedStreak) {
      setStreakCount(parseInt(savedStreak, 10));
    }
  }, []);

  const currentTip = HEALTH_TIPS_COLLECTION[activeTipIndex];

  const handleToggleChallenge = () => {
    sound.playClick(1500);
    const nextState = !completedToday;
    setCompletedToday(nextState);

    const todayKey = `health_tip_completed_${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(todayKey, nextState ? 'true' : 'false');

    if (nextState) {
      sound.playSuccessChime();
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      localStorage.setItem('health_streak', newStreak.toString());
    } else {
      const newStreak = Math.max(1, streakCount - 1);
      setStreakCount(newStreak);
      localStorage.setItem('health_streak', newStreak.toString());
    }
  };

  const handleNextTip = () => {
    sound.playClick(1300);
    setActiveTipIndex((prev) => (prev + 1) % HEALTH_TIPS_COLLECTION.length);
  };

  const handleCopyTip = () => {
    sound.playClick(1400);
    const shareText = `🌟 نصيحة اليوم الصحية (${currentTip.title}):
${currentTip.shortTip}

🎯 التحدي اليومي: ${currentTip.dailyChallenge}
💡 الفائدة العلمية: ${currentTip.benefit}

من منصة: رحلة داخل آلة الحياة: الأمراض المزمنة
إشراف: أ. مريم • أ. هيا • أ. بشاير • أ. جواهر | تنفيذ: فريق إمـَـا`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleConsultAI = () => {
    sound.playClick(1600);
    if (onOpenAiWithTip) {
      const q = `أريد معرفة المزيد عن "${currentTip.title}" وكيف أطبق "${currentTip.dailyChallenge}" بأفضل طريقة لحماية صحتي.`;
      onOpenAiWithTip(q);
    }
  };

  return (
    <section id="daily-health-tip" className="w-full py-8 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <Sparkles className="w-4 h-4" />
              <span>توعية يومية متجددة تلقائياً</span>
              <span className="text-slate-600">•</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300">{todayFormatted}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>نصيحة اليوم الصحية</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                تفاعلي يومي
              </span>
            </h2>
          </div>

          {/* Interactive Controls & Streak */}
          <div className="flex items-center gap-3">
            {/* Streak Counter Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>سلسلة الالتزام:</span>
              <strong className="text-white font-mono text-sm">{streakCount}</strong>
              <span>أيام</span>
            </div>

            {/* Change Tip / Randomize */}
            <button
              onClick={handleNextTip}
              title="عرض نصيحة أخرى"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>نصيحة أخرى</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Card */}
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a1020] to-slate-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden"
        >
          {/* Subtle top ambient glow */}
          <div className="absolute top-0 right-1/4 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Card Top Banner */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${currentTip.categoryBg} border ${currentTip.categoryBorder} flex items-center justify-center shrink-0 shadow-md`}>
                {currentTip.icon}
              </div>
              <div>
                <span className={`text-xs font-bold ${currentTip.categoryColor} block`}>
                  {currentTip.categoryName}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  {currentTip.title}
                </h3>
              </div>
            </div>

            {/* Scientific Metric Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTip.metric}</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Core Tip & Scientific Explanation (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Highlight Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                <span className="text-xl inline-block ml-2">💡</span>
                {currentTip.shortTip}
              </div>

              {/* Scientific Mechanism */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>الآلية البيولوجية داخل آلة الحياة:</span>
                </div>
                <p>{currentTip.scientificExplanation}</p>
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>المردود الصحي: {currentTip.benefit}</span>
                </div>
              </div>

            </div>

            {/* Today's Micro-Action & Challenge (4 Cols) */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full shadow-inner">
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>تحدي اليوم التطبيقي</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">خطوة عملية</span>
                </div>

                <p className="text-xs sm:text-sm text-white font-medium mb-4 leading-normal bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {currentTip.dailyChallenge}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                
                {/* Complete Challenge Button */}
                <button
                  id="btn-complete-daily-challenge"
                  onClick={handleToggleChallenge}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    completedToday
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300'
                  }`}
                >
                  {completedToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                      <span>أحسنت! أكملت تحدي اليوم 🏆</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>هل نفذت هذا التحدي اليوم؟</span>
                    </>
                  )}
                </button>

                {/* Consult AI on this Tip */}
                {onOpenAiWithTip && (
                  <button
                    onClick={handleConsultAI}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>اسأل المساعد الذكي عن هذا التحدي</span>
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* Card Footer: Category Navigation & Copy/Share */}
          <div className="p-4 sm:px-6 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Direct categories selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 ml-1">تصفح حسب المرض:</span>
              {HEALTH_TIPS_COLLECTION.map((tip, idx) => (
                <button
                  key={tip.id}
                  onClick={() => {
                    sound.playClick(1200);
                    setActiveTipIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    activeTipIndex === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tip.categoryName.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Actions: Copy and Honor Credit */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyTip}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم نسخ النصيحة' : 'نسخ النصيحة'}</span>
              </button>

              <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                إشراف: أ. مريم • أ. هيا • أ. بشاير • أ. جواهر | فريق إمـَـا
              </span>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
