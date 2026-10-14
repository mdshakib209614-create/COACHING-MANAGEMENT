import React from 'react';
import { 
  Building2, 
  Award, 
  Calendar, 
  CheckCircle2, 
  User, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { InstitutionProfile, Student, StudentResult } from '../../types';
import { toBengaliNumber, calculateGrade } from '../../utils/bengaliUtils';

interface ResultSheetA4Props {
  institution: InstitutionProfile;
  student: Student;
  result: StudentResult;
  isBatch?: boolean;
}

export const ResultSheetA4: React.FC<ResultSheetA4Props> = ({
  institution,
  student,
  result,
  isBatch = false
}) => {
  // Calculate full marks total & percentage
  const totalFullMarks = result.subjectMarks.reduce((sum, s) => sum + (s.fullMarks || 100), 0);
  const percentage = totalFullMarks > 0 
    ? ((result.grandTotal / totalFullMarks) * 100).toFixed(1) 
    : '0';

  // Attendance rate
  const attendanceRate = result.totalWorkingDays > 0 
    ? Math.round((result.attendanceDays / result.totalWorkingDays) * 100) 
    : 100;

  return (
    <div className={`a4-preview-page text-slate-900 bg-white font-['Hind_Siliguri',sans-serif] relative p-8 md:p-10 flex flex-col justify-between ${isBatch ? 'page-break' : ''}`}>
      {/* Decorative Outer Border (Authentic Double Border with corner accents) */}
      <div className="absolute inset-3 border-2 border-slate-900 pointer-events-none rounded-sm"></div>
      <div className="absolute inset-4 border border-slate-700 pointer-events-none rounded-sm"></div>

      {/* Main Content Area */}
      <div className="relative z-10 space-y-4">
        {/* Top Government & Ministry Badge */}
        <div className="text-center">
          <p className="text-[11px] font-bold text-slate-600 tracking-wider">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত পাঠ্যক্রম অনুযায়ী পরিচালিত
          </p>
        </div>

        {/* Institution Header */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-slate-900 pb-3">
          {/* Logo / Monogram */}
          <div className="w-16 h-16 rounded-xl border-2 border-slate-800 bg-slate-50 flex flex-col items-center justify-center p-1 text-center shrink-0 shadow-xs">
            {institution.logoUrl ? (
              <img src={institution.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-800">
                <Building2 className="w-7 h-7 text-indigo-700" />
                <span className="text-[8px] font-bold font-mono tracking-tight leading-none mt-0.5">
                  স্থাপিত: {institution.established}
                </span>
              </div>
            )}
          </div>

          {/* Center Institution Info */}
          <div className="text-center flex-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">
              {institution.nameBn}
            </h1>
            <p className="text-xs font-semibold text-slate-700 tracking-wide mt-0.5">
              {institution.nameEn}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              গ্রাম: {institution.village}, ডাকঘর: {institution.postOffice}, উপজেলা: {institution.upazila}, জেলা: {institution.district}
            </p>
            <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-600 font-mono mt-1">
              {institution.eiin && <span>EIIN: {institution.eiin}</span>}
              <span>EMIS: {institution.emisNo}</span>
              <span>IPEMIS: {institution.ipemisCode}</span>
              <span>মোবাইল: {institution.phone}</span>
            </div>
          </div>

          {/* Right Verification / QR Badge */}
          <div className="w-16 h-16 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-1 bg-slate-50 text-slate-700 text-center shrink-0">
            <QrCode className="w-8 h-8 text-slate-800" />
            <span className="text-[8px] font-mono font-bold text-slate-500 leading-tight mt-0.5">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Result Sheet Title Banner */}
        <div className="text-center my-1">
          <div className="inline-block bg-slate-900 text-white px-8 py-1.5 rounded-full shadow-xs border border-slate-700">
            <h2 className="text-sm md:text-base font-extrabold tracking-wide uppercase">
              একাডেমিক ট্রান্সক্রিপ্ট ও শিখন অগ্রগতি প্রতিবেদন
            </h2>
            <p className="text-[10px] text-slate-300 font-medium">
              ACADEMIC TRANSCRIPT & RESULT SHEET
            </p>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-2 text-xs font-bold text-indigo-900">
            <span>মূল্যায়ন সেশন: {result.term}</span>
            <span>•</span>
            <span>শিক্ষাবর্ষ: {result.academicYear} খ্রি.</span>
          </div>
        </div>

        {/* Student Profile Info and Grading Scale (2 Columns) */}
        <div className="grid grid-cols-12 gap-3 items-stretch text-xs">
          {/* Left: Student Information (8 cols) */}
          <div className="col-span-8 border border-slate-800 rounded-sm bg-white overflow-hidden flex flex-col justify-between">
            <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] border-b border-slate-800 text-slate-800 flex items-center justify-between">
              <span>শিক্ষার্থীর পরিচিতি (Student Information)</span>
              <span className="font-mono text-[10px] text-slate-600">আইডি: {student.id}</span>
            </div>

            <div className="p-2.5 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div>
                <span className="font-semibold text-slate-600">শিক্ষার্থীর নাম: </span>
                <strong className="text-slate-950 font-bold">{student.nameBn}</strong>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Name (English): </span>
                <span className="font-bold text-slate-900 font-sans">{student.nameEn || '-'}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-600">শ্রেণি: </span>
                <strong className="text-slate-900">{student.class}</strong>
              </div>
              <div>
                <span className="font-semibold text-slate-600">রোল নম্বর: </span>
                <strong className="text-slate-950 font-mono text-xs">{student.roll}</strong>
              </div>

              <div>
                <span className="font-semibold text-slate-600">শাখা ও শিফট: </span>
                <span className="text-slate-900">{student.section} শাখা ({student.shift})</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">রক্তের গ্রুপ: </span>
                <span className="font-bold text-rose-700">{student.bloodGroup || '-'}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-600">পিতার নাম: </span>
                <span className="text-slate-900">{student.fatherName}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">মাতার নাম: </span>
                <span className="text-slate-900">{student.motherName}</span>
              </div>

              <div className="col-span-2 pt-0.5 border-t border-slate-200">
                <span className="font-semibold text-slate-600">জন্ম নিবন্ধন / এনআইডি: </span>
                <span className="font-mono text-slate-800 font-bold">{student.nidOrBirthReg}</span>
                <span className="ml-3 font-semibold text-slate-600">জন্ম তারিখ: </span>
                <span className="text-slate-800 font-mono">{student.birthDate}</span>
              </div>
            </div>
          </div>

          {/* Right: Grading Scale Reference & Photo Box (4 cols) */}
          <div className="col-span-4 border border-slate-800 rounded-sm bg-white flex flex-col justify-between overflow-hidden">
            <div className="bg-slate-100 px-2 py-1 font-bold text-[10px] text-center border-b border-slate-800 text-slate-800">
              গ্রেডিং স্কেল (Grading Scale)
            </div>
            <table className="w-full text-[9px] text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-300 font-semibold">
                  <th className="p-0.5 border-r border-slate-300">নম্বর</th>
                  <th className="p-0.5 border-r border-slate-300">গ্রেড</th>
                  <th className="p-0.5 border-r border-slate-300">পয়েন্ট</th>
                  <th className="p-0.5">স্তর</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr><td className="p-0.5">৮০-১০০</td><td className="font-bold text-emerald-800">A+</td><td>৫.০০</td><td className="font-sans text-[8px]">অতি উত্তম</td></tr>
                <tr><td className="p-0.5">৭০-৭৯</td><td className="font-bold text-emerald-700">A</td><td>৪.০০</td><td className="font-sans text-[8px]">উত্তম</td></tr>
                <tr><td className="p-0.5">৬০-৬৯</td><td className="font-bold text-blue-700">A-</td><td>৩.৫০</td><td className="font-sans text-[8px]">ভালো</td></tr>
                <tr><td className="p-0.5">৫০-৫৯</td><td className="font-bold text-amber-700">B</td><td>৩.০০</td><td className="font-sans text-[8px]">সন্তোষজনক</td></tr>
                <tr><td className="p-0.5">৪০-৪৯</td><td className="font-bold text-amber-800">C</td><td>২.০০</td><td className="font-sans text-[8px]">চলতি মান</td></tr>
                <tr><td className="p-0.5">৩৩-৩৯</td><td className="font-bold text-orange-700">D</td><td>১.০০</td><td className="font-sans text-[8px]">সহায়তা চাই</td></tr>
                <tr><td className="p-0.5">০-৩২</td><td className="font-bold text-rose-700">F</td><td>০.০০</td><td className="font-sans text-[8px]">অকৃতকার্য</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Subject Marks Table */}
        <div className="border border-slate-900 rounded-sm overflow-hidden">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px]">
                <th className="p-1.5 border border-slate-700 w-8">ক্র.</th>
                <th className="p-1.5 border border-slate-700 text-left min-w-[140px]">বিষয়ের নাম</th>
                <th className="p-1.5 border border-slate-700 w-14">পূর্ণমান</th>
                <th className="p-1.5 border border-slate-700 w-20">ধারাবাহিক / নৈর্ব্যক্তিক (৩০)</th>
                <th className="p-1.5 border border-slate-700 w-20">সামষ্টিক / লিখিত (৭০)</th>
                <th className="p-1.5 border border-slate-700 w-16 bg-slate-950 text-amber-300">মোট প্রাপ্ত</th>
                <th className="p-1.5 border border-slate-700 w-16">শ্রেণি সর্বোচ্চ</th>
                <th className="p-1.5 border border-slate-700 w-14">লেটার গ্রেড</th>
                <th className="p-1.5 border border-slate-700 w-14">গ্রেড পয়েন্ট</th>
                <th className="p-1.5 border border-slate-700">অর্জন মন্তব্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-sans">
              {result.subjectMarks.map((sub, idx) => {
                const gradeInfo = calculateGrade(sub.total, sub.fullMarks || 100);
                return (
                  <tr key={sub.subjectName} className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                    <td className="p-1.5 border-r border-slate-300 font-mono text-[11px]">
                      {toBengaliNumber(idx + 1)}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-left font-bold text-slate-900">
                      {sub.subjectName}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-mono">
                      {toBengaliNumber(sub.fullMarks || 100)}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-mono font-medium">
                      {toBengaliNumber(sub.continuous)}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-mono font-medium">
                      {toBengaliNumber(sub.summative)}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-mono font-extrabold text-slate-950 bg-slate-100/70">
                      {toBengaliNumber(sub.total)}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-mono text-slate-600">
                      {toBengaliNumber(sub.highestMarks || Math.min(100, sub.total + 5))}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-bold font-mono">
                      <span className={
                        gradeInfo.grade === 'A+' ? 'text-emerald-700' :
                        gradeInfo.grade === 'A' || gradeInfo.grade === 'A-' ? 'text-blue-700' :
                        gradeInfo.grade === 'F' ? 'text-rose-700' : 'text-amber-800'
                      }>
                        {gradeInfo.grade}
                      </span>
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-mono font-bold">
                      {toBengaliNumber(gradeInfo.gpa.toFixed(2))}
                    </td>
                    <td className="p-1.5 text-[10px] text-slate-700 font-medium">
                      {gradeInfo.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Total Row */}
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-950 border-t-2 border-slate-800 text-xs">
                <td colSpan={2} className="p-2 text-right border-r border-slate-300">
                  সর্বমোট নম্বর ও জিপিএ:
                </td>
                <td className="p-2 border-r border-slate-300 font-mono">
                  {toBengaliNumber(totalFullMarks)}
                </td>
                <td colSpan={2} className="p-2 border-r border-slate-300 text-slate-600 font-medium text-[11px]">
                  শতকরা হার: {toBengaliNumber(percentage)}%
                </td>
                <td className="p-2 border-r border-slate-300 font-mono font-black text-indigo-950 bg-indigo-50 text-sm">
                  {toBengaliNumber(result.grandTotal)}
                </td>
                <td className="p-2 border-r border-slate-300 text-slate-400 font-mono">-</td>
                <td className="p-2 border-r border-slate-300 font-mono font-black text-emerald-800 text-sm">
                  {result.overallGrade}
                </td>
                <td className="p-2 border-r border-slate-300 font-mono font-black text-emerald-800 text-sm">
                  {toBengaliNumber(result.overallGpa.toFixed(2))}
                </td>
                <td className="p-2 text-emerald-800 font-bold">
                  {result.overallGrade === 'F' ? 'অনুত্তীর্ণ' : 'উত্তীর্ণ / পাস'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Result & Evaluation Summary Cards */}
        <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
          <div className="p-2 border border-slate-800 rounded bg-slate-50">
            <span className="text-[10px] text-slate-500 block font-semibold">প্রাপ্ত মোট নম্বর</span>
            <span className="text-base font-black text-slate-900 font-mono">
              {toBengaliNumber(result.grandTotal)}
            </span>
            <span className="text-[9px] text-slate-400 block font-mono">/{toBengaliNumber(totalFullMarks)}</span>
          </div>

          <div className="p-2 border border-slate-800 rounded bg-slate-50">
            <span className="text-[10px] text-slate-500 block font-semibold">জিপিএ ও গ্রেড</span>
            <span className="text-base font-black text-emerald-800 font-mono">
              {result.overallGrade} ({toBengaliNumber(result.overallGpa.toFixed(2))})
            </span>
            <span className="text-[9px] text-emerald-700 block font-semibold">
              {calculateGrade(result.overallGpa * 20).remarks}
            </span>
          </div>

          <div className="p-2 border border-slate-800 rounded bg-slate-50">
            <span className="text-[10px] text-slate-500 block font-semibold">শ্রেণিতে মেধা স্থান</span>
            <span className="text-base font-black text-indigo-950 font-sans">
              {result.position || '১ম স্থান'}
            </span>
            <span className="text-[9px] text-indigo-700 block font-semibold">মেধাতালিকা অনুযায়ী</span>
          </div>

          <div className="p-2 border border-slate-800 rounded bg-slate-50">
            <span className="text-[10px] text-slate-500 block font-semibold">উপস্থিতি হার</span>
            <span className="text-base font-black text-slate-900 font-mono">
              {toBengaliNumber(result.attendanceDays)}/{toBengaliNumber(result.totalWorkingDays)}
            </span>
            <span className="text-[9px] text-slate-600 block font-mono">
              ({toBengaliNumber(attendanceRate)}% উপস্থিতি)
            </span>
          </div>
        </div>

        {/* Teacher Evaluation & Remarks */}
        <div className="border border-slate-800 rounded-sm p-3 bg-white text-xs space-y-1">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <strong className="text-slate-900 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>শ্রেণি শিক্ষকের মন্তব্য ও দিকনির্দেশনা:</span>
            </strong>
            <span className="text-[10px] text-slate-500">
              আচরণ: <strong className="text-slate-800">উত্তম ও প্রশংসনীয়</strong>
            </span>
          </div>
          <p className="text-slate-800 italic pt-0.5 leading-relaxed">
            "{result.teacherRemarks || 'শিক্ষার্থী ক্লাসে অত্যন্ত মনোযোগী, নিয়মিত এবং সক্রিয় শিখন অগ্রগতি প্রদর্শন করেছে। উজ্জ্বল ভবিষ্যৎ কামনা করি।'}"
          </p>
        </div>
      </div>

      {/* Official Signatures Section (Bottom of A4 Page) */}
      <div className="relative z-10 pt-6 mt-4 border-t border-slate-300">
        <div className="grid grid-cols-3 text-center text-xs font-semibold text-slate-800 gap-4">
          <div>
            <div className="w-36 border-t-2 border-slate-900 mx-auto pt-1">
              অভিভাবকের স্বাক্ষর
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">তারিখ: ..............</span>
          </div>

          <div>
            <div className="w-36 border-t-2 border-slate-900 mx-auto pt-1">
              শ্রেণি শিক্ষকের স্বাক্ষর
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">তারিখ: ..............</span>
          </div>

          <div>
            <div className="w-40 border-t-2 border-slate-900 mx-auto pt-1">
              {institution.headmasterName}
            </div>
            <span className="text-[10px] text-slate-700 font-bold block mt-0.5">
              {institution.headmasterTitle}
            </span>
            <span className="text-[9px] text-slate-500 block">সিলমোহর</span>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
          <span>প্রকাশের তারিখ: {new Date().toISOString().split('T')[0]}</span>
          <span>সফটওয়্যার: {institution.nameEn} একাডেমি ম্যানেজমেন্ট সিস্টেম</span>
          <span>পৃষ্ঠা: ১/১ (A4 সাইজ ফর্ম)</span>
        </div>
      </div>
    </div>
  );
};
