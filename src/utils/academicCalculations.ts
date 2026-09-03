import { SubjectResult, SemesterResult } from '../types/student';

export function calculateGrade(total: number, isAbsent: boolean = false): {
  gradePoint: number;
  letterGrade: SubjectResult['letterGrade'];
  status: SubjectResult['status'];
} {
  if (isAbsent) {
    return { gradePoint: 0, letterGrade: 'AB', status: 'ABSENT' };
  }

  if (total >= 90) return { gradePoint: 10, letterGrade: 'O', status: 'PASS' };
  if (total >= 80) return { gradePoint: 9, letterGrade: 'A+', status: 'PASS' };
  if (total >= 70) return { gradePoint: 8, letterGrade: 'A', status: 'PASS' };
  if (total >= 60) return { gradePoint: 7, letterGrade: 'B+', status: 'PASS' };
  if (total >= 50) return { gradePoint: 6, letterGrade: 'B', status: 'PASS' };
  if (total >= 40) return { gradePoint: 5, letterGrade: 'C', status: 'PASS' };
  if (total >= 35) return { gradePoint: 4, letterGrade: 'P', status: 'PASS' };
  return { gradePoint: 0, letterGrade: 'F', status: 'FAIL' };
}

export function computeSemesterSummary(subjects: SubjectResult[]): {
  totalCredits: number;
  creditsSecured: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  sgpa: number;
  resultStatus: SemesterResult['resultStatus'];
} {
  let totalCredits = 0;
  let creditsSecured = 0;
  let weightedPoints = 0;
  let totalMarks = 0;
  let maxMarks = subjects.length * 100;
  let hasFail = false;

  for (const s of subjects) {
    totalCredits += s.credits;
    totalMarks += s.totalMarks;

    if (s.status === 'PASS') {
      creditsSecured += s.credits;
      weightedPoints += s.gradePoint * s.credits;
    } else {
      hasFail = true;
    }
  }

  const sgpa = totalCredits > 0 ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;
  const percentage = maxMarks > 0 ? Number(((totalMarks / maxMarks) * 100).toFixed(2)) : 0;

  let resultStatus: SemesterResult['resultStatus'] = 'FAIL';
  if (!hasFail) {
    if (sgpa >= 8.0) resultStatus = 'FIRST CLASS WITH DISTINCTION';
    else if (sgpa >= 6.75) resultStatus = 'FIRST CLASS';
    else if (sgpa >= 5.5) resultStatus = 'SECOND CLASS';
    else resultStatus = 'PASS';
  }

  return {
    totalCredits,
    creditsSecured,
    totalMarks,
    maxMarks,
    percentage,
    sgpa,
    resultStatus,
  };
}

export function formatWhatsAppResult(studentName: string, rollNo: string, semester: string, sgpa: number, resultStatus: string, percentage: number): string {
  const text = `🎓 *OFFICIAL RESULT NOTIFICATION* 🎓
━━━━━━━━━━━━━━━━━━━━━
*Student Name:* ${studentName}
*Roll Number:* ${rollNo}
*Semester:* ${semester}
*SGPA:* ${sgpa.toFixed(2)} / 10.00
*Percentage:* ${percentage}%
*Result:* ${resultStatus}
━━━━━━━━━━━━━━━━━━━━━
Verified by Examination Cell Portal.`;
  return encodeURIComponent(text);
}
