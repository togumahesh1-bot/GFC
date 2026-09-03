import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  IndianRupee, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  Printer, 
  RotateCcw, 
  Search, 
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { RevaluationSubjectItem, RevalServiceType } from '../../types/student';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';

export const RevaluationPortal: React.FC = () => {
  const { 
    currentUser, 
    selectedStudent, 
    selectedSemester, 
    revalPolicy, 
    revalApplications, 
    submitRevaluation, 
    setActiveView,
    selectedSubjectForReval,
    setSelectedSubjectForReval,
    openClarificationForSubject
  } = useStudents();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'apply' | 'track' | 'guidelines'>('apply');

  // Application form state
  const targetStudent = selectedStudent;
  const targetSemester = selectedSemester || targetStudent?.semesters[0];

  // Subject selections
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [code: string]: {
      selected: boolean;
      serviceType: RevalServiceType;
      reason: string;
    };
  }>({});

  const [paymentMode, setPaymentMode] = useState<'Online UPI' | 'Net Banking' | 'Exam Cell Challan'>('Online UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<any | null>(null);

  // Initialize subjects from semester
  useEffect(() => {
    if (targetSemester?.subjects) {
      const initial: typeof selectedSubjects = {};
      targetSemester.subjects.forEach((sub) => {
        initial[sub.subjectCode] = {
          selected: selectedSubjectForReval === sub.subjectCode,
          serviceType: 'revaluation',
          reason: selectedSubjectForReval === sub.subjectCode 
            ? 'Expected higher external theory score. Requesting independent re-evaluation.' 
            : '',
        };
      });
      setSelectedSubjects(initial);
    }
  }, [targetSemester, selectedSubjectForReval]);

  // Handle subject toggle
  const toggleSubject = (code: string) => {
    setSelectedSubjects((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        selected: !prev[code]?.selected,
      },
    }));
  };

  // Handle service type change
  const handleServiceChange = (code: string, type: RevalServiceType) => {
    setSelectedSubjects((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        serviceType: type,
      },
    }));
  };

  // Handle reason change
  const handleReasonChange = (code: string, reason: string) => {
    setSelectedSubjects((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        reason,
      },
    }));
  };

  // Calculate fees
  const selectedItems = (Object.entries(selectedSubjects) as [string, { selected: boolean; serviceType: RevalServiceType; reason: string }][])
    .filter(([_, val]) => val?.selected)
    .map(([code, val]) => {
      const subResult = targetSemester?.subjects.find((s) => s.subjectCode === code);
      const fee = revalPolicy.fees[val.serviceType];
      return {
        subjectCode: code,
        subjectName: subResult?.subjectName || code,
        serviceType: val.serviceType,
        originalInternal: subResult?.internalMarks || 0,
        originalExternal: subResult?.externalMarks || 0,
        originalTotal: subResult?.totalMarks || 0,
        originalGrade: subResult?.letterGrade || 'P',
        fee,
        reason: val.reason || 'Verification requested.',
        status: 'Applied' as const,
      };
    });

  const subtotal = selectedItems.reduce((acc, curr) => acc + curr.fee, 0);
  const isLate = false; // Currently within normal window
  const totalFee = subtotal + (isLate ? revalPolicy.lateFee : 0);

  // Submit Application
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Please select at least one subject for Revaluation or Recounting.');
      return;
    }

    if (!targetStudent || !targetSemester) {
      alert('Student or semester record is not selected.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const app = submitRevaluation({
        rollNumber: targetStudent.rollNumber,
        studentName: targetStudent.fullName,
        branch: targetStudent.branch,
        semesterNumber: targetSemester.semesterNumber,
        semesterName: targetSemester.semesterName,
        subjects: selectedItems,
        totalFee,
        paymentStatus: 'PAID',
        paymentMode,
        transactionRef: `UPI/NSRIT/${new Date().getFullYear()}/${Math.floor(10000000 + Math.random() * 90000000)}`,
      });

      setIsSubmitting(false);
      setSubmittedReceipt(app);
      setSelectedSubjectForReval(null);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header & Revaluation Status Banner */}
      <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PORTAL ACTIVE: Nov/Dec 2025 Examinations
              </span>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                • Autonomous R20 / R22 Guidelines
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
              Revaluation, Recounting & Script Challenge
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Apply for answer script re-evaluation, verification of totalling, or request scanned evaluated answer copies. Verified directly by autonomous examination cell examiners.
            </p>
          </div>

          {/* Quick Schedule Pill Card */}
          <div className="bg-[#141724] border border-zinc-700/80 rounded-xl p-3 text-xs flex flex-col gap-1.5 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Last Date without Fine:
              </span>
              <span className="font-bold text-amber-300 font-mono">
                {revalPolicy.lastDateWithoutFine}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                With Late Fee (₹500):
              </span>
              <span className="font-semibold text-zinc-200 font-mono">
                {revalPolicy.lastDateWithFine}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-zinc-800">
              <span className="text-zinc-400">Results Expected:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {revalPolicy.expectedResultDate}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800/80">
          <button
            onClick={() => {
              setActiveTab('apply');
              setSubmittedReceipt(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'apply'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Track Application Status</span>
            {revalApplications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-zinc-900 font-bold">
                {revalApplications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'guidelines'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Rules & Fee Structure</span>
          </button>

          {/* Shortcut to Marks Clarification */}
          <button
            onClick={() => setActiveView('clarification')}
            className="ml-auto px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Have doubts about marks?</span>
            <span className="font-bold underline">Ask Marks Clarification</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: APPLICATION FORM */}
      {activeTab === 'apply' && (
        <>
          {submittedReceipt ? (
            /* SUCCESSFUL RECEIPT VIEW */
            <div className="bg-[#0e111a] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-fadeIn">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Payment Verified • Application Dispatched
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">
                  Revaluation Application Submitted Successfully!
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Your request has been registered with the NSRIT Autonomous Examination Strong Room.
                </p>

                {/* Receipt Card */}
                <div className="mt-6 bg-[#131724] border border-zinc-700/80 rounded-xl p-5 text-left text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800 gap-2">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Application Token ID</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">{submittedReceipt.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 block text-[10px] uppercase">Receipt No</span>
                      <span className="font-mono font-bold text-white text-xs">{submittedReceipt.receiptNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Candidate</span>
                      <span className="font-bold text-white">{submittedReceipt.studentName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Hall Ticket No</span>
                      <span className="font-mono font-bold text-amber-300">{submittedReceipt.rollNumber}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Total Paid</span>
                      <span className="font-bold text-emerald-400 text-sm">₹{submittedReceipt.totalFee}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Payment Mode</span>
                      <span className="font-medium text-zinc-300">{submittedReceipt.paymentMode}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800">
                    <span className="text-zinc-400 font-bold block mb-2">Applied Subjects:</span>
                    <div className="space-y-1.5">
                      {submittedReceipt.subjects.map((sub: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-[#191e2e] p-2 rounded-lg border border-zinc-800">
                          <div>
                            <span className="font-bold text-white mr-2">{sub.subjectCode}</span>
                            <span className="text-zinc-300">{sub.subjectName}</span>
                            <span className="text-[10px] text-amber-400 ml-2 uppercase font-semibold">({sub.serviceType})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-zinc-400 text-[10px] block">Original: {sub.originalExternal}/70</span>
                            <span className="font-bold text-white">₹{sub.fee}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-lg text-blue-300 text-[11px] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>
                      Answer scripts are being retrieved by the Chief Evaluator. Final results will be notified before <b>{submittedReceipt.expectedResultDate}</b>.
                    </span>
                  </div>
                </div>

                {/* Receipt Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Challan Receipt</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('track')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>View Tracking Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* APPLICATION FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Candidate Verification */}
              <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Student & Examination Session Details
                    </h2>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    Autonomous Exam Cell
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-[#131724] rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Candidate Name</span>
                    <span className="font-bold text-white text-sm">{targetStudent?.fullName || 'Candidate'}</span>
                  </div>
                  <div className="p-3 bg-[#131724] rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Roll / Hall Ticket No</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{targetStudent?.rollNumber}</span>
                  </div>
                  <div className="p-3 bg-[#131724] rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Branch / Program</span>
                    <span className="font-semibold text-zinc-200">{targetStudent?.branch}</span>
                  </div>
                  <div className="p-3 bg-[#131724] rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Semester</span>
                    <span className="font-semibold text-emerald-400">{targetSemester?.semesterName}</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Select Subjects for Revaluation */}
              <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-zinc-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Select Subjects for Revaluation or Recounting
                      </h2>
                      <p className="text-[11px] text-zinc-400">
                        Checkmark the subject(s) where you believe your marks were lower than expected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">Selected:</span>
                    <span className="font-bold text-amber-400 font-mono text-sm">
                      {selectedItems.length} Subject(s)
                    </span>
                  </div>
                </div>

                {/* Subjects Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-[#131724]/60">
                        <th className="py-2.5 px-3">Select</th>
                        <th className="py-2.5 px-3">Subject Code & Name</th>
                        <th className="py-2.5 px-3 text-center">Internal</th>
                        <th className="py-2.5 px-3 text-center">External</th>
                        <th className="py-2.5 px-3 text-center">Total</th>
                        <th className="py-2.5 px-3 text-center">Grade</th>
                        <th className="py-2.5 px-3">Service Choice</th>
                        <th className="py-2.5 px-3 text-right">Fee</th>
                        <th className="py-2.5 px-3 text-center">Clarification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {targetSemester?.subjects.map((sub) => {
                        const isSelected = !!selectedSubjects[sub.subjectCode]?.selected;
                        const serviceType = selectedSubjects[sub.subjectCode]?.serviceType || 'revaluation';
                        const currentFee = revalPolicy.fees[serviceType];

                        return (
                          <React.Fragment key={sub.subjectCode}>
                            <tr className={`hover:bg-[#141824]/50 transition-colors ${
                              isSelected ? 'bg-amber-500/5' : ''
                            }`}>
                              <td className="py-3 px-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSubject(sub.subjectCode)}
                                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-white block">
                                  {sub.subjectCode}
                                </span>
                                <span className="text-zinc-300 text-[11px]">
                                  {sub.subjectName}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-zinc-400">
                                {sub.internalMarks}/30
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">
                                {sub.externalMarks}/70
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-white">
                                {sub.totalMarks}/100
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  sub.letterGrade === 'O' ? 'bg-emerald-500/20 text-emerald-300' :
                                  sub.letterGrade === 'A+' ? 'bg-blue-500/20 text-blue-300' :
                                  sub.letterGrade === 'A' ? 'bg-amber-500/20 text-amber-300' :
                                  sub.letterGrade === 'F' ? 'bg-red-500/20 text-red-300' :
                                  'bg-zinc-800 text-zinc-300'
                                }`}>
                                  {sub.letterGrade}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  disabled={!isSelected}
                                  value={serviceType}
                                  onChange={(e) => handleServiceChange(sub.subjectCode, e.target.value as RevalServiceType)}
                                  className="px-2.5 py-1.5 bg-[#171b29] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-40"
                                >
                                  <option value="revaluation">Revaluation (₹1,000)</option>
                                  <option value="recounting">Recounting (₹200)</option>
                                  <option value="photocopy">Answer Script Copy (₹1,500)</option>
                                  <option value="challenge">Challenge Valuation (₹2,500)</option>
                                </select>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                                {isSelected ? `₹${currentFee}` : '-'}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => openClarificationForSubject(sub.subjectCode)}
                                  title="Why did I get less marks? Check question-wise breakdown"
                                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                                >
                                  Check Rubric
                                </button>
                              </td>
                            </tr>

                            {/* Additional row for reason if selected */}
                            {isSelected && (
                              <tr className="bg-amber-500/5">
                                <td colSpan={9} className="px-3 pb-3 pt-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                                      Specific doubt / reason:
                                    </span>
                                    <input
                                      type="text"
                                      value={selectedSubjects[sub.subjectCode]?.reason || ''}
                                      onChange={(e) => handleReasonChange(sub.subjectCode, e.target.value)}
                                      placeholder="e.g. Expected 15+ marks in Part-B Question 4; derivation was fully complete"
                                      className="w-full px-3 py-1.5 bg-[#111420] border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 3: Payment & Submission */}
              <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Payment Calculation & Online Challan Dispatch
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Mode Selection */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-zinc-300 block">
                      Select Payment Mode:
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(['Online UPI', 'Net Banking', 'Exam Cell Challan'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPaymentMode(mode)}
                          className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                            paymentMode === mode
                              ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                              : 'bg-[#141724] border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-zinc-400 text-xs">
                      <p className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Autonomous Exam Cell Guarantee:
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        If marks improve by ≥15% or your grade changes from Fail to Pass, your memo will be automatically updated and 50% Challenge fee refunded to source account.
                      </p>
                    </div>
                  </div>

                  {/* Fee Summary Card */}
                  <div className="bg-[#131724] border border-zinc-700/80 rounded-xl p-4 text-xs space-y-2.5">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Selected Subjects Fee:</span>
                      <span className="font-mono text-white">₹{subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Late Fee (Autonomous Window):</span>
                      <span className="font-mono text-emerald-400">₹0 (Within Regular Schedule)</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Gateway & Verification Charges:</span>
                      <span className="font-mono text-emerald-400">₹0</span>
                    </div>

                    <div className="pt-2 border-t border-zinc-700 flex items-center justify-between text-sm">
                      <span className="font-bold text-white">Total Amount Payable:</span>
                      <span className="font-mono font-black text-amber-400 text-base">₹{totalFee}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || selectedItems.length === 0}
                      className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                          <span>Generating Official Challan...</span>
                        </>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4" />
                          <span>Pay ₹{totalFee} & Submit Revaluation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {/* SUB-VIEW 2: TRACK REVALUATION APPLICATIONS */}
      {activeTab === 'track' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wide">
              Active Revaluation Applications & Progress
            </h2>
            <span className="text-xs text-zinc-400">
              Auto-syncs with Strong Room Examiners
            </span>
          </div>

          {revalApplications.length === 0 ? (
            <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Revaluation Applications Found</h3>
              <p className="text-xs mt-1">
                You haven't submitted any revaluation or recounting requests for this examination cycle.
              </p>
              <button
                onClick={() => setActiveTab('apply')}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold"
              >
                Apply for Revaluation Now
              </button>
            </div>
          ) : (
            revalApplications.map((app) => (
              <div key={app.id} className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-400 text-sm">
                        {app.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {app.semesterName}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Candidate: <b className="text-white">{app.studentName}</b> ({app.rollNumber}) • Applied on {app.appliedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">
                      Paid: <b className="text-emerald-400 font-mono">₹{app.totalFee}</b> ({app.paymentMode})
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      title="Print Challan"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress pipeline */}
                <div className="py-5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                    Valuation Progress Pipeline:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span className="font-bold block text-[11px]">1. Dispatched</span>
                      <span className="text-[9px] text-zinc-400">Challan Verified</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span className="font-bold block text-[11px]">2. Script Retrieved</span>
                      <span className="text-[9px] text-zinc-400">From Strong Room</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <span className="font-bold block text-[11px]">3. Examiner Assigned</span>
                      <span className="text-[9px] text-zinc-400">External Valuation</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <span className="font-bold block text-[11px]">4. Moderation Board</span>
                      <span className="text-[9px]">15% Rule Check</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                      <Sparkles className="w-4 h-4 mx-auto mb-1" />
                      <span className="font-bold block text-[11px]">5. Memo Released</span>
                      <span className="text-[9px]">By {app.expectedResultDate}</span>
                    </div>
                  </div>
                </div>

                {/* Subject Wise Review Details */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Subject Review Status & Marks Comparison:
                  </span>
                  {app.subjects.map((sub, idx) => (
                    <div key={idx} className="bg-[#141724] border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-white text-sm mr-2">{sub.subjectCode}</span>
                          <span className="text-zinc-300">{sub.subjectName}</span>
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {sub.serviceType}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {sub.status}
                        </span>
                      </div>

                      {/* Marks comparison card */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div className="p-2 bg-[#0c0f18] rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 block">Original External</span>
                          <span className="font-mono font-bold text-zinc-300">{sub.originalExternal}/70</span>
                          <span className="text-[10px] text-zinc-500 ml-1">Grade: {sub.originalGrade}</span>
                        </div>
                        <div className="p-2 bg-[#0c0f18] rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 block">Revised External</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {sub.revisedExternal ? `${sub.revisedExternal}/70` : 'Pending Board Signoff'}
                          </span>
                          {sub.revisedGrade && (
                            <span className="text-[10px] text-emerald-400 font-bold ml-1">Grade: {sub.revisedGrade}</span>
                          )}
                        </div>
                        <div className="p-2 bg-[#0c0f18] rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 block">Marks Difference</span>
                          <span className={`font-mono font-bold ${
                            sub.revisedExternal && sub.revisedExternal > sub.originalExternal 
                              ? 'text-emerald-400' 
                              : 'text-zinc-400'
                          }`}>
                            {sub.revisedExternal 
                              ? `+${sub.revisedExternal - sub.originalExternal} Marks (${Math.round(((sub.revisedExternal - sub.originalExternal)/70)*100)}% Boost)` 
                              : 'Calculating'}
                          </span>
                        </div>
                        <div className="p-2 bg-[#0c0f18] rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 block">Action</span>
                          <button
                            type="button"
                            onClick={() => openClarificationForSubject(sub.subjectCode)}
                            className="text-amber-400 hover:underline font-bold text-[11px]"
                          >
                            View Evaluator Notes
                          </button>
                        </div>
                      </div>

                      {sub.evaluatorRemarks && (
                        <div className="mt-2 p-2.5 bg-blue-950/30 border border-blue-800/40 rounded-lg text-[11px] text-blue-200">
                          <b className="text-blue-400 mr-1">Evaluator Feedback:</b>
                          {sub.evaluatorRemarks}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-VIEW 3: GUIDELINES & POLICY */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Autonomous Revaluation Guidelines
            </h3>

            <div className="space-y-4 text-xs text-zinc-300">
              {revalPolicy.guidelines.map((guide, idx) => (
                <div key={idx} className="p-3.5 bg-[#141724] rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-white text-sm mb-1 text-amber-300">
                    {guide.title}
                  </h4>
                  <p className="leading-relaxed text-zinc-400">
                    {guide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Fee Table */}
            <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                Autonomous Examination Fee Structure
              </h3>

              <div className="divide-y divide-zinc-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Recounting (RC)</span>
                    <span className="text-[11px] text-zinc-400">Checking arithmetic totalling of marks & unvalued answers</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">₹200 / Subject</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Revaluation (RV)</span>
                    <span className="text-[11px] text-zinc-400">Complete blind re-evaluation by external examiner</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm">₹1,000 / Subject</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Answer Script Photocopy</span>
                    <span className="text-[11px] text-zinc-400">High-resolution scanned PDF with examiner marks & rubric</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">₹1,500 / Subject</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Challenge Valuation (CV)</span>
                    <span className="text-[11px] text-zinc-400">Committee of 3 Senior Deans & Evaluators (50% refundable on 15% gain)</span>
                  </div>
                  <span className="font-mono font-bold text-blue-400 text-sm">₹2,500 / Subject</span>
                </div>
              </div>
            </div>

            {/* Helpline */}
            <div className="bg-gradient-to-br from-amber-500/10 via-zinc-900 to-[#0e111a] border border-amber-500/30 rounded-2xl p-5 text-xs text-zinc-300">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                Examination Cell Grievance Contact
              </h4>
              <p className="text-zinc-400 leading-relaxed mb-3">
                If you have urgent questions regarding hall ticket numbers, payment failures, or urgent revaluation memos for campus placements:
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <a 
                  href={`tel:${INSTITUTION_INFO.phone}`} 
                  className="text-amber-300 hover:underline"
                >
                  Phone: {INSTITUTION_INFO.phone}
                </a>
                <a 
                  href={`https://wa.me/${INSTITUTION_INFO.whatsapp}?text=Hello%20Exam%20Cell%2C%20Revaluation%20Enquiry`}
                  target="_blank"
                  rel="noreferrer" 
                  className="text-emerald-400 hover:underline"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
