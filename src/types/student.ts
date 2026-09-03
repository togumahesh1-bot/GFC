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
