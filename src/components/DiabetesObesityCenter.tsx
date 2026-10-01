import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Activity, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  HeartPulse, 
  Scale, 
  Bot, 
  Award, 
  ArrowRight,
  Layers,
  HeartHandshake,
  Sliders,
  RotateCcw,
  Eye,
  Footprints,
  Droplet,
  Coffee,
  Apple,
  Moon,
  Info,
  Key,
  Lock,
  Unlock,
  Pizza,
  Salad,
  BookOpen,
  FileText,
  Stethoscope,
  Heart,
  Target,
  ShieldAlert,
  ListChecks
} from 'lucide-react';

interface DiabetesObesityCenterProps {
  onSelectDiseaseModal?: (disease: any, initialTab?: any) => void;
  onOpenCalorieCalculator: () => void;
  onOpenQuiz: () => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const DiabetesObesityCenter: React.FC<DiabetesObesityCenterProps> = ({
  onOpenCalorieCalculator,
  onOpenQuiz,
  onOpenAiWithPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'diabetes' | 'obesity' | 'connection'>('diabetes');

  // ================= DIABETES INTERACTIVE STATES =================
  // 1. Biological Gate Simulator
  const [insulinGateState, setInsulinGateState] = useState<'normal' | 'resistance' | 'type1'>('normal');

  // 2. Interactive Meal Plate Selection
  const [selectedMeal, setSelectedMeal] = useState<'fastfood' | 'rice' | 'balanced' | 'keto'>('balanced');

  // 3. Interactive Body Symptom Hotspot
  const [activeHotspot, setActiveHotspot] = useState<'eyes' | 'kidneys' | 'nerves' | 'fatigue'>('eyes');

  // 4. Lab numbers sliders
  const [fastingGlucose, setFastingGlucose] = useState<number>(92);
  const [hba1cVal, setHba1cVal] = useState<number>(5.4);

  // 5. Glycemic Index Filter
  const [giFilter, setGiFilter] = useState<'low' | 'medium' | 'high'>('low');

  // 6. Emergency Hypo vs Hyper Protocol Switcher
  const [emergencyProtocol, setEmergencyProtocol] = useState<'hypo' | 'hyper'>('hypo');

  // 7. Prediabetes Self-Assessment Risk State
  const [riskQ1, setRiskQ1] = useState<boolean>(false);
  const [riskQ2, setRiskQ2] = useState<boolean>(false);
  const [riskQ3, setRiskQ3] = useState<boolean>(false);
  const [riskQ4, setRiskQ4] = useState<boolean>(false);

  // ================= OBESITY INTERACTIVE STATES =================
  // 1. Silhouette & BMI Simulator
  const [weight, setWeight] = useState<number>(78);
  const [height, setHeight] = useState<number>(170);
  const [waist, setWaist] = useState<number>(90);
  const [gender, setGender] = useState<'male' | 'female'>('female');

  // 2. Caloric Burner Food Activity Lab
  const [selectedFood, setSelectedFood] = useState<'soda' | 'donut' | 'fries' | 'burger'>('soda');

  // 3. Sleep Hormones Seesaw
  const [sleepHours, setSleepHours] = useState<number>(8);

  // Dynamic calculations
  const heightM = height / 100;
  const bmi = heightM > 0 ? parseFloat((weight / (heightM * heightM)).toFixed(1)) : 22;

  let bmiInfo = { label: 'وزن مثالي متوازن', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  if (bmi < 18.5) bmiInfo = { label: 'نقص في الوزن', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/40' };
  else if (bmi < 25) bmiInfo = { label: 'وزن مثالي متوازن', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  else if (bmi < 30) bmiInfo = { label: 'زيادة وزن (ما قبل السمنة)', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40' };
  else if (bmi < 35) bmiInfo = { label: 'سمنة درجة أولى', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' };
  else bmiInfo = { label: 'سمنة مفرطة أو شديدة', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/40' };

  const waistThreshold = gender === 'male' ? 94 : 80;
  const isWaistHigh = waist >= waistThreshold;

  // Calorie food burn calculation
  const foodData = {
    soda: { name: 'علبة مشروب غازي', calories: 150, icon: '🥤' },
    donut: { name: 'قطعة دونات محلاة', calories: 290, icon: '🍩' },
    fries: { name: 'علبة بطاطس مقلية', calories: 380, icon: '🍟' },
    burger: { name: 'وجبة برغر سريع', calories: 560, icon: '🍔' },
  };

  const currentFood = foodData[selectedFood];
  // minutes needed based on average burn rates (Walking: ~4.5 kcal/min, Running: ~11 kcal/min, Cycling: ~8 kcal/min, Swimming: ~9 kcal/min)
  const walkMins = Math.round(currentFood.calories / 4.5);
  const runMins = Math.round(currentFood.calories / 11);
  const cycleMins = Math.round(currentFood.calories / 8);
  const swimMins = Math.round(currentFood.calories / 9);

  // Meal simulation data
  const mealProfiles = {
    fastfood: {
      title: 'وجبة سريعة + مشروب غازي',
      carbs: '110g سكر سريع',
      glucosePeak: 235,
      status: 'صدمة سكرية حادة وإجهاد بنكرياسي',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/50',
      bgColor: 'bg-rose-950/40',
      advice: 'ترفع الأنسولين لأقصى حد وتخزن الفائض كشحوم حشوية حول الكبد فوراً!'
    },
    rice: {
      title: 'أرز أبيض وخبز مكرر',
      carbs: '75g نشويات مكررة',
      glucosePeak: 175,
      status: 'ارتفاع متوسط وسريع',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      bgColor: 'bg-amber-950/40',
      advice: 'غياب الألياف يسبب هبوطاً سريعاً يتبعه خمول وجوع بعد ساعتين.'
    },
    balanced: {
      title: 'طبق متوازن (نصفه خضار + ربع بروتين + ربع حبوب كاملة)',
      carbs: '35g نشويات معقدة وألياف',
      glucosePeak: 118,
      status: 'منحنى امتصاص مثالي ومستقر',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      bgColor: 'bg-emerald-950/40',
      advice: 'الألياف تشكل حاجزاً هلامياً يبطئ الجلوكوز ويحمي خلايا بيتا بنسبة 100%!'
    },
    keto: {
      title: 'بروتين وألياف ودهون صحية (أفوكادو وبيض وسلطة)',
      carbs: '12g كربوهيدرات منخفضة جداً',
      glucosePeak: 98,
      status: 'استقرار هرموني فائق',
      color: 'text-teal-400',
      borderColor: 'border-teal-500/50',
      bgColor: 'bg-teal-950/40',
      advice: 'ثبات تام لسكر الدم دون أي طلب إضافي للأنسولين أو اشتهاء سكريات.'
    }
  };

  const handleTabSwitch = (tab: 'diabetes' | 'obesity' | 'connection') => {
    sound.playClick(1200);
    setActiveTab(tab);
  };

  return (
    <section id="health-sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Initiative Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>المدرسة: المتوسطة الأولى بالراكة • مبادرة صحتي مسؤوليتي</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          المختبر التفاعلي لمرضي{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
            السكري
          </span>{' '}
          و
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
            السمنة
          </span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          «غذاء متوازن، نشاط مستمر، ووعي يحمينا من السمنة والسكري» — تجربة مرئية تفاعلية تحاكي وظائف الخلايا ونمط الحياة.
        </p>
      </div>

      {/* Main Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 p-1.5 bg-slate-950/90 border border-slate-800 rounded-3xl max-w-2xl mx-auto mb-10 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => handleTabSwitch('diabetes')}
          className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'diabetes'
              ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(249,115,22,0.5)] scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>قسم مرض السكري</span>
        </button>

        <button
          onClick={() => handleTabSwitch('obesity')}
          className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'obesity'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.45)] scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>قسم مرض السمنة</span>
        </button>

        <button
          onClick={() => handleTabSwitch('connection')}
          className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'connection'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.45)] scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>الرابط والوقاية المشتركة</span>
        </button>
      </div>

      {/* Dynamic Interactive Content Area */}
      <AnimatePresence mode="wait">
        
        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE DIABETES CENTER WITH WARM ORANGE GLOW & RICH INFORMATION */}
        {/* ========================================================================= */}
        {activeTab === 'diabetes' && (
          <motion.div
            key="diabetes-hub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8 text-right relative"
          >
            {/* Cinematic Subtle Warm Orange/Amber Glowing Backdrop for Diabetes */}
            <div className="absolute -top-24 right-1/4 w-[850px] h-[850px] bg-gradient-to-br from-orange-500/25 via-amber-500/20 to-orange-950/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/4 -left-20 w-[650px] h-[650px] bg-gradient-to-tr from-amber-600/20 via-orange-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-2/3 right-10 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/20 via-amber-500/15 to-transparent rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-24 left-1/3 w-[600px] h-[600px] bg-gradient-to-t from-orange-600/15 via-amber-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

            {/* INTRODUCTORY CLINICAL OVERVIEW BANNER */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-orange-500/40 shadow-[0_0_35px_rgba(249,115,22,0.15)] relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-orange-500/20 pb-5 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-bold mb-2 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>الملف الطبي الشامل • مبادرة صحتي مسؤوليتي بالمتوسطة الأولى بالراكة</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    مرض السكري: الفسيولوجيا، الأرقام التشخيصية، ومسارات العلاج
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    دليل علمي وطبي متكامل يوضح الفروق بين الأنواع، الأرقام المخبرية الذهبية المعتمدة من جمعية السكري الأمريكية (ADA)، وأطلس حماية الأعضاء الحيوية، مدعماً بمحاكيات سريرية تفاعلية.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-4 py-2 rounded-2xl bg-orange-950/60 border border-orange-500/30">
                    <span className="text-[10px] text-orange-300 block font-bold">حالات النوع 2</span>
                    <span className="text-lg font-black text-white font-mono">90% - 95%</span>
                    <span className="text-[9px] text-slate-400 block">يمكن عكس مسارها</span>
                  </div>
                  <div className="text-center px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-300 block font-bold">الوقاية بنمط الحياة</span>
                    <span className="text-lg font-black text-white font-mono">58%</span>
                    <span className="text-[9px] text-slate-400 block">خفض خطر الإصابة</span>
                  </div>
                </div>
              </div>

              {/* CORE MEDICAL ENCYCLOPEDIA: 4 CLINICAL TYPES */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-orange-300 font-bold text-sm mb-3">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span>الموسوعة السريرية لأنواع مرض السكري الأربعة:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Type 1 */}
                  <div 
                    onMouseEnter={() => sound.playClick(1400)}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold">النوع 1 (Type 1)</span>
                      <span className="text-xs text-purple-400 font-bold">مناعي ذاتي</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-purple-200 transition-colors">تدمير خلايا بيتا البنكرياسية</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      يهاجم الجهاز المناعي عبر الخلايا التائية جزر لانجرهانس ويدمر أكثر من 90% من خلايا بيتا، مما يوقف تصنيع الأنسولين تماماً وبشكل مفاجئ.
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <div><strong className="text-slate-200">الفئة:</strong> الأطفال واليافعون غالباً.</div>
                      <div><strong className="text-slate-200">العلاج:</strong> حقن الأنسولين اليومية مدى الحياة.</div>
                      <div><strong className="text-slate-200">الوزن:</strong> نزول وزن مفاجئ وسريع.</div>
                    </div>
                  </div>

                  {/* Type 2 */}
                  <div 
                    onMouseEnter={() => sound.playClick(1400)}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-orange-500/40 hover:border-orange-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-950/80 text-orange-300 border border-orange-500/40 font-bold">النوع 2 (Type 2)</span>
                      <span className="text-xs text-orange-400 font-bold">مقاومة الأنسولين</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-orange-200 transition-colors">مقاومة المستقبلات ونمط الحياة</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      يفرز البنكرياس الأنسولين لكن المستقبلات الخلوية لا تستجيب بسبب تراكم الدهون الحشوية وسيتوكينات الالتهاب، فيتراكم الجلوكوز بالدم.
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <div><strong className="text-slate-200">الانتشار:</strong> أكثر من 90% من الحالات عالمياً.</div>
                      <div><strong className="text-slate-200">الهدأة (Remission):</strong> ممكنة بإنقاص 10-15% من الوزن!</div>
                      <div><strong className="text-slate-200">العلاج:</strong> الرياضة، الغذاء، والأدوية الفموية.</div>
                    </div>
                  </div>

                  {/* Prediabetes */}
                  <div 
                    onMouseEnter={() => sound.playClick(1400)}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">ما قبل السكري</span>
                      <span className="text-xs text-amber-400 font-bold">نافذة الإنقاذ</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-amber-200 transition-colors">الفرصة الذهبية للعكس التام</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      مستويات السكر مرتفعة عن الطبيعي لكنها لم تصل لحد السكري السريري (تراكمي 5.7% - 6.4%). لا تظهر أعراض وتكتشف بالفحص الروتيني.
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <div><strong className="text-slate-200">الفرصة:</strong> إنقاص 7% من الوزن يمنع السكري بـ 58%.</div>
                      <div><strong className="text-slate-200">النشاط:</strong> 150 دقيقة مشي أسبوعياً كافية جداً.</div>
                      <div><strong className="text-slate-200">المتابعة:</strong> فحص تراكمي كل 6 أشهر.</div>
                    </div>
                  </div>

                  {/* Gestational */}
                  <div 
                    onMouseEnter={() => sound.playClick(1400)}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 hover:border-rose-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">سكري الحمل</span>
                      <span className="text-xs text-rose-400 font-bold">هرموني مؤقت</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-rose-200 transition-colors">تأثير الهرمونات المشيمية</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      هرمون اللاكتوجين المشيمي (hPL) يعاكس عمل الأنسولين في الثلثين الثاني والثالث، مما يرفع سكر دم الحامل ويتطلب ضبطاً دقيقاً.
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <div><strong className="text-slate-200">الفحص:</strong> اختبار OGTT بين الأسبوع 24 و 28.</div>
                      <div><strong className="text-slate-200">المخاطر:</strong> زيادة وزن الجنين وتسمم الحمل.</div>
                      <div><strong className="text-slate-200">بعد الولادة:</strong> يزول غالباً مع ضرورة المتابعة.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ADA CLINICAL STANDARDS TABLE */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-orange-500/30">
                <div className="flex items-center gap-2 text-orange-300 font-bold text-sm mb-3">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span>جدول الأرقام الذهبية والمعايير التشخيصية المعتمدة عالمياً (ADA 2026):</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="py-2.5 px-3">الفحص المخبري</th>
                        <th className="py-2.5 px-3 text-emerald-400">طبيعي وسليم ✅</th>
                        <th className="py-2.5 px-3 text-amber-400">مرحلة ما قبل السكري ⚠️</th>
                        <th className="py-2.5 px-3 text-rose-400">تشخيص السكري 🚨</th>
                        <th className="py-2.5 px-3 text-slate-300">الإجراء السريري الفوري</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-white">السكر الصائم (8 ساعات)</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-300">70 - 99 mg/dL</td>
                        <td className="py-2.5 px-3 font-mono text-amber-300">100 - 125 mg/dL</td>
                        <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">≥ 126 mg/dL</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400">إعادة الفحص في يوم آخر للتأكيد</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-white">السكر التراكمي (HbA1c)</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-300">&lt; 5.7%</td>
                        <td className="py-2.5 px-3 font-mono text-amber-300">5.7% - 6.4%</td>
                        <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">≥ 6.5%</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400">فحص متوسط السكر لآخر 3 أشهر</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-white">تحمل الجلوكوز (OGTT ساعتين)</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-300">&lt; 140 mg/dL</td>
                        <td className="py-2.5 px-3 font-mono text-amber-300">140 - 199 mg/dL</td>
                        <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">≥ 200 mg/dL</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400">فحص استجابة الخلايا لـ 75g جلوكوز</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-white">السكر العشوائي (مع الأعراض)</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-300">&lt; 140 mg/dL</td>
                        <td className="py-2.5 px-3 font-mono text-amber-300">140 - 199 mg/dL</td>
                        <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">≥ 200 mg/dL</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400">تشخيص مباشر مع وجود العطش والتبول</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MEDICAL NUTRITION & FOOD SEQUENCING SECRET */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/30">
                  <div className="flex items-center gap-2 text-orange-300 font-bold text-xs mb-1.5">
                    <Target className="w-4 h-4 text-orange-400" />
                    <span>سر ترتيب تناول الطعام (Food Sequencing Strategy):</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    الدراسات السريرية الحديثة أثبتت أن <strong>ترتيب ما يدخل معدتك</strong> يصنع فارقاً هائلاً:
                    البدء بتناول <strong>السلطة والخضار والألياف أولاً</strong>، تليها <strong>البروتينات والدهون الصحية</strong>، وتأجيل <strong>النشويات المعقدة لآخر الوجبة</strong> — هذا الترتيب وحده يخفض قمة ارتفاع سكر الدم بعد الأكل بنسبة <strong>35% إلى 40%</strong> ويقلل إفراز الأنسولين المطلوب بنسبة النصف!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>دليل حقيبة السكري المدرسية (مبادرة المتوسطة الأولى بالراكة):</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>جهاز قياس سكر الدم الشخصي وشرائط فحص كافية مع وخازة معقمة.</li>
                    <li>مصدر سكر سريع الامتصاص (عصير تفاح صغير أو أقراص جلوكوز أو تمر).</li>
                    <li>وجبة خفيفة معقدة (شطيرة جبن أو مكسرات نيئة) لتثبيت السكر بعد إسعاف الهبوط.</li>
                    <li>بطاقة تعريف طبية واضحة تتضمن الاسم ونوع السكري وهاتف ولي الأمر والمعلمة المشرفة.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 1. VISUAL CELL GATE SIMULATOR (INSULIN KEY & LOCK) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-orange-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-bold mb-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>محاكي بوابات الخلايا ومفتاح الأنسولين</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    كيف يفتح الأنسولين بوابات الجلوكوز؟ وماذا يحدث عند مقاومته؟
                  </h3>
                </div>

                {/* State selector buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick(1200);
                      setInsulinGateState('normal');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      insulinGateState === 'normal' 
                        ? 'bg-emerald-500 text-slate-950 shadow-md' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    حالة طبيعية ✅
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick(900);
                      setInsulinGateState('resistance');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      insulinGateState === 'resistance' 
                        ? 'bg-rose-500 text-white shadow-md' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    مقاومة الأنسولين (النوع 2) ⚠️
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick(800);
                      setInsulinGateState('type1');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      insulinGateState === 'type1' 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    غياب الأنسولين (النوع 1) 💉
                  </button>
                </div>
              </div>

              {/* Graphical Visual Diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px] relative">
                  
                  {/* Visual Cell Representation */}
                  <div className="w-full flex items-center justify-around gap-4 text-center">
                    
                    {/* Pancreas/Insulin */}
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                        insulinGateState === 'type1' 
                          ? 'bg-slate-900 border-slate-700 text-slate-600' 
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      }`}>
                        <Key className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 mt-2">
                        {insulinGateState === 'type1' ? 'لا يوجد أنسولين' : 'مفتاح الأنسولين'}
                      </span>
                    </div>

                    {/* Arrow / Connection */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {insulinGateState === 'normal' && '🔓 يفتح القفل بسهولة'}
                        {insulinGateState === 'resistance' && '🔒 القفل معطل بالدهون'}
                        {insulinGateState === 'type1' && '❌ لا يوجد مفتاح'}
                      </span>
                      <div className="w-20 h-1 bg-slate-800 my-2 relative">
                        <div className={`h-full transition-all duration-500 ${
                          insulinGateState === 'normal' ? 'bg-emerald-400 w-full' : insulinGateState === 'resistance' ? 'bg-rose-500 w-1/3' : 'bg-slate-700 w-0'
                        }`} />
                      </div>
                    </div>

                    {/* Cell Gate */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${
                        insulinGateState === 'normal' 
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                          : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      }`}>
                        {insulinGateState === 'normal' ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 mt-2">
                        بوابة الخلية (GLUT-4)
                      </span>
                    </div>

                  </div>

                  {/* Status Outcome Banner */}
                  <div className={`w-full mt-6 p-3 rounded-2xl text-xs font-bold border text-center transition-all ${
                    insulinGateState === 'normal'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : insulinGateState === 'resistance'
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                      : 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                  }`}>
                    {insulinGateState === 'normal' && '✅ يدخل الجلوكوز بسلاسة إلى العضلات لإنتاج الطاقة، ويبقى سكر الدم في نطاق 70-99 mg/dL.'}
                    {insulinGateState === 'resistance' && '⚠️ المفتاح لا يدور! السيتوكينات وأحماض الدهون الحشوية تسد القفل، فيتراكم السكر في مجرى الدم.'}
                    {insulinGateState === 'type1' && '💉 جهاز المناعة أتلف خلايا بيتا، فلا يمكن للجلوكوز الدخول إلا بحقن الأنسولين اليومية التعويضية.'}
                  </div>
                </div>

                {/* Clinical Facts Side Info */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h5 className="text-xs font-black text-cyan-300 mb-1">💡 سر انقباض العضلات:</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      هل تعلم أن ممارسة 20 دقيقة من المشي السريع تفتح بوابات الجلوكوز (GLUT-4) <strong>تلقائياً وبشكل مباشر</strong> دون حتى الحاجة للأنسولين؟ لذلك الرياضة هي الدواء الأول!
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h5 className="text-xs font-black text-amber-300 mb-1">⚖️ النوع 1 مقابل النوع 2:</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      النوع 2 يمثل <strong>90% من الحالات</strong> وسببه الأساسي دهون الأحشاء ونمط الحياة الخامل، مما يعني أنه <strong>يمكن الوقاية منه وعكس مساره</strong> تماماً!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. INTERACTIVE MEAL & GLUCOSE CURVE LAB */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
                <Salad className="w-4 h-4" />
                <span>مختبر الوجبة ومنحنى سكر الدم التفاعلي</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4">
                اختر وجبتك وشاهد فوراً كيف يستجيب مؤشر سكر دمك:
              </h4>

              {/* 4 Interactive Clickable Meal Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {(['fastfood', 'rice', 'balanced', 'keto'] as const).map((mKey) => {
                  const m = mealProfiles[mKey];
                  const isChosen = selectedMeal === mKey;
                  return (
                    <button
                      key={mKey}
                      onClick={() => {
                        sound.playClick(1000);
                        setSelectedMeal(mKey);
                      }}
                      onMouseEnter={() => sound.playClick(1400)}
                      className={`p-4 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-2 hover:scale-[1.02] ${
                        isChosen 
                          ? `${m.bgColor} ${m.borderColor} shadow-[0_0_25px_rgba(249,115,22,0.35)] scale-102` 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-orange-500/50 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                      }`}
                    >
                      <div>
                        <div className="text-lg mb-2">
                          {mKey === 'fastfood' && '🍔🥤'}
                          {mKey === 'rice' && '🍚🍞'}
                          {mKey === 'balanced' && '🥗🍗'}
                          {mKey === 'keto' && '🥑🍳'}
                        </div>
                        <h5 className="text-xs font-bold text-white mb-1">{m.title}</h5>
                        <span className="text-[10px] font-mono text-slate-400 block">{m.carbs}</span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">ذروة الجلوكوز:</span>
                        <span className={`font-mono font-black ${m.color}`}>{m.glucosePeak} mg/dL</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Feedback Display */}
              <div className={`p-5 rounded-2xl border text-right ${mealProfiles[selectedMeal].bgColor} ${mealProfiles[selectedMeal].borderColor}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs text-slate-300 font-bold block">التشخيص الفوري للوجبة:</span>
                    <h5 className={`text-base font-black ${mealProfiles[selectedMeal].color}`}>
                      {mealProfiles[selectedMeal].status} ({mealProfiles[selectedMeal].glucosePeak} mg/dL)
                    </h5>
                  </div>
                  <div className="w-48 bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        mealProfiles[selectedMeal].glucosePeak < 130 
                          ? 'bg-emerald-400' 
                          : mealProfiles[selectedMeal].glucosePeak < 180 
                          ? 'bg-amber-400' 
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min((mealProfiles[selectedMeal].glucosePeak / 250) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  💡 {mealProfiles[selectedMeal].advice}
                </p>
              </div>
            </div>

            {/* 3. INTERACTIVE BODY SYMPTOMS SCANNER & CLINICAL COMPLICATIONS ATLAS */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-orange-500/40 shadow-xl">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-bold mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span>الماسح التفاعلي للأعراض وأطلس المضاعفات السريرية</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4">
                انقر على العضو لاكتشاف فسيولوجيا التأثير والأعراض التحذيرية:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => {
                    sound.playClick(1100);
                    setActiveHotspot('eyes');
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeHotspot === 'eyes' 
                      ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <span className="text-xs font-bold block">العينان واعتلال الشبكية</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1100);
                    setActiveHotspot('kidneys');
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeHotspot === 'kidneys' 
                      ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplet className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <span className="text-xs font-bold block">الكلى والترشيح البولي</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1100);
                    setActiveHotspot('nerves');
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeHotspot === 'nerves' 
                      ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Footprints className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <span className="text-xs font-bold block">الأعصاب والقدم السكرية</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1100);
                    setActiveHotspot('fatigue');
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeHotspot === 'fatigue' 
                      ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <span className="text-xs font-bold block">الطاقة وخمول الـ ATP</span>
                </button>
              </div>

              {/* Symptom Detail Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/30 text-right mb-6">
                {activeHotspot === 'eyes' && (
                  <div>
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mb-1.5">
                      <span>👁️ اعتلال الشبكية السكري (Diabetic Retinopathy):</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/40">وعائي دقيق Microvascular</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      فرط الجلوكوز المزمن يؤكسد الجدران الخلوية للشعيرات الدموية الشعرية في شبكية العين مسبباً ارتشاح السوائل ونمو شعيرات دموية شاذة هشة تنزف بسهولة. كما يسحب السكر السوائل من عدسة العين مسبباً تشوش الرؤية المتذبذب.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] pt-3 border-t border-slate-800 text-slate-400">
                      <div><strong className="text-orange-300">الإنذار المبكر:</strong> غشاوة مؤقتة وصعوبة القراءة وضبط المسافات.</div>
                      <div><strong className="text-emerald-300">درع الوقاية:</strong> فحص قاع العين التوسيعي السنوي وضبط التراكمي دون 7%.</div>
                    </div>
                  </div>
                )}
                {activeHotspot === 'kidneys' && (
                  <div>
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mb-1.5">
                      <span>💧 اعتلال الكلى السكري والتبول الليلي (Diabetic Nephropathy):</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/40">وعائي دقيق Microvascular</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      عندما يتجاوز سكر الدم 180 mg/dL تعجز الكليتان عن حبسه، فتطرحه في البول ساحباً كميات هائلة من الماء مسبباً كثرة التبول والعطش الحاد. ومع استمرار الارتفاع تتصلب كبيبات الكلى الدقيقة وتبدأ بتسريب بروتين الألبومين في البول (Microalbuminuria).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] pt-3 border-t border-slate-800 text-slate-400">
                      <div><strong className="text-orange-300">الإنذار المبكر:</strong> الاستيقاظ المتكرر للتبول ليلاً ورغوة في البول.</div>
                      <div><strong className="text-emerald-300">درع الوقاية:</strong> فحص زلال البول المجهري السنوي وشرب 2-3 لتر ماء يومياً.</div>
                    </div>
                  </div>
                )}
                {activeHotspot === 'nerves' && (
                  <div>
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mb-1.5">
                      <span>⚡ اعتلال الأعصاب المحيطية والقدم السكرية (Diabetic Neuropathy):</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/40">عصبي ووعائي</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      تتأثر أطول الأعصاب الحسية في الجسم أولاً، مسببة تنميلاً كالوخز وحرقاناً في أصابع القدمين (نمط القفاز والجورب Stocking-Glove). مع الوقت، يفقد المريض الإحساس الوقائي بالألم، مما يجعل الجروح الصغيرة غير ملحوظة وتتحول لتقرحات عميقة.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] pt-3 border-t border-slate-800 text-slate-400">
                      <div><strong className="text-orange-300">الإنذار المبكر:</strong> خدر ووخز كالإبر في القدمين وبطء التئام الخدوش.</div>
                      <div><strong className="text-emerald-300">درع الوقاية:</strong> فحص باطن القدمين يومياً بمِرآة وارتداء جوارب قطنية مريحة.</div>
                    </div>
                  </div>
                )}
                {activeHotspot === 'fatigue' && (
                  <div>
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mb-1.5">
                      <span>🥱 أزمة الطاقة الخلوية وخمول الـ ATP والجوع المستمر:</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/40">أيضي وخلوي</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      مفارقة خلوية عجيبة: الدم يفيض بالسكر لكن الميتوكوندريا داخل الخلايا تتضور جوعاً لتعطل بوابات GLUT-4! يرسل الدماغ إشارات ملحة لطلب المزيد من السكريات، بينما يعاني المريض من إرهاق جسدي مستمر وتشوش ذهني ونعاس بعد كل وجبة.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] pt-3 border-t border-slate-800 text-slate-400">
                      <div><strong className="text-orange-300">الإنذار المبكر:</strong> ثقل وخمول ونعاس شديد بعد الوجبات النشوية وسرعة نفاد الطاقة.</div>
                      <div><strong className="text-emerald-300">درع الوقاية:</strong> المشي 15 دقيقة بعد الأكل فوراً لفتح بوابات الطاقة دون أنسولين.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* COMPREHENSIVE COMPLICATIONS ATLAS CARDS */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-3">
                  <Stethoscope className="w-4 h-4 text-orange-400" />
                  <span>أطلس المضاعفات السريرية الكبيرة والحادة (Macrovascular & Emergencies):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                    <span className="text-xs font-black text-rose-400 block mb-1">❤️ القلب والأوعية الكبيرة</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      يضاعف السكري غير المنتظم خطر الجلطات وتصلب الشرايين التاجية بـ 3 أضعاف. الرياضة والألياف درع واقٍ يحمي بطانة الأوعية.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                    <span className="text-xs font-black text-purple-400 block mb-1">🚨 الحماض الكيتوني (DKA)</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      عند انعدام الأنسولين تماماً (النوع 1)، يحرق الجسم الدهون بسرعة فائقة فتتراكم أحماض الكيتون السامة في الدم وتستدعي الإسعاف الفوري.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                    <span className="text-xs font-black text-amber-400 block mb-1">🦶 سلامة القدم والأطراف</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      95% من بتر القدم السكرية يمكن تفاديه كلياً بمجرد الفحص اليومي والترطيب وتجنب المشي حافياً واختيار المقاس المناسب للحذاء.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. INTERACTIVE GOLDEN LAB NUMBERS DIAL */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-orange-500/30">
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>جرّب المؤشرات المخبرية بنفسك (السكر الصائم والتراكمي):</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fasting Glucose Slider */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-300 font-bold">السكر الصائم (Fasting Glucose):</span>
                    <span className={`font-mono text-base font-black ${
                      fastingGlucose < 100 ? 'text-emerald-400' : fastingGlucose < 126 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {fastingGlucose} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min={65}
                    max={220}
                    value={fastingGlucose}
                    onChange={(e) => {
                      setFastingGlucose(Number(e.target.value));
                      sound.playClick(900);
                    }}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block mt-2">
                    {fastingGlucose < 100 && '🟢 طبيعي وصحي تماماً (أقل من 100)'}
                    {fastingGlucose >= 100 && fastingGlucose < 126 && '🟡 مرحلة ما قبل السكري (100 - 125)'}
                    {fastingGlucose >= 126 && '🔴 تشخيص السكري السريري (126 فأعلى)'}
                  </span>
                </div>

                {/* HbA1c Slider */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-300 font-bold">السكر التراكمي (HbA1c):</span>
                    <span className={`font-mono text-base font-black ${
                      hba1cVal < 5.7 ? 'text-emerald-400' : hba1cVal < 6.5 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {hba1cVal.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4.5}
                    max={11.0}
                    step={0.1}
                    value={hba1cVal}
                    onChange={(e) => {
                      setHba1cVal(Number(e.target.value));
                      sound.playClick(900);
                    }}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block mt-2">
                    {hba1cVal < 5.7 && '🟢 مثالي وطبيعي (أقل من 5.7%)'}
                    {hba1cVal >= 5.7 && hba1cVal < 6.5 && '🟡 مرحلة ما قبل السكري (5.7% - 6.4%)'}
                    {hba1cVal >= 6.5 && '🔴 معيار تشخيص الإصابة بالسكري (6.5% فأكثر)'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. INTERACTIVE GLYCEMIC INDEX & FOODS GUIDE (معلومات تفاعلية عميقة عن المؤشر الجلايسيمي) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-6 border-b border-slate-800 gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold mb-1.5">
                    <Apple className="w-3.5 h-3.5" />
                    <span>دليل المؤشر الجلايسيمي التفاعلي للأغذية (GI)</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    كيف تختار أطعمتك لحماية البنكرياس ومنع قفزات السكر؟
                  </h4>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick(1100);
                      setGiFilter('low');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      giFilter === 'low' 
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🟢 منخفضة (GI &lt; 55)
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(1000);
                      setGiFilter('medium');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      giFilter === 'medium' 
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🟡 متوسطة (56 - 69)
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(900);
                      setGiFilter('high');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      giFilter === 'high' 
                        ? 'bg-rose-500 text-white shadow-md font-black' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔴 مرتفعة (70+)
                  </button>
                </div>
              </div>

              {/* Dynamic Foods Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {giFilter === 'low' && (
                  <>
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🥣</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">GI: 48</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">شوفان الحبة الكاملة</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">ألياف بيتا جلوكان الذائبة تشكل طبقة حماية تبطئ امتصاص النشويات وتمنح شبعاً يدوم 4 ساعات.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍲</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">GI: 32</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">العدس والبقوليات</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">ثراء فائق بالبروتين النباتي والألياف؛ خافض طبيعي لمقاومة الأنسولين ومثالي لمرضى السكري.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍏</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">GI: 36</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">التفاح والكمثرى بقشرهما</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">ألياف البكتين الطبيعية تمنع تسرب السكر السريع للدم وتحفز بكتيريا الأمعاء النافعة الميكروبيوم.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🥦</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">GI: 15</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">البروكلي والورقيات الخضراء</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">مؤشر جلايسيمي شبه منعدم، غني بالمغنيسيوم وسلفورافان المضاد لالتهابات بطانة الأوعية الدموية.</p>
                    </div>
                  </>
                )}

                {giFilter === 'medium' && (
                  <>
                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍚</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">GI: 58</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">الأرز البسمتي طويل الحبة</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">أفضل بكثير من الأرز المصري أو التايلندي؛ يحتوي على نشا مقاوم يبطئ الامتصاص ولكن يجب الاعتدال في الكمية.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🌴</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">GI: 60</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">التمر المعتدل (حبة إلى اثنتين)</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">سكريات طبيعية غنية بالمعادن؛ يُنصح دائماً بتناولها مع مصدر دهون صحية أو بروتين كاللوز النيء لمنع قمة السكر.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍌</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">GI: 55</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">الموز قليل النضج (الأخضر المعتدل)</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">كلما كان الموز أقل نضجاً كان النشا مقاوماً للهضم وذا مؤشر منخفض؛ بينما الموز المنقط بالأسود يرفع السكر سريعاً.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍠</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">GI: 63</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">البطاطا الحلوة المشوية</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">بديل مغذٍ للبطاطس البيضاء غني بفيتامين A والألياف، تمتص بهدوء أكبر عند تناولها مع قشرتها المشوية.</p>
                    </div>
                  </>
                )}

                {giFilter === 'high' && (
                  <>
                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍞</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300">GI: 85</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">الخبز الأبيض والصامولي</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">دقيق مكرر منزوع الألياف، يتحلل في اللعاب كالجلوكوز الصافي مباشرة مسبباً صدمة فورية للأنسولين.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🥤</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300">GI: 95</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">المشروبات الغازية والعصائر المحلاة</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">أخطر ما يهدد البنكرياس! سكر سائل يمتص خلال 5 دقائق ويتحول فوراً إلى دهون حشوية حول الكبد.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍟</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300">GI: 82</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">البطاطس المقلية والوجبات السريعة</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">مزيج مميت من الزيوت المهدرجة والنشويات فائقة السرعة؛ يعطل مستقبلات الأنسولين لأكثر من 24 ساعة.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-right">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🥣</span>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300">GI: 88</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">رقائق الذرة وحبوب الإفطار الملونة</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">مليئة بالسكريات المضافة السريعة؛ ترفع سكر الدم في الصباح الباكر ثم تسبب هبوطاً حاداً يتبعه نعاس وضعف تركيز مدرسي.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 6. EMERGENCY CLINICAL PROTOCOL: HYPO VS HYPER (بروتوكول الطوارئ السريري التفاعلي) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-6 border-b border-slate-800 gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-1.5">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>بروتوكول الطوارئ السريري التفاعلي</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    كيف تفرق وتتصرف فوراً بين هبوط السكر المفاجئ وارتفاعه الشديد؟
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick(1000);
                      setEmergencyProtocol('hypo');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      emergencyProtocol === 'hypo' 
                        ? 'bg-rose-500 text-white shadow-md font-black' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    ⚡ هبوط السكر الحاد (&lt; 70 mg/dL)
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(1000);
                      setEmergencyProtocol('hyper');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      emergencyProtocol === 'hyper' 
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🚨 الارتفاع الشديد (&gt; 250 mg/dL)
                  </button>
                </div>
              </div>

              {/* Protocol Content Display */}
              {emergencyProtocol === 'hypo' ? (
                <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-4">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span>أعراض الهبوط المفاجئ: رجفة اليدين، تعرق بارد غزير، تسارع نبضات القلب، دوار، وشحوب الوجه.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-rose-950/60">
                    <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
                      <span className="text-xs font-mono font-bold text-rose-400 block mb-1">الخطوة 01: قاعدة (15-15)</span>
                      <h6 className="text-sm font-bold text-white mb-1">تناول 15 غرام سكر سريع فوراً</h6>
                      <p className="text-xs text-slate-400 leading-relaxed">نصف كوب عصير تفاح، ملعقة طعام عسل نقي، أو 3 حبات تمر متوسطة.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
                      <span className="text-xs font-mono font-bold text-rose-400 block mb-1">الخطوة 02: الراحة والانتظار</span>
                      <h6 className="text-sm font-bold text-white mb-1">الراحة التامة لمدة 15 دقيقة</h6>
                      <p className="text-xs text-slate-400 leading-relaxed">الجلوس والاسترخاء دون بذل أي مجهود لإتاحة وصول السكر للدماغ.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
                      <span className="text-xs font-mono font-bold text-rose-400 block mb-1">الخطوة 03: إعادة القياس</span>
                      <h6 className="text-sm font-bold text-white mb-1">إعادة قياس السكر للتأكد</h6>
                      <p className="text-xs text-slate-400 leading-relaxed">إذا كان لا يزال أقل من 70 mg/dL كرر الجرعة؛ وإذا ارتفع تناول وجبة خفيفة لتثبيت السكر.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-4">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                    <span>أعراض الارتفاع الشديد: عطش لا ينقطع، جفاف شديد بالحلق، كثرة التبول، رائحة فواكه/أسيتون بالفم، وغثيان.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-amber-950/60">
                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                      <span className="text-xs font-mono font-bold text-amber-400 block mb-1">الخطوة 01: تعويض السوائل</span>
                      <h6 className="text-sm font-bold text-white mb-1">شرب لتر من الماء النقي فوراً</h6>
                      <p className="text-xs text-slate-400 leading-relaxed">الماء يعوض الجفاف ويحفز الكليتين على طرح كميات الجلوكوز الفائضة في البول.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                      <span className="text-xs font-mono font-bold text-amber-400 block mb-1">الخطوة 02: فحص الكيتونات</span>
                      <h6 className="text-sm font-bold text-white mb-1">فحص الكيتون (DKA Check)</h6>
                      <p className="text-xs text-slate-400 leading-relaxed">التأكد من عدم وجود حموضة كيتونية خطيرة في الدم أو البول تستوجب الإسعاف الفوري.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                      <span className="text-xs font-mono font-bold text-amber-400 block mb-1">الخطوة 03: التدخل العلاجي</span>
                      <h6 className="text-sm font-bold text-white mb-1">تطبيق الجرعة التصحيحية</h6>
                      <p className="text-xs text-slate-400 leading-relaxed">أخذ جرعة الأنسولين التصحيحية الموصوفة من الطبيب والامتناع التام عن النشويات حتى يستقر.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7. PREDIABETES INTERACTIVE RISK ASSESSMENT (فاحص احتمالية ما قبل السكري التفاعلي) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>فاحص احتمالية مرحلة ما قبل السكري التفاعلي السريع</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4">
                أجب بنعم أو لا لتقييم مستوى الخطر الأيضي لديك في 30 ثانية:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    sound.playClick(1000);
                    setRiskQ1(!riskQ1);
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    riskQ1 ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">1. هل محيط خصرك زائد (أكثر من 94 سم للرجال أو 80 سم للنساء)؟</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mr-2 ${
                    riskQ1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {riskQ1 ? '✓' : '×'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1000);
                    setRiskQ2(!riskQ2);
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    riskQ2 ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">2. هل تقضي معظم يومك جالساً دون ممارسة 30 دقيقة مشي يومي؟</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mr-2 ${
                    riskQ2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {riskQ2 ? '✓' : '×'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1000);
                    setRiskQ3(!riskQ3);
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    riskQ3 ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">3. هل يوجد تاريخ إصابة بمرض السكري لدى والديك أو إخوتك؟</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mr-2 ${
                    riskQ3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {riskQ3 ? '✓' : '×'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1000);
                    setRiskQ4(!riskQ4);
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    riskQ4 ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-850 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">4. هل تتناول المشروبات الغازية أو المحلاة والوجبات السريعة أسبوعياً؟</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mr-2 ${
                    riskQ4 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {riskQ4 ? '✓' : '×'}
                  </span>
                </button>
              </div>

              {/* Assessment Evaluation Box */}
              {(() => {
                const totalYes = [riskQ1, riskQ2, riskQ3, riskQ4].filter(Boolean).length;
                return (
                  <div className={`p-4 rounded-2xl border text-right ${
                    totalYes === 0 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : totalYes <= 2 
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' 
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">النتيجة السريرية التقديرية:</span>
                      <span className="font-mono text-sm font-black">
                        {totalYes === 0 && 'خطر منخفض جداً (&lt; 5%) ✅'}
                        {totalYes <= 2 && 'خطر متوسط (30%) ⚠️'}
                        {totalYes > 2 && 'خطر مرتفع (تجاوز 65%) 🚨'}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {totalYes === 0 && 'عاداتك الحركية والغذائية ممتازة وتحمي بوابات خلاياك من مقاومة الأنسولين بنسبة تفوق 95%! استمر على هذا المنوال الرائع.'}
                      {totalYes <= 2 && 'لديك بعض عوامل الخطورة التي قد تجهد خلايا بيتا في البنكرياس. احرص على المشي 30 دقيقة يومياً وتناول الألياف وأجرِ فحص السكر التراكمي سنوياً.'}
                      {totalYes > 2 && 'تنبيه: اجتماع قلة الحركة مع السكر ومحيط الخصر هو البيئة المثالية لتطور مرحلة ما قبل السكري! الخبر الرائع أن خفض 5-7 كجم من وزنك والمشي المنتظم كفيل بعكس الحالة تماماً وحمايتك بنسبة 80%.'}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Quick Action Footer */}
            <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex items-center justify-between shadow-[0_0_20px_rgba(249,115,22,0.15)]">
              <span className="text-xs text-orange-200 font-bold">
                لديك استفسار سريري حول السكري لمبادرة صحتي مسؤوليتي؟
              </span>
              <button
                onClick={() => onOpenAiWithPrompt('أود استشارة المساعد الذكي حول أفضل نمط غذائي للوقاية من السكري ومقاومة الأنسولين')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span>اسأل المساعد الذكي</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERACTIVE OBESITY CENTER WITH EXPANDED CLINICAL ENCYCLOPEDIA & HOVER EFFECTS */}
        {/* ========================================================================= */}
        {activeTab === 'obesity' && (
          <motion.div
            key="obesity-hub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8 text-right relative"
          >
            {/* Cinematic Subtle Warm Amber Glowing Backdrop for Obesity */}
            <div className="absolute -top-24 right-1/4 w-[850px] h-[850px] bg-gradient-to-br from-amber-500/25 via-yellow-500/20 to-amber-950/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/4 -left-20 w-[650px] h-[650px] bg-gradient-to-tr from-yellow-600/20 via-amber-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-2/3 right-10 w-[700px] h-[700px] bg-gradient-to-tl from-amber-500/20 via-yellow-500/15 to-transparent rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-24 left-1/3 w-[600px] h-[600px] bg-gradient-to-t from-amber-600/15 via-yellow-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

            {/* INTRODUCTORY CLINICAL OVERVIEW BANNER: OBESITY COMPREHENSIVE MEDICAL FILE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>الملف الطبي الشامل لمرض السمنة • مبادرة صحتي مسؤوليتي بالمتوسطة الأولى بالراكة</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    مرض السمنة: الخلل الهرموني والأيضي، خطر دهون الأحشاء، ومسارات العلاج
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    السمنة ليست مجرد زيادة في المظهر أو نقص في الإرادة؛ بل هي مرض عصبي هرموني أيضي مزمن معقد (Chronic Neuro-Metabolic Disease). استكشف تصنيفاتها، حقيقة الدهون الحشوية الإفرازية، ومثلث هرمونات الشهية.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-4 py-2 rounded-2xl bg-amber-950/60 border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block font-bold">خفض 10% من الوزن</span>
                    <span className="text-lg font-black text-white font-mono">-60%</span>
                    <span className="text-[9px] text-slate-400 block">انخفاض خطر السكري</span>
                  </div>
                  <div className="text-center px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-300 block font-bold">الضغط على الركبة</span>
                    <span className="text-lg font-black text-white font-mono">1 كجم = 4 كجم</span>
                    <span className="text-[9px] text-slate-400 block">تخفيف الحمل الميكانيكي</span>
                  </div>
                </div>
              </div>

              {/* CORE MEDICAL ENCYCLOPEDIA: 5 CLINICAL CLASSIFICATIONS */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-3">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>التصنيفات السريرية لمرض السمنة ومؤشر كتلة الجسم (WHO & AACE):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {/* Pre-obesity */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-yellow-500/30 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-yellow-950/80 text-yellow-300 border border-yellow-500/40 font-bold">25 - 29.9</span>
                      <span className="text-xs text-yellow-400 font-bold">زيادة وزن</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-yellow-200 transition-colors">مرحلة ما قبل السمنة</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      تراكم أولي للخلايا الدهنية مع بداية مقاومة الأنسولين. مرحلة مثالية للتراجع الفوري دون أي حاجة لتدخلات دوائية.
                    </p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <strong className="text-yellow-300">الإجراء:</strong> عجز سعري 300 سعرة + 10,000 خطوة يومياً.
                    </div>
                  </div>

                  {/* Class 1 */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">30 - 34.9</span>
                      <span className="text-xs text-amber-400 font-bold">درجة أولى</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-amber-200 transition-colors">سمنة سريرية متوسطة</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      تضاعف خطر الإصابة بمتلازمة الأيض وارتفاع ضغط الدم والكبد الدهني. تظهر علامات ضيق التنفس مع المجهود.
                    </p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <strong className="text-amber-300">الإجراء:</strong> خطة غذائية متوازنة وتمارين مقاومة 3 مرات أسبوعياً.
                    </div>
                  </div>

                  {/* Class 2 */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-orange-500/40 hover:border-orange-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-950/80 text-orange-300 border border-orange-500/40 font-bold">35 - 39.9</span>
                      <span className="text-xs text-orange-400 font-bold">درجة ثانية</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-orange-200 transition-colors">سمنة شديدة ومتقدمة</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      إجهاد ميكانيكي حاد على الغضاريف والمفاصل، واختناق نومي ليلي، وارتفاع هائل في مؤشرات الالتهاب (hs-CRP).
                    </p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <strong className="text-orange-300">الإجراء:</strong> إشراف طبي متخصص مع احتمال التدخل الدوائي.
                    </div>
                  </div>

                  {/* Class 3 */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/40 hover:border-rose-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">≥ 40</span>
                      <span className="text-xs text-rose-400 font-bold">درجة ثالثة</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-rose-200 transition-colors">سمنة مفرطة حرجة</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      حالة مرضية حرجة تؤثر على جميع أجهزة الجسم وترفع خطر الوفاة المبكرة والجلطات القلبية والوعائية.
                    </p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <strong className="text-rose-300">الإجراء:</strong> برنامج علاجي سريري متكامل (دوائي أو جراحي).
                    </div>
                  </div>

                  {/* Sarcopenic Obesity */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/40 hover:border-purple-400 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold">مختلطة</span>
                      <span className="text-xs text-purple-400 font-bold">العضلات الضامرة</span>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1.5 group-hover:text-purple-200 transition-colors">السمنة مع ضمور العضلات</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      تحدث نتيجة الحميات القاسية وتجويع الجسم، حيث يخسر المريض العضلات ويحتفظ بالشحوم، مما يدمر سرعة الحرق (BMR).
                    </p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <strong className="text-purple-300">الإجراء:</strong> رفع البروتين فوراً والبدء بتمارين الأوزان والمقاومة.
                    </div>
                  </div>
                </div>
              </div>

              {/* VISCERAL VS SUBCUTANEOUS FAT DEEP BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 hover:border-rose-400 transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>الدهون الحشوية العميقة (Visceral Fat) — القاتل الصامت:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    تتمركز داخل تجويف البطن وحول الكبد والبنكرياس والأمعاء. ليست مجرد طاقة مخزنة، بل تعمل <strong>كغدة صماء مفرزة للسموم</strong>:
                    تفرز سيتوكينات التهابية (TNF-α, IL-6) وأحماضاً دهنية حرة تصب مباشرة في الوريد البابي الكبدي، مما يعطل تصفية الأنسولين ويؤدي مباشرة إلى الكبد الدهني والسكري وتصلب الشرايين.
                  </p>
                  <div className="text-[11px] text-rose-300 font-bold bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/30">
                    ⚠️ مقياسها السريري الأدق: محيط الخصر (أكثر من 94 سم للرجال و 80 سم للنساء).
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 hover:border-amber-400 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>الدهون تحت الجلد (Subcutaneous Fat) — المخزن السطحي:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    تتوزع تحت طبقة الجلد في الأطراف والفخذين والوركين. وظيفتها الأساسية هي العزل الحراري وتخزين الفائض الطبيعي للطاقة وحماية الأعضاء من الصدمات الخارجية.
                    خطرها الأيضي أقل بكثير من الدهون الحشوية ما لم تفيض عن طاقتها التخزينية القصوى وتبدأ بالتسرب نحو الأحشاء الداخلية (Ectopic Fat Overflow).
                  </p>
                  <div className="text-[11px] text-amber-300 font-bold bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30">
                    💡 يمكن التخلص منها تدريجياً عبر خلق عجز سعري معتدل ومستمر دون إجهاد للجسم.
                  </div>
                </div>
              </div>

              {/* CLINICAL COMPLICATIONS ATLAS FOR OBESITY */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 mb-6">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-3">
                  <Stethoscope className="w-4 h-4 text-amber-400" />
                  <span>أطلس المضاعفات السريرية العضوية لمرض السمنة:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right hover:border-amber-500/40 transition-all">
                    <span className="text-xs font-black text-rose-400 block mb-1">🫀 الكبد الدهني (NAFLD)</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      تتسلل قطيرات الدهون داخل خلايا الكبد وتسبب التهاباً مزمناً (NASH) قد يتطور لتليف كبدي لا قدر الله ما لم يتم عكس السمنة.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right hover:border-amber-500/40 transition-all">
                    <span className="text-xs font-black text-cyan-400 block mb-1">💤 الاختناق النومي (Sleep Apnea)</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      تراكم الشحوم حول الرقبة يضيق مجرى التنفس ليلاً، مما يحرم الدماغ من الأكسجين ويسبب شخيراً وإجهاداً لعضلة القلب وصداعاً صباحياً.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right hover:border-amber-500/40 transition-all">
                    <span className="text-xs font-black text-amber-400 block mb-1">🦵 تآكل وخشونة المفاصل</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      كل 1 كجم زيادة في وزنك يفرض 4 كجم ضغطاً ميكانيكياً على ركبتيك أثناء المشي، مما يسرع تآكل الغضاريف الهلالية والفقرات.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right hover:border-amber-500/40 transition-all">
                    <span className="text-xs font-black text-purple-400 block mb-1">🩸 متلازمة التمثيل الغذائي</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      اجتماع السمنة البطنية مع ارتفاع ضغط الدم والدهون الثلاثية وانخفاض الكوليسترول النافع HDL ومقاومة الأنسولين.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 CLINICAL TREATMENT PILLARS & SCHOOL NUTRITION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>الركائز السريرية لخسارة الدهون المستدامة:</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>العجز السعري الذكي:</strong> خفض 500 سعرة حرارية يومياً لخسارة 2 كجم دهون شهرياً دون هدم العضلات.</li>
                    <li><strong>كفاية البروتين:</strong> 1.2 - 1.6 غرام لكل كجم من وزن الجسم لحماية النسيج العضلي وتعزيز الشبع.</li>
                    <li><strong>تمارين المقاومة:</strong> رفع الأثقال وتدريب العضلات يرفع معدل الحرق القاعدي (BMR) حتى أثناء النوم.</li>
                    <li><strong>النوم المنتظم (7-8 ساعات):</strong> يمنع ارتفاع هرمون الجوع (الجريلين) ويحافظ على نشاط هرمون الشبع (اللبتين).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>إرشادات البيئة المدرسية (المتوسطة الأولى بالراكة):</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>المقصف المدرسي الصحي:</strong> استبدال الرقائق المقلية والمشروبات الغازية بالفواكه الطازجة والمكسرات والماء.</li>
                    <li><strong>المشي الحركي المدرسي:</strong> تشجيع الطالبات على صعود الدرج والحركة بين الحصص الدراسية وتفعيل حصة الرياضة.</li>
                    <li><strong>شرب الماء المستمر:</strong> حمل قارورة ماء شخصية وشرب 1.5 - 2 لتر خلال اليوم الدراسي لتنشيط الخلايا.</li>
                    <li><strong>تجنب السعرات السائلة:</strong> منع مشروبات الطاقة والعصائر المحلاة التي تتحول فوراً لدهون حشوية.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 1. VISUAL SILHOUETTE & BMI CALCULATOR */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl relative hover:border-amber-400 transition-all duration-300 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold mb-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>المحاكي البصري لمؤشر كتلة الجسم ومحيط الخصر</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    حلل تصنيف وزنك ومستوى خطر الدهون الحشوية العميقة:
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick(1000);
                      setGender('female');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      gender === 'female' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    أنثى 👩
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(1000);
                      setGender('male');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      gender === 'male' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    ذكر 👨
                  </button>
                </div>
              </div>

              {/* Sliders and Result */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  {/* Weight */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-bold">الوزن الحالي:</span>
                      <span className="font-mono font-black text-amber-300">{weight} كجم</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={150}
                      value={weight}
                      onChange={(e) => {
                        setWeight(Number(e.target.value));
                        sound.playClick(900);
                      }}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-bold">الطول بالسنتيمتر:</span>
                      <span className="font-mono font-black text-amber-300">{height} سم</span>
                    </div>
                    <input
                      type="range"
                      min={120}
                      max={205}
                      value={height}
                      onChange={(e) => {
                        setHeight(Number(e.target.value));
                        sound.playClick(900);
                      }}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Waist */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-bold">محيط الخصر (مقياس دهون الأحشاء):</span>
                      <span className="font-mono font-black text-amber-300">{waist} سم</span>
                    </div>
                    <input
                      type="range"
                      min={55}
                      max={135}
                      value={waist}
                      onChange={(e) => {
                        setWaist(Number(e.target.value));
                        sound.playClick(900);
                      }}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      الحد الآمن: أقل من 94 سم للرجال، وأقل من 80 سم للنساء.
                    </span>
                  </div>
                </div>

                {/* Live Diagnostic Silhouette Box */}
                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-center">
                  <span className="text-xs text-slate-400 block font-bold">مؤشر كتلة الجسم (BMI):</span>
                  <div className={`text-5xl font-mono font-black ${bmiInfo.color}`}>
                    {bmi}
                  </div>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${bmiInfo.bg} ${bmiInfo.border} ${bmiInfo.color}`}>
                    {bmiInfo.label}
                  </div>

                  {/* Waist Risk Feedback */}
                  <div className={`p-3.5 rounded-2xl border text-xs text-right mt-3 leading-relaxed ${
                    isWaistHigh 
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}>
                    {isWaistHigh ? (
                      <p>
                        ⚠️ <strong>تنبيه الخصر ({waist} سم):</strong> تجاوز الحد الآمن ({waistThreshold} سم). الدهون المتراكمة في البطن تفرز مواد التهابية تزيد مقاومة الأنسولين مباشرة!
                      </p>
                    ) : (
                      <p>
                        ✅ <strong>محيط خصر صحي ({waist} سم):</strong> دهون الأحشاء آمنة وتحمي كبدك وبنكرياسك من الالتهاب الأيضي.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CALORIC BURNER ACTIVITY LAB */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                <Flame className="w-4 h-4" />
                <span>معمل حرق السعرات بالنشاط الحركي التفاعلي</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4">
                اختر وجبة خفيفة واكتشف كم دقيقة رياضة تحتاج لحرقها:
              </h4>

              {/* Food selection pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(['soda', 'donut', 'fries', 'burger'] as const).map((fKey) => {
                  const f = foodData[fKey];
                  const isSel = selectedFood === fKey;
                  return (
                    <button
                      key={fKey}
                      onClick={() => {
                        sound.playClick(1050);
                        setSelectedFood(fKey);
                      }}
                      onMouseEnter={() => sound.playClick(1400)}
                      className={`p-3.5 rounded-2xl border text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 ${
                        isSel 
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-102' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/50 hover:text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{f.icon}</div>
                      <span className="text-xs font-bold block">{f.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">{f.calories} سعرة</span>
                    </button>
                  );
                })}
              </div>

              {/* 4 Activities Required to Burn */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">🚶 مشي سريع</span>
                  <span className="text-xl font-mono font-black text-cyan-300">{walkMins}</span>
                  <span className="text-[10px] text-slate-500 block">دقيقة متواصلة</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">🏃 جري معتدل</span>
                  <span className="text-xl font-mono font-black text-emerald-300">{runMins}</span>
                  <span className="text-[10px] text-slate-500 block">دقيقة متواصلة</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">🚴 ركوب دراجة</span>
                  <span className="text-xl font-mono font-black text-amber-300">{cycleMins}</span>
                  <span className="text-[10px] text-slate-500 block">دقيقة متواصلة</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">🏊 سباحة</span>
                  <span className="text-xl font-mono font-black text-teal-300">{swimMins}</span>
                  <span className="text-[10px] text-slate-500 block">دقيقة متواصلة</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-3">
                💡 الأسهل دائماً هو منع السعرات الفارغة بدلاً من قضاء ساعات طويلة لحرقها!
              </p>
            </div>

            {/* 3. SLEEP & HUNGER HORMONES SEESAW */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                <span>ميزان هرمونات الجوع (الجريلين) والشبع (اللبتين) وساعات النوم:</span>
              </h4>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-bold">ساعات النوم الليلي:</span>
                  <span className="font-mono text-base font-black text-purple-400">{sleepHours} ساعات</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={9}
                  value={sleepHours}
                  onChange={(e) => {
                    setSleepHours(Number(e.target.value));
                    sound.playClick(900);
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-850 text-center text-xs">
                  <div className={`p-3 rounded-xl border ${sleepHours < 7 ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    <span className="block font-bold">هرمون الجوع (الجريلين)</span>
                    <span className="font-mono text-sm font-black">{sleepHours < 7 ? 'مرتفع جداً 📈 (+28%)' : 'منخفض ومتوازن 🟢'}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${sleepHours >= 7 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    <span className="block font-bold">هرمون الشبع (اللبتين)</span>
                    <span className="font-mono text-sm font-black">{sleepHours >= 7 ? 'نشط وفعال 🟢' : 'منخفض ومقاوم 📉 (-18%)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link to Full Calorie Calculator */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs text-amber-200 font-bold">
                ترغب في حساب السعرات والماكروز وفق معادلة Mifflin-St Jeor الطبية؟
              </span>
              <button
                onClick={onOpenCalorieCalculator}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>حاسبة السعرات الشاملة</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: THE METABOLIC LINK (HOW OBESITY CAUSES DIABETES & PREVENTIVE TWIN)  */}
        {/* ========================================================================= */}
        {activeTab === 'connection' && (
          <motion.div
            key="connection-hub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8 text-right"
          >
            {/* Visual Biological Chain */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>التوأم الأيضي • السلسلة الحيوية المباشرة</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                كيف تصنع السمنة الحشوية مرض السكري من النوع الثاني؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                سلسلة بيولوجية مؤكدة سريرياً: الدهون ليست خاملة، بل هي غدة تفرز سموماً عطلت الأنسولين!
              </p>

              {/* 4 Interactive Visual Chain Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-1">01. فائض السعرات</span>
                  <h5 className="text-sm font-bold text-white mb-1.5">تراكم شحوم البطن</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    تتراكم الدهون الحشوية العميقة بين المعدة والكبد والأمعاء متجاوزة الحد الآمن.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-rose-400 block mb-1">02. الالتهاب الكيميائي</span>
                  <h5 className="text-sm font-bold text-white mb-1.5">إفراز السيتوكينات</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    تطلق الدهون الحشوية أحماضاً وسيتوكينات التهابية (TNF-α) تصب في وريد الكبد.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">03. إغلاق البوابات</span>
                  <h5 className="text-sm font-bold text-white mb-1.5">مقاومة الأنسولين</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    تعجز بوابات الخلايا عن التجاوب للأنسولين، فيتراكم السكر ويجهد البنكرياس.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-purple-400 block mb-1">04. الاستنزاف</span>
                  <h5 className="text-sm font-bold text-white mb-1.5">ظهور السكري</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    تنهار خلايا بيتا بعد سنوات من الضخ الزائد، فتستقر الإصابة بالسكري النوع الثاني.
                  </p>
                </div>
              </div>
            </div>

            {/* The 5-10% Miracle Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  THE GOLDEN PREVENTION RULE • قاعدة الأمل العلمي
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  إنقاص 5% إلى 10% من الوزن يحميك بنسبة 80%!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  أنت لا تحتاج للوصول إلى وزن عارضي الأزياء! الدراسات السريرية تؤكد أن فقدان 5 إلى 7 كيلوغرامات فقط يخفض دهون الأحشاء بنسبة 30% ويعيد حساسية الأنسولين لطبيعتها ويمنع السكري بنسبة 58% إلى 80%.
                </p>
              </div>

              <button
                onClick={onOpenQuiz}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.4)] shrink-0 transition-all transform hover:scale-105"
              >
                <Award className="w-5 h-5 text-slate-950" />
                <span>بدء تحدي الوعي الطبي</span>
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </section>
  );
};
