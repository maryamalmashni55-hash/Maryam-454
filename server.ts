import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Medical fallback answer generator when API key is unconfigured
function generateMedicalFallback(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("معلمات") || q.includes("مشرف") || q.includes("مريم") || q.includes("هيا") || q.includes("بشاير") || q.includes("فريق") || q.includes("إما") || q.includes("اما")) {
    return `مرحباً بك! يفخر مشروع "رحلة داخل آلة الحياة: الأمراض المزمنة" بأن يقدَّم بـ:
⭐ إشراف المعلمات الفاضلات:
- أ. مريم
- أ. هيا
- أ. بشاير

✨ تصميم وتنفيذ:
- فريق إمـَـا

هدف هذا العمل هو تقديم تجربة تفاعلية سينمائية ترسخ مفاهيم الوقاية والصحة الحيوية لكل أفراد المجتمع.`;
  }

  if (q.includes("سكر") || q.includes("انسولين") || q.includes("بنكرياس")) {
    return `💡 **مرض السكري وآلية آلة الحياة:**
- **النوع الأول**: خلل مناعي يهاجم خلايا بيتا في البنكرياس، فيتوقف إفراز الإنسولين تماماً ويحتاج المريض لتعويضه يومياً.
- **النوع الثاني**: ينتج عن "مقاومة الإنسولين" حيث تفرز خلايا البنكرياس الهرمون ولكن مستقبلات الخلايا الدهنية والعضلية لا تستجيب له بسبب تراكم الدهون والالتهاب.
- **الوقاية والضبط**: تقليل السكريات المكررة، المشي 30 دقيقة يومياً لزيادة حساسية المستقبلات، وتناول الألياف الكاملة.`;
  }

  if (q.includes("ضغط") || q.includes("شريان") || q.includes("قلب")) {
    return `❤️ **ارتفاع ضغط الدم (القاتل الصامت):**
- الضغط المثالي للبالغين هو أقل من 120/80 ملم زئبق.
- يحدث الارتفاع عندما تضيق الأوعية الدموية أو تفقد مرونتها (تصلب الشرايين) بسبب الصوديوم الزائد، التوتر، أو تراكم الكولسترول الضار.
- **خطوات وقائية ذهبية**: تقليل ملح الطعام لأقل من 5 غرام يومياً (حمية DASH)، التركيز على البوتاسيوم من الخضار والموز، وممارسة تمارين الكارديو بانتظام.`;
  }

  if (q.includes("دم") || q.includes("انيميا") || q.includes("حديد") || q.includes("هيموجلوبين")) {
    return `🩸 **فقر الدم (الأنيميا):**
- ينتج غالباً عن نقص الحديد الذي يدخل في تركيب الهيموجلوبين، وهو البروتين الحامل للأكسجين داخل كريات الدم الحمراء.
- **الأعراض الشائعة**: الإرهاق المستمر، شحوب الوجه، الدوار، وتسارع ضربات القلب عند بذل مجهود بسيط.
- **الحلول الغذائية**: تناول مصادر الحديد (اللحوم، السبانخ، العدس) مقترنة بفيتامين C (كالليمون أو البرتقال) لتعزيز امتصاصه، وتجنب شرب الشاي والقهوة مع الوجبات مباشرة.`;
  }

  if (q.includes("سمنة") || q.includes("وزن") || q.includes("سعرات") || q.includes("حرق") || q.includes("أيض")) {
    return `🔥 **السمنة وتوازن التمثيل الغذائي (Metabolism):**
- زيادة الوزن ليست مجرد مظهر، بل هي تراكم دهون حشوية تفرز مواد التهابية ترهق القلب والبنكرياس.
- حاسبة السعرات في منصتنا تعتمد معادلة Mifflin-St Jeor الطبية لحساب BMR و TDEE بدقة.
- **أسرار تسريع الأيض**: بناء الكتلة العضلية بتمارين المقاومة، شرب الماء الكافي (35 مل لكل كغم وزن)، النوم المنتظم 7-8 ساعات، وتناول كمية كافية من البروتين.`;
  }

  return `أهلاً بك في المساعد الطبي الذكي لمنصة "رحلة داخل آلة الحياة"!
يسعدني الإجابة على استفساراتك حول:
1. مرض السكري والبنكرياس ومقاومة الإنسولين.
2. ضغط الدم وصحة القلب والشرايين.
3. فقر الدم ومستويات الهيموجلوبين والحديد.
4. السمنة ومعدل الأيض وحساب السعرات والماكروز.
5. استفسارات حول مشرفات المشروع (أ. مريم، أ. هيا، أ. بشاير) أو فريق التنفيذ (فريق إمـَـا).

اكتب سؤالك وسأجيبك فوراً بتوجيهات علمية مبسطة!`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      appName: "رحلة داخل آلة الحياة: الأمراض المزمنة",
      hasGeminiKey: !!process.env.GEMINI_API_KEY 
    });
  });

  // Project Info Route (Teachers & Team)
  app.get("/api/credits", (req, res) => {
    res.json({
      supervisors: ["أ. مريم", "أ. هيا", "أ. بشاير"],
      team: "فريق إمـَـا",
      title: "رحلة داخل آلة الحياة: الأمراض المزمنة",
      purpose: "منصة تعليمية واستكشافية سينمائية للوقاية من الأمراض المزمنة"
    });
  });

  // AI Chat Assistant Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "الرسالة مطلوبة" });
      }

      const ai = getAI();

      if (!ai) {
        // Safe intelligent medical fallback
        const fallbackAnswer = generateMedicalFallback(message);
        return res.json({ 
          response: fallbackAnswer, 
          source: "offline_medical_knowledge" 
        });
      }

      const systemInstruction = `أنت "المساعد الطبي الذكي" لمنصة "رحلة داخل آلة الحياة: الأمراض المزمنة".
المشروع منجز بـ:
- إشراف المعلمات الفاضلات: أ. مريم • أ. هيا • أ. بشاير
- تصميم وتنفيذ: فريق إمـَـا

مهمتك:
- تقديم إجابات طبية وصحية وتوعوية دقيقة وموثوقة، بأسلوب عربي فصيح، ودود، ومشجع، ومنسق بنقاط وبطاقات واضحة.
- التخصص في الأمراض المزمنة الأربعة في المنصة:
  1. مرض السكري (النوع 1 و2، مقاومة الإنسولين، البنكرياس).
  2. ارتفاع ضغط الدم (أمراض القلب، تصلب الشرايين، الصوديوم، حمية DASH).
  3. فقر الدم والأنيميا (كريات الدم الحمراء، الهيموجلوبين، الحديد، التغذية).
  4. السمنة ومتلازمة التمثيل الغذائي (حرق السعرات، BMR، توزيع الماكروز، الدهون الحشوية).
- إذا سأل المستخدم عن المعلمات المشرفات أو فريق العمل أو القائمين على المشروع، اذكر بوضوح وتقدير كبير:
  "إشراف المعلمات الفاضلات: أ. مريم، أ. هيا، أ. بشاير | تصميم وتنفيذ: فريق إمـَـا".
- احرص دائماً على إضافة تنبيه توعوي لطيف في نهاية الإجابات الطبية المعقدة بأن المعلومات تثقيفية للوقاية ولا تغني عن التشخيص الطبي السريري.`;

      // Construct contents
      const promptContents: any[] = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.role === 'user' || item.role === 'model') {
            promptContents.push({
              role: item.role,
              parts: [{ text: item.text }]
            });
          }
        }
      }

      promptContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const result = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = result.text || generateMedicalFallback(message);
      res.json({ response: responseText, source: "gemini-3.8-flash" });

    } catch (err: any) {
      console.error("Gemini API Error:", err);
      // Even on error, provide medical fallback gracefully
      const safeAnswer = generateMedicalFallback(req.body?.message || "");
      res.json({ response: safeAnswer, source: "fallback_on_error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
