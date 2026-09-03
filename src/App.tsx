import React from 'react';
import { StudentProvider, useStudents } from './context/StudentContext';
import { Header } from './components/common/Header';
import { LoginPage } from './components/auth/LoginPage';
import { ResultSearch } from './components/result/ResultSearch';
import { MarksheetView } from './components/result/MarksheetView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDirectory } from './components/directory/StudentDirectory';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { RevaluationPortal } from './components/revaluation/RevaluationPortal';
import { MarksDoubtClarification } from './components/revaluation/MarksDoubtClarification';
import { AcademicFooter } from './components/common/AcademicFooter';
import { AcademicWhatsApp } from './components/common/AcademicWhatsApp';
import { 
  FileText, 
  Search, 
  Users, 
  Award, 
  RotateCcw, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';

const StudentWelcomeBanner: React.FC = () => {
  const { currentUser, activeView, setActiveView } = useStudents();
  if (!currentUser) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0d1017] border-b border-zinc-800/80 px-4 py-3 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center font-bold text-amber-400 font-mono text-sm">
              {currentUser.rollNumber ? currentUser.rollNumber.slice(-3) : 'ADM'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {currentUser.fullName}
              </span>
              {currentUser.rollNumber && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                  {currentUser.rollNumber}
                </span>
              )}
              {currentUser.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                  Exam Cell Controller
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              {currentUser.branch ? `B.Tech • ${currentUser.branch}` : 'Autonomous Examination & Results Portal'}
              {currentUser.overallCgpa && ` • Cumulative CGPA: ${currentUser.overallCgpa}`}
            </p>
          </div>
        </div>

        {/* Quick Dashboard Action Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setActiveView('marksheet')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'marksheet'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Marks Memo</span>
          </button>

          {/* Revaluation Action Pill */}
          <button
            onClick={() => setActiveView('revaluation')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'revaluation'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Apply Revaluation (RV/RC)</span>
          </button>

          {/* Marks Clarification Action Pill */}
          <button
            onClick={() => setActiveView('clarification')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'clarification'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Clarify Marks (Why Less?)</span>
          </button>

          <button
            onClick={() => setActiveView('search')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'search'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Result</span>
          </button>

          <button
            onClick={() => setActiveView('directory')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'directory'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Directory</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'analytics'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Toppers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeView } = useStudents();

  return (
    <main className="flex-1">
      {activeView === 'search' && <ResultSearch />}
      {activeView === 'marksheet' && <MarksheetView />}
      {activeView === 'revaluation' && <RevaluationPortal />}
      {activeView === 'clarification' && <MarksDoubtClarification />}
      {activeView === 'admin' && <AdminDashboard />}
      {activeView === 'directory' && <StudentDirectory />}
      {activeView === 'analytics' && <AnalyticsView />}
    </main>
  );
};

const DashboardApp: React.FC = () => {
  const { isAuthenticated } = useStudents();

  // FIRST PAGE is the Student Login page:
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // After clicking Login, open the EXISTING Student Management & Results Dashboard:
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
      <Header />
      <StudentWelcomeBanner />
      <MainContent />
      <AcademicFooter />
      <AcademicWhatsApp />
    </div>
  );
};

export function App() {
  return (
    <StudentProvider>
      <DashboardApp />
    </StudentProvider>
  );
}

export default App;
