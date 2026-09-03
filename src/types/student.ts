export interface Subject {
  code: string;
  name: string;
  credits: number;
  maxInternal: number;
  maxExternal: number;
  minPassMarks: number;
  type: 'Theory' | 'Practical' | 'Project' | 'Elective';
}

export interface SubjectResult {
  subjectCode: string;
  subjectName: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  gradePoint: number;
  letterGrade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F' | 'AB';
  status: 'PASS' | 'FAIL' | 'ABSENT';
}

export interface SemesterResult {
  id: string;
  studentId: string;
  semesterNumber: number;
  semesterName: string;
  examSession: string; // e.g. "Nov/Dec 2025"
  examType: 'Regular' | 'Supplementary';
  publishDate: string;
  isPublished: boolean;
  subjects: SubjectResult[];
  totalCredits: number;
  creditsSecured: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  sgpa: number;
  cgpa: number;
  resultStatus: 'FIRST CLASS WITH DISTINCTION' | 'FIRST CLASS' | 'SECOND CLASS' | 'PASS' | 'FAIL';
  memoNumber: string;
}

export interface Student {
  id: string;
  rollNumber: string; // e.g. "21A91A0501"
  registrationNumber: string;
  fullName: string;
  fatherName: string;
  motherName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  branch: 'Computer Science & Engineering' | 'Electronics & Communication' | 'Mechanical Engineering' | 'Artificial Intelligence & Data Science' | 'Information Technology' | 'Civil Engineering';
  branchCode: 'CSE' | 'ECE' | 'MECH' | 'AI&DS' | 'IT' | 'CIVIL';
  currentSemester: number;
  batchYear: string; // e.g. "2022-2026"
  section: string;
  email: string;
  phone: string;
  avatarUrl: string;
  collegeName: string;
  status: 'Active' | 'Graduated' | 'Detained';
  overallCgpa: number;
  semesters: SemesterResult[];
}

export interface SystemStats {
  totalStudents: number;
  totalResultsDeclared: number;
  overallPassRate: number;
  averageCgpa: number;
  highestCgpa: number;
}

export type RevalServiceType = 'revaluation' | 'recounting' | 'photocopy' | 'challenge';

export interface RevaluationSubjectItem {
  subjectCode: string;
  subjectName: string;
  serviceType: RevalServiceType;
  originalInternal: number;
  originalExternal: number;
  originalTotal: number;
  originalGrade: string;
  fee: number;
  reason?: string;
  status: 'Applied' | 'Under Review' | 'Evaluator Assigned' | 'Scored' | 'Marks Updated' | 'No Change';
  revisedExternal?: number;
  revisedTotal?: number;
  revisedGrade?: string;
  evaluatorRemarks?: string;
}

export interface RevaluationApplication {
  id: string; // e.g. "RV-2026-NSRIT-09841"
  rollNumber: string;
  studentName: string;
  branch: string;
  semesterNumber: number;
  semesterName: string;
  subjects: RevaluationSubjectItem[];
  totalFee: number;
  paymentStatus: 'PAID' | 'PENDING';
  paymentMode: 'Online UPI' | 'Net Banking' | 'Exam Cell Challan';
  transactionRef: string;
  appliedDate: string;
  expectedResultDate: string;
  receiptNumber: string;
}

export interface QuestionBreakdown {
  questionId: string; // e.g. "Part-A Q1(a)"
  unitName: string;
  maxMarks: number;
  awardedMarks: number;
  keyPointsCovered: string;
  evaluatorRemarks: string;
  canChallenge: boolean;
}

export interface InternalEvaluationBreakdown {
  mid1Objective: number; // out of 10
  mid1Descriptive: number; // out of 15
  mid1Total: number; // out of 25 (scaled to 30)
  mid2Objective: number;
  mid2Descriptive: number;
  mid2Total: number;
  internalMidCalculated: number; // Best 80% + Worst 20% = 24
  assignmentMarks: number; // out of 5
  attendanceMarks: number; // out of 5
  finalInternalMarks: number; // out of 30
}

export interface MarksDoubtTicket {
  id: string; // e.g. "DOUBT-9821"
  rollNumber: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  doubtCategory: 'External Evaluation' | 'Internal / Mid Calculation' | 'Totalling Discrepancy' | 'Step-Marking' | 'Answer Script Request';
  question: string;
  studentRemarks: string;
  status: 'Clarified' | 'Under Review' | 'Resolution Provided';
  createdAt: string;
  clarifiedAt?: string;
  evaluatorResponse: {
    officialRemarks: string;
    evaluatorName: string;
    designation: string;
    questionWiseBreakdown?: QuestionBreakdown[];
    internalBreakdown?: InternalEvaluationBreakdown;
    recommendedAction: 'Apply Revaluation (Eligible for Score Boost)' | 'Re-totalling only' | 'Evaluation is accurate according to JNTU-GV Key' | 'Meet Grievance Committee';
  };
}
