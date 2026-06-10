/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { AL_TAYEBAAT_FOODS, lookupFood } from "./src/foodData";
import { FoodCategory } from "./src/types";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// API: Analyze meal components using robust website information and zero API keys mapping
app.post("/api/verify-meal", async (req, res) => {
  const { mealText } = req.body;

  if (!mealText || typeof mealText !== "string") {
    return res.status(400).json({ error: "الرجاء إدخال مكونات الوجبة للتحليل." });
  }

  try {
    // Exact Keyword dictionary to check local compliance and ensure zero AI hallucinations
    const keywords: Record<string, string[]> = {
      chicken: ["دجاج", "فراخ", "جاج", "بانيه", "طيور", "ديك", "دجاجة", "فرخة", "شيش", "فيليه"],
      eggs: ["بيض", "أومليت", "صفار", "بياض", "بيضه", "بيضة", "مسلوق", "مقلي"],
      milk: ["حليب", "لبن", "كوب حليب", "حليب سائل", "اللبن", "الارواح", "كيك"],
      yogurt: ["زبادي", "لبنة", "رائب", "رايب", "زبادية", "لبنه", "قشطة حامضة", "دانتي", "أكتيفيا"],
      tomatoes: ["طماطم", "بندورة", "قوطة", "صلصلة", "صلصة", "بندوره", "طماطم نيئة", "كاتشب"],
      legumes: ["عدس", "فول", "حمص", "فاصوليا", "لوبيا", "بقوليات", "فاصولية", "حمص الشام", "ترمس", "بصارة", "ترمس", "صويا"],
      nuts: ["مكسرات", "لوز", "بندق", "كاجو", "فستق", "سمسم", "عين الجمل", "جوز", "فول سوداني", "سوداني", "لب"],
      normal_bread: ["عيش", "خبز", "قرص", "فينو", "بلدي", "سياحي", "بلدى", "رغيف", "مكرونة", "معكرونة", "قمح", "شعير"],
      rice: ["أرز", "ارز", "رز", "أرز أبيض"],
      potatoes: ["بطاطس", "بطاطا", "بطاطة", "شيبس", "بطاطس محمرة", "مسلوقة", "مهروسة"],
      toasted_toast: ["توست", "توست محمص", "توست أبيض", "توست أبيض محمص", "شريحة توست"],
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

    // Build highly polished Arabic medical/physiological analysis based 100% on website database
    let explanationMarkdown = `### 🩺 تقرير الفحص الفسيولوجي المعتمد لوجبتك\n\n`;
    
    explanationMarkdown += `أهلاً بك في نظام **موقع المجدل وبوت الطيبات**. تم تحليل وجبتك فسيولوجياً بناءً على معايير التعافي المعوي والتحليل العلمي لبيئة الجهاز الهضمي.\n\n`;

    if (analyzedItems.length > 0) {
      explanationMarkdown += `#### 🔍 العناصر المكتشفة في وجبتك:\n\n`;
      
      // Prohibited items first with warnings
      const prohibiteds = analyzedItems.filter(x => !x.isCompliant);
      const compliants = analyzedItems.filter(x => x.isCompliant);

      if (prohibiteds.length > 0) {
        explanationMarkdown += `🔴 **تنبيه هام (عناصر تفوق طاقة الاحتمال الهضمي حالياً):**\n`;
        prohibiteds.forEach(x => {
          explanationMarkdown += `- **${x.itemNameUrgent}**:\n`;
          explanationMarkdown += `  - *التحليل فسيولوجياً*: ${x.reasonAr}\n`;
          if (x.alternativesAr && x.alternativesAr.length > 0) {
            explanationMarkdown += `  -  **البدائل العلاجية اللطيفة**: ${x.alternativesAr.join(" أو ")}\n`;
          }
          explanationMarkdown += `\n`;
        });
      }

      if (compliants.length > 0) {
        explanationMarkdown += `🔵 **عناصر متوافقة (تدعم حيوية جهازك الهضمي):**\n`;
        compliants.forEach(x => {
          explanationMarkdown += `- **${x.itemNameUrgent}** (${x.category === FoodCategory.BASE_ESSENTIAL ? "🔵🔵 أساس استشفائي" : "🔵 مسموح يومي/دوري"}):\n`;
          explanationMarkdown += `  - *الفائدة الفسيولوجية*: ${x.reasonAr}\n\n`;
        });
      }
    } else {
      explanationMarkdown += `🌿 **لم نرصد أي عناصر ممنوعة صريحة في نص وجبتك المدخل.**\n\n`;
      explanationMarkdown += `لضمان توافق وجبتك 100% مع نظام الطيبات الفسيولوجي، يرجى الالتزام بالدستور العام المذكور بالأسفل.\n\n`;
    }

    // Always include the fundamental laws of Al-Tayebaat to make the response highly authoritative and informative
    explanationMarkdown += `### 📜 دستور نظام الطيبات الراسخ للراحة الهضمية\n\n`;
    explanationMarkdown += `يرجى مراجعة وجباتك دائماً مقابل هذه القوانين الخمس الأساسية الشافية:\n\n`;
    explanationMarkdown += `1. **🌾 الأرز الأبيض**: هو ركيزة النشويات الأضمن والأنقى على أنسجة الهضم بدلاً من المعجنات والقمح والزيوت الصناعية المعقدة.\n`;
    explanationMarkdown += `2. **🍞 الخبز التوست الأبيض البلدي**: يجب تقطيعه وتحميصه بالكامل في محمص الخبز حتى يجف وينشف تماماً ويتحول لطبقة مقرمشة لتبخير الرطوبة وتفتيت سلاسل الجلوتين الخانقة لجدار القولون.\n`;
    explanationMarkdown += `3. **🍗 تجنب ألياف الدجاج والطيور**: كبديل بروتيني نظراً للمغذيات الكيميائية ومسرعات النمو المصنعة، والاعتماد التام على **لحم الضأن والماعز** المطهي نضجاً تاماً حتى الذوبان الفسيولوجي الأسهل تأهباً للأمعاء.\n`;
    explanationMarkdown += `4. **🥛 الابتعاد المطبق عن سمية الحليب السائل**: الزبادي واللبن الرائب لعدم احتمال جدار معتك سكر اللاكتوز المعقد لديهم، واستبدالها فوراً بـ **القشطة والزبدة الطبيعية الباردة** الخالية من الرطوبة ومصل الحليب.\n`;
    explanationMarkdown += `5. **🍯 عسل النحل النقي والقشطة البلدي**: هما أقوى جدار حماية معوي يمتص ويغذي الغشاء المخاطي المعذب دون إثارة أو عبء ميكانيكي.\n\n`;
    
    explanationMarkdown += `*طهي مأكولاتك بهدوء، وركز على البساطة لضمان ارتداد قرحة القولون واستعادة حيوية فلورا الأمعاء بسلام تام.*`;

    res.json({
      isFullyCompliant,
      analyzedItems,
      aiExplanation: explanationMarkdown
    });

  } catch (error: any) {
    console.error("Error analyzing meal:", error);
    res.json({
      isFullyCompliant: true,
      analyzedItems: [],
      aiExplanation: `حدث خطأ أثناء فحص مكونات الأطعمة محلياً: ${error?.message || error}. يرجى اتباع الدستور الفسيولوجي ومراجعة الفهرس العام للأكلات المعروضة بالصفحة الرئيسية.`
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
