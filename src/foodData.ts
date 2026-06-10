/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodCategory, FoodItem } from "./types";

export const AL_TAYEBAAT_FOODS: FoodItem[] = [
  // 🔵🔵 (أساسيات الاستشفاء / Base Essentials)
  {
    id: "rice",
    nameAr: "الأرز الأبيض",
    nameEn: "White Rice",
    category: FoodCategory.BASE_ESSENTIAL,
    reasonAr: "النشويات الأكثر أماناً وهضماً على الجدار المعوي المعافى، تدعم ترميم الغشاء المخاطي ونشاط البكتيريا النافعة بسلام.",
    reasonEn: "The safest and most digestible source of carbohydrates, supporting mucosal healing and healthy flora.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Wheat"
  },
  {
    id: "potatoes",
    nameAr: "البطاطس المطهية",
    nameEn: "Cooked Potatoes",
    category: FoodCategory.BASE_ESSENTIAL,
    reasonAr: "نشويات بسيطة مهدئة لجدار المعدة والقولون، يفضل سلقها أو طبخها جيداً لسهولة الامتصاص.",
    reasonEn: "Simple, highly-soothing starchy food for gastric and colonic linings. Best boiled or well-cooked.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Apple"
  },
  {
    id: "toasted_toast",
    nameAr: "الخبز التوست المحمص جيداً جداً",
    nameEn: "Well-Toasted White Toast",
    category: FoodCategory.BASE_ESSENTIAL,
    reasonAr: "التحميص الشديد حتى الجفاف التام يدمر سلاسل الجلوتين المعقدة ويحولها إلى سكريات سهلة، مزيلاً الرطوبة المعوية.",
    reasonEn: "In-depth toasting transforms complex gluten chains into easily digestible micro-sugars, eliminating gut dampness.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Flame"
  },
  {
    id: "clotted_cream",
    nameAr: "القشطة الحيوانية الطبيعية",
    nameEn: "Natural Clotted Cream (Qishta)",
    category: FoodCategory.BASE_ESSENTIAL,
    reasonAr: "دهون حيوانية نقية خالية من بروتين الحليب المهيج، تلعب دوراً فائقاً في تليين وتغطية وترميم أنسجة الهضم المعذبة.",
    reasonEn: "Pure animal fat devoid of protein irritants; highly effective in soothing, lining, and repairing GI tracts.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Milk"
  },
  {
    id: "pure_butter",
    nameAr: "الزبدة الطبيعية الباردة",
    nameEn: "Natural Pure Butter",
    category: FoodCategory.BASE_ESSENTIAL,
    reasonAr: "غنية بحمض البوتيريك (Butyrate) المغذي لقولونك ومصلح جدرانه الرقيقة من الارتشاح.",
    reasonEn: "Rich in butyrate, which directly nourishes colonocytes and seals the intestinal lining against hyperpermeability.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Cookie"
  },
  {
    id: "pure_honey",
    nameAr: "عسل النحل الصافي الطبيعي",
    nameEn: "Pure Natural Honey",
    category: FoodCategory.BASE_ESSENTIAL,
    reasonAr: "غذاء علاجي غني بالأنزيمات المعززة للهضم والمطهرة للأمعاء دون أي مجهود هضمي.",
    reasonEn: "Therapeutic and enzymatic food that cleanses the stomach and triggers digestive ease with zero digestive cost.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Sparkles"
  },

  // 🔵 (مسموح يومي / Daily)
  {
    id: "cocoa_hazelnut",
    nameAr: "شوكولاتة البندق والكاكاو (خالية من جوامد الحليب)",
    nameEn: "Cocoa Hazelnut Spread (Milk-Free)",
    category: FoodCategory.DAILY,
    reasonAr: "مسموحة باعتدال للتحلية والسرور وتنشيط حركة الأمعاء، شريطة خلوها الكامل من مسحوق الحليب والبودرة الصناعية.",
    reasonEn: "Allowed in moderation for energy and digestion stimulation, provided it is 100% free of milk solids.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Heart"
  },
  {
    id: "olive_oil",
    nameAr: "زيت الزيتون البكر النقي",
    nameEn: "Extra Virgin Olive Oil",
    category: FoodCategory.DAILY,
    reasonAr: "مطهر معوي غني بالأحماض الأحادية غير المشبعة المفيدة للصفراء والكبد، يفضل تناوله نيئاً.",
    reasonEn: "Monounsaturated oil that supports liver, bile, and intestinal tracking. Best consumed cold.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Droplets"
  },
  {
    id: "corn_oil",
    nameAr: "زيت الذرة النقي للطهي",
    nameEn: "Pure Corn Cooking Oil",
    category: FoodCategory.DAILY,
    reasonAr: "زيت طهي خفيف ومستقر حرارياً، مسموح به لإعداد الوجبات البسيطة دون إثقال للجهاز الهضمي.",
    reasonEn: "Light and thermally stable cooking oil, perfect for cooking everyday meals without strain.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "FlameKindling"
  },

  // 🟡 (مسموح أسبوعي / Weekly/Occasional)
  {
    id: "red_meat",
    nameAr: "اللحوم الحمراء (المطبوخة نضجاً تاماً)",
    nameEn: "Well-Cooked Red Meat / Lamb",
    category: FoodCategory.WEEKLY_OCCASIONAL,
    reasonAr: "مصدر ممتاز للبروتينات والحديد، يجب أن تُطهى لدرجة النضج التام (الذوبان) لتفكيك ألياف الكولاجين تماماً وتسهيل هضمها.",
    reasonEn: "High in zinc and iron. Must be slow-cooked to an ultra-tender state to break down and melt animal proteins.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "ChevronsDown"
  },
  {
    id: "gouda_cheese",
    nameAr: "الأجبان الصفراء المعتقة المطبوخة (جودا، فيلمنكو)",
    nameEn: "Aged Gouda / Flamingo Hard Cheese",
    category: FoodCategory.WEEKLY_OCCASIONAL,
    reasonAr: "أجبان جافة وصلبة نضجت طويلاً حتى تلاشت معظم مادة اللاكتوز وسكر الحليب، مما يجعل احتمالها الهضمي دورياً رائعاً.",
    reasonEn: "Hard, long-aged cheeses that have undergone intensive fermentation, rendering them extremely low in lactose.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Layers"
  },
  {
    id: "homemade_pickles",
    nameAr: "المخللات المنزلية التقليدية",
    nameEn: "Traditional Home-made Pickles",
    category: FoodCategory.WEEKLY_OCCASIONAL,
    reasonAr: "غنية ببكتيريا حمض اللاكتيك والبروبايوتك الطبيعي لتخصيب فلورا الأمعاء، تؤخذ باعتدال أسبوعياً.",
    reasonEn: "Traditional fermented food rich in natural lactic acid probiotics to replenish gut flora. Occasional use.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "GlassWater"
  },

  // 🟣 (مسموح شهري/موسمي / Monthly/Occasional)
  {
    id: "okra",
    nameAr: "البامية المطهية جيداً جداً",
    nameEn: "Slow-Cooked Okra",
    category: FoodCategory.MONTHLY_OCCASIONAL,
    reasonAr: "تحتوي على مادة مخاطية هلامية ومطهرة للجدران، لكن كثرتها وتكرارها يربك المعدة، ويسمح بها دورياً متباعداً فقط.",
    reasonEn: "Contains unique mucilaginous fibers that soothe the gut, but high frequency can overwork the colon. Seasonally appropriate.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Filter"
  },
  {
    id: "fermented_fish",
    nameAr: "الأسماك المملحة والمخمرة (الفسيخ الطبيعي)",
    nameEn: "Naturally Fermented Salted Fish",
    category: FoodCategory.MONTHLY_OCCASIONAL,
    reasonAr: "منتج تخميري فائق الأنزيمية، يعاد شحن الجهاز الهضمي والـ Microbiome به، ويؤكل بشكل نادر لضمان الحماية المعوية.",
    reasonEn: "Feseekh represents an enzymatically active seasonal reset. Highly nourishing for the biome, consumed rarely.",
    alternativesAr: [],
    alternativesEn: [],
    icon: "Fish"
  },

  // 🔴 (الممنوعات القطعية لراحة القناة الهضمية / Prohibited)
  {
    id: "chicken",
    nameAr: "الدجاج والطيور الداجنة",
    nameEn: "Chicken & Poultry",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. بروتينات الدجاج الحديث والمربى صناعياً صعبة الهرم ومحملة بمدخلات تجهد الأمعاء.",
    reasonEn: "This item is currently outside the digestive comfort range. Modern industrially-raised poultry contains heavy proteins and feed residues that stress weak GI linings.",
    alternativesAr: ["اللحم الأحمر الغنمي المطبوخ ببطء وبشدة", "الأجبان الصفراء المعتقة مثل جودا"],
    alternativesEn: ["Ultra-soft cooked whole lamb", "Aged hard cheeses like Gouda"],
    icon: "Skull"
  },
  {
    id: "eggs",
    nameAr: "البيض بكل أنواعه",
    nameEn: "Eggs (All types)",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. يحتوي البيض على مركب كبريتي كثيف وبروتينات فوسفاتية تعطل وظيفة الأمعاء الهشة وتؤدي للارتشاح وغازات كريهة.",
    reasonEn: "This item is currently outside the digestive comfort range. Rich in heavy sulfur-based albumin and phosphorus proteins which cause high fermentation, bloating, and exacerbate leaky gut.",
    alternativesAr: ["القشطة الحيوانية البلدي مع العسل على توست محمص جيداً", "الأجبان المطبوخة المعتقة جودا"],
    alternativesEn: ["Clotted cream (Qishta) with natural honey on well-toasted white toast", "Aged Gouda cheese"],
    icon: "Ban"
  },
  {
    id: "milk",
    nameAr: "الحليب السائل واللبن",
    nameEn: "Liquid Milk / Dairy Beverages",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. سكر الحليب (اللاكتوز) يحتاج لجهد إنزيمي عالٍ مع كازين الحليب السائل مما يسبب تخمراً غازياً رهيباً وعسر هضم فوري.",
    reasonEn: "This item is currently outside the digestive comfort range. Liquid milk and beverages contain high concentrations of unfermented lactose and heavy casein which cause instant colonic distress and immediate bloating.",
    alternativesAr: ["القشطة البلدي الطبيعية", "الزبدة البيضاء الصافية"],
    alternativesEn: ["Pure organic clotted cream", "Pure natural clarified butter"],
    icon: "Bean"
  },
  {
    id: "yogurt",
    nameAr: "الزبادي، اللبنة، الرائب والشوربة الحامضة",
    nameEn: "Yogurt, Labneh, & Sour Dairy Products",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. تخثر اللبن والحموضة العالية في الرائب والزبادي تعيق الهضم الطبيعي وتزيد تشنج القولون وجفاف الأمعاء.",
    reasonEn: "This item is currently outside the digestive comfort range. High acidity and processed soft dairy cultures often stimulate gastric spasm and hinder intestinal rest cycles.",
    alternativesAr: ["القشطة البلدي كبديل دهني أساسي"],
    alternativesEn: ["Natural rich clotted cream (Qishta)"],
    icon: "XCircle"
  },
  {
    id: "tomatoes",
    nameAr: "الطماطم النيئة، قشورها وبذورها",
    nameEn: "Raw Tomatoes (Skins & Seeds)",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. قشور وبذور الطماطم تذخر بالليكتينات (Lectins) المقاومة للهضم، والسولانين الذي يجرح القولون مسبباً الارتشاح.",
    reasonEn: "This item is currently outside the digestive comfort range. Tomato skins and seeds are rich in harsh lectins and solanine which directly damage delicate mucosal linings and provoke hyperpermeability.",
    alternativesAr: ["البطاطس المطهية المهروسة", "الخيار المقشر دون البذور باعتدال"],
    alternativesEn: ["Creamy mashed potatoes", "Peeled cucumber without seeds in low moderation"],
    icon: "ShieldAlert"
  },
  {
    id: "legumes",
    nameAr: "البقوليات (العدس، الفول، الحمص، الفاصوليا، اللوبيا)",
    nameEn: "Legumes (Lentils, Beans, Chickpeas)",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. معبأة بحمض الفيتيك (Phytic Acid) ومثبطات الإنزيمات الحادة التي تخنق الهضم وتخلق غازات ضاغطة على مجرى النفس.",
    reasonEn: "This item is currently outside the digestive comfort range. Packed with phytic acid, saponins, and heavy enzyme inhibitors that completely lock digestive tracking and induce heavy painful gas.",
    alternativesAr: ["الأرز الأبيض المطبوخ ببطء وهدوء", "البطاطس الدافئة المسلوقة"],
    alternativesEn: ["Slow-cooked plain white rice", "Warm boiled simple potatoes"],
    icon: "Activity"
  },
  {
    id: "nuts",
    nameAr: "المكسرات النيئة والمحمصة (الفستق، اللوز، الكاجو، السمسم)",
    nameEn: "Raw & Roasted Nuts",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. قساوة وبنية المكسرات غنية ومقاومة لإنزيمات المعدة، وتزيد من العبء الميكانيكي المعوي.",
    reasonEn: "This item is currently outside the digestive comfort range. Nuts contain highly stubborn plant protectors and anti-nutrients making them mechanically and chemically taxing to process.",
    alternativesAr: ["زيت الزيتون البكر للصحة الدهنية", "الزبدة الطبيعية الباردة"],
    alternativesEn: ["Extra virgin olive oil for lipid health", "Pure butter in moderation"],
    icon: "ZapOff"
  },
  {
    id: "normal_bread",
    nameAr: "الخبز العادي، الفينو الأبيض، الخبز البلدي",
    nameEn: "Untoasted White Bread / Flatbread",
    category: FoodCategory.PROHIBITED,
    reasonAr: "هذا العنصر خارج نطاق الراحة الهضمية حالياً. الجلوتين الرطب والخميرة المعقدة تسبب تشكيل معجون ملتصق بالزغابات المعوية، مما يسبب خمولاً وعجزاً في الامتصاص.",
    reasonEn: "This item is currently outside the digestive comfort range. Untoasted gluten forms a glue-like pasty residue on microvilli, causing immediate intestinal sluggishness and malabsorption.",
    alternativesAr: ["التوست الأبيض المحمص جيداً جداً حتى يتحول لبسكويت مقرمش"],
    alternativesEn: ["Slices of white toast baked in the oven until perfectly crispy and dry like a cracker"],
    icon: "TrendingDown"
  }
];

export function lookupFood(name: string): FoodItem | undefined {
  const normalized = name.toLowerCase().trim();
  return AL_TAYEBAAT_FOODS.find(item => {
    return (
      item.nameEn.toLowerCase().includes(normalized) ||
      normalized.includes(item.nameEn.toLowerCase()) ||
      item.nameAr.includes(normalized) ||
      normalized.includes(item.nameAr) ||
      // Simple variations in Arabic
      (item.id === "chicken" && (normalized.includes("دجاج") || normalized.includes("فراخ") || normalized.includes("طيور"))) ||
      (item.id === "eggs" && (normalized.includes("بيض") || normalized.includes("بيضه") || normalized.includes("بيضة"))) ||
      (item.id === "milk" && (normalized.includes("حليب") || normalized.includes("لبن") || normalized.includes("بديل حليب"))) ||
      (item.id === "yogurt" && (normalized.includes("زبادي") || normalized.includes("رائب") || normalized.includes("لبنة") || normalized.includes("لبنه"))) ||
      (item.id === "tomatoes" && (normalized.includes("طماطم") || normalized.includes("بندورة") || normalized.includes("صلصة"))) ||
      (item.id === "legumes" && (normalized.includes("عدس") || normalized.includes("فول") || normalized.includes("حمص") || normalized.includes("فاصوليا") || normalized.includes("لوبيا") || normalized.includes("بقول"))) ||
      (item.id === "nuts" && (normalized.includes("مكسرات") || normalized.includes("فستق") || normalized.includes("لوز") || normalized.includes("كاجو") || normalized.includes("سمسم"))) ||
      (item.id === "normal_bread" && (normalized.includes("خبز") || normalized.includes("عيش") || normalized.includes("فينو") || normalized.includes("بلدي"))) ||
      (item.id === "rice" && (normalized.includes("أرز") || normalized.includes("ارز") || normalized.includes("رز"))) ||
      (item.id === "potatoes" && (normalized.includes("بطاطس") || normalized.includes("بطاطه") || normalized.includes("بطاطا"))) ||
      (item.id === "toasted_toast" && (normalized.includes("توست") || normalized.includes("محمص"))) ||
      (item.id === "clotted_cream" && (normalized.includes("قشطة") || normalized.includes("قشطه"))) ||
      (item.id === "pure_butter" && (normalized.includes("زبدة") || normalized.includes("زبده"))) ||
      (item.id === "pure_honey" && (normalized.includes("عسل") || normalized.includes("عسل نحل")))
    );
  });
}
