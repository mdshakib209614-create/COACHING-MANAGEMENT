import React, { useState } from 'react';
import { 
  PlusCircle, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Layers, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Check, 
  Tag, 
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';
import { subjectsList, chaptersBySubject } from '../data/questionBank';

export const AddQuestionView: React.FC = () => {
  const { addCustomQuestion, questions, deleteQuestion, setActiveTab, setExamNavIntent } = useApp();

  // Selected Subject & Chapter
  const [selectedSubject, setSelectedSubject] = useState<string>(subjectsList[0]);
  const [selectedChapter, setSelectedChapter] = useState<string>(
    chaptersBySubject[subjectsList[0]]?.[0] || 'সাধারণ ও বিবিধ'
  );
  const [customChapterName, setCustomChapterName] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [boardInfo, setBoardInfo] = useState<string>('');
  const [importance, setImportance] = useState<'standard' | 'high' | 'very_high'>('high');

  // Format: 'mcq' | 'cq' | 'short'
  const [format, setFormat] = useState<'mcq' | 'cq' | 'short'>('mcq');

  // MCQ state
  const [mcqQuestion, setMcqQuestion] = useState<string>('');
  const [mcqOptions, setMcqOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<0 | 1 | 2 | 3>(0);
  const [mcqExplanation, setMcqExplanation] = useState<string>('');
  const [mcqMarks, setMcqMarks] = useState<number>(1);

  // CQ state
  const [cqStimulus, setCqStimulus] = useState<string>('');
  const [cqA, setCqA] = useState<string>('');
  const [cqB, setCqB] = useState<string>('');
  const [cqC, setCqC] = useState<string>('');
  const [cqD, setCqD] = useState<string>('');

  // Short Question state
  const [shortQuestion, setShortQuestion] = useState<string>('');
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const [shortMarks, setShortMarks] = useState<number>(1);

  // Success Notification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // When subject changes, reset chapter
  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    const chapters = chaptersBySubject[subj] || [];
    setSelectedChapter(chapters[0] || 'সাধারণ ও বিবিধ');
    setCustomChapterName('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const finalChapter = customChapterName.trim() || selectedChapter;

    if (format === 'mcq') {
      if (!mcqQuestion.trim()) {
        alert('দয়া করে এমসিকিউ প্রশ্ন বা উদ্দীপকটি টাইপ করুন!');
        return;
      }
      if (mcqOptions.some(opt => !opt.trim())) {
        alert('দয়া করে ক, খ, গ, ঘ চারটি অপশনেরই মান পূরণ করুন!');
        return;
      }

      const item: MCQQuestion = {
        id: `custom-mcq-${Date.now()}`,
        subject: selectedSubject,
        chapter: finalChapter,
        topic: topic.trim() || undefined,
        question: mcqQuestion.trim(),
        options: [mcqOptions[0].trim(), mcqOptions[1].trim(), mcqOptions[2].trim(), mcqOptions[3].trim()],
        correctOption,
        explanation: mcqExplanation.trim() || undefined,
        marks: mcqMarks || 1,
        type: 'mcq',
        boardInfo: boardInfo.trim() || undefined,
        importance
      };

      addCustomQuestion(item);
      setMcqQuestion('');
      setMcqOptions(['', '', '', '']);
      setMcqExplanation('');
      setSuccessMessage('এমসিকিউ প্রশ্নটি সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    } else if (format === 'cq') {
      if (!cqStimulus.trim()) {
        alert('দয়া করে সিকিউ প্রশ্নের উদ্দীপকটি লিখুন!');
        return;
      }
      if (!cqA.trim() || !cqB.trim() || !cqC.trim() || !cqD.trim()) {
        alert('দয়া করে ক, খ, গ, ঘ চারটি উপ-প্রশ্নই পূরণ করুন!');
        return;
      }

      const item: CQQuestion = {
        id: `custom-cq-${Date.now()}`,
        subject: selectedSubject,
        chapter: finalChapter,
        stimulus: cqStimulus.trim(),
        subQuestions: [
          { label: 'ক', question: cqA.trim(), marks: 1 },
          { label: 'খ', question: cqB.trim(), marks: 2 },
          { label: 'গ', question: cqC.trim(), marks: 3 },
          { label: 'ঘ', question: cqD.trim(), marks: 4 }
        ],
        marks: 10,
        type: 'cq',
        boardInfo: boardInfo.trim() || undefined,
        importance
      };

      addCustomQuestion(item);
      setCqStimulus('');
      setCqA('');
      setCqB('');
      setCqC('');
      setCqD('');
      setSuccessMessage('সৃজনশীল (CQ) প্রশ্নটি সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    } else if (format === 'short') {
      if (!shortQuestion.trim()) {
        alert('দয়া করে সংক্ষিপ্ত প্রশ্নটি লিখুন!');
        return;
      }

      const item: ShortQuestion = {
        id: `custom-short-${Date.now()}`,
        subject: selectedSubject,
        chapter: finalChapter,
        topic: topic.trim() || undefined,
        question: shortQuestion.trim(),
        answer: shortAnswer.trim() || undefined,
        marks: shortMarks || 1,
        type: 'short',
        boardInfo: boardInfo.trim() || undefined,
        importance
      };

      addCustomQuestion(item);
      setShortQuestion('');
      setShortAnswer('');
      setSuccessMessage('সংক্ষিপ্ত প্রশ্নটি সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    }

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Recently added custom questions
  const userAddedQuestions = questions.filter(q => q.id.startsWith('custom-'));

  const availableChapters = chaptersBySubject[selectedSubject] || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                প্রশ্নপত্র অ্যাড (Add New Question)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                প্রশ্ন ইনপুট
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              এমসিকিউ, সিকিউ এবং শর্ট কোশ্চেন ফরম্যাটে আপনার ইচ্ছামতো প্রশ্ন তৈরি করে বিষয়ের অধ্যায়ে যুক্ত করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('question-bank')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>প্রশ্ন ব্যাংক দেখুন</span>
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

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleAddQuestion} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Step 1: Dropdowns for Subject & Chapter Selection */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Tag className="w-4 h-4 text-indigo-600" />
            <span>১. বিষয় ও অধ্যায় নির্বাচন করুন (Select Subject & Chapter):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Subject Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                বিষয় নির্বাচন:
              </label>
              <select
                value={selectedSubject}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              >
                {subjectsList.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Chapter Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                অধ্যায় নির্বাচন:
              </label>
              <select
                value={selectedChapter}
                onChange={e => {
                  setSelectedChapter(e.target.value);
                  setCustomChapterName('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              >
                {availableChapters.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
                <option value="__custom__">➕ নতুন অধ্যায়ের নাম লিখুন...</option>
              </select>
            </div>

            {/* If custom chapter selected */}
            {selectedChapter === '__custom__' && (
              <div>
                <label className="block text-[11px] font-bold text-indigo-700 mb-1">
                  নতুন অধ্যায়ের নাম টাইপ করুন:
                </label>
                <input
                  type="text"
                  value={customChapterName}
                  onChange={e => setCustomChapterName(e.target.value)}
                  placeholder="যেমন: পরিপাক ও শোষণ"
                  className="w-full px-3 py-2 text-xs border border-indigo-300 rounded-xl bg-white font-semibold text-slate-800 focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {/* Topic (optional) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                টপিক / বিষয়বস্তু (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="যেমন: ওহমের সূত্র"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800"
              />
            </div>

            {/* Board and Year Tag */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                বোর্ড ও সন (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={boardInfo}
                onChange={e => setBoardInfo(e.target.value)}
                placeholder="যেমন: ঢাকা বোর্ড '২৩ বা কমন"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Step 2: 3 Question Formats Selector (এমসিকিউ, সিকিউ, শর্ট কোশ্চেন) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            ২. প্রশ্নপত্রের ফরম্যাট সিলেক্ট করুন (Select Format):
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormat('mcq')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                format === 'mcq'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>১. এমসিকিউ (MCQ)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  ক, খ, গ, ঘ চার অপশন বিশিষ্ট বহুনির্বাচনী
                </div>
              </div>
              {format === 'mcq' && <Check className="w-4 h-4 text-emerald-700" />}
            </button>

            <button
              type="button"
              onClick={() => setFormat('cq')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                format === 'cq'
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>২. সিকিউ (CQ সৃজনশীল)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  উদ্দীপক + ক, খ, গ, ঘ ১০ নম্বরের সৃজনশীল
                </div>
              </div>
              {format === 'cq' && <Check className="w-4 h-4 text-indigo-700" />}
            </button>

            <button
              type="button"
              onClick={() => setFormat('short')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                format === 'short'
                  ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>৩. শর্ট কোশ্চেন (Short Question)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  সংক্ষিপ্ত প্রশ্ন ও উত্তর (১ বা ২ মার্ক)
                </div>
              </div>
              {format === 'short' && <Check className="w-4 h-4 text-amber-700" />}
            </button>
          </div>
        </div>

        {/* Step 3: Question Inputs based on selected format */}
        
        {/* ===================== 1. MCQ FORMAT ===================== */}
        {format === 'mcq' && (
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                উদ্দীপক বা প্রশ্ন টাইপ করুন: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={mcqQuestion}
                onChange={e => setMcqQuestion(e.target.value)}
                placeholder="যেমন: নিচের কোনটি শক্তির একক?"
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-medium"
                required
              />
            </div>

            {/* 4 Options: ক, খ, গ, ঘ */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                ক, খ, গ, ঘ অপশনসমূহ এবং সঠিক উত্তর সিলেক্ট করুন: <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'ক', index: 0 as const, placeholder: 'অপশন (ক) এর মান...' },
                  { label: 'খ', index: 1 as const, placeholder: 'অপশন (খ) এর মান...' },
                  { label: 'গ', index: 2 as const, placeholder: 'অপশন (গ) এর মান...' },
                  { label: 'ঘ', index: 3 as const, placeholder: 'অপশন (ঘ) এর মান...' }
                ].map(opt => (
                  <div 
                    key={opt.index} 
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                      correctOption === opt.index
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-300'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={correctOption === opt.index}
                        onChange={() => setCorrectOption(opt.index)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        correctOption === opt.index
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.label}
                      </span>
                    </label>

                    <input
                      type="text"
                      value={mcqOptions[opt.index]}
                      onChange={e => {
                        const newOpts = [...mcqOptions] as [string, string, string, string];
                        newOpts[opt.index] = e.target.value;
                        setMcqOptions(newOpts);
                      }}
                      placeholder={opt.placeholder}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:border-emerald-500"
                      required
                    />

                    {correctOption === opt.index && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                        সঠিক উত্তর
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation and Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  সঠিক উত্তরের ব্যাখ্যা বা নোট (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={mcqExplanation}
                  onChange={e => setMcqExplanation(e.target.value)}
                  placeholder="যেমন: এসআই পদ্ধতিতে কাজের একক জুল।"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  নম্বর (Marks):
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={mcqMarks}
                  onChange={e => setMcqMarks(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== 2. CQ FORMAT ===================== */}
        {format === 'cq' && (
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                উদ্দীপক (Stimulus / Scenario): <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={cqStimulus}
                onChange={e => setCqStimulus(e.target.value)}
                placeholder="উদ্দীপকটি এখানে বিস্তারিত লিখুন..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed font-medium"
                required
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800">
                সৃজনশীল প্রশ্নের ৪টি ধাপ (ক, খ, গ, ঘ): <span className="text-rose-500">*</span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-xs font-bold px-2 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-center">
                    ক (১)
                  </span>
                  <input
                    type="text"
                    value={cqA}
                    onChange={e => setCqA(e.target.value)}
                    placeholder="জ্ঞানমূলক প্রশ্ন..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-xs font-bold px-2 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-center">
                    খ (২)
                  </span>
                  <input
                    type="text"
                    value={cqB}
                    onChange={e => setCqB(e.target.value)}
                    placeholder="অনুধাবনমূলক প্রশ্ন..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-xs font-bold px-2 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-center">
                    গ (৩)
                  </span>
                  <input
                    type="text"
                    value={cqC}
                    onChange={e => setCqC(e.target.value)}
                    placeholder="প্রয়োগমূলক প্রশ্ন..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-xs font-bold px-2 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-center">
                    ঘ (৪)
                  </span>
                  <input
                    type="text"
                    value={cqD}
                    onChange={e => setCqD(e.target.value)}
                    placeholder="উচ্চতর দক্ষতামূলক প্রশ্ন..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== 3. SHORT QUESTION FORMAT ===================== */}
        {format === 'short' && (
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                সংক্ষিপ্ত বা এককথায় প্রশ্ন: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={shortQuestion}
                onChange={e => setShortQuestion(e.target.value)}
                placeholder="যেমন: বলের মাত্রা সমীকরণ কী?"
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 leading-relaxed font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  উত্তর বা সমাধান (ঐচ্ছিক):
                </label>
                <textarea
                  rows={2}
                  value={shortAnswer}
                  onChange={e => setShortAnswer(e.target.value)}
                  placeholder="সংক্ষিপ্ত উত্তর বা সমীকরণটি লিখুন..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  নম্বর (Marks):
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={shortMarks}
                  onChange={e => setShortMarks(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button: অ্যাড কোশ্চেন */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              প্রশ্নটি <strong>{selectedSubject}</strong> বিষয়ের <strong>{customChapterName.trim() || selectedChapter}</strong> অধ্যায়ে যুক্ত হবে।
            </span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>অ্যাড কোশ্চেন (+ Add Question)</span>
          </button>
        </div>
      </form>

      {/* Recently Added Questions Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">
              আপনার সদ্য যুক্ত করা প্রশ্নসমূহ ({userAddedQuestions.length} টি)
            </h2>
          </div>
          {userAddedQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('exam-questions')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>প্রশ্নপত্র তৈরিতে ব্যবহার করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {userAddedQuestions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
            এখনও কোনো কাস্টম প্রশ্ন যোগ করা হয়নি। উপরের ফর্মে বিষয় ও অধ্যায় সিলেক্ট করে সহজেই প্রশ্ন যোগ করুন!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {userAddedQuestions.map(q => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {q.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                      অধ্যায়: {q.chapter}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold uppercase">
                      {q.type}
                    </span>
                    {q.boardInfo && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px]">
                        {q.boardInfo}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-slate-900 mt-1">
                    {q.type === 'mcq' ? (q as MCQQuestion).question : 
                     q.type === 'cq' ? (q as CQQuestion).stimulus : 
                     (q as ShortQuestion).question}
                  </p>

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] text-slate-600 pt-1">
                      {(q as MCQQuestion).options.map((opt, idx) => (
                        <div key={idx} className={idx === (q as MCQQuestion).correctOption ? 'font-bold text-emerald-700' : ''}>
                          {['(ক)', '(খ)', '(গ)', '(ঘ)'][idx]} {opt} {idx === (q as MCQQuestion).correctOption && '✓'}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'short' && (q as ShortQuestion).answer && (
                    <p className="text-[11px] text-slate-600">
                      <strong>উত্তর:</strong> {(q as ShortQuestion).answer}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('এই প্রশ্নটি অপসারণ করতে চান?')) {
                      deleteQuestion(q.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                  title="প্রশ্ন ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
