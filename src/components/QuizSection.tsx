import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DISEASES_DATA } from '../data/diseases';
import { sound } from '../utils/audio';
import { 
  Award, 
  RotateCcw, 
  Sparkles, 
  Stethoscope, 
  ShieldCheck, 
  ChevronLeft, 
  HelpCircle,
  Activity,
  Heart,
  Droplets,
  Flame,
  Check,
  Zap,
  Volume2
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  // Active selected disease for the dedicated quiz
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('diabetes');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [diseaseScores, setDiseaseScores] = useState<{ [diseaseId: string]: number }>({});
  const [completedDiseases, setCompletedDiseases] = useState<{ [diseaseId: string]: boolean }>({});

  const currentDisease = DISEASES_DATA.find(d => d.id === selectedDiseaseId) || DISEASES_DATA[0];
  const questions = currentDisease.specificQuiz.questions;
  const currentQuestion = questions[currentQuestionIdx] || questions[0];

  const handleSelectDisease = (diseaseId: string) => {
    sound.playClick(1200);
    // Play subtle heartbeat when switching disease
    sound.playHeartbeatThump();
    setSelectedDiseaseId(diseaseId);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick(1300);
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) {
      sound.playSuccessChime();
      setDiseaseScores(prev => ({
        ...prev,
        [selectedDiseaseId]: (prev[selectedDiseaseId] || 0) + 1
      }));
    } else {
      sound.playErrorBuzz();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick(1400);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      sound.playSuccessChime();
      setCompletedDiseases(prev => ({ ...prev, [selectedDiseaseId]: true }));
    }
  };

  const handleResetCurrentQuiz = () => {
    sound.playClick(1000);
    setDiseaseScores(prev => ({ ...prev, [selectedDiseaseId]: 0 }));
    setCompletedDiseases(prev => ({ ...prev, [selectedDiseaseId]: false }));
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const isCompleted = !!completedDiseases[selectedDiseaseId];
  const currentScore = diseaseScores[selectedDiseaseId] || 0;

  // Icon selector per disease
  const getOrganIcon = (organKey: string) => {
    switch (organKey) {
      case 'heart': return <Heart className="w-5 h-5 text-rose-500 animate-pulse" />;
      case 'pancreas': return <Activity className="w-5 h-5 text-cyan-400" />;
      case 'blood': return <Droplets className="w-5 h-5 text-emerald-400" />;
      case 'digestive': return <Flame className="w-5 h-5 text-amber-400" />;
      default: return <Stethoscope className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="quiz-section" className="py-20 px-4 relative bg-[#02050e] border-t border-cyan-950/40">
      
      {/* Background Cyber Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>المختبر التشخيصي المتخصص • أسئلة سريرية مستقلة لكل مرض</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            اختر المرض واختبر فهمك لآليته
          </h2>
          
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            تمت برمجة أسئلة منفصلة ومتخصصة لكل مرض حقيقي لتختبر معرفتك بالبنكرياس، القلب، كريات الدم، والأيض بشكل مستقل.
          </p>
        </motion.div>

        {/* 1. Disease Switcher Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {DISEASES_DATA.map((disease) => {
            const isSelected = disease.id === selectedDiseaseId;
            const diseaseScore = diseaseScores[disease.id];
            const hasCompleted = completedDiseases[disease.id];

            return (
              <button
                key={disease.id}
                id={`quiz-select-${disease.id}`}
                onClick={() => handleSelectDisease(disease.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {/* Active Indicator Top line */}
                {isSelected && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                )}

                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getOrganIcon(disease.organKey)}
                  </div>
                  {hasCompleted && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      {diseaseScore}/3
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                    {disease.diseaseName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    3 أسئلة متخصصة
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* 2. Main Diagnostic Quiz Terminal */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          
          {/* Terminal Header Bar */}
          <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                {getOrganIcon(currentDisease.organKey)}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {currentDisease.specificQuiz.title}
                </h3>
                <span className="text-xs text-slate-400">
                  العضو: {currentDisease.organName}
                </span>
              </div>
            </div>

            {/* Quick sound thump button */}
            <button
              id="quiz-heartbeat-btn"
              onClick={() => sound.playHeartbeatThump()}
              title="سماع دقة قلب تشخيصية"
              className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5 hover:bg-rose-900/40 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>نبض القلب</span>
            </button>
          </div>

          {/* Quiz Body */}
          <div className="p-6 sm:p-8">
            
            {/* If Quiz is in progress */}
            {!isCompleted ? (
              <div className="space-y-6">
                
                {/* Progress bar and counter */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>سؤال {currentQuestionIdx + 1} من {questions.length}</span>
                  <span className="text-cyan-400 font-bold">
                    النقاط الحالية: {currentScore} / {questions.length}
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="text-right">
                  <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
                    {currentQuestion.question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === currentQuestion.correctIndex;

                    let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500 hover:bg-slate-900';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-300 font-bold';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-900 border border-current shrink-0 flex items-center justify-center text-xs font-mono mt-0.5">
                          {optIdx + 1}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon submission */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right space-y-2 animate-fadeIn text-xs">
                    <div className="text-slate-300">
                      <span className="font-bold text-cyan-400 ml-1">التفسير السريري:</span>
                      {currentQuestion.explanation}
                    </div>
                    <div className="text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="font-bold ml-1">💡 نصيحة سريرية:</span>
                      {currentQuestion.clinicalTip}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      id="quiz-submit-answer-btn"
                      disabled={selectedOption === null}
                      onClick={handleSubmitAnswer}
                      className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      تأكيد الإجابة
                    </button>
                  ) : (
                    <button
                      id="quiz-next-question-btn"
                      onClick={handleNextQuestion}
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{currentQuestionIdx < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* Completed Screen for this Disease */
              <div className="text-center py-6 space-y-5 animate-fadeIn">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>

                <div>
                  <span className="text-xs font-mono text-amber-400 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30">
                    تشخيص مكتمل بنجاح
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white mt-2">
                    أنهيت اختبار {currentDisease.diseaseName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2">
                    حققت <span className="text-amber-400 font-bold font-mono text-lg">{currentScore}</span> من <span className="font-mono text-lg">{questions.length}</span> إجابات صحيحة في هذا التحدي.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    id="quiz-reset-btn"
                    onClick={handleResetCurrentQuiz}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة اختبار هذا المرض</span>
                  </button>

                  {/* Switch to next disease */}
                  {selectedDiseaseId !== 'obesity' && (
                    <button
                      onClick={() => {
                        const nextIndex = (DISEASES_DATA.findIndex(d => d.id === selectedDiseaseId) + 1) % DISEASES_DATA.length;
                        handleSelectDisease(DISEASES_DATA[nextIndex].id);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                    >
                      الانتقال للمرض التالي ⬅️
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </motion.div>

      </div>
    </section>
  );
};
