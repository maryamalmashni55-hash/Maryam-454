import React, { useState } from 'react';
import { DiseaseDetail } from '../data/diseases';
import { sound } from '../utils/audio';
import { 
  X, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Droplets, 
  Flame, 
  Stethoscope, 
  Zap,
  Sliders,
  Dna,
  HelpCircle,
  Award,
  RotateCcw,
  Check,
  Volume2,
  Crosshair
} from 'lucide-react';

interface DiseaseModalProps {
  disease: DiseaseDetail;
  onClose: () => void;
  onOpenMicroscope?: (diseaseId: string) => void;
  initialTab?: 'mechanism' | 'causes' | 'symptoms' | 'prevention' | 'simulator' | 'quiz';
}

export const DiseaseModal: React.FC<DiseaseModalProps> = ({ 
  disease, 
  onClose, 
  onOpenMicroscope,
  initialTab = 'mechanism'
}) => {
  const [activeTab, setActiveTab] = useState<'mechanism' | 'causes' | 'symptoms' | 'prevention' | 'simulator' | 'quiz'>(initialTab);

  // Disease Specific Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [questionId: number]: boolean }>({});
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Interactive Simulator States
  // 1. Diabetes Simulator
  const [insulinLevel, setInsulinLevel] = useState<number>(40); // 0 to 100
  const [insulinResistance, setInsulinResistance] = useState<boolean>(false);

  // 2. Hypertension Simulator
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);

  // 3. Anemia Simulator
  const [hemoglobinLevel, setHemoglobinLevel] = useState<number>(14); // g/dL

  // 4. Obesity / BMI Simulator
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [waistCm, setWaistCm] = useState<number>(88);

  // State for interactive symptom feedback
  const [activeSymptomAlert, setActiveSymptomAlert] = useState<string | null>(null);

  const handleSymptomClick = (sign: string) => {
    setActiveSymptomAlert(sign);
    sound.playSymptomSoundByType(sign);
    sound.speakSymptomWhisper(sign);
    setTimeout(() => {
      setActiveSymptomAlert(null);
    }, 2800);
  };

  const handleTabChange = (tab: 'mechanism' | 'causes' | 'symptoms' | 'prevention' | 'simulator' | 'quiz') => {
    sound.playClick(1300);
    setActiveTab(tab);
  };

  const handleSelectQuizAnswer = (questionId: number, optionIdx: number, correctIdx: number) => {
    if (selectedAnswers[questionId] !== undefined) return;

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));

    if (optionIdx === correctIdx) {
      sound.playSuccessChime();
      setQuizScore((prev) => prev + 1);
    } else {
      sound.playErrorBuzz();
    }

    const totalQuestions = disease.specificQuiz.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length + 1;
    if (answeredCount >= totalQuestions) {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    sound.playClick(1000);
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleClose = () => {
    sound.playClick(900);
    onClose();
  };

  // Calculations for simulators
  // BMI calculation
  const heightM = heightCm / 100;
  const bmiValue = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'وزن منخفض (نقص تغذية)', color: 'text-sky-400' };
    if (bmi < 25) return { label: 'وزن مثالي متوازن', color: 'text-emerald-400' };
    if (bmi < 30) return { label: 'وزن زائد (مرحلة ما قبل السمنة)', color: 'text-amber-400' };
    return { label: 'سمنة مفرطة (خطر أيضي مرتفع)', color: 'text-rose-400' };
  };

  // Diabetes blood glucose estimation from simulator
  const calculatedBloodSugar = Math.round(
    insulinResistance 
      ? 190 - (insulinLevel * 0.4) 
      : 210 - (insulinLevel * 1.3)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Modal Container */}
      <div 
        className="relative z-10 w-full max-w-4xl bg-slate-900/95 border rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
        style={{ borderColor: `${disease.color.primary}55` }}
      >
        
        {/* Top Glowing Header Bar */}
        <div 
          className="relative px-6 py-5 border-b flex items-center justify-between"
          style={{ 
            backgroundColor: `${disease.color.primary}12`,
            borderColor: `${disease.color.primary}30` 
          }}
        >
          {/* Organ and Disease Title */}
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border bg-slate-950/60" style={{ color: disease.color.primary, borderColor: `${disease.color.primary}50` }}>
                {disease.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">ORGAN REGION: {disease.organKey.toUpperCase()}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {disease.diseaseName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              الموقع الحيوي: {disease.organName}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenMicroscope && (
              <button
                id="modal-microscope-btn"
                onClick={() => {
                  onOpenMicroscope(disease.id);
                  handleClose();
                }}
                title="فحص الخلايا عبر المجهر السينمائي فائق الدقة"
                className="px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-900/60 shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
              >
                <Crosshair className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="hidden sm:inline">مجهر سينمائي (Zoom-in)</span>
              </button>
            )}

            <button
              id="modal-organ-sound-btn"
              onClick={() => sound.playOrganSound(disease.organKey)}
              title={`استمع لصوت ونبض ${disease.organName}`}
              className="px-3 py-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">صوت العضو</span>
            </button>

            {/* Close Button */}
            <button
              id="modal-close-btn"
              onClick={handleClose}
              className="w-10 h-10 rounded-xl bg-slate-950/70 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            id="tab-btn-mechanism"
            onClick={() => handleTabChange('mechanism')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'mechanism'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>الآلية البيولوجية</span>
          </button>

          <button
            id="tab-btn-causes"
            onClick={() => handleTabChange('causes')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'causes'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>الأسباب والجذور</span>
          </button>

          <button
            id="tab-btn-symptoms"
            onClick={() => handleTabChange('symptoms')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'symptoms'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>الأعراض والإنذارات</span>
          </button>

          <button
            id="tab-btn-prevention"
            onClick={() => handleTabChange('prevention')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'prevention'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>درع الوقاية والعلاج</span>
          </button>

          <button
            id="tab-btn-simulator"
            onClick={() => handleTabChange('simulator')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border border-cyan-500/30 ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>المعمل الحيوي التفاعلي</span>
          </button>

          <button
            id="tab-btn-quiz"
            onClick={() => handleTabChange('quiz')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border border-amber-500/40 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-amber-300 bg-amber-950/40 hover:bg-amber-900/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>تحدي واختبار هذا المرض</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-right">
          
          {/* TAB 1: Biological Mechanism */}
          {activeTab === 'mechanism' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Summary Hero Card */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <Dna className="w-5 h-5 text-cyan-400" />
                  {disease.mechanism.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {disease.mechanism.summary}
                </p>
              </div>

              {/* 4 Mechanism Steps */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 mb-3 tracking-wider">
                  التسلسل المرضي الداخلي (PATHOPHYSIOLOGY SEQUENCE)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {disease.mechanism.steps.map((step) => (
                    <div 
                      key={step.number}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                          {step.number}
                        </span>
                        <h5 className="font-bold text-sm text-slate-200">
                          {step.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Indicators Table */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 mb-3 tracking-wider">
                  المؤشرات الحيوية الحاسمة (CLINICAL BIOMARKERS)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {disease.vitalIndicators.map((ind, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 mb-1">{ind.label}</div>
                      <div className="text-lg font-black text-emerald-400 font-mono">
                        {ind.idealValue} <span className="text-[10px] text-slate-500">{ind.unit}</span>
                      </div>
                      <div className="text-[11px] text-rose-400/90 mt-1 font-mono">
                        عتبة الخطر: {ind.dangerThreshold}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Root Causes & Risk Factors */}
          {activeTab === 'causes' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300">
                الأمراض المزمنة لا تحدث مصادفة؛ بل هي نتيجة تراكمية لخلل في الإشارات الحيوية وأنماط المعيشة:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disease.causes.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-100">
                          {item.factor}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                          item.level === 'مرتفع جداً'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}>
                          تأثير {item.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Symptoms & Warning Signs */}
          {activeTab === 'symptoms' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 text-xs text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
                  <span>
                    <strong className="text-cyan-300">أصوات سريرية تفاعلية:</strong> انقر على أي عَرَض لسماع الصوت الفسيولوجي المباشر (كحة، خفقان، طنين، ضيق نَفَس).
                  </span>
                </div>
                <span className="font-mono text-[11px] bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/40 text-cyan-300 shrink-0">
                  🔊 انقر للاستماع فوراً
                </span>
              </div>

              {/* Early Warning Signals */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>المؤشرات التحذيرية المبكرة (استمع لنداء جسدك أولاً)</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">انقر على العرض لسماع صوته</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disease.symptoms.warningSigns.map((sign, i) => {
                    const isActive = activeSymptomAlert === sign;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSymptomClick(sign)}
                        className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                          isActive
                            ? 'bg-amber-950/90 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[1.02]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 text-slate-200 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isActive ? 'bg-amber-300 animate-ping' : 'bg-amber-400 group-hover:scale-125 transition-transform'}`} />
                          <span className="text-xs leading-relaxed font-medium">{sign}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isActive ? (
                            <div className="flex items-center gap-0.5">
                              <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                              <span className="w-1 h-5 bg-amber-300 animate-bounce rounded-full" />
                              <span className="w-1 h-2.5 bg-amber-400 animate-pulse rounded-full" />
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-300 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>صوت</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Critical Red Flag Symptoms */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-rose-500/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm sm:text-base">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>العلامات الحرجة (تستدعي تدخلاً ومراجعة طبية عاجلة)</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400/80 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/20">إنذار طوارئ مسموع</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disease.symptoms.criticalSigns.map((sign, i) => {
                    const isActive = activeSymptomAlert === sign;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSymptomClick(sign)}
                        className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                          isActive
                            ? 'bg-rose-950/90 border-rose-400 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-[1.02]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-rose-500/60 text-slate-200 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isActive ? 'bg-rose-300 animate-ping' : 'bg-rose-500 group-hover:scale-125 transition-transform'}`} />
                          <span className="text-xs leading-relaxed font-medium">{sign}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isActive ? (
                            <div className="flex items-center gap-0.5">
                              <span className="w-1 h-3 bg-rose-400 animate-pulse rounded-full" />
                              <span className="w-1 h-5 bg-rose-300 animate-bounce rounded-full" />
                              <span className="w-1 h-2.5 bg-rose-400 animate-pulse rounded-full" />
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 group-hover:text-rose-300 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>إنذار</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Prevention & Science Rules */}
          {activeTab === 'prevention' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-sm text-emerald-200">
                القاعدة الذهبية: 80% من مخاطر ومضاعفات الأمراض المزمنة يمكن تجنبها وعكسها بقرارات وقائية ذكية ومستدامة.
              </div>

              <div className="space-y-3">
                {disease.prevention.rules.map((rule, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {rule.title}
                      </h4>
                    </div>
                    
                    <div className="text-xs text-cyan-300 font-medium mb-1 mr-6">
                      الإجراء المطلوب: {rule.action}
                    </div>
                    
                    <div className="text-xs text-slate-400 leading-relaxed mr-6 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-300 font-semibold">الأثر الفسيولوجي المثبت علمياً: </span>
                      {rule.scientificImpact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Interactive Biological Simulator */}
          {activeTab === 'simulator' && (
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-6 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm sm:text-base">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>المختبر التفاعلي الحيوي: {disease.organName}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">REAL-TIME BIO FEEDBACK</span>
              </div>

              {/* SIMULATOR 1: Diabetes Insulin-Glucose Gate */}
              {disease.interactiveWidgetType === 'glucose-insulin' && (
                <div className="space-y-5">
                  <p className="text-xs text-slate-300">
                    حرّك مؤشر إفراز الأنسولين ولاحظ كيف تتفاعل بوابات الخلايا مع السكر في الدم:
                  </p>

                  <div className="space-y-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">معدل إفراز الأنسولين من خلايا بيتا:</span>
                      <span className="font-mono font-bold text-cyan-400 text-sm">{insulinLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={insulinLevel}
                      onChange={(e) => {
                        sound.playClick(800 + Number(e.target.value) * 5);
                        setInsulinLevel(Number(e.target.value));
                      }}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />

                    {/* Toggle Insulin Resistance */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-300">محاكاة مقاومة الأنسولين (Insulin Resistance):</span>
                      <button
                        onClick={() => {
                          sound.playClick(1200);
                          setInsulinResistance(!insulinResistance);
                        }}
                        className={`px-3 py-1 text-xs rounded-lg font-mono transition-all ${
                          insulinResistance
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/60'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {insulinResistance ? 'مقاومة الأنسولين مفعلة ⚠️' : 'استجابة طبيعية ✅'}
                      </button>
                    </div>
                  </div>

                  {/* Realtime Output Gauge */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">مستوى سكر الدم التقديري</div>
                      <div className={`text-2xl font-black font-mono mt-1 ${calculatedBloodSugar > 140 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {calculatedBloodSugar} <span className="text-xs font-normal">mg/dL</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {calculatedBloodSugar > 180 ? 'خطر: تسمم سكري حاد' : calculatedBloodSugar > 140 ? 'مرحلة ما قبل السكري' : 'معدل سكر مثالي'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">حالة الطاقة الخلوية</div>
                      <div className="text-sm font-bold text-cyan-300 mt-2">
                        {insulinResistance 
                          ? 'الخلايا جائعة (البوابات موصدة)' 
                          : insulinLevel > 30 
                            ? 'طاقة خلوية نشطة ومثالية' 
                            : 'عجز طاقة بسبب نقص الأنسولين'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATOR 2: Blood Pressure Gauge */}
              {disease.interactiveWidgetType === 'blood-pressure' && (
                <div className="space-y-5">
                  <p className="text-xs text-slate-300">
                    اضبط قراءتي الضغط الانقباضي والانبساطي لمشاهدة تأثير القوة على الجدران الشريانية:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-slate-400">
                        <span>الضغط الانقباضي (Systolic):</span>
                        <span className="font-mono text-rose-400 font-bold">{systolic} mmHg</span>
                      </div>
                      <input
                        type="range"
                        min="90"
                        max="200"
                        value={systolic}
                        onChange={(e) => {
                          sound.playHeartbeatThump();
                          setSystolic(Number(e.target.value));
                        }}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 text-slate-400">
                        <span>الضغط الانبساطي (Diastolic):</span>
                        <span className="font-mono text-rose-400 font-bold">{diastolic} mmHg</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="130"
                        value={diastolic}
                        onChange={(e) => {
                          sound.playHeartbeatThump();
                          setDiastolic(Number(e.target.value));
                        }}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Diagnosis Alert Box */}
                  <div className={`p-4 rounded-xl border text-center ${
                    systolic >= 140 || diastolic >= 90
                      ? 'bg-rose-950/50 border-rose-500 text-rose-200'
                      : systolic >= 130 || diastolic >= 85
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200'
                        : 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                  }`}>
                    <div className="text-xs font-mono mb-1">تصنيف الحالة وفق منظمة الصحة العالمية:</div>
                    <div className="text-lg font-black">
                      {systolic >= 140 || diastolic >= 90
                        ? 'ارتفاع ضغط دم سريري (إجهاد حاد للشرايين والقلب) ⚠️'
                        : systolic >= 130 || diastolic >= 85
                          ? 'ضغط دم مرتفع مبكر (يتطلب تخفيف الصوديوم والمشي)'
                          : 'ضغط دم مثالي وصحي للغاية (الشرايين مرنة ومحمية) ✅'}
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATOR 3: RBC & Hemoglobin Density */}
              {disease.interactiveWidgetType === 'rbc-density' && (
                <div className="space-y-5">
                  <p className="text-xs text-slate-300">
                    حرّك مؤشر الهيموجلوبين لترى سعة نقل الأكسجين وتأثيرها المباشر على نشاط الدماغ والعضلات:
                  </p>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>تركيز الهيموجلوبين بالدم:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">{hemoglobinLevel} g/dL</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="18"
                      step="0.5"
                      value={hemoglobinLevel}
                      onChange={(e) => {
                        sound.playClick(900 + Number(e.target.value) * 40);
                        setHemoglobinLevel(Number(e.target.value));
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">كفاءة تشبع الأكسجين بالأنسجة</div>
                      <div className={`text-xl font-mono font-black mt-1 ${hemoglobinLevel < 11 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {Math.min(100, Math.round((hemoglobinLevel / 15) * 100))}%
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">المؤشر السريري</div>
                      <div className="text-xs font-bold mt-2 text-slate-200">
                        {hemoglobinLevel < 9 
                          ? 'أنيميا حادة (إرهاق وضيق تنفس مستمر)' 
                          : hemoglobinLevel < 12 
                            ? 'أنيميا متوسطة (نقص مخزون الحديد)' 
                            : 'أسطول كريات دم مكتمل وصحي'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATOR 4: BMI & Visceral Fat Risk */}
              {disease.interactiveWidgetType === 'bmi-visceral' && (
                <div className="space-y-5">
                  <p className="text-xs text-slate-300">
                    أدخل قياسات الوزن والطول ومحيط الخصر لتحليل مؤشر الكتلة وخطر الدهون الحشوية العميقة:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">الوزن (كجم):</label>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value)))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">الطول (سم):</label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Math.max(100, Number(e.target.value)))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">محيط الخصر (سم):</label>
                      <input
                        type="number"
                        value={waistCm}
                        onChange={(e) => setWaistCm(Math.max(50, Number(e.target.value)))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Calculated BMI Badge */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">مؤشر كتلة الجسم (BMI) الحالي:</div>
                    <div className={`text-3xl font-black font-mono my-1 ${getBmiStatus(bmiValue).color}`}>
                      {bmiValue} <span className="text-xs font-normal">kg/m²</span>
                    </div>
                    <div className={`text-sm font-bold ${getBmiStatus(bmiValue).color}`}>
                      {getBmiStatus(bmiValue).label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2">
                      محيط الخصر {waistCm} سم: {waistCm > 94 ? '⚠️ يشير لتراكم دهون حشوية مفرطة تطلق سيتوكينات التهابية' : '✅ ضمن الحدود الآمنة للأعضاء الداخلية'}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* RENDER QUESTIONS LIST HELPER */}
          {(() => {
            const renderQuestionsList = () => (
              <div className="space-y-6">
                {/* Questions List */}
                <div className="space-y-5">
                  {disease.specificQuiz.questions.map((q, qIndex) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const userAnswer = selectedAnswers[q.id];
                    const isCorrect = userAnswer === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 relative overflow-hidden transition-all shadow-md"
                      >
                        {/* Question Index & Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-cyan-400 font-bold">
                            السؤال {qIndex + 1} من {disease.specificQuiz.questions.length}
                          </span>
                          {isAnswered && (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isCorrect
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                              }`}
                            >
                              {isCorrect ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  إجابة صحيحة!
                                </>
                              ) : (
                                'إجابة تحتاج مراجعة'
                              )}
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <h4 className="text-sm sm:text-base font-bold text-slate-100 mb-4 leading-relaxed">
                          {q.question}
                        </h4>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((option, optIdx) => {
                            let optStyle = 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-cyan-500/60 hover:bg-slate-850';

                            if (isAnswered) {
                              if (optIdx === q.correctIndex) {
                                optStyle = 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                              } else if (optIdx === userAnswer && !isCorrect) {
                                optStyle = 'bg-rose-950/90 text-rose-300 border-rose-500/80';
                              } else {
                                optStyle = 'bg-slate-900/40 text-slate-500 border-slate-800/40 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isAnswered}
                                onClick={() => handleSelectQuizAnswer(q.id, optIdx, q.correctIndex)}
                                className={`p-3 rounded-xl border text-xs sm:text-sm text-right transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${optStyle}`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-950/80 border border-current shrink-0 flex items-center justify-center text-[10px] font-mono mt-0.5">
                                  {optIdx + 1}
                                </span>
                                <span className="leading-snug">{option}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation & Clinical Tip reveal */}
                        {showExplanation[q.id] && (
                          <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                            <div className="text-slate-300">
                              <span className="font-bold text-cyan-400 ml-1">التفسير الفسيولوجي:</span>
                              {q.explanation}
                            </div>
                            <div className="text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20">
                              <span className="font-bold ml-1">💡 نصيحة سريرية:</span>
                              {q.clinicalTip}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Completion Certificate Card if all answered */}
                {quizCompleted && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border-2 border-amber-500/40 text-center space-y-3">
                    <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                    <h4 className="text-lg font-black text-white">
                      اكتمل التحدي السريري لـ {disease.diseaseName}!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      حصلت على <span className="text-amber-300 font-bold font-mono">{quizScore}</span> من <span className="font-mono">{disease.specificQuiz.questions.length}</span> في هذا القسم. {quizScore === disease.specificQuiz.questions.length ? 'أداء مثالي يعكس استيعاباً طبياً دقيقاً لآلية هذا المرض!' : 'معلومات ممتازة! استمر في ترسيخ المعرفة لحماية هذا العضو الحيوي.'}
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={handleResetQuiz}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-2 border border-slate-700 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        إعادة اختبار {disease.diseaseName}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );

            return (
              <>
                {/* TAB 6: Disease-Specific Clinical Quiz (Full Tab View) */}
                {activeTab === 'quiz' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Quiz Header Banner */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
                            تحدي سريري مستقل
                          </span>
                          <span className="text-xs text-slate-400">خاص بـ {disease.diseaseName}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {disease.specificQuiz.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 max-w-xl">
                          {disease.specificQuiz.description}
                        </p>
                      </div>

                      {/* Score Tally Badge */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">النتيجة الحالية</div>
                          <div className="text-xl font-black font-mono text-amber-400">
                            {quizScore} / {disease.specificQuiz.questions.length}
                          </div>
                        </div>
                        {quizCompleted && (
                          <button
                            onClick={handleResetQuiz}
                            title="إعادة التحدي"
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {renderQuestionsList()}
                  </div>
                )}

                {/* END-OF-DISEASE QUIZ: Shown at the bottom of ALL other tabs */}
                {activeTab !== 'quiz' && (
                  <div className="mt-10 pt-8 border-t-2 border-amber-500/30">
                    <div className="p-4 sm:p-5 mb-6 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                          🎯
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                              أسئلة في نهاية التقرير
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              QUIZ FOR: {disease.diseaseName}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-white mt-1">
                            التحدي التشخيصي بنهاية دراسة {disease.diseaseName}
                          </h3>
                          <p className="text-xs text-slate-300 mt-0.5">
                            أجب عن الأسئلة السريرية التالية لتأكيد فهمك الدقيق للمرض قبل إغلاق التقرير:
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/30">
                          النتيجة: {quizScore} / {disease.specificQuiz.questions.length}
                        </span>
                        {quizCompleted && (
                          <button
                            onClick={handleResetQuiz}
                            title="إعادة التحدي"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {renderQuestionsList()}
                  </div>
                )}
              </>
            );
          })()}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>معلومات موثقة وفق الأدلة الفسيولوجية والطبية</span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
