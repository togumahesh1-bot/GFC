import React from 'react';
import { 
  Award, 
  Trophy, 
  TrendingUp, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  BarChart2,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { useStudents } from '../../context/StudentContext';

export const AnalyticsView: React.FC = () => {
  const { students, lookupResult, setActiveView } = useStudents();

  // Sort students by CGPA for leaderboard
  const toppers = [...students].sort((a, b) => b.overallCgpa - a.overallCgpa);

  // Department Pass rates & student count
  const branchStats = [
    { name: 'CSE', students: 3, passRate: 100, avgCgpa: 9.24, color: '#3b82f6' },
    { name: 'AI&DS', students: 1, passRate: 100, avgCgpa: 9.48, color: '#8b5cf6' },
    { name: 'ECE', students: 1, passRate: 100, avgCgpa: 8.42, color: '#10b981' },
    { name: 'MECH', students: 1, passRate: 100, avgCgpa: 7.65, color: '#f59e0b' },
  ];

  // Grade Distribution
  const gradeDistribution = [
    { grade: 'O (90%+)', count: 21, color: '#10b981' },
    { grade: 'A+ (80-89%)', count: 12, color: '#3b82f6' },
    { grade: 'A (70-79%)', count: 6, color: '#6366f1' },
    { grade: 'B+ (60-69%)', count: 3, color: '#f59e0b' },
    { grade: 'B (50-59%)', count: 1, color: '#ec4899' },
    { grade: 'F (Backlog)', count: 0, color: '#ef4444' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          Autonomous Institute Academic Rankings
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Examination Analytics & Gold Medalists
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg mx-auto">
          Comprehensive academic performance, branch-wise distinction rates, and university rank holders.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
        {/* Rank 2 */}
        {toppers[1] && (
          <div className="bg-[#12151e] border border-zinc-700/60 rounded-2xl p-5 text-center order-2 md:order-1 relative overflow-hidden shadow-lg">
            <div className="w-8 h-8 rounded-full bg-zinc-300 text-zinc-950 font-black text-xs flex items-center justify-center mx-auto mb-2 shadow-md">
              #2
            </div>
            <img 
              src={toppers[1].avatarUrl} 
              alt={toppers[1].fullName}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-zinc-400"
            />
            <h4 className="font-bold text-white text-sm">{toppers[1].fullName}</h4>
            <p className="text-[11px] font-mono text-amber-400">{toppers[1].rollNumber}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{toppers[1].branchCode} • Sem {toppers[1].currentSemester}</p>
            <div className="mt-3 py-1 px-3 bg-zinc-800/80 rounded-xl inline-block">
              <span className="text-xs font-black text-emerald-400 font-mono">CGPA: {toppers[1].overallCgpa}</span>
            </div>
            <button
              onClick={() => {
                lookupResult(toppers[1].rollNumber);
                setActiveView('marksheet');
              }}
              className="mt-3 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <span>View Marksheet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Rank 1 (Gold Medalist) */}
        {toppers[0] && (
          <div className="bg-gradient-to-b from-amber-950/40 via-[#151824] to-[#12151e] border-2 border-amber-500/50 rounded-2xl p-6 text-center order-1 md:order-2 shadow-2xl relative scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" /> Gold Medalist • Rank #1
            </div>
            <img 
              src={toppers[0].avatarUrl} 
              alt={toppers[0].fullName}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-4 border-amber-400 shadow-xl mt-2"
            />
            <h4 className="font-black text-white text-base">{toppers[0].fullName}</h4>
            <p className="text-xs font-mono font-bold text-amber-400">{toppers[0].rollNumber}</p>
            <p className="text-xs text-zinc-300 mt-0.5">{toppers[0].branch} ({toppers[0].branchCode})</p>
            <div className="mt-3 py-1.5 px-4 bg-amber-500/20 border border-amber-500/30 rounded-xl inline-block">
              <span className="text-sm font-black text-amber-300 font-mono">SGPA: 10.00 • CGPA: {toppers[0].overallCgpa}</span>
            </div>
            <button
              onClick={() => {
                lookupResult(toppers[0].rollNumber);
                setActiveView('marksheet');
              }}
              className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1 shadow-lg shadow-amber-500/20"
            >
              <span>View Verified Marksheet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Rank 3 */}
        {toppers[2] && (
          <div className="bg-[#12151e] border border-zinc-700/60 rounded-2xl p-5 text-center order-3 relative overflow-hidden shadow-lg">
            <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center mx-auto mb-2 shadow-md">
              #3
            </div>
            <img 
              src={toppers[2].avatarUrl} 
              alt={toppers[2].fullName}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-amber-700"
            />
            <h4 className="font-bold text-white text-sm">{toppers[2].fullName}</h4>
            <p className="text-[11px] font-mono text-amber-400">{toppers[2].rollNumber}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{toppers[2].branchCode} • Sem {toppers[2].currentSemester}</p>
            <div className="mt-3 py-1 px-3 bg-zinc-800/80 rounded-xl inline-block">
              <span className="text-xs font-black text-emerald-400 font-mono">CGPA: {toppers[2].overallCgpa}</span>
            </div>
            <button
              onClick={() => {
                lookupResult(toppers[2].rollNumber);
                setActiveView('marksheet');
              }}
              className="mt-3 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <span>View Marksheet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Branch-wise Performance */}
        <div className="bg-[#12151e] border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              Branch-wise Average CGPA
            </h3>
            <span className="text-[10px] text-zinc-400">100% Pass Rate</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181b24', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="avgCgpa" radius={[6, 6, 0, 0]}>
                  {branchStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-[#12151e] border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Semester Grade Distribution (Total Subjects)
            </h3>
            <span className="text-[10px] text-zinc-400">UGC 10-Point Scale</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181b24', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
