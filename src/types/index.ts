export type GradeType = 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';

export interface Student {
  id: string;
  roll: string;
  nameBn: string;
  nameEn: string;
  class: string;
  section: string;
  shift: 'সকাল' | 'দিবা';
  gender: 'ছেলে' | 'মেয়ে';
  fatherName: string;
  motherName: string;
  phone: string;
  birthDate: string;
  birthDateWords?: string;
  nidOrBirthReg: string;
  bloodGroup: string;
  address: string;
  village: string;
  postOffice: string;
  upazila: string;
  district: string;
  admissionDate: string;
  previousSchool?: string;
  status: 'সক্রিয়' | 'উত্তীর্ণ' | 'ছাড়পত্রপ্রাপ্ত';
  photoUrl?: string;
  monthlyFee: number;
  feeStatus: 'পরিশোধিত' | 'বকেয়া';
}

export interface Teacher {
  id: string;
  nameBn: string;
  nameEn: string;
  designation: string; // প্রধান শিক্ষক, সহকারী শিক্ষক, সিনিয়র শিক্ষক, প্রভাষক
  qualification: string; // এম.এ, বিএড / বি.এসসি
  subject: string;
  phone: string;
  email?: string;
  joinDate: string;
  bloodGroup: string;
  address: string;
  status: 'কর্মরত' | 'ছুটিতে';
  photoUrl?: string;
}

export interface RoutineItem {
  id: string;
  date: string;
  day: string; // রবিবার, সোমবার, ইত্যাদি
  subject: string;
  time: string; // ১০:০০ - ১২:০০
  shift: 'সকাল' | 'বিকাল';
  roomNo?: string;
}

export interface ExamSchedule {
  class: string;
  term: '১ম প্রান্তিক মূল্যায়ন' | '২য় প্রান্তিক মূল্যায়ন' | '৩য় প্রান্তিক মূল্যায়ন' | 'বার্ষিক মূল্যায়ন' | 'মডেল টেস্ট';
  academicYear: string;
  routines: RoutineItem[];
}

export interface SubjectMarks {
  subjectName: string;
  fullMarks?: number; // পূর্ণমান (defaults to 100)
  continuous: number; // ধারাবাহিক (formative - e.g. out of 30 or 50)
  summative: number;  // সামষ্টিক (summative - e.g. out of 70 or 50)
  practical?: number; // ব্যবহারিক
  total: number;      // প্রাপ্ত মোট নম্বর
  highestMarks?: number; // ক্লাসের সর্বোচ্চ নম্বর
  grade: GradeType;
  gpa: number;
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  roll: string;
  class: string;
  section: string;
  term: string;
  academicYear: string;
  attendanceDays: number;
  totalWorkingDays: number;
  subjectMarks: SubjectMarks[];
  grandTotal: number;
  totalFullMarks?: number;
  percentage?: number;
  overallGrade: GradeType;
  overallGpa: number;
  position: string;
  teacherRemarks?: string;
  passed?: boolean;
}

export interface CertificateData {
  certificateType: 'promotion' | 'tc' | 'testimonial' | 'bonafide';
  serialNo: string;
  date: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  birthDateWords: string;
  class: string;
  roll: string;
  academicYear: string;
  evaluationTerm: string;
  obtainedGrade: string;
  position: string;
  conduct: string; // উত্তম / প্রশংসনীয়
  reasonForLeaving?: string;
  nextClass?: string;
}

export interface InstitutionProfile {
  nameBn: string;
  nameEn: string;
  village: string;
  postOffice: string;
  upazila: string;
  district: string;
  established: string;
  emisNo: string;
  ipemisCode: string;
  eiin?: string;
  phone: string;
  email: string;
  website?: string;
  slogan?: string;
  logoUrl?: string;
  headmasterName: string;
  headmasterTitle: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  isEmergency: boolean;
  publishedBy: string;
}

export type NoticeItem = Notice;
export type InstitutionInfo = InstitutionProfile;

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  roll: string;
  month: string;
  amount: number;
  feeType: 'মাসিক বেতন' | 'ভর্তি ফি' | 'পরীক্ষা ফি' | 'কোচিং শিট ফি';
  paymentDate: string;
  paymentMethod: 'নগদ' | 'বিকাশ' | 'নগদ/রকেট' | 'ব্যাংক';
  status: 'পরিশোধিত' | 'বকেয়া';
}

export type ExamQuestionFormat = 'mcq' | 'cq' | 'short' | 'combined' | 'model_test' | 'sectioned';

export type PageLayoutType = 'two_column' | 'single_column' | 'compact' | 'with_answer';

export interface MCQQuestion {
  id: string;
  subject: string;
  chapter: string;
  topic?: string;
  question: string;
  options: [string, string, string, string]; // ক, খ, গ, ঘ
  correctOption: 0 | 1 | 2 | 3;
  explanation?: string;
  marks: number;
  type: 'mcq';
  boardInfo?: string;
  importance?: 'high' | 'very_high' | 'standard';
}

export interface CQSubQuestion {
  label: 'ক' | 'খ' | 'গ' | 'ঘ';
  question: string;
  marks: number;
}

export interface CQQuestion {
  id: string;
  subject: string;
  chapter: string;
  topic?: string;
  stimulus: string; // উদ্দীপক
  subQuestions: CQSubQuestion[];
  marks: number; // e.g. 10
  type: 'cq';
  boardInfo?: string;
  importance?: 'high' | 'very_high' | 'standard';
}

export interface ShortQuestion {
  id: string;
  subject: string;
  chapter: string;
  topic?: string;
  question: string;
  answer?: string; // উত্তর বা সমাধান
  marks: number;   // e.g. ১ বা ২
  type: 'short';
  boardInfo?: string;
  importance?: 'high' | 'very_high' | 'standard';
}

export type QuestionItem = MCQQuestion | CQQuestion | ShortQuestion;

export interface WatermarkConfig {
  enabled: boolean;
  type: 'text' | 'image';
  text: string;
  imageUrl?: string;
  opacity: number; // 0.05 - 0.3
}

export interface ExamPaperConfig {
  id: string;
  paperTitle?: string;
  coachingName: string;
  subTitle?: string;
  examTitle: string;
  subject: string;
  subjectCode: string;
  class: string;
  section?: string;
  duration: string;
  totalMarks: number;
  format: ExamQuestionFormat;
  pattern?: string;
  pageLayout?: PageLayoutType;
  paperLayoutMode?: 'landscape_booklet' | 'standard_portrait';
  instructions: string;
  watermark: WatermarkConfig;
  columns: 1 | 2;
  showAnswersInPrint: boolean;
  selectedQuestionIds: string[];
  customQuestions?: QuestionItem[];
  sectionKQuestions?: QuestionItem[];
  sectionKhQuestions?: QuestionItem[];
  sectionGQuestions?: QuestionItem[];
  date: string;
  createdAt?: string;
}
