import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Plus, 
  Trash2, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Calculator,
  User
} from 'lucide-react';
import { Student, StudentResult, SubjectMarks, GradeType } from '../../types';
import { toBengaliNumber, calculateGrade } from '../../utils/bengaliUtils';

interface MarksEntryModalProps {
  student: Student;
  initialResult: StudentResult;
  term: string;
  academicYear: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (result: StudentResult) => void;
  onCreateResultSheet: (result: StudentResult) => void;
}

export const MarksEntryModal: React.FC<MarksEntryModalProps> = ({
  student,
  initialResult,
  term,
  academicYear,
  isOpen,
  onClose,
  onSave,
  onCreateResultSheet,
}) => {
  const [subjects, setSubjects] = useState<SubjectMarks[]>(initialResult.subjectMarks);
  const [attendanceDays, setAttendanceDays] = useState<number>(initialResult.attendanceDays || 72);
  const [totalWorkingDays, setTotalWorkingDays] = useState<number>(initialResult.totalWorkingDays || 75);
  const [teacherRemarks, setTeacherRemarks] = useState<string>(
    initialResult.teacherRemarks || 'অত্যন্ত মনোযোগী এবং চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।'
  );
  const [position, setPosition] = useState<string>(initialResult.position || '১ম স্থান');

  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => {
    setSubjects(initialResult.subjectMarks);
    setAttendanceDays(initialResult.attendanceDays || 72);
    setTotalWorkingDays(initialResult.totalWorkingDays || 75);
    setTeacherRemarks(initialResult.teacherRemarks || 'অত্যন্ত মনোযোগী এবং চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।');
    setPosition(initialResult.position || '১ম স্থান');
  }, [initialResult]);

  if (!isOpen) return null;

  // Handle changes to continuous or summative marks
  const handleMarkChange = (index: number, field: 'continuous' | 'summative', value: number) => {
    const updated = [...subjects];
    const item = { ...updated[index] };
    const num = Math.max(0, isNaN(value) ? 0 : value);

    if (field === 'continuous') {
      item.continuous = Math.min(item.fullMarks === 50 ? 20 : 30, num);
    } else {
      item.summative = Math.min(item.fullMarks === 50 ? 30 : 70, num);
    }

    item.total = item.continuous + item.summative;
    const { grade, gpa } = calculateGrade(item.total, item.fullMarks || 100);
    item.grade = grade;
    item.gpa = gpa;
    updated[index] = item;
    setSubjects(updated);
  };

  // Direct total change (for simple 100-mark entry)
  const handleDirectTotalChange = (index: number, val: number) => {
    const updated = [...subjects];
    const item = { ...updated[index] };
    const full = item.fullMarks || 100;
    const clamped = Math.min(full, Math.max(0, isNaN(val) ? 0 : val));
    item.total = clamped;
    // split roughly 30% / 70% for format compatibility
    item.continuous = Math.round((clamped * 30) / 100);
    item.summative = clamped - item.continuous;
    const { grade, gpa } = calculateGrade(item.total, full);
    item.grade = grade;
    item.gpa = gpa;
    updated[index] = item;
    setSubjects(updated);
  };

  // Add new subject
  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSub: SubjectMarks = {
      subjectName: newSubjectName.trim(),
      fullMarks: 100,
      continuous: 25,
      summative: 60,
      total: 85,
      highestMarks: 95,
      grade: 'A+',
      gpa: 5.0
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
    setShowAddSubject(false);
  };

  // Delete a subject
  const handleDeleteSubject = (index: number) => {
    if (subjects.length <= 1) {
      alert('কমপক্ষে একটি বিষয় থাকা আবশ্যক!');
      return;
    }
    setSubjects(subjects.filter((_, idx) => idx !== index));
  };

  // Computed summary
  const grandTotal = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalFullMarks = subjects.reduce((sum, s) => sum + (s.fullMarks || 100), 0);
  const percentage = totalFullMarks > 0 ? (grandTotal / totalFullMarks) * 100 : 0;
  const avgMarks = subjects.length > 0 ? grandTotal / subjects.length : 0;
  const { grade: overallGrade, gpa: overallGpa } = calculateGrade(avgMarks);

  const buildResultData = (): StudentResult => {
    return {
      ...initialResult,
      studentId: student.id,
      studentName: student.nameBn,
      roll: student.roll,
      class: student.class,
      section: student.section,
      term,
      academicYear,
      attendanceDays,
      totalWorkingDays,
      subjectMarks: subjects,
      grandTotal,
      totalFullMarks,
      percentage: Number(percentage.toFixed(1)),
      overallGrade,
      overallGpa,
      position,
      teacherRemarks,
      passed: overallGrade !== 'F',
    };
  };

  const handleSaveOnly = () => {
    const data = buildResultData();
    onSave(data);
    onClose();
  };

  const handleSaveAndCreateSheet = () => {
    const data = buildResultData();
    onSave(data);
    onCreateResultSheet(data);
    onClose();
  };

  const remarkPresets = [
    'অত্যন্ত মনোযোগী এবং চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।',
    'চমৎকার ফলাফল অর্জন করেছে। গণিত ও বিজ্ঞানে বিশেষ দক্ষতা আছে।',
    'ভালো ফলাফল করেছে। নিয়মিত পাঠাভ্যাস বজায় রাখলে আরও উন্নতি হবে।',
    'সন্তোষজনক শিখন অগ্রগতি। পরীক্ষায় আরও মনোযোগী হওয়া আবশ্যক।',
    'নিয়মিত ক্লাসে উপস্থিতি এবং হাতের লেখায় আরও যত্নশীল হওয়া প্রয়োজন।'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto font-['Hind_Siliguri',sans-serif]">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/50 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">
                পরীক্ষার নম্বর এন্ট্রি ও মূল্যায়ন
              </h3>
              <p className="text-xs text-slate-300">
                শিক্ষার্থী: <strong className="text-white font-bold">{student.nameBn}</strong> (রোল: {student.roll}, শ্রেণি: {student.class})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Top Session Info Pill */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-700">মূল্যায়ন সেশন:</span>
              <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {term} ({academicYear})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">মেধা স্থান:</span>
              <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="১ম স্থান"
                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-indigo-900"
              />
            </div>
          </div>

          {/* Subjects & Marks Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>বিষয়ভিত্তিক নম্বর প্রদান (ধারাবাহিক ৩০ + সামষ্টিক ৭০ = ১০০):</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSubject(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন বিষয় যোগ করুন</span>
              </button>
            </div>

            {/* Add Subject Input Box */}
            {showAddSubject && (
              <div className="p-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  placeholder="বিষয়ের নাম (যেমন: তথ্য ও যোগাযোগ প্রযুক্তি / কৃষি শিক্ষা)"
                  className="flex-1 p-2 bg-white border border-indigo-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  বাতিল
                </button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-semibold">
                    <th className="p-2.5 text-left pl-3">বিষয়ের নাম</th>
                    <th className="p-2.5 w-24">ধারাবাহিক (৩০)</th>
                    <th className="p-2.5 w-24">সামষ্টিক (৭০)</th>
                    <th className="p-2.5 w-24 bg-slate-900 text-amber-300">মোট (১০০)</th>
                    <th className="p-2.5 w-16">গ্রেড</th>
                    <th className="p-2.5 w-16">পয়েন্ট</th>
                    <th className="p-2.5 w-10">মুছুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {subjects.map((sub, idx) => (
                    <tr key={sub.subjectName} className="hover:bg-slate-50/80 transition">
                      <td className="p-2.5 text-left pl-3 font-bold text-slate-800">
                        {sub.subjectName}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={sub.continuous}
                          onChange={e => handleMarkChange(idx, 'continuous', parseInt(e.target.value, 10))}
                          className="w-16 text-center py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={70}
                          value={sub.summative}
                          onChange={e => handleMarkChange(idx, 'summative', parseInt(e.target.value, 10))}
                          className="w-16 text-center py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2 bg-indigo-50/40">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sub.total}
                          onChange={e => handleDirectTotalChange(idx, parseInt(e.target.value, 10))}
                          className="w-16 text-center py-1 bg-white border-2 border-indigo-300 rounded-lg font-mono font-extrabold text-indigo-950 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2 font-mono font-bold">
                        <span className={
                          sub.grade === 'A+' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' :
                          sub.grade === 'A' || sub.grade === 'A-' ? 'text-blue-700 bg-blue-50 px-2 py-0.5 rounded' :
                          sub.grade === 'F' ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'
                        }>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="p-2 font-mono font-bold text-slate-800">
                        {toBengaliNumber(sub.gpa.toFixed(2))}
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="বিষয়টি সরান"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Calculated Stats Banner */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl grid grid-cols-4 gap-2 text-center">
            <div>
              <span className="text-[10px] text-emerald-800 font-semibold block">মোট প্রাপ্ত নম্বর</span>
              <strong className="text-base font-extrabold text-emerald-950 font-mono">
                {toBengaliNumber(grandTotal)}
              </strong>
              <span className="text-[10px] text-emerald-700 font-mono">/{toBengaliNumber(totalFullMarks)}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-800 font-semibold block">শতকরা হার</span>
              <strong className="text-base font-extrabold text-emerald-950 font-mono">
                {toBengaliNumber(percentage.toFixed(1))}%
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-emerald-800 font-semibold block">সামগ্রিক গ্রেড</span>
              <strong className="text-base font-extrabold text-emerald-950">
                {overallGrade}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-emerald-800 font-semibold block">গড় জিপিএ (GPA)</span>
              <strong className="text-base font-extrabold text-emerald-950 font-mono">
                {toBengaliNumber(overallGpa.toFixed(2))}
              </strong>
            </div>
          </div>

          {/* Attendance and Working Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                উপস্থিতির দিন সংখ্যা:
              </label>
              <input
                type="number"
                value={attendanceDays}
                onChange={e => setAttendanceDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                মোট কর্মদিবস:
              </label>
              <input
                type="number"
                value={totalWorkingDays}
                onChange={e => setTotalWorkingDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-center font-bold"
              />
            </div>
          </div>

          {/* Teacher Remarks with Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>শ্রেণি শিক্ষকের মন্তব্য ও অগ্রগতি পর্যালোচনা:</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={teacherRemarks}
              onChange={e => setTeacherRemarks(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="শিক্ষার্থীর শিখন অগ্রগতি সম্পর্কে মন্তব্য লিখুন..."
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold self-center">প্রিসেট:</span>
              {remarkPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTeacherRemarks(preset)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg truncate max-w-xs transition"
                  title={preset}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            বাতিল
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveOnly}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>নম্বর সংরক্ষণ করুন</span>
            </button>

            {/* Requested Feature: Create Result Sheet button */}
            <button
              type="button"
              onClick={handleSaveAndCreateSheet}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>📄 ক্রিয়েট রেজাল্ট শিট (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
