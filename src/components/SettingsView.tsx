import React, { useState } from 'react';
import { 
  Settings, 
  School, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  Download, 
  Building2, 
  Award, 
  FileText, 
  Sparkles, 
  AlertTriangle,
  Image as ImageIcon,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InstitutionProfile } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    institution, 
    updateInstitution, 
    pin, 
    changePin, 
    resetAllData,
    students,
    teachers,
    results 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'contact' | 'codes' | 'authority' | 'security' | 'backup'>('general');
  const [formData, setFormData] = useState<InstitutionProfile>({ ...institution });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // PIN change state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Logo preset selection
  const logoPresets = [
    { label: 'একাডেমি মনোগ্রাম (ডিফল্ট)', value: '' },
    { label: 'শিক্ষা মশাল আইকন', value: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80' },
    { label: 'উন্মুক্ত বই ও কলম', value: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=120&auto=format&fit=crop&q=80' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution(formData);
    setSuccessMsg('অভিনন্দন! আপনার প্রতিষ্ঠানের সেটিংস ও স্ট্যাটিক তথ্যাবলি সফলভাবে সংরক্ষিত ও সম্পূর্ণ ওয়েবসাইটে আপডেট হয়েছে।');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    if (newPin !== confirmPin) {
      setPinError('নতুন পিন এবং নিশ্চিতকরণ পিন হুবহু মিলছে না!');
      return;
    }

    if (newPin.length < 4) {
      setPinError('পিন কোড কমপক্ষে ৪ ডিজিট বা অক্ষরের হতে হবে।');
      return;
    }

    const success = changePin(oldPin, newPin);
    if (success) {
      setPinSuccess(true);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinSuccess(false), 4000);
    } else {
      setPinError('পুরাতন পিন কোডটি সঠিক নয়! দয়া করে সঠিক পিন দিন।');
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      institution,
      studentsCount: students.length,
      teachersCount: teachers.length,
      resultsCount: results.length,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coaching_settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFactoryReset = () => {
    if (window.confirm('সতর্কতা! আপনি কি নিশ্চিত যে সমস্ত ডেটা মুছে ফেলে ডিফল্ট সেটিংসে ফিরে যেতে চান? এটি অপরিবর্তনযোগ্য।')) {
      resetAllData();
      setFormData(institution);
      alert('সিস্টেমের সমস্ত ডেটা ফ্যাক্টরি রিসেট হয়ে ডিফল্ট অবস্থায় ফিরে গেছে।');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                সিস্টেম ও সাধারণ সেটিংস (Settings)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                লাইভ সিঙ্ক সক্রিয়
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              প্রতিষ্ঠানের নাম, ঠিকানা, অফিসিয়াল কোড ও কর্তৃপক্ষ সম্পর্কিত যে কোনো স্ট্যাটিক তথ্য এখান থেকে পরিবর্তন করুন।
            </p>
          </div>
        </div>

        <button
          onClick={handleFormSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>সকল পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p>{successMsg}</p>
            <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
              সাইডবার, হেডার, ড্যাশবোর্ড, রেজাল্ট শিট, এডমিট কার্ড, প্রত্যয়ন পত্র ও প্রশ্নপত্র ইত্যাদিতে নতুন তথ্য কার্যকর হয়েছে।
            </p>
          </div>
        </div>
      )}

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <School className="w-4 h-4 text-sky-400" />
          <span>১. প্রতিষ্ঠানের পরিচিতি ও নাম</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>২. ঠিকানা ও যোগাযোগ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('codes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'codes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>৩. অফিসিয়াল কোড ও স্বীকৃতি</span>
        </button>

        <button
          onClick={() => setActiveSubTab('authority')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'authority'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span>৪. প্রধান শিক্ষক ও স্বাক্ষর ব্লক</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-rose-400" />
          <span>৫. নিরাপত্তা ও পিন কোড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-purple-400" />
          <span>৬. ব্যাকআপ ও ডাটা রিসেট</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: General Info */}
          {activeSubTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <School className="w-4 h-4 text-sky-600" />
                  <span>প্রতিষ্ঠানের নাম ও ব্র্যান্ডিং কনফিগারেশন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  এই নামসমূহ সমস্ত পরীক্ষার প্রশ্নপত্র, প্রবেশপত্র, প্রত্যয়ন পত্র ও সনদপত্রে মূল শিরোনাম হিসেবে প্রদর্শিত হবে।
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    প্রতিষ্ঠানের পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameBn}
                    onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="যেমন: কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    সাইডবার, হেডার, মার্কশিট ও প্রশ্নপত্রের শীর্ষে এই নামটি থাকবে।
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Institution Full Name (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="e.g. Kolabaria Model Academy & Coaching Center"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      প্রতিষ্ঠানের স্লোগান বা মূলমন্ত্র
                    </label>
                    <input
                      type="text"
                      value={formData.slogan || 'জ্ঞানই শক্তি, নৈতিকতাই সমৃদ্ধি'}
                      onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="যেমন: শিক্ষার আলো ছড়াবো আমরা"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      স্থাপিত শিক্ষাবর্ষ / সাল
                    </label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={e => setFormData({ ...formData, established: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="১৯৯৮"
                    />
                  </div>
                </div>

                {/* Logo Preset Selection */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    প্রতিষ্ঠানের লোগো / মনোগ্রাম সেটিংস
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {logoPresets.map((preset, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => setFormData({ ...formData, logoUrl: preset.value })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                          (formData.logoUrl || '') === preset.value
                            ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-200'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          {preset.value ? (
                            <img src={preset.value} alt="" className="w-6 h-6 object-cover rounded" />
                          ) : (
                            <School className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 leading-tight">
                          {preset.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Address & Contact */}
          {activeSubTab === 'contact' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>ঠিকানা ও অফিসিয়াল যোগাযোগ নম্বর</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  আইডি কার্ডের পেছনের অংশ, সার্টিফিকেট এবং প্রশ্নপত্রের হেডারে এই যোগাযোগের তথ্য ব্যবহৃত হবে।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    গ্রাম / এলাকা / হোল্ডিং:
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ডাকঘর / পোস্ট অফিস:
                  </label>
                  <input
                    type="text"
                    value={formData.postOffice}
                    onChange={e => setFormData({ ...formData, postOffice: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    উপজেলা / থানা:
                  </label>
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    জেলা:
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    অফিসিয়াল মোবাইল নং:
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    অফিসিয়াল ইমেইল:
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ওয়েবসাইট / ওয়েব পোর্টাল ইউআরএল:
                  </label>
                  <input
                    type="text"
                    value={formData.website || 'www.kolabaria-academy.edu.bd'}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Official Codes */}
          {activeSubTab === 'codes' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>অফিসিয়াল আইডেন্টিফায়ার ও সরকারি কোডসমূহ</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  সরকারি ও একাডেমিক নথিপত্রে যেসকল কোড প্রদর্শন আবশ্যক, সেগুলো এখানে কনফিগার করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    EIIN নম্বর:
                  </label>
                  <input
                    type="text"
                    value={formData.eiin || '১৩৪৫৮৯'}
                    onChange={e => setFormData({ ...formData, eiin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="১৩৪৫৮৯"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    রেজাল্ট শিট ও প্রত্যয়ন পত্রে প্রদর্শিত হয়।
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    EMIS কোড নং:
                  </label>
                  <input
                    type="text"
                    value={formData.emisNo}
                    onChange={e => setFormData({ ...formData, emisNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ওয়েবসাইটের টপ-হেডারে সরাসরি লাইভ প্রদর্শিত হয়।
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    IPEMIS রেজিস্ট্রেশন কোড:
                  </label>
                  <input
                    type="text"
                    value={formData.ipemisCode}
                    onChange={e => setFormData({ ...formData, ipemisCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    সক্রিয় শিক্ষাবর্ষ:
                  </label>
                  <input
                    type="text"
                    defaultValue="২০২৬ খ্রি."
                    className="w-full px-3.5 py-2.5 text-xs font-bold border border-slate-300 rounded-xl bg-slate-100 text-slate-800"
                    readOnly
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    বর্তমান সকল পরীক্ষার একাডেমিক বর্ষ।
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Authority & Signatures */}
          {activeSubTab === 'authority' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>প্রশাসন ও স্বাক্ষর কর্মকর্তা সেটিংস</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  সকল সনদ, রেজাল্ট শিট ও রুটিনের নিচে দায়িত্বপ্রাপ্ত কর্মকর্তার স্বাক্ষর ও সিলমোহর ব্লক তৈরি হবে।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    প্রধান শিক্ষক / পরিচালকের নাম:
                  </label>
                  <input
                    type="text"
                    value={formData.headmasterName}
                    onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পদবি (স্বাক্ষর লাইন):
                  </label>
                  <input
                    type="text"
                    value={formData.headmasterTitle}
                    onChange={e => setFormData({ ...formData, headmasterTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="যেমন: প্রধান শিক্ষক ও পরিচালক"
                  />
                </div>
              </div>

              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>স্বয়ংক্রিয় স্বাক্ষর ও সিল প্রিভিউ</span>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-800">
                  নথিপত্র প্রিন্ট হওয়ার সময় নিচের মতো একটি অফিসিয়াল স্বাক্ষর রেখা সংযুক্ত থাকে:
                </p>
                <div className="mt-3 pt-3 border-t border-indigo-200/60 flex items-center justify-between">
                  <div className="text-center w-36">
                    <div className="border-t border-dashed border-indigo-400 pt-1 text-[11px] font-bold text-indigo-900">
                      অভিভাবকের স্বাক্ষর
                    </div>
                  </div>
                  <div className="text-center w-48">
                    <div className="border-t border-indigo-900 pt-1 text-[11px] font-bold text-indigo-950">
                      {formData.headmasterName || 'মোঃ রফিকুল ইসলাম'}
                    </div>
                    <div className="text-[10px] text-indigo-700">
                      {formData.headmasterTitle || 'প্রধান শিক্ষক ও পরিচালক'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Security & PIN Code */}
          {activeSubTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>সিস্টেম নিরাপত্তা ও স্ক্রিন লক পিন কোড পরিবর্তন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  সাইডবারের "সিস্টেম লক করুন" বাটনে ক্লিক করলে যে পাসওয়ার্ড/পিন চাইবে, তা এখান থেকে নিজের ইচ্ছামতো পরিবর্তন করতে পারবেন।
                </p>
              </div>

              {pinSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পিন কোড সফলভাবে পরিবর্তন হয়েছে! পরবর্তী লগইনে নতুন পিন কার্যকর হবে।</span>
                </div>
              )}

              {pinError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <form onSubmit={handlePinChangeSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    বর্তমান / পুরাতন পিন কোড:
                  </label>
                  <input
                    type="password"
                    value={oldPin}
                    onChange={e => setOldPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500"
                    placeholder="ডিফল্ট: Kolabaria2026"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    (ডিফল্ট মাস্টার পিন: Kolabaria2026)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    নতুন পিন কোড (New PIN):
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="কমপক্ষে ৪ ডিজিট বা অক্ষর"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    নতুন পিন নিশ্চিত করুন (Confirm New PIN):
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="পুনরায় টাইপ করুন"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>পিন কোড আপডেট করুন</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: Backup & Factory Reset */}
          {activeSubTab === 'backup' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-600" />
                  <span>ডাটা ব্যাকআপ, এক্সপোর্ট ও ফ্যাক্টরি রিসেট</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  নিরাপত্তার স্বার্থে আপনার প্রতিষ্ঠানের সেটিংস ও ডেটার ব্যাকআপ সংরক্ষণ করতে পারেন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>সেটিংস ব্যাকআপ ডাউনলোড (JSON)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    বর্তমান সেটিংস ও প্রাতিষ্ঠানিক ডেটার একটি অফলাইন ফাইল সংরক্ষণ করতে নিচের বোতাম চাপুন।
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ব্যাকআপ ফাইল ডাউনলোড করুন</span>
                  </button>
                </div>

                {/* Reset Card */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>ফ্যাক্টরি রিসেট (Restore Defaults)</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    যদি ভুল ডেটা এন্ট্রি হয়ে থাকে এবং প্রাথমিক ডিফল্ট তথ্যে ফিরে যেতে চান, তবে রিসেট করতে পারেন।
                  </p>
                  <button
                    onClick={handleFactoryReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট ডেটায় রিসেট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Live Synchronized Preview Card */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              লাইভ প্রতিষ্ঠানের ব্র্যান্ড প্রিভিউ
            </h3>

            <div className="w-28 h-28 mx-auto rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/50 p-2 flex flex-col items-center justify-center shadow-inner relative group mb-3">
              <div className="w-full h-full rounded-xl border border-dashed border-emerald-600 flex flex-col items-center justify-center text-emerald-800 p-1">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-lg mb-1" />
                ) : (
                  <School className="w-8 h-8 text-emerald-600 mb-1" />
                )}
                <span className="text-[9px] font-bold leading-none">মডেল একাডেমি</span>
                <span className="text-[8px] text-slate-500 mt-0.5 font-mono">
                  স্থাপিত {formData.established || '১৯৯৮'}
                </span>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-left">
              <div className="text-[10px] text-slate-500 font-semibold">প্রতিষ্ঠানের নাম:</div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                {formData.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার'}
              </div>
              <div className="text-[11px] text-slate-600">
                {formData.nameEn || 'Kolabaria Model Academy & Coaching Center'}
              </div>
              <div className="text-[10px] text-slate-500 mt-2">
                📍 {formData.village || 'কলাবাড়িয়া'}, {formData.upazila || 'সেনবাগ'}, {formData.district || 'নোয়াখালী'}
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                EIIN: {formData.eiin || '১৩৪৫৮৯'} • EMIS: {formData.emisNo || '২০৪০৫০৬০'}
              </div>
            </div>

            {/* Verification badge */}
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                এখানে সংরক্ষিত তথ্য স্বয়ংক্রিয়ভাবে ক্লাউড ও লোকাল স্টোরেজে সিঙ্ক হয়ে হেডার, সাইডবার ও সকল প্রিন্ট ডকুমেন্টে প্রযোজ্য হবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
