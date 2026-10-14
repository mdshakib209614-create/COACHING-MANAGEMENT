import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  LogOut, 
  Clock, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatBengaliCurrentDate } from '../utils/bengaliUtils';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleMobileMenu, 
  searchTerm = '', 
  onSearchChange 
}) => {
  const { institution, notices, logout, currentUser, setActiveTab } = useApp();
  const [dateTime, setDateTime] = useState(formatBengaliCurrentDate());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(formatBengaliCurrentDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setActiveTab('question-bank');
    }
  };

  const marqueeNotices = notices.length > 0 ? notices : [
    {
      id: 'default-notice',
      title: 'পরীক্ষার নোটিশ',
      content: 'আসন্ন সেমিস্টার পরীক্ষার প্রশ্নপত্র প্রণয়ন ও প্রিন্ট লেআউট যাচাই করুন।',
      date: '২০২৬-১০-১০',
      isEmergency: false
    }
  ];

  return (
    <header className="bg-white border-b border-[#c8dce6] sticky top-0 z-30 shadow-xs shrink-0 print:hidden no-print">
      {/* Clean Top Bar matching UI UX.jpg */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Trigger & Personalized Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-xl bg-[#edf4f8] text-[#1e3b4d] hover:bg-[#dcebf2] transition"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-baseline gap-2">
            <h1 className="text-lg md:text-xl font-bold text-[#183241] tracking-tight">
              Welcome {currentUser?.name ? currentUser.name.split(' ')[0] : 'Nirmal'} !
            </h1>
            <span className="hidden xl:inline text-xs text-[#6e8c9d] font-medium">
              ({institution.nameBn})
            </span>
          </div>
        </div>

        {/* Center: Search Capsule matching UI UX.jpg */}
        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xs md:max-w-md mx-2"
        >
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Search..."
              className="w-full bg-white border border-[#bed3df] hover:border-[#96bacd] focus:border-[#3692be] focus:ring-2 focus:ring-[#3692be]/20 rounded-full py-1.5 pl-4 pr-9 text-xs text-[#183241] placeholder-[#8eaab9] outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-2 p-1 text-[#6c8b9d] hover:text-[#183241] cursor-pointer"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right: Theme Toggle Capsule, Notification Bell, Live Time, Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Day / Night Toggle Capsule */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Theme Toggle"
            className="w-13 h-7 bg-[#dcebf2] hover:bg-[#cfdfe7] rounded-full p-1 flex items-center justify-between text-[#24495c] transition cursor-pointer relative shadow-inner"
          >
            <Sun className={`w-3.5 h-3.5 text-amber-500 transition-opacity ${isDarkMode ? 'opacity-30' : 'opacity-100'}`} />
            <Moon className={`w-3 h-3 text-[#1e3b4d] transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-40'}`} />
            <div 
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-xs transition-transform duration-200 flex items-center justify-center ${
                isDarkMode ? 'translate-x-6 bg-[#1e3b4d] text-white' : 'translate-x-0 text-amber-500'
              }`}
            >
              {isDarkMode ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-amber-500" />}
            </div>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="p-1.5 rounded-full text-[#1e3b4d] hover:bg-[#edf4f8] transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e06d53] ring-2 ring-white"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#cbe0ec] p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#edf3f7]">
                  <span className="font-bold text-[#183241]">নোটিশ ও বিজ্ঞপ্তি</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8ba7b7] hover:text-[#183241]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 py-2 max-h-56 overflow-y-auto">
                  {marqueeNotices.slice(0, 3).map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => { setActiveTab('notices'); setShowNotifications(false); }}
                      className="p-2 rounded-xl bg-[#f4f8fb] hover:bg-[#edf5f9] cursor-pointer"
                    >
                      <div className="font-semibold text-[#183241]">{n.title}</div>
                      <div className="text-[11px] text-[#6e8c9d] truncate">{n.content}</div>
                      <div className="text-[10px] text-[#3692be] font-mono mt-1">{n.date}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setActiveTab('notices'); setShowNotifications(false); }}
                  className="w-full py-1.5 text-center text-xs font-bold text-[#2b556b] hover:bg-[#edf4f8] rounded-xl transition"
                >
                  সব নোটিশ দেখুন →
                </button>
              </div>
            )}
          </div>

          {/* Live Bengali Time */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#edf4f8] px-2.5 py-1 rounded-full text-[11px] font-mono text-[#2f5569] font-medium">
            <Clock className="w-3 h-3 text-[#3692be]" />
            <span>{dateTime.timeStr}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="লগআউট"
            className="p-1.5 rounded-full text-[#6f8e9f] hover:text-rose-600 hover:bg-[#faece7] transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
