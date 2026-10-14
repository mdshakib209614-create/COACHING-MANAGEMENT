import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  FileText, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown, 
  ChevronRight,
  Printer,
  Sparkles,
  Package,
  Layers,
  Archive,
  X,
  UserCircle,
  FilePlus2,
  FolderArchive
} from 'lucide-react';
import { useApp, NavSection } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengaliUtils';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    activeTab, 
    setActiveTab, 
    institution, 
    students, 
    teachers, 
    questions,
    savedExamPapers,
    logout,
    currentUser 
  } = useApp();

  const [examSubmenuOpen, setExamSubmenuOpen] = useState(
    activeTab === 'exam-routine' || activeTab === 'admit-card' || activeTab === 'seat-plan'
  );

  const handleNavClick = (tab: NavSection) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-[#0f212c]/75 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 
        Fixed Stationary Sidebar (Does not scroll with content) 
      */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 md:w-68 bg-[#1e3b4d] text-slate-100 flex flex-col justify-between border-r border-[#17303e] shrink-0 print:hidden select-none transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } no-print`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
          {/* User Profile Header */}
          <div className="p-4 sm:p-5 flex flex-col items-center text-center border-b border-[#284c61] relative">
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-[#90b1c2] hover:text-white hover:bg-[#25475a]"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Circular Profile Avatar */}
            <div className="relative mb-2">
              <div className="w-14 h-14 rounded-full bg-[#dbe8ef] p-0.5 shadow-md ring-2 ring-[#456c80] flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  alt="User Avatar"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover rounded-full"
                />
                <UserCircle className="w-11 h-11 text-[#1e3b4d]" />
              </div>
            </div>

            <h2 className="text-sm font-bold text-white tracking-wide">
              {currentUser?.name || 'নির্মল কুমার (প্রশাসক)'}
            </h2>
            <p className="text-[11px] text-[#93b4c4] font-medium truncate max-w-[210px] mt-0.5">
              {institution.nameBn}
            </p>
            <span className="mt-1 text-[10px] text-[#b3d4e6] bg-[#294c60] px-2.5 py-0.5 rounded-full font-mono font-medium">
              Admin
            </span>
          </div>

          {/* Navigation Items (All Options Included) */}
          <nav className="p-3 space-y-1 text-xs">
            {/* 1. ড্যাশবোর্ড */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">ড্যাশবোর্ড</span>
            </button>

            {/* 2. প্রতিষ্ঠান পরিচিতি */}
            <button
              onClick={() => handleNavClick('institution')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'institution'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <School className={`w-4 h-4 ${activeTab === 'institution' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">প্রতিষ্ঠান পরিচিতি</span>
            </button>

            {/* ----------------------------------------------------
                প্রশ্নপত্র বিভাগ (২টি সুস্পষ্ট অপশন: নতুন প্রশ্নপত্র তৈরি & প্রশ্নপত্র আর্কাইভ)
               ---------------------------------------------------- */}
            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#638a9f]">
                প্রশ্নপত্র ব্যবস্থাপনা
              </span>
            </div>

            {/* 3. নতুন প্রশ্নপত্র তৈরি */}
            <button
              onClick={() => handleNavClick('exam-questions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'exam-questions' || activeTab === 'add-question'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FilePlus2 className={`w-4 h-4 ${activeTab === 'exam-questions' || activeTab === 'add-question' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
                <span className="text-sm">নতুন প্রশ্নপত্র তৈরি</span>
              </div>
              <span className="text-[10px] bg-[#274b5f] text-[#b3d4e6] px-1.5 py-0.5 rounded font-mono">
                ২ পেজ
              </span>
            </button>

            {/* 4. প্রশ্নপত্র আর্কাইভ */}
            <button
              onClick={() => handleNavClick('saved-papers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'saved-papers'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderArchive className={`w-4 h-4 ${activeTab === 'saved-papers' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
                <span className="text-sm">প্রশ্নপত্র আর্কাইভ</span>
              </div>
              <span className="text-[10px] font-mono text-[#8eb0c2] bg-[#274b5f] px-1.5 py-0.5 rounded">
                {savedExamPapers.length}
              </span>
            </button>

            {/* 5. প্রশ্ন ব্যাংক */}
            <button
              onClick={() => handleNavClick('question-bank')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'question-bank'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 ${activeTab === 'question-bank' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
                <span className="text-sm">প্রশ্ন ব্যাংক</span>
              </div>
              <span className="text-[10px] font-mono text-[#8eb0c2]">
                {questions.length || '৫৪৮৩'}
              </span>
            </button>

            {/* ----------------------------------------------------
                পরীক্ষা ও রুটিন ব্যবস্থাপনা (With sub-links)
               ---------------------------------------------------- */}
            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#638a9f]">
                পরীক্ষা ও একাডেমিক
              </span>
            </div>

            {/* 6. পরীক্ষা ও রুটিন parent dropdown */}
            <div>
              <button
                onClick={() => setExamSubmenuOpen(!examSubmenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  activeTab === 'exam-routine' || activeTab === 'admit-card' || activeTab === 'seat-plan'
                    ? 'text-white bg-[#25485c]'
                    : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-4 h-4 text-[#95b4c4]" />
                  <span className="text-sm">পরীক্ষা ও রুটিন</span>
                </div>
                {examSubmenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#95b4c4]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#95b4c4]" />
                )}
              </button>

              {examSubmenuOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-[#2e5369] space-y-1">
                  <button
                    onClick={() => handleNavClick('exam-routine')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'exam-routine'
                        ? 'bg-[#dcebf2] text-[#183241] font-bold'
                        : 'text-[#8cb0c2] hover:text-white hover:bg-[#25485c]'
                    }`}
                  >
                    <span>পরীক্ষার রুটিন</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('admit-card')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'admit-card'
                        ? 'bg-[#dcebf2] text-[#183241] font-bold'
                        : 'text-[#8cb0c2] hover:text-white hover:bg-[#25485c]'
                    }`}
                  >
                    <span>প্রবেশপত্র (Admit Card)</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('seat-plan')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'seat-plan'
                        ? 'bg-[#dcebf2] text-[#183241] font-bold'
                        : 'text-[#8cb0c2] hover:text-white hover:bg-[#25485c]'
                    }`}
                  >
                    <span>সিট প্ল্যান (Seat Plan)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 7. শিক্ষার্থী তালিকা */}
            <button
              onClick={() => handleNavClick('students')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className={`w-4 h-4 ${activeTab === 'students' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
                <span className="text-sm">শিক্ষার্থী তালিকা</span>
              </div>
              <span className="text-[10px] font-mono text-[#8eb0c2]">
                {toBengaliNumber(students.length)}
              </span>
            </button>

            {/* 8. শিক্ষক ও স্টাফ */}
            <button
              onClick={() => handleNavClick('teachers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'teachers'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'teachers' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
                <span className="text-sm">শিক্ষক ও স্টাফ</span>
              </div>
              <span className="text-[10px] font-mono text-[#8eb0c2]">
                {toBengaliNumber(teachers.length)}
              </span>
            </button>

            {/* 9. ফলাফল ও মার্কশীট */}
            <button
              onClick={() => handleNavClick('results')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'results' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">ফলাফল ও মার্কশীট</span>
            </button>

            {/* 10. প্রশংসাপত্র ও সার্টিফিকেট */}
            <button
              onClick={() => handleNavClick('certificates')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'certificates' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">প্রশংসাপত্র ও সনদ</span>
            </button>

            {/* 11. ফি ও হিসাব */}
            <button
              onClick={() => handleNavClick('fees')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'fees'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${activeTab === 'fees' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">ফি ও হিসাব</span>
            </button>

            {/* 12. নোটিশ বোর্ড */}
            <button
              onClick={() => handleNavClick('notices')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'notices'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <Bell className={`w-4 h-4 ${activeTab === 'notices' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">নোটিশ বোর্ড</span>
            </button>

            {/* 13. সেটিংস */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#dcebf2] text-[#183241] font-bold shadow-xs'
                  : 'text-[#95b4c4] hover:text-white hover:bg-[#25485c]'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#183241]' : 'text-[#95b4c4]'}`} />
              <span className="text-sm">সিস্টেম সেটিংস</span>
            </button>
          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="p-3 border-t border-[#284c61]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#95b4c4] hover:text-rose-300 hover:bg-[#25485c] transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">লগআউট (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
