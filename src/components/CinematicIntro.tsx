import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  HeartPulse, 
  GraduationCap, 
  School, 
  ArrowLeft, 
  ArrowRight,
  Volume2, 
  VolumeX, 
  FastForward, 
  ShieldCheck, 
  RotateCcw,
  Apple,
  Activity,
  Flame
} from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  // 4 Explicit Cinematic Steps exactly as requested:
  // 1: "غذاء متوازن" (أول شيء تطلع لحالها كبيرة ومضيئة)
  // 2: "نشاط مستمر" (بعدين تطلع نشاط مستمر)
  // 3: "ووعي يحمينا من السمنة والسكري"
  // 4: "مبادرة صحتي مسؤوليتي" + المدرسة + المعلمات + المساعد الإداري
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const hasFinishedRef = useRef<boolean>(false);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick(1000);
    }
  };

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    sound.playSubtleWhoosh();
    sound.playHoloOpen();
    setIsFadingOut(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  const handleNextStep = () => {
    sound.playClick(1200);
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevStep = () => {
    sound.playClick(1000);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Auto-play timer: Comfortable 3.8s per step so user clearly sees and reads each phrase
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep === 1) {
        sound.playClick(1100);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        sound.playClick(1250);
        setCurrentStep(3);
      } else if (currentStep === 3) {
        sound.playSuccessChime();
        setCurrentStep(4);
      }
      // Step 4 remains on screen until user clicks "دخول المنصة التفاعلية"
    }, 3800);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying]);

  // Three.js ambient cosmic vitality particle space
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050f, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Particles
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x06b6d4);
    const emeraldColor = new THREE.Color(0x10b981);
    const goldColor = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 500;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500;

      const mix = Math.random();
      const chosenColor = mix < 0.45 ? emeraldColor : mix < 0.8 ? cyanColor : goldColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(200, 245, 255, 0.8)');
      grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4.5,
      map: texture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Glowing energy rings
    const ringGeo1 = new THREE.TorusGeometry(55, 0.35, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(75, 0.25, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.015;

      ring1.rotation.z = elapsed * 0.08;
      ring2.rotation.y = Math.PI / 4 + elapsed * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#02050f] text-slate-100 transition-opacity duration-700 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-amber-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(2,5,15,0.85)_100%] pointer-events-none" />

      {/* Top Header Action Bar */}
      <div className="absolute top-5 inset-x-5 z-20 flex items-center justify-between pointer-events-auto">
        <button
          onClick={handleToggleMute}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span className="hidden sm:inline">{isMuted ? 'الصوت مكتوم' : 'الصوت مفعل'}</span>
        </button>

        {/* Step indicator pills */}
        <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="text-[11px] text-slate-400 font-mono ml-1">المشهد:</span>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => {
                sound.playClick(1000);
                setIsAutoPlaying(false);
                setCurrentStep(s);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentStep === s 
                  ? 'w-8 bg-gradient-to-r from-emerald-400 to-cyan-400' 
                  : currentStep > s 
                  ? 'w-3 bg-emerald-700' 
                  : 'w-2 bg-slate-800'
              }`}
              title={`الانتقال للخطوة ${s}`}
            />
          ))}
        </div>

        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/50 text-xs text-emerald-200 hover:text-white backdrop-blur-md transition-all cursor-pointer font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <span>تخطي ودخول</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Cinematic Viewport */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center min-h-screen py-16">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: أول شيء تطلع لحالها: «غـذاءٌ مـتـوازن» بتدرج كلمة وراء كلمة */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.08, y: -25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center max-w-3xl"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-8 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                <Apple className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>الركيزة الأولى لصحة الجسد</span>
              </motion.div>

              {/* Staggered Word by Word Reveal: تطلع شوي شوي */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
                  className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-100 to-emerald-400 drop-shadow-[0_0_40px_rgba(16,185,129,0.85)] tracking-tight leading-tight inline-block"
                >
                  «غـذاءٌ
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.85, ease: 'easeOut' }}
                  className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.85)] tracking-tight leading-tight inline-block"
                >
                  مـتـوازن»
                </motion.span>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-base sm:text-xl text-slate-300 max-w-xl leading-relaxed font-medium mb-10"
              >
                حماية الخلايا تبدأ من طبقك: ألياف كاملة، بروتين نقي، واستغناء تام عن السكريات المصنعة.
              </motion.p>

              {/* Next step button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg"
              >
                <span>الخطوة التالية (نشاط مستمر)</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 2: بعدين تطلع: «نـشـاطٌ مـسـتـمـر» بتدرج كلمة وراء كلمة */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.08, y: -25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center max-w-3xl"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold mb-8 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              >
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>الركيزة الثانية للطاقة والتمثيل الغذائي</span>
              </motion.div>

              {/* Staggered Word by Word Reveal */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
                  className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 drop-shadow-[0_0_40px_rgba(245,158,11,0.85)] tracking-tight leading-tight inline-block"
                >
                  «نـشـاطٌ
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.85, ease: 'easeOut' }}
                  className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 drop-shadow-[0_0_40px_rgba(245,158,11,0.85)] tracking-tight leading-tight inline-block"
                >
                  مـسـتـمـر»
                </motion.span>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-base sm:text-xl text-slate-300 max-w-xl leading-relaxed font-medium mb-10"
              >
                150 دقيقة أسبوعياً من الحركة والمشي تحرق الدهون الحشوية وتفتح بوابات الأنسولين تلقائياً.
              </motion.p>

              {/* Next step button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg"
              >
                <span>الخطوة التالية (ووعي يحمينا)</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3: «ووعي يحمينا من السمنة والسكري» بتدرج تتابعي */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.08, y: -25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center max-w-3xl"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-8 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>الهدف الأسمى للوقاية</span>
              </motion.div>

              {/* Staggered Multi-Line Reveal */}
              <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <motion.span
                    initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
                    className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-teal-200 drop-shadow-[0_0_40px_rgba(6,182,212,0.85)] tracking-tight inline-block"
                  >
                    «ووعـيٌ
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, delay: 0.75, ease: 'easeOut' }}
                    className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-200 to-sky-300 drop-shadow-[0_0_40px_rgba(6,182,212,0.85)] tracking-tight inline-block"
                  >
                    يـحـمـيـنـا
                  </motion.span>
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 1.35, ease: 'easeOut' }}
                  className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-amber-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.7)] tracking-tight inline-block"
                >
                  من السمنة والسكري»
                </motion.span>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="text-base sm:text-xl text-slate-300 max-w-xl leading-relaxed font-medium mb-10"
              >
                الفهم الصحي المبكر يمنع 80% من الأمراض المزمنة ويصنع مستقبلاً آمناً لأجسادنا.
              </motion.p>

              {/* Next step button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2.2 }}
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                <span>كشف المبادرة والمدرسة</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 4: مبادرة صحتي مسؤوليتي + المدرسة + المعلمات + المساعد الإداري + دخول المنصة */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* Shield Crest */}
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 border-2 border-emerald-400/60 flex items-center justify-center mb-4 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
                <HeartPulse className="w-10 h-10 text-emerald-400 animate-pulse" />
              </div>

              {/* Slogan Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>غذاء متوازن • نشاط مستمر • ووعي يحمينا من السمنة والسكري</span>
              </div>

              {/* Initiative Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 drop-shadow-[0_0_35px_rgba(16,185,129,0.6)]">
                  مبادرة صحتي مسؤوليتي
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mb-8 max-w-xl">
                المنصة التفاعلية المتخصصة للوقاية من مرض السكري ومرض السمنة
              </p>

              {/* Side Cards: School Name + Teachers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mb-6">
                
                {/* Right Card: School Name (المدرسة: المتوسطة الأولى بالراكة) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center gap-4 text-right">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <School className="w-7 h-7 text-cyan-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 block mb-0.5">المدرسة:</span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      المتوسطة الأولى بالراكة
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      بيئة مدرسية معززة للصحة والوعي الرياضي والغذائي السليم.
                    </p>
                  </div>
                </div>

                {/* Left Card: Supervisors */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-4 text-right">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <GraduationCap className="w-7 h-7 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 block mb-0.5">إشراف:</span>
                    <h3 className="text-sm sm:text-base font-black text-emerald-300 leading-relaxed">
                      معلمات العلوم • معلمات المهارات الحياتية والأسرية • المرشدة الصحية
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      عطاء تربوي متميز لترسيخ الثقافة الصحية والوقائية لدى الطالبات.
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Combined Bar: Design & Production (ميِم) + High School Spirit */}
              <div className="w-full max-w-4xl p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-right text-xs mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-slate-300">
                    <span className="text-[11px] text-slate-400 block font-medium">مبادرة مدرسية تفاعلية:</span>
                    <span className="text-xs sm:text-sm font-bold text-white">صحتي مسؤوليتي — نحو جيل صحي واعٍ</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">تصميم وإخراج:</span>
                  <span className="px-3.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-sm shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    ميِم
                  </span>
                </div>
              </div>

              {/* Enter Platform Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleFinish}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3 border border-emerald-200/50"
                >
                  <span>دخول المنصة التفاعلية</span>
                  <ArrowLeft className="w-5 h-5 text-slate-950" />
                </button>

                <button
                  onClick={() => {
                    sound.playClick(1000);
                    setIsAutoPlaying(true);
                    setCurrentStep(1);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المشهد السينمائي من البداية</span>
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
