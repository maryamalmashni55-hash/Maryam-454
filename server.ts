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

  if (q.includes("معلمات") || q.includes("مشرف") || q.includes("مريم") || q.includes("هيا") || q.includes("بشاير") || q.includes("جواهر") || q.includes("فريق") || q.includes("إما") || q.includes("اما")) {
    return `مرحباً بك! يفخر مشروع "رحلة داخل آلة الحياة: الأمراض المزمنة" بأن يقدَّم بـ:
⭐ إشراف المعلمات الفاضلات:
- أ. مريم
- أ. هيا
- أ. بشاير
- أ. جواهر

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

  if (q.includes("سمنة") || q.includes("وزن") || q.includes("سعرات") || q.includes("حرق") || q.includes("أيض") || q.includes("خصر") || q.includes("bmi")) {
    return `🔥 **مرض السمنة والدهون الحشوية والتمثيل الغذائي:**
- **المفهوم العلمي**: السمنة مرض أيضي مزمن ينتج عن تراكم مفرط للدهون خصوصاً في تجويف البطن وحول الكبد (الدهون الحشوية).
- **العلاقة بالسكري**: الدهون الحشوية تفرز أحماضاً دهنية حرة وسيتوكينات التهابية (TNF-α و IL-6) تلتصق بمستقبلات الخلايا وتعطل عمل الأنسولين مباشرة.
- **محيط الخصر الحرج**: الخطر يبدأ عند تجاوز 94 سم للرجال و 80 سم للنساء.
- **خطوات الحل المستدام**: عجز سعرات ذكي (300-500 سعرة)، ممارسة 150 دقيقة أسبوعياً من النشاط البدني المتنوع، وبناء العضلات لرفع معدل الأيض الأساسي (BMR).`;
  }

  return `أهلاً بك في المساعد الطبي والحيوي الذكي لـ **مبادرة صحتي مسؤوليتي** بالمتوسطة الأولى بالراكة!
🌟 «غذاء متوازن • نشاط مستمر • ووعي يحمينا من السمنة والسكري»

يسعدني إرشادك علمياً وتثقيفياً حول:
1. **مرض السكري**: أنواعه (1، 2، سكري الحمل، ما قبل السكري)، البنكرياس، الأنسولين، والحمية الجلايسيمية.
2. **مرض السمنة**: مؤشر كتلة الجسم (BMI)، دهون الأحشاء ومحيط الخصر، حرق السعرات، وعجز الطاقة الصحي.
3. **الرابط المشترك والوقاية التوأم**: كيف تمنع السمنة 80% من الإصابة بالسكري.
4. **معلومات المبادرة**:
   - إشراف المعلمات الفاضلات: **أ. مريم • أ. هيا • أ. بشاير**
   - المساعد الإداري: **أ. جواهر**
   - الصرح التعليمي: **المتوسطة الأولى بالراكة**
   - تصميم وتنفيذ: **فريق إمـَـا**

اطرح أي استفسار صحي وسأجيبك بأعلى دقة علمية ووضوح!`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      appName: "مبادرة صحتي مسؤوليتي - المتوسطة الأولى بالراكة",
      hasGeminiKey: !!process.env.GEMINI_API_KEY 
    });
  });

  // Project Info Route (Teachers & Team)
  app.get("/api/credits", (req, res) => {
    res.json({
      school: "المتوسطة الأولى بالراكة",
      initiative: "مبادرة صحتي مسؤوليتي",
      slogan: "غذاء متوازن، نشاط مستمر، ووعي يحمينا من السمنة والسكري",
      supervisors: ["أ. مريم", "أ. هيا", "أ. بشاير"],
      adminAssistant: "أ. جواهر",
      team: "فريق إمـَـا",
      focusAreas: ["مرض السكري", "مرض السمنة وزيادة الوزن", "الوقاية ونمط الحياة المتوازن"]
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

      const systemInstruction = `أنت "المساعد الطبي والحيوي الذكي" لمبادرة "صحتي مسؤوليتي" في "المتوسطة الأولى بالراكة".
شعار المبادرة الراسخ: «غذاء متوازن، نشاط مستمر، ووعي يحمينا من السمنة والسكري».

فريق وإشراف المبادرة:
- إشراف المعلمات الفاضلات: أ. مريم • أ. هيا • أ. بشاير
- المساعد الإداري: أ. جواهر
- الصرح التعليمي: المتوسطة الأولى بالراكة
- تصميم وتنفيذ وإخراج: فريق إمـَـا

مهمتك واختصاصك الحصري:
1. التوعية العميقة والدقيقة والمبسطة بمرضين رئيسيين فقط هما:
   - مرض السكري (النوع 1، النوع 2، مرحلة ما قبل السكري، البنكرياس، خلايا بيتا، الأنسولين، الجلوكوز، السكر التراكمي HbA1c، مضاعفات العين والكلى والأعصاب، التغذية الجلايسيمية، والرياضة).
   - مرض السمنة وزيادة الوزن (الدهون الحشوية، مؤشر كتلة الجسم BMI، محيط الخصر، مقاومة هرمون اللبتين، السيتوكينات الالتهابية، حرق السعرات BMR، عجز السعرات الذكي، التمارين الرياضية، والنوم).
2. الرابط المشترك والتوأم الأيضي بين السمنة والسكري: كيف تسبب دهون البطن مقاومة الأنسولين، ولماذا خفض 5-10% من الوزن يحمي من السكري بنسبة تفوق 70%.
3. أسلوبك: علمي رصين، بأسلوب عربي فصيح ودود ومشجع، منسق بنقاط وبطاقات واضحة وممتعة للطالبات والأسرة.
4. إذا سأل المستخدم عن المعلمات المشرفات أو المدرسة أو المساعد الإداري، اذكر بوضوح واعتزاز كبير:
   "المتوسطة الأولى بالراكة | مبادرة صحتي مسؤوليتي | إشراف المعلمات الفاضلات: أ. مريم، أ. هيا، أ. بشاير | المساعد الإداري: أ. جواهر | تصميم وتنفيذ: فريق إمـَـا".
5. احرص على إضافة تنبيه لطيف بأن المعلومات تثقيفية ووقائية مدرسية ولا تغني عن الاستشارة السريرية المباشرة عند الحاجة.`;

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
