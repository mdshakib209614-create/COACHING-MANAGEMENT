import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Layers, 
  Trash2, 
  Atom, 
  FlaskConical, 
  Calculator, 
  Dna, 
  Binary,
  ArrowRight,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { subjectsList, chaptersBySubject } from '../data/questionBank';
import { QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';

export const QuestionBankView: React.FC = () => {
  const { questions, deleteQuestion, setActiveTab, setExamNavIntent, examNavIntent } = useApp();

  // Selected Subject (default to intent or first subject)
  const [selectedSubject, setSelectedSubject] = useState<string>(
    examNavIntent?.subject || subjectsList[0]
  );
  const [selectedChapter, setSelectedChapter] = useState<string>('সব অধ্যায়');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'mcq' | 'cq' | 'short'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 30;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, selectedChapter, selectedFormat, searchQuery]);

  // Icon mapping for subjects
  const getSubjectIcon = (subj: string) => {
    switch (subj) {
      case 'পদার্থবিজ্ঞান':
        return Atom;
      case 'রসায়ন':
        return FlaskConical;
      case 'সাধারণ গণিত':
      case 'গণিত':
        return Calculator;
      case 'উচ্চতর গণিত':
        return Calculator;
      case 'জীববিজ্ঞান':
        return Dna;
      case 'তথ্য ও যোগাযোগ প্রযুক্তি':
        return Binary;
      default:
        return BookOpen;
    }
  };

  const availableChapters = useMemo(() => {
    return chaptersBySubject[selectedSubject] || [];
  }, [selectedSubject]);

  // Filtered questions strictly for this view
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Subject matching
      const matchSubject = q.subject === selectedSubject ||
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
      if (!matchSubject) return false;

      // Chapter matching
      if (selectedChapter !== 'সব অধ্যায়' && q.chapter !== selectedChapter) {
        return false;
      }

      // Format matching
      if (selectedFormat !== 'all' && q.type !== selectedFormat) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inChapter = q.chapter?.toLowerCase().includes(query);
        const inTopic = q.topic?.toLowerCase().includes(query);
        let inContent = false;
        if (q.type === 'mcq') {
          const mcq = q as MCQQuestion;
          inContent = mcq.question.toLowerCase().includes(query) || mcq.options.some(o => o.toLowerCase().includes(query));
        } else if (q.type === 'cq') {
          const cq = q as CQQuestion;
          inContent = cq.stimulus.toLowerCase().includes(query) || cq.subQuestions.some(sq => sq.question.toLowerCase().includes(query));
        } else if (q.type === 'short') {
          const sq = q as ShortQuestion;
          inContent = sq.question.toLowerCase().includes(query) || (sq.answer?.toLowerCase().includes(query) || false);
        }
        return inChapter || inTopic || inContent;
      }

      return true;
    });
  }, [questions, selectedSubject, selectedChapter, selectedFormat, searchQuery]);

  // Overall counts for active subject
  const subjectTotalQuestions = useMemo(() => {
    return questions.filter(q => 
      q.subject === selectedSubject || 
      (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
      (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত')
    );
  }, [questions, selectedSubject]);

  const mcqCount = subjectTotalQuestions.filter(q => q.type === 'mcq').length;
  const cqCount = subjectTotalQuestions.filter(q => q.type === 'cq').length;
  const shortCount = subjectTotalQuestions.filter(q => q.type === 'short').length;
  const boardCount = subjectTotalQuestions.filter(q => !!q.boardInfo).length;

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQuestions = useMemo(() => {
    return filteredQuestions.slice(startIndex, startIndex + pageSize);
  }, [filteredQuestions, startIndex, pageSize]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                প্রশ্ন ব্যাংক এক্সপ্লোরার (Question Bank)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                মোট {questions.length} টি প্রশ্ন
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ফিজিক্স, কেমিস্ট্রি, গণিত, উচ্চতর গণিত, জীববিজ্ঞান ও আইসিটি বিষয়ের অধ্যায়ভিত্তিক সমৃদ্ধ প্রশ্নভাণ্ডার।
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('add-question')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>➕ প্রশ্নপত্র অ্যাড করুন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setExamNavIntent({ subject: selectedSubject, tab: 'builder' });
              setActiveTab('exam-questions');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>প্রশ্নপত্র তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* 6 Subject Tabs (Clean horizontal pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {subjectsList.map(subj => {
          const SubjIcon = getSubjectIcon(subj);
          const isSelected = selectedSubject === subj;
          const count = questions.filter(q => 
            q.subject === subj || 
            (subj === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
            (subj === 'গণিত' && q.subject === 'সাধারণ গণিত')
          ).length;

          return (
            <button
              key={subj}
              type="button"
              onClick={() => {
                setSelectedSubject(subj);
                setSelectedChapter('সব অধ্যায়');
              }}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <SubjIcon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-indigo-600'}`} />
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count} টি
                </span>
              </div>
              <div className="font-bold text-xs truncate">{subj}</div>
            </button>
          );
        })}
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Format pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            {[
              { id: 'all', label: 'সকল ফরম্যাট' },
              { id: 'mcq', label: `এমসিকিউ (${mcqCount})` },
              { id: 'cq', label: `সৃজনশীল (${cqCount})` },
              { id: 'short', label: `শর্ট কোশ্চেন (${shortCount})` }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFormat(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  selectedFormat === f.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="প্রশ্ন বা বিষয়বস্তু দিয়ে খুঁজুন..."
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-slate-50 w-60 sm:w-72 focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Chapter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedChapter('সব অধ্যায়')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedChapter === 'সব অধ্যায়'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            সব অধ্যায় ({subjectTotalQuestions.length})
          </button>

          {availableChapters.map(ch => {
            const chCount = subjectTotalQuestions.filter(q => q.chapter === ch).length;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => setSelectedChapter(ch)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedChapter === ch
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {ch} ({chCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Listing */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-semibold px-1 gap-2">
          <span>
            ফলাফল: মোট {filteredQuestions.length} টি প্রশ্নের মধ্যে {startIndex + 1} - {Math.min(startIndex + pageSize, filteredQuestions.length)} টি প্রদর্শিত (পৃষ্ঠা {currentPage}/{totalPages})
          </span>
          {boardCount > 0 && (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              বোর্ড ও ক্যাডেট প্রশ্ন: {boardCount} টি
            </span>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <p className="text-sm font-bold text-slate-700">কোনো প্রশ্ন পাওয়া যায়নি!</p>
            <p className="text-xs text-slate-500">
              উপরের ফিল্টার পরিবর্তন করুন অথবা 'প্রশ্নপত্র অ্যাড করুন' বাটনে ক্লিক করে নতুন প্রশ্ন যোগ করুন।
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('add-question')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন প্রশ্ন যোগ করুন</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3.5">
              {paginatedQuestions.map((q, idx) => {
                const isMCQ = q.type === 'mcq';
                const isCQ = q.type === 'cq';
                const isShort = q.type === 'short';

                return (
                  <div 
                    key={q.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3"
                  >
                  {/* Top metadata tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        #{startIndex + idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                        {q.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {q.chapter}
                      </span>
                      {q.topic && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px]">
                          টপিক: {q.topic}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        isMCQ ? 'bg-emerald-100 text-emerald-800' :
                        isCQ ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isMCQ ? 'MCQ বহুনির্বাচনী' : isCQ ? 'CQ সৃজনশীল' : 'শর্ট কোশ্চেন'}
                      </span>
                      {q.boardInfo && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                          🏛️ {q.boardInfo}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        পূর্ণমান: {q.marks || (isCQ ? 10 : 1)}
                      </span>
                      {q.id.startsWith('custom-') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('আপনি কি এই কাস্টম প্রশ্নটি মুছে ফেলতে চান?')) {
                              deleteQuestion(q.id);
                            }
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="প্রশ্ন মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  {isMCQ && (
                    <div className="space-y-2.5">
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {(q as MCQQuestion).question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                        {(q as MCQQuestion).options.map((opt, optIdx) => {
                          const isCorrect = optIdx === (q as MCQQuestion).correctOption;
                          const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                          return (
                            <div 
                              key={optIdx}
                              className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                                isCorrect 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' 
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {labels[optIdx]}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {(q as MCQQuestion).explanation && (
                        <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 border border-slate-100 flex items-start gap-1.5">
                          <span className="font-bold text-slate-700 shrink-0">ব্যাখ্যা:</span>
                          <span>{(q as MCQQuestion).explanation}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isCQ && (
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed font-medium">
                        <strong className="text-slate-900 block mb-1">উদ্দীপক:</strong>
                        {(q as CQQuestion).stimulus}
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-800 pl-2">
                        {(q as CQQuestion).subQuestions.map(sq => (
                          <div key={sq.label} className="flex items-start gap-2">
                            <span className="font-bold text-indigo-700 shrink-0">({sq.label})</span>
                            <span className="flex-1 font-medium">{sq.question}</span>
                            <span className="text-slate-400 font-mono text-[11px] shrink-0">[{sq.marks}]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isShort && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {(q as ShortQuestion).question}
                      </p>
                      {(q as ShortQuestion).answer && (
                        <div className="bg-emerald-50/70 p-2.5 rounded-xl text-xs text-emerald-900 border border-emerald-100">
                          <strong className="block mb-0.5">আদর্শ সমাধান / উত্তর:</strong>
                          <span>{(q as ShortQuestion).answer}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mt-4">
              <div className="text-xs text-slate-500 font-medium">
                পৃষ্ঠা <strong className="text-slate-800 font-bold">{currentPage}</strong> এর মধ্যে <strong className="text-slate-800 font-bold">{totalPages}</strong> (মোট {filteredQuestions.length} টি প্রশ্ন)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  প্রথম
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="পূর্ববর্তী পৃষ্ঠা"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = currentPage;
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    
                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="পরবর্তী পৃষ্ঠা"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  সর্বশেষ
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};
