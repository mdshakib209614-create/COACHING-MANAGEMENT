import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  BookOpen, 
  Layers, 
  FoldHorizontal, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  FileText,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Save,
  Download
} from 'lucide-react';
import { exportElementsToPDF } from '../utils/pdfExport';
import { InstitutionProfile, QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

export interface DraftPaperConfig {
  academyName: string;
  examTitle: string;
  subject: string;
  subjectCode: string;
  className: string;
  section: string;
  totalMarks: string;
  duration: string;
  pattern: 'k_kh_g' | 'mcq_only' | 'cq_only' | 'short_only' | 'k_kh_mcq_cq';
  instructions: string;
  isCreated: boolean;
}

interface LandscapeBookletPreviewProps {
  config: DraftPaperConfig;
  institution: InstitutionProfile;
  sectionKQuestions: QuestionItem[];
  sectionKhQuestions: QuestionItem[];
  sectionGQuestions: QuestionItem[];
  showWatermark: boolean;
  watermarkText: string;
  showAnswerKey: boolean;
  onEditQuestions: () => void;
  onSwitchToPortrait: () => void;
  onSavePaper?: () => void;
}

export const LandscapeBookletPreview: React.FC<LandscapeBookletPreviewProps> = ({
  config,
  institution,
  sectionKQuestions,
  sectionKhQuestions,
  sectionGQuestions,
  showWatermark: initialShowWatermark,
  watermarkText: initialWatermarkText,
  showAnswerKey: initialShowAnswerKey,
  onEditQuestions,
  onSwitchToPortrait,
  onSavePaper,
}) => {
  // Paper size: A4 (Standard Desktop Printer) vs A3 (Commercial Press Standard)
  const [paperSize, setPaperSize] = useState<'A4' | 'A3'>('A4');

  // Border style: 'solid' (Standard Exam Board Frame) vs 'double' (Classic Double Frame) vs 'thin'
  const [borderStyle, setBorderStyle] = useState<'solid' | 'double' | 'thin'>('solid');

  // Imposition mode: 
  // 'p4_p1' (Standard Booklet Fold: Sheet 1 = [P4 | P1], Sheet 2 = [P2 | P3] -> Sequence: 4, 1, 2, 3)
  // 'p1_p4' (Left = Page 1, Right = Page 4)
  // 'p1_p2' (Sequential: Sheet 1 = [P1 | P2], Sheet 2 = [P3 | P4])
  const [orderMode, setOrderMode] = useState<'p4_p1' | 'p1_p4' | 'p1_p2'>('p4_p1');

  // Font density / spacing: 'normal' (standard balanced full-page fit), 'spacious' (for fewer questions to avoid empty space), 'compact' (dense 100-mark fit)
  const [density, setDensity] = useState<'normal' | 'spacious' | 'compact'>('normal');

  // Local toggles
  const [showWatermark, setShowWatermark] = useState<boolean>(initialShowWatermark);
  const [watermarkText] = useState<string>(initialWatermarkText || config.academyName);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handleDownloadPDF = async () => {
    setIsExportingPdf(true);
    try {
      const cleanFileName = `${config.className || 'Exam'}_${config.subject || 'Subject'}_${config.examTitle || 'Paper'}`
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\s+/g, '_');
      const success = await exportElementsToPDF(['booklet-sheet-1', 'booklet-sheet-2'], {
        fileName: `${cleanFileName}_Booklet.pdf`,
        orientation: 'landscape'
      });
      if (!success) {
        window.print();
      }
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Distribution of questions across the 4 pages:
  // Dynamically balance questions so all pages are filled evenly without huge bottom gaps
  const defaultMcqSplit = Math.max(1, Math.min(sectionKQuestions.length, Math.ceil(sectionKQuestions.length / 2) || 15));
  const defaultCqSplit = Math.max(1, Math.min(sectionGQuestions.length, Math.ceil(sectionGQuestions.length / 2) || 4));

  const [mcqPage1Count, setMcqPage1Count] = useState<number>(defaultMcqSplit);
  const [cqPage3Count, setCqPage3Count] = useState<number>(defaultCqSplit);

  // Calculated slices
  const page1Mcqs = useMemo(() => sectionKQuestions.slice(0, mcqPage1Count), [sectionKQuestions, mcqPage1Count]);
  const page2Mcqs = useMemo(() => sectionKQuestions.slice(mcqPage1Count), [sectionKQuestions, mcqPage1Count]);
  const page3Cqs = useMemo(() => sectionGQuestions.slice(0, cqPage3Count), [sectionGQuestions, cqPage3Count]);
  const page4Cqs = useMemo(() => sectionGQuestions.slice(cqPage3Count), [sectionGQuestions, cqPage3Count]);

  // Section marks
  const sectionKMarks = useMemo(() => sectionKQuestions.reduce((acc, q) => acc + (q.marks || 1), 0), [sectionKQuestions]);
  const sectionKhMarks = useMemo(() => sectionKhQuestions.reduce((acc, q) => acc + (q.marks || 2), 0), [sectionKhQuestions]);
  const sectionGMarks = useMemo(() => sectionGQuestions.reduce((acc, q) => acc + (q.marks || 10), 0), [sectionGQuestions]);
  const totalCalculatedMarks = sectionKMarks + sectionKhMarks + sectionGMarks;

  // Border frame classes for standard exam question papers
  const borderClass = {
    solid: 'border-2 border-slate-900',
    double: 'border-4 border-double border-slate-900',
    thin: 'border border-slate-800'
  }[borderStyle];

  // Print Booklet handler (Injects dynamic landscape print rules)
  const handlePrint = () => {
    const styleId = 'dynamic-booklet-landscape-print-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    const paperSizeStr = paperSize === 'A3' ? 'A3 landscape' : 'A4 landscape';
    styleTag.innerHTML = `
      @media print {
        @page {
          size: ${paperSizeStr} !important;
          margin: 4mm 4mm 4mm 4mm !important;
        }
        html, body {
          width: 100% !important;
          height: 100% !important;
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
          height: 100% !important;
          min-height: 98vh !important;
          max-height: 100vh !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          border: none !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: #ffffff !important;
          overflow: hidden !important;
        }
        .booklet-print-sheet:last-of-type {
          page-break-after: auto !important;
          break-after: auto !important;
        }
      }
    `;
    window.print();
  };

  // Typography density classes - calibrated so content comfortably fills the page
  const fontDensityClasses = {
    compact: {
      bodyText: 'text-[11px] leading-snug',
      heading: 'text-xs font-bold',
      mcqText: 'text-[11px] font-medium leading-snug',
      optionsText: 'text-[10.5px]',
      cqText: 'text-[11px] leading-snug',
      stimulusText: 'text-[10.5px] leading-snug p-2',
      spacing: 'space-y-1.5',
      headerPadding: 'pb-1 mb-1.5',
      institutionTitle: 'text-base font-black',
    },
    normal: {
      bodyText: 'text-[12px] leading-normal',
      heading: 'text-[13px] font-bold',
      mcqText: 'text-[12px] font-medium leading-normal',
      optionsText: 'text-[11.5px]',
      cqText: 'text-[11.5px] leading-relaxed',
      stimulusText: 'text-[11.5px] leading-relaxed p-2.5',
      spacing: 'space-y-2.5',
      headerPadding: 'pb-1.5 mb-2',
      institutionTitle: 'text-lg font-black',
    },
    spacious: {
      bodyText: 'text-[13px] leading-relaxed',
      heading: 'text-sm font-bold',
      mcqText: 'text-[13px] font-medium leading-relaxed',
      optionsText: 'text-[12px]',
      cqText: 'text-[12.5px] leading-relaxed',
      stimulusText: 'text-[12px] leading-relaxed p-3',
      spacing: 'space-y-3.5',
      headerPadding: 'pb-2 mb-2.5',
      institutionTitle: 'text-xl font-black',
    },
  }[density];

  // Watermark Component
  const WatermarkOverlay = () => {
    if (!showWatermark) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <div className="text-slate-900/[0.035] text-4xl md:text-5xl font-black -rotate-30 text-center uppercase tracking-wider px-2 font-serif">
          {watermarkText}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // PAGE 1: Front Cover / Header & 'ক' বিভাগ (MCQ Part 1)
  // -------------------------------------------------------------
  const renderPage1 = () => (
    <div className={`relative flex flex-col h-full justify-between p-3 sm:p-4 text-slate-950 font-serif ${borderClass} bg-white shadow-2xs box-border`}>
      <WatermarkOverlay />
      
      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Institution & Exam Header */}
        <div className={`text-center border-b-2 border-slate-900 ${fontDensityClasses.headerPadding}`}>
          <h1 className={`${fontDensityClasses.institutionTitle} tracking-tight text-slate-950 leading-tight`}>
            {config.academyName}
          </h1>
          {institution.village && (
            <p className="text-[10px] text-slate-600 font-sans">
              {institution.village}, {institution.upazila}, {institution.district} {institution.eiin ? `| EIIN: ${institution.eiin}` : ''}
            </p>
          )}
          
          <div className="inline-block px-3 py-0.5 font-bold text-xs text-slate-950 my-0.5 font-sans">
            {config.examTitle}
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-900 px-0.5 border-t border-slate-400 font-sans">
            <div className="text-left">
              <span>বিষয়: {config.subject} {config.subjectCode ? `(কোড: ${config.subjectCode})` : ''}</span>
              <span className="mx-1.5">|</span>
              <span>শ্রেণি: {config.className} {config.section ? `(${config.section})` : ''}</span>
            </div>
            <div className="text-right">
              <span>সময়: {config.duration}</span>
              <span className="mx-1.5">|</span>
              <span>পূর্ণমান: {config.totalMarks}</span>
            </div>
          </div>

          {config.instructions && (
            <div className="text-[9.5px] text-slate-700 italic pt-0.5 border-t border-dashed border-slate-300 text-center font-sans">
              [{config.instructions}]
            </div>
          )}
        </div>

        {/* 'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন (Part 1) */}
        {page1Mcqs.length > 0 && (
          <div className={`flex-1 flex flex-col ${fontDensityClasses.spacing} mt-1.5`}>
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন {sectionKMarks > 0 ? `[মান: ${toBengaliNumber(sectionKMarks)}]` : ''}
              </h2>
              <p className="text-[9.5px] text-slate-600 italic">
                [সঠিক উত্তরের বৃত্তটি ভরাট করো। প্রতিটি প্রশ্নের মান ১।]
              </p>
            </div>

            {/* Questions list - Full-width horizontal spread across the page */}
            <div className={`flex-1 flex flex-col justify-start ${fontDensityClasses.spacing}`}>
              {page1Mcqs.map((q, idx) => (
                <div key={q.id || idx} className="text-slate-950 break-inside-avoid">
                  <p className={`${fontDensityClasses.mcqText} font-sans`}>
                    <strong className="font-serif">{toBengaliNumber(idx + 1)}. </strong>
                    {q.type === 'mcq' ? q.question : ''}
                  </p>
                  {q.type === 'mcq' && (
                    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-0.5 pl-2 pt-0.5 ${fontDensityClasses.optionsText} text-slate-800 font-sans`}>
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

        {/* If completely blank paper, show a friendly prompt on screen (hidden during print) */}
        {sectionKQuestions.length === 0 && sectionKhQuestions.length === 0 && sectionGQuestions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl my-4 text-center print:hidden bg-slate-50/70">
            <p className="text-sm font-bold text-slate-800">✨ সম্পূর্ণ ব্ল্যাঙ্ক প্রশ্নপত্র প্রস্তুত</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              উপরে একাডেমি ও পরীক্ষার হেডার সেট করা হয়েছে। প্রশ্নপত্র বিল্ডারে গিয়ে পছন্দমতো প্রশ্ন যোগ করলে এখানে স্বয়ংক্রিয়ভাবে সাজিয়ে যাবে।
            </p>
            <button
              onClick={onEditQuestions}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>প্রশ্ন যোগ করুন (Go to Builder)</span>
            </button>
          </div>
        )}
      </div>

      {/* Page 1 Footer - ONLY PAGE NUMBER */}
      <div className="relative z-10 pt-1.5 mt-auto border-t border-slate-300 text-center font-bold text-xs text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ১ —
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // PAGE 2: Inside Left / 'ক' বিভাগ (MCQ Part 2) & 'খ' বিভাগ (Short)
  // -------------------------------------------------------------
  const renderPage2 = () => (
    <div className={`relative flex flex-col h-full justify-between p-3 sm:p-4 text-slate-950 font-serif ${borderClass} bg-white shadow-2xs box-border`}>
      <WatermarkOverlay />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Subtle Top Header */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 font-sans">
          <span>{config.subject}</span>
          <span>{config.examTitle}</span>
        </div>

        {/* 'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন (Part 2) */}
        {page2Mcqs.length > 0 && (
          <div className={`${fontDensityClasses.spacing} mb-2.5`}>
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন (অবশিষ্টাংশ)
              </h2>
            </div>

            <div className={fontDensityClasses.spacing}>
              {page2Mcqs.map((q, idx) => {
                const serialNum = mcqPage1Count + idx + 1;
                return (
                  <div key={q.id || idx} className="text-slate-950 break-inside-avoid">
                    <p className={`${fontDensityClasses.mcqText} font-sans`}>
                      <strong className="font-serif">{toBengaliNumber(serialNum)}. </strong>
                      {q.type === 'mcq' ? q.question : ''}
                    </p>
                    {q.type === 'mcq' && (
                      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-0.5 pl-2 pt-0.5 ${fontDensityClasses.optionsText} text-slate-800 font-sans`}>
                        <span>(ক) {q.options[0]}</span>
                        <span>(খ) {q.options[1]}</span>
                        <span>(গ) {q.options[2]}</span>
                        <span>(ঘ) {q.options[3]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 'খ' বিভাগ : সংক্ষিপ্ত প্রশ্নাবলী (Short Questions) */}
        {sectionKhQuestions.length > 0 && (
          <div className={`flex-1 flex flex-col ${fontDensityClasses.spacing} pt-1.5 border-t border-dashed border-slate-400`}>
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                'খ' বিভাগ : সংক্ষিপ্ত প্রশ্নাবলী [পূর্ণমান: {toBengaliNumber(sectionKhMarks)}]
              </h2>
              <p className="text-[9.5px] text-slate-600 italic">
                [যেকোনো {toBengaliNumber(Math.min(sectionKhQuestions.length, 10))}টি প্রশ্নের সংক্ষিপ্ত উত্তর দাও। প্রতিটি প্রশ্নের মান ২।]
              </p>
            </div>

            <div className={`flex-1 flex flex-col justify-start ${fontDensityClasses.spacing}`}>
              {sectionKhQuestions.map((q, idx) => (
                <div key={q.id || idx} className="flex items-start justify-between gap-3 break-inside-avoid text-slate-950 font-sans">
                  <p className={fontDensityClasses.bodyText}>
                    <strong className="font-serif">{toBengaliNumber(idx + 1)}. </strong>
                    {q.type === 'short' ? q.question : ''}
                  </p>
                  <span className="font-mono text-[10px] text-slate-700 shrink-0 font-bold">
                    [{toBengaliNumber(q.marks || 2)}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Page 2 Footer - ONLY PAGE NUMBER */}
      <div className="relative z-10 pt-1.5 mt-auto border-t border-slate-300 text-center font-bold text-xs text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ২ —
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // PAGE 3: Inside Right / 'গ' বিভাগ : সৃজনশীল প্রশ্ন (CQ Part 1)
  // -------------------------------------------------------------
  const renderPage3 = () => (
    <div className={`relative flex flex-col h-full justify-between p-3 sm:p-4 text-slate-950 font-serif ${borderClass} bg-white shadow-2xs box-border`}>
      <WatermarkOverlay />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Subtle Top Header */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 font-sans">
          <span>{config.subject}</span>
          <span>{config.examTitle}</span>
        </div>

        {/* 'গ' বিভাগ : সৃজনশীল প্রশ্ন (CQ Part 1) */}
        {page3Cqs.length > 0 && (
          <div className={`flex-1 flex flex-col ${fontDensityClasses.spacing}`}>
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                'গ' বিভাগ : সৃজনশীল প্রশ্নাবলী (CQ) {sectionGMarks > 0 ? `[পূর্ণমান: ${toBengaliNumber(sectionGMarks)}]` : ''}
              </h2>
              <p className="text-[9.5px] text-slate-600 italic">
                [উদ্দীপকগুলো মনোযোগ সহকারে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও।]
              </p>
            </div>

            <div className={`flex-1 flex flex-col justify-start ${fontDensityClasses.spacing}`}>
              {page3Cqs.map((q, idx) => (
                <div key={q.id || idx} className="break-inside-avoid border-b border-slate-200 pb-2.5 last:border-b-0">
                  <div className="font-bold text-[11px] text-slate-950 mb-1 font-sans">
                    {toBengaliNumber(idx + 1)} নম্বর প্রশ্নের উদ্দীপক ও প্রশ্ন:
                  </div>

                  {q.type === 'cq' && (
                    <div className="space-y-1.5">
                      {/* Stimulus Box - full width across the page */}
                      <div className={`bg-slate-50/80 border border-slate-300 rounded-sm font-serif leading-relaxed text-slate-950 text-justify ${fontDensityClasses.stimulusText}`}>
                        {q.stimulus}
                      </div>

                      {/* Sub Questions (ক, খ, গ, ঘ) */}
                      <div className="space-y-1 pl-2 font-sans">
                        {q.subQuestions.map(sq => (
                          <div key={sq.label} className={`flex items-start justify-between text-slate-900 ${fontDensityClasses.cqText}`}>
                            <span><strong>({sq.label})</strong> {sq.question}</span>
                            <span className="font-mono text-slate-700 pl-2 font-bold shrink-0">
                              [{toBengaliNumber(sq.marks)}]
                            </span>
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
      </div>

      {/* Page 3 Footer - ONLY PAGE NUMBER */}
      <div className="relative z-10 pt-1.5 mt-auto border-t border-slate-300 text-center font-bold text-xs text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ৩ —
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // PAGE 4: Back Cover / 'গ' বিভাগ (CQ Part 2) & Clean Ending
  // -------------------------------------------------------------
  const renderPage4 = () => (
    <div className={`relative flex flex-col h-full justify-between p-3 sm:p-4 text-slate-950 font-serif ${borderClass} bg-white shadow-2xs box-border`}>
      <WatermarkOverlay />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Subtle Top Header */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 font-sans">
          <span>{config.subject}</span>
          <span>{config.examTitle}</span>
        </div>

        {/* 'গ' বিভাগ : সৃজনশীল প্রশ্ন (CQ Part 2) */}
        {page4Cqs.length > 0 && (
          <div className={`flex-1 flex flex-col ${fontDensityClasses.spacing}`}>
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                'গ' বিভাগ : সৃজনশীল প্রশ্নাবলী (অবশিষ্টাংশ)
              </h2>
            </div>

            <div className={`flex-1 flex flex-col justify-start ${fontDensityClasses.spacing}`}>
              {page4Cqs.map((q, idx) => {
                const serialNum = cqPage3Count + idx + 1;
                return (
                  <div key={q.id || idx} className="break-inside-avoid border-b border-slate-200 pb-2.5 last:border-b-0">
                    <div className="font-bold text-[11px] text-slate-950 mb-1 font-sans">
                      {toBengaliNumber(serialNum)} নম্বর প্রশ্নের উদ্দীপক ও প্রশ্ন:
                    </div>

                    {q.type === 'cq' && (
                      <div className="space-y-1.5">
                        {/* Stimulus Box - full width across the page */}
                        <div className={`bg-slate-50/80 border border-slate-300 rounded-sm font-serif leading-relaxed text-slate-950 text-justify ${fontDensityClasses.stimulusText}`}>
                          {q.stimulus}
                        </div>

                        {/* Sub Questions (ক, খ, গ, ঘ) */}
                        <div className="space-y-1 pl-2 font-sans">
                          {q.subQuestions.map(sq => (
                            <div key={sq.label} className={`flex items-start justify-between text-slate-900 ${fontDensityClasses.cqText}`}>
                              <span><strong>({sq.label})</strong> {sq.question}</span>
                              <span className="font-mono text-slate-700 pl-2 font-bold shrink-0">
                                [{toBengaliNumber(sq.marks)}]
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clean Completion Line */}
        <div className="mt-auto py-2 text-center text-slate-700 font-bold text-xs tracking-wider">
          — সমাপ্ত —
        </div>

        {/* Optional Answer Key for Teachers / Evaluators */}
        {showAnswerKey && sectionKQuestions.length > 0 && (
          <div className="mt-2 pt-1.5 border-t border-dashed border-slate-400 space-y-1">
            <div className="text-center font-bold text-[9px] uppercase tracking-wider text-slate-800 font-sans">
              ★ বহুনির্বাচনী উত্তরমালা (Answer Key) ★
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1 text-[8.5px] text-center font-mono">
              {sectionKQuestions.map((q, idx) => {
                const correctLetters = ['ক', 'খ', 'গ', 'ঘ'];
                return (
                  <div key={idx} className="p-0.5 border border-slate-300 bg-slate-50 rounded">
                    <span className="text-slate-500">{toBengaliNumber(idx + 1)}:</span>
                    <strong className="text-emerald-700 ml-0.5 font-bold">
                      {q.type === 'mcq' ? correctLetters[q.correctOption] : '-'}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Page 4 Footer - ONLY PAGE NUMBER */}
      <div className="relative z-10 pt-1.5 mt-auto border-t border-slate-300 text-center font-bold text-xs text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ৪ —
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Control Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
        
        {/* Left Side: Layout Modes & Options */}
        <div className="flex flex-wrap items-center gap-3">
          
          <button
            onClick={onSwitchToPortrait}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>পোর্ট্রেট ভিউ (A4 সাধারণ)</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* Imposition / Page Layout Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setOrderMode('p4_p1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
                orderMode === 'p4_p1' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="আদর্শ বুকলেট ভাঁজ সেটআপ: পাতা ১ [৪ | ১] এবং পাতা ২ [২ | ৩] - প্রিন্ট করে ভাঁজ করলে ১ সামনে, ভেতরে ২-৩ ও ৪ পেছনে থাকবে"
            >
              <FoldHorizontal className="w-3.5 h-3.5" />
              <span>বুকলেট সেটআপ (৪, ১, ২, ৩)</span>
            </button>

            <button
              onClick={() => setOrderMode('p1_p4')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
                orderMode === 'p1_p4' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="বামে পৃষ্ঠা ১ | ডানে পৃষ্ঠা ৪"
            >
              <FoldHorizontal className="w-3.5 h-3.5" />
              <span>বামে ১ | ডানে ৪</span>
            </button>

            <button
              onClick={() => setOrderMode('p1_p2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
                orderMode === 'p1_p2' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ধারাবাহিক পৃষ্ঠা ক্রম: ১, ২, ৩, ৪"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ধারাবাহিক (১ → ৪)</span>
            </button>
          </div>

          {/* Paper Size: A3 vs A4 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPaperSize('A3')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                paperSize === 'A3' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
              }`}
              title="A3 ল্যান্ডস্কেপ শিট (ভাঁজ করলে ২টি A4 পাতা তৈরি হয়)"
            >
              A3 সাইজ (বোর্ড স্ট্যান্ডার্ড)
            </button>
            <button
              onClick={() => setPaperSize('A4')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                paperSize === 'A4' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
              }`}
              title="A4 ল্যান্ডস্কেপ শিট (ভাঁজ করলে ২টি A5 পাতা তৈরি হয়)"
            >
              A4 সাইজ (হোম প্রিন্টার)
            </button>
          </div>

          {/* Density Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">ঘনত্ব:</span>
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="compact">কমপ্যাক্ট (১০০ মার্ক ফিট)</option>
              <option value="normal">স্ট্যান্ডার্ড</option>
              <option value="spacious">উদার (বড় ফন্ট)</option>
            </select>
          </div>

          {/* Border Frame Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">বর্ডার:</span>
            <select
              value={borderStyle}
              onChange={(e) => setBorderStyle(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="solid">স্ট্যান্ডার্ড ফ্রেম (বোর্ড)</option>
              <option value="double">ক্লাসিক ডাবল ফ্রেম</option>
              <option value="thin">সূক্ষ্ম ফ্রেম (Thin)</option>
            </select>
          </div>

          {/* Toggles */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>জলছাপ</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showAnswerKey}
              onChange={(e) => setShowAnswerKey(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>উত্তরমালা</span>
          </label>
        </div>

        {/* Right Side: Print, Save & Edit */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onEditQuestions}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs md:text-sm cursor-pointer transition"
          >
            ← প্রশ্ন এডিট করুন
          </button>

          {onSavePaper && (
            <button
              onClick={onSavePaper}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs md:text-sm shadow-sm flex items-center gap-1.5 cursor-pointer transition"
              title="প্রশ্নপত্রটি শিরোনাম দিয়ে সংরক্ষণ করুন"
            >
              <Bookmark className="w-4 h-4 text-teal-200" />
              <span>সেভ প্রশ্নপত্র</span>
            </button>
          )}

          {/* Download Multi-Page PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm shadow-sm flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
            title="সম্পূর্ণ ৪-পৃষ্ঠার প্রশ্নপত্রটি ২টি ল্যান্ডস্কেপ শিট আকারে হাই-রেজুলেশন পিডিএফ ডাউনলোড করুন"
          >
            <Download className="w-4 h-4 text-blue-200" />
            <span>{isExportingPdf ? 'পিডিএফ প্রস্তুত হচ্ছে...' : 'পিডিএফ ডাউনলোড (PDF)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>প্রিন্ট করুন (Print Booklet)</span>
          </button>
        </div>
      </div>

      {/* Page Split Adjustment Toolbar */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 font-bold text-emerald-950">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>৪টি পেজে প্রশ্ন বণ্টনের নিয়ন্ত্রণ:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-700">
          {/* MCQ Split Control */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="font-semibold text-slate-600">১ম পৃষ্ঠায় MCQ:</span>
            <button
              onClick={() => setMcqPage1Count(prev => Math.max(1, prev - 1))}
              disabled={mcqPage1Count <= 1}
              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              -
            </button>
            <span className="font-bold text-emerald-800 min-w-[20px] text-center">
              {toBengaliNumber(mcqPage1Count)}
            </span>
            <button
              onClick={() => setMcqPage1Count(prev => Math.min(sectionKQuestions.length, prev + 1))}
              disabled={mcqPage1Count >= sectionKQuestions.length}
              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              +
            </button>
            <span className="text-[11px] text-slate-400">
              (২য় পৃষ্ঠায় {toBengaliNumber(sectionKQuestions.length - mcqPage1Count)}টি)
            </span>
          </div>

          {/* CQ Split Control */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="font-semibold text-slate-600">৩য় পৃষ্ঠায় CQ (সৃজনশীল):</span>
            <button
              onClick={() => setCqPage3Count(prev => Math.max(1, prev - 1))}
              disabled={cqPage3Count <= 1}
              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              -
            </button>
            <span className="font-bold text-emerald-800 min-w-[20px] text-center">
              {toBengaliNumber(cqPage3Count)}
            </span>
            <button
              onClick={() => setCqPage3Count(prev => Math.min(sectionGQuestions.length, prev + 1))}
              disabled={cqPage3Count >= sectionGQuestions.length}
              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              +
            </button>
            <span className="text-[11px] text-slate-400">
              (৪র্থ পৃষ্ঠায় {toBengaliNumber(sectionGQuestions.length - cqPage3Count)}টি)
            </span>
          </div>

          <div className="font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
            মোট মান: {toBengaliNumber(totalCalculatedMarks)}
          </div>
        </div>
      </div>

      {/* Visual Duplex Folding Instruction Guide Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 shadow-sm print:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <FoldHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <span>এপিডোবিট ডুপ্লেক্স ও মাঝখান দিয়ে ভাঁজ করার প্রিন্ট গাইড (Folding Instructions)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-200/80 text-blue-800 font-semibold">
                  ১টি পেপারের উভয় পিঠ
                </span>
              </h3>
              <p className="text-xs text-blue-800/90 mt-1 leading-relaxed">
                ১০০ নম্বরের পূর্ণাঙ্গ মডেল টেস্ট প্রিন্ট করার জন্য আপনার অনেকগুলো কাগজের প্রয়োজন নেই! নিচে প্রদর্শিত <strong>পাতা ১ (বাইরের পিঠ)</strong> এবং <strong>পাতা ২ (ভেতরের পিঠ)</strong> একটি মাত্র A3 বা Legal/A4 কাগজের উভয় পিঠে (এপিডোবিট / Two-Sided Print) প্রিন্ট করুন।
              </p>
              
              {showGuide && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-blue-200/70 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5">১. এপিডোবিট প্রিন্ট:</span>
                    <span className="text-slate-600 leading-normal">
                      প্রিন্ট ডায়ালগে <strong>"Two-Sided (Flip on short edge)"</strong> নির্বাচন করে ল্যান্ডস্কেপে প্রিন্ট দিন।
                    </span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5">২. মাঝখানে ভাঁজ করুন:</span>
                    <span className="text-slate-600 leading-normal">
                      প্রিন্ট হওয়ার পর কাগজটি ঠিক মাঝখানের কাঁচির চিহ্ন (✂) বরাবর সোজা ভাঁজ করে নিন।
                    </span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5">৩. ৪ পাতার কমপ্লিট বুকলেট:</span>
                    <span className="text-slate-600 leading-normal">
                      ভাঁজ করলেই সামনে <strong>পৃষ্ঠা ১</strong>, খুললে ভেতরে <strong>পৃষ্ঠা ২ ও ৩</strong> এবং পেছনে <strong>পৃষ্ঠা ৪</strong> ক্রমানুসারে চমৎকার বইয়ের মতো তৈরি হবে!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-blue-700 hover:text-blue-900 p-1 cursor-pointer shrink-0"
            title="গাইড লুকান / দেখান"
          >
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE SHEETS CONTAINER */}
      {/* ========================================================================= */}
      <div id="printable-booklet-sheets" className="space-y-10">

        {/* ------------------------------------------------------------- */}
        {/* SHEET 1: Outer Cover / Sheet 1                                */}
        {/* Mode p1_p4: Left = Page 1 | Right = Page 4                    */}
        {/* Mode p4_p1: Left = Page 4 | Right = Page 1                    */}
        {/* Mode p1_p2: Left = Page 1 | Right = Page 2                    */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 print:hidden">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>পাতা ১ : ল্যান্ডস্কেপ শিট (Sheet 1)</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {orderMode === 'p4_p1' && 'বামে [পৃষ্ঠা ৪] • ডানে [পৃষ্ঠা ১] (বাইরের কভার: প্রিন্ট করে ভাঁজ করলে ১ সামনে ও ৪ পেছনে থাকবে)'}
              {orderMode === 'p1_p4' && 'বামে [পৃষ্ঠা ১] • ডানে [পৃষ্ঠা ৪]'}
              {orderMode === 'p1_p2' && 'বামে [পৃষ্ঠা ১] • ডানে [পৃষ্ঠা ২] (ধারাবাহিক মোড)'}
            </span>
          </div>

          {/* Physical Sheet 1 Container */}
          <div id="booklet-sheet-1" className="booklet-print-sheet bg-white border border-slate-300 rounded-sm shadow-xl print:shadow-none print:border-none print:m-0 w-full max-w-[1100px] mx-auto">
            <div className="grid grid-cols-2 h-full relative divide-x-2 divide-dashed divide-slate-400">
              
              {/* Left Half of Sheet 1 */}
              <div className="h-full p-2.5 sm:p-3 box-border overflow-hidden flex flex-col">
                {orderMode === 'p1_p4' ? renderPage1() : orderMode === 'p4_p1' ? renderPage4() : renderPage1()}
              </div>

              {/* Center Fold Line Guide (Screen ONLY - Hidden in Print) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between items-center pointer-events-none py-3 text-[10px] text-slate-600 print:hidden z-20">
                <span className="bg-white/95 px-2 py-0.5 rounded border border-slate-300 shadow-2xs font-sans text-[10px] font-bold text-slate-800">
                  ✂ ভাঁজ রেখা (মাঝখান)
                </span>
                <span className="bg-white/95 px-2 py-0.5 rounded border border-slate-300 shadow-2xs font-sans text-[10px] font-bold text-slate-800">
                  ✂ সমান দুই ভাগে ভাঁজ
                </span>
              </div>

              {/* Right Half of Sheet 1 */}
              <div className="h-full p-2.5 sm:p-3 box-border overflow-hidden flex flex-col">
                {orderMode === 'p1_p4' ? renderPage4() : orderMode === 'p4_p1' ? renderPage1() : renderPage2()}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SHEET 2: Inner Spread / Sheet 2                               */}
        {/* Mode p1_p4 / p4_p1: Left = Page 2 | Right = Page 3            */}
        {/* Mode p1_p2: Left = Page 3 | Right = Page 4                    */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 print:hidden">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span>পাতা ২ : ল্যান্ডস্কেপ শিট (Sheet 2)</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {orderMode === 'p1_p2' ? 'বামে [পৃষ্ঠা ৩] • ডানে [পৃষ্ঠা ৪]' : 'বামে [পৃষ্ঠা ২] • ডানে [পৃষ্ঠা ৩] (ভেতরের স্প্রেড: খোলার পর বামে পৃষ্ঠা ২ ও ডানে পৃষ্ঠা ৩ থাকবে)'}
            </span>
          </div>

          {/* Physical Sheet 2 Container */}
          <div id="booklet-sheet-2" className="booklet-print-sheet bg-white border border-slate-300 rounded-sm shadow-xl print:shadow-none print:border-none print:m-0 w-full max-w-[1100px] mx-auto">
            <div className="grid grid-cols-2 h-full relative divide-x-2 divide-dashed divide-slate-400">
              
              {/* Left Half of Sheet 2 */}
              <div className="h-full p-2.5 sm:p-3 box-border overflow-hidden flex flex-col">
                {orderMode === 'p1_p2' ? renderPage3() : renderPage2()}
              </div>

              {/* Center Fold Line Guide (Screen ONLY - Hidden in Print) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between items-center pointer-events-none py-3 text-[10px] text-slate-600 print:hidden z-20">
                <span className="bg-white/95 px-2 py-0.5 rounded border border-slate-300 shadow-2xs font-sans text-[10px] font-bold text-slate-800">
                  ✂ ভাঁজ রেখা (মাঝখান)
                </span>
                <span className="bg-white/95 px-2 py-0.5 rounded border border-slate-300 shadow-2xs font-sans text-[10px] font-bold text-slate-800">
                  ✂ সমান দুই ভাগে ভাঁজ
                </span>
              </div>

              {/* Right Half of Sheet 2 */}
              <div className="h-full p-2.5 sm:p-3 box-border overflow-hidden flex flex-col">
                {orderMode === 'p1_p2' ? renderPage4() : renderPage3()}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Bottom Quick Print Bar (Mobile & Screen convenience) */}
      <div className="sticky bottom-4 z-40 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3 max-w-2xl mx-auto print:hidden">
        <div className="flex items-center gap-2.5 text-xs">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>৪-পৃষ্ঠা বুকলেট লেআউট:</strong> {paperSize} ল্যান্ডস্কেপ • {orderMode === 'p4_p1' ? 'বুকলেট সেটআপ [৪, ১, ২, ৩]' : orderMode === 'p1_p4' ? 'বামে ১ | ডানে ৪' : 'ধারাবাহিক মোড'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToPortrait}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition text-slate-300"
          >
            পোর্ট্রেট ভিউ
          </button>
          
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/40 cursor-pointer transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

    </div>
  );
};
