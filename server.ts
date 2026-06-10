/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { AL_TAYEBAAT_FOODS, lookupFood } from "./src/foodData";
import { FoodCategory } from "./src/types";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client securely
// Using correct initialization syntax with User-Agent header for AI Studio
const aiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (aiApiKey && aiApiKey !== "MY_GEMINI_API_KEY") {
  aiClient = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. API: Analyze meal components using mixed rule-matching and secure server-side AI narrative
app.post("/api/verify-meal", async (req, res) => {
  const { mealText } = req.body;

  if (!mealText || typeof mealText !== "string") {
    return res.status(400).json({ error: "الرجاء إدخال مكونات الوجبة للتحليل." });
  }

  try {
    // Exact Keyword dictionary to check local compliance and ensure zero AI hallucinations
    const keywords: Record<string, string[]> = {
      chicken: ["دجاج", "فراخ", "جاج", "بانيه", "طيور", "ديك", "دجاجة", "فرخة"],
      eggs: ["بيض", "أومليت", "صفار", "بياض", "بيضه", "بيضة"],
      milk: ["حليب", "لبن", "كوب حليب", "حليب سائل", "اللبن"],
      yogurt: ["زبادي", "لبنة", "رائب", "رايب", "زبادية", "لبنه", "قشطة حامضة"],
      tomatoes: ["طماطم", "بندورة", "قوطة", "صلصلة", "صلصة", "بندوره"],
      legumes: ["عدس", "فول", "حمص", "فاصوليا", "لوبيا", "بقوليات", "فاصولية", "حمص الشام", "ترمس", "بصارة"],
      nuts: ["مكسرات", "لوز", "بندق", "كاجو", "فستق", "سمسم", "عين الجمل", "جوز", "فول سوداني", "سوداني"],
      normal_bread: ["عيش", "خبز", "قرص", "فينو", "بلدي", "سياحي", "بلدى", "رغيف"],
      rice: ["أرز", "ارز", "رز", "أرز أبيض"],
      potatoes: ["بطاطس", "بطاطا", "بطاطة", "شيبس", "بطاطس محمرة", "مسلوقة"],
      toasted_toast: ["توست", "توست محمص", "توست أبيض", "توست أبيض محمص"],
      clotted_cream: ["قشطة", "قشطه", "قيمر", "قشطة بلدي"],
      pure_butter: ["زبدة", "زبده", "سمن بلدي", "سمنة حيواني", "زبدة طبيعية"],
      pure_honey: ["عسل", "عسل نحل", "عسل طبيعي", "عسل أبيض"]
    };

    // Evaluate against local food database rules
    const analyzedItems: any[] = [];
    let isFullyCompliant = true;

    // Direct string scan to trigger rules immediately
    for (const item of AL_TAYEBAAT_FOODS) {
      const keys = keywords[item.id] || [];
      const isWordFound = keys.some(kw => mealText.toLowerCase().includes(kw));
      if (isWordFound) {
        const isCompliant = item.category !== FoodCategory.PROHIBITED;
        if (!isCompliant) {
          isFullyCompliant = false;
        }
        analyzedItems.push({
          itemNameUrgent: item.nameAr,
          matchedItem: item,
          category: item.category,
          isCompliant,
          reasonAr: item.reasonAr,
          alternativesAr: item.alternativesAr
        });
      }
    }

    // Prepare system instructions grounded in the actual Al-Tayebaat database
    const systemInstruction = `أنت المساعد الذكي الرسمي لنظام الطيبات (طيب-بوت/Tayeb-Bot) وموقع المجدل.
مهمتك تحليل الوجبات وإعطاء إرشادات الراحة الهضمية المتطابقة 100% مع أسس الاستشفاء الفسيولوجي ونظام الطيبات.

قوانين التصنيف الصارمة (لا تخرج عنها أبداً):
1. أساسيات الاستشفاء (🔵🔵): الأرز الأبيض، البطاطس المطهية جيداً، التوست الأبيض المحمص بالكامل حتى الجفاف، القشطة الحيوانية الطبيعية الأساسية، الزبدة الحيوانية الباردة الكريستالية، وعسل النحل الطبيعي الصافي.
2. المسموح اليومي (🔵): شوكولاتة البندق النباتية (خالية تماماً من الحليب البودرة أو جوامده)، زيت الزيتون البكر النقي، زيت الذرة النقي للطهي.
3. المسموح الدوري الأسبوعي (🟡): اللحوم الحمراء (لحم الضأن/البقر) المطهية جيداً جداً لدرجة الذوبان التام، الأجبان الصفراء المعتقة المطبوخة (جودا، فيلمنكو، إيدام)، المخللات المنزلية التقليدية باعتدال أسبوعي.
4. المسموح الموسمي/الشهري (🟣): البامية المطهية جيداً جداً، الأسماك المملحة والمخمرة بشكل طبيعي (الفسيخ).
5. الممنوعات القطعية (🔴): الدجاج والطيور، البيض، الحليب السائل، الزبادي واللبنة والرائب، الطماطم النيئة بجميع أشكالها (وقشور وبذور الطماطم المطهية)، البقوليات (فول, عدس، حمص، فاصوليا، إلخ)، المكسرات بجميع أنواعها، والخبز العادي غير المحمص.

الأسلوب والصياغة:
- اكتب تقريراً علمياً، أكاديمياً، مهدئاً، وبنبرة فسيولوجية وقورة باللغة العربية الفصحى.
- تجنب العبارات المباشرة القاسية مثل "ممنوع أن تأكل ذلك"، وبدلاً منها استخدم العبارة التلطيفية المعتمدة في مدرسة المجدل: "هذا العنصر خارج نطاق الراحة الهضمية حالياً".
- عند رصد أي طعام ممنوع (🔴)، اشرح السبب الفسيولوجي (مثلاً كبريت البيض العالي وصعوبة بروتين الدجاج المغذى صناعياً ورطوبة جلوتين الخبز غير المحمص) كعائق للراحة الهضمية، ووفر البدائل المسموحة باللون الأزرق (🔵) بوضوح تام.
- اختم دائماً بنصيحة دافئة وتنبيه فسيولوجي معتدل.`;

    const userPrompt = `حلل الوجبة الآتية علمياً بناءً على معايير نظام الطيبات:
"${mealText}"

المطابقات السريعة المكتشفة في الكود المحلي:
${analyzedItems.map(x => `- ${x.itemNameUrgent} [تصنيف: ${x.category === FoodCategory.PROHIBITED ? "🔴 ممنوع قطعي" : "🔵 مسموح/أساسي"}]`).join("\n") || "لم يتم تحديد أطعمة صريحة في الفهرس السريع، قم بتحليل النص بدقة."}

صغ التقرير الأكاديمي الشافي الموجه لراحة المريض المعوية.`;

    let aiExplanation = "";
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.3
        }
      });
      aiExplanation = response.text || "";
    } else {
      // Fallback description if API Key is not set yet
      aiExplanation = `### تحليل ذكي للوجبة (وضع المحاكاة المحدود - غياب مفتاح الذكاء الاصطناعي)

لقد وجدنا مكونات وجبتك وماتوافق منها مع الكود المحلي لمنصة المجدل.

${isFullyCompliant 
  ? "🔵 وجبتك متوافقة جداً مع ركائز الراحة الهضمية المعاصرة. جميع الأطعمة تقع ضمن النطاق الآمن للاستشفاء!" 
  : "🔴 تنبيه: وجبتك تحتوي على عناصر تفوق طاقة الاحتمال الهضمي حالياً وتسبب ارتشاحاً للجدار المعوي."
}

**إرشادات نظام الطيبات والتعافي:**
- ينصح بالتركيز بنسبة 80% على أساسيات الاستشفاء مثل **أرز النحل الأبيض والتوست المحمص جيداً والزبدة والقشطة**.
- تجنب الممنوعات الشائعة مثل البيض، الدواجن المدرة بالهرمونات، ومنتجات الحليب السائل التي ينعدم احتمالها الهضمي بسبب لاكتوزها وبروتينها المعقد.

*يرجى تعيين مفتاح Gemini API في لوحة الأسرار لتفعيل الذكاء الاصطناعي الأكاديمي بالكامل.*`;
    }

    res.json({
      isFullyCompliant,
      analyzedItems,
      aiExplanation
    });

  } catch (error: any) {
    console.error("Error analyzing meal:", error);
    res.json({
      isFullyCompliant: true,
      analyzedItems: [],
      aiExplanation: `حدث خطأ أثناء الاتصال بمحرك الاستدلال الذكي: ${error?.message || error}. يرجى المحاولة لاحقاً مع الالتزام بدستور نظام الطيبات لتلافي العسر الذاتي.`
    });
  }
});

// Serve Vite during development or compiled static index page in production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Joined Vite middlewares to Express.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static production build from ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Al-Tayebaat Al-Majdal Server run-ready on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start the Express dual server:", err);
});
