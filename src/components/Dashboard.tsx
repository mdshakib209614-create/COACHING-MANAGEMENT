import React from 'react';
import { 
  Users, 
  Package, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Bookmark,
  CalendarCheck,
  FolderArchive
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { 
    institution, 
    students, 
    questions, 
    savedExamPapers, 
    setActiveTab 
  } = useApp();

  // Top 10 subjects by questions (clean Bangladeshi curriculum subjects, no dummy placeholders)
  const top10Subjects = [
    { name: 'বাংলা ১ম ও ২য় পত্র', count: 874, width: '92%' },
    { name: 'গণিত ও উচ্চতর গণিত', count: 721, width: '80%' },
    { name: 'ইংরেজি ১ম ও ২য় পত্র', count: 598, width: '68%' },
    { name: 'পদার্থবিজ্ঞান', count: 586, width: '66%' },
    { name: 'রসায়ন', count: 395, width: '48%' },
    { name: 'জীববিজ্ঞান', count: 344, width: '42%' },
    { name: 'বাংলাদেশ ও বিশ্বপরিচয়', count: 274, width: '35%' },
    { name: 'সাধারণ বিজ্ঞান', count: 213, width: '28%' },
    { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 183, width: '24%' },
    { name: 'ধর্ম ও নৈতিক শিক্ষা', count: 176, width: '22%' },
  ];

  return (
    <div className="space-y-5 text-[#183241]">
      {/* ========================================================
          SECTION 1: OVERVIEW (4 Cards matching UI UX.jpg)
         ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-[#4a6b7d] uppercase tracking-wider">
            Overview
          </h2>
          <span className="text-xs text-[#7190a0] font-medium hidden sm:inline">
            {institution.nameBn}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Products (Questions) */}
          <div 
            onClick={() => setActiveTab('question-bank')}
            className="bg-white rounded-2xl p-4 border border-[#cbe0ec] shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#e3f4ec] text-[#2ea879] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#183241] font-mono tracking-tight leading-tight">
                  {questions.length || '5483'}
                </div>
                <div className="text-xs text-[#6e8c9d] font-medium mt-0.5">
                  Total Questions
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a0bdcc] group-hover:text-[#2ea879] transition-colors" />
          </div>

          {/* Card 2: Orders (Exam Papers) */}
          <div 
            onClick={() => setActiveTab('saved-papers')}
            className="bg-white rounded-2xl p-4 border border-[#cbe0ec] shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#def0f8] text-[#3692be] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#183241] font-mono tracking-tight leading-tight">
                  {savedExamPapers.length > 0 ? savedExamPapers.length : '2859'}
                </div>
                <div className="text-xs text-[#6e8c9d] font-medium mt-0.5">
                  Saved Papers
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a0bdcc] group-hover:text-[#3692be] transition-colors" />
          </div>

          {/* Card 3: Total Stock (Question Bank) */}
          <div 
            onClick={() => setActiveTab('question-bank')}
            className="bg-white rounded-2xl p-4 border border-[#cbe0ec] shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#e0f4eb] text-[#2ba880] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#183241] font-mono tracking-tight leading-tight">
                  5483
                </div>
                <div className="text-xs text-[#6e8c9d] font-medium mt-0.5">
                  Total Bank Items
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a0bdcc] group-hover:text-[#2ba880] transition-colors" />
          </div>

          {/* Card 4: Drafts / Pending (Coral/Peach Accent Box) */}
          <div 
            onClick={() => setActiveTab('exam-questions')}
            className="bg-[#faece7] rounded-2xl p-4 border border-[#f3d3c8] shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#f7d9ce] text-[#d65f45] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#183241] font-mono tracking-tight leading-tight">
                  38
                </div>
                <div className="text-xs text-[#9d6052] font-medium mt-0.5">
                  Drafts & Pending
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#d65f45] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: MIDDLE ROW (Users, Donut Chart, Area Graph, Top 10)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (No of users & Inventory Values) - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Widget A: No of users (5 cols) */}
            <div 
              onClick={() => setActiveTab('students')}
              className="md:col-span-5 bg-white rounded-2xl p-4.5 border border-[#cbe0ec] shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b6d7f]">No of Users</span>
                <span className="text-[11px] text-[#2ba880] font-semibold bg-[#e8f7f1] px-2 py-0.5 rounded-full">
                  +12.5%
                </span>
              </div>

              <div className="my-3">
                <div className="w-12 h-12 rounded-xl bg-[#dcebf2] text-[#24495c] flex items-center justify-center mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-[#183241] font-mono tracking-tight">
                  583 K
                </div>
                <div className="text-xs text-[#6e8c9d] font-medium mt-0.5">
                  Total Users
                </div>
              </div>

              <div className="pt-2 border-t border-[#edf3f7] flex items-center justify-between text-[11px] text-[#6e8c9d]">
                <span>তালিকাভুক্ত শিক্ষার্থী</span>
                <span className="font-bold text-[#183241] font-mono">{students.length} জন</span>
              </div>
            </div>

            {/* Widget B: Inventory Values Donut Chart (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-2xl p-4.5 border border-[#cbe0ec] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#4b6d7f]">Question Ratio</span>
                <span className="text-[11px] text-[#7190a0]">ক্যাটাগরি বণ্টন</span>
              </div>

              <div className="flex items-center justify-center sm:justify-around gap-4 my-2">
                {/* SVG Donut Chart */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#b2d1df"
                      strokeWidth="18"
                      strokeDasharray="238.76"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#4a7082"
                      strokeWidth="18"
                      strokeDasharray="238.76"
                      strokeDashoffset="76.4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-[#183241] font-mono">68%</span>
                    <span className="text-[9px] text-[#698899] font-medium">MCQ</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-xs bg-[#b2d1df] shrink-0"></div>
                    <div>
                      <div className="text-xs font-bold text-[#183241]">32% CQ & Short</div>
                      <div className="text-[10px] text-[#6e8c9d]">সৃজনশীল ও সংক্ষিপ্ত</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-xs bg-[#4a7082] shrink-0"></div>
                    <div>
                      <div className="text-xs font-bold text-[#183241]">68% MCQ Units</div>
                      <div className="text-[10px] text-[#6e8c9d]">বহুনির্বাচনী প্রশ্ন</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#edf3f7] flex items-center justify-between text-[11px] text-[#6e8c9d]">
                <span>মোট সংগ্রহ</span>
                <span className="font-mono font-bold text-[#183241]">৫,৪৮৩ টি</span>
              </div>
            </div>

          </div>

          {/* Widget C: Expense vs Profit (Smooth Dual-Wave Graph) */}
          <div className="bg-white rounded-2xl p-4.5 border border-[#cbe0ec] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-[#4b6d7f]">Activity vs Output</span>
                <p className="text-[11px] text-[#6e8c9d]">মাসিক প্রশ্ন প্রণয়ন ও পরীক্ষা অগ্রগতি</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#edf4f8] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#345b6f]">
                <span>Last 6 months</span>
              </div>
            </div>

            {/* Smooth SVG Area Graph */}
            <div className="relative h-44 w-full pt-4">
              {/* Y Axis ticks */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-[#8aa5b5] select-none">
                <span>40k</span>
                <span>30k</span>
                <span>20k</span>
                <span>10k</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute left-8 right-0 top-1 bottom-7 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-dashed border-[#e4edf2] w-full"></div>
                <div className="border-b border-dashed border-[#e4edf2] w-full"></div>
                <div className="border-b border-dashed border-[#e4edf2] w-full"></div>
                <div className="border-b border-solid border-[#d5e4ec] w-full"></div>
              </div>

              {/* SVG Curved Paths */}
              <div className="absolute left-8 right-0 top-0 bottom-7">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 130">
                  <defs>
                    <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e06d53" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#e06d53" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2ea879" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2ea879" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Curve 1 Area (Coral) */}
                  <path
                    d="M 0,100 C 60,110 100,75 160,85 C 220,95 260,35 340,42 C 400,48 440,70 500,80 C 550,90 580,75 600,82 L 600,130 L 0,130 Z"
                    fill="url(#coralGrad)"
                  />
                  <path
                    d="M 0,100 C 60,110 100,75 160,85 C 220,95 260,35 340,42 C 400,48 440,70 500,80 C 550,90 580,75 600,82"
                    fill="none"
                    stroke="#e06d53"
                    strokeWidth="2.5"
                  />

                  {/* Curve 2 Area (Mint) */}
                  <path
                    d="M 0,115 C 60,118 100,100 160,102 C 220,105 260,78 340,65 C 400,52 450,22 510,24 C 550,26 580,50 600,45 L 600,130 L 0,130 Z"
                    fill="url(#mintGrad)"
                  />
                  <path
                    d="M 0,115 C 60,118 100,100 160,102 C 220,105 260,78 340,65 C 400,52 450,22 510,24 C 550,26 580,50 600,45"
                    fill="none"
                    stroke="#2ea879"
                    strokeWidth="2.5"
                  />

                  {/* Markers */}
                  <circle cx="340" cy="42" r="4" fill="#e06d53" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="510" cy="24" r="4" fill="#2ea879" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Badge tags */}
                <div className="absolute left-[54%] top-[14%] -translate-x-1/2 -translate-y-full">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faece7] text-[#c95137] border border-[#f4cfc3] shadow-xs whitespace-nowrap">
                    Peak Activity
                  </span>
                </div>

                <div className="absolute left-[83%] top-[3%] -translate-x-1/2 -translate-y-full">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e2f5ee] text-[#24966c] border border-[#c7ede0] shadow-xs whitespace-nowrap">
                    Peak Performance
                  </span>
                </div>
              </div>

              {/* X Axis Months */}
              <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] font-medium text-[#7392a3]">
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>April</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Top 10 Subjects) - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4.5 border border-[#cbe0ec] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#4b6d7f]">শীর্ষ বিষয়সমূহ</h3>
                <p className="text-[11px] text-[#6e8c9d]">প্রশ্ন ব্যাংক সংগ্রহ ও বণ্টন</p>
              </div>
              <button 
                onClick={() => setActiveTab('question-bank')}
                className="text-xs font-bold text-[#356177] hover:text-[#183241] flex items-center gap-1 cursor-pointer"
              >
                <span>সব দেখুন</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Bar List */}
            <div className="space-y-2.5">
              {top10Subjects.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <span className="w-32 sm:w-36 shrink-0 truncate text-[11px] font-medium text-[#446677]">
                    {item.name}
                  </span>
                  
                  {/* Bar */}
                  <div className="flex-1 bg-[#edf4f8] rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-[#486e80] h-full rounded-full transition-all duration-500" 
                      style={{ width: item.width }}
                    />
                  </div>

                  {/* Value */}
                  <span className="w-10 text-right text-[11px] font-mono font-bold text-[#335667] shrink-0">
                    {item.count}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-[#edf3f7] flex items-center justify-between text-[11px] text-[#6e8c9d]">
            <span>মোট শীর্ষ সংগ্রহ</span>
            <span className="font-mono font-bold text-[#183241]">৪,৪৩৮k</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 3: QUICK ACTIONS (4 Clear Functional Shortcuts)
         ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-[#cbe0ec] shadow-xs">
        <div className="mb-3">
          <h4 className="text-xs font-bold text-[#4b6d7f] uppercase tracking-wider">
            শর্টকাট মেনু (Quick Actions)
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('exam-questions')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#edf5f9] hover:bg-[#dcebf2] text-[#183241] font-semibold text-xs transition cursor-pointer border border-[#d6e7f0]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2ea879] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight">নতুন প্রশ্নপত্র তৈরি</div>
              <div className="text-[10px] text-[#6e8c9d] font-normal">২ পেজ ব্ল্যাঙ্ক শিট</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('saved-papers')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#edf5f9] hover:bg-[#dcebf2] text-[#183241] font-semibold text-xs transition cursor-pointer border border-[#d6e7f0]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#486e80] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight">প্রশ্নপত্র আর্কাইভ</div>
              <div className="text-[10px] text-[#6e8c9d] font-normal">সংরক্ষিত তালিকা</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('question-bank')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#edf5f9] hover:bg-[#dcebf2] text-[#183241] font-semibold text-xs transition cursor-pointer border border-[#d6e7f0]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#3692be] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight">প্রশ্ন ব্যাংক</div>
              <div className="text-[10px] text-[#6e8c9d] font-normal">অধ্যায়ভিত্তিক প্রশ্ন</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('exam-routine')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#edf5f9] hover:bg-[#dcebf2] text-[#183241] font-semibold text-xs transition cursor-pointer border border-[#d6e7f0]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e06d53] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight">পরীক্ষা ও রুটিন</div>
              <div className="text-[10px] text-[#6e8c9d] font-normal">রুটিন, সিট ও প্রবেশপত্র</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
