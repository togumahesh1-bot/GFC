import React from 'react';
import { 
  Search, 
  Users, 
  ShieldCheck, 
  Phone, 
  MessageCircle,
  Award,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';
import { NsritLogo } from './NsritLogo';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn, 
    currentUser, 
    logout 
  } = useStudents();

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
              NSRIT Autonomous Nov/Dec 2025 Regular & Supplementary Examination Results
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
        {/* Brand / Institution Info with NSRIT Crest */}
        <div 
          onClick={() => setActiveView('search')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <NsritLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-amber-300 transition-colors uppercase">
                {INSTITUTION_INFO.name}
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">
              {INSTITUTION_INFO.autonomousBadge} • Exam Cell
            </p>
          </div>
        </div>

        {/* View Switchers & User Session */}
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
            <span className="hidden sm:inline">Admin / Faculty</span>
            <span className="sm:hidden">Admin</span>
          </button>

          {/* User Session Chip & Logout Button */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-tight flex items-center gap-1 justify-end">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {currentUser.rollNumber || currentUser.role}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign Out to Student Login"
                className="px-2.5 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/15 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
