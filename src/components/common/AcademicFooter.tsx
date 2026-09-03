import React from 'react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';
import { useStudents } from '../../context/StudentContext';
import { NsritLogo } from './NsritLogo';

export const AcademicFooter: React.FC = () => {
  const { setActiveView } = useStudents();

  return (
    <footer className="bg-[#0b0d13] border-t border-zinc-800 text-zinc-400 text-xs py-10 print:hidden mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <NsritLogo size="sm" />
            <span className="font-extrabold text-white text-sm sm:text-base uppercase">
              {INSTITUTION_INFO.name}
            </span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
            {INSTITUTION_INFO.autonomousBadge}. Autonomous Examination Cell and Student Result Management System. Providing tamper-evident digital grade sheets, marks evaluation, and student transcripts.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Certified Autonomous Grading Engine (R20 & R22 AICTE Standard)</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Access</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveView('search')} className="hover:text-blue-400 transition-colors">
                • Examination Results Portal
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('directory')} className="hover:text-blue-400 transition-colors">
                • Student Directory Roster
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('analytics')} className="hover:text-blue-400 transition-colors">
                • Institute Gold Medalists & Analytics
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('admin')} className="hover:text-amber-400 transition-colors">
                • Faculty / Exam Cell Login
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact & Support */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Exam Cell Helpline</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <a href={`tel:${INSTITUTION_INFO.phone}`} className="hover:text-white font-mono">
                {INSTITUTION_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${INSTITUTION_INFO.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                WhatsApp: +91 63724 81457
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-zinc-300">{INSTITUTION_INFO.email}</span>
            </div>
            <div className="flex items-start gap-2 pt-1 text-zinc-500">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{INSTITUTION_INFO.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
        <div>
          © {new Date().getFullYear()} {INSTITUTION_INFO.name}. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Examination Controller: {INSTITUTION_INFO.controllerOfExams}</span>
        </div>
      </div>
    </footer>
  );
};
