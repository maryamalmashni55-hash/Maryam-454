import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  User, 
  RefreshCw, 
  GraduationCap, 
  Users, 
  Heart, 
  Activity, 
  Droplets, 
  Flame, 
  Copy, 
  Check, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  source?: string;
}

interface AiHealthAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export const AiHealthAssistantModal: React.FC<AiHealthAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuestion
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `أهلاً بك! أنا **المساعد الطبي والحيوي الذكي** لمنصة "رحلة داخل آلة الحياة: الأمراض المزمنة".

🌟 **إشراف المعلمات الفاضلات:**
• **أ. مريم** • **أ. هيا** • **أ. بشاير** • **أ. جواهر**

🎨 **تصميم وتنفيذ:**
• **فريق إمـَـا**

يمكنك سؤالي عن أي استفسار يتعلق بـ:
1. **مرض السكري** (البنكرياس، الإنسولين، الحمية المقترحة).
2. **ضغط الدم** (القلب، تصلب الشرايين، الأغذية المفيدة).
3. **فقر الدم** (الهيموجلوبين، الحديد، الأعراض).
4. **السمنة والتمثيل الغذائي** (معدل الحرق، السعرات، الماكروز).
5. تفاصيل المشروع وفريق العمل والمعلمات المشرفات.`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    { label: 'ما الفرق بين سكري النوع الأول والثاني؟', icon: <Activity className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'كيف أخفض ضغط الدم الانقباضي طبيعياً؟', icon: <Heart className="w-3.5 h-3.5 text-rose-400" /> },
    { label: 'ما هي أعراض فقر الدم الشائعة وأسبابه؟', icon: <Droplets className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'كيف أرفع معدل الأيض اليومي بدون تجويع؟', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'من هن المعلمات المشرفات وفريق العمل؟', icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Handle initial question if provided
  useEffect(() => {
    if (isOpen && initialQuestion && initialQuestion.trim().length > 0) {
      handleSendMessage(initialQuestion);
    }
  }, [isOpen, initialQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    sound.playClick(1400);

    const userMsgId = Date.now().toString();
    const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: Message = {
      id: userMsgId,
      role: 'user',
      text: messageContent,
      time: currentTime
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Format chat history for the API
      const historyPayload = messages
        .filter(m => m.id !== 'welcome-1')
        .slice(-6)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بالخادم');
      }

      const data = await res.json();
      sound.playSuccessChime();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.response || 'عذراً، لم أتمكن من الحصول على إجابة، يرجى المحاولة لاحقاً.',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      sound.playHeartbeatThump();

      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `أهلاً بك! يرجى التأكد من اتصال الإنترنت.
بشكل عام، الوقاية من الأمراض المزمنة تعتمد على ثلاث ركائز أساسية:
1. المشي والرياضة اليومية لمدة 30 دقيقة.
2. تقليل السكريات والأطعمة المكررة والصوديوم.
3. إجراء الفحوصات الدورية ومراقبة مؤشرات الدم.

⭐ هذا العمل المميز تم بإشراف المعلمات: **أ. مريم • أ. هيا • أ. بشاير • أ. جواهر**، وبتصميم وتنفيذ **فريق إمـَـا**.`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playClick(1600);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    sound.playClick(900);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'تم بدء محادثة استشارية جديدة! كيف يمكنني مساعدتك في صحتك وأعضاء جسدك اليوم؟',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl">
          {/* Backdrop Click */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col h-[90vh] max-h-[750px] overflow-hidden text-right"
          >
            {/* Top Glowing Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Bot className="w-6 h-6 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      المساعد الطبي الذكي لآلة الحياة
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                      GEMINI AI
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-300 mt-0.5">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <GraduationCap className="w-3 h-3 text-cyan-400" />
                      <span>إشراف: أ. مريم • أ. هيا • أ. بشاير • أ. جواهر</span>
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Users className="w-3 h-3 text-emerald-400" />
                      <span>تنفيذ: فريق إمـَـا</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearHistory}
                  title="مسح المحادثة"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions Chips Bar */}
            <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>أسئلة شائعة:</span>
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.label)}
                  disabled={isLoading}
                  className="shrink-0 px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/70 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {q.icon}
                  <span>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Messages Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div 
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                        isUser 
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                          : 'bg-slate-800 border border-cyan-500/40 text-cyan-400'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {/* Copy Action Button */}
                      {!isUser && (
                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="absolute top-2 left-2 p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="نسخ النص"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}

                      {/* Content with simple formatting */}
                      <div className="whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      {/* Timestamp */}
                      <div className={`mt-2 text-[10px] font-mono flex items-center justify-between ${isUser ? 'text-cyan-100' : 'text-slate-500'}`}>
                        <span>{msg.time}</span>
                        {!isUser && (
                          <span className="text-[9px] text-cyan-400/80">
                            مستشار آلة الحياة
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator while waiting for Gemini */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 text-xs text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-slate-300">جارٍ تحليل السؤال وتوليد الإجابة الطبية...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar & Disclaimer */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:shadow-none flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span className="hidden sm:inline text-xs">إرسال</span>
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اسأل عن السكري، الضغط، فقر الدم، الأيض، أو المعلمات المشرفات..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all text-right"
                />
              </form>

              {/* Supervision & Medical Disclaimer Note */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>معلومات تثقيفية للوقاية • إشراف: أ. مريم، أ. هيا، أ. بشاير، أ. جواهر • تنفيذ: فريق إمـَـا</span>
                </span>
                <span className="font-mono text-cyan-400/80">POWERED BY GEMINI 3.8</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
