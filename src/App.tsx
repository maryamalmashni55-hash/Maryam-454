import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveBodyMap } from './components/InteractiveBodyMap';
import { DiseaseModal } from './components/DiseaseModal';
import { Footer } from './components/Footer';
import { CinematicIntro } from './components/CinematicIntro';
import { CinematicMicroscope } from './components/CinematicMicroscope';
import { CalorieMetabolismCalculator } from './components/CalorieMetabolismCalculator';
import { QuizSection } from './components/QuizSection';
import { AiHealthAssistantModal } from './components/AiHealthAssistantModal';
import { DiseaseDetail } from './data/diseases';
import { sound } from './utils/audio';
import { Heart, Sparkles, Microscope, Dna, ArrowRight, Flame, Award, Bot } from 'lucide-react';

export default function App() {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseDetail | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'mechanism' | 'causes' | 'symptoms' | 'prevention' | 'simulator' | 'quiz'>('mechanism');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [microscopeSpecimenId, setMicroscopeSpecimenId] = useState<string>('diabetes');
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);

  // Handle section navigation with audio
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMicroscopeForDisease = (diseaseId: string) => {
    setMicroscopeSpecimenId(diseaseId);
    handleNavigate('microscope');
  };

  const handleSelectDisease = (disease: DiseaseDetail, initialTab: 'mechanism' | 'quiz' = 'mechanism') => {
    setModalInitialTab(initialTab);
    setSelectedDisease(disease);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDisease) {
        setSelectedDisease(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDisease]);

  const handleEnterFromIntro = () => {
    setShowIntro(false);
    setActiveSection('body-map');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* 1. Cinematic Entry Screen Overlay */}
      {showIntro && (
        <CinematicIntro onEnter={handleEnterFromIntro} />
      )}

      {/* 2. Top Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate} 
        onReplayIntro={() => setShowIntro(true)}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
      />

      {/* 3. Main Multi-Section Viewport with Smooth Animated Transitions */}
      <main className="flex-grow pt-16 sm:pt-20 pb-20 md:pb-6">
        <AnimatePresence mode="wait">
          {activeSection === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Hero 
                onStartExploration={() => handleNavigate('body-map')} 
                onOpenMicroscope={() => handleNavigate('microscope')}
                onOpenPrevention={() => handleNavigate('prevention-rules')}
                onOpenQuiz={() => handleNavigate('quiz')}
                onOpenAiAssistant={() => setShowAiAssistant(true)}
              />
            </motion.div>
          )}

          {activeSection === 'body-map' && (
            <motion.div
              key="body-map"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="py-6"
            >
              <InteractiveBodyMap 
                onSelectDisease={handleSelectDisease} 
                onOpenMicroscope={handleOpenMicroscopeForDisease}
                onOpenCalorieCalculator={() => handleNavigate('prevention-rules')}
              />
            </motion.div>
          )}

          {activeSection === 'microscope' && (
            <motion.div
              key="microscope"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="py-6"
            >
              <CinematicMicroscope 
                initialSpecimenId={microscopeSpecimenId}
              />
            </motion.div>
          )}

          {activeSection === 'prevention-rules' && (
            <motion.div
              key="prevention-rules"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="py-6"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-2.5 text-emerald-400 text-xs sm:text-sm font-bold">
                    <Flame className="w-5 h-5 text-emerald-400" />
                    <span className="text-white">حاسبة السعرات والتمثيل الغذائي والركائز الوقائية لنمط الحياة</span>
                  </div>
                  <button
                    onClick={() => handleNavigate('body-map')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer font-bold transition-all"
                  >
                    <span>العودة لخريطة الأعضاء</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Clinical Calorie & Metabolism Calculator */}
              <CalorieMetabolismCalculator />

              {/* 2. Golden Health Pillars */}
              <div className="mt-8">
                <Footer />
              </div>
            </motion.div>
          )}

          {activeSection === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="py-6"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-2.5 text-amber-400 text-xs sm:text-sm font-bold">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-white">تحدي التشخيص السريري للأمراض المزمنة</span>
                  </div>
                  <button
                    onClick={() => handleNavigate('body-map')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer font-bold transition-all"
                  >
                    <span>العودة لخريطة الأعضاء</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dedicated Quiz Section */}
              <QuizSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer when not in prevention-rules view */}
      {activeSection !== 'prevention-rules' && (
        <Footer />
      )}

      {/* 5. Disease Detail Modal (Includes Specific Questions for this Disease) */}
      {selectedDisease && (
        <DiseaseModal
          disease={selectedDisease}
          initialTab={modalInitialTab}
          onClose={() => setSelectedDisease(null)}
          onOpenMicroscope={handleOpenMicroscopeForDisease}
        />
      )}

      {/* 6. Smart AI Health Assistant Modal */}
      <AiHealthAssistantModal
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
      />

      {/* 7. Floating Quick AI Health Assistant Trigger */}
      <div className="fixed bottom-20 md:bottom-8 left-4 sm:left-6 z-40">
        <button
          id="floating-ai-assistant-btn"
          onClick={() => {
            sound.playClick(1400);
            setShowAiAssistant(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(6,182,212,0.65)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer group select-none border border-cyan-300/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-extrabold tracking-tight">المساعد الطبي الذكي</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-950/20 text-[10px] font-mono">AI</span>
        </button>
      </div>

    </div>
  );
}
