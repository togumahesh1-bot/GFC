import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileSearch, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight, 
  Calculator, 
  ArrowRight,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { MarksDoubtTicket } from '../../types/student';

export const MarksDoubtClarification: React.FC = () => {
  const {
    currentUser,
    selectedStudent,
    selectedSemester,
    doubtTickets,
    submitDoubtTicket,
    selectedSubjectForClarification,
    setSelectedSubjectForClarification,
    openRevalForSubject,
    setActiveView,
  } = useStudents();

  const student = selectedStudent;
  const semester = selectedSemester || student?.semesters[0];

  // Form states
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    selectedSubjectForClarification || semester?.subjects[0]?.subjectCode || ''
  );
  const [doubtCategory, setDoubtCategory] = useState<MarksDoubtTicket['doubtCategory']>(
    'External Evaluation'
  );
  const [question, setQuestion] = useState<string>(
    'Why were marks deducted in my External Theory paper? I attempted all 5 questions completely with circuit diagrams.'
  );
  const [remarks, setRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active viewing ticket
  const [activeTicketId, setActiveTicketId] = useState<string>(doubtTickets[0]?.id || '');

  // Keep selected subject in sync
  useEffect(() => {
    if (selectedSubjectForClarification) {
      setSelectedSubjectCode(selectedSubjectForClarification);
    } else if (semester?.subjects && semester.subjects.length > 0 && !selectedSubjectCode) {
      setSelectedSubjectCode(semester.subjects[0].subjectCode);
    }
  }, [selectedSubjectForClarification, semester]);

  const currentSubject = semester?.subjects.find((s) => s.subjectCode === selectedSubjectCode);
  const activeTicket = doubtTickets.find((t) => t.id === activeTicketId) || doubtTickets[0];

  // Submit Doubt Query
  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !currentSubject) {
      alert('Please select a student and subject.');
      return;
    }

    if (!question.trim()) {
      alert('Please enter your question or doubt regarding the marks.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticket = submitDoubtTicket({
        rollNumber: student.rollNumber,
        studentName: student.fullName,
        subjectCode: currentSubject.subjectCode,
        subjectName: currentSubject.subjectName,
        doubtCategory,
        question: question.trim(),
        studentRemarks: remarks.trim() || 'Descriptive step-marking breakdown requested.',
      });

      setIsSubmitting(false);
      setActiveTicketId(ticket.id);
      setRemarks('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Zero-Doubt Marks Clarification Cell
              </span>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                • Autonomous Examination Grievance Redressal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
              "Why Did I Get Less Marks?" Clarification Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Ask specific questions about why you scored lower than expected. View your question-by-question scoring rubric, examiner remarks, and internal calculation breakdown before applying for revaluation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openRevalForSubject(selectedSubjectCode)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Apply for Revaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUESTION SUBMISSION FORM & TICKETS LIST */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ask Doubt Form */}
          <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ask Why You Scored Less
                </h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Instant Evaluator Audit
              </span>
            </div>

            <form onSubmit={handleSubmitQuery} className="space-y-4 text-xs">
              {/* Select Subject */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">
                  1. Select Subject with Low Marks:
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {semester?.subjects.map((sub) => (
                    <button
                      key={sub.subjectCode}
                      type="button"
                      onClick={() => setSelectedSubjectCode(sub.subjectCode)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedSubjectCode === sub.subjectCode
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-[#141724] border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold block">{sub.subjectCode}</span>
                        <span className="text-[11px] text-zinc-300 line-clamp-1">{sub.subjectName}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="font-mono font-bold text-amber-300 block">{sub.externalMarks}/70</span>
                        <span className="text-[10px] text-zinc-500">Grade: {sub.letterGrade}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Doubt Category */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">
                  2. What is your primary doubt?
                </label>
                <select
                  value={doubtCategory}
                  onChange={(e) => setDoubtCategory(e.target.value as MarksDoubtTicket['doubtCategory'])}
                  className="w-full px-3 py-2 bg-[#131724] border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="External Evaluation">External Evaluation (Why low descriptive score?)</option>
                  <option value="Internal / Mid Calculation">Internal Marks (How was Mid/Assignment computed?)</option>
                  <option value="Step Marking">Step Marking (Where were marks deducted?)</option>
                  <option value="Totalling / Missing Question">Totalling / Missing Question Verification</option>
                  <option value="Scheme of Valuation">Scheme of Valuation & Key Discrepancy</option>
                </select>
              </div>

              {/* Specific Question */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">
                  3. Enter your specific question:
                </label>
                <textarea
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Why did I get only 52? I solved Question 3 and 4 with full derivation..."
                  className="w-full px-3 py-2 bg-[#131724] border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Additional Context */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">
                  4. Additional remarks / reference to textbook or syllabus (Optional):
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Prepared from Tanenbaum textbook, all 5 points matched"
                  className="w-full px-3 py-2 bg-[#131724] border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Auditing Answer Script with Examiner...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query & Retrieve Marks Breakdown</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Previous Clarifications List */}
          <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Your Clarification Tickets</span>
              <span className="text-zinc-500">{doubtTickets.length} Recorded</span>
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {doubtTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    activeTicket?.id === t.id
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-[#141724] border-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-400 text-xs">{t.subjectCode}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-zinc-200 line-clamp-1">{t.question}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500">
                    <span>{t.createdAt}</span>
                    <span className="text-blue-400 font-bold">View Breakdown →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ZERO-DOUBT EVALUATION BREAKDOWN & REMARKS */}
        <div className="lg:col-span-7 space-y-6">
          {activeTicket ? (
            <>
              {/* Evaluator Verdict Card */}
              <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-6 relative shadow-xl overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {activeTicket.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {activeTicket.status} by Chief Examiner
                      </span>
                    </div>
                    <h2 className="text-base font-black text-white mt-1 uppercase">
                      {activeTicket.subjectCode}: {activeTicket.subjectName}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-zinc-500 text-[10px] block">Query Category</span>
                    <span className="font-semibold text-zinc-300 text-xs">{activeTicket.doubtCategory}</span>
                  </div>
                </div>

                {/* Student's original query */}
                <div className="my-4 p-3 bg-[#131724] rounded-xl border border-zinc-800/80 text-xs">
                  <span className="text-zinc-400 font-bold block mb-1">Your Question:</span>
                  <p className="text-zinc-200 italic leading-relaxed">"{activeTicket.question}"</p>
                </div>

                {/* Official remarks from evaluator */}
                {activeTicket.evaluatorResponse && (
                  <div className="p-4 bg-gradient-to-br from-blue-950/40 via-zinc-900 to-[#0e111a] border border-blue-800/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        <div>
                          <span className="font-bold text-white text-xs block">
                            {activeTicket.evaluatorResponse.evaluatorName}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {activeTicket.evaluatorResponse.designation}
                          </span>
                        </div>
                      </div>

                      {activeTicket.evaluatorResponse.recommendedAction && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          activeTicket.evaluatorResponse.recommendedAction.includes('Revaluation')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {activeTicket.evaluatorResponse.recommendedAction}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-blue-100 leading-relaxed pt-1">
                      {activeTicket.evaluatorResponse.officialRemarks}
                    </p>

                    {/* If eligible for revaluation, quick CTA button */}
                    {activeTicket.evaluatorResponse.recommendedAction?.includes('Revaluation') && (
                      <div className="pt-2 flex items-center justify-between border-t border-blue-900/40">
                        <span className="text-[11px] text-amber-300 font-medium">
                          Evaluator confirmed score boost potential (+4 to +8 marks)!
                        </span>
                        <button
                          type="button"
                          onClick={() => openRevalForSubject(activeTicket.subjectCode)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                        >
                          <span>Apply Revaluation Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Question-Wise Scoring Rubric */}
              {activeTicket.evaluatorResponse?.questionWiseBreakdown && (
                <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <FileSearch className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Question-by-Question Marks Rubric & Deduction Audit
                      </h3>
                    </div>
                    <span className="text-xs text-zinc-400">
                      External Max Marks: 70
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeTicket.evaluatorResponse.questionWiseBreakdown.map((q, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-xl border transition-all text-xs ${
                          q.canChallenge 
                            ? 'bg-amber-500/5 border-amber-500/30' 
                            : 'bg-[#141724] border-zinc-800'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div>
                            <span className="font-bold text-white mr-2">{q.questionId}</span>
                            <span className="text-zinc-400 text-[11px]">({q.unitName})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-300 text-sm">
                              {q.awardedMarks} / {q.maxMarks} Marks
                            </span>
                            {q.canChallenge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                Revaluation Gain Likely
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-[11px] text-zinc-300 space-y-1">
                          <div>
                            <span className="text-zinc-500 mr-1">Expected Key Points:</span>
                            <span>{q.keyPointsCovered}</span>
                          </div>
                          <div>
                            <span className="text-amber-400/90 font-medium mr-1">Examiner Note:</span>
                            <span className="text-zinc-300">{q.evaluatorRemarks}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Marks Transparency Calculator */}
              {activeTicket.evaluatorResponse?.internalBreakdown && (
                <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Internal Marks Calculation Transparency Formula
                      </h3>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      Autonomous R20 Regulation
                    </span>
                  </div>

                  {/* Formula Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                    <div className="p-3 bg-[#141724] rounded-xl border border-zinc-800 text-center">
                      <span className="text-zinc-500 text-[10px] block">Mid-1 (Max 30)</span>
                      <span className="font-mono font-bold text-white text-base">
                        {activeTicket.evaluatorResponse.internalBreakdown.mid1Total}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        Obj: {activeTicket.evaluatorResponse.internalBreakdown.mid1Objective} | Desc: {activeTicket.evaluatorResponse.internalBreakdown.mid1Descriptive}
                      </span>
                    </div>

                    <div className="p-3 bg-[#141724] rounded-xl border border-zinc-800 text-center">
                      <span className="text-zinc-500 text-[10px] block">Mid-2 (Max 30)</span>
                      <span className="font-mono font-bold text-white text-base">
                        {activeTicket.evaluatorResponse.internalBreakdown.mid2Total}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        Obj: {activeTicket.evaluatorResponse.internalBreakdown.mid2Objective} | Desc: {activeTicket.evaluatorResponse.internalBreakdown.mid2Descriptive}
                      </span>
                    </div>

                    <div className="p-3 bg-[#141724] rounded-xl border border-zinc-800 text-center">
                      <span className="text-zinc-500 text-[10px] block">Weighted Mid (80/20)</span>
                      <span className="font-mono font-bold text-blue-400 text-base">
                        {activeTicket.evaluatorResponse.internalBreakdown.internalMidCalculated}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        0.8x Best + 0.2x Second
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-center">
                      <span className="text-emerald-400 text-[10px] block font-bold">Final Awarded Internal</span>
                      <span className="font-mono font-black text-emerald-300 text-lg">
                        {activeTicket.evaluatorResponse.internalBreakdown.finalInternalMarks} / 30
                      </span>
                      <span className="text-[10px] text-emerald-400 block">
                        Incl. Assignment & Att.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-900/70 rounded-xl text-zinc-400 text-[11px] leading-relaxed">
                    <b className="text-zinc-200">How it was calculated:</b> Assignment: {activeTicket.evaluatorResponse.internalBreakdown.assignmentMarks}/5, Attendance: {activeTicket.evaluatorResponse.internalBreakdown.attendanceMarks}/5. According to autonomous academic guidelines, the combined internal evaluation is finalized by the Department Academic Committee.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
              <HelpCircle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Select a Ticket or Submit a Query</h3>
              <p className="text-xs mt-1">
                Choose a subject on the left to view the detailed evaluator breakdown and answer script rubric.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
