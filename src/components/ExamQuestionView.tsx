import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Square, 
  Printer, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  HelpCircle, 
  Eye, 
  Settings2, 
  BookOpen, 
  Sliders, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Award, 
  Download, 
  Edit3, 
  Layers, 
  Clock, 
  Hash, 
  Search,
  ChevronDown,
  Info,
  Key,
  LayoutTemplate,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  QuestionItem, 
  MCQQuestion, 
  CQQuestion, 
  ShortQuestion,
  ExamQuestionFormat, 
  ExamPaperConfig,
  PageLayoutType
} from '../types';
import { subjectsList, chaptersBySubject } from '../data/questionBank';

export const ExamQuestionView: React.FC = () => {
  const { 
    institution, 
    questions, 
    addCustomQuestion, 
    deleteQuestion,
    resetQuestionsToDefault,
    savedExamPapers,
    saveExamPaper,
    examNavIntent,
    setExamNavIntent
  } = useApp();

  // Active View Tab: 'builder' | 'preview' | 'answer-key' | 'guide'
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'answer-key' | 'guide'>('builder');

  // Configuration State
  const [selectedSubject, setSelectedSubject] = useState<string>('পদার্থবিজ্ঞান');
  const [selectedFormat, setSelectedFormat] = useState<ExamQuestionFormat>('combined');
  const [selectedChapter, setSelectedChapter] = useState<string>('সব অধ্যায়');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOnlyBoard, setFilterOnlyBoard] = useState<boolean>(false);
  const [filterOnlyImportant, setFilterOnlyImportant] = useState<boolean>(false);
  const [showBoardTagsInPrint, setShowBoardTagsInPrint] = useState<boolean>(true);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showHeaderConfig, setShowHeaderConfig] = useState<boolean>(false);
  
  // Question selection (Set of IDs)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([
    'phy-001', 
    'phy-002', 
    'phy-003', 
    'phy-cq-001'
  ]);

  // Exam Header Customization
  const [coachingName, setCoachingName] = useState<string>(institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার');
  const [examTitle, setExamTitle] = useState<string>('মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬');
  const [className, setClassName] = useState<string>('১০ম শ্রেণি (SSC পরীক্ষার্থী)');
  const [duration, setDuration] = useState<string>('১ ঘণ্টা ৩০ মিনিট');
  const [subjectCode, setSubjectCode] = useState<string>('১৭৪');
  const [customTotalMarks, setCustomTotalMarks] = useState<string>('');
  const [instructions, setInstructions] = useState<string>(
    'বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। প্রতিটি প্রশ্নের উত্তর স্পষ্ট হস্তাক্ষরে প্রদান করো।'
  );

  // Watermark Settings
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>(institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.12);

  // Print Layout columns: 1 or 2
  const [columns, setColumns] = useState<1 | 2>(2);
  const [pageLayout, setPageLayout] = useState<PageLayoutType>('two_column');
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<string | null>(null);
  const [showBottomPreview, setShowBottomPreview] = useState<boolean>(true);

  // Custom question modal / accordion
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customType, setCustomType] = useState<'mcq' | 'cq'>('mcq');
  const [newMcqQuestion, setNewMcqQuestion] = useState<string>('');
  const [newMcqOptions, setNewMcqOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [newMcqCorrect, setNewMcqCorrect] = useState<0 | 1 | 2 | 3>(0);
  const [newMcqChapter, setNewMcqChapter] = useState<string>('');
  const [newMcqTopic, setNewMcqTopic] = useState<string>('');

  // Custom CQ
  const [newCqStimulus, setNewCqStimulus] = useState<string>('');
  const [newCqA, setNewCqA] = useState<string>('');
  const [newCqB, setNewCqB] = useState<string>('');
  const [newCqC, setNewCqC] = useState<string>('');
  const [newCqD, setNewCqD] = useState<string>('');

  // Subject code lookup helper
  const defaultCodes: Record<string, string> = {
    'পদার্থবিজ্ঞান': '১৭৪',
    'রসায়ন': '১৭৬',
    'সাধারণ গণিত': '১০৯',
    'গণিত': '১০৯',
    'উচ্চতর গণিত': '১২৬',
    'জীববিজ্ঞান': '১৭৮',
    'তথ্য ও যোগাযোগ প্রযুক্তি': '২৭৫'
  };

  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    setSelectedChapter('সব অধ্যায়');
    if (defaultCodes[subj]) {
      setSubjectCode(defaultCodes[subj]);
    }
  };

  // Filter questions based on subject, format, chapter, search query, and board/importance tags
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Subject match (also tolerate 'গণিত' matching 'সাধারণ গণিত')
      const matchSubject = q.subject === selectedSubject || 
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
      if (!matchSubject) return false;

      // Format filter
      if (selectedFormat === 'mcq' && q.type !== 'mcq') return false;
      if (selectedFormat === 'cq' && q.type !== 'cq') return false;
      if (selectedFormat === 'short' && q.type !== 'short') return false;

      // Chapter filter
      if (selectedChapter !== 'সব অধ্যায়' && q.chapter !== selectedChapter) return false;

      // Board filter
      if (filterOnlyBoard && !q.boardInfo) return false;

      // Important filter
      if (filterOnlyImportant && q.importance !== 'very_high' && q.importance !== 'high') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (q.type === 'mcq') {
          const mcq = q as MCQQuestion;
          const inQuestion = mcq.question.toLowerCase().includes(query);
          const inTopic = mcq.topic?.toLowerCase().includes(query) || false;
          const inChapter = mcq.chapter.toLowerCase().includes(query);
          const inBoard = mcq.boardInfo?.toLowerCase().includes(query) || false;
          return inQuestion || inTopic || inChapter || inBoard;
        } else if (q.type === 'short') {
          const sq = q as ShortQuestion;
          const inQuestion = sq.question.toLowerCase().includes(query);
          const inAnswer = sq.answer?.toLowerCase().includes(query) || false;
          const inChapter = sq.chapter.toLowerCase().includes(query);
          const inBoard = sq.boardInfo?.toLowerCase().includes(query) || false;
          return inQuestion || inAnswer || inChapter || inBoard;
        } else {
          const cq = q as CQQuestion;
          const inStimulus = cq.stimulus.toLowerCase().includes(query);
          const inChapter = cq.chapter.toLowerCase().includes(query);
          const inBoard = cq.boardInfo?.toLowerCase().includes(query) || false;
          return inStimulus || inChapter || inBoard;
        }
      }

      return true;
    });
  }, [questions, selectedSubject, selectedFormat, selectedChapter, filterOnlyBoard, filterOnlyImportant, searchQuery]);

  // Questions strictly in the currently selected subject
  const subjectQuestions = useMemo(() => {
    return questions.filter(q => {
      return q.subject === selectedSubject || 
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
    });
  }, [questions, selectedSubject]);

  // Counts of available board & important questions in current selection
  const boardCount = useMemo(() => {
    return questions.filter(q => {
      const matchSubject = q.subject === selectedSubject || 
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
      return matchSubject && !!q.boardInfo;
    }).length;
  }, [questions, selectedSubject]);

  const importantCount = useMemo(() => {
    return questions.filter(q => {
      const matchSubject = q.subject === selectedSubject || 
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
      return matchSubject && (q.importance === 'very_high' || q.importance === 'high');
    }).length;
  }, [questions, selectedSubject]);

  // Helper to select fixed number of MCQs and set duration & marks automatically
  const handleSelectCount = (count: number) => {
    const availableMcqs = filteredQuestions.filter(q => q.type === 'mcq');
    if (availableMcqs.length === 0) {
      alert('বর্তমান ফিল্টারে কোনো MCQ প্রশ্ন পাওয়া যায়নি!');
      return;
    }
    const chosen = availableMcqs.slice(0, count);
    setSelectedQuestionIds(chosen.map(q => q.id));
    setCustomTotalMarks(`${chosen.length}`);
    setDuration(`${Math.max(15, chosen.length)} মিনিট`);
    setSelectedFormat('mcq');
    alert(`সফলভাবে ${chosen.length}টি প্রশ্ন নির্বাচন করা হয়েছে এবং প্রশ্নপত্র প্রস্তুত করা হয়েছে! প্রিভিউ দেখতে ২য় ট্যাবে যান।`);
  };

  const handleSelectRandom = (count: number) => {
    const availableMcqs = filteredQuestions.filter(q => q.type === 'mcq');
    if (availableMcqs.length === 0) {
      alert('বর্তমান ফিল্টারে কোনো MCQ প্রশ্ন পাওয়া যায়নি!');
      return;
    }
    const shuffled = [...availableMcqs].sort(() => 0.5 - Math.random());
    const chosen = shuffled.slice(0, count);
    setSelectedQuestionIds(chosen.map(q => q.id));
    setCustomTotalMarks(`${chosen.length}`);
    setDuration(`${Math.max(15, chosen.length)} মিনিট`);
    setSelectedFormat('mcq');
    alert(`র‍্যান্ডমভাবে ${chosen.length}টি প্রশ্ন নির্বাচন করা হয়েছে!`);
  };

  // Selected questions items list
  const selectedQuestionItems = useMemo(() => {
    return questions.filter(q => selectedQuestionIds.includes(q.id));
  }, [questions, selectedQuestionIds]);

  // Total marks calculation
  const calculatedTotalMarks = useMemo(() => {
    return selectedQuestionItems.reduce((acc, q) => acc + (q.marks || (q.type === 'cq' ? 10 : 1)), 0);
  }, [selectedQuestionItems]);

  const mcqCount = selectedQuestionItems.filter(q => q.type === 'mcq').length;
  const cqCount = selectedQuestionItems.filter(q => q.type === 'cq').length;
  const shortCount = selectedQuestionItems.filter(q => q.type === 'short').length;

  const handleSaveExamPaper = () => {
    if (selectedQuestionIds.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি প্রশ্ন নির্বাচন করুন!');
      return;
    }
    const newPaper: ExamPaperConfig = {
      id: `paper-${Date.now()}`,
      coachingName,
      subTitle: `${institution.village || ''}, ${institution.upazila || ''}`,
      examTitle,
      subject: selectedSubject,
      subjectCode,
      class: className,
      duration,
      totalMarks: Number(customTotalMarks) || calculatedTotalMarks,
      format: selectedFormat,
      pageLayout,
      instructions,
      watermark: {
        enabled: watermarkEnabled,
        type: 'text',
        text: watermarkText,
        opacity: watermarkOpacity
      },
      columns,
      showAnswersInPrint: false,
      selectedQuestionIds,
      date: new Date().toISOString()
    };

    saveExamPaper(newPaper);
    setSaveSuccessNotification(`"${examTitle}" (${selectedSubject}) প্রশ্নপত্রটি সফলভাবে সিস্টেমে এন্ট্রি ও সংরক্ষিত হয়েছে!`);
    setTimeout(() => setSaveSuccessNotification(null), 5000);
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const idsToAdd = filteredQuestions.map(q => q.id);
    setSelectedQuestionIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const deselectAllFiltered = () => {
    const filteredIds = new Set(filteredQuestions.map(q => q.id));
    setSelectedQuestionIds(prev => prev.filter(id => !filteredIds.has(id)));
  };

  const handlePrint = () => {
    window.print();
  };

  // PDF Direct Download Handler
  const handleDownloadPdf = () => {
    const cleanTitle = `${coachingName}_${selectedSubject}_প্রশ্নপত্র_${examTitle}`.replace(/[\\/:*?"<>|]/g, '_');
    const oldTitle = document.title;
    document.title = cleanTitle;
    window.print();
    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
  };

  // Offline HTML Download Handler
  const handleDownloadOfflineHtml = () => {
    const paperElement = document.getElementById('printable-question-paper');
    if (!paperElement) {
      window.print();
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${coachingName} - ${selectedSubject} প্রশ্নপত্র</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    body {
      font-family: 'Hind Siliguri', sans-serif;
      background: white;
      color: #0f172a;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet-wrapper {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 8mm;
      box-sizing: border-box;
      position: relative;
    }
    @media print {
      body { margin: 0; padding: 0; }
      .sheet-wrapper { max-width: none; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet-wrapper">
    ${paperElement.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${coachingName}_${selectedSubject}_A4_প্রশ্নপত্র.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Listen to external sidebar tree navigation intent
  useEffect(() => {
    if (!examNavIntent) return;

    if (examNavIntent.subject) {
      handleSubjectChange(examNavIntent.subject);
    }
    if (examNavIntent.format) {
      setSelectedFormat(examNavIntent.format);
    }
    if (examNavIntent.tab && examNavIntent.tab !== 'saved-papers') {
      setActiveTab(examNavIntent.tab);
    }
    if (examNavIntent.action === 'add_custom') {
      setShowAddCustomModal(true);
    }
    if (examNavIntent.action === 'download_pdf') {
      setActiveTab('preview');
      setShowPdfModal(true);
    }
    if (examNavIntent.action === 'preset_board') {
      const boardQs = questions.filter(q => {
        const matchSubject = q.subject === selectedSubject || 
          (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
          (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
        return matchSubject && (q.boardInfo || q.importance === 'very_high');
      });
      if (boardQs.length > 0) {
        setSelectedQuestionIds(boardQs.slice(0, 16).map(q => q.id));
      }
      setExamTitle('এসএসসি ও বার্ষিক বোর্ড মডেল টেস্ট - ২০২৬');
    }
    if (examNavIntent.action === 'preset_half_yearly') {
      const chapters = chaptersBySubject[selectedSubject] || [];
      const halfChapters = chapters.slice(0, Math.ceil(chapters.length / 2));
      const halfQs = questions.filter(q => {
        const matchSubject = q.subject === selectedSubject || 
          (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
          (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
        return matchSubject && halfChapters.includes(q.chapter);
      });
      if (halfQs.length > 0) {
        setSelectedQuestionIds(halfQs.slice(0, 14).map(q => q.id));
      }
      setExamTitle('অর্ধবার্ষিক মূল্যায়ন পরীক্ষা - ২০২৬');
    }
    if (examNavIntent.action === 'preset_suggestion') {
      const importantQs = questions.filter(q => {
        const matchSubject = q.subject === selectedSubject || 
          (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
          (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
        return matchSubject && q.importance === 'very_high';
      });
      if (importantQs.length > 0) {
        setSelectedQuestionIds(importantQs.slice(0, 16).map(q => q.id));
      }
      setFilterOnlyImportant(true);
      setExamTitle('১০০% কমন স্পেশাল সাজেশন প্রশ্নপত্র - ২০২৬');
    }
  }, [examNavIntent]);

  // Submit custom question
  const handleSaveCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `custom-${Date.now()}`;
    const chapterName = newMcqChapter.trim() || 'সাধারণ ও বিবিধ';

    if (customType === 'mcq') {
      if (!newMcqQuestion.trim() || newMcqOptions.some(opt => !opt.trim())) {
        alert('দয়া করে প্রশ্ন এবং ৪টি অপশন সঠিকভাবে পূরণ করুন!');
        return;
      }
      const item: MCQQuestion = {
        id: newId,
        subject: selectedSubject,
        chapter: chapterName,
        topic: newMcqTopic.trim() || undefined,
        question: newMcqQuestion,
        options: newMcqOptions,
        correctOption: newMcqCorrect,
        marks: 1,
        type: 'mcq'
      };
      addCustomQuestion(item);
      setSelectedQuestionIds(prev => [item.id, ...prev]);
    } else {
      if (!newCqStimulus.trim() || !newCqA.trim() || !newCqB.trim()) {
        alert('দয়া করে সৃজনশীল উদ্দীপক এবং ক ও খ প্রশ্ন পূরণ করুন!');
        return;
      }
      const item: CQQuestion = {
        id: newId,
        subject: selectedSubject,
        chapter: chapterName,
        stimulus: newCqStimulus,
        subQuestions: [
          { label: 'ক', question: newCqA, marks: 1 },
          { label: 'খ', question: newCqB, marks: 2 },
          { label: 'গ', question: newCqC || 'উদ্দীপকের আলোকে বিশ্লেষণ করো।', marks: 3 },
          { label: 'ঘ', question: newCqD || 'উপরি উক্ত ঘটনার তাৎপর্য মূল্যায়ন করো।', marks: 4 }
        ],
        marks: 10,
        type: 'cq'
      };
      addCustomQuestion(item);
      setSelectedQuestionIds(prev => [item.id, ...prev]);
    }

    // Reset inputs
    setNewMcqQuestion('');
    setNewMcqOptions(['', '', '', '']);
    setNewCqStimulus('');
    setNewCqA('');
    setNewCqB('');
    setNewCqC('');
    setNewCqD('');
    setShowAddCustomModal(false);
  };

  // Available chapters for selected subject
  const availableChapters = chaptersBySubject[selectedSubject] || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Tab Navigation (Hidden in print) */}
      <div className="print:hidden bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                পরীক্ষার প্রশ্নপত্র জেনারেটর (Exam Question Generator)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                A4 স্ট্যান্ডার্ড
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ফিজিক্স, কেমিস্ট্রি, ম্যাথ, বায়োলজি ও আইসিটি বিষয়ের অধ্যায়ভিত্তিক প্রশ্ন ব্যাংক থেকে স্বয়ংক্রিয় A4 প্রশ্নপত্র তৈরি করুন।
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>১. প্রশ্ন নির্বাচন ও কনফিগ</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>২. A4 প্রশ্নপত্র প্রিভিউ ({selectedQuestionIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('answer-key')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'answer-key'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>উত্তরপত্র / সলিউশন</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>ব্যবহার নির্দেশিকা</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: QUESTION BUILDER & FILTERING
         ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="print:hidden space-y-6">
          {/* Notification Banner */}
          {saveSuccessNotification && (
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{saveSuccessNotification}</span>
              </div>
              <button 
                onClick={() => setSaveSuccessNotification(null)}
                className="text-emerald-700 hover:text-emerald-950 text-xs px-2 py-1 bg-white rounded-lg border border-emerald-200 cursor-pointer"
              >
                ✕ বন্ধ
              </button>
            </div>
          )}

          {/* 1. Main Action & Navigation Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Left: Selected count & quick format selector */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600 font-medium">বিষয়:</span>
                <span className="text-emerald-700 font-black text-sm">{selectedSubject}</span>
              </div>

              {/* Segmented Format Pills */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs">
                {(['combined', 'mcq', 'cq', 'short', 'model_test'] as (ExamQuestionFormat | 'short')[]).map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt as ExamQuestionFormat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedFormat === fmt
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {fmt === 'combined' && 'সকল'}
                    {fmt === 'mcq' && 'MCQ'}
                    {fmt === 'cq' && 'CQ'}
                    {fmt === 'short' && 'শর্ট'}
                    {fmt === 'model_test' && 'মডেল টেস্ট'}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Selected Count, Page Layout Button & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">নির্বাচিত:</span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md font-bold font-mono">
                  {selectedQuestionIds.length} টি
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">পূর্ণমান:</span>
                <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-md font-bold font-mono">
                  {customTotalMarks ? customTotalMarks : calculatedTotalMarks} মার্ক
                </span>
              </div>

              {/* Prominent "প্রশ্নপত্র পেজ লেআউট" Button */}
              <button
                type="button"
                id="btn-page-layout-toggle"
                onClick={() => setShowHeaderConfig(!showHeaderConfig)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  showHeaderConfig
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                <span>{showHeaderConfig ? 'লেআউট প্যানেল বন্ধ' : 'প্রশ্নপত্র পেজ লেআউট'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono font-normal">
                  {pageLayout === 'two_column' ? '২ কলাম' : pageLayout === 'single_column' ? '১ কলাম' : pageLayout === 'compact' ? 'কম্প্যাক্ট' : 'ওয়ার্কশিট'}
                </span>
              </button>

              {/* Save / Entry Exam Paper Button */}
              <button
                type="button"
                id="btn-save-paper-top"
                onClick={handleSaveExamPaper}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
                title="তৈরি করা প্রশ্নপত্র সিস্টেমে এন্ট্রি ও সেভ করুন"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>প্রশ্নপত্র এন্ট্রি ও সেভ</span>
              </button>

              {/* View Full Preview */}
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
              >
                <Eye className="w-4 h-4" />
                <span>প্রিভিউ ({selectedQuestionIds.length})</span>
              </button>
            </div>
          </div>

          {/* 2. "প্রশ্নপত্র পেজ লেআউট" ও হেডার কনফিগারেশন প্যানেল */}
          {showHeaderConfig && (
            <div className="bg-gradient-to-b from-indigo-50/50 to-slate-50 p-5 rounded-2xl border-2 border-indigo-200 shadow-md space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white">
                    <LayoutTemplate className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">প্রশ্নপত্র পেজ লেআউট ও হেডার সেটিংস</h3>
                    <p className="text-xs text-slate-500">কোচিং সেন্টারের নাম ও পরীক্ষার জন্য পছন্দের পেজ লেআউট ফরম্যাট নির্বাচন করুন</p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 font-bold self-start sm:self-auto">
                  A4 পেপারের জন্য অপ্টিমাইজড
                </span>
              </div>

              {/* Layout Format Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  পছন্দের পেজ লেআউট ফরম্যাট নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'two_column' as PageLayoutType,
                      title: '২ কলাম লেআউট',
                      sub: 'বোর্ড স্ট্যান্ডার্ড (SSC/HSC আদলে)',
                      desc: 'কাগজের সর্বোচ্চ ব্যবহার ও প্রথাগত বোর্ড পরীক্ষার দুই কলাম বিন্যাস।',
                      badge: 'সর্বাধিক জনপ্রিয়'
                    },
                    {
                      id: 'single_column' as PageLayoutType,
                      title: '১ কলাম লেআউট',
                      sub: 'প্রমিত ও স্পষ্ট স্পেসিং',
                      desc: 'উদ্দীপক ও ব্যাখ্যামূলক বড় সৃজনশীল প্রশ্নের জন্য চমৎকার পাঠযোগ্যতা।',
                      badge: 'স্পেসিয়াস'
                    },
                    {
                      id: 'compact' as PageLayoutType,
                      title: 'কম্প্যাক্ট লেআউট',
                      sub: 'সাশ্রয়ী প্রিন্ট ফরম্যাট',
                      desc: 'কম পাতায় বেশি প্রশ্ন প্রিন্ট করার জন্য টাইট মার্জিন ও ফন্ট।',
                      badge: 'সাশ্রয়ী A4'
                    },
                    {
                      id: 'with_answer' as PageLayoutType,
                      title: 'উত্তর ও মার্জিনসহ',
                      sub: 'ওয়ার্কশিট ও এক্সাম শিট',
                      desc: 'প্রতিটি প্রশ্নের নিচে শিক্ষার্থীর উত্তর লেখার জন্য ডটেড লাইন সুবিধাযুক্ত।',
                      badge: 'ওয়ার্কশিট'
                    }
                  ].map(layout => {
                    const isSelected = pageLayout === layout.id;
                    return (
                      <div
                        key={layout.id}
                        onClick={() => {
                          setPageLayout(layout.id);
                          if (layout.id === 'two_column' || layout.id === 'compact') {
                            setColumns(2);
                          } else {
                            setColumns(1);
                          }
                        }}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {layout.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-indigo-100' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {layout.badge}
                            </span>
                          </div>
                          <p className={`text-[11px] font-medium mb-1 ${isSelected ? 'text-indigo-100' : 'text-slate-600'}`}>
                            {layout.sub}
                          </p>
                          <p className={`text-[10px] leading-relaxed ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {layout.desc}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-indigo-200/30 flex items-center justify-between">
                          <span className={`text-[10px] font-semibold ${isSelected ? 'text-emerald-200' : 'text-indigo-600'}`}>
                            {isSelected ? '✓ সক্রিয় রয়েছে' : 'নির্বাচন করুন'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coaching & Exam Header Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">কোচিং সেন্টারের নাম:</label>
                  <input
                    type="text"
                    value={coachingName}
                    onChange={e => setCoachingName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">পরীক্ষার নাম:</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={e => setExamTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">শ্রেণি / বিভাগ:</label>
                  <input
                    type="text"
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">সময় ও বিষয় কোড:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="সময়"
                      className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                    />
                    <input
                      type="text"
                      value={subjectCode}
                      onChange={e => setSubjectCode(e.target.value)}
                      placeholder="কোড"
                      className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions & Watermark */}
              <div className="pt-2 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={watermarkEnabled}
                      onChange={e => setWatermarkEnabled(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                    <span>জলছাপ (Watermark) প্রদর্শন করুন</span>
                  </label>

                  {watermarkEnabled && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={e => setWatermarkText(e.target.value)}
                        placeholder="জলছাপ লেখা"
                        className="px-2 py-1 text-xs border border-slate-300 rounded bg-white w-44"
                      />
                      <span className="text-[11px] text-slate-500">স্বচ্ছতা:</span>
                      <input
                        type="range"
                        min="0.05"
                        max="0.25"
                        step="0.02"
                        value={watermarkOpacity}
                        onChange={e => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-16 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">কলাম বিন্যাস:</span>
                  <button
                    onClick={() => setColumns(2)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border ${
                      columns === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ২ কলাম
                  </button>
                  <button
                    onClick={() => setColumns(1)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border ${
                      columns === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ১ কলাম
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Dropdowns for Subject & Chapter Selection + Question Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">বিষয় ও অধ্যায় ড্রপডাউন নির্বাচন</h3>
                  <p className="text-xs text-slate-500">ড্রপডাউন থেকে বিষয় ও অধ্যায় সিলেক্ট করলে প্রশ্ন ব্যাংকের প্রশ্নগুলো নিচে প্রদর্শিত হবে</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition cursor-pointer"
                >
                  সব সিলেক্ট ({filteredQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={deselectAllFiltered}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  আনচেক
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                  <span>➕ নতুন প্রশ্ন যোগ</span>
                </button>
              </div>
            </div>

            {/* Prominent Dropdown Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Dropdown 1: বিষয়ের নাম */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>১. বিষয় নির্বাচন করুন:</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">{subjectsList.length} টি বিষয়</span>
                </label>
                <select
                  id="select-subject-dropdown"
                  value={selectedSubject}
                  onChange={e => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden transition cursor-pointer"
                >
                  {subjectsList.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              {/* Dropdown 2: অধ্যায় নির্বাচন */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>২. অধ্যায় নির্বাচন করুন:</span>
                  <span className="text-[11px] text-indigo-600 font-semibold">{availableChapters.length} টি অধ্যায়</span>
                </label>
                <select
                  id="select-chapter-dropdown"
                  value={selectedChapter}
                  onChange={e => setSelectedChapter(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden transition cursor-pointer"
                >
                  <option value="সব অধ্যায়">সকল অধ্যায় ({subjectQuestions.length} টি প্রশ্ন সংরক্ষিত)</option>
                  {availableChapters.map(ch => {
                    const count = subjectQuestions.filter(q => q.chapter === ch).length;
                    return (
                      <option key={ch} value={ch}>{ch} ({count} টি প্রশ্ন)</option>
                    );
                  })}
                </select>
              </div>

              {/* Dropdown 3: প্রশ্নের ফরম্যাট & সার্চ */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>৩. প্রশ্নের ধরন ও সার্চ:</span>
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="প্রশ্ন বা টপিক সার্চ করুন..."
                    className="w-full pl-8.5 pr-3 py-2 text-xs border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Quick Horizontal Chapter Badges for rapid clicking */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">দ্রুত অধ্যায় বাছাই:</span>
              <button
                type="button"
                onClick={() => setSelectedChapter('সব অধ্যায়')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedChapter === 'সব অধ্যায়'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                সব ({subjectQuestions.length})
              </button>
              {availableChapters.map(ch => {
                const chCount = subjectQuestions.filter(q => q.chapter === ch).length;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setSelectedChapter(ch)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition cursor-pointer border ${
                      selectedChapter === ch
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ch} ({chCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Exam Paper Generator Presets (২৫, ৫০, ১০০ প্রশ্নপত্র) */}
          <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-emerald-50/80 p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  কুইক প্রশ্নপত্র জেনারেটর (বোর্ড স্ট্যান্ডার্ড ও ১০০% কমন উপযোগী):
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-indigo-200 text-indigo-700 font-bold">
                  এক ক্লিকে ২৫/৫০/১০০ MCQ প্রশ্নপত্র
                </span>
              </div>

              {/* Reset/Refresh Question Bank button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('সকল বিষয়ের লেটেস্ট বোর্ড ও কমন প্রশ্ন ব্যাংক রিলোড করতে চান?')) {
                    resetQuestionsToDefault();
                    alert('বোর্ড প্রশ্ন ব্যাংক সফলভাবে আপডেট হয়েছে!');
                  }
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer shadow-2xs"
                title="নতুন প্রশ্ন সিঙ্ক করতে ক্লিক করুন"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>প্রশ্নভাণ্ডার রিফ্রেশ</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Select 25 MCQs */}
              <button
                type="button"
                onClick={() => handleSelectCount(25)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>🎯 ২৫টি MCQ প্রশ্নপত্র (২৫ মার্ক)</span>
              </button>

              {/* Select 50 MCQs */}
              <button
                type="button"
                onClick={() => handleSelectCount(50)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer ring-2 ring-indigo-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>📝 ৫০টি MCQ প্রশ্নপত্র তৈরি করো (৫০ মার্ক)</span>
              </button>

              {/* Select 100 MCQs */}
              <button
                type="button"
                onClick={() => handleSelectCount(100)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-yellow-300" />
                <span>🏆 ১০০টি মেগা মডেল টেস্ট (১০০ মার্ক)</span>
              </button>

              {/* Select Random 25 */}
              <button
                type="button"
                onClick={() => handleSelectRandom(25)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>🎲 এলোমেলো ২৫টি নির্বাচন</span>
              </button>

              {/* Filter toggles for Board & Important */}
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <label className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                  filterOnlyBoard ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={filterOnlyBoard}
                    onChange={e => setFilterOnlyBoard(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                  />
                  <span>🏛️ শুধুমাত্র বোর্ড প্রশ্ন ({boardCount})</span>
                </label>

                <label className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                  filterOnlyImportant ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-rose-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={filterOnlyImportant}
                    onChange={e => setFilterOnlyImportant(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                  />
                  <span>⭐ ১০০% কমন উপযোগী ({importantCount})</span>
                </label>
              </div>
            </div>
          </div>

          {/* Question Bank Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                উপলব্ধ প্রশ্ন: <strong className="text-slate-800">{filteredQuestions.length}</strong> টি 
                (নির্বাচিত: <strong className="text-emerald-700">{selectedQuestionIds.length}</strong> টি)
              </span>
              <span className="text-[11px] text-slate-400">
                প্রশ্নপত্রে যুক্ত করতে বাম পাশের চেকবক্সে টিক চিহ্ন দিন
              </span>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">কোনো প্রশ্ন খুঁজে পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  নির্বাচিত অধ্যায় বা সার্চ কুয়েরির সাথে মিলছে এমন প্রশ্ন নেই। ফিল্টার রিসেট করুন অথবা নতুন কাস্টম প্রশ্ন যোগ করুন।
                </p>
                <button
                  onClick={() => { setSelectedChapter('সব অধ্যায়'); setSearchQuery(''); }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredQuestions.map((q, idx) => {
                  const isSelected = selectedQuestionIds.includes(q.id);

                  if (q.type === 'mcq') {
                    const mcq = q as MCQQuestion;
                    return (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestionSelection(q.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-emerald-50/40 border-emerald-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                MCQ • ১ মার্ক
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                অধ্যায়: {mcq.chapter} {mcq.topic ? `(${mcq.topic})` : ''}
                              </span>
                              {mcq.boardInfo && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                                  🏛️ {mcq.boardInfo}
                                </span>
                              )}
                              {mcq.importance === 'very_high' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                  ⭐ ১০০% কমন
                                </span>
                              )}
                              {mcq.importance === 'high' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                  ✓ গুরুত্বপূর্ণ
                                </span>
                              )}
                            </div>

                            {q.id.startsWith('custom-') && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteQuestion(q.id);
                                }}
                                className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>মুছুন</span>
                              </button>
                            )}
                          </div>

                          <p className="text-xs font-bold text-slate-900 leading-relaxed">
                            {idx + 1}. {mcq.question}
                          </p>

                          {/* 4 Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
                            {mcq.options.map((opt, optIdx) => {
                              const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                              const isCorrect = mcq.correctOption === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                                    isCorrect
                                      ? 'bg-emerald-100/70 border-emerald-300 font-bold text-emerald-950'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span className="font-semibold text-slate-500 mr-1">{labels[optIdx]}</span>
                                  {opt}
                                </div>
                              );
                            })}
                          </div>

                          {mcq.explanation && (
                            <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <strong className="text-slate-700">ব্যাখ্যা:</strong> {mcq.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else if (q.type === 'cq') {
                    // CQ Item
                    const cq = q as CQQuestion;
                    return (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestionSelection(q.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-indigo-50/40 border-indigo-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                সৃজনশীল (CQ) • ১০ মার্ক
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                অধ্যায়: {cq.chapter}
                              </span>
                              {cq.boardInfo && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                                  🏛️ {cq.boardInfo}
                                </span>
                              )}
                              {cq.importance === 'very_high' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                  ⭐ ১০০% কমন
                                </span>
                              )}
                            </div>

                            {q.id.startsWith('custom-') && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteQuestion(q.id);
                                }}
                                className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>মুছুন</span>
                              </button>
                            )}
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                            <strong className="text-indigo-900 block mb-1">উদ্দীপক:</strong>
                            {cq.stimulus}
                          </div>

                          {/* Sub questions */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {cq.subQuestions.map((sub, sIdx) => (
                              <div key={sIdx} className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between gap-2">
                                <span className="text-slate-800">
                                  <strong className="text-indigo-700 mr-1">{sub.label}.</strong> {sub.question}
                                </span>
                                <span className="font-mono text-slate-400 text-[11px] shrink-0">[{sub.marks}]</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (q.type === 'short') {
                    const sq = q as ShortQuestion;
                    return (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestionSelection(q.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-amber-50/50 border-amber-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                সংক্ষিপ্ত প্রশ্ন • {sq.marks || 2} মার্ক
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                অধ্যায়: {sq.chapter}
                              </span>
                              {sq.boardInfo && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  🏛️ {sq.boardInfo}
                                </span>
                              )}
                            </div>

                            {q.id.startsWith('custom-') && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteQuestion(q.id);
                                }}
                                className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>মুছুন</span>
                              </button>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                            {sq.question}
                          </p>

                          {sq.answer && (
                            <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                              <strong className="text-amber-900">নমুনা উত্তর:</strong> {sq.answer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {/* Bottom Floating / Fixed Summary & Fast Entry Panel for Question Paper */}
          <div className="sticky bottom-4 z-20 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold flex items-center gap-2">
                  <span>প্রশ্নপত্র স্ট্যাটাস:</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black rounded-md text-[11px]">
                    {selectedQuestionIds.length} টি প্রশ্ন বাছাইকৃত
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    পূর্ণমান: {customTotalMarks || calculatedTotalMarks}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  MCQ: {mcqCount} টি • CQ: {cqCount} টি • সংক্ষিপ্ত: {shortCount} টি | লেআউট: {pageLayout === 'two_column' ? '২ কলাম' : pageLayout === 'single_column' ? '১ কলাম' : pageLayout === 'compact' ? 'কম্প্যাক্ট' : 'ওয়ার্কশিট'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                id="btn-save-paper-bottom"
                onClick={handleSaveExamPaper}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>প্রশ্নপত্র এন্ট্রি ও সেভ করুন</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer border border-slate-700"
                title="সরাসরি প্রিন্ট বা PDF ডাউনলোড"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>A4 প্রিভিউ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: A4 QUESTION PAPER PREVIEW (PRINT OPTIMIZED)
         ========================================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Action Header bar (Hidden on print) */}
          <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-800">
                A4 সাইজ রেডি প্রশ্নপত্র
              </span>
              <span className="text-xs text-slate-500">
                (মোট প্রশ্ন: {selectedQuestionItems.length} টি • পূর্ণমান: {customTotalMarks || calculatedTotalMarks})
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={showBoardTagsInPrint}
                  onChange={e => setShowBoardTagsInPrint(e.target.checked)}
                  className="rounded text-indigo-600 w-3.5 h-3.5"
                />
                <span>বোর্ড সাল/তথ্য প্রশ্নপত্রে দেখান</span>
              </label>

              <button
                onClick={() => setActiveTab('builder')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                প্রশ্ন পরিবর্তন করুন
              </button>

              {/* PDF Download Button */}
              <button
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>সরাসরি PDF ডাউনলোড</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>A4 প্রিন্ট</span>
              </button>
            </div>
          </div>

          {/* The A4 Question Paper Sheet */}
          <div className="bg-slate-200/70 p-4 sm:p-8 rounded-3xl flex justify-center overflow-x-auto print:p-0 print:bg-transparent">
            <div 
              id="printable-question-paper"
              className="bg-white w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 shadow-xl print:shadow-none print:p-4 relative flex flex-col justify-between text-slate-900 border border-slate-300 print:border-none print:w-full print:max-w-none"
              style={{ fontFamily: "'Hind Siliguri', serif" }}
            >
              {/* WATERMARK OVERLAY */}
              {watermarkEnabled && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
                  style={{ opacity: watermarkOpacity }}
                >
                  <div className="transform -rotate-30 text-center">
                    <p className="text-5xl sm:text-6xl font-black text-slate-700 tracking-wider">
                      {watermarkText || coachingName}
                    </p>
                    <p className="text-xl font-bold text-slate-500 mt-2">
                      পরীক্ষার প্রশ্নপত্র • সর্বস্বত্ব সংরক্ষিত
                    </p>
                  </div>
                </div>
              )}

              {/* SHEET CONTENT CONTAINER */}
              <div className="relative z-10 space-y-4">
                {/* 1. Header Box */}
                <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                    {coachingName}
                  </h1>
                  <p className="text-xs text-slate-600">
                    {institution.village}, {institution.upazila}, {institution.district} • ফোন: {institution.phone}
                  </p>
                  <div className="inline-block bg-slate-900 text-white px-3 py-0.5 rounded-full text-xs font-bold my-1">
                    {examTitle}
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-xs font-bold pt-2 border-t border-slate-300">
                    <div>বিষয়: {selectedSubject} (কোড: {subjectCode})</div>
                    <div>শ্রেণি: {className}</div>
                    <div>সময়: {duration}</div>
                    <div>পূর্ণমান: {customTotalMarks || calculatedTotalMarks}</div>
                  </div>
                </div>

                {/* 2. Instructions Banner */}
                <div className="text-[11px] text-slate-700 italic border border-slate-200 p-1.5 rounded bg-slate-50/50 flex justify-between items-center">
                  <span>{instructions}</span>
                  <span className="font-bold shrink-0 ml-2">বিষয় কোড: {subjectCode}</span>
                </div>

                {/* 3. Student Identification Line */}
                <div className="border border-dashed border-slate-300 p-2 rounded text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700">
                  <div className="w-1/3 flex">
                    <span className="font-bold mr-1">শিক্ষার্থীর নাম:</span>
                    <span className="border-b border-dotted border-slate-400 flex-1"></span>
                  </div>
                  <div className="w-1/5 flex">
                    <span className="font-bold mr-1">রোল নং:</span>
                    <span className="border-b border-dotted border-slate-400 flex-1"></span>
                  </div>
                  <div className="w-1/6 flex">
                    <span className="font-bold mr-1">শাখা:</span>
                    <span className="border-b border-dotted border-slate-400 flex-1"></span>
                  </div>
                  <div className="w-1/5 flex">
                    <span className="font-bold mr-1">তারিখ:</span>
                    <span className="border-b border-dotted border-slate-400 flex-1"></span>
                  </div>
                </div>

                {/* 4. Questions List */}
                {selectedQuestionItems.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <p className="text-sm font-bold">কোনো প্রশ্ন নির্বাচিত করা হয়নি!</p>
                    <p className="text-xs mt-1">দয়া করে প্রশ্ন নির্বাচন ট্যাবে গিয়ে প্রশ্ন টিক দিন।</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* SECTION A: সৃজনশীল প্রশ্ন (CQ), if any */}
                    {cqCount > 0 && (
                      <div className="space-y-3">
                        <div className="text-center font-bold text-xs bg-slate-100 py-1 rounded border border-slate-300">
                          {selectedFormat === 'combined' || selectedFormat === 'model_test' ? "'ক' বিভাগ: সৃজনশীল অংশ (পূর্ণমান: " + (cqCount * 10) + ")" : 'সৃজনশীল প্রশ্নাবলি'}
                        </div>

                        <div className="space-y-4">
                          {selectedQuestionItems
                            .filter(q => q.type === 'cq')
                            .map((q, cqIdx) => {
                              const cq = q as CQQuestion;
                              return (
                                <div key={cq.id} className="text-xs space-y-1.5 break-inside-avoid">
                                  <div className="flex justify-between font-bold text-slate-900">
                                    <span>প্রশ্ন নং {cqIdx + 1}:</span>
                                    <span>[{cq.marks}]</span>
                                  </div>
                                  <p className="text-slate-800 leading-relaxed text-justify pl-3 border-l-2 border-slate-400 italic">
                                    {cq.stimulus}
                                  </p>
                                  <div className="space-y-1 pl-4 pt-1">
                                    {cq.subQuestions.map((sub, sIdx) => (
                                      <div key={sIdx} className="flex justify-between text-slate-900">
                                        <span>
                                          <strong className="mr-1.5">{sub.label}.</strong> {sub.question}
                                        </span>
                                        <span className="font-mono text-slate-600">[{sub.marks}]</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* SECTION B: বহুনির্বাচনী প্রশ্ন (MCQ), if any */}
                    {mcqCount > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="text-center font-bold text-xs bg-slate-100 py-1 rounded border border-slate-300">
                          {selectedFormat === 'combined' || selectedFormat === 'model_test' ? "'খ' বিভাগ: বহুনির্বাচনী অংশ (পূর্ণমান: " + mcqCount + ")" : 'বহুনির্বাচনী প্রশ্নাবলি (সঠিক উত্তরে টিক বা বৃত্ত ভরাট করো)'}
                        </div>

                        <div className={`grid ${columns === 2 ? 'grid-cols-2 gap-x-5 gap-y-3' : 'grid-cols-1 gap-y-3'}`}>
                          {selectedQuestionItems
                            .filter(q => q.type === 'mcq')
                            .map((q, mcqIdx) => {
                              const mcq = q as MCQQuestion;
                              const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                              return (
                                <div key={mcq.id} className="text-xs space-y-1 break-inside-avoid border-b border-slate-100 pb-1.5">
                                  <div className="font-bold text-slate-950 flex items-start justify-between gap-1">
                                    <div className="flex items-start gap-1">
                                      <span className="shrink-0">{mcqIdx + 1}.</span>
                                      <span>{mcq.question}</span>
                                    </div>
                                    {showBoardTagsInPrint && mcq.boardInfo && (
                                      <span className="shrink-0 text-[10px] font-normal text-slate-500 font-serif italic ml-1">
                                        [{mcq.boardInfo}]
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-4 text-[11px] text-slate-800">
                                    {mcq.options.map((opt, oIdx) => (
                                      <div key={oIdx} className="leading-tight">
                                        <span className="font-semibold text-slate-600 mr-1">{labels[oIdx]}</span>
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* SECTION C: সংক্ষিপ্ত ও জ্ঞানমূলক প্রশ্ন (Short Question), if any */}
                    {shortCount > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="text-center font-bold text-xs bg-slate-100 py-1 rounded border border-slate-300">
                          {selectedFormat === 'combined' || selectedFormat === 'model_test' ? "'গ' বিভাগ: সংক্ষিপ্ত প্রশ্নাবলি (পূর্ণমান: " + (shortCount * 2) + ")" : 'সংক্ষিপ্ত ও জ্ঞানমূলক প্রশ্নাবলি'}
                        </div>

                        <div className={`grid ${columns === 2 && pageLayout !== 'with_answer' ? 'grid-cols-2 gap-x-5 gap-y-3' : 'grid-cols-1 gap-y-3'}`}>
                          {selectedQuestionItems
                            .filter(q => q.type === 'short')
                            .map((q, sIdx) => {
                              const sq = q as ShortQuestion;
                              return (
                                <div key={sq.id} className="text-xs space-y-1.5 break-inside-avoid border-b border-slate-100 pb-2">
                                  <div className="font-bold text-slate-950 flex items-start justify-between gap-1">
                                    <div className="flex items-start gap-1">
                                      <span className="shrink-0">{sIdx + 1}.</span>
                                      <span>{sq.question}</span>
                                    </div>
                                    <span className="shrink-0 font-mono text-slate-600 text-[11px] font-semibold">[{sq.marks || 2}]</span>
                                  </div>
                                  {pageLayout === 'with_answer' && (
                                    <div className="pt-1.5 pl-4 space-y-2">
                                      <div className="border-b border-dotted border-slate-300 h-4"></div>
                                      <div className="border-b border-dotted border-slate-300 h-4"></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sheet Bottom Footer */}
              <div className="pt-6 mt-6 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center print:pt-3">
                <div>
                  প্রস্তুতকারক: {coachingName} • {new Date().toLocaleDateString('bn-BD')}
                </div>
                <div>
                  পৃষ্ঠা: ১/১ • [পরীক্ষা কমিটি কর্তৃক অনুমোদিত]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ANSWER KEY & SOLUTION SHEET
         ========================================================================= */}
      {activeTab === 'answer-key' && (
        <div className="space-y-6">
          <div className="print:hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>উত্তরমালা ও সমাধান নির্দেশিকা (Answer Key & Solution)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                শিক্ষকদের খাতা মূল্যায়ন ও উত্তর মেলানোর সুবিধার জন্য অটোমেটিক উত্তরমালা তৈরি হয়েছে।
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>উত্তরমালা প্রিন্ট করুন</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="text-center border-b pb-3 space-y-1">
              <h2 className="text-lg font-bold text-slate-900">{coachingName}</h2>
              <div className="text-xs font-semibold text-emerald-700">
                {examTitle} — উত্তরমালা (Answer Key)
              </div>
              <div className="text-xs text-slate-500">
                বিষয়: {selectedSubject} • কোড: {subjectCode} • শ্রেণি: {className}
              </div>
            </div>

            {/* MCQ Answer Grid */}
            {mcqCount > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 bg-slate-100 p-2 rounded-lg">
                  বহুনির্বাচনী (MCQ) উত্তরমালা টেবিল:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {selectedQuestionItems
                    .filter(q => q.type === 'mcq')
                    .map((q, idx) => {
                      const mcq = q as MCQQuestion;
                      const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                      return (
                        <div key={mcq.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                          <span className="font-bold text-slate-700">প্রশ্ন {idx + 1}:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {labels[mcq.correctOption]}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Detailed MCQ Explanations */}
            {mcqCount > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 bg-slate-100 p-2 rounded-lg">
                  ব্যাখ্যাসহ সঠিক উত্তর বিশ্লেষণ:
                </h4>
                <div className="space-y-2">
                  {selectedQuestionItems
                    .filter(q => q.type === 'mcq')
                    .map((q, idx) => {
                      const mcq = q as MCQQuestion;
                      const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                      return (
                        <div key={mcq.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{idx + 1}. {mcq.question}</span>
                            <span className="text-emerald-700">সঠিক উত্তর: {labels[mcq.correctOption]} {mcq.options[mcq.correctOption]}</span>
                          </div>
                          {mcq.explanation && (
                            <p className="text-[11px] text-slate-600">
                              <strong>সমাধানের ব্যাখ্যা:</strong> {mcq.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TEACHER'S USER GUIDE
         ========================================================================= */}
      {activeTab === 'guide' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>শিক্ষকদের জন্য প্রশ্নপত্র তৈরির সহজ নির্দেশিকা ও গাইড</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              একজন শিক্ষক কীভাবে সহজেই কয়েক ক্লিকে একটি স্ট্যান্ডার্ড ও প্রফেশনাল পরীক্ষার প্রশ্নপত্র তৈরি ও প্রিন্ট করবেন তার ৪টি সহজ ধাপ:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-950 text-xs">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">১</span>
                <span>বিষয় ও ফরম্যাট নির্বাচন</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                প্রথমে মূল ৫টি বিষয়ের মধ্যে (পদার্থবিজ্ঞান, রসায়ন, গণিত, জীববিজ্ঞান বা আইসিটি) আপনার কাঙ্ক্ষিত বিষয়টি বেছে নিন। এরপর ৪টি ফরম্যাটের যেকোনো একটি (এমসিকিউ, সিকিউ, সমন্বিত বা পূর্ণাঙ্গ মডেল টেস্ট) নির্বাচন করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">২</span>
                <span>অধ্যায় ফিল্টার ও প্রশ্ন নির্বাচন</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                অধ্যায় ফিল্টার থেকে নির্দিষ্ট চ্যাপ্টার নির্বাচন করুন। প্রশ্ন ব্যাংকের প্রশ্নের বাম পাশের বক্সে টিক (চেক) চিহ্ন দিন। আপনার পছন্দমতো একাধিক চ্যাপ্টার থেকে প্রশ্ন বাছাই করতে পারেন। প্রয়োজন হলে "নতুন কাস্টম প্রশ্ন যোগ করুন" বাটনে ক্লিক করে নিজের নতুন প্রশ্নও যোগ করতে পারেন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">৩</span>
                <span>হেডার, পূর্ণমান ও জলছাপ কাস্টমাইজেশন</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোচিং সেন্টারের নাম ও পরীক্ষার নাম স্বয়ংক্রিয়ভাবে বসে যায়। আপনি চাইলে পরীক্ষার সময় (যেমন: ১ ঘণ্টা), পূর্ণমান (যেমন: ৫০ মার্ক) এবং বিশেষ নির্দেশিকা এডিট করতে পারবেন। এছাড়া সিকিউরিটির জন্য জলছাপ (Watermark) চালু রাখতে পারেন।
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-950 text-xs">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">৪</span>
                <span>A4 পেজে সরাসরি প্রিন্ট ও উত্তরমালা সংগ্রহ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "A4 প্রশ্নপত্র প্রিভিউ" বাটনে ক্লিক করে চূড়ান্ত প্রশ্নপত্র দেখুন এবং "A4 পেজে প্রিন্ট করুন" বাটনে চাপ দিয়ে সরাসরি প্রিন্টারে প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন। এছাড়া পরীক্ষার পর মূল্যায়নের জন্য "উত্তরপত্র / সলিউশন" ট্যাব থেকে অটোমেটিক সমাধান প্রিন্ট করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW CUSTOM QUESTION
         ========================================================================= */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>নতুন প্রশ্ন যুক্ত করুন ({selectedSubject})</span>
              </div>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCustomType('mcq')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                  customType === 'mcq'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                বহুনির্বাচনী প্রশ্ন (MCQ)
              </button>
              <button
                type="button"
                onClick={() => setCustomType('cq')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                  customType === 'cq'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                সৃজনশীল প্রশ্ন (CQ)
              </button>
            </div>

            <form onSubmit={handleSaveCustomQuestion} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">অধ্যায়ের নাম:</label>
                <input
                  type="text"
                  value={newMcqChapter}
                  onChange={e => setNewMcqChapter(e.target.value)}
                  placeholder="যেমন: গতি বা আলোর প্রতিফলন"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              {customType === 'mcq' ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্রশ্নটি লিখুন:</label>
                    <textarea
                      rows={2}
                      value={newMcqQuestion}
                      onChange={e => setNewMcqQuestion(e.target.value)}
                      placeholder="এখানে প্রশ্নের মূল অংশ টাইপ করুন..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700">৪টি বিকল্প উত্তর (অপশন):</label>
                    {['ক', 'খ', 'গ', 'ঘ'].map((lbl, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={newMcqCorrect === idx}
                          onChange={() => setNewMcqCorrect(idx as 0 | 1 | 2 | 3)}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="font-bold text-slate-700 w-6">({lbl})</span>
                        <input
                          type="text"
                          value={newMcqOptions[idx]}
                          onChange={e => {
                            const copy = [...newMcqOptions] as [string, string, string, string];
                            copy[idx] = e.target.value;
                            setNewMcqOptions(copy);
                          }}
                          placeholder={`অপশন ${lbl} লিখুন`}
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                    ))}
                    <span className="text-[11px] text-emerald-700">
                      * যে অপশনটি সঠিক উত্তর তার বাম পাশের রেডিও বাটনে টিক দিন।
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">সৃজনশীল উদ্দীপক:</label>
                    <textarea
                      rows={3}
                      value={newCqStimulus}
                      onChange={e => setNewCqStimulus(e.target.value)}
                      placeholder="এখানে অনুচ্ছেদ বা দৃশ্যকল্প লিখুন..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">ক. জ্ঞানমূলক (১ মার্ক):</label>
                      <input
                        type="text"
                        value={newCqA}
                        onChange={e => setNewCqA(e.target.value)}
                        placeholder="প্রশ্ন 'ক' লিখুন"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">খ. অনুধাবনমূলক (২ মার্ক):</label>
                      <input
                        type="text"
                        value={newCqB}
                        onChange={e => setNewCqB(e.target.value)}
                        placeholder="প্রশ্ন 'খ' লিখুন"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">গ. প্রয়োগমূলক (৩ মার্ক):</label>
                      <input
                        type="text"
                        value={newCqC}
                        onChange={e => setNewCqC(e.target.value)}
                        placeholder="প্রশ্ন 'গ' লিখুন"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">ঘ. উচ্চতর দক্ষতামূলক (৪ মার্ক):</label>
                      <input
                        type="text"
                        value={newCqD}
                        onChange={e => setNewCqD(e.target.value)}
                        placeholder="প্রশ্ন 'ঘ' লিখুন"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  প্রশ্ন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          PDF EXPORT & DOWNLOAD ASSISTANT MODAL
         ========================================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    A4 প্রশ্নপত্র পিডিএফ ডাউনলোড
                  </h3>
                  <p className="text-xs text-slate-500">
                    সহজেই অফলাইনে সেভ ও প্রিন্ট করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Question Summary Box */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>নির্বাচিত বিষয়:</span>
                <span className="font-bold text-slate-900">{selectedSubject} ({subjectCode})</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>মোট প্রশ্ন সংখ্যা:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {selectedQuestionItems.length} টি ({cqCount}টি CQ, {mcqCount}টি MCQ)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>পূর্ণমান ও সময়:</span>
                <span className="font-bold text-slate-900">
                  {customTotalMarks || calculatedTotalMarks} মার্ক • {duration}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>কাগজের আকার ও জলছাপ:</span>
                <span className="font-bold text-slate-900">
                  A4 পোর্ট্রেট • {watermarkEnabled ? 'অন (' + (watermarkText || coachingName) + ')' : 'অফ'}
                </span>
              </div>
            </div>

            {/* Quick Step Guide */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 text-xs text-cyan-950 space-y-1.5 mb-5">
              <div className="font-bold flex items-center gap-1.5 text-cyan-900">
                <Info className="w-4 h-4 text-cyan-700" />
                <span>কীভাবে PDF সেভ করবেন?</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed pl-1">
                <li>নিচের <strong>"সরাসরি A4 PDF সেভ করুন"</strong> বাটনে চাপ দিন।</li>
                <li>প্রিন্ট উইন্ডোর <strong>Destination / গন্তব্য</strong> অপশন থেকে <strong>"Save as PDF"</strong> নির্বাচন করুন।</li>
                <li><strong>Save / সংরক্ষণ করুন</strong> বাটনে চাপ দিন। আপনার এ৪ প্রশ্নপত্রটি সাথে সাথে অফলাইনে ডাউনলোড হয়ে যাবে।</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowPdfModal(false);
                  handleDownloadPdf();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-emerald-700/30 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Download className="w-4 h-4" />
                <span>সরাসরি A4 PDF সেভ করুন (Save as PDF)</span>
              </button>

              <button
                onClick={() => {
                  setShowPdfModal(false);
                  handleDownloadOfflineHtml();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition border border-slate-200"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>অফলাইন HTML ফাইল ডাউনলোড করুন (.html)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
