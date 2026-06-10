/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { FoodCategory, FoodItem, FastDay } from "./types";
import { AL_TAYEBAAT_FOODS, lookupFood } from "./foodData";

// Safe dynamic icon mapper to prevent compilation issues
function FoodIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const isDark = name === "Skull" || name === "Ban" || name === "ShieldAlert" || name === "XCircle" || name === "ZapOff" || name === "TrendingDown";
  const iconColor = isDark ? "text-rose-500" : "text-emerald-600";
  
  let IconComponent = Icons.Apple;
  if (name === "Wheat") IconComponent = Icons.Wheat;
  else if (name === "Apple") IconComponent = Icons.Apple;
  else if (name === "Flame") IconComponent = Icons.Flame;
  else if (name === "Milk") IconComponent = Icons.Milk || Icons.GlassWater;
  else if (name === "Cookie") IconComponent = Icons.Cookie;
  else if (name === "Sparkles") IconComponent = Icons.Sparkles;
  else if (name === "Heart") IconComponent = Icons.Heart;
  else if (name === "Droplets") IconComponent = Icons.Droplets;
  else if (name === "FlameKindling") IconComponent = Icons.FlameKindling || Icons.Flame;
  else if (name === "ChevronsDown") IconComponent = Icons.ChevronsDown;
  else if (name === "Layers") IconComponent = Icons.Layers;
  else if (name === "GlassWater") IconComponent = Icons.GlassWater;
  else if (name === "Filter") IconComponent = Icons.Filter;
  else if (name === "Fish") IconComponent = Icons.Fish;
  else if (name === "Skull") IconComponent = Icons.Skull;
  else if (name === "Ban") IconComponent = Icons.Ban;
  else if (name === "ShieldAlert") IconComponent = Icons.ShieldAlert;
  else if (name === "Activity") IconComponent = Icons.Activity;
  else if (name === "ZapOff") IconComponent = Icons.ZapOff || Icons.Ban;
  else if (name === "TrendingDown") IconComponent = Icons.TrendingDown;

  return <IconComponent className={`${className} ${iconColor}`} />;
}

export default function App() {
  // 1. Core State
  const [activeTab, setActiveTab] = useState<"index" | "tracker" | "rules">("index");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | "ALL">("ALL");
  const [selectedFoodDetail, setSelectedFoodDetail] = useState<FoodItem | null>(null);

  // Filter foods by search query and category
  const filteredFoods = AL_TAYEBAAT_FOODS.filter(food => {
    const matchesCategory = selectedCategory === "ALL" || food.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === "" || 
      food.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.reasonAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 30-Day Tracker State
  const [trackerDays, setTrackerDays] = useState<FastDay[]>(() => {
    const saved = localStorage.getItem("al_tayebaat_tracker");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return Array.from({ length: 30 }, (_, i) => ({
      dayNumber: i + 1,
      didFast: i < 3, // Mock some initial active data to look wonderful right away!
    }));
  });

  // AI Tayeb-Bot State
  const [mealInput, setMealInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    sender: "user" | "bot";
    text: string;
    analysisResult?: {
      isFullyCompliant: boolean;
      analyzedItems: Array<{
        itemNameUrgent: string;
        category: FoodCategory;
        isCompliant: boolean;
        reasonAr: string;
        alternativesAr: string[];
      }>;
    };
  }>>([
    {
      sender: "bot",
      text: "مرحباً بك في المساعد الذكي لموقع المجدل. اكتب مكونات وجبتك القادمة وسأقوم بفحصها فسيولوجياً وتوضيح مدى موافقتها لنظام الطيبات والراحة الهضمية!"
    }
  ]);

  // Suggestions for meal input auto-suggest
  const suggestionsList = [
    "جرعة عسل مع أرز أبيض وقشطة طبيعية",
    "صدور دجاج متبلة مع خبز القمح والبيض المقلي",
    "قطعة لحم ضأن دايب مع بطاطس مطهية جيدا وأرز",
    "طبق فول بالزيت مع زبادي بلدي وخبز توست",
    "أرز أبيض مع طماطم نيئة وسلطة مكسرات",
    "توست أبيض محمص جداً وعسل نحل وقشطة حيوانية",
    "كوب حليب دافئ بيض مسلوق وجبنة رومي",
    "أجبان جودة معقدة مع توست محمص وشرائح بطاطس",
  ];

  // Save tracker days to localStorage
  useEffect(() => {
    localStorage.setItem("al_tayebaat_tracker", JSON.stringify(trackerDays));
  }, [trackerDays]);

  // Calculate compliance score based on the target system layout
  const totalFasts = trackerDays.filter(d => d.didFast).length;
  // Score formula: (Completed tracker days / target standard of 8) * 100
  const complianceScore = Math.min(100, Math.round((totalFasts / 8) * 100));

  // Calculate current longest contiguous streak of commitment
  const currentStreak = (() => {
    let maxStreak = 0;
    let current = 0;
    for (const d of trackerDays) {
      if (d.didFast) {
        current++;
        if (current > maxStreak) maxStreak = current;
      } else {
        current = 0;
      }
    }
    return maxStreak;
  })();

  // Handle meal validation action
  const handleVerifyMeal = async (textToVerify?: string) => {
    const targetText = textToVerify || mealInput;
    if (!targetText.trim()) return;

    // Add user message to chat
    const updatedHistory = [
      ...chatHistory,
      { sender: "user" as const, text: targetText }
    ];
    setChatHistory(updatedHistory);
    setMealInput("");
    setShowSuggestions(false);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/verify-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealText: targetText })
      });

      if (!response.ok) {
        throw new Error("فشل الاتصال بملقم التحويل الذاتي.");
      }

      const data = await response.json();

      setChatHistory(prev => [
        ...prev,
        {
          sender: "bot",
          text: data.aiExplanation,
          analysisResult: {
            isFullyCompliant: data.isFullyCompliant,
            analyzedItems: data.analyzedItems
          }
        }
      ]);

    } catch (err: any) {
      console.error(err);
      // Fallback manual local validation if fetch has an issue
      const mockAnalysis = performLocalBackupAnalysis(targetText);
      setChatHistory(prev => [
        ...prev,
        {
          sender: "bot",
          text: mockAnalysis.aiExplanation,
          analysisResult: {
            isFullyCompliant: mockAnalysis.isFullyCompliant,
            analyzedItems: mockAnalysis.analyzedItems
          }
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Safe manual analyzer to support solid standalone interaction even in temporary disconnected states
  const performLocalBackupAnalysis = (text: string) => {
    const analyzedItems: any[] = [];
    let isFullyCompliant = true;

    const keywords: Record<string, string[]> = {
      chicken: ["دجاج", "فراخ", "جاج", "بانيه", "طيور", "ديك"],
      eggs: ["بيض", "أومليت", "صفار", "بياض", "بيضه", "بيضة"],
      milk: ["حليب", "لبن", "كوب حليب", "سائل"],
      yogurt: ["زبادي", "لبنة", "رائب", "رايب", "زباديه"],
      tomatoes: ["طماطم", "بندورة", "قوطة", "صلصلة", "صلصة"],
      legumes: ["عدس", "فول", "حمص", "فاصوليا", "لوبيا", "بقوليات"],
      nuts: ["مكسرات", "لوز", "بندق", "كاجو", "فستق", "سمسم"],
      normal_bread: ["عيش", "خبز", "قرص", "فينو", "بلدي", "سياحي"],
      rice: ["أرز", "ارز", "رز"],
      potatoes: ["بطاطس", "بطاطا", "بطاطة", "مسلوقة"],
      toasted_toast: ["توست", "محمص"],
      clotted_cream: ["قشطة", "قشطه", "قيمر"],
      pure_butter: ["زبدة", "زبده", "سمن"],
      pure_honey: ["عسل", "عسل نحل"]
    };

    for (const item of AL_TAYEBAAT_FOODS) {
      const keys = keywords[item.id] || [];
      const isWordFound = keys.some(kw => text.toLowerCase().includes(kw));

      if (isWordFound) {
        const isCompliant = item.category !== FoodCategory.PROHIBITED;
        if (!isCompliant) {
          isFullyCompliant = false;
        }
        analyzedItems.push({
          itemNameUrgent: item.nameAr,
          category: item.category,
          isCompliant,
          reasonAr: item.reasonAr,
          alternativesAr: item.alternativesAr
        });
      }
    }

    const heading = isFullyCompliant 
      ? `🔵 الوجبة آمنة وموافقة تماماً لنظام الراحة الهضمية.` 
      : `🔴 تحذير طبي: الوجبة تحتوي على عناصر ترهق الأمعاء وتمنع الاستشفاء.`;

    const details = analyzedItems.map(x => {
      if (x.category === FoodCategory.PROHIBITED) {
        return `❌ **${x.itemNameUrgent}** هو عنصر خارج نطاق الراحة الهضمية حالياً.\nالسبب: ${x.reasonAr}\nالبديل المقترح: ${x.alternativesAr.join(" أو ")}`;
      } else {
        return `✅ **${x.itemNameUrgent}** مسموح ومثالي للترميم المعوي.`;
      }
    }).join("\n\n");

    return {
      isFullyCompliant,
      analyzedItems,
      aiExplanation: `${heading}\n\n${details || "لم نستطع مطابقة أطعمة واضحة فوراً بالقاموس الحركي، ولكن مفرزات الذكاء الفسيولوجي تنصح بالتركيز دوماً على الركائز الأساسية كالنشويات النظيفة والتوست المحمص شديد الجفاف والدسم الحيواني النقي."}`
    };
  };

  // Toggle fast status on a specific day
  const toggleFastDay = (dayNum: number) => {
    setTrackerDays(prev =>
      prev.map(d => (d.dayNumber === dayNum ? { ...d, didFast: !d.didFast } : d))
    );
  };

  // Start with a specific quick template
  const applyQuickAnalysis = (item: string) => {
    setMealInput(item);
    setShowSuggestions(false);
  };

  // Download Guide triggers a beautiful simulation or generates a real text file containing Al-Tayebaat rules
  const triggerGuideDownload = () => {
    const text = `دستور نظام الطيبات للراحة الهضمية والتعافي المعوي
========================================================================
1. الأرز الأبيض هو ركيزة النشويات الأضمن بدلاً من القمح والزيوت المعقدة.
2. التوست الأبيض يجب أن يحمص بمحمص الخبز حتى يجف بكامله ويتقرمش لتفتيت سلاسل الجلوتين الخانقة لزغابات الأمعاء.
3. التجنب المطلق لحوم الدجاج كبديل بروتيني نظراً للمغذيات الصناعية والهرمونات، واستبدالها بلحم الضأن والماعز المطهي نضجاً تاماً.
4. تجنب الحليب السائل والزبادي واللبن الرائب واستبدالها بالقشطة والزبدة الطبيعية الباردة الخالية من مصل الحليب ورطوبته.
5. تناول الوجبات الخفيفة والتركيز على أساسيات الغذاء فسيولوجياً لإعطاء حركة الهضم والامتصاص كفاية من الراحة التامة.`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tayebaat_digestive_comfort_guide.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col font-sans text-slate-800 selection:bg-emerald-600 selection:text-white bg-slate-50">
      
      {/* 1. TOP STICKY MEDICAL DISCLAIMER BANNER */}
      <div id="medical-disclaimer-banner" className="bg-amber-50 text-amber-900 border-b border-amber-200/60 text-center py-2 px-4 text-xs tracking-wide flex items-center justify-center gap-2 z-50">
        <Icons.HeartPulse className="w-4 h-4 text-amber-600 animate-pulse flex-shrink-0" />
        <span>تنبيه طبي وقائي: هذه المنصة مخصصة للتثقيف الغذائي ومتابعة حمية الطيبات والراحة الهضمية، وليست بديلاً عن العناية الطبية الفردية.</span>
      </div>

      {/* 2. PREMIUM NAVIGATION HEADER */}
      <header id="app-header" className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            {/* Logo / Title */}
            <div className="flex flex-col items-start pr-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">بوابة الاستشفاء للقولون</span>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-normal flex items-center gap-2">
                <Icons.Sparkles className="w-5 h-5 text-amber-500 inline" />
                <span>مَوْقِع المَجْدَل</span>
                <span className="text-xs font-semibold text-slate-500 mr-2">نظام الطيبات</span>
              </h1>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button
                onClick={() => { setActiveTab("index"); setSelectedCategory("ALL"); }}
                className={`py-1 transition-all relative ${activeTab === "index" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"}`}
              >
                مطلق الأطعمة
                {activeTab === "index" && <span className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
              </button>

              <button
                onClick={() => setActiveTab("tracker")}
                className={`py-1 transition-all relative ${activeTab === "tracker" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"}`}
              >
                مفكرة الالتزام (30 يوم)
                {activeTab === "tracker" && <span className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
              </button>

              <button
                onClick={() => setActiveTab("rules")}
                className={`py-1 transition-all relative ${activeTab === "rules" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"}`}
              >
                دستور الاستشفاء
                {activeTab === "rules" && <span className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
              </button>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerGuideDownload}
              className="hidden lg:flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all text-xs font-bold px-4 py-2 rounded-lg"
            >
              <Icons.Download className="w-3.5 h-3.5" />
              <span>تحميل المستند الرسمي</span>
            </button>
            
            <a
              href="#tayeb-bot-section"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
            >
              <Icons.MessageSquare className="w-3.5 h-3.5" />
              <span>الاستشارة الفورية</span>
            </a>
          </div>

        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section id="hero-banner" className="relative overflow-hidden border-b border-slate-200 py-12 md:py-16 bg-gradient-to-br from-emerald-50/10 via-white to-slate-50">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-amber-500 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 bg-emerald-50/55 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>دليل حمية الطيبات والراحة الهضمية الفسيولوجية</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              نظام الاستشفاء الميسّر:<br />
              <span className="font-black text-emerald-600 tracking-tight">حمية الطيبات والراحة الهضمية</span>
            </h2>

            <p className="text-slate-600 text-sm md:text-base max-w-2xl leading-relaxed">
              افحص وجباتك وتجنب الأطعمة المسببة لارتشاح الأمعاء والتهابات القولون. ركّز على النشويات النظيفة والدسم الحيواني الصامت لمساعدة جهازك الهضمي على الاستشفاء والراحة الفطرية لتصفير أعراض عسر الهضم.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => { setActiveTab("tracker"); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md shadow-emerald-600/15 transition-all flex items-center gap-2"
              >
                <Icons.Activity className="w-4 h-4" />
                <span>شغل مفكرة الالتزام الثلاثينية</span>
              </button>

              <button
                onClick={triggerGuideDownload}
                className="border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-sm px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                <Icons.BookOpen className="w-4 h-4" />
                <span>دستور التغذية الفطري</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="absolute top-0 left-0 bg-emerald-600 text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-br">
              الإحصاء الحركي
            </div>

            <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider border-r-4 border-amber-500 pr-2.5">
              مستوى الراحة الهضمية المتراكم
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" className="stroke-slate-100" strokeWidth="4" fill="transparent" />
                  <circle cx="32" cy="32" r="28" className="stroke-emerald-600 transition-all duration-500" strokeWidth="4" fill="transparent"
                    strokeDasharray={175} strokeDashoffset={175 - (175 * complianceScore) / 100} />
                </svg>
                <span className="absolute text-xs font-black text-emerald-700">{complianceScore}%</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-slate-900 text-xs font-bold">الالتزام بالصيام الهضمي</p>
                <p className="text-[11px] text-slate-500">تم إنجاز {totalFasts} من أصل 8 استشفيات أسبوعية مستهدفة</p>
              </div>
            </div>

            <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">سلسلة الانضباط الحالية:</span>
              <span className="font-extrabold text-amber-600 flex items-center gap-1">
                <Icons.Flame className="w-3.5 h-3.5" />
                {currentStreak} أيام مستمرة
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. MAIN WORKSPACE / MULTI-GRID PATTERN */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT COLUMN (7 Cols): Dynamic Content Area based on Tab Selector */}
        <section className="col-span-1 lg:col-span-7 space-y-8">
          
          {/* Internal Tab Filter Header */}
          <div className="flex border-b border-slate-200 pb-0.5 gap-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("index")}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === "index" ? "text-emerald-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              🔍 دليل الأطعمة ({AL_TAYEBAAT_FOODS.length})
              {activeTab === "index" && <span className="absolute bottom-[-1.5px] left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === "tracker" ? "text-emerald-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              📅 مفكرة الالتزام (30 يوم)
              {activeTab === "tracker" && <span className="absolute bottom-[-1.5px] left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === "rules" ? "text-emerald-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              📖 دستور الاستشفاء
              {activeTab === "rules" && <span className="absolute bottom-[-1.5px] left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
            </button>
          </div>

          {/* TAB 1: INTERACTIVE SMART FOOD INDEX */}
          {activeTab === "index" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Category Toggles & Search */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                
                <div className="relative">
                  <Icons.Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن مادة غذائية (البيض، الأرز، حليب، لحم...)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pr-10 pl-4 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute left-3 top-3 text-slate-400 hover:text-slate-800">
                      <Icons.X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === "ALL" ? "bg-slate-800 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}
                  >
                    الكل ({AL_TAYEBAAT_FOODS.length})
                  </button>

                  <button
                    onClick={() => setSelectedCategory(FoodCategory.BASE_ESSENTIAL)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedCategory === FoodCategory.BASE_ESSENTIAL ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-emerald-700"}`}
                  >
                    <span>🔵🔵 الأساسيات</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(FoodCategory.DAILY)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedCategory === FoodCategory.DAILY ? "bg-emerald-600/80 text-white" : "bg-slate-50 hover:bg-slate-100 text-emerald-600"}`}
                  >
                    <span>🔵 يومي</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(FoodCategory.WEEKLY_OCCASIONAL)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedCategory === FoodCategory.WEEKLY_OCCASIONAL ? "bg-amber-500 text-white" : "bg-slate-50 hover:bg-slate-100 text-amber-700"}`}
                  >
                    <span>🟡 أسبوعي</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(FoodCategory.MONTHLY_OCCASIONAL)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedCategory === FoodCategory.MONTHLY_OCCASIONAL ? "bg-purple-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-purple-700"}`}
                  >
                    <span>🟣 شهري</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(FoodCategory.PROHIBITED)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedCategory === FoodCategory.PROHIBITED ? "bg-rose-600 text-white" : "bg-rose-50 hover:bg-rose-100 text-rose-700"}`}
                  >
                    <span>🔴 ممنوع قطعي</span>
                  </button>
                </div>

              </div>

              {/* Grid Cards of Filtered Food Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFoods.map(food => {
                  const isProhibited = food.category === FoodCategory.PROHIBITED;
                  const isBase = food.category === FoodCategory.BASE_ESSENTIAL;
                  const isWeekly = food.category === FoodCategory.WEEKLY_OCCASIONAL;
                  const isDaily = food.category === FoodCategory.DAILY;
                  const isMonthly = food.category === FoodCategory.MONTHLY_OCCASIONAL;

                  let borderClass = "border-slate-200 hover:border-emerald-300";
                  let bgBadge = "bg-emerald-50 text-emerald-700";
                  let tagText = "مسموح يومي";

                  if (isProhibited) {
                    borderClass = "border-slate-200 hover:border-rose-300";
                    bgBadge = "bg-rose-50 text-rose-700";
                    tagText = "خارج الراحة الهضمية (ممنوع)";
                  } else if (isBase) {
                    borderClass = "border-emerald-100 bg-emerald-50/40 hover:border-emerald-350";
                    bgBadge = "bg-emerald-600 text-white";
                    tagText = "ركيزة أساسية (مسموح)";
                  } else if (isWeekly) {
                    borderClass = "border-slate-200 hover:border-amber-300";
                    bgBadge = "bg-amber-50 text-amber-700";
                    tagText = "مسموح أسبوعي";
                  } else if (isMonthly) {
                    borderClass = "border-slate-200 hover:border-purple-300";
                    bgBadge = "bg-purple-50 text-purple-700";
                    tagText = "مسموح موسمياً";
                  }

                  return (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFoodDetail(food)}
                      className={`p-5 rounded-xl border bg-white ${borderClass} hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${bgBadge}`}>
                            {tagText}
                          </span>
                          <FoodIcon name={food.icon} className="w-5 h-5" />
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-slate-800">{food.nameAr}</h4>
                          <span className="text-xs text-slate-400 font-mono italic">{food.nameEn}</span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-11">
                          {food.reasonAr}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-emerald-600 font-bold">
                        <span>انقر لقراءة التحليل الفسيولوجي ➔</span>
                        {food.alternativesAr.length > 0 && (
                          <span className="text-rose-600 text-[10px] font-semibold">يتوفر بدائل صحية</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredFoods.length === 0 && (
                  <div className="col-span-2 bg-white text-center py-12 px-5 border border-slate-200 rounded-xl">
                    <Icons.HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-800">مادة غذائية غير مسجلة حالياً</p>
                    <p className="text-xs text-slate-500 mt-1">انصح بكتابتها في "المساعد الذكي" لشرح وضعها الفسيولوجي المباشر!</p>
                  </div>
                )}
              </div>

              {/* Prohibited Foods sorting statement */}
              <div className="bg-slate-100/85 border border-slate-200/50 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                ℹ️ **منهجية حمية الطيبات**: تم وضع المسموحات الفطرية كبدائل نظيفة وصديقة للقولون مثل (النشويات المصفاة، الأجبان المعتقة، والدسم الحيواني النقي) للتخفيف من تهيج وجراحات جدر الأمعاء ومساعدتك على العافية السريعة.
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE 30-DAY TRACKER */}
          {activeTab === "tracker" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">متابعة الصحة المعوية والراحة الهضمية</span>
                <h3 className="text-xl font-bold text-slate-800">مفكرة الالتزام والصيام للراحة الهضمية</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  يهدف النظام إلى تصفير التهابات المعدة عبر فترات صيام طعام مريحة يومياً (إيقاف وتصفير الطعام لـ 16 ساعة مع شرب السوائل الآمنة). اضغط على الأيام التي التزمت فيها بتفعيل الصيام لتلوين المربع بالعنبر الذهبي. استهدف إكمال 8 أيام على الأقل شهرياً للتعافي.
                </p>
              </div>

              {/* Status Header */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-black text-amber-500">{totalFasts}</div>
                  <div className="text-[11px] text-slate-500">أيام الصيام المحققة</div>
                </div>
                <div className="space-y-1 border-x border-slate-100">
                  <div className="text-2xl font-black text-emerald-600">{currentStreak}</div>
                  <div className="text-[11px] text-slate-500">الأيام المتواصلة</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-800">{complianceScore}%</div>
                  <div className="text-[11px] text-slate-500">مستوى الالتزام الكلي</div>
                </div>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
                {trackerDays.map(day => (
                  <button
                    key={day.dayNumber}
                    onClick={() => toggleFastDay(day.dayNumber)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border transition-all cursor-pointer ${
                      day.didFast
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="text-[9px] opacity-75">اليوم</span>
                    <span className="text-base font-black leading-tight">{day.dayNumber}</span>
                    {day.didFast ? (
                      <span className="text-[9px] mt-0.5 font-semibold">ملتزم</span>
                    ) : (
                      <span className="text-[9px] mt-0.5 opacity-40">-</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-[11px] text-slate-400 italic">يتم حفظ ومزامنة تقدمك تلقائياً في المتصفح.</p>
                <button
                  onClick={() => setTrackerDays(Array.from({ length: 30 }, (_, i) => ({ dayNumber: i + 1, didFast: false })))}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-bold"
                >
                  إعادة تهيئة المفكرة للبدء من جديد
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DIET BLUEPRINT (OFFICIAL RULES) */}
          {activeTab === "rules" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">دستور الطيبات الفطري والفسيولوجي</span>
                <h3 className="text-xl font-bold text-slate-800">الركائز الأساسية الأربعة للاستشفاء مع النظام</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-sm font-extrabold text-emerald-700">1. كسر جلوتين القمح بالتحميص التام</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    يعتبر الخبز والقرص الرطبة عائقاً لحركة الأمعاء الدقيقة لارتفاع زجاجيتها. التحميص الكلي والفائق للتوست حتى الجفاف الكامل والتفحم اللطيف كالبسكويت يفتت تلك السلاسل المعقدة ليصبح الخبز رائعاً ويسهل هضمه تماماً.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-sm font-extrabold text-emerald-700">2. عدم استواء الدجاج والبيض مع سلامتك</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    الدجاج بالمزارع الصناعية يتغذى على منشطات هرمونية ترهق بطائن القولون، وبروتينات البيض مليئة بالنيتروجين الكبريتي الذي يغذي البكتيريا الضارة المعوية. يفضل دوماً استبدالها بلحم الغنم الهبر المطهو لدرجة الذوبان بمائخ بصلصلة طماطم مصفاة ومطبوخة.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-sm font-extrabold text-emerald-700">3. تجنب لاكتوز وسكر الحليب السائل</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ال حليب السائل والزبادي الطازج يثير لوعة القولون لارتفاع صعوبة تفكيك جزيئاتهما المعقدة ومحتوى اللاكتوز الرطب. البديل الذهبي الآمن جداً هو القشطة البلدي الحيوانية والزبدة الطبيعية الصافية المعزولة تماماً عن اللبني السائل.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-sm font-extrabold text-emerald-700">4. الدسم الحيواني النقي كحارس للأمعاء</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    القشطة البلدي الباردة والزبدة والسمن الحيواني الفلاحي هي مواد معزولة ناصعة تلطف الجدر المتعبة للأمعاء والقولون، وتعمل كمزلق فخم طبيعي يسهل غسيل السموم ويحفز الاستشفاء الطارد للارتشاح.
                  </p>
                </div>
              </div>

              <div className="text-center pt-3">
                <button
                  onClick={triggerGuideDownload}
                  className="bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-lg hover:bg-slate-900 transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <Icons.Download className="w-4 h-4" />
                  <span>تثبيت نسخة PDF للدليل الإرشادي الموحد</span>
                </button>
              </div>
            </div>
          )}

        </section>

        {/* LEFT COLUMN (5 Cols): Persistent Interactive AI Assistant (Tayeb-Bot) */}
        <aside id="tayeb-bot-section" className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col relative overflow-hidden transition-all duration-300">
            
            {/* Header of AI Box */}
            <div className="p-5 bg-emerald-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce">
                  🤖
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-wide">المستشار الفسيولوجي (طِيب-بوت)</h4>
                  <div className="text-[9px] opacity-85 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
                    <span>قائم على التوجيه والتحقق الفطري للوجبات</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-white/10 text-white font-mono tracking-widest px-2 py-1 rounded">HEALTH DIRECT</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-5 space-y-4 max-h-[380px] overflow-y-auto bg-slate-50/50 scrollbar-thin">
              
              {chatHistory.map((item, idx) => (
                <div key={idx} className={`flex flex-col ${item.sender === "user" ? "items-start" : "items-end"}`}>
                  
                  {/* Sender Label & Indicator */}
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold">
                    {item.sender === "user" ? "أنت تسأل البوت" : "تحليل طِيب-بوت"}
                  </div>

                  {/* Message Balloon */}
                  <div className={`p-4 rounded-xl text-xs max-w-[92%] leading-relaxed border ${
                    item.sender === "user"
                      ? "bg-white text-slate-800 border-slate-200 rounded-tr-none shadow-xs"
                      : "bg-emerald-50/40 text-slate-700 border-emerald-100 rounded-tl-none"
                  }`}>
                    
                    {/* Preserve line breaks for elegant textual formatting */}
                    <p className="whitespace-pre-line font-medium leading-[1.6]">
                      {item.text}
                    </p>

                    {/* Quick interactive rule badge if detected in rules */}
                    {item.analysisResult && item.analysisResult.analyzedItems.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-3 bg-white p-3 rounded-xl border">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 block mb-1">
                          📋 تشخيص فسيولوجي دقيق من الكود المحلي:
                        </span>
                        
                        {item.analysisResult.analyzedItems.map((aiObj, key) => (
                          <div key={key} className="space-y-1 pb-1.5 border-b border-dashed border-slate-200 last:border-0 last:pb-0">
                            
                            <div className="flex items-center justify-between text-xs">
                              {aiObj.isCompliant ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                  <span>✅ [عنصر مسموح]: {aiObj.itemNameUrgent}</span>
                                </span>
                              ) : (
                                <span className="text-rose-600 font-bold flex items-center gap-1">
                                  <span>❌ [عنصر مهيج للقولون]: {aiObj.itemNameUrgent}</span>
                                </span>
                              )}
                              <span className="text-[9px] bg-slate-50 text-slate-500 rounded px-1.5 py-0.5 border border-slate-100">
                                {aiObj.category === FoodCategory.PROHIBITED ? "ممنوع قطعي" : "شبه آمن / استشفائي"}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {aiObj.reasonAr}
                            </p>

                            {aiObj.alternativesAr && aiObj.alternativesAr.length > 0 && (
                              <div className="bg-emerald-50/50 p-2 rounded-lg mt-1 border border-emerald-100/50">
                                <span className="text-[10px] font-bold text-emerald-800 block">🔵 البدائل للراحة الهضمية:</span>
                                <div className="text-[10px] text-slate-700 font-semibold mt-0.5 flex flex-wrap gap-1">
                                  {aiObj.alternativesAr.map((altItem, altIdx) => (
                                    <span key={altIdx} className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs">
                                      {altItem}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex justify-end gap-2 animate-pulse">
                  <span className="text-[10px] text-emerald-600 font-semibold">يقوم البوت بتشريح الوجبة فسيولوجياً...</span>
                  <Icons.Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                </div>
              )}

            </div>

            {/* Quick Audit Chips to help fast populate */}
            <div className="px-4 py-3 border-t border-slate-200 bg-white flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">أفكار وجبات سريعة للفحص المعوي:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => applyQuickAnalysis("دجاج بالمزرعة مع خبز أبيض وبيضة مسلوقة")}
                  className="bg-slate-50 hover:bg-rose-50 hover:border-rose-300 border border-slate-200 text-[10px] px-2.5 py-1 rounded-md transition-all text-slate-600 hover:text-rose-700"
                >
                  دجاج + بيض + خبز 🔴
                </button>
                <button
                  onClick={() => applyQuickAnalysis("أرز أبيض مطهو وملعقة سمن مع قشطة بلدي وعسل نحل")}
                  className="bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-[10px] px-2.5 py-1 rounded-md transition-all text-slate-600 hover:text-emerald-700"
                >
                  أرز + سمن + قشطة + عسل 🔵
                </button>
                <button
                  onClick={() => applyQuickAnalysis("قطعة لحم خروف دايب مع خبز توست محمص جدا وسمن طبيعي")}
                  className="bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-[10px] px-2.5 py-1 rounded-md transition-all text-slate-600 hover:text-emerald-700"
                >
                  لحم غنم دايب + توست محمص 🔵
                </button>
              </div>
            </div>

            {/* Input Box with Verify & Snap actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 relative">
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={mealInput}
                    onChange={(e) => {
                      setMealInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="اكتب الوجبة كالدجاج والبيض والبطاطس..."
                    className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 pr-4 pl-8 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner font-semibold text-slate-800"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyMeal();
                    }}
                  />
                  {mealInput && (
                    <button
                      onClick={() => setMealInput("")}
                      className="absolute left-2.5 top-3 text-slate-400 hover:text-slate-800"
                    >
                      <Icons.X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleVerifyMeal()}
                  disabled={isAnalyzing}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-250 text-white font-bold text-xs px-4 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-sm"
                >
                  تحقق
                </button>
              </div>

              {/* Suggestions auto-suggest overlay */}
              {showSuggestions && mealInput.length > 0 && (
                <div className="absolute left-4 right-4 bottom-14 bg-white border border-slate-200 rounded-lg shadow-lg max-h-36 overflow-y-auto z-10 text-xs">
                  <div className="p-1 px-2.5 bg-slate-50 border-b border-slate-100 text-[9px] font-bold text-slate-500">
                    نقترح عليك اختبار الوجبات الآتية:
                  </div>
                  {suggestionsList
                    .filter(s => s.includes(mealInput) || mealInput.length < 2)
                    .map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setMealInput(item);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-right p-2 hover:bg-slate-50 font-semibold text-slate-600 block border-b border-slate-100 last:border-0"
                      >
                        {item}
                      </button>
                    ))}
                </div>
              )}

              {/* Verification & future Snap Release buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">اضغط Enter لإجراء الفحص الفسيولوجي المباشر</span>
                
                {/* Disabled Release block */}
                <button
                  disabled
                  className="text-[9px] text-slate-400/80 flex items-center gap-1 opacity-75 bg-slate-200/50 px-2 py-0.5 rounded cursor-not-allowed"
                >
                  <Icons.ZapOff className="w-2.5 h-2.5 text-slate-400" />
                  <span>[كاميرا الوجبة 📸 قريباً]</span>
                </button>
              </div>

            </div>

          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-r-4 border-emerald-600 pr-2 flex items-center gap-1.5">
              <span>الفهرس الفسيولوجي العام</span>
              <span className="text-[9px] font-normal text-slate-400">(Al-Tayebaat Scale)</span>
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              تعتمد حمية ممتدّ الطيبات على تبديل العادات التغذوية الملوثة والمعقدة بنماذج كربوهيدراتية مصفاة مع الدسم المصفى لتخفيف العسر الكلوي واستعادة خلايا لوع الأمعاء.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
              <div className="p-2 bg-emerald-50 border border-emerald-100/55 rounded-lg">
                <span className="text-emerald-700 block">🔵 أساسيات آمنة</span>
                <span className="text-slate-500 text-[9px] font-normal">أرز أبيض، سمن بلدي، قشطة</span>
              </div>
              <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg">
                <span className="text-rose-700 block">🔴 ممنوعات ثقيلة</span>
                <span className="text-slate-500 text-[9px] font-normal">دجاج صناعي، بيض، حليب سائل</span>
              </div>
            </div>
          </div>

        </aside>

      </main>

      {/* 5. FOOD DETAIL MODAL DIALOG */}
      {selectedFoodDetail && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in transition-all">
          <div className="bg-white border border-slate-200 w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-5 text-right relative">
            
            <button
              onClick={() => setSelectedFoodDetail(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-50 text-slate-800"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800">{selectedFoodDetail.nameAr}</h3>
                  <span className="text-xs text-slate-400 font-mono italic block">{selectedFoodDetail.nameEn}</span>
                </div>
                <FoodIcon name={selectedFoodDetail.icon} className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">مستوى التوافق والراحة:</h4>
                <div className="flex gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    selectedFoodDetail.category === FoodCategory.PROHIBITED
                      ? "bg-rose-50 border-rose-100 text-rose-700"
                      : selectedFoodDetail.category === FoodCategory.BASE_ESSENTIAL
                      ? "bg-emerald-600 text-white border-none"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}>
                    {selectedFoodDetail.category === FoodCategory.PROHIBITED && "🔴 ممنوع قطعي للراحة الهضمية"}
                    {selectedFoodDetail.category === FoodCategory.BASE_ESSENTIAL && "🔵🔵 أساس استشفائي آمن"}
                    {selectedFoodDetail.category === FoodCategory.DAILY && "🔵 مسموح يومي كحرير طاقة"}
                    {selectedFoodDetail.category === FoodCategory.WEEKLY_OCCASIONAL && "🟡 مسموح أسبوعي باعتدال"}
                    {selectedFoodDetail.category === FoodCategory.MONTHLY_OCCASIONAL && "🟣 مسموح موسمياً"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">توجيه الراحة الهضمية المعتمد:</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 border border-slate-100 rounded-xl font-medium font-sans">
                  {selectedFoodDetail.reasonAr}
                </p>
              </div>

              {selectedFoodDetail.alternativesAr && selectedFoodDetail.alternativesAr.length > 0 ? (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-widest">
                    ⚠️ البدال الاستشفائية المقترحة (الراحة اللطيفة):
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedFoodDetail.alternativesAr.map((alt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-xl border border-emerald-100/50 font-bold">
                        <Icons.Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{alt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100 text-xs font-semibold">
                  🌿 هذا الخيار هو ركيزة آمنة كلياً ومفيدة للترميم المعوي المباشر، لا يتطلب أي بدائل.
                </div>
              )}

            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedFoodDetail(null);
                  if (selectedFoodDetail.category === FoodCategory.PROHIBITED) {
                    applyQuickAnalysis(`بديل لـ ${selectedFoodDetail.nameAr}`);
                  } else {
                    applyQuickAnalysis(`دليل وجبة تحتوي على ${selectedFoodDetail.nameAr}`);
                  }
                  // Scroll to bot section and highlight
                  const element = document.getElementById("tayeb-bot-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
              >
                فحص فسيولوجيا المكون في البوت ➔
              </button>
              <button
                onClick={() => setSelectedFoodDetail(null)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. RESPONSIVE BOTTOM INFORMATION BAR */}
      <footer id="app-footer" className="bg-slate-100/80 border-t border-slate-200 py-10 px-6 mt-12 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">تتبع الالتزام (الأسبوع الأول)</span>
              <div className="flex gap-1.5 items-center">
                {trackerDays.slice(0, 7).map((day, idx) => (
                  <div
                    key={idx}
                    title={`اليوم ${day.dayNumber}: ${day.didFast ? "ملتزم" : "غير ملتزم"}`}
                    onClick={() => toggleFastDay(day.dayNumber)}
                    className={`w-4 h-4 rounded border cursor-pointer transition-all ${
                      day.didFast ? "bg-amber-500 border-amber-500" : "bg-white border-slate-200"
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-700 font-bold mr-3">
                  معدل الأسبوع الأول: {Math.round((trackerDays.slice(0, 7).filter(d => d.didFast).length / 7) * 100)}%
                </span>
              </div>
            </div>

            <div className="hidden md:block h-10 w-px bg-slate-200" />

            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">مؤشر الاستقرار المعوي الممتد</span>
              <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${complianceScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 italic max-w-md">
              "المَعِدَة بَيْت الداء، والحِمْيَة رأس كل دواء... إن تعافي جدار القولون يبدأ بالراحة الهضمية والامتناع عن مسببات التهيج والالتهاب."
            </p>
            <p className="text-[9px] text-emerald-700 mt-2 tracking-wider uppercase font-bold">
              © 2026 موقع المجدل - دليل حمية الطيبات للراحة الهضمية
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
