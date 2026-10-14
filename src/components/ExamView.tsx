import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Trash2, 
  Printer, 
  FileText, 
  Clock, 
  Check, 
  IdCard, 
  Users,
  Grid,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoutineItem } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

interface ExamViewProps {
  initialSubTab?: 'routine' | 'admit' | 'seat';
}

export const ExamView: React.FC<ExamViewProps> = ({ initialSubTab = 'routine' }) => {
  const { routines, addRoutine, deleteRoutine, students, institution, examPlanIntent } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'routine' | 'admit' | 'seat'>(initialSubTab);
  const [selectedClass, setSelectedClass] = useState('১ম শ্রেণি');
  const [selectedTerm, setSelectedTerm] = useState('৩য় প্রান্তিক মূল্যায়ন ২০২৬');
  const [includeRoutineInAdmit, setIncludeRoutineInAdmit] = useState(true);

  // Listen to examPlanIntent from sidebar tree
  React.useEffect(() => {
    if (!examPlanIntent) return;
    if (examPlanIntent.subTab) {
      setActiveSubTab(examPlanIntent.subTab);
    }
    if (examPlanIntent.targetClass) {
      setSelectedClass(examPlanIntent.targetClass);
    }
    if (examPlanIntent.action === 'print_routine' || examPlanIntent.action === 'print_admit' || examPlanIntent.action === 'print_seat') {
      setTimeout(() => {
        window.print();
      }, 350);
    }
  }, [examPlanIntent]);

  // Form for adding routine row
  const [newDate, setNewDate] = useState('২০২৬-০৯-২০');
  const [newDay, setNewDay] = useState('রবিবার');
  const [newSubject, setNewSubject] = useState('বাংলা');
  const [newTime, setNewTime] = useState('১০:০০ - ১২:০০');
  const [newShift, setNewShift] = useState<'সকাল' | 'বিকাল'>('সকাল');
  const [newRoom, setNewRoom] = useState('১০১');

  const daysList = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const subjectsList = ['বাংলা', 'ইংরেজি', 'গণিত', 'প্রাথমিক বিজ্ঞান', 'ধর্ম ও নৈতিক শিক্ষা', 'বাংলাদেশ ও বিশ্বপরিচয়', 'আইসিটি', 'শিল্প ও সংস্কৃতি'];
  const classesList = ['১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি', '৪র্থ শ্রেণি', '৫ম শ্রেণি', '৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি'];
  const termsList = ['১ম প্রান্তিক মূল্যায়ন ২০২৬', '২য় প্রান্তিক মূল্যায়ন ২০২৬', '৩য় প্রান্তিক মূল্যায়ন ২০২৬', 'বার্ষিক পরীক্ষা ২০২৬', 'মডেল টেস্ট'];

  const handleAddRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    addRoutine({
      date: newDate,
      day: newDay,
      subject: newSubject,
      time: newTime,
      shift: newShift,
      roomNo: newRoom,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const classStudents = students.filter(s => s.class === selectedClass);

  return (
    <div className="space-y-6">
      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs no-print">
        <button
          onClick={() => setActiveSubTab('routine')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'routine'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>পরীক্ষার রুটিন তৈরি (Routine)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('admit')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'admit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>প্রবেশপত্র তৈরি ও প্রিন্ট (Admit Card)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'seat'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>পরীক্ষার সিট প্ল্যান (Seat Plan)</span>
        </button>
      </div>

      {/* SUB-TAB 1: Exam Routine (Matching Screenshot 7) */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>পরীক্ষার রুটিন তৈরি - শ্রেণি ভিত্তিক</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                তারিখ, বার, বিষয়, সময় - শ্রেণি অনুযায়ী আলাদা রুটিন, এই তথ্য প্রবেশপত্রে যুক্ত হবে
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                {classesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                {termsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রুটিন PDF</span>
              </button>
            </div>
          </div>

          {/* Routine Table Container (Printable) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 font-['Hind_Siliguri',sans-serif]">
            {/* Header for print */}
            <div className="text-center pb-4 mb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{institution.nameBn}</h3>
              <p className="text-xs text-slate-600">{institution.village}, {institution.upazila}, {institution.district}</p>
              <div className="mt-2 inline-block bg-slate-100 text-slate-800 px-4 py-1 rounded-full text-xs font-bold border border-slate-200">
                {selectedTerm} - {selectedClass} এর সময়সূচী
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white border border-slate-900 font-semibold">
                    <th className="py-2.5 px-3 border border-slate-700">ক্র.</th>
                    <th className="py-2.5 px-3 border border-slate-700">তারিখ</th>
                    <th className="py-2.5 px-3 border border-slate-700">বার</th>
                    <th className="py-2.5 px-3 border border-slate-700">বিষয়</th>
                    <th className="py-2.5 px-3 border border-slate-700">সময়</th>
                    <th className="py-2.5 px-3 border border-slate-700">ধরন</th>
                    <th className="py-2.5 px-3 border border-slate-700">কক্ষ নং</th>
                    <th className="py-2.5 px-3 border border-slate-700 no-print">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {routines.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 border border-slate-200 font-mono">{toBengaliNumber(idx + 1)}</td>
                      <td className="py-2.5 px-3 border border-slate-200 font-mono font-medium">{item.date}</td>
                      <td className="py-2.5 px-3 border border-slate-200">{item.day}</td>
                      <td className="py-2.5 px-3 border border-slate-200 font-bold text-slate-900">{item.subject}</td>
                      <td className="py-2.5 px-3 border border-slate-200 font-mono">{item.time}</td>
                      <td className="py-2.5 px-3 border border-slate-200">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                          {item.shift}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 font-mono">{item.roomNo || '১০১'}</td>
                      <td className="py-2.5 px-3 border border-slate-200 no-print">
                        <button
                          onClick={() => deleteRoutine(item.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Block for Print */}
            <div className="mt-12 hidden print-only pt-8">
              <div className="flex justify-between items-center text-xs font-semibold px-8">
                <div className="text-center">
                  <div className="w-32 border-t border-slate-800 pt-1">পরীক্ষা নিয়ন্ত্রক</div>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-slate-800 pt-1">{institution.headmasterTitle}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Routine Row Form (Matching Screenshot 7) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>রুটিনে নতুন বিষয় ও তারিখ যোগ করুন</span>
            </h3>

            <form onSubmit={handleAddRoutineItem} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">তারিখ:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">বার নির্বাচন:</label>
                <select
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  {daysList.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">বিষয়:</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  {subjectsList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">সময়সূচী:</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                  placeholder="১০:০০ - ১২:০০"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">শিফট / রুম:</label>
                <div className="grid grid-cols-2 gap-1">
                  <select
                    value={newShift}
                    onChange={e => setNewShift(e.target.value as 'সকাল' | 'বিকাল')}
                    className="w-full px-1.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="সকাল">সকাল</option>
                    <option value="বিকাল">বিকাল</option>
                  </select>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    className="w-full px-1.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                    placeholder="১০১"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Admit Cards (প্রবেশপত্র) - Matching Screenshot 7 bottom */}
      {activeSubTab === 'admit' && (
        <div className="space-y-6">
          {/* Controls matching screenshot 7 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>প্রবেশপত্র - শ্রেণি ভিত্তিক (পাশাপাশি কলাম)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                A4 তে ২ জন, রুটিন সহ - নাম, শ্রেণি, রোল, শাখা, পিতা, মাতা পাশাপাশি কলামে
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                {classesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={includeRoutineInAdmit}
                  onChange={e => setIncludeRoutineInAdmit(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>রুটিন যুক্ত করুন</span>
              </label>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>প্রবেশপত্র PDF (রুটিন সহ)</span>
              </button>
            </div>
          </div>

          {/* Admit Cards Preview Grid */}
          <div className="space-y-6 font-['Hind_Siliguri',sans-serif]">
            {classStudents.map((st, sIdx) => (
              <div 
                key={st.id} 
                className="bg-white p-6 rounded-2xl border-2 border-slate-800 shadow-sm max-w-4xl mx-auto page-break"
              >
                {/* Admit Header */}
                <div className="text-center border-b-2 border-slate-800 pb-3 relative">
                  <div className="absolute right-0 top-0 w-20 h-24 border border-slate-400 border-dashed flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    {st.photoUrl ? (
                      <img src={st.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>ছবি</span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">{institution.nameBn}</h2>
                  <p className="text-xs text-slate-600">{institution.nameEn}</p>
                  <p className="text-[11px] text-slate-500">{institution.village}, {institution.upazila}, {institution.district}</p>
                  <div className="mt-2 inline-block bg-slate-900 text-white px-4 py-0.5 rounded-full text-xs font-bold">
                    প্রবেশপত্র - {selectedTerm}
                  </div>
                </div>

                {/* Student Info Row */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div><span className="text-slate-500">শিক্ষার্থীর নাম:</span> <strong className="text-slate-900 block">{st.nameBn}</strong></div>
                  <div><span className="text-slate-500">শ্রেণি:</span> <strong className="text-slate-900 block">{st.class} ({st.section})</strong></div>
                  <div><span className="text-slate-500">রোল নং:</span> <strong className="text-emerald-800 font-mono text-sm block">{st.roll}</strong></div>
                  <div><span className="text-slate-500">শিফট:</span> <strong className="text-slate-900 block">{st.shift}</strong></div>
                  <div><span className="text-slate-500">পিতার নাম:</span> <span className="text-slate-800 block">{st.fatherName}</span></div>
                  <div><span className="text-slate-500">মাতার নাম:</span> <span className="text-slate-800 block">{st.motherName}</span></div>
                  <div><span className="text-slate-500">জন্ম তারিখ:</span> <span className="font-mono text-slate-800 block">{st.birthDate}</span></div>
                  <div><span className="text-slate-500">মোবাইল:</span> <span className="font-mono text-slate-800 block">{st.phone}</span></div>
                </div>

                {/* Exam Schedule Table inside Admit Card */}
                {includeRoutineInAdmit && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 mb-1.5">পরীক্ষার সময়সূচী:</h4>
                    <table className="w-full text-xs text-center border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 font-semibold text-slate-700">
                          <th className="py-1 px-2 border border-slate-300">তারিখ</th>
                          <th className="py-1 px-2 border border-slate-300">বার</th>
                          <th className="py-1 px-2 border border-slate-300">বিষয়</th>
                          <th className="py-1 px-2 border border-slate-300">সময়</th>
                          <th className="py-1 px-2 border border-slate-300">কক্ষ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routines.slice(0, 5).map(r => (
                          <tr key={r.id}>
                            <td className="py-1 px-2 border border-slate-300 font-mono">{r.date}</td>
                            <td className="py-1 px-2 border border-slate-300">{r.day}</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">{r.subject}</td>
                            <td className="py-1 px-2 border border-slate-300 font-mono">{r.time}</td>
                            <td className="py-1 px-2 border border-slate-300 font-mono">{r.roomNo || '১০১'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Examination Instructions */}
                <div className="mt-3 text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="font-bold text-slate-800">পরীক্ষার্থীদের জন্য বিশেষ নির্দেশাবলী:</p>
                  <p>১. পরীক্ষা শুরুর কমপক্ষে ১৫ মিনিট পূর্বে আসন গ্রহণ করতে হবে। ২. প্রবেশপত্র ব্যতীত পরীক্ষায় অংশগ্রহণ করা যাবে না। ৩. পরীক্ষায় অসদুপায় সম্পূর্ণ নিষিদ্ধ।</p>
                </div>

                {/* Signatures */}
                <div className="mt-10 pt-4 flex justify-between items-center text-xs font-semibold">
                  <div className="text-center">
                    <div className="w-36 border-t border-slate-800 pt-1">
                      শ্রেণি শিক্ষকের স্বাক্ষর
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-36 border-t border-slate-800 pt-1">
                      {institution.headmasterTitle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Seat Plan (সিট প্ল্যান) */}
      {activeSubTab === 'seat' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between no-print">
            <div>
              <h2 className="text-sm font-bold text-slate-800">পরীক্ষার সিট প্ল্যান ও ডেস্ক ট্যাগ প্রিন্ট</h2>
              <p className="text-xs text-slate-500">পরীক্ষার হলের প্রতিটি বেঞ্চে লাগানোর জন্য রোল ট্যাগ</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>সিট প্ল্যান প্রিন্ট</span>
            </button>
          </div>

          {/* Seat Tag Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-['Hind_Siliguri',sans-serif]">
            {classStudents.map(st => (
              <div key={st.id} className="border-2 border-dashed border-slate-700 p-4 rounded-xl text-center bg-white">
                <div className="text-[10px] font-bold text-slate-600 border-b pb-1">
                  {institution.nameBn} - {selectedTerm}
                </div>
                <div className="my-2">
                  <span className="text-[10px] text-slate-500">রোল নং</span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-800">{st.roll}</div>
                </div>
                <div className="text-xs font-bold text-slate-900">{st.nameBn}</div>
                <div className="text-[11px] text-slate-600">{st.class} | শাখা: {st.section}</div>
                <div className="mt-2 text-[10px] text-slate-400">কক্ষ নং: ১০১</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
