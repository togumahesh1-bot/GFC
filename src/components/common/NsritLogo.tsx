import React from 'react';

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
  const dimensions = {
    sm: { box: 36, icon: 20, fontSize: 'text-xs' },
    md: { box: 48, icon: 28, fontSize: 'text-sm' },
    lg: { box: 76, icon: 44, fontSize: 'text-base' },
    xl: { box: 96, icon: 56, fontSize: 'text-lg' },
  }[size];

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Official NSRIT Crest Emblem */}
      <div 
        style={{ width: dimensions.box, height: dimensions.box }} 
        className="relative flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Golden Glow Circle */}
          <circle cx="50" cy="50" r="48" fill="url(#crestGrad)" stroke="#f59e0b" strokeWidth="2.5" />
          
          {/* Inner Decorative Bezel */}
          <circle cx="50" cy="50" r="43" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />

          {/* Academic Laurel Wreath (Left branch) */}
          <path 
            d="M20 54 C18 42 22 30 32 23 C30 29 28 36 29 44 C25 45 22 49 20 54 Z" 
            fill="#fbbf24" 
            opacity="0.85"
          />
          <path 
            d="M17 64 C16 58 19 50 24 45 C23 52 25 58 28 63 C23 64 19 66 17 64 Z" 
            fill="#f59e0b" 
            opacity="0.8"
          />

          {/* Academic Laurel Wreath (Right branch) */}
          <path 
            d="M80 54 C82 42 78 30 68 23 C70 29 72 36 71 44 C75 45 78 49 80 54 Z" 
            fill="#fbbf24" 
            opacity="0.85"
          />
          <path 
            d="M83 64 C84 58 81 50 76 45 C77 52 75 58 72 63 C77 64 81 66 83 64 Z" 
            fill="#f59e0b" 
            opacity="0.8"
          />

          {/* Central Heraldic Shield */}
          <path 
            d="M30 25 L70 25 C70 25 70 54 50 71 C30 54 30 25 30 25 Z" 
            fill="url(#shieldGrad)" 
            stroke="#fbbf24" 
            strokeWidth="2" 
          />

          {/* Rising Sun Rays of Enlightenment */}
          <path d="M50 28 L50 33" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M43 30 L45 34" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M57 30 L55 34" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="36" r="3.5" fill="#fbbf24" />

          {/* Engineering Gear / Cogwheel */}
          <circle cx="50" cy="46" r="7" stroke="#e0e7ff" strokeWidth="1.5" strokeDasharray="3 1.5" />
          <circle cx="50" cy="46" r="3" fill="#93c5fd" />

          {/* Open Book of Knowledge */}
          <path 
            d="M39 56 C44 54 48 55 50 58 C52 55 56 54 61 56 L61 63 C56 61 52 62 50 65 C48 62 44 61 39 63 Z" 
            fill="#ffffff" 
            stroke="#1e3a8a" 
            strokeWidth="0.8"
          />
          <path d="M50 58 L50 65" stroke="#1e3a8a" strokeWidth="0.8" />

          {/* Bottom Golden Banner Ribbon for NSRIT */}
          <path 
            d="M20 74 L30 70 L70 70 L80 74 L75 82 L50 79 L25 82 Z" 
            fill="url(#ribbonGrad)" 
            stroke="#d97706" 
            strokeWidth="1.2"
          />
          <text 
            x="50" 
            y="77.5" 
            textAnchor="middle" 
            fill="#0f172a" 
            fontFamily="sans-serif" 
            fontWeight="900" 
            fontSize="6.8" 
            letterSpacing="0.8"
          >
            NSRIT
          </text>

          {/* ESTD 2008 Label */}
          <text 
            x="50" 
            y="88" 
            textAnchor="middle" 
            fill="#fbbf24" 
            fontFamily="sans-serif" 
            fontWeight="bold" 
            fontSize="4.2" 
            letterSpacing="0.5"
          >
            ESTD. 2008
          </text>

          {/* Gradients */}
          <defs>
            <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a192f" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0b1329" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* College Typography Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase">
              UGC Autonomous Institution
            </span>
            <span className="text-zinc-500 text-[10px]">•</span>
            <span className="text-emerald-400 font-semibold text-[10px]">NAAC 'A' Grade</span>
          </div>
          <h1 className={`font-black tracking-tight leading-tight uppercase font-sans ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          } ${dimensions.fontSize}`}>
            Nadimpalli Satyanarayana Raju
          </h1>
          <span className={`font-bold text-xs tracking-wider uppercase ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
          }`}>
            Institute of Technology (NSRIT)
          </span>
          <span className="text-[10px] text-zinc-400 leading-tight">
            Approved by AICTE, New Delhi • Affiliated to JNTU-GV, Vizianagaram
          </span>
        </div>
      )}
    </div>
  );
};
