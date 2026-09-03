import React, { useState } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  Share2, 
  MessageCircle, 
  CheckCircle2, 
  Award, 
  QrCode, 
  ShieldCheck, 
  GraduationCap, 
  Calendar,
  Building,
  Check,
  Copy,
  Sparkles,
  HelpCircle,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';
import { formatWhatsAppResult } from '../../utils/academicCalculations';
import { NsritLogo } from '../common/NsritLogo';

export const MarksheetView: React.FC = () => {
  const { 
    selectedStudent, 
    selectedSemester, 
    setSelectedSemester, 
    setActiveView,
    openRevalForSubject,
    openClarificationForSubject,
  } = useStudents();
  
  const [copied, setCopied] = useState(false);

  if (!selectedStudent || !selectedSemester) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-zinc-400">No student result selected.</p>
        <button
          onClick={() => setActiveView('search')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
        >
          Return to Search
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `Student: ${selectedStudent.fullName} (${selectedStudent.rollNumber}) - SGPA: ${selectedSemester.sgpa} - Result: ${selectedSemester.resultStatus}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShareUrl = `https://wa.me/?text=${formatWhatsAppResult(
    selectedStudent.fullName,
    selectedStudent.rollNumber,
    selectedSemester.semesterName,
    selectedSemester.sgpa,
    selectedSemester.resultStatus,
    selectedSemester.percentage
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
      {/* Top Action Bar - Hidden in Print */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#12151e] border border-zinc-800 p-3.5 rounded-2xl shadow-md">
        <button
          onClick={() => setActiveView('search')}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        {/* Semester Switcher if student has multiple semesters */}
        {selectedStudent.semesters.length > 1 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-400 mr-1 hidden sm:inline">Semester:</span>
            {selectedStudent.semesters.map((sem) => (
              <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSemester.id === sem.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Sem {sem.semesterNumber}
              </button>
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy student summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            title="Share Result on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handlePrint}
            id="print-marksheet-button"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Marksheet (PDF)</span>
          </button>
        </div>
      </div>

      {/* Revaluation & Marks Doubt Clarification Prompt Banner (Print Hidden) */}
      <div className="print:hidden mb-6 bg-gradient-to-r from-amber-500/15 via-blue-600/10 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Autonomous Revaluation Window Open
              </span>
              <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">• Till Feb 04, 2026</span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
              Did you receive lower marks than expected? Ask our valuation committee why marks were deducted, view question-by-question scoring rubrics, or submit for official Revaluation (RV/RC).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
          <button
            onClick={() => setActiveView('clarification')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-zinc-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Less Marks? (Clarify)</span>
          </button>
          <button
            onClick={() => setActiveView('revaluation')}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Apply Revaluation</span>
          </button>
        </div>
      </div>

      {/* Official Marksheet Document Container */}
      <div 
        id="official-marksheet"
        className="bg-[#0f121a] print:bg-white text-zinc-100 print:text-zinc-900 border-2 border-zinc-700/80 print:border-zinc-400 rounded-2xl print:rounded-none p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle Watermark emblem */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.05] pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white print:text-black" />
        </div>

        {/* Institution Header */}
        <div className="border-b-2 border-zinc-700/80 print:border-zinc-800 pb-6 text-center relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
            <NsritLogo size="lg" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-blue-950 uppercase">
                {INSTITUTION_INFO.name}
              </h2>
              <p className="text-xs font-semibold text-amber-400 print:text-zinc-700">
                {INSTITUTION_INFO.autonomousBadge}
              </p>
              <p className="text-[11px] text-zinc-400 print:text-zinc-600">
                {INSTITUTION_INFO.affiliate} • {INSTITUTION_INFO.address}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 print:border-zinc-300 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <span className="font-bold text-blue-400 print:text-blue-900 uppercase tracking-wider">
              OFFICIAL GRADE CARD / MARKS MEMORANDUM
            </span>
            <span className="font-mono text-zinc-400 print:text-zinc-600">
              Memo No: <b className="text-zinc-200 print:text-black">{selectedSemester.memoNumber}</b>
            </span>
            <span className="text-zinc-400 print:text-zinc-600">
              Date of Issue: <b className="text-zinc-200 print:text-black">{selectedSemester.publishDate}</b>
            </span>
          </div>
        </div>

        {/* Candidate Bio-data Section */}
        <div className="my-6 p-4 sm:p-5 rounded-xl bg-[#151924] print:bg-zinc-50 border border-zinc-800 print:border-zinc-300 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
            <div>
              <span className="text-zinc-400 print:text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Hall Ticket / Roll No</span>
              <span className="text-sm font-black font-mono text-amber-400 print:text-blue-950">{selectedStudent.rollNumber}</span>
            </div>
            <div>
              <span className="text-zinc-400 print:text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Registration Number</span>
              <span className="font-semibold text-zinc-200 print:text-zinc-900 font-mono">{selectedStudent.registrationNumber}</span>
            </div>
            <div>
              <span className="text-zinc-400 print:text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Candidate Name</span>
              <span className="text-sm font-bold text-white print:text-zinc-900">{selectedStudent.fullName}</span>
            </div>
            <div>
              <span className="text-zinc-400 print:text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Father's Name</span>
              <span className="font-semibold text-zinc-200 print:text-zinc-900">{selectedStudent.fatherName}</span>
            </div>
            <div>
              <span className="text-zinc-400 print:text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Course & Department</span>
              <span className="font-semibold text-zinc-200 print:text-zinc-900">B.Tech - {selectedStudent.branch} ({selectedStudent.branchCode})</span>
            </div>
            <div>
              <span className="text-zinc-400 print:text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Semester & Exam Session</span>
              <span className="font-semibold text-zinc-200 print:text-zinc-900">{selectedSemester.semesterName} ({selectedSemester.examSession})</span>
            </div>
          </div>

          <div className="sm:col-span-1 flex flex-col items-center justify-center text-center">
            <img 
              src={selectedStudent.avatarUrl} 
              alt={selectedStudent.fullName}
              className="w-20 h-24 object-cover rounded-lg border-2 border-zinc-600 print:border-zinc-400 shadow-md mb-1"
            />
            <span className="text-[10px] font-mono text-zinc-400 print:text-zinc-600">PHOTO ID</span>
          </div>
        </div>

        {/* Subjects & Marks Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 print:border-zinc-400 mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#181d2a] print:bg-zinc-200 text-zinc-300 print:text-zinc-800 font-bold border-b border-zinc-800 print:border-zinc-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Sub Code</th>
                <th className="py-3 px-4">Subject Title</th>
                <th className="py-3 px-2 text-center">Int (30)</th>
                <th className="py-3 px-2 text-center">Ext (70)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-2 text-center">Grade Point</th>
                <th className="py-3 px-2 text-center">Grade</th>
                <th className="py-3 px-2 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Result</th>
                <th className="py-3 px-3 text-center print:hidden">Clarify / RV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 print:divide-zinc-300 text-zinc-200 print:text-zinc-900 font-medium">
              {selectedSemester.subjects.map((sub, idx) => (
                <tr 
                  key={sub.subjectCode} 
                  className={idx % 2 === 0 ? 'bg-[#10141e]/50 print:bg-white' : 'bg-[#131824]/50 print:bg-zinc-50'}
                >
                  <td className="py-3 px-3 font-mono font-bold text-amber-400 print:text-zinc-900">
                    {sub.subjectCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white print:text-black">
                    {sub.subjectName}
                  </td>
                  <td className="py-3 px-2 text-center font-mono">{sub.internalMarks}</td>
                  <td className="py-3 px-2 text-center font-mono">{sub.externalMarks}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-white print:text-black">
                    {sub.totalMarks}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-bold">{sub.gradePoint}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-blue-400 print:text-blue-900">
                    {sub.letterGrade}
                  </td>
                  <td className="py-3 px-2 text-center font-mono">{sub.credits}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      sub.status === 'PASS' 
                        ? 'bg-emerald-500/20 text-emerald-300 print:text-emerald-800 print:bg-emerald-50' 
                        : 'bg-red-500/20 text-red-300 print:text-red-800 print:bg-red-50'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center print:hidden">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openClarificationForSubject(sub.subjectCode)}
                        title="Why were marks less? View examiner rubric & questions"
                        className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-[10px] font-semibold text-zinc-300 border border-zinc-700 transition-colors"
                      >
                        Clarify
                      </button>
                      <button
                        type="button"
                        onClick={() => openRevalForSubject(sub.subjectCode)}
                        title="Apply Revaluation for this subject"
                        className="px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 text-[10px] font-bold border border-amber-500/30 transition-all"
                      >
                        RV
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Card / KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-[#151924] print:bg-zinc-100 border border-zinc-800 print:border-zinc-300 text-center mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-600 block">Total Credits</span>
            <span className="text-base sm:text-lg font-black font-mono text-zinc-100 print:text-black">{selectedSemester.totalCredits}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-600 block">Credits Secured</span>
            <span className="text-base sm:text-lg font-black font-mono text-emerald-400 print:text-emerald-700">{selectedSemester.creditsSecured}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-600 block">Total Marks</span>
            <span className="text-base sm:text-lg font-black font-mono text-zinc-100 print:text-black">
              {selectedSemester.totalMarks} / {selectedSemester.maxMarks} ({selectedSemester.percentage}%)
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 print:text-blue-900 block">SGPA</span>
            <span className="text-base sm:text-xl font-black font-mono text-blue-400 print:text-blue-900">{selectedSemester.sgpa.toFixed(2)}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 print:text-amber-800 block">Cumulative CGPA</span>
            <span className="text-base sm:text-xl font-black font-mono text-amber-400 print:text-amber-800">{selectedSemester.cgpa.toFixed(2)}</span>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 print:bg-zinc-200 border border-blue-800/40 print:border-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mb-8">
          <div>
            <span className="text-xs text-zinc-400 print:text-zinc-700">Final Semester Result Classification:</span>
            <div className="text-base sm:text-lg font-extrabold text-emerald-400 print:text-emerald-800 tracking-wide uppercase">
              {selectedSemester.resultStatus}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300 print:text-zinc-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Passed with all credits secured without backlog.</span>
          </div>
        </div>

        {/* Authentication Seal, QR Code & Signatures */}
        <div className="pt-6 border-t-2 border-zinc-800 print:border-zinc-400 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          {/* QR Code */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-zinc-400 flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-black" />
            </div>
            <div className="text-[10px] text-zinc-400 print:text-zinc-600">
              <span className="font-bold block text-zinc-200 print:text-black">Scan to Verify</span>
              <span>Authentic autonomous grade sheet digitally generated on secure examination database.</span>
            </div>
          </div>

          {/* College Stamp */}
          <div className="text-center">
            <div className="inline-block p-2 rounded-full border border-dashed border-amber-500/50 print:border-amber-800 text-amber-400 print:text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              ★ OFFICIAL EXAM CELL SEAL ★
            </div>
          </div>

          {/* Controller of Examinations Signature */}
          <div className="text-right">
            <div className="h-10 flex items-end justify-end mb-1">
              <span className="font-serif italic text-sm font-bold text-blue-400 print:text-blue-900 border-b border-zinc-500 print:border-zinc-700 pb-0.5">
                M.S.R. Murthy
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-200 print:text-black">{INSTITUTION_INFO.controllerOfExams}</p>
            <p className="text-[10px] text-zinc-400 print:text-zinc-600">Controller of Examinations</p>
          </div>
        </div>

        {/* Grading Scale Legend */}
        <div className="mt-8 pt-4 border-t border-zinc-800/80 print:border-zinc-300 text-[10px] text-zinc-400 print:text-zinc-600 leading-relaxed">
          <b>Grading Scale:</b> O (Outstanding: 90-100%, 10 pts) | A+ (Excellent: 80-89%, 9 pts) | A (Very Good: 70-79%, 8 pts) | B+ (Good: 60-69%, 7 pts) | B (Above Average: 50-59%, 6 pts) | C (Average: 40-49%, 5 pts) | P (Pass: 35-39%, 4 pts) | F (Fail: &lt;35%, 0 pts).
        </div>
      </div>
    </div>
  );
};
