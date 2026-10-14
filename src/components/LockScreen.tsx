import React, { useState } from 'react';
import { 
  User, 
  KeyRound, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  School, 
  ShieldCheck,
  Sparkles,
  Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import schoolBannerImg from '../assets/images/school_campus_banner_1789958934558.jpg';

export const LockScreen: React.FC = () => {
  const { isLocked, login, pin, changePin, institution } = useApp();
  const [userId, setUserId] = useState('admin');
  const [inputPass, setInputPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isLocked) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার ইউজার আইডি লিখুন।');
      return;
    }
    if (!inputPass.trim()) {
      setErrorMsg('অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    const success = login(userId.trim(), inputPass.trim());
    if (!success) {
      setErrorMsg('ভুল ইউজার আইডি বা পাসওয়ার্ড! সঠিক তথ্য দিন।');
      setTimeout(() => setErrorMsg(''), 4500);
    }
  };

  const handleQuickLogin = (id: string, pass: string) => {
    setUserId(id);
    setInputPass(pass);
    login(id, pass);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const success = changePin(currentPass, newPass);
    if (!success) {
      setErrorMsg('বর্তমান পাসওয়ার্ড সঠিক নয় বা নতুন পাসওয়ার্ড ফাঁকা!');
      return;
    }
    setChangeSuccess(true);
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPass(false);
      setCurrentPass('');
      setNewPass('');
      setInputPass(newPass);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-['Hind_Siliguri',sans-serif] overflow-y-auto">
      {/* Background School Campus Banner */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${schoolBannerImg})` }}
      />
      
      {/* Dark & Glass Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60" />

      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Login Dialog Box */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-8 overflow-hidden text-slate-800 transition-all">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Header Institution Info */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30">
            <School className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>শিক্ষা প্রতিষ্ঠান ও পরীক্ষা পোর্টাল</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 tracking-tight leading-snug">
              {institution.nameBn}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              স্থাপিত: {institution.established} ইং | EMIS: {institution.emisNo}
            </p>
          </div>
        </div>

        {!isChangingPass ? (
          /* Main Login View */
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-1 flex">
              <button
                type="button"
                className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-white text-slate-900 shadow-xs transition"
              >
                লগইন ডায়ালগ
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPass(true)}
                className="flex-1 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition"
              >
                পাসওয়ার্ড পরিবর্তন
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2 font-medium animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* User ID Field */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold text-slate-700">
                  ইউজার আইডি (User ID):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="login-username-input"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    placeholder="ইউজার আইডি (যেমন: admin বা শিক্ষক কোড)"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 outline-none transition"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    পাসওয়ার্ড (Password):
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ডিফল্ট: {pin}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="login-password-input"
                    value={inputPass}
                    onChange={e => setInputPass(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full pl-10 pr-10 py-2.5 text-xs font-mono font-semibold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 outline-none transition tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>আমাকে মনে রাখুন</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', pin)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer text-[11px]"
                >
                  স্বয়ংক্রিয় পূরণ
                </button>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                id="btn-login-submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-700/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="pt-3 border-t border-slate-100 text-left">
              <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>দ্রুত ১-ক্লিক ডেমো লগইন:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', pin)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 transition text-left cursor-pointer"
                >
                  <div className="text-[11px] font-bold flex items-center gap-1">
                    <span>👑 প্রধান শিক্ষক</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">admin / {pin}</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('teacher', pin)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 transition text-left cursor-pointer"
                >
                  <div className="text-[11px] font-bold flex items-center gap-1">
                    <span>👨‍🏫 সহকারী শিক্ষক</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">teacher / {pin}</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Password Change View */
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>পাসওয়ার্ড পরিবর্তন করুন</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsChangingPass(false)}
                className="text-xs text-indigo-600 hover:underline font-bold cursor-pointer"
              >
                লগইনে ফিরুন
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {changeSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">বর্তমান পাসওয়ার্ড:</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                  placeholder="যেমন: Kolabaria2026"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">নতুন পাসওয়ার্ড:</label>
                <input
                  type="text"
                  required
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:border-indigo-600 outline-none"
                  placeholder="নতুন পাসওয়ার্ড লিখুন..."
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
          সুরক্ষিত স্কুল ও কলেজ প্রশাসন সিস্টেম • ২০২৬
        </div>
      </div>
    </div>
  );
};
