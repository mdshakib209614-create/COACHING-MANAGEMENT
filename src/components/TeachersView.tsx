import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  BookOpen, 
  Edit, 
  Trash2, 
  Printer, 
  IdCard, 
  X, 
  CalendarDays,
  FileCheck2,
  HeartPulse,
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Teacher } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const TeachersView: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, institution } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('সকল পদবী');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [printableTeacherIdCard, setPrintableTeacherIdCard] = useState<Teacher | null>(null);

  const initialForm: Omit<Teacher, 'id'> = {
    nameBn: '',
    nameEn: '',
    designation: 'সহকারী শিক্ষক',
    qualification: 'বি.এ, বিএড',
    subject: 'সাধারণ বিষয়',
    phone: '',
    email: '',
    joinDate: '২০২০-০১-০১',
    bloodGroup: 'A+',
    address: 'সেনবাগ, নোয়াখালী',
    status: 'কর্মরত',
  };

  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>(initialForm);

  const designationList = ['সকল পদবী', 'প্রধান শিক্ষক ও পরিচালক', 'সহকারী শিক্ষক', 'সিনিয়র শিক্ষক', 'প্রভাষক', 'খণ্ডকালীন শিক্ষক'];

  const filteredTeachers = teachers.filter(t => {
    const matchSearch = 
      t.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDesig = selectedDesignation === 'সকল পদবী' || t.designation === selectedDesignation;
    return matchSearch && matchDesig;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    setFormData(tch);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Buttons matching Screenshot 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>শিক্ষক ও স্টাফ ব্যবস্থাপনা</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            শিক্ষক তালিকা ({toBengaliNumber(teachers.length)} জন) | ছুটির হিসাব ও শিক্ষক পরিচিতি
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন শিক্ষক</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF - সকল শিক্ষক</span>
          </button>

          <button
            onClick={() => {
              if (teachers.length > 0) setPrintableTeacherIdCard(teachers[0]);
            }}
            className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <IdCard className="w-3.5 h-3.5" />
            <span>ID Card A8</span>
          </button>
        </div>
      </div>

      {/* Filter and Leave Action Tabs matching Screenshot 5 */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <select
            value={selectedDesignation}
            onChange={e => setSelectedDesignation(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 w-full sm:w-auto"
          >
            {designationList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons matching Screenshot 5 */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => setLeaveModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>ছুটির আবেদন</span>
          </button>

          <button
            onClick={() => alert('শিক্ষক কর্তৃক শিক্ষার্থীদের হোম ভিজিট লগ ও শিডিউল মডিউল')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>হোম ভিজিট</span>
          </button>

          <button
            onClick={() => setLeaveModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>মেডিকেল ছুটি</span>
          </button>
        </div>
      </div>

      {/* Teachers Cards Grid (Exact matching Screenshot 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 no-print">
        {filteredTeachers.map(tch => (
          <div
            key={tch.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              {/* Teacher Avatar / Illustration */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-blue-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 font-bold">
                <Users className="w-7 h-7" />
              </div>

              {/* Information */}
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {tch.nameBn}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {tch.nameEn}
                </p>

                {/* Designation badge */}
                <div className="pt-0.5">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    tch.designation.includes('প্রধান')
                      ? 'bg-blue-900 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {tch.designation}
                  </span>
                </div>

                <div className="pt-1 text-[11px] text-slate-600 space-y-0.5">
                  <p className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tch.qualification} | {tch.joinDate}</span>
                  </p>
                  <p className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tch.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons matching Screenshot 5 */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <button
                onClick={() => handleOpenEdit(tch)}
                className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 transition cursor-pointer"
              >
                <Edit className="w-3 h-3 text-blue-300" />
                <span>এডিট</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition cursor-pointer"
              >
                <Printer className="w-3 h-3" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => setPrintableTeacherIdCard(tch)}
                className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition cursor-pointer"
              >
                <IdCard className="w-3 h-3" />
                <span>ID PDF</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`আপনি কি নিশ্চিত যে ${tch.nameBn}-কে মুছে ফেলতে চান?`)) {
                    deleteTeacher(tch.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Teacher */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="bg-indigo-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{editingTeacher ? 'শিক্ষকের তথ্য আপডেট' : 'নতুন শিক্ষক নিবন্ধন'}</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    শিক্ষকের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="মোঃ রফিকুল ইসলাম"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teacher Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Md. Rafiqul Islam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পদবি *
                  </label>
                  <select
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="প্রধান শিক্ষক ও পরিচালক">প্রধান শিক্ষক ও পরিচালক</option>
                    <option value="সহকারী শিক্ষক">সহকারী শিক্ষক</option>
                    <option value="সিনিয়র শিক্ষক">সিনিয়র শিক্ষক</option>
                    <option value="প্রভাষক">প্রভাষক</option>
                    <option value="খণ্ডকালীন শিক্ষক">খণ্ডকালীন শিক্ষক</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    শিক্ষাগত যোগ্যতা
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="এম.এ, বিএড / বি.এসসি"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পাঠদানের বিষয়
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="গণিত / ইংরেজি / বিজ্ঞান"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    placeholder="০১৭১..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    যোগদানের তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    রক্তের গ্রুপ
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Leave Application (ছুটির আবেদন) */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-600" />
                <span>শিক্ষক ছুটির আবেদন নিবন্ধন</span>
              </h3>
              <button onClick={() => setLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">শিক্ষক নির্বাচন করুন:</label>
                <select className="w-full p-2 border border-slate-300 rounded-lg">
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.nameBn} - {t.designation}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ছুটির ধরন:</label>
                <select className="w-full p-2 border border-slate-300 rounded-lg">
                  <option>নৈমিত্তিক ছুটি (Casual Leave)</option>
                  <option>চিকিৎসাজনিত ছুটি (Medical Leave)</option>
                  <option>জরুরী পারিবারিক ছুটি</option>
                  <option>অধ্যয়ন ছুটি</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">হতে:</label>
                  <input type="date" className="w-full p-2 border border-slate-300 rounded-lg" defaultValue="2026-09-20" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">পর্যন্ত:</label>
                  <input type="date" className="w-full p-2 border border-slate-300 rounded-lg" defaultValue="2026-09-22" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ছুটির কারণ:</label>
                <textarea rows={2} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="কারণ সংক্ষেপে লিখুন..." />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button 
                  onClick={() => {
                    alert('ছুটির আবেদন সফলভাবে গৃহীত হয়েছে!');
                    setLeaveModalOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  অনুমোদন দিন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable Teacher ID Card */}
      {printableTeacherIdCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4 no-print">
              <h3 className="text-sm font-bold text-slate-800">শিক্ষক আইডি কার্ড প্রিভিউ</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  প্রিন্ট
                </button>
                <button
                  onClick={() => setPrintableTeacherIdCard(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="border-2 border-indigo-700 rounded-2xl overflow-hidden shadow-md bg-white text-slate-900">
              <div className="bg-indigo-900 text-white text-center py-2.5 px-3">
                <h4 className="text-xs font-bold leading-tight">{institution.nameBn}</h4>
                <p className="text-[10px] text-indigo-200 mt-0.5">{institution.nameEn}</p>
                <span className="inline-block bg-white/20 text-white text-[9px] font-semibold px-2 py-0.5 rounded mt-1">
                  শিক্ষক ও কর্মকর্তা পরিচয়পত্র
                </span>
              </div>

              <div className="p-4 text-center">
                <div className="w-20 h-20 rounded-2xl border-2 border-indigo-600 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold mx-auto mb-2 shadow-xs">
                  <Users className="w-10 h-10" />
                </div>

                <h5 className="font-bold text-sm text-slate-900">{printableTeacherIdCard.nameBn}</h5>
                <p className="text-xs text-slate-500 font-medium">{printableTeacherIdCard.nameEn}</p>
                <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold text-xs mt-1">
                  {printableTeacherIdCard.designation}
                </span>

                <div className="mt-3 text-left text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">বিষয়:</span>
                    <span className="font-bold text-slate-800">{printableTeacherIdCard.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">যোগ্যতা:</span>
                    <span className="text-slate-800">{printableTeacherIdCard.qualification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">মোবাইল:</span>
                    <span className="font-mono text-slate-800 font-bold">{printableTeacherIdCard.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">রক্তের গ্রুপ:</span>
                    <span className="font-bold text-rose-600">{printableTeacherIdCard.bloodGroup}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  <div className="text-center">
                    <div className="w-20 border-t border-slate-400 mx-auto">শিক্ষকের স্বাক্ষর</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 border-t border-slate-400 mx-auto">অধ্যক্ষ / পরিচালক</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
