import { GradeType } from '../types';

export const toBengaliNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null || num === '') return '';
  const str = num.toString();
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, digit => bengaliDigits[parseInt(digit, 10)]);
};

export const toEnglishNumber = (str: string): string => {
  if (!str) return '';
  const bengaliDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return str.replace(/[০-৯]/g, d => bengaliDigits[d] || d);
};

export const getBengaliDayName = (dayIdx: number): string => {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  return days[dayIdx] || '';
};

export const getBengaliMonthName = (monthIdx: number): string => {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  return months[monthIdx] || '';
};

export const formatBengaliCurrentDate = (d = new Date()): { timeStr: string; dateStr: string } => {
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');

  const timeStr = `${toBengaliNumber(displayHours)}:${toBengaliNumber(minutes)}:${toBengaliNumber(seconds)} ${ampm}`;

  const dayName = getBengaliDayName(d.getDay());
  const dateNum = toBengaliNumber(d.getDate());
  const monthName = getBengaliMonthName(d.getMonth());
  const yearNum = toBengaliNumber(d.getFullYear());

  const dateStr = `আজ ${dayName}, ${dateNum} ${monthName}, ${yearNum} খ্রি.`;

  return { timeStr, dateStr };
};

export const calculateGrade = (
  total: number, 
  fullMarks = 100
): { grade: GradeType; gpa: number; remarks: string } => {
  const percentage = fullMarks > 0 ? (total / fullMarks) * 100 : total;
  if (percentage >= 80) return { grade: 'A+', gpa: 5.0, remarks: 'অতি উত্তম' };
  if (percentage >= 70) return { grade: 'A', gpa: 4.0, remarks: 'উত্তম' };
  if (percentage >= 60) return { grade: 'A-', gpa: 3.5, remarks: 'ভালো' };
  if (percentage >= 50) return { grade: 'B', gpa: 3.0, remarks: 'সন্তোষজনক' };
  if (percentage >= 40) return { grade: 'C', gpa: 2.0, remarks: 'চলতি মান' };
  if (percentage >= 33) return { grade: 'D', gpa: 1.0, remarks: 'সহায়তা প্রয়োজন' };
  return { grade: 'F', gpa: 0.0, remarks: 'অকৃতকার্য' };
};

export const getOrdinalBengali = (num: number): string => {
  const ordinals: { [key: number]: string } = {
    1: '১ম',
    2: '২য়',
    3: '৩য়',
    4: '৪র্থ',
    5: '৫ম',
    6: '৬ষ্ঠ',
    7: '৭ম',
    8: '৮ম',
    9: '৯ম',
    10: '১০ম',
  };
  return (ordinals[num] || `${toBengaliNumber(num)}তম`) + ' স্থান';
};
