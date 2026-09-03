import React from 'react';
import { 
  GraduationCap, 
  Search, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Phone, 
  MessageCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';

export const Header: React.FC = () => {
  const { activeView, setActiveView, isAdminLoggedIn, setIsAdminLoggedIn } = useStudents();

  return (
    <header className="border-b border-zinc-800 bg-[#0d1017] sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
      {/* Top Notification / Helpline Bar */}
      <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-purple-950/80 border-b border-blue-900/30 px-4 py-1.5 text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              RESULTS LIVE
            </span>
            <span className="hidden sm:inline text-zinc-300">
              Nov/Dec 2025 Regular & Supplementary Examination Results are published
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href={`tel:${INSTITUTION_INFO.phone}`} 
              className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Helpline: {INSTITUTION_INFO.phone}</span>
            </a>
            <a 
              href={`https://wa.me/${INSTITUTION_INFO.whatsapp}?text=Hello%20Exam%20Cell%2C%20I%20have%20an%20inquiry%20regarding%20Student%20Results`}
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand / Institution Info */}
        <div 
          onClick={() => setActiveView('search')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                {INSTITUTION_INFO.name}
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">
              {INSTITUTION_INFO.autonomousBadge} • Exam Cell
            </p>
          </div>
        </div>

        {/* View Switchers / Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveView('search')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'search' || activeView === 'marksheet'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Result Lookup</span>
            <span className="md:hidden">Results</span>
          </button>

          <button
            onClick={() => setActiveView('directory')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'directory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Students</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Toppers & Analytics</span>
          </button>

          <button
            onClick={() => {
              setIsAdminLoggedIn(!isAdminLoggedIn);
              setActiveView('admin');
            }}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeView === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'border border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin / Faculty</span>
          </button>
        </div>
      </div>
    </header>
  );
};
