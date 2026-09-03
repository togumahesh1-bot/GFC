import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  FileCheck, 
  AlertCircle, 
  BookOpen, 
  Calendar, 
  Award,
  ArrowRight,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';

export const ResultSearch: React.FC = () => {
  const { students, lookupResult, setSearchRollNumber } = useStudents();
  const [rollInput, setRollInput] = useState('');
  const [selectedExamSession, setSelectedExamSession] = useState('Nov/Dec 2025 Regular');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const clean = rollInput.trim();
    if (!clean) {
      setErrorMessage('Please enter your Hall Ticket / Roll Number');
      return;
    }

    setSearchRollNumber(clean);
    const result = lookupResult(clean);
    if (!result) {
      setErrorMessage(`No examination record found for Roll Number "${clean}". Please verify your hall ticket number.`);
    }
  };

  const handleQuickSelect = (roll: string) => {
    setRollInput(roll);
    setSearchRollNumber(roll);
    setErrorMessage(null);
    lookupResult(roll);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Banner / Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          Autonomous Examination Results System
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Check Student Examination Result
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Enter your official Hall Ticket / Roll Number to view and print your digitally verified marksheet and semester grade sheet.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="bg-[#12151e] border border-zinc-800/90 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Exam Session Dropdown */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Examination Session
              </label>
              <select
                value={selectedExamSession}
                onChange={(e) => setSelectedExamSession(e.target.value)}
                className="w-full bg-[#0a0c12] border border-zinc-700/80 rounded-xl px-3.5 py-3 text-sm text-zinc-200 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="Nov/Dec 2025 Regular">IV B.Tech I Sem (Nov/Dec 2025)</option>
                <option value="Nov/Dec 2025 Regular">III B.Tech I Sem (Nov/Dec 2025)</option>
                <option value="April/May 2025 Regular">III B.Tech II Sem (April/May 2025)</option>
                <option value="Supplementary">Supplementary Examinations (2025)</option>
              </select>
            </div>

            {/* Hall Ticket / Roll Number Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                Hall Ticket / Roll Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rollInput}
                  onChange={(e) => {
                    setRollInput(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 21A91A0501 or 21A91A0503"
                  className="w-full bg-[#0a0c12] border border-zinc-700/80 rounded-xl px-4 py-3 pl-11 text-base text-white font-mono tracking-wider placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase"
                />
                <Search className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Digitally signed and certified by Autonomous Examination Cell
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Get Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Demo Roll Numbers */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Quick Test: Click Any Sample Student Hall Ticket
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {students.slice(0, 6).map((st) => (
              <button
                key={st.id}
                onClick={() => handleQuickSelect(st.rollNumber)}
                className="text-left p-2.5 rounded-xl bg-[#090b10] border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all flex items-center gap-3 group"
              >
                <img
                  src={st.avatarUrl}
                  alt={st.fullName}
                  className="w-9 h-9 rounded-lg object-cover border border-zinc-700 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      {st.rollNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {st.branchCode}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium truncate">{st.fullName}</p>
                  <p className="text-[10px] text-zinc-400">CGPA: {st.overallCgpa} • {st.semesters[0]?.resultStatus.split(' ')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-xl bg-[#12151e]/60 border border-zinc-800/60 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Official Grade Sheet</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Subject-wise marks, Internal, External, Credits, and SGPA calculation.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#12151e]/60 border border-zinc-800/60 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Print & PDF Download</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Clean A4 marksheet print layout without web navigation clutter.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#12151e]/60 border border-zinc-800/60 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">QR Code Verification</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Tamper-evident digital signature and examination cell authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
