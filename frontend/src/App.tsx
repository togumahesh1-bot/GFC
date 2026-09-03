import React from 'react';
import { StudentProvider, useStudents } from './context/StudentContext';
import { Header } from './components/common/Header';
import { ResultSearch } from './components/result/ResultSearch';
import { MarksheetView } from './components/result/MarksheetView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDirectory } from './components/directory/StudentDirectory';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AcademicFooter } from './components/common/AcademicFooter';
import { AcademicWhatsApp } from './components/common/AcademicWhatsApp';

const MainContent: React.FC = () => {
  const { activeView } = useStudents();

  return (
    <main className="flex-1">
      {activeView === 'search' && <ResultSearch />}
      {activeView === 'marksheet' && <MarksheetView />}
      {activeView === 'admin' && <AdminDashboard />}
      {activeView === 'directory' && <StudentDirectory />}
      {activeView === 'analytics' && <AnalyticsView />}
    </main>
  );
};

export function App() {
  return (
    <StudentProvider>
      <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
        <Header />
        <MainContent />
        <AcademicFooter />
        <AcademicWhatsApp />
      </div>
    </StudentProvider>
  );
}

export default App;
