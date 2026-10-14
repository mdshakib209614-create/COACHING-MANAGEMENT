import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Settings2, 
  Layers, 
  Clock, 
  Award, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  ArrowUpDown, 
  Download, 
  School, 
  BookOpen, 
  FileSpreadsheet, 
  HelpCircle,
  AlertCircle,
  Copy,
  FoldHorizontal,
  Bookmark,
  Save,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LandscapeBookletPreview } from './LandscapeBookletPreview';
import { 
  QuestionItem, 
  MCQQuestion, 
  CQQuestion, 
  ShortQuestion, 
  ExamQuestionFormat,
  ExamPaperConfig
} from '../types';
import { subjectsList, chaptersBySubject } from '../data/chaptersData';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { exportElementsToPDF } from '../utils/pdfExport';

export type PaperSectionPattern = 
  | 'k_kh_g'        // ক, খ, গ বিভাগ (ক: এমসিকিউ, খ: শর্ট, গ: সিকিউ)
  | 'mcq_only'      // শুধু এমসিকিউ
  | 'cq_only'       // শুধু সিকিউ
  | 'short_only'    // শুধু সংক্ষিপ্ত প্রশ্ন
  | 'k_kh_mcq_cq';  // ক ও খ বিভাগ (ক: এমসিকিউ, খ: সিকিউ)

interface DraftPaperConfig {
  academyName: string;
  examTitle: string;
  subject: string;
  subjectCode: string;
  className: string;
  section: string;
  totalMarks: string;
  duration: string;
  pattern: PaperSectionPattern;
  instructions: string;
  isCreated: boolean;
}

interface QuestionPaperMakerViewProps {
  initialTab?: 'builder' | 'preview' | 'saved-papers';
}

export const QuestionPaperMakerView: React.FC<QuestionPaperMakerViewProps> = ({ initialTab = 'builder' }) => {
  const { 
    institution, 
    questions, 
    addCustomQuestion, 
    savedExamPapers, 
    saveExamPaper, 
    deleteExamPaper, 
    examNavIntent 
  } = useApp();

  // Mode: 'builder' (making and adding questions) vs 'preview' (A4 print preview) vs 'saved-papers' (saved papers list)
  const [viewMode, setViewMode] = useState<'builder' | 'preview' | 'saved-papers'>(initialTab);

  // Saved Paper Metadata
  const [paperTitle, setPaperTitle] = useState<string>('');
  const [currentPaperId, setCurrentPaperId] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Print Layout Mode: 'standard_portrait' (A4 Single/2-Col) vs 'landscape_booklet' (Landscape 4-Section Fold)
  const [paperLayoutMode, setPaperLayoutMode] = useState<'standard_portrait' | 'landscape_booklet'>('landscape_booklet');

  // Step 1: Format Blueprint State
  const [config, setConfig] = useState<DraftPaperConfig>({
    academyName: institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
    examTitle: 'মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬',
    subject: 'পদার্থবিজ্ঞান',
    subjectCode: '১৭৪',
    className: '১০ম শ্রেণি (SSC পরীক্ষার্থী)',
    section: 'ক শাখা (বিজ্ঞান)',
    totalMarks: '১০০',
    duration: '২ ঘণ্টা ৩০ মিনিট',
    pattern: 'k_kh_g',
    instructions: 'বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। ক বিভাগের সকল প্রশ্ন এবং গ বিভাগের যেকোনো ৫টি প্রশ্নের উত্তর দাও।',
    isCreated: true // starts with a pre-configured ready format!
  });

  // Controls whether format configuration accordion/panel is open
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);

  // Selected Questions sorted by Section
  // Starts completely blank for a clean custom paper!
  const [sectionKQuestions, setSectionKQuestions] = useState<QuestionItem[]>([]);
  const [sectionKhQuestions, setSectionKhQuestions] = useState<QuestionItem[]>([]);
  const [sectionGQuestions, setSectionGQuestions] = useState<QuestionItem[]>([]);

  // Picker drawer / modal for adding questions
  const [showAddDrawer, setShowAddDrawer] = useState<boolean>(false);
  const [targetSectionForAdd, setTargetSectionForAdd] = useState<'auto' | 'k' | 'kh' | 'g'>('auto');
  const [pickerSubject, setPickerSubject] = useState<string>('পদার্থবিজ্ঞান');
  const [pickerChapter, setPickerChapter] = useState<string>('সব অধ্যায়');
  const [pickerType, setPickerType] = useState<'all' | 'mcq' | 'cq' | 'short'>('all');
  const [pickerSearch, setPickerSearch] = useState<string>('');

  // Swap / Replace Modal
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [questionToSwap, setQuestionToSwap] = useState<{ section: 'k' | 'kh' | 'g'; index: number; question: QuestionItem } | null>(null);

  // Edit Question Modal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{ section: 'k' | 'kh' | 'g'; index: number; question: QuestionItem } | null>(null);

  // Custom question writing form
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customType, setCustomType] = useState<'mcq' | 'cq' | 'short'>('mcq');
  const [customQuestionText, setCustomQuestionText] = useState<string>('');
  const [customStimulus, setCustomStimulus] = useState<string>('');
  const [customOptions, setCustomOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [customCorrect, setCustomCorrect] = useState<0 | 1 | 2 | 3>(0);
  const [customMarks, setCustomMarks] = useState<number>(1);
  const [customSubQuestions, setCustomSubQuestions] = useState<{ label: 'ক' | 'খ' | 'গ' | 'ঘ'; question: string; marks: number }[]>([
    { label: 'ক', question: '', marks: 1 },
    { label: 'খ', question: '', marks: 2 },
    { label: 'গ', question: '', marks: 3 },
    { label: 'ঘ', question: '', marks: 4 }
  ]);

  // Print settings
  const [printColumns, setPrintColumns] = useState<1 | 2>(2);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>(institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি');
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotificationMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Synchronize initialTab
  useEffect(() => {
    if (initialTab) {
      setViewMode(initialTab);
    }
  }, [initialTab]);


  // Synchronize picker subject with config subject when changed
  useEffect(() => {
    if (config.subject && subjectsList.includes(config.subject)) {
      setPickerSubject(config.subject);
    }
  }, [config.subject]);

  // Calculate current marks per section and total
  const sectionKMarks = useMemo(() => {
    return sectionKQuestions.reduce((acc, q) => acc + (q.marks || 1), 0);
  }, [sectionKQuestions]);

  const sectionKhMarks = useMemo(() => {
    return sectionKhQuestions.reduce((acc, q) => acc + (q.marks || 2), 0);
  }, [sectionKhQuestions]);

  const sectionGMarks = useMemo(() => {
    return sectionGQuestions.reduce((acc, q) => acc + (q.marks || 10), 0);
  }, [sectionGQuestions]);

  const currentTotalMarks = sectionKMarks + sectionKhMarks + sectionGMarks;

  // Filtered Question Bank for the Question Picker
  const filteredPickerQuestions = useMemo(() => {
    return questions.filter(q => {
      // Subject filter (allows 'সব বিষয়' for mixed exams!)
      if (pickerSubject !== 'সব বিষয়' && q.subject !== pickerSubject) {
        return false;
      }
      // Chapter filter
      if (pickerChapter !== 'সব অধ্যায়' && q.chapter !== pickerChapter) {
        return false;
      }
      // Type filter
      if (pickerType !== 'all' && q.type !== pickerType) {
        return false;
      }
      // Search
      if (pickerSearch.trim()) {
        const query = pickerSearch.toLowerCase();
        const inPrompt = q.type === 'cq' 
          ? (q.stimulus + ' ' + q.subQuestions.map(sq => sq.question).join(' ')).toLowerCase()
          : (q.question || '').toLowerCase();
        const inBoard = (q.boardInfo || '').toLowerCase();
        if (!inPrompt.includes(query) && !inBoard.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [questions, pickerSubject, pickerChapter, pickerType, pickerSearch]);

  // Check if a question is already added in the paper
  const isQuestionAdded = (id: string): boolean => {
    return (
      sectionKQuestions.some(q => q.id === id) ||
      sectionKhQuestions.some(q => q.id === id) ||
      sectionGQuestions.some(q => q.id === id)
    );
  };

  // User flow: Add question with automatic routing based on question type!
  // "যদি ক খ গ বিভাগ হয় তাহলে এমসিকিউ সিলেক্ট করার সঙ্গে সেটা ক বিভাগের আন্ডারে প্রশ্নপত্রের নিচে অ্যাড হয়ে যাবে এবং শর্ট কোশ্চেন সিলেক্ট করলে সেটা খ বিভাগের নিচে অ্যাড হয়ে যাবে এবং সিকিউ সিলেক্ট করলে সেটা গ বিভাগের নিচে অ্যাড হয়ে যাবে।"
  const handleAddQuestionToPaper = (question: QuestionItem) => {
    if (isQuestionAdded(question.id)) {
      showNotificationMsg('এই প্রশ্নটি ইতোমধ্যে প্রশ্নপত্রে যুক্ত করা হয়েছে!');
      return;
    }

    if (config.pattern === 'mcq_only') {
      setSectionKQuestions(prev => [...prev, question]);
      showNotificationMsg(`এমসিকিউ প্রশ্ন যুক্ত হয়েছে! মোট এমসিকিউ: ${toBengaliNumber(sectionKQuestions.length + 1)}টি`);
      return;
    }

    if (config.pattern === 'cq_only') {
      setSectionGQuestions(prev => [...prev, question]);
      showNotificationMsg(`সৃজনশীল প্রশ্ন যুক্ত হয়েছে! মোট সিকিউ: ${toBengaliNumber(sectionGQuestions.length + 1)}টি`);
      return;
    }

    if (config.pattern === 'short_only') {
      setSectionKhQuestions(prev => [...prev, question]);
      showNotificationMsg(`সংক্ষিপ্ত প্রশ্ন যুক্ত হয়েছে! মোট প্রশ্ন: ${toBengaliNumber(sectionKhQuestions.length + 1)}টি`);
      return;
    }

    // Default 'k_kh_g' or 'k_kh_mcq_cq':
    if (question.type === 'mcq') {
      setSectionKQuestions(prev => [...prev, question]);
      showNotificationMsg(`'ক' বিভাগ (MCQ)-এ প্রশ্ন যুক্ত হয়েছে!`);
    } else if (question.type === 'short') {
      setSectionKhQuestions(prev => [...prev, question]);
      showNotificationMsg(`'খ' বিভাগ (সংক্ষিপ্ত প্রশ্ন)-এ প্রশ্ন যুক্ত হয়েছে!`);
    } else if (question.type === 'cq') {
      setSectionGQuestions(prev => [...prev, question]);
      showNotificationMsg(`'গ' বিভাগ (সৃজনশীল CQ)-এ প্রশ্ন যুক্ত হয়েছে!`);
    }
  };

  // Remove question from a section
  const handleRemoveQuestion = (section: 'k' | 'kh' | 'g', index: number) => {
    if (section === 'k') {
      setSectionKQuestions(prev => prev.filter((_, i) => i !== index));
    } else if (section === 'kh') {
      setSectionKhQuestions(prev => prev.filter((_, i) => i !== index));
    } else if (section === 'g') {
      setSectionGQuestions(prev => prev.filter((_, i) => i !== index));
    }
    showNotificationMsg('প্রশ্নটি প্রশ্নপত্র থেকে সরানো হয়েছে।');
  };

  // Swap question: replace selected question with another from question bank
  const handleConfirmSwap = (newQuestion: QuestionItem) => {
    if (!questionToSwap) return;
    const { section, index } = questionToSwap;

    if (section === 'k') {
      setSectionKQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    } else if (section === 'kh') {
      setSectionKhQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    } else if (section === 'g') {
      setSectionGQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    }

    setSwapModalOpen(false);
    setQuestionToSwap(null);
    showNotificationMsg('প্রশ্নটি সফলভাবে নতুন প্রশ্ন দিয়ে প্রতিস্থাপন করা হয়েছে!');
  };

  // Move question up/down
  const handleReorderQuestion = (section: 'k' | 'kh' | 'g', index: number, direction: 'up' | 'down') => {
    const list = section === 'k' ? [...sectionKQuestions] : section === 'kh' ? [...sectionKhQuestions] : [...sectionGQuestions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    if (section === 'k') setSectionKQuestions(list);
    else if (section === 'kh') setSectionKhQuestions(list);
    else setSectionGQuestions(list);
  };

  // Save edited question
  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return;
    const { section, index, question } = editingQuestion;

    if (section === 'k') {
      setSectionKQuestions(prev => prev.map((q, i) => i === index ? question : q));
    } else if (section === 'kh') {
      setSectionKhQuestions(prev => prev.map((q, i) => i === index ? question : q));
    } else if (section === 'g') {
      setSectionGQuestions(prev => prev.map((q, i) => i === index ? question : q));
    }

    setEditModalOpen(false);
    setEditingQuestion(null);
    showNotificationMsg('প্রশ্নের পরিবর্তন সংরক্ষিত হয়েছে!');
  };

  // Create Custom Question and immediately route into appropriate section
  const handleCreateCustomQuestion = () => {
    if (customType === 'mcq') {
      if (!customQuestionText.trim() || !customOptions[0].trim() || !customOptions[1].trim()) {
        alert('দয়া করে এমসিকিউ প্রশ্ন এবং অন্তত প্রথম ২টি অপশন লিখুন।');
        return;
      }
      const newMcq: MCQQuestion = {
        id: `custom-mcq-${Date.now()}`,
        subject: config.subject,
        chapter: 'কাস্টম প্রশ্ন',
        question: customQuestionText,
        options: [...customOptions],
        correctOption: customCorrect,
        marks: customMarks || 1,
        type: 'mcq',
        importance: 'very_high'
      };
      addCustomQuestion(newMcq);
      handleAddQuestionToPaper(newMcq);
    } else if (customType === 'short') {
      if (!customQuestionText.trim()) {
        alert('দয়া করে সংক্ষিপ্ত প্রশ্নটি লিখুন।');
        return;
      }
      const newShort: ShortQuestion = {
        id: `custom-short-${Date.now()}`,
        subject: config.subject,
        chapter: 'কাস্টম প্রশ্ন',
        question: customQuestionText,
        marks: customMarks || 2,
        type: 'short',
        importance: 'very_high'
      };
      addCustomQuestion(newShort);
      handleAddQuestionToPaper(newShort);
    } else if (customType === 'cq') {
      if (!customStimulus.trim() || !customSubQuestions[0].question.trim()) {
        alert('দয়া করে উদ্দীপক এবং অন্তত "ক" উপ-প্রশ্নটি লিখুন।');
        return;
      }
      const newCq: CQQuestion = {
        id: `custom-cq-${Date.now()}`,
        subject: config.subject,
        chapter: 'কাস্টম প্রশ্ন',
        stimulus: customStimulus,
        subQuestions: [...customSubQuestions],
        marks: 10,
        type: 'cq',
        importance: 'very_high'
      };
      addCustomQuestion(newCq);
      handleAddQuestionToPaper(newCq);
    }

    // Reset form
    setCustomQuestionText('');
    setCustomStimulus('');
    setCustomOptions(['', '', '', '']);
    setShowCustomModal(false);
  };

  // Format creation handler (Blueprint confirmation)
  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(prev => ({ ...prev, isCreated: true }));
    setShowConfigPanel(false);
    if (sectionKQuestions.length === 0 && sectionKhQuestions.length === 0 && sectionGQuestions.length === 0) {
      showNotificationMsg('✨ প্রশ্নপত্রের হেডার তৈরি হয়েছে! সম্পূর্ণ ২টি ব্ল্যাঙ্ক পেজ প্রস্তুত। এবার পছন্দমতো প্রশ্ন যোগ করুন।');
    } else {
      showNotificationMsg('✨ প্রশ্নপত্রের ফরম্যাট সফলভাবে আপডেট করা হয়েছে!');
    }
  };

  // Reset to a brand new blank question paper
  const handleCreateNewBlankPaper = () => {
    setSectionKQuestions([]);
    setSectionKhQuestions([]);
    setSectionGQuestions([]);
    setCurrentPaperId('');
    setPaperTitle('');
    setConfig(prev => ({
      ...prev,
      isCreated: false
    }));
    setShowConfigPanel(true);
    setViewMode('builder');
    showNotificationMsg('✨ নতুন প্রশ্নপত্র তৈরির পাতা প্রস্তুত! হেডার তথ্য পূরণ করে "প্রশ্নপত্র তৈরি করুন" বাটনে চাপ দিন।');
  };

  // Open Save Modal
  const handleOpenSaveModal = () => {
    if (!paperTitle.trim()) {
      setPaperTitle(`${config.className} ${config.subject} - ${config.examTitle}`);
    }
    setShowSaveModal(true);
  };

  // Confirm and persist to savedExamPapers in AppContext
  const handleConfirmSave = () => {
    const paperId = currentPaperId || `paper-${Date.now()}`;
    const title = paperTitle.trim() || `${config.className} ${config.subject} - ${config.examTitle}`;
    
    const paperToSave: ExamPaperConfig = {
      id: paperId,
      paperTitle: title,
      coachingName: config.academyName,
      examTitle: config.examTitle,
      subject: config.subject,
      subjectCode: config.subjectCode,
      class: config.className,
      section: config.section,
      duration: config.duration,
      totalMarks: parseInt(config.totalMarks, 10) || 100,
      format: config.pattern === 'mcq_only' ? 'mcq' : config.pattern === 'cq_only' ? 'cq' : 'combined',
      pattern: config.pattern,
      pageLayout: 'two_column',
      paperLayoutMode: paperLayoutMode,
      instructions: config.instructions,
      watermark: {
        enabled: showWatermark,
        type: 'text',
        text: watermarkText,
        opacity: 0.08
      },
      columns: printColumns,
      showAnswersInPrint: showAnswerKey,
      selectedQuestionIds: [
        ...sectionKQuestions.map(q => q.id),
        ...sectionKhQuestions.map(q => q.id),
        ...sectionGQuestions.map(q => q.id)
      ],
      customQuestions: [],
      sectionKQuestions: [...sectionKQuestions],
      sectionKhQuestions: [...sectionKhQuestions],
      sectionGQuestions: [...sectionGQuestions],
      date: new Date().toLocaleDateString('bn-BD'),
      createdAt: new Date().toISOString()
    };

    saveExamPaper(paperToSave);
    setCurrentPaperId(paperId);
    setShowSaveModal(false);
    showNotificationMsg(`✅ "${title}" প্রশ্নপত্রটি সফলভাবে সংরক্ষিত হয়েছে! "প্রশ্নপত্রসমূহ" তালিকায় এটি যুক্ত হয়েছে।`);
  };

  // Load a saved paper into builder or preview
  const handleLoadSavedPaper = (paper: ExamPaperConfig, targetMode: 'preview' | 'builder' = 'preview') => {
    setCurrentPaperId(paper.id);
    setPaperTitle(paper.paperTitle || `${paper.class} ${paper.subject} - ${paper.examTitle}`);
    
    setConfig({
      academyName: paper.coachingName || institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
      examTitle: paper.examTitle || 'মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬',
      subject: paper.subject || 'পদার্থবিজ্ঞান',
      subjectCode: paper.subjectCode || '১৭৪',
      className: paper.class || '১০ম শ্রেণি (SSC পরীক্ষার্থী)',
      section: paper.section || 'ক শাখা (বিজ্ঞান)',
      totalMarks: String(paper.totalMarks || 100),
      duration: paper.duration || '২ ঘণ্টা ৩০ মিনিট',
      pattern: (paper.pattern as any) || 'k_kh_g',
      instructions: paper.instructions || 'বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক।',
      isCreated: true
    });

    if (paper.paperLayoutMode) {
      setPaperLayoutMode(paper.paperLayoutMode);
    }
    if (paper.watermark) {
      setShowWatermark(paper.watermark.enabled);
      setWatermarkText(paper.watermark.text || institution.nameBn);
    }
    if (paper.showAnswersInPrint !== undefined) {
      setShowAnswerKey(paper.showAnswersInPrint);
    }

    if (paper.sectionKQuestions && paper.sectionKQuestions.length > 0) {
      setSectionKQuestions(paper.sectionKQuestions);
    } else if (paper.selectedQuestionIds && paper.selectedQuestionIds.length > 0) {
      const matched = questions.filter(q => paper.selectedQuestionIds.includes(q.id));
      setSectionKQuestions(matched.filter(q => q.type === 'mcq'));
    } else {
      setSectionKQuestions([]);
    }

    if (paper.sectionKhQuestions && paper.sectionKhQuestions.length > 0) {
      setSectionKhQuestions(paper.sectionKhQuestions);
    } else if (paper.selectedQuestionIds && paper.selectedQuestionIds.length > 0) {
      const matched = questions.filter(q => paper.selectedQuestionIds.includes(q.id));
      setSectionKhQuestions(matched.filter(q => q.type === 'short'));
    } else {
      setSectionKhQuestions([]);
    }

    if (paper.sectionGQuestions && paper.sectionGQuestions.length > 0) {
      setSectionGQuestions(paper.sectionGQuestions);
    } else if (paper.selectedQuestionIds && paper.selectedQuestionIds.length > 0) {
      const matched = questions.filter(q => paper.selectedQuestionIds.includes(q.id));
      setSectionGQuestions(matched.filter(q => q.type === 'cq'));
    } else {
      setSectionGQuestions([]);
    }

    setViewMode(targetMode);
    showNotificationMsg(`📄 "${paper.paperTitle || paper.examTitle}" প্রশ্নপত্রটি সফলভাবে লোড করা হয়েছে!`);
  };

  // State for tracking PDF download per paper in Archive
  const [downloadingPaperId, setDownloadingPaperId] = useState<string | null>(null);

  // Download a saved paper directly as a multi-page PDF from Archive
  const handleDownloadSavedPaper = async (paper: ExamPaperConfig) => {
    setDownloadingPaperId(paper.id);
    handleLoadSavedPaper(paper, 'preview');
    setPaperLayoutMode('landscape_booklet');
    showNotificationMsg(`⏳ "${paper.paperTitle || paper.examTitle}" এর পূর্ণাঙ্গ পিডিএফ প্রস্তুত হচ্ছে...`);

    setTimeout(async () => {
      try {
        const cleanFileName = (paper.paperTitle || `${paper.class}_${paper.subject}_${paper.examTitle}`)
          .replace(/[/\\?%*:|"<>]/g, '_')
          .replace(/\s+/g, '_');
        
        const success = await exportElementsToPDF(['booklet-sheet-1', 'booklet-sheet-2'], {
          fileName: `${cleanFileName}_Booklet.pdf`,
          orientation: 'landscape'
        });

        if (!success) {
          window.print();
        } else {
          showNotificationMsg(`✅ "${paper.paperTitle || paper.examTitle}" সফলভাবে পিডিএফ ফাইল হিসেবে ডাউনলোড হয়েছে!`);
        }
      } catch (err) {
        console.error('PDF export error:', err);
        window.print();
      } finally {
        setDownloadingPaperId(null);
      }
    }, 600);
  };

  // Print a saved paper immediately
  const handlePrintSavedPaper = (paper: ExamPaperConfig) => {
    handleLoadSavedPaper(paper, 'preview');
    setTimeout(() => {
      handlePrint();
    }, 400);
  };

  // Synchronize with navigation intents from Sidebar
  useEffect(() => {
    if (!examNavIntent) return;

    if (examNavIntent.paperId) {
      const found = savedExamPapers.find(p => p.id === examNavIntent.paperId);
      if (found) {
        handleLoadSavedPaper(found, examNavIntent.tab === 'builder' ? 'builder' : 'preview');
        return;
      }
    }

    if (examNavIntent.tab === 'saved-papers') {
      setViewMode('saved-papers');
    } else if (examNavIntent.tab === 'preview') {
      setViewMode('preview');
    } else if (examNavIntent.tab === 'builder') {
      setViewMode('builder');
    }

    if (examNavIntent.action === 'preset_board' && examNavIntent.tab === 'builder') {
      // Create new blank paper
      handleCreateNewBlankPaper();
    }
  }, [examNavIntent, savedExamPapers]);

  // Print Question Paper trigger with dynamic page orientation
  const handlePrint = () => {
    const styleId = 'dynamic-booklet-landscape-print-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    if (paperLayoutMode === 'landscape_booklet') {
      styleTag.innerHTML = `
        @media print {
          @page {
            size: landscape !important;
            margin: 4mm 4mm 4mm 4mm !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .booklet-print-sheet {
            page-break-after: always !important;
            break-after: page !important;
            width: 100% !important;
            height: 100vh !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .booklet-print-sheet:last-of-type {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `;
    } else {
      styleTag.innerHTML = `
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 8mm 8mm 8mm 8mm !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
        }
      `;
    }
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-['Hind_Siliguri',sans-serif]">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Main Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  প্রশ্নপত্র তৈরি ও প্রিন্ট স্টুডিও
                </h1>
                {paperTitle && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 truncate max-w-xs">
                    {paperTitle}
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-slate-500">
                ক, খ, গ বিভাগীয় ফরম্যাট • ১০০ মার্কের ৪-সেকশন ল্যান্ডস্কেপ ভাঁজ বুকলেট ও স্ট্যান্ডার্ড পোর্ট্রেট প্রিন্ট
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Tabs */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 flex-wrap justify-between lg:justify-end">
          {/* New Blank Paper Button */}
          <button
            id="btn-create-new-blank-paper"
            onClick={handleCreateNewBlankPaper}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs md:text-sm transition cursor-pointer flex items-center gap-1.5"
            title="সব প্রশ্ন খালি করে সম্পূর্ণ নতুন ব্ল্যাঙ্ক প্রশ্নপত্র তৈরি করুন"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>নতুন প্রশ্নপত্র তৈরি</span>
          </button>

          {/* View Mode Switcher Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 flex-wrap">
            <button
              onClick={() => setViewMode('builder')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'builder'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>প্রশ্নপত্র বিল্ডার</span>
            </button>

            <button
              onClick={() => {
                setViewMode('preview');
                setPaperLayoutMode('landscape_booklet');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'preview' && paperLayoutMode === 'landscape_booklet'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="১০০ নম্বরের মডেল টেস্ট: ২টি ল্যান্ডস্কেপ পেজ (এপিডোবিট প্রিন্ট ও মাঝখানে ভাঁজ)"
            >
              <FoldHorizontal className="w-3.5 h-3.5" />
              <span>৪-পৃষ্ঠা বুকলেট</span>
            </button>

            <button
              onClick={() => {
                setViewMode('preview');
                setPaperLayoutMode('standard_portrait');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'preview' && paperLayoutMode === 'standard_portrait'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>পোর্ট্রেট A4</span>
            </button>

            <button
              onClick={() => setViewMode('saved-papers')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'saved-papers'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>প্রশ্নপত্র আর্কাইভ</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                {toBengaliNumber(savedExamPapers.length)}
              </span>
            </button>
          </div>

          {/* Save Button */}
          <button
            id="btn-save-paper-top"
            onClick={handleOpenSaveModal}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs md:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            title="বর্তমান প্রশ্নপত্রটি সেভ করুন"
          >
            <Save className="w-3.5 h-3.5 text-teal-200" />
            <span>সেভ করুন</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-900/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Step 1: Format Blueprint & Header Configuration Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
        <div 
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="p-4 md:p-5 bg-gradient-to-r from-slate-50 to-emerald-50/40 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ১
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  প্রশ্নপত্রের ফরম্যাট ও একাডেমি হেডার নির্ধারণ
                </h2>
                {config.isCreated ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> ফরম্যাট প্রস্তুত
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    সেট করুন
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                একাডেমির নাম, বিষয়, পূর্ণমান, সময় ও ক-খ-গ বিভাগীয় ধরণ ড্রপডাউন থেকে নির্বাচন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hidden sm:inline">
              {showConfigPanel ? 'সংকুচিত করুন' : 'পরিবর্তন / এডিট করুন'}
            </span>
            {showConfigPanel ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </div>
        </div>

        {/* Blueprint Form Body */}
        {showConfigPanel && (
          <form onSubmit={handleCreateBlueprint} className="p-4 md:p-6 space-y-5 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Academy Name Dropdown / Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-emerald-600" />
                  <span>একাডেমির নাম (কোচিং / প্রতিষ্ঠান)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.academyName}
                    onChange={(e) => setConfig({ ...config, academyName: e.target.value })}
                    placeholder="প্রতিষ্ঠানের নাম লিখুন..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                    required
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap text-[11px] text-slate-400">
                  <span className="text-slate-500 font-semibold">প্রস্তাবিত:</span>
                  <button 
                    type="button" 
                    onClick={() => setConfig({ ...config, academyName: institution.nameBn })}
                    className="text-emerald-600 hover:underline cursor-pointer"
                  >
                    {institution.nameBn}
                  </button>
                </div>
              </div>

              {/* Exam Title Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পরীক্ষার নাম / মূল্যায়ন শিরোনাম</span>
                </label>
                <select
                  value={config.examTitle}
                  onChange={(e) => setConfig({ ...config, examTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬">মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="১ম সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬">১ম সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="২য় সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬">২য় সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="বার্ষিক পরীক্ষা - ২০২৬">বার্ষিক পরীক্ষা - ২০২৬</option>
                  <option value="প্রাক-নির্বাচনী মূল্যায়ন পরীক্ষা - ২০২৬">প্রাক-নির্বাচনী মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="এসএসসি টেস্ট পরীক্ষা (নির্বাচনী) - ২০২৬">এসএসসি টেস্ট পরীক্ষা (নির্বাচনী) - ২০২৬</option>
                  <option value="সাপ্তাহিক স্পেশাল টেস্ট - ২০২৬">সাপ্তাহিক স্পেশাল টেস্ট - ২০২৬</option>
                  <option value="অধ্যায়ভিত্তিক স্পেশাল মূল্যায়ন টেস্ট">অধ্যায়ভিত্তিক স্পেশাল মূল্যায়ন টেস্ট</option>
                </select>
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>বিষয় নির্বাচন</span>
                </label>
                <select
                  value={config.subject}
                  onChange={(e) => {
                    const newSub = e.target.value;
                    let code = '১৭৪';
                    if (newSub === 'রসায়ন') code = '১৭৬';
                    else if (newSub === 'সাধারণ গণিত') code = '১০৯';
                    else if (newSub === 'উচ্চতর গণিত') code = '১২৬';
                    else if (newSub === 'জীববিজ্ঞান') code = '১৭৮';
                    else if (newSub === 'তথ্য ও যোগাযোগ প্রযুক্তি') code = '১৫৪';
                    setConfig({ ...config, subject: newSub, subjectCode: code });
                    setPickerSubject(newSub);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  {subjectsList.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="সমন্বিত যৌথ বিষয় (বিজ্ঞান বিভাগ)">সমন্বিত যৌথ বিষয় (বিজ্ঞান বিভাগ)</option>
                </select>
              </div>

              {/* Class & Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>শ্রেণি ও শাখা</span>
                </label>
                <select
                  value={config.className}
                  onChange={(e) => setConfig({ ...config, className: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="১০ম শ্রেণি (SSC পরীক্ষার্থী)">১০ম শ্রেণি (SSC পরীক্ষার্থী)</option>
                  <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                  <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                  <option value="বিজ্ঞান বিভাগ">বিজ্ঞান বিভাগ</option>
                  <option value="ব্যবসায় শিক্ষা বিভাগ">ব্যবসায় শিক্ষা বিভাগ</option>
                  <option value="মানবিক বিভাগ">মানবিক বিভাগ</option>
                </select>
              </div>

              {/* Total Marks Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পূর্ণমান (Total Marks)</span>
                </label>
                <select
                  value={config.totalMarks}
                  onChange={(e) => setConfig({ ...config, totalMarks: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="১০০">১০০ মার্ক (পূর্ণাঙ্গ বোর্ড পরীক্ষা)</option>
                  <option value="৭৫">৭৫ মার্ক (তত্ত্বীয় পরীক্ষা)</option>
                  <option value="৫০">৫০ মার্ক (অর্ধেক সিলেবাস)</option>
                  <option value="৪০">৪০ মার্ক</option>
                  <option value="৩০">৩০ মার্ক (মডেল টেস্ট)</option>
                  <option value="২৫">২৫ মার্ক (ক্লাস টেস্ট)</option>
                  <option value="২০">২০ মার্ক (কুইজ টেস্ট)</option>
                </select>
              </div>

              {/* Duration Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>সময় (Duration)</span>
                </label>
                <select
                  value={config.duration}
                  onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="৩ ঘণ্টা">৩ ঘণ্টা</option>
                  <option value="২ ঘণ্টা ৩০ মিনিট">২ ঘণ্টা ৩০ মিনিট</option>
                  <option value="২ ঘণ্টা">২ ঘণ্টা</option>
                  <option value="১ ঘণ্টা ৩০ মিনিট">১ ঘণ্টা ৩০ মিনিট</option>
                  <option value="১ ঘণ্টা">১ ঘণ্টা</option>
                  <option value="৪৫ মিনিট">৪৫ মিনিট</option>
                  <option value="৩০ মিনিট">৩০ মিনিট</option>
                </select>
              </div>
            </div>

            {/* Department / Question Structure Selection */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                প্রশ্নপত্রের ধরণ ও বিভাগীয় গঠন (Question Paper Structure)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'k_kh_g'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'k_kh_g'}
                    onChange={() => setConfig({ ...config, pattern: 'k_kh_g' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      ক, খ, গ বিভাগ ভিত্তিক প্রশ্নপত্র
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ক: বহুনির্বাচনী (MCQ) • খ: সংক্ষিপ্ত প্রশ্ন • গ: সৃজনশীল (CQ)
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'mcq_only'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'mcq_only'}
                    onChange={() => setConfig({ ...config, pattern: 'mcq_only' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      শুধু বহুনির্বাচনী প্রশ্নপত্র (MCQ Only)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ৩০/২৫/৫০টি এমসিকিউ প্রশ্ন নিয়ে তৈরি একক প্রশ্নপত্র
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'cq_only'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'cq_only'}
                    onChange={() => setConfig({ ...config, pattern: 'cq_only' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      শুধু সৃজনশীল প্রশ্নপত্র (CQ Only)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      উদ্দীপক ও (ক, খ, গ, ঘ) যুক্ত পূর্ণাঙ্গ সৃজনশীল প্রশ্নমালা
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'short_only'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'short_only'}
                    onChange={() => setConfig({ ...config, pattern: 'short_only' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      শুধু সংক্ষিপ্ত প্রশ্নপত্র (Short Question)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ১ ও ২ মার্কের জ্ঞানমূলক ও অনুধাবনমূলক প্রশ্নোত্তর
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'k_kh_mcq_cq'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'k_kh_mcq_cq'}
                    onChange={() => setConfig({ ...config, pattern: 'k_kh_mcq_cq' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      ক ও খ বিভাগ (MCQ + CQ)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ক বিভাগ: বহুনির্বাচনী • খ বিভাগ: সৃজনশীল
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit / Create Blueprint Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 transition cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>প্রশ্নপত্র তৈরি করুন (ব্ল্যাঙ্ক শিট ক্রিয়েট) →</span>
              </button>
            </div>
          </form>
        )}

        {/* Compact Summary Bar when config panel is closed */}
        {!showConfigPanel && (
          <div className="px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-medium text-slate-600 flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span><strong>প্রতিষ্ঠান:</strong> {config.academyName}</span>
              <span className="text-slate-300">|</span>
              <span><strong>পরীক্ষা:</strong> {config.examTitle}</span>
              <span className="text-slate-300">|</span>
              <span><strong>বিষয়:</strong> {config.subject}</span>
              <span className="text-slate-300">|</span>
              <span><strong>সময়:</strong> {config.duration}</span>
              <span className="text-slate-300">|</span>
              <span><strong>নির্ধারিত পূর্ণমান:</strong> {config.totalMarks}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <span>মোট সংগৃহীত মার্ক: {toBengaliNumber(currentTotalMarks)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Body: Either Builder Mode or Preview Mode */}
      {viewMode === 'builder' ? (
        !config.isCreated ? (
          <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-dashed border-emerald-300 shadow-sm text-center max-w-2xl mx-auto my-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                ধাপ ১: প্রশ্নপত্রের হেডার ও প্রয়োজনীয় তথ্য সেটআপ
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                উপরের বক্সে প্রতিষ্ঠানের নাম, পরীক্ষার নাম, বিষয়, শ্রেণি ও প্রশ্নের প্যাটার্ন নির্বাচন করে 
                <strong className="text-emerald-700"> "প্রশ্নপত্র তৈরি করুন (ব্ল্যাঙ্ক শিট ক্রিয়েট)" </strong> 
                বাটনে চাপ দিন। আপনার দেওয়া তথ্য দিয়ে সম্পূর্ণ ২টি ব্ল্যাঙ্ক পেজ শিট প্রস্তুত হয়ে যাবে এবং প্রশ্ন যোগ করার অপশন উন্মুক্ত হবে।
              </p>
            </div>
            <button
              onClick={() => {
                setConfig(prev => ({ ...prev, isCreated: true }));
                setShowConfigPanel(false);
                showNotificationMsg('✨ হেডার সহ সম্পূর্ণ দুটি ব্ল্যাঙ্ক পেজ প্রস্তুত! এবার পছন্দমতো প্রশ্ন যোগ করুন।');
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 inline-flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>প্রশ্নপত্র তৈরি করুন (ব্ল্যাঙ্ক শিট ক্রিয়েট) →</span>
            </button>
          </div>
        ) : (
        <div className="space-y-6">

          {/* Action Ribbon: Quick Add from Bank & Custom Write */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                প্রশ্ন ব্যবস্থাপনা:
              </span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                মোট প্রশ্ন: {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                মোট মান: {toBengaliNumber(currentTotalMarks)} / {toBengaliNumber(config.totalMarks)}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  setTargetSectionForAdd('auto');
                  setShowAddDrawer(true);
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-cyan-200" />
                <span>প্রশ্ন ব্যাংক থেকে প্রশ্ন যোগ করুন (+Add)</span>
              </button>

              <button
                onClick={() => setShowCustomModal(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-300"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>নতুন প্রশ্ন নিজে লিখুন</span>
              </button>
            </div>
          </div>

          {/* Section K: 'ক' বিভাগ (MCQ) */}
          {(config.pattern === 'k_kh_g' || config.pattern === 'mcq_only' || config.pattern === 'k_kh_mcq_cq') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ক
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {config.pattern === 'mcq_only' ? 'বহুনির্বাচনী প্রশ্নাবলী (MCQ Section)' : '\'ক\' বিভাগ : বহুনির্বাচনী প্রশ্ন (MCQ)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      যুক্ত প্রশ্ন: {toBengaliNumber(sectionKQuestions.length)}টি • মোট মার্ক: {toBengaliNumber(sectionKMarks)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetSectionForAdd('k');
                    setPickerType('mcq');
                    setShowAddDrawer(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ ক বিভাগে MCQ যোগ করুন</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="p-4 divide-y divide-slate-100">
                {sectionKQuestions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">ক বিভাগে এখনো কোনো বহুনির্বাচনী প্রশ্ন যোগ করা হয়নি।</p>
                    <p className="text-xs text-slate-400 mt-1">উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে প্রশ্ন যুক্ত করুন।</p>
                  </div>
                ) : (
                  sectionKQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="py-3.5 flex items-start justify-between gap-4 group">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-bold text-slate-500 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                          {toBengaliNumber(idx + 1)}.
                        </span>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {q.type === 'mcq' ? q.question : 'প্রশ্ন'}
                          </p>

                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                              {q.options.map((opt, oIdx) => {
                                const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                                const isCorrect = q.correctOption === oIdx;
                                return (
                                  <span key={oIdx} className={`px-2 py-1 rounded-md border ${
                                    isCorrect 
                                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 font-semibold' 
                                      : 'bg-slate-50 border-slate-200'
                                  }`}>
                                    <strong className="mr-1">{labels[oIdx]}</strong> {opt}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>বিষয়: {q.subject}</span>
                            <span>•</span>
                            <span>অধ্যায়: {q.chapter}</span>
                            {q.boardInfo && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">{q.boardInfo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Swap, Reorder, Remove */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          title="উপরে নিন"
                          disabled={idx === 0}
                          onClick={() => handleReorderQuestion('k', idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          title="নিচে নিন"
                          disabled={idx === sectionKQuestions.length - 1}
                          onClick={() => handleReorderQuestion('k', idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          title="অন্য প্রশ্ন দিয়ে পরিবর্তন / বদলান"
                          onClick={() => {
                            setQuestionToSwap({ section: 'k', index: idx, question: q });
                            setSwapModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          title="প্রশ্নটি বাদ দিন"
                          onClick={() => handleRemoveQuestion('k', idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Section Kh: 'খ' বিভাগ (Short Questions) */}
          {(config.pattern === 'k_kh_g' || config.pattern === 'short_only') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    খ
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {config.pattern === 'short_only' ? 'সংক্ষিপ্ত প্রশ্নাবলী' : '\'খ\' বিভাগ : সংক্ষিপ্ত প্রশ্ন (Short Question)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      যুক্ত প্রশ্ন: {toBengaliNumber(sectionKhQuestions.length)}টি • মোট মার্ক: {toBengaliNumber(sectionKhMarks)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetSectionForAdd('kh');
                    setPickerType('short');
                    setShowAddDrawer(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ খ বিভাগে সংক্ষিপ্ত প্রশ্ন যোগ করুন</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="p-4 divide-y divide-slate-100">
                {sectionKhQuestions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">খ বিভাগে এখনো কোনো সংক্ষিপ্ত প্রশ্ন যোগ করা হয়নি।</p>
                    <p className="text-xs text-slate-400 mt-1">উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে প্রশ্ন যুক্ত করুন।</p>
                  </div>
                ) : (
                  sectionKhQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="py-3.5 flex items-start justify-between gap-4 group">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-bold text-slate-500 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                          {toBengaliNumber(idx + 1)}.
                        </span>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {q.type === 'short' ? q.question : 'প্রশ্ন'}
                          </p>

                          {q.type === 'short' && q.answer && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                              <span className="font-bold text-teal-800">নমুনা উত্তর: </span>
                              {q.answer}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>মান: {toBengaliNumber(q.marks || 2)}</span>
                            <span>•</span>
                            <span>অধ্যায়: {q.chapter}</span>
                            {q.boardInfo && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">{q.boardInfo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          title="উপরে নিন"
                          disabled={idx === 0}
                          onClick={() => handleReorderQuestion('kh', idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          title="নিচে নিন"
                          disabled={idx === sectionKhQuestions.length - 1}
                          onClick={() => handleReorderQuestion('kh', idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          title="অন্য প্রশ্ন দিয়ে পরিবর্তন / বদলান"
                          onClick={() => {
                            setQuestionToSwap({ section: 'kh', index: idx, question: q });
                            setSwapModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          title="প্রশ্নটি বাদ দিন"
                          onClick={() => handleRemoveQuestion('kh', idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Section G: 'গ' বিভাগ (CQ - Creative Questions) */}
          {(config.pattern === 'k_kh_g' || config.pattern === 'cq_only' || config.pattern === 'k_kh_mcq_cq') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {config.pattern === 'k_kh_mcq_cq' ? 'খ' : 'গ'}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {config.pattern === 'cq_only' 
                        ? 'সৃজনশীল প্রশ্নাবলী (CQ Section)' 
                        : config.pattern === 'k_kh_mcq_cq'
                          ? '\'খ\' বিভাগ : সৃজনশীল প্রশ্ন (CQ)'
                          : '\'গ\' বিভাগ : সৃজনশীল প্রশ্ন (CQ)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      যুক্ত সিকিউ: {toBengaliNumber(sectionGQuestions.length)}টি • মোট মার্ক: {toBengaliNumber(sectionGMarks)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetSectionForAdd('g');
                    setPickerType('cq');
                    setShowAddDrawer(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ সৃজনশীল (CQ) যোগ করুন</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="p-4 divide-y divide-slate-100">
                {sectionGQuestions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">সৃজনশীল বিভাগে এখনো কোনো প্রশ্ন যোগ করা হয়নি।</p>
                    <p className="text-xs text-slate-400 mt-1">উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে উদ্দীপকযুক্ত সিকিউ প্রশ্ন যুক্ত করুন।</p>
                  </div>
                ) : (
                  sectionGQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="py-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold text-purple-800 text-xs bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                            প্রশ্ন {toBengaliNumber(idx + 1)}
                          </span>
                          <span className="text-xs text-slate-500">অধ্যায়: {q.chapter} {q.boardInfo && `(${q.boardInfo})`}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            title="উপরে নিন"
                            disabled={idx === 0}
                            onClick={() => handleReorderQuestion('g', idx, 'up')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            title="নিচে নিন"
                            disabled={idx === sectionGQuestions.length - 1}
                            onClick={() => handleReorderQuestion('g', idx, 'down')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            title="অন্য সিকিউ দিয়ে পরিবর্তন করুন"
                            onClick={() => {
                              setQuestionToSwap({ section: 'g', index: idx, question: q });
                              setSwapModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            title="প্রশ্নটি বাদ দিন"
                            onClick={() => handleRemoveQuestion('g', idx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {q.type === 'cq' && (
                        <div className="space-y-2">
                          {/* Stimulus */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-serif">
                            <span className="font-bold text-slate-900 not-italic block mb-1">উদ্দীপক:</span>
                            {q.stimulus}
                          </div>

                          {/* Sub questions */}
                          <div className="space-y-1 pl-2 border-l-2 border-purple-200">
                            {q.subQuestions.map(sq => (
                              <div key={sq.label} className="text-xs flex items-center justify-between text-slate-700">
                                <span><strong>({sq.label})</strong> {sq.question}</span>
                                <span className="text-slate-400 font-mono">[{toBengaliNumber(sq.marks)}]</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Action Bar: Save Question Paper & Preview */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center md:text-left">
              <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>প্রশ্ন সাজানো শেষ হলে এখান থেকে সংরক্ষণ বা প্রিন্ট করুন</span>
              </h3>
              <p className="text-xs text-slate-500">
                মোট সংযুক্ত প্রশ্ন: {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি | বর্তমান পূর্ণমান: {toBengaliNumber(currentTotalMarks)} / {toBengaliNumber(config.totalMarks)}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Prominent Save Button as explicitly requested by user */}
              <button
                id="btn-save-exam-paper-bottom"
                onClick={handleOpenSaveModal}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-900/20 inline-flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
              >
                <Bookmark className="w-4 h-4 text-teal-200" />
                <span>সেভ প্রশ্নপত্র</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('preview');
                  setPaperLayoutMode('landscape_booklet');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
              >
                <FoldHorizontal className="w-4 h-4 text-emerald-200" />
                <span>৪-পৃষ্ঠা বুকলেট প্রিভিউ</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('preview');
                  setPaperLayoutMode('standard_portrait');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 inline-flex items-center gap-2 cursor-pointer transition"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>পোর্ট্রেট A4</span>
              </button>
            </div>
          </div>
        </div>
        )
      ) : viewMode === 'saved-papers' ? (
        /* Saved Papers List / Archive View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  প্রশ্নপত্র আর্কাইভ (Question Paper Archive)
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  আপনার পূর্বে তৈরি ও সেভ করা প্রশ্নপত্রের তালিকা। যেকোনো প্রশ্নপত্রে ক্লিক করে দেখুন অথবা এডিট, ডিলিট ও পূর্ণাঙ্গ পিডিএফ ডাউনলোড করুন।
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateNewBlankPaper}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ নতুন প্রশ্নপত্র তৈরি করুন</span>
            </button>
          </div>

          {savedExamPapers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">কোনো সংরক্ষিত প্রশ্নপত্র নেই</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  আপনি যখন নতুন প্রশ্নপত্র তৈরিতে গিয়ে ফরম্যাট তৈরি করবেন এবং প্রশ্ন যোগ করে "সেভ প্রশ্নপত্র" বাটনে ক্লিক করবেন, তখন তা সিরিয়ালি এই আর্কাইভে যুক্ত হবে।
                </p>
              </div>
              <button
                onClick={handleCreateNewBlankPaper}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>প্রথম প্রশ্নপত্রটি তৈরি করুন</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 px-1">
                মোট সংরক্ষিত প্রশ্নপত্র: {toBengaliNumber(savedExamPapers.length)}টি
              </div>

              <div className="grid grid-cols-1 gap-4">
                {savedExamPapers.map((paper, index) => {
                  const totalQuestions = (paper.sectionKQuestions?.length || 0) + 
                    (paper.sectionKhQuestions?.length || 0) + 
                    (paper.sectionGQuestions?.length || 0) || 
                    paper.selectedQuestionIds?.length || 0;

                  return (
                    <div
                      key={paper.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group/card"
                    >
                      {/* Clickable Paper Info Area */}
                      <div 
                        onClick={() => handleLoadSavedPaper(paper, 'preview')}
                        className="flex items-start gap-4 cursor-pointer flex-1 group"
                        title="প্রশ্নপত্রটি দেখতে ক্লিক করুন"
                      >
                        {/* Serial Number Badge */}
                        <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-800 font-bold flex items-center justify-center text-sm shrink-0 font-sans border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition">
                          {toBengaliNumber(index + 1)}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-700 transition">
                              {paper.paperTitle || `${paper.class} ${paper.subject} - ${paper.examTitle}`}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {paper.subject}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              {paper.class}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 text-xs text-slate-500 flex-wrap">
                            <span><strong>প্রতিষ্ঠান:</strong> {paper.coachingName || institution.nameBn}</span>
                            <span>•</span>
                            <span><strong>পূর্ণমান:</strong> {toBengaliNumber(paper.totalMarks || 100)}</span>
                            <span>•</span>
                            <span><strong>সময়:</strong> {paper.duration || '২ ঘণ্টা ৩০ মিনিট'}</span>
                            <span>•</span>
                            <span><strong>প্রশ্ন:</strong> {toBengaliNumber(totalQuestions)}টি</span>
                            {paper.createdAt && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(paper.createdAt).toLocaleDateString('bn-BD')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions: Download (PDF), Edit, Print, Delete */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSavedPaper(paper);
                          }}
                          disabled={downloadingPaperId === paper.id}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                          title="সম্পূর্ণ প্রশ্নপত্রটি সকল পৃষ্ঠাসহ পিডিএফ ফাইল হিসেবে ডাউনলোড করুন"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-100" />
                          <span>{downloadingPaperId === paper.id ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড (PDF)'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSavedPaper(paper, 'builder');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition border border-slate-200"
                          title="প্রশ্নপত্রে প্রশ্ন যোগ বা এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>এডিট করুন</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintSavedPaper(paper);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition border border-slate-200"
                          title="সরাসরি প্রিন্ট প্রিভিউ খুলুন"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>প্রিন্ট</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`আপনি কি নিশ্চিত "${paper.paperTitle || paper.examTitle}" প্রশ্নপত্রটি আর্কাইভ থেকে মুছে ফেলতে চান?`)) {
                              deleteExamPaper(paper.id);
                              showNotificationMsg('🗑️ প্রশ্নপত্রটি আর্কাইভ থেকে মুছে ফেলা হয়েছে।');
                            }
                          }}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-rose-200"
                          title="আর্কাইভ থেকে মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : paperLayoutMode === 'landscape_booklet' ? (
        /* Landscape 4-Section Folding Booklet Preview */
        <LandscapeBookletPreview
          config={config}
          institution={institution}
          sectionKQuestions={sectionKQuestions}
          sectionKhQuestions={sectionKhQuestions}
          sectionGQuestions={sectionGQuestions}
          showWatermark={showWatermark}
          watermarkText={watermarkText}
          showAnswerKey={showAnswerKey}
          onEditQuestions={() => setViewMode('builder')}
          onSwitchToPortrait={() => setPaperLayoutMode('standard_portrait')}
          onSavePaper={handleOpenSaveModal}
        />
      ) : (
        /* Preview Mode (A4 Print Ready Paper View) */
        <div className="space-y-6">
          
          {/* Preview Configuration Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaperLayoutMode('landscape_booklet')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                title="১০০ নম্বরের মডেল টেস্ট: ৪ সেকশন ল্যান্ডস্কেপ বুকলেট"
              >
                <FoldHorizontal className="w-3.5 h-3.5" />
                <span>৪-পৃষ্ঠা বুকলেট ভিউ</span>
              </button>

              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                প্রিন্ট কনফিগারেশন:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPrintColumns(1)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    printColumns === 1 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  ১ কলাম
                </button>
                <button
                  onClick={() => setPrintColumns(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    printColumns === 2 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  ২ কলাম (বোর্ড স্ট্যান্ডার্ড)
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>জলছাপ (Watermark)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={showAnswerKey}
                  onChange={(e) => setShowAnswerKey(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>উত্তরমালা সহ প্রিন্ট (Answer Sheet)</span>
              </label>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setViewMode('builder')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs md:text-sm cursor-pointer transition"
              >
                ← প্রশ্ন এডিট করুন
              </button>

              <button
                onClick={handleOpenSaveModal}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs md:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                title="প্রশ্নপত্রটি শিরোনাম দিয়ে সংরক্ষণ করুন"
              >
                <Bookmark className="w-4 h-4 text-teal-200" />
                <span>সেভ প্রশ্নপত্র</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন (Print A4)</span>
              </button>
            </div>
          </div>

          {/* Actual A4 Sheet Container */}
          <div className="flex justify-center">
            <div 
              id="printable-exam-paper"
              className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm p-6 sm:p-10 md:p-12 relative border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-none text-slate-900"
              style={{ minHeight: '297mm' }}
            >
              {/* Optional Diagonal Watermark */}
              {showWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                  <div className="text-slate-900/[0.04] text-5xl md:text-6xl font-black -rotate-35 text-center uppercase tracking-widest px-4 leading-relaxed font-serif">
                    {watermarkText || config.academyName}
                  </div>
                </div>
              )}

              {/* A4 Header Section (Strict Authentic Board & Cadet Exam Standard) */}
              <div className="relative z-10 text-center space-y-1.5 pb-3 border-b-2 border-slate-900 mb-4">
                {/* Academy Name */}
                <h1 className="text-xl md:text-2xl font-black tracking-wide text-slate-950">
                  {config.academyName}
                </h1>
                
                {/* Institution Address / EIIN */}
                <p className="text-xs text-slate-600 font-medium">
                  {institution.village}, {institution.upazila}, {institution.district} | EIIN: {institution.eiin}
                </p>

                {/* Exam Title Box */}
                <div className="inline-block px-4 py-0.5 rounded-full border border-slate-800 bg-slate-50 font-bold text-sm text-slate-900 my-1">
                  {config.examTitle}
                </div>

                {/* Meta Details Row (Subject, Code, Class, Marks, Time) */}
                <div className="pt-2 flex items-center justify-between text-xs md:text-sm font-semibold text-slate-800 px-1 border-t border-slate-300/80">
                  <div className="text-left space-y-0.5">
                    <div>বিষয়: <strong>{config.subject}</strong> (বিষয় কোড: {config.subjectCode})</div>
                    <div>শ্রেণি: {config.className} {config.section ? `• ${config.section}` : ''}</div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div>সময়: <strong>{config.duration}</strong></div>
                    <div>পূর্ণমান: <strong>{config.totalMarks}</strong></div>
                  </div>
                </div>

                {/* Instructions Box (বিশেষ দ্রষ্টব্য) */}
                {config.instructions && (
                  <div className="text-[11px] md:text-xs text-slate-700 italic pt-1 border-t border-dashed border-slate-300 text-center">
                    {config.instructions}
                  </div>
                )}
              </div>

              {/* Questions Body */}
              <div className="relative z-10 space-y-6">

                {/* 'ক' বিভাগ (MCQ) in Print */}
                {sectionKQuestions.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <h2 className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5">
                        {config.pattern === 'mcq_only' 
                          ? 'বহুনির্বাচনী প্রশ্নাবলী' 
                          : `'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionKMarks)}]`}
                      </h2>
                      <p className="text-[11px] text-slate-600 italic mt-0.5">
                        [সকল প্রশ্নের উত্তর দাও। প্রতিটি প্রশ্নের মান ১। সঠিক উত্তরের বৃত্ত ভরাট করো / খাতায় লেখো।]
                      </p>
                    </div>

                    <div className={`grid ${printColumns === 2 ? 'grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3' : 'grid-cols-1 gap-y-3'} text-xs leading-relaxed`}>
                      {sectionKQuestions.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-1 break-inside-avoid">
                          <p className="font-semibold text-slate-950">
                            <span>{toBengaliNumber(idx + 1)}. </span>
                            {q.type === 'mcq' ? q.question : ''}
                          </p>

                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-3 text-[11px] text-slate-800">
                              <span>(ক) {q.options[0]}</span>
                              <span>(খ) {q.options[1]}</span>
                              <span>(গ) {q.options[2]}</span>
                              <span>(ঘ) {q.options[3]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 'খ' বিভাগ (Short Questions) in Print */}
                {sectionKhQuestions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-center">
                      <h2 className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5">
                        {config.pattern === 'short_only'
                          ? 'সংক্ষিপ্ত প্রশ্নাবলী'
                          : `'খ' বিভাগ : সংক্ষিপ্ত প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionKhMarks)}]`}
                      </h2>
                      <p className="text-[11px] text-slate-600 italic mt-0.5">
                        [যেকোনো {toBengaliNumber(Math.min(sectionKhQuestions.length, 10))}টি প্রশ্নের উত্তর দাও। প্রতিটি প্রশ্নের মান ২।]
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-2 text-xs">
                      {sectionKhQuestions.map((q, idx) => (
                        <div key={q.id || idx} className="flex items-start justify-between gap-4 break-inside-avoid">
                          <p className="text-slate-950">
                            <strong>{toBengaliNumber(idx + 1)}. </strong>
                            {q.type === 'short' ? q.question : ''}
                          </p>
                          <span className="font-mono text-slate-500 shrink-0">[{toBengaliNumber(q.marks || 2)}]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 'গ' বিভাগ (CQ) in Print */}
                {sectionGQuestions.length > 0 && (
                  <div className="space-y-4 pt-3">
                    <div className="text-center">
                      <h2 className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5">
                        {config.pattern === 'cq_only'
                          ? 'সৃজনশীল প্রশ্নাবলী'
                          : config.pattern === 'k_kh_mcq_cq'
                            ? `'খ' বিভাগ : সৃজনশীল প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionGMarks)}]`
                            : `'গ' বিভাগ : সৃজনশীল প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionGMarks)}]`}
                      </h2>
                      <p className="text-[11px] text-slate-600 italic mt-0.5">
                        [উদ্দীপকগুলো মনোযোগ সহকারে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর প্রদান করো।]
                      </p>
                    </div>

                    <div className="space-y-5 text-xs">
                      {sectionGQuestions.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-2 break-inside-avoid">
                          <div className="font-bold text-slate-950">
                            {toBengaliNumber(idx + 1)} নম্বর প্রশ্নের উদ্দীপক ও প্রশ্ন:
                          </div>

                          {q.type === 'cq' && (
                            <div className="space-y-2">
                              {/* Stimulus Box */}
                              <div className="p-3 bg-slate-50 border border-slate-300 rounded-sm font-serif leading-relaxed text-slate-900">
                                {q.stimulus}
                              </div>

                              {/* Sub Questions */}
                              <div className="space-y-1 pl-3">
                                {q.subQuestions.map(sq => (
                                  <div key={sq.label} className="flex items-start justify-between text-slate-900">
                                    <span><strong>({sq.label})</strong> {sq.question}</span>
                                    <span className="font-mono text-slate-600 pl-2">[{toBengaliNumber(sq.marks)}]</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Answer Key Section */}
                {showAnswerKey && sectionKQuestions.length > 0 && (
                  <div className="pt-6 border-t-2 border-dashed border-slate-400 space-y-2 break-before-page">
                    <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-800">
                      ★ বহুনির্বাচনী প্রশ্নাবলীর উত্তরমালা (Answer Key) ★
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-[11px] text-center font-mono">
                      {sectionKQuestions.map((q, idx) => {
                        const correctLetters = ['ক', 'খ', 'গ', 'ঘ'];
                        return (
                          <div key={idx} className="p-1 border border-slate-300 bg-slate-50 rounded">
                            <span className="text-slate-500">{toBengaliNumber(idx + 1)}:</span>
                            <strong className="text-emerald-700 ml-1">
                              {q.type === 'mcq' ? correctLetters[q.correctOption] : '-'}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Page Note */}
                <div className="pt-8 text-center text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200 mt-6">
                  <span>{config.academyName}</span>
                  <span>— শুভকামনা সহ —</span>
                  <span>মুদ্রিত সংস্করণ ২০২৬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer / Modal: Add Questions from Question Bank */}
      {showAddDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>প্রশ্ন ব্যাংক থেকে প্রশ্ন নির্বাচন করুন</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {targetSectionForAdd === 'k' ? '\'ক\' বিভাগ (MCQ)-এর জন্য প্রশ্ন খুঁজুন' :
                   targetSectionForAdd === 'kh' ? '\'খ\' বিভাগ (সংক্ষিপ্ত)-এর জন্য প্রশ্ন খুঁজুন' :
                   targetSectionForAdd === 'g' ? '\'গ\' বিভাগ (সৃজনশীল)-এর জন্য প্রশ্ন খুঁজুন' :
                   'যেকোনো প্রশ্ন পছন্দ করুন, স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট বিভাগে যুক্ত হবে'}
                </p>
              </div>

              <button
                onClick={() => setShowAddDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter bar */}
            <div className="p-3 bg-white border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {/* Subject */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">বিষয় নির্বাচন</label>
                <select
                  value={pickerSubject}
                  onChange={(e) => {
                    setPickerSubject(e.target.value);
                    setPickerChapter('সব অধ্যায়');
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium outline-none"
                >
                  <option value="সব বিষয়">সব বিষয় (Mixed / সমন্বিত)</option>
                  {subjectsList.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Chapter */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">অধ্যায় নির্বাচন</label>
                <select
                  value={pickerChapter}
                  onChange={(e) => setPickerChapter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium outline-none"
                >
                  <option value="সব অধ্যায়">সব অধ্যায়</option>
                  {pickerSubject !== 'সব বিষয়' && chaptersBySubject[pickerSubject]?.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">প্রশ্নের ধরণ</label>
                <select
                  value={pickerType}
                  onChange={(e) => setPickerType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium outline-none"
                >
                  <option value="all">সব ধরণ (MCQ, Short, CQ)</option>
                  <option value="mcq">বহুনির্বাচনী (MCQ)</option>
                  <option value="short">সংক্ষিপ্ত প্রশ্ন (Short)</option>
                  <option value="cq">সৃজনশীল (CQ)</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">কীওয়ার্ড সার্চ</label>
                <div className="relative">
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="প্রশ্ন বা বোর্ড খুঁজুন..."
                    className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
              <div className="text-xs text-slate-500 pb-1">
                পাওয়া গেছে: <strong>{toBengaliNumber(filteredPickerQuestions.length)}টি</strong> প্রশ্ন
              </div>

              {filteredPickerQuestions.slice(0, 50).map((q) => {
                const added = isQuestionAdded(q.id);
                return (
                  <div key={q.id} className="pt-2.5 flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.type === 'mcq' ? 'bg-emerald-100 text-emerald-800' :
                          q.type === 'short' ? 'bg-teal-100 text-teal-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {q.type === 'mcq' ? 'MCQ (১)' : q.type === 'short' ? 'সংক্ষিপ্ত (২)' : 'CQ (১০)'}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{q.subject} • {q.chapter}</span>
                        {q.boardInfo && (
                          <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                            {q.boardInfo}
                          </span>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-slate-900 font-medium leading-snug">
                        {q.type === 'cq' ? q.stimulus : q.question}
                      </p>

                      {q.type === 'mcq' && (
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                          {q.options.map((opt, i) => (
                            <span key={i} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              {['(ক)', '(খ)', '(গ)', '(ঘ)'][i]} {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddQuestionToPaper(q)}
                      disabled={added}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                        added
                          ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>যুক্ত আছে</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ যোগ করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                টিপস: প্রশ্নটিতে ক্লিক করলেই সেটি তার ধরণ অনুযায়ী সঠিক বিভাগে স্বয়ংক্রিয়ভাবে বসে যাবে।
              </span>
              <button
                onClick={() => setShowAddDrawer(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Swap / Replace Question */}
      {swapModalOpen && questionToSwap && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-600" />
                  <span>প্রশ্নটি প্রতিস্থাপন / বদলান</span>
                </h3>
                <p className="text-xs text-slate-500">
                  বর্তমান প্রশ্নের বদলে একই বিষয় ও অধ্যায়ের আরেকটি প্রশ্ন পছন্দ করুন
                </p>
              </div>
              <button onClick={() => setSwapModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Question Display */}
            <div className="p-3 bg-cyan-50/50 border-b border-cyan-100 text-xs">
              <span className="text-cyan-800 font-bold block mb-0.5">বর্তমান প্রশ্ন:</span>
              <p className="text-slate-800">
                {questionToSwap.question.type === 'cq' 
                  ? questionToSwap.question.stimulus 
                  : questionToSwap.question.question}
              </p>
            </div>

            {/* Candidate Questions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <div className="text-xs text-slate-500">বিকল্প প্রশ্নসমূহ:</div>
              {questions
                .filter(q => 
                  q.type === questionToSwap.question.type && 
                  q.subject === questionToSwap.question.subject && 
                  q.id !== questionToSwap.question.id &&
                  !isQuestionAdded(q.id)
                )
                .slice(0, 15)
                .map(q => (
                  <div key={q.id} className="p-3 rounded-xl border border-slate-200 hover:border-cyan-400 flex items-start justify-between gap-3 transition">
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-500">{q.chapter} {q.boardInfo && `• ${q.boardInfo}`}</span>
                      <p className="font-medium text-slate-900">{q.type === 'cq' ? q.stimulus : q.question}</p>
                    </div>
                    <button
                      onClick={() => handleConfirmSwap(q)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      এই প্রশ্নটি নিন
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Write Custom Question */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>নতুন প্রশ্ন নিজে লিখুন (+Custom Question)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার প্রতিষ্ঠানের নিজস্ব প্রশ্নপত্র অনুযায়ী কাস্টম প্রশ্ন লিখে অবিলম্বে যুক্ত করুন
                </p>
              </div>
              <button onClick={() => setShowCustomModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Type selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">প্রশ্নের ধরণ</label>
                <div className="flex gap-2">
                  {(['mcq', 'short', 'cq'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCustomType(t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        customType === t
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t === 'mcq' ? 'বহুনির্বাচনী (MCQ)' : t === 'short' ? 'সংক্ষিপ্ত প্রশ্ন' : 'সৃজনশীল (CQ)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* If MCQ or Short: Question prompt */}
              {customType !== 'cq' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">প্রশ্নের বিবরণ</label>
                  <textarea
                    rows={2}
                    value={customQuestionText}
                    onChange={(e) => setCustomQuestionText(e.target.value)}
                    placeholder="এখানে প্রশ্নটি টাইপ করুন..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* If MCQ: Options */}
              {customType === 'mcq' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">অপশনসমূহ ও সঠিক উত্তর</label>
                  {(['ক', 'খ', 'গ', 'ঘ'] as const).map((label, idx) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-6 text-xs font-bold text-slate-500">{label}.</span>
                      <input
                        type="text"
                        value={customOptions[idx]}
                        onChange={(e) => {
                          const updated = [...customOptions] as [string, string, string, string];
                          updated[idx] = e.target.value;
                          setCustomOptions(updated);
                        }}
                        placeholder={`অপশন ${label} লিখুন...`}
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                      />
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={customCorrect === idx}
                        onChange={() => setCustomCorrect(idx as any)}
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                        className="text-emerald-600"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* If CQ: Stimulus & subquestions */}
              {customType === 'cq' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">উদ্দীপক (Stimulus)</label>
                    <textarea
                      rows={3}
                      value={customStimulus}
                      onChange={(e) => setCustomStimulus(e.target.value)}
                      placeholder="উদ্দীপকের তথ্য, অনুচ্ছেদ বা গাণিতিক পরিস্থিতি লিখুন..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">উপ-প্রশ্নসমূহ</label>
                    {customSubQuestions.map((sq, idx) => (
                      <div key={sq.label} className="flex items-center gap-2">
                        <span className="w-6 text-xs font-bold text-purple-700">({sq.label})</span>
                        <input
                          type="text"
                          value={sq.question}
                          onChange={(e) => {
                            const updated = [...customSubQuestions];
                            updated[idx].question = e.target.value;
                            setCustomSubQuestions(updated);
                          }}
                          placeholder={`প্রশ্ন ${sq.label} লিখুন...`}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                        />
                        <span className="text-[11px] text-slate-400 font-mono">[{sq.marks}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleCreateCustomQuestion}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
              >
                প্রশ্নপত্রে যুক্ত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Question Paper Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">প্রশ্নপত্র সংরক্ষণ করুন</h3>
                  <p className="text-xs text-slate-500">পরবর্তীতে পুনরায় দেখার বা প্রিন্ট করার জন্য সেভ করে রাখুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  প্রশ্নপত্রের শিরোনাম বা টাইটেল:
                </label>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="যেমন: ১০ম শ্রেণি পদার্থবিজ্ঞান মডেল টেস্ট পরীক্ষা"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition font-medium"
                  autoFocus
                />
                <span className="text-[11px] text-slate-400 block">
                  এই শিরোনাম অনুযায়ী সাইডবারের "প্রশ্নপত্রসমূহ" সাব-মেনুতে সিরিয়ালি তালিকাভুক্ত থাকবে।
                </span>
              </div>

              {/* Summary of current paper */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>বিষয় ও শ্রেণি:</span>
                  <span className="font-bold text-slate-900">{config.subject} ({config.className})</span>
                </div>
                <div className="flex justify-between">
                  <span>পরীক্ষার নাম:</span>
                  <span className="font-bold text-slate-900">{config.examTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>মোট সংযুক্ত প্রশ্ন:</span>
                  <span className="font-bold text-emerald-700">
                    {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>মোট পূর্ণমান:</span>
                  <span className="font-bold text-slate-900">{toBengaliNumber(config.totalMarks)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-900/20 flex items-center gap-1.5 cursor-pointer transition"
              >
                <Save className="w-4 h-4 text-teal-100" />
                <span>সংরক্ষণ করুন (Save Paper)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
