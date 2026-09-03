import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  Phone, 
  Mail, 
  GraduationCap, 
  Award,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const StudentDirectory: React.FC = () => {
  const { students, lookupResult, setActiveView } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');

  const filtered = students.filter((s) => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || s.branchCode === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Enrolled Student Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Browse registered candidate profiles, contact info, and semester examination credentials.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
          Total Candidates: <b className="text-white">{students.length}</b>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, hall ticket..."
            className="w-full bg-[#12151e] border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'CSE', 'ECE', 'AI&DS', 'MECH'].map((b) => (
            <button
              key={b}
              onClick={() => setBranchFilter(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                branchFilter === b
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#12151e] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((st) => {
          const latestSem = st.semesters[0];
          return (
            <div
              key={st.id}
              className="bg-[#12151e] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={st.avatarUrl}
                    alt={st.fullName}
                    className="w-13 h-13 rounded-xl object-cover border-2 border-zinc-700 shrink-0 group-hover:border-blue-500 transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-amber-400">
                        {st.rollNumber}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {st.branchCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-0.5">{st.fullName}</h3>
                    <p className="text-[11px] text-zinc-400 font-medium">{st.branch}</p>
                  </div>
                </div>

                <div className="space-y-1 py-2.5 border-y border-zinc-800/80 text-[11px] text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Father Name:</span>
                    <span className="font-medium text-zinc-200">{st.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Academic Year:</span>
                    <span className="font-medium text-zinc-200">{st.batchYear} (Sem {st.currentSemester})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cumulative CGPA:</span>
                    <span className="font-black text-emerald-400 font-mono">
                      {st.overallCgpa > 0 ? st.overallCgpa.toFixed(2) : 'Awaited'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">
                  {latestSem ? `${latestSem.subjects.length} Subjects Graded` : 'Pending Exam'}
                </span>

                <button
                  onClick={() => {
                    lookupResult(st.rollNumber);
                    setActiveView('marksheet');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-bold flex items-center gap-1 border border-blue-500/30 transition-all"
                >
                  <span>View Marksheet</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
