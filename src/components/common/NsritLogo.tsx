import React from 'react';
import { GraduationCap } from 'lucide-react';

interface NsritLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const NsritLogo: React.FC<NsritLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  theme = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }[size];

  const boxSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-14 h-14 rounded-2xl',
  }[size];

  const fontSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Sleek, clean modern badge - No heavy or ornate logo */}
      <div 
        className={`${boxSizes} flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-blue-500/10`}
      >
        <div className="w-full h-full bg-[#0b0e17] rounded-[inherit] flex items-center justify-center">
          <GraduationCap className={`${iconSizes} text-amber-400`} />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-[10px] tracking-wider uppercase">
              Autonomous
            </span>
            <span className="text-zinc-500 text-[10px]">•</span>
            <span className="text-emerald-400 font-medium text-[10px]">NAAC 'A'</span>
          </div>
          <span className={`font-black tracking-tight leading-tight uppercase font-sans ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          } ${fontSizes}`}>
            NSRIT
          </span>
          <span className="text-[10px] text-zinc-400 leading-tight">
            Nadimpalli Satyanarayana Raju Institute of Technology
          </span>
        </div>
      )}
    </div>
  );
};
