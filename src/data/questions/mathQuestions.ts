import { QuestionItem } from '../../types';

export const mathQuestions: QuestionItem[] = [
  // ==========================================
  // ৩. সাধারণ গণিত (GENERAL MATHEMATICS) - ৫০+ বোর্ড ও কমন প্রশ্ন
  // ==========================================

  // --- অধ্যায় ১: বাস্তব সংখ্যা ---
  {
    id: 'math-001',
    subject: 'সাধারণ গণিত',
    chapter: 'বাস্তব সংখ্যা',
    topic: 'মূলদ ও অমূলদ সংখ্যা',
    type: 'mcq',
    question: 'নিচের কোনটি অমূলদ সংখ্যা?',
    options: ['√৯', '√১৬', '√৩', '০.২৫'],
    correctOption: 2,
    explanation: 'পূর্ণবর্গ নয় এমন যেকোনো স্বাভাবিক সংখ্যার বর্গমূল একটি অমূলদ সংখ্যা। √৩ একটি অমূলদ সংখ্যা।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-002',
    subject: 'সাধারণ গণিত',
    chapter: 'বাস্তব সংখ্যা',
    topic: 'আবৃত দশমিক',
    type: 'mcq',
    question: '০.৩̇ এর সাধারণ ভগ্নাংশ রূপ কোনটি?',
    options: ['১/৩', '৩/১০', '১/৯', '৩/১০০'],
    correctOption: 0,
    explanation: '০.৩̇ = ৩/৯ = ১/৩।',
    marks: 1,
    boardInfo: "কুমিল্লা বোর্ড '২২",
    importance: 'very_high'
  },

  // --- অধ্যায় ২: সেট ও ফাংশন ---
  {
    id: 'math-003',
    subject: 'সাধারণ গণিত',
    chapter: 'সেট ও ফাংশন',
    topic: 'শক্তি সেট (Power Set)',
    type: 'mcq',
    question: 'যদি কোনো সেট A এর উপাদান সংখ্যা ৩ হয়, তবে এর উপসেট সংখ্যা কত হবে?',
    options: ['৩', '৬', '৮', '৯'],
    correctOption: 2,
    explanation: 'উপসেট সংখ্যা = 2ⁿ = 2³ = ৮।',
    marks: 1,
    boardInfo: "রাজশাহী বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-004',
    subject: 'সাধারণ গণিত',
    chapter: 'সেট ও ফাংশন',
    topic: 'ডোমেন ও রেঞ্জ',
    type: 'mcq',
    question: 'f(x) = x² - 4x + 3 হলে, f(2) এর মান কত?',
    options: ['-১', '০', '১', '৩'],
    correctOption: 0,
    explanation: 'f(2) = (2)² - 4(2) + 3 = 4 - 8 + 3 = -1।',
    marks: 1,
    boardInfo: "যশোর বোর্ড '২৩",
    importance: 'high'
  },

  // --- অধ্যায় ৩: বীজগাণিতিক রাশি ---
  {
    id: 'math-005',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    topic: 'মান নির্ণয়',
    type: 'mcq',
    question: 'x + 1/x = 3 হলে, x² + 1/x² এর মান কত?',
    options: ['৭', '৯', '১১', '১৩'],
    correctOption: 0,
    explanation: 'x² + 1/x² = (x + 1/x)² - 2 = (3)² - 2 = 9 - 2 = 7।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩, চট্টগ্রাম বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-006',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    topic: 'ঘন ও অনুসিদ্ধান্ত',
    type: 'mcq',
    question: 'a + b = 5 এবং ab = 6 হলে, a³ + b³ এর মান কত?',
    options: ['৩৫', '৬৫', '১২৫', '৯৫'],
    correctOption: 0,
    explanation: 'a³ + b³ = (a + b)³ - 3ab(a + b) = 5³ - 3(6)(5) = 125 - 90 = 35।',
    marks: 1,
    boardInfo: "সিলেট বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-007',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    topic: 'উৎপাদকে বিশ্লেষণ',
    type: 'mcq',
    question: 'x² - 5x + 6 এর সঠিক উৎপাদক কোনটি?',
    options: ['(x - 2)(x - 3)', '(x + 2)(x + 3)', '(x - 1)(x - 6)', '(x + 1)(x - 6)'],
    correctOption: 0,
    explanation: 'x² - 3x - 2x + 6 = x(x - 3) - 2(x - 3) = (x - 2)(x - 3)।',
    marks: 1,
    boardInfo: "দিনাজপুর বোর্ড '২২",
    importance: 'high'
  },

  // --- অধ্যায় ৪: সূচক ও লগারিদম ---
  {
    id: 'math-008',
    subject: 'সাধারণ গণিত',
    chapter: 'সূচক ও লগারিদম',
    topic: 'লগারিদমের মান',
    type: 'mcq',
    question: 'log₂ 64 এর মান কত?',
    options: ['৪', '৫', '৬', '৮'],
    correctOption: 2,
    explanation: '64 = 2⁶; সুতরাং log₂ (2⁶) = 6 log₂ 2 = 6 × 1 = 6।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২২, রাজশাহী বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-009',
    subject: 'সাধারণ গণিত',
    chapter: 'সূচক ও লগারিদম',
    topic: 'সূচকের সূত্রাবলি',
    type: 'mcq',
    question: 'a⁰ (যেখানে a ≠ 0) এর মান কত?',
    options: ['০', '১', 'a', 'অসংজ্ঞায়িত'],
    correctOption: 1,
    explanation: 'শূন্য ব্যতীত যেকোনো বাস্তব সংখ্যার শূন্যতম ঘাতের মান সর্বদা ১।',
    marks: 1,
    boardInfo: "বরিশাল বোর্ড '২৩",
    importance: 'high'
  },

  // --- অধ্যায় ৯ ও ১০: ত্রিকোণমিতিক অনুপাত, দূরত্ব ও উচ্চতা ---
  {
    id: 'math-010',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    topic: 'ত্রিকোণমিতিক অভেদাবলি',
    type: 'mcq',
    question: 'sin² θ + cos² θ এর মান কত?',
    options: ['০', '১', '২', 'tan θ'],
    correctOption: 1,
    explanation: 'পিথাগোরাসের উপপাদ্য অনুযায়ী sin² θ + cos² θ = ১ একটি মৌলিক ত্রিকোণমিতিক অভেদ।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-011',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    topic: 'নির্দিষ্ট কোণের অনুপাত',
    type: 'mcq',
    question: 'tan 60° এর মান কত?',
    options: ['1/√3', '1', '√3', '2'],
    correctOption: 2,
    explanation: 'tan 60° = √3।',
    marks: 1,
    boardInfo: "যশোর বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-012',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    topic: 'উন্নতি কোণ ও অবনতি কোণ',
    type: 'mcq',
    question: 'একটি মিনারের পাদদেশ থেকে 30 m দূরে ভূ-তলের কোনো বিন্দুতে মিনারের শীর্ষের উন্নতি কোণ 30° হলে মিনারের উচ্চতা কত?',
    options: ['30 m', '10√3 m', '30√3 m', '15 m'],
    correctOption: 1,
    explanation: 'tan 30° = h / 30 => 1/√3 = h / 30 => h = 30 / √3 = 10√3 m (প্রায় 17.32 m)।',
    marks: 1,
    boardInfo: "কুমিল্লা বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ১৩: সসীম ধারা ---
  {
    id: 'math-013',
    subject: 'সাধারণ গণিত',
    chapter: 'সসীম ধারা',
    topic: 'সমান্তর ধারার পদ সংখ্যা',
    type: 'mcq',
    question: '১ + ৩ + ৫ + ৭ + ....... ধারাটির ১০তম পদ কত?',
    options: ['১৭', '১৯', '২১', '২৩'],
    correctOption: 1,
    explanation: 'n-তম পদ = a + (n - 1)d = 1 + (10 - 1) × 2 = 1 + 18 = 19।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-014',
    subject: 'সাধারণ গণিত',
    chapter: 'সসীম ধারা',
    topic: 'ধারা সমষ্টি',
    type: 'mcq',
    question: 'প্রথম n সংখ্যক স্বাভাবিক বিজোড় সংখ্যার সমষ্টি কত?',
    options: ['n(n+1)/2', 'n²', 'n(n+1)', '2n - 1'],
    correctOption: 1,
    explanation: 'প্রথম n সংখ্যক স্বাভাবিক বিজোড় সংখ্যার যোগফল = n²।',
    marks: 1,
    boardInfo: "ময়মনসিংহ বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ১৬: পরিমিতি ---
  {
    id: 'math-015',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিমিতি',
    topic: 'বৃত্তের ক্ষেত্রফল ও পরিধি',
    type: 'mcq',
    question: 'একটি বৃত্তের ব্যাসার্ধ 7 cm হলে এর পরিধি কত? (π = 22/7)',
    options: ['22 cm', '44 cm', '154 cm', '88 cm'],
    correctOption: 1,
    explanation: 'পরিধি = 2πr = 2 × (22/7) × 7 = 44 cm।',
    marks: 1,
    boardInfo: "চট্টগ্রাম বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-016',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিমিতি',
    topic: 'সমবাহু ত্রিভুজের ক্ষেত্রফল',
    type: 'mcq',
    question: 'একটি সমবাহু ত্রিভুজের বাহুর দৈর্ঘ্য 4 m হলে এর ক্ষেত্রফল কত বর্গমিটার?',
    options: ['4√3 m²', '8√3 m²', '16 m²', '4 m²'],
    correctOption: 0,
    explanation: 'সমবাহু ত্রিভুজের ক্ষেত্রফল = (√3 / 4) a² = (√3 / 4) × 4² = 4√3 m²।',
    marks: 1,
    boardInfo: "দিনাজপুর বোর্ড '২৩",
    importance: 'very_high'
  },

  // --- অধ্যায় ১৭: পরিসংখ্যান ---
  {
    id: 'math-017',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিসংখ্যান',
    topic: 'প্রচুরক ও মধ্যক',
    type: 'mcq',
    question: '৮, ১২, ১৬, ১২, ২০, ১২, ২৫ উপাত্তগুলোর প্রচুরক কত?',
    options: ['৮', '১২', '১৬', '২০'],
    correctOption: 1,
    explanation: 'যে সংখ্যাটি উপাত্তে সর্বাধিক সংখ্যক বার (৩ বার) উপস্থিত থাকে তাই প্রচুরক। এখানে প্রচুরক ১২।',
    marks: 1,
    boardInfo: "ঢাকা বোর্ড '২৩",
    importance: 'very_high'
  },
  {
    id: 'math-018',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিসংখ্যান',
    topic: 'ক্রমযোজিত গণসংখ্যা লেখচিত্র',
    type: 'mcq',
    question: 'মধ্যক নির্ণয়ের জন্য কোন লেখচিত্রটি আঁকা হয়?',
    options: ['আয়তলেখ', 'গণসংখ্যা বহুভুজ', 'অজিভ রেখা (Ogive curve)', 'পাই চার্ট'],
    correctOption: 2,
    explanation: 'অজিভ রেখা হলো ক্রমযোজিত গণসংখ্যার লেখচিত্র, যা থেকে সরাসরি মধ্যক নির্ণয় করা যায়।',
    marks: 1,
    boardInfo: "রাজশাহী বোর্ড '২৩",
    importance: 'very_high'
  },

  // গণিত সৃজনশীল (CQ)
  {
    id: 'math-cq-001',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    type: 'cq',
    stimulus: 'x = √3 + √2 এবং a² - 2√6 a + 1 = 0 দুটি বীজগাণিতিক সমীকরণ।',
    subQuestions: [
      { label: 'ক', question: '1/x এর মান নির্ণয় করো।', marks: 1 },
      { label: 'খ', question: 'প্রমাণ করো যে, x³ + 1/x³ = 18√3।', marks: 2 },
      { label: 'গ', question: 'a⁵ - 1/a⁵ এর মান কত হবে তা নির্ণয় করো।', marks: 3 },
      { label: 'ঘ', question: 'x⁶ - 1/x⁶ এর মান বের করে সত্যতা যাচাই করো।', marks: 4 }
    ],
    marks: 10,
    boardInfo: "ঢাকা বোর্ড '২৩ স্ট্যান্ডার্ড",
    importance: 'very_high'
  }
];
