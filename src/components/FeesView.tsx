import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  FileText,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FeeTransaction } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const FeesView: React.FC = () => {
  const { fees, addFeeTransaction, students, institution } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('সেপ্টেম্বর ২০২৬');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printableReceipt, setPrintableReceipt] = useState<FeeTransaction | null>(null);

  const monthsList = [
    'সেপ্টেম্বর ২০২৬', 'অক্টোবর ২০২৬', 'নভেম্বর ২০২৬', 'ডিসেম্বর ২০২৬',
    'জানুয়ারি ২০২৬', 'ফেব্রুয়ারি ২০২৬', 'মার্চ ২০২৬', 'এপ্রিল ২০২৬'
  ];

  // Quick form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [feeType, setFeeType] = useState<'মাসিক বেতন' | 'ভর্তি ফি' | 'পরীক্ষা ফি' | 'কোচিং শিট ফি'>('মাসিক বেতন');
  const [amount, setAmount] = useState(1200);
  const [paymentMethod, setPaymentMethod] = useState<'নগদ' | 'বিকাশ' | 'নগদ/রকেট' | 'ব্যাংক'>('বিকাশ');

  const totalCollected = fees
    .filter(f => f.status === 'পরিশোধিত')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDue = fees
    .filter(f => f.status === 'বকেয়া')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleStudentSelect = (sId: string) => {
    setStudentId(sId);
    const st = students.find(s => s.id === sId);
    if (st) {
      setAmount(st.monthlyFee);
    }
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    addFeeTransaction({
      studentId: st.id,
      studentName: st.nameBn,
      class: st.class,
      roll: st.roll,
      month: selectedMonth,
      amount,
      feeType,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      status: 'পরিশোধিত',
    });

    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredFees = fees.filter(f => 
    f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.roll.includes(searchQuery) ||
    f.month.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>কোচিং ফি ও একাউন্টস ব্যবস্থাপনা</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            শিক্ষার্থীদের মাসিক বেতন, শিট ফি, পরীক্ষা ফি আদায় ও মানি রসিদ প্রিন্ট
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ফি আদায় / এন্ট্রি</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">মোট সংগৃহীত ফি</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            ৳ {toBengaliNumber(totalCollected)}
          </div>
          <span className="text-[11px] text-slate-400">অনলাইন ও নগদ আদায় সহ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">মোট বকেয়া ফি</span>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            ৳ {toBengaliNumber(totalDue)}
          </div>
          <span className="text-[11px] text-slate-400">চলতি মাসের অপরিশোধিত হিসাব</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">মোট ট্রানজেকশন</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
            {toBengaliNumber(fees.length)} টি
          </div>
          <span className="text-[11px] text-slate-400">রসিদ ও রেকর্ড সংরক্ষিত</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষার্থী বা রোল দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
          >
            {monthsList.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="p-3">রোল</th>
                <th className="p-3">শিক্ষার্থীর নাম</th>
                <th className="p-3">শ্রেণি</th>
                <th className="p-3">মাসের নাম</th>
                <th className="p-3">ফি'র ধরন</th>
                <th className="p-3">টাকার পরিমাণ</th>
                <th className="p-3">পেমেন্ট মাধ্যম</th>
                <th className="p-3">তারিখ</th>
                <th className="p-3">অবস্থা</th>
                <th className="p-3 text-center">রসিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map(fee => (
                <tr key={fee.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-800">{fee.roll}</td>
                  <td className="p-3 font-bold text-slate-900">{fee.studentName}</td>
                  <td className="p-3 text-slate-600">{fee.class}</td>
                  <td className="p-3 text-slate-600">{fee.month}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                      {fee.feeType}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">৳ {toBengaliNumber(fee.amount)}</td>
                  <td className="p-3 text-slate-600">{fee.paymentMethod}</td>
                  <td className="p-3 font-mono text-slate-500">{fee.paymentDate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      fee.status === 'পরিশোধিত'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setPrintableReceipt(fee)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition"
                    >
                      রসিদ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add Fee Payment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>ফি আদায় ও রসিদ তৈরি</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeeSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">শিক্ষার্থী নির্বাচন করুন:</label>
                <select
                  value={studentId}
                  onChange={e => handleStudentSelect(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold bg-slate-50"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.nameBn} - রোল: {s.roll} ({s.class})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ফি'র ধরন:</label>
                <select
                  value={feeType}
                  onChange={e => setFeeType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="মাসিক বেতন">মাসিক বেতন</option>
                  <option value="ভর্তি ফি">ভর্তি ফি</option>
                  <option value="পরীক্ষা ফি">পরীক্ষা ফি</option>
                  <option value="কোচিং শিট ফি">কোচিং শিট ফি</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">টাকার পরিমাণ (৳):</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">পেমেন্ট মাধ্যম:</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="নগদ">নগদ (Cash)</option>
                  <option value="বিকাশ">বিকাশ (bKash)</option>
                  <option value="নগদ/রকেট">নগদ / রকেট</option>
                  <option value="ব্যাংক">ব্যাংক ট্রান্সফার</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  পরিশোধ সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Payment Receipt (মানি রসিদ) */}
      {printableReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4 no-print">
              <h3 className="text-sm font-bold text-slate-800">মানি রসিদ প্রিভিউ ও প্রিন্ট</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  প্রিন্ট
                </button>
                <button onClick={() => setPrintableReceipt(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div className="border-2 border-slate-800 p-6 rounded-xl font-['Hind_Siliguri',sans-serif] bg-white text-slate-900">
              <div className="text-center border-b-2 border-slate-800 pb-2">
                <h3 className="text-base font-bold text-slate-950">{institution.nameBn}</h3>
                <p className="text-[11px] text-slate-600">{institution.village}, {institution.upazila}, {institution.district}</p>
                <span className="inline-block mt-1 bg-slate-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                  ফি আদায়ের মানি রসিদ
                </span>
              </div>

              <div className="mt-3 text-xs space-y-1.5">
                <div className="flex justify-between border-b border-dotted pb-1">
                  <span className="text-slate-500">রসিদ নং:</span>
                  <span className="font-mono font-bold">{printableReceipt.id}</span>
                </div>
                <div className="flex justify-between border-b border-dotted pb-1">
                  <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-slate-900">{printableReceipt.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-dotted pb-1">
                  <span className="text-slate-500">শ্রেণি ও রোল:</span>
                  <span>{printableReceipt.class} (রোল: {printableReceipt.roll})</span>
                </div>
                <div className="flex justify-between border-b border-dotted pb-1">
                  <span className="text-slate-500">মাসের নাম:</span>
                  <span>{printableReceipt.month}</span>
                </div>
                <div className="flex justify-between border-b border-dotted pb-1">
                  <span className="text-slate-500">ফি'র বিবরণ:</span>
                  <span className="font-semibold">{printableReceipt.feeType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pt-1 pb-1 text-sm font-bold bg-slate-50 px-2 rounded">
                  <span>মোট পরিশোধিত:</span>
                  <span className="text-emerald-800 font-mono">৳ {toBengaliNumber(printableReceipt.amount)}/-</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>পেমেন্ট মাধ্যম: {printableReceipt.paymentMethod}</span>
                  <span>তারিখ: {printableReceipt.paymentDate}</span>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center text-xs font-semibold pt-4">
                <div className="text-center">
                  <div className="w-24 border-t border-slate-400">শিক্ষার্থী / অভিভাবক</div>
                </div>
                <div className="text-center">
                  <div className="w-24 border-t border-slate-400">আদায়কারীর স্বাক্ষর</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
