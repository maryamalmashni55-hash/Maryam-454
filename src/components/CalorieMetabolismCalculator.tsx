import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Scale, 
  Droplets, 
  Activity, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Dna, 
  Apple, 
  Fish, 
  Wheat, 
  Coffee, 
  ShieldAlert, 
  HelpCircle, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw,
  Info,
  Utensils
} from 'lucide-react';
import { sound } from '../utils/audio';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
type HealthGoal = 'maintain' | 'mild_deficit' | 'moderate_deficit' | 'surplus';
type DietType = 'balanced' | 'low_carb' | 'dash_cardio' | 'high_protein';

export const CalorieMetabolismCalculator: React.FC = () => {
  // User Input State
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(28);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<HealthGoal>('maintain');
  const [dietType, setDietType] = useState<DietType>('balanced');
  const [showMealPlan, setShowMealPlan] = useState<boolean>(true);

  // Sound triggering helper
  const triggerAudioFeedback = (pitch = 1200) => {
    sound.playClick(pitch);
  };

  // 1. Calculations: Mifflin-St Jeor BMR
  const bmr = useMemo(() => {
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }, [gender, weight, height, age]);

  // 2. Activity Multipliers -> TDEE
  const activityMultipliers: Record<ActivityLevel, { factor: number; label: string; desc: string }> = {
    sedentary: { 
      factor: 1.2, 
      label: 'قليل الحركة (مكتبي)', 
      desc: 'جلوس معظم اليوم دون ممارسة تمارين بدنية' 
    },
    light: { 
      factor: 1.375, 
      label: 'نشاط خفيف (1-3 أيام/أسبوع)', 
      desc: 'مشي يومي أو تمارين خفيفة منتظمة' 
    },
    moderate: { 
      factor: 1.55, 
      label: 'نشاط متوسط (3-5 أيام/أسبوع)', 
      desc: 'تمارين معتدلة، ركض خفيف، أو سباحة' 
    },
    very_active: { 
      factor: 1.725, 
      label: 'نشط جداً (6-7 أيام/أسبوع)', 
      desc: 'تمارين رياضية قوية وأعمال بدنية مستمرة' 
    },
    extra_active: { 
      factor: 1.9, 
      label: 'مجهود بدني شاق / رياضي', 
      desc: 'تدريبات مضاعفة يومياً أو عمل يدوي شاق' 
    }
  };

  const tdee = useMemo(() => {
    return Math.round(bmr * activityMultipliers[activity].factor);
  }, [bmr, activity]);

  // 3. Goal Calorie Adjustments
  const targetCalories = useMemo(() => {
    switch (goal) {
      case 'mild_deficit':
        return Math.max(1200, Math.round(tdee - 350));
      case 'moderate_deficit':
        return Math.max(1200, Math.round(tdee - 500));
      case 'surplus':
        return Math.round(tdee + 350);
      case 'maintain':
      default:
        return tdee;
    }
  }, [tdee, goal]);

  // 4. BMI Calculation & Categorization
  const bmi = useMemo(() => {
    const heightInMeters = height / 100;
    const value = weight / (heightInMeters * heightInMeters);
    return Number(value.toFixed(1));
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) return { label: 'نقص وزن', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', position: 10 };
    if (bmi < 25) return { label: 'وزن صحي مثالي', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', position: 38 };
    if (bmi < 30) return { label: 'وزن زائد (مؤشر خطر أولي)', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', position: 65 };
    if (bmi < 35) return { label: 'سمنة درجة أولى', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40', position: 82 };
    return { label: 'سمنة مفرطة (خطر قلبي وأيضي)', color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40', position: 95 };
  }, [bmi]);

  // Ideal weight range based on BMI 18.5 - 24.9
  const idealWeightRange = useMemo(() => {
    const heightInMeters = height / 100;
    const min = Math.round(18.5 * (heightInMeters * heightInMeters));
    const max = Math.round(24.9 * (heightInMeters * heightInMeters));
    return { min, max };
  }, [height]);

  // Daily Water Intake (35ml per kg bodyweight + activity bonus)
  const waterTarget = useMemo(() => {
    const baseLiters = (weight * 35) / 1000;
    const activityBonus = activity === 'sedentary' ? 0 : activity === 'light' ? 0.3 : activity === 'moderate' ? 0.6 : 0.9;
    const totalLiters = Number((baseLiters + activityBonus).toFixed(1));
    const cups = Math.round((totalLiters * 1000) / 250);
    return { liters: totalLiters, cups };
  }, [weight, activity]);

  // 5. Macronutrient Distribution
  const macros = useMemo(() => {
    let proteinPct = 0.25;
    let carbPct = 0.45;
    let fatPct = 0.30;

    if (dietType === 'low_carb') {
      // Prevents insulin spikes, great for pre-diabetes
      proteinPct = 0.30;
      carbPct = 0.30;
      fatPct = 0.40;
    } else if (dietType === 'dash_cardio') {
      // DASH: High whole grains, lean protein, healthy unsaturated fats
      proteinPct = 0.20;
      carbPct = 0.55;
      fatPct = 0.25;
    } else if (dietType === 'high_protein') {
      proteinPct = 0.35;
      carbPct = 0.35;
      fatPct = 0.30;
    }

    const proteinCals = targetCalories * proteinPct;
    const carbCals = targetCalories * carbPct;
    const fatCals = targetCalories * fatPct;

    const proteinGrams = Math.round(proteinCals / 4);
    const carbGrams = Math.round(carbCals / 4);
    const fatGrams = Math.round(fatCals / 9);
    const fiberGrams = Math.round((targetCalories / 1000) * 14); // 14g per 1000 kcal

    return {
      protein: { grams: proteinGrams, calories: Math.round(proteinCals), percent: Math.round(proteinPct * 100) },
      carbs: { grams: carbGrams, calories: Math.round(carbCals), percent: Math.round(carbPct * 100) },
      fats: { grams: fatGrams, calories: Math.round(fatCals), percent: Math.round(fatPct * 100) },
      fiber: fiberGrams
    };
  }, [targetCalories, dietType]);

  // Daily Meal Breakdown Simulator
  const mealDistribution = useMemo(() => {
    return [
      {
        name: 'وجبة الإفطار (25%)',
        cals: Math.round(targetCalories * 0.25),
        time: '7:30 - 9:00 ص',
        icon: '☀️',
        examples: 'شوفان بالحليب قليل الدسم وبذور الشيا، أو بيضتان مسلوقتان مع ربع رغيف حبوب كاملة وخضار ورقية.',
        medicalTip: 'تمنح استقراراً لمستوى السكر بالدم وتمنع الشراهة المفاجئة ظهراً.'
      },
      {
        name: 'وجبة الغداء (40%)',
        cals: Math.round(targetCalories * 0.40),
        time: '1:30 - 3:00 م',
        icon: '🍲',
        examples: 'صدر دجاج مشوي أو سمك مشوي (150غ) + نصف كوب أرز بني أو كينوا + طبق سلطة ملون غني بزيت الزيتون.',
        medicalTip: 'الألياف في السلطة تبطئ امتصاص الجلوكوز وتحمي من مقاومة الأنسولين.'
      },
      {
        name: 'وجبة خفيفة واقية (10%)',
        cals: Math.round(targetCalories * 0.10),
        time: '5:00 - 6:00 م',
        icon: '🍏',
        examples: 'حفنة مكسرات نيئة (لوز وجوز 25غ) أو تفاحة خضراء مع ملعقة زبادي يوناني.',
        medicalTip: 'الأوميغا 3 والدهون غير المشبعة تعزز مرونة بطانة الشرايين وتكافح تصلبها.'
      },
      {
        name: 'وجبة العشاء (25%)',
        cals: Math.round(targetCalories * 0.25),
        time: '7:30 - 9:00 م',
        icon: '🌙',
        examples: 'شوربة عدس غنية أو جبن قريش قليل الملح مع خيار وطماطم وزعتر وقطعة خبز نخالة.',
        medicalTip: 'تناول العشاء قبل النوم بـ 3 ساعات يريح القلب ويخفض ضغط الدم الليلي.'
      }
    ];
  }, [targetCalories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right">
      
      {/* 1. Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/70 border border-cyan-500/30 overflow-hidden shadow-2xl mb-8"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Flame className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-xs font-mono text-cyan-400 tracking-wider">
                SMART CLINICAL METABOLISM & CALORIE ENGINE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              حاسبة السعرات اليومية والتمثيل الغذائي الذكي
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              احسب بدقة طبية معتمدة (معادلة Mifflin-St Jeor) كمية الطاقة التي يحتاجها جسدك للحفاظ على الوزن أو حرق الدهون، مع توزيع الماكروز والماء لحماية البنكرياس والقلب والشرايين.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-mono block">معادلة الحساب</span>
              <span className="text-xs font-bold text-white">Mifflin-St Jeor الطبية الدولية</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Main Two-Column Layout: Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Inputs): 5 Columns */}
        <motion.div 
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl backdrop-blur-md">
            
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>البيانات الحيوية والجسدية</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">خطوة 1 من 3</span>
            </div>

            {/* Gender Selection */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-300 block mb-2">
                الجنس البيولوجي
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    triggerAudioFeedback(1300);
                  }}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    gender === 'male'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-base">👨</span>
                  <span>ذكر (رجل)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    triggerAudioFeedback(1400);
                  }}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    gender === 'female'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-base">👩</span>
                  <span>أنثى (امرأة)</span>
                </button>
              </div>
            </div>

            {/* Age Slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">العمر (بالسنوات)</label>
                <span className="text-sm font-mono font-bold text-cyan-300">{age} سنة</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>15 سنة</span>
                <span>50 سنة</span>
                <span>90 سنة</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">الوزن الحالي (كيلوجرام)</label>
                <span className="text-sm font-mono font-bold text-cyan-300">{weight} كغ</span>
              </div>
              <input
                type="range"
                min={40}
                max={180}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>40 كغ</span>
                <span>110 كغ</span>
                <span>180 كغ</span>
              </div>
            </div>

            {/* Height Slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">الطول (سنتيمتر)</label>
                <span className="text-sm font-mono font-bold text-cyan-300">{height} سم</span>
              </div>
              <input
                type="range"
                min={130}
                max={220}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>130 سم</span>
                <span>175 سم</span>
                <span>220 سم</span>
              </div>
            </div>

            {/* Physical Activity Level */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-300 block mb-2">
                مستوى النشاط البدني اليومي
              </label>
              <div className="space-y-2">
                {(Object.keys(activityMultipliers) as ActivityLevel[]).map((level) => {
                  const item = activityMultipliers[level];
                  const isSelected = activity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setActivity(level);
                        triggerAudioFeedback(1250);
                      }}
                      className={`w-full p-3 rounded-2xl text-right transition-all flex items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">×{item.factor}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goal Choice */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                الهدف الصحي المرغوب
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'maintain', label: 'تثبيت الوزن والوقاية', icon: <Scale className="w-3.5 h-3.5 text-cyan-400" /> },
                  { id: 'mild_deficit', label: 'خسارة دهون صحية (-350)', icon: <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> },
                  { id: 'moderate_deficit', label: 'حرق دهون نشط (-500)', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'surplus', label: 'بناء عضلي وزيادة (+350)', icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setGoal(item.id as HealthGoal);
                      triggerAudioFeedback(1350);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border text-right ${
                      goal === item.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Clinical Dietary Focus Selector */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl backdrop-blur-md">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Dna className="w-4 h-4 text-emerald-400" />
              <span>النمط الغذائي الموصى به للوقاية</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'balanced', label: 'متوازن صحي', sub: 'صحة عامة ووقاية' },
                { id: 'low_carb', label: 'منخفض الكربوهيدرات', sub: 'لوقاية السكر والبنكرياس' },
                { id: 'dash_cardio', label: 'حمية DASH الطبية', sub: 'لحماية ضغط الدم والشرايين' },
                { id: 'high_protein', label: 'عالي البروتين', sub: 'للشبع والكتلة العضلية' }
              ].map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => {
                    setDietType(diet.id as DietType);
                    triggerAudioFeedback(1450);
                  }}
                  className={`p-2.5 rounded-xl text-right transition-all border cursor-pointer ${
                    dietType === diet.id
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div className="text-xs font-bold">{diet.label}</div>
                  <div className="text-[10px] text-slate-500">{diet.sub}</div>
                </button>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Right Column (Live Medical Results & Analytics): 7 Columns */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          
          {/* Main Calorie Highlight Card */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-950 to-slate-900 border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.25)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                  DAILY CALORIC TARGET • السعرات اليومية المقترحة
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  الاحتياج اليومي الإجمالي الموصى به
                </h3>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>خطة موجهة للهدف</span>
              </div>
            </div>

            {/* Huge Glowing Number */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                {targetCalories.toLocaleString()}
              </span>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-cyan-300">سعرة حرارية (kcal)</span>
                <span className="text-[11px] text-slate-400">في اليوم الواحد</span>
              </div>
            </div>

            {/* Sub-Metrics Row (BMR, TDEE, Deficit/Surplus) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] text-slate-400">معدل الأيض الأساسي (BMR)</div>
                <div className="text-base font-mono font-bold text-cyan-400 mt-1">{bmr.toLocaleString()} kcal</div>
                <div className="text-[10px] text-slate-500 mt-0.5">حرق الأعضاء أثناء النوم التام</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] text-slate-400">إجمالي الحرق بالحركة (TDEE)</div>
                <div className="text-base font-mono font-bold text-sky-400 mt-1">{tdee.toLocaleString()} kcal</div>
                <div className="text-[10px] text-slate-500 mt-0.5">طاقة الحفاظ على الوزن الحالي</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] text-slate-400">فرق الطاقة عن الثبات</div>
                <div className="text-base font-mono font-bold text-emerald-400 mt-1">
                  {targetCalories - tdee > 0 ? `+${targetCalories - tdee}` : targetCalories - tdee} kcal
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">تدرج صحي آمن على الكلى والقلب</div>
              </div>
            </div>

          </div>

          {/* 3 Vital Cards: BMI, Ideal Weight, Water Requirement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. BMI Card with Gauge */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" />
                    <span>كتلة الجسم (BMI)</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{bmi}</span>
                </div>

                <div className={`p-2 rounded-xl text-center text-xs font-bold ${bmiCategory.bg} ${bmiCategory.color} border ${bmiCategory.border}`}>
                  {bmiCategory.label}
                </div>
              </div>

              <div className="mt-4">
                <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-emerald-400 via-yellow-400 via-orange-400 to-rose-500" />
                  <div 
                    className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-md -translate-x-1"
                    style={{ left: `${Math.min(96, Math.max(4, bmiCategory.position))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35+</span>
                </div>
              </div>
            </div>

            {/* 2. Ideal Weight Range Card */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>الوزن الصحي لطولك</span>
                </span>
                <div className="text-xl font-black text-white font-mono mt-1">
                  {idealWeightRange.min} - {idealWeightRange.max} <span className="text-xs font-sans text-slate-400">كغ</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mt-3">
                المدى المثالي لتجنب إجهاد البطانة الوعائية ومقاومة الأنسولين.
              </p>
            </div>

            {/* 3. Hydration Requirement Card */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>احتياج الماء اليومي</span>
                </span>
                <div className="text-xl font-black text-sky-400 font-mono mt-1">
                  {waterTarget.liters} <span className="text-xs font-sans text-slate-400">لتر/يوم</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3 font-mono">
                <span>≈ {waterTarget.cups} أكواب ماء</span>
                <span className="text-[10px] text-sky-400">(يخفف لزوجة الدم)</span>
              </div>
            </div>

          </div>

          {/* Macronutrient Distribution Bars */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-cyan-400" />
                <span>توزيع الماكروز والمغذيات الكبرى (Macronutrients)</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">{dietType === 'low_carb' ? 'منخفض الكربوهيدرات' : dietType === 'dash_cardio' ? 'حمية DASH' : 'متوازن'}</span>
            </div>

            {/* Visual Segment Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex mb-5">
              <div style={{ width: `${macros.protein.percent}%` }} className="bg-cyan-500 h-full transition-all" title="بروتين" />
              <div style={{ width: `${macros.carbs.percent}%` }} className="bg-amber-500 h-full transition-all" title="كربوهيدرات" />
              <div style={{ width: `${macros.fats.percent}%` }} className="bg-rose-500 h-full transition-all" title="دهون صحية" />
            </div>

            {/* 3 Macro Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Protein */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <Fish className="w-3.5 h-3.5" />
                    <span>بروتين</span>
                  </span>
                  <span className="text-xs font-mono text-cyan-400">{macros.protein.percent}%</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">{macros.protein.grams} <span className="text-xs text-slate-400">غرام</span></div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">({macros.protein.calories} سعرة)</div>
                <div className="text-[10px] text-slate-500 mt-1">يحمي العضلات ويزيد الشبع ويحفز الأيض</div>
              </div>

              {/* Complex Carbs */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Wheat className="w-3.5 h-3.5" />
                    <span>كربوهيدرات معقدة</span>
                  </span>
                  <span className="text-xs font-mono text-amber-400">{macros.carbs.percent}%</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">{macros.carbs.grams} <span className="text-xs text-slate-400">غرام</span></div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">({macros.carbs.calories} سعرة)</div>
                <div className="text-[10px] text-slate-500 mt-1">طاقة نظيفة ومؤشر جلايسيمي منخفض</div>
              </div>

              {/* Healthy Fats */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                    <Apple className="w-3.5 h-3.5" />
                    <span>دهون غير مشبعة</span>
                  </span>
                  <span className="text-xs font-mono text-rose-400">{macros.fats.percent}%</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">{macros.fats.grams} <span className="text-xs text-slate-400">غرام</span></div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">({macros.fats.calories} سعرة)</div>
                <div className="text-[10px] text-slate-500 mt-1">أوميغا 3 تحمي شرايين القلب والدماغ</div>
              </div>

            </div>

            {/* Fiber note */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>الاحتياج اليومي من الألياف الواقية (Fiber):</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">{macros.fiber} غرام/يوم</span>
            </div>

          </div>

        </motion.div>

      </div>

      {/* 3. Daily Healthy Plate & Meal Breakdown Simulator */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/20 shadow-2xl backdrop-blur-md"
      >
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              CHRONIC DISEASE SHIELD MEAL DISTRIBUTION
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-cyan-400" />
              <span>محاكي توزيع السعرات على الوجبات اليومية للوقاية</span>
            </h3>
          </div>

          <button
            onClick={() => {
              setShowMealPlan(prev => !prev);
              triggerAudioFeedback(1200);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>{showMealPlan ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${showMealPlan ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showMealPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mealDistribution.map((meal, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{meal.icon}</span>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                      {meal.cals} سعرة
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{meal.name}</h4>
                  <span className="text-[11px] font-mono text-slate-500 block mb-3">{meal.time}</span>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {meal.examples}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400/90 leading-normal flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{meal.medicalTip}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </motion.div>

      {/* 4. Interactive Chronic Disease Food Swaps Matrix */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-emerald-500/20 shadow-2xl backdrop-blur-md"
      >
        
        <div className="mb-6">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
            NUTRITIONAL BIO-HACKS FOR CHRONIC DISEASE DEFENSE
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
            <Apple className="w-5 h-5 text-emerald-400" />
            <span>مصفوفة البدائل الغذائية الذكية لحماية الأنسجة والشرايين</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            بدائل يومية بسيطة تخفض السعرات وتمنع التهاب جدران الأوعية الدموية ومقاومة الأنسولين:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Swap 1: Sugar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1">
              <span>❌ بدلاً من:</span>
              <span className="text-white">السكر الأبيض والعصائر</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
              <span>✅ اختر:</span>
              <span className="text-white">الستيفيا الطبيعية أو الفاكهة كاملة</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
              تمنع القفزات السكرية الحادة التي تصدم خلايا بيتا في البنكرياس وتوفر 300-400 سعرة يومياً.
            </p>
          </div>

          {/* Swap 2: Fats */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1">
              <span>❌ بدلاً من:</span>
              <span className="text-white">الزيوت المهدرجة والمقليات</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
              <span>✅ اختر:</span>
              <span className="text-white">زيت الزيتون البكر والأفوكادو</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
              توقف أكسدة LDL وتمنع التصاق لويحات الكولسترول الصلبة بالبطانة الوعائية التاجية.
            </p>
          </div>

          {/* Swap 3: Salt */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1">
              <span>❌ بدلاً من:</span>
              <span className="text-white">الملح المصنع والمخللات</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
              <span>✅ اختر:</span>
              <span className="text-white">الليمون، الثوم، والأعشاب البرية</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
              تخفض الضغط الانقباضي بمقدار 8-12 mmHg وتمنع احتباس السوائل وتصلب الشرايين.
            </p>
          </div>

          {/* Swap 4: Refined Carbs */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1">
              <span>❌ بدلاً من:</span>
              <span className="text-white">الخبز الأبيض والمعجنات</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
              <span>✅ اختر:</span>
              <span className="text-white">حبوب الشوفان الكاملة والكينوا</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
              ألياف البيتا جلوكان تكنس الكولسترول الزائد في الأمعاء وتمنح شبعاً يدوم لساعات أطول.
            </p>
          </div>

        </div>

      </motion.div>

    </div>
  );
};
