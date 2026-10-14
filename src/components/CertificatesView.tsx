import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  Award, 
  School, 
  UserCheck, 
  ChevronRight,
  Sparkles,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const CertificatesView: React.FC = () => {
  const { students, institution } = useApp();

  const [certType, setCertType] = useState<'promotion' | 'tc' | 'testimonial' | 'bonafide'>('promotion');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  
  // Form fields matching Screenshot 2
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const [serialNo, setSerialNo] = useState('১২৫');
  const [issueDate, setIssueDate] = useState('১৬-Sep-২০২৬');
  const [academicYear, setAcademicYear] = useState('২০২৬');
  const [finishedClass, setFinishedClass] = useState(currentStudent?.class || '১ম শ্রেণি');
  const [nextClass, setNextClass] = useState('২য় শ্রেণি');
  const [evaluationTerm, setEvaluationTerm] = useState('বার্ষিক মূল্যায়ন');
  const [gradeAndPosition, setGradeAndPosition] = useState('A+, ১ম স্থান');
  const [conduct, setConduct] = useState('উত্তম ও চরিত্রবান');
  const [reasonForLeaving, setReasonForLeaving] = useState('পিতার কর্মস্থল পরিবর্তনের কারণে');

  // When student selection changes, auto-fill
  const handleStudentChange = (stId: string) => {
    setSelectedStudentId(stId);
    const st = students.find(s => s.id === stId);
    if (st) {
      setFinishedClass(st.class);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCertTitle = () => {
    switch (certType) {
      case 'promotion': return 'শ্রেণি উত্তীর্ণ প্রত্যয়ন পত্র';
      case 'tc': return 'ছাড়পত্র / ট্রান্সফার সার্টিফিকেট (TC)';
      case 'testimonial': return 'প্রশংসাপত্র (Testimonial)';
      case 'bonafide': return 'অধ্যয়নরত সনদ (Bonafide Certificate)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Submenu Tabs Matching Screenshot 1 & 2 Right Side Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs no-print">
        <button
          onClick={() => setCertType('promotion')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            certType === 'promotion'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>শ্রেণি উত্তীর্ণ প্রত্যয়ন</span>
        </button>

        <button
          onClick={() => setCertType('tc')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            certType === 'tc'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ছাড়পত্র / TC</span>
        </button>

        <button
          onClick={() => setCertType('testimonial')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            certType === 'testimonial'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>প্রশংসাপত্র</span>
        </button>

        <button
          onClick={() => setCertType('bonafide')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            certType === 'bonafide'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <School className="w-4 h-4" />
          <span>অধ্যয়নরত সনদ</span>
        </button>
      </div>

      {/* Form Card (Matching Screenshot 2) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>{getCertTitle()} জেনারেটর ফর্ম</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              As Landscape - এক পেজে একজন - নমুনা অনুযায়ী স্বয়ংক্রিয় ফিল হবে
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>সনদ প্রিন্ট করুন (Print / PDF)</span>
          </button>
        </div>

        {/* Form Inputs matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-['Hind_Siliguri',sans-serif]">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">শ্রেণি (প্রথম লাইনে):</label>
            <input
              type="text"
              value={finishedClass}
              onChange={e => setFinishedClass(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">রোল নং (প্রথম লাইনে):</label>
            <input
              type="text"
              value={currentStudent?.roll || ''}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-mono font-bold text-emerald-800"
              placeholder="রোল লিখুন - অটো ফিল হবে"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">সিরিয়াল নং:</label>
            <input
              type="text"
              value={serialNo}
              onChange={e => setSerialNo(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              placeholder="যেমন: ১২৫"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">তারিখ:</label>
            <input
              type="text"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              placeholder="১৬-Sep-২০২৬"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              শিক্ষার্থী (শুধু নাম - উক্ত শ্রেণির) সকল শ্রেণি - {students.length} জন:
            </label>
            <select
              value={selectedStudentId}
              onChange={e => handleStudentChange(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-semibold bg-emerald-50/40 text-slate-900"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nameBn} - রোল: {s.roll} ({s.class})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">পিতা:</label>
            <input
              type="text"
              value={currentStudent?.fatherName || ''}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100"
              placeholder="পিতার নাম - অটো"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">মাতা:</label>
            <input
              type="text"
              value={currentStudent?.motherName || ''}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100"
              placeholder="মাতার নাম - অটো"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">জন্ম তারিখ:</label>
            <input
              type="text"
              value={currentStudent?.birthDate || ''}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">জন্ম তারিখ (কথায়) - অটো:</label>
            <input
              type="text"
              value={currentStudent?.birthDateWords || ''}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">শিক্ষাবর্ষ:</label>
            <input
              type="text"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              placeholder="যেমন: ২০২৬"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">প্রান্তিক মূল্যায়ন:</label>
            <select
              value={evaluationTerm}
              onChange={e => setEvaluationTerm(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
            >
              <option value="বার্ষিক মূল্যায়ন">বার্ষিক মূল্যায়ন</option>
              <option value="১ম প্রান্তিক মূল্যায়ন">১ম প্রান্তিক মূল্যায়ন</option>
              <option value="২য় প্রান্তিক মূল্যায়ন">২য় প্রান্তিক মূল্যায়ন</option>
              <option value="৩য় প্রান্তিক মূল্যায়ন">৩য় প্রান্তিক মূল্যায়ন</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">অর্জিত গ্রেড ও অবস্থান:</label>
            <input
              type="text"
              value={gradeAndPosition}
              onChange={e => setGradeAndPosition(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
              placeholder="যেমন: A+ , ১ম স্থান"
            />
          </div>

          {certType === 'promotion' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">পরবর্তী শ্রেণি:</label>
              <input
                type="text"
                value={nextClass}
                onChange={e => setNextClass(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-emerald-800"
              />
            </div>
          )}

          {certType === 'tc' && (
            <div className="lg:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">ছাড়পত্রের কারণ:</label>
              <input
                type="text"
                value={reasonForLeaving}
                onChange={e => setReasonForLeaving(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          )}

          <div className="lg:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">বিদ্যালয়ের নাম (অটো):</label>
            <input
              type="text"
              value={institution.nameBn}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-medium"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">ঠিকানা (অটো):</label>
            <input
              type="text"
              value={`${institution.village}, পোস্ট: ${institution.postOffice}, উপজেলা: ${institution.upazila}, জেলা: ${institution.district}`}
              readOnly
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100"
            />
          </div>
        </div>
      </div>

      {/* AUTHENTIC CERTIFICATE PREVIEW (Exact match to Screenshot 1) */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border-4 border-slate-900 shadow-xl max-w-5xl mx-auto text-slate-950 font-['Hind_Siliguri',sans-serif] page-break relative overflow-hidden">
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-slate-800"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-slate-800"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-slate-800"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-slate-800"></div>

        {/* Top Header with Govt/Monogram Logo & Grade Scale Table (Matching Screenshot 1) */}
        <div className="flex justify-between items-start mb-6">
          {/* Left Serial */}
          <div className="text-xs">
            <span className="font-semibold">সিরিয়াল নং:</span>{' '}
            <span className="font-mono font-bold border-b border-dotted border-slate-800 px-2">{serialNo}</span>
          </div>

          {/* Center Institution Banner */}
          <div className="text-center flex-1 px-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full border border-emerald-600 bg-emerald-50 flex items-center justify-center text-emerald-800 font-bold text-xs">
                বাংলাদেশ
              </div>
            </div>
            <p className="text-[11px] font-semibold text-slate-700">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
            <p className="text-[10px] text-slate-600">প্রাথমিক ও গণশিক্ষা মন্ত্রণালয় / একাডেমি শিক্ষা বিভাগ</p>
            <h2 className="text-xl md:text-2xl font-black text-slate-950 mt-1 tracking-wide">
              {institution.nameBn}
            </h2>
            <p className="text-xs text-slate-700">
              গ্রাম: {institution.village}, ডাকঘর: {institution.postOffice}, উপজেলা: {institution.upazila}, জেলা: {institution.district}।
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              স্থাপিত: {institution.established} ইং। EMIS নং: {institution.emisNo}
            </p>
          </div>

          {/* Right Date and Grade Scale Table (Matching Screenshot 1) */}
          <div className="text-right text-xs">
            <div className="mb-2">
              <span className="font-semibold">তারিখ:</span>{' '}
              <span className="font-mono border-b border-dotted border-slate-800 px-2">{issueDate}</span>
            </div>

            <div className="border border-slate-800 text-[10px] text-left">
              <div className="bg-slate-100 font-bold px-2 py-0.5 border-b border-slate-800 flex justify-between">
                <span>নম্বর</span>
                <span>গ্রেড ও বর্ণনা</span>
              </div>
              <div className="px-2 py-0.5 border-b border-slate-300 flex justify-between">
                <span>৮০-১০০</span>
                <span>ক. অতি উত্তম</span>
              </div>
              <div className="px-2 py-0.5 border-b border-slate-300 flex justify-between">
                <span>৬০-৭৯</span>
                <span>খ. উত্তম</span>
              </div>
              <div className="px-2 py-0.5 border-b border-slate-300 flex justify-between">
                <span>৫০-৫৯</span>
                <span>গ. ভালো</span>
              </div>
              <div className="px-2 py-0.5 flex justify-between">
                <span>৪০-৪৯</span>
                <span>ঘ. সাধারণ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Title Badge matching Screenshot 1 */}
        <div className="text-center my-6">
          <span className="inline-block border-2 border-slate-900 px-8 py-1 text-lg font-extrabold tracking-widest text-slate-950 bg-slate-50 shadow-xs">
            {getCertTitle()}
          </span>
        </div>

        {/* Certificate Body Text (Matching Screenshot 1 exact phrasing) */}
        <div className="text-sm md:text-base leading-loose text-justify space-y-4 px-2 my-8 font-normal">
          {certType === 'promotion' && (
            <p>
              এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{' '}
              <strong className="border-b-2 border-slate-800 border-dotted px-4 font-bold text-slate-950">
                {currentStudent?.nameBn || '.................................'}
              </strong>
              , পিতা:{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-4">
                {currentStudent?.fatherName || '.................................'}
              </span>
              , মাতা:{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-4">
                {currentStudent?.motherName || '.................................'}
              </span>
              , জন্ম তারিখ:{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-2 font-mono">
                {currentStudent?.birthDate}
              </span>{' '}
              (কথায়):{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-2">
                {currentStudent?.birthDateWords || '.................................'}
              </span>
              , শ্রেণি:{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-3 font-bold">
                {finishedClass}
              </span>
              , রোল নং:{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-3 font-mono font-bold">
                {currentStudent?.roll}
              </span>{' '}
              এই বিদ্যালয়ে/কোচিংয়ে{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-2 font-mono">
                {academicYear}
              </span>{' '}
              শিক্ষাবর্ষে{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-2 font-bold">
                {finishedClass}
              </span>{' '}
              শ্রেণিতে অধ্যয়ন শেষে{' '}
              <span className="border-b-2 border-slate-800 border-dotted px-2 font-semibold">
                {evaluationTerm}
              </span>{' '}
              এ অংশগ্রহণ করে সাফল্যের সাথে উত্তীর্ণ হয়েছে। তার অর্জিত গ্রেড ও অবস্থান:{' '}
              <strong className="border-b-2 border-slate-800 border-dotted px-3 text-emerald-900">
                {gradeAndPosition}
              </strong>
              । সে পরবর্তী{' '}
              <strong className="border-b-2 border-slate-800 border-dotted px-2 text-indigo-900">
                {nextClass}
              </strong>{' '}
              শ্রেণিতে উত্তীর্ণ হওয়ার যোগ্য। আমি তার সর্বাঙ্গীন মঙ্গল ও ভবিষ্যৎ সাফল্য কামনা করি।
            </p>
          )}

          {certType === 'tc' && (
            <p>
              এই মর্মে ছাড়পত্র প্রদান করা যাচ্ছে যে,{' '}
              <strong className="border-b-2 border-slate-800 border-dotted px-4 font-bold">
                {currentStudent?.nameBn}
              </strong>
              , পিতা: {currentStudent?.fatherName}, মাতা: {currentStudent?.motherName}, শ্রেণি: <strong>{finishedClass}</strong>, রোল নং: <strong className="font-mono">{currentStudent?.roll}</strong>। উক্ত শিক্ষার্থী এ প্রতিষ্ঠানে সুনাম ও নিয়মানুবর্তিতার সাথে অধ্যয়ন করেছে। অধ্যয়নকালে সে কোনো প্রকার শৃঙ্খলা পরিপন্থী কাজে জড়িত ছিল না। {reasonForLeaving} প্রেক্ষিতে তাহার আবেদনের ভিত্তিতে অত্র ছাড়পত্র প্রদান করা হইল। অত্র প্রতিষ্ঠানে তাহার যাবতীয় পাওনাদি ও ফি পরিশোধিত রহিয়াছে।
            </p>
          )}

          {certType === 'testimonial' && (
            <p>
              এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{' '}
              <strong className="border-b-2 border-slate-800 border-dotted px-4 font-bold">
                {currentStudent?.nameBn}
              </strong>
              , পিতা: {currentStudent?.fatherName}, মাতা: {currentStudent?.motherName}, জন্ম তারিখ: <span className="font-mono">{currentStudent?.birthDate}</span>। সে অত্র প্রতিষ্ঠানের একজন নিয়মিত ও চরিত্রবান শিক্ষার্থী। আমার জানা মতে সে কোনো রাষ্ট্র কিংবা প্রতিষ্ঠান বিরোধী কর্মকাণ্ডে জড়িত ছিল না। তাহার নৈতিক চরিত্র <strong>{conduct}</strong>। আমি তাহার উজ্জ্বল ভবিষ্যৎ ও সার্বিক উন্নতি কামনা করি।
            </p>
          )}

          {certType === 'bonafide' && (
            <p>
              এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{' '}
              <strong className="border-b-2 border-slate-800 border-dotted px-4 font-bold">
                {currentStudent?.nameBn}
              </strong>
              , পিতা: {currentStudent?.fatherName}, মাতা: {currentStudent?.motherName}, অত্র প্রতিষ্ঠানের <strong>{finishedClass}</strong> শ্রেণিতে নিয়মিত অধ্যয়ন করিতেছে। তাহার রোল নং <strong className="font-mono">{currentStudent?.roll}</strong>। সে একজন অমায়িক ও মেধাবী ছাত্র/ছাত্রী। তাহার পাঠোন্নতি সন্তোষজনক।
            </p>
          )}
        </div>

        {/* Bottom Signatures (Matching Screenshot 1) */}
        <div className="mt-20 pt-8 flex justify-between items-center text-xs md:text-sm font-bold px-8">
          <div className="text-center">
            <div className="w-44 border-t-2 border-slate-900 pt-1">
              শ্রেণি শিক্ষক
            </div>
          </div>

          {/* Official Seal Mock */}
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-semibold text-center p-1">
            প্রতিষ্ঠানিক সিলমোহর
          </div>

          <div className="text-center">
            <div className="w-44 border-t-2 border-slate-900 pt-1">
              {institution.headmasterTitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
