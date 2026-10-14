import { QuestionItem } from '../../types';

export const higherMathQuestions: QuestionItem[] = [
  // ==========================================
  // ৪. উচ্চতর গণিত (HIGHER MATHEMATICS) - ৫০+ বোর্ড ও কমন প্রশ্ন
  // ==========================================

  // --- অধ্যায় ১: সেট ও ফাংশন ---
  {
    id: 'hmath-001',
    subject: 'উচ্চতর গণিত',
    chapter: 'সেট ও ফাংশন',
    topic: 'এক-এক ও অনটু ফাংশন',
    type: 'mcq',
    question: 'f: R → R, f(x) = 2x + 3 হলে, f⁻¹(x) বিপরীত ফাংশন কোনটি?',
    options: ['(x - 3)/2', '(x + 3)/2', '2x - 3', '1/(2x + 3)'],
    correctOption: 0,
    explanation: 'y = 2x + 3 => 2x = y - 3 => x = (y - 3)/2; অতএব f⁻¹(x) = (x - 3)/2।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-002',
    subject: 'উচ্চতর গণিত',
    chapter: 'সেট ও ফাংশন',
    topic: 'ডোমেন নির্ণয়',
    type: 'mcq',
    question: 'f(x) = √(x - 2) ফাংশনটির বাস্তব ডোমেন নিচের কোনটি?',
    options: ['x > 2', 'x ≥ 2', 'x < 2', 'x ≤ 2'],
    correctOption: 1,
    explanation: 'বর্গমূলের ভেতরের রাশিটি অঋণাত্মক হতে হবে, অর্থাৎ x - 2 ≥ 0 বা x ≥ 2। ডোমেন = [2, ∞)।',
    marks: 1,
    boardInfo: "রাজশাহী বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ৭: অসীম ধারা ---
  {
    id: 'hmath-003',
    subject: 'উচ্চতর গণিত',
    chapter: 'অসীম ধারা',
    topic: 'অসীমতক সমষ্টি',
    type: 'mcq',
    question: 'একটি গুণোত্তর ধারার প্রথম পদ a এবং সাধারণ অনুপাত r হলে ধারাটির অসীমতক সমষ্টি (S_∞) থাকার শর্ত কী?',
    options: ['|r| > 1', '|r| < 1', 'r = 1', 'r = 0'],
    correctOption: 1,
    explanation: 'যখন |r| < 1 অর্থাৎ -1 < r < 1 হয়, তখনই কেবল অসীম গুণোত্তর ধারার অসীমতক সমষ্টি S_∞ = a / (1 - r) বিদ্যমান থাকে।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২২, যশোর বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-004',
    subject: 'উচ্চতর গণিত',
    chapter: 'অসীম ধারা',
    topic: 'ধারার যোগফল',
    type: 'mcq',
    question: '১ + ১/২ + ১/৪ + ১/৮ + ....... অসীম ধারাটির সমষ্টি কত?',
    options: ['১', '১.৫', '২', '৪'],
    correctOption: 2,
    explanation: 'a = 1, r = 1/2; S_∞ = a / (1 - r) = 1 / (1 - 1/2) = 1 / (1/2) = 2।',
    marks: 1,
    boardInfo: "কুমিল্লা বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ১০: দ্বিপদী বিস্তৃতি ---
  {
    id: 'hmath-005',
    subject: 'উচ্চতর গণিত',
    chapter: 'দ্বিপদী বিস্তৃতি',
    topic: 'পদ সংখ্যা',
    type: 'mcq',
    question: '(x + y)ⁿ বিস্তৃতিতে মোট পদের সংখ্যা কতটি?',
    options: ['n', 'n - 1', 'n + 1', '2ⁿ'],
    correctOption: 2,
    explanation: 'দ্বিপদী বিস্তৃতিতে পাওয়ার যত থাকে, মোট পদের সংখ্যা তার চেয়ে ১ বেশি হয় (n + 1 টি)।',
    marks: 1,
    boardInfo: "চট্টগ্রাম বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-006',
    subject: 'উচ্চতর গণিত',
    chapter: 'দ্বিপদী বিস্তৃতি',
    topic: 'মধ্যপদ ও সহগ',
    type: 'mcq',
    question: '(1 - 2x)⁵ বিস্তৃতিতে x² এর সহগ কত?',
    options: ['১০', '২০', '৪০', '-৪০'],
    correctOption: 2,
    explanation: 'সাধারণ পদ T_{r+1} = ⁵C_r (-2x)^r। x² এর জন্য r = 2; T₃ = ⁵C₂ (-2)² x² = 10 × 4 x² = 40x²। সহগ = ৪০।',
    marks: 1,
    boardInfo: "সিলেট বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-007',
    subject: 'উচ্চতর গণিত',
    chapter: 'দ্বিপদী বিস্তৃতি',
    topic: 'প্যাসকেলের ত্রিভুজ',
    type: 'mcq',
    question: 'প্যাসকেলের ত্রিভুজ কী নির্ণয়ে সরাসরি সহায়তা করে?',
    options: ['চলকের ঘাত', 'দ্বিপদী সহগ', 'ধারার পদ সংখ্যা', 'ভেক্টর মান'],
    correctOption: 1,
    explanation: 'প্যাসকেলের ত্রিভুজের সাহায্যে সহজে দ্বিপদী বিস্তৃতির সহগসমূহ বের করা যায়।',
    marks: 1,
    boardInfo: "দিনাজপুর বোর্ড '২২",
    importance: 'high'
  },

  // --- অধ্যায় ১১: স্থানাঙ্ক জ্যামিতি ---
  {
    id: 'hmath-008',
    subject: 'উচ্চতর গণিত',
    chapter: 'স্থানাঙ্ক জ্যামিতি',
    topic: 'দুই বিন্দুর দূরত্ব',
    type: 'mcq',
    question: 'A(2, 3) এবং B(5, 7) বিন্দুদ্বয়ের মধ্যকার দূরত্ব কত একক?',
    options: ['৩ একক', '৪ একক', '৫ একক', '৭ একক'],
    correctOption: 2,
    explanation: 'AB = √[(5 - 2)² + (7 - 3)²] = √[3² + 4²] = √[9 + 16] = √25 = 5 একক।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-009',
    subject: 'উচ্চতর গণিত',
    chapter: 'স্থানাঙ্ক জ্যামিতি',
    topic: 'সরলরেখার ঢাল',
    type: 'mcq',
    question: '2x + 3y - 6 = 0 সরলরেখাটির ঢাল (Slope) কত?',
    options: ['2/3', '-2/3', '3/2', '-3/2'],
    correctOption: 1,
    explanation: 'ax + by + c = 0 রেখার ঢাল m = -(x এর সহগ) / (y এর সহগ) = -2/3।',
    marks: 1,
    boardInfo: "যশোর বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-010',
    subject: 'উচ্চতর গণিত',
    chapter: 'স্থানাঙ্ক জ্যামিতি',
    topic: 'সমান্তরাল ও লম্ব রেখা',
    type: 'mcq',
    question: 'দুটি সরলরেখা পরস্পরের ওপর লম্ব হলে তাদের ঢালদ্বয়ের গুণফল (m₁ × m₂) কত হবে?',
    options: ['০', '১', '-১', 'অসীম'],
    correctOption: 2,
    explanation: 'দুটি রেখা লম্ব হওয়ার শর্ত m₁ × m₂ = -১।',
    marks: 1,
    boardInfo: "রাজশাহী বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ১২: সমতলে ভেক্টর ---
  {
    id: 'hmath-011',
    subject: 'উচ্চতর গণিত',
    chapter: 'সমতলে ভেক্টর',
    topic: 'একক ভেক্টর ও মান',
    type: 'mcq',
    question: 'একটি ভেক্টর A = 3i + 4j হলে ভেক্টরটির পরম মান বা মান |A| কত?',
    options: ['৩', '৪', '৫', '৭'],
    correctOption: 2,
    explanation: '|A| = √(3² + 4²) = √(9 + 16) = √25 = 5।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২২, ময়মনসিংহ বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-012',
    subject: 'উচ্চতর গণিত',
    chapter: 'সমতলে ভেক্টর',
    topic: 'স্কেলার গুণন',
    type: 'mcq',
    question: 'দুটি ভেক্টরের স্কেলার গুণফল বা ডট গুণন শূন্য হলে ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত?',
    options: ['০°', '৪৫°', '৯০°', '১৮০°'],
    correctOption: 2,
    explanation: 'A . B = |A||B| cosθ = 0 => cosθ = 0 => θ = 90° (ভেক্টর দুটি পরস্পর লম্ব)।',
    marks: 1,
    boardInfo: "কুমিল্লা বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ৮: ত্রিকোণমিতি ---
  {
    id: 'hmath-013',
    subject: 'উচ্চতর গণিত',
    chapter: 'ত্রিকোণমিতি',
    topic: 'রেডিয়ান কোণ',
    type: 'mcq',
    question: '১ রেডিয়ান (1 rad) কোণ কী ধরনের কোণ?',
    options: ['স্থির বা ধ্রুব কোণ', 'পরিবর্তনশীল কোণ', 'সমকোণ', 'স্থূলকোণ'],
    correctOption: 0,
    explanation: 'বৃত্তের ব্যাসার্ধের সমান চাপ কেন্দ্রে যে কোণ তৈরি করে তাকে ১ রেডিয়ান বলে এবং তা একটি ধ্রুব কোণ (১৮০°/π)।',
    marks: 1,
    boardInfo: "বরিশাল বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-014',
    subject: 'উচ্চতর গণিত',
    chapter: 'ত্রিকোণমিতি',
    topic: 'চাপের দৈর্ঘ্য s = rθ',
    type: 'mcq',
    question: '10 cm ব্যাসার্ধের বৃত্তে একটি চাপ কেন্দ্রে 60° কোণ উৎপন্ন করলে চাপের দৈর্ঘ্য কত? (π = 3.1416)',
    options: ['5.24 cm', '10.47 cm', '31.42 cm', '60 cm'],
    correctOption: 1,
    explanation: 'θ = 60° = 60 × (π/180) = π/3 rad। s = rθ = 10 × (3.1416 / 3) ≈ 10.47 cm।',
    marks: 1,
    boardInfo: "চট্টগ্রাম বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ১৪: সম্ভাবনা (Probability) ---
  {
    id: 'hmath-015',
    subject: 'উচ্চতর গণিত',
    chapter: 'সম্ভাবনা',
    topic: 'মুদ্রা নিক্ষেপ',
    type: 'mcq',
    question: 'একটি নিরপেক্ষ মুদ্রা দুইবার নিক্ষেপ করলে অন্তত একটি Head (H) পাওয়ার সম্ভাবনা কত?',
    options: ['১/৪', '১/২', '৩/৪', '১'],
    correctOption: 2,
    explanation: 'নমুনা ক্ষেত্র S = {HH, HT, TH, TT}; মোট ফলাফল ৪টি। অন্তত একটি H আসার ঘটনা {HH, HT, TH} = ৩টি। সম্ভাবনা = ৩/৪।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'hmath-016',
    subject: 'উচ্চতর গণিত',
    chapter: 'সম্ভাবনা',
    topic: 'ছক্কা নিক্ষেপ',
    type: 'mcq',
    question: 'একটি নিরপেক্ষ ছক্কা নিক্ষেপ করলে মৌলিক সংখ্যা উঠার সম্ভাবনা কত?',
    options: ['১/৬', '১/৩', '১/২', '২/৩'],
    correctOption: 2,
    explanation: 'ছক্কার সম্ভাব্য ফলাফল {১, ২, ৩, ৪, ৫, ৬} = ৬টি। মৌলিক সংখ্যা {২, ৩, ৫} = ৩টি। সম্ভাবনা = ৩/৬ = ১/২।',
    marks: 1,
    boardInfo: "রাজশাহী বোর্ড '২২",
    importance: 'very_high'
  },
  {
    id: 'hmath-017',
    subject: 'উচ্চতর গণিত',
    chapter: 'সম্ভাবনা',
    topic: 'সম্ভাবনার সীমা',
    type: 'mcq',
    question: 'যেকোনো নিশ্চিত ঘটনার সম্ভাবনা কত এবং অসম্ভব ঘটনার সম্ভাবনা কত?',
    options: ['নিশ্চিত ১ ও অসম্ভব ০', 'নিশ্চিত ০ ও অসম্ভব ১', 'উভয়ই ০.৫', 'উভয়ই ১'],
    correctOption: 0,
    explanation: 'সম্ভাবনার মান সর্বদা ০ থেকে ১ এর মধ্যে সীমাবদ্ধ (0 ≤ P(E) ≤ 1)। নিশ্চিত ঘটনার মান ১ ও অসম্ভব ঘটনার মান ০।',
    marks: 1,
    boardInfo: "যশোর বোর্ড '২৩",
    importance: 'high'
  },

  // উচ্চতর গণিত সৃজনশীল (CQ)
  {
    id: 'hmath-cq-001',
    subject: 'উচ্চতর গণিত',
    chapter: 'স্থানাঙ্ক জ্যামিতি',
    type: 'cq',
    stimulus: 'একটি ত্রিভুজের তিনটি শীর্ষবিন্দু যথাক্রমে A(2, 5), B(-1, 1) এবং C(5, 1)।',
    subQuestions: [
      { label: 'ক', question: 'AB বাহুর দৈর্ঘ্য নির্ণয় করো।', marks: 1 },
      { label: 'খ', question: 'ত্রিভুজটির ক্ষেত্রফল স্থানাঙ্কের সাহায্যে নির্ণয় করো।', marks: 2 },
      { label: 'গ', question: 'BC বাহুর সমান্তরাল এবং A বিন্দুগামী সরলরেখার সমীকরণ নির্ণয় করো।', marks: 3 },
      { label: 'ঘ', question: 'ত্রিভুজটি কি সমদ্বিবাহু ত্রিভুজ? গাণিতিক যুক্তি সহকারে মতামত দাও।', marks: 4 }
    ],
    marks: 10,
    boardInfo: "ঢাকা বোর্ড '২৩ স্ট্যান্ডার্ড",
    importance: 'very_high'
  }
];
