import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Sparkles,
  School,
  FileCheck
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';
import { NsritLogo } from '../common/NsritLogo';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAsStudent, quickLoginAsAdmin } = useStudents();

  // Form State
  const [identifier, setIdentifier] = useState('21A91A0503'); // default prefill with Mahesh Togu for quick test
  const [password, setPassword] = useState('student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotRoll, setForgotRoll] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'otp' | 'success'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Email or Roll Number.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate real network validation
    setTimeout(() => {
      const res = login(identifier, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'Invalid Roll Number or Password.');
      }
    }, 450);
  };

  const handleQuickStudent = (roll: string) => {
    setIdentifier(roll);
    setPassword('student@123');
    setIsLoading(true);
    setTimeout(() => {
      login(roll, 'student@123');
      setIsLoading(false);
    }, 350);
  };

  const handleQuickAdmin = () => {
    setIdentifier('admin@nsrit.edu.in');
    setPassword('admin@123');
    setIsLoading(true);
    setTimeout(() => {
      login('admin@nsrit.edu.in', 'admin@123');
      setIsLoading(false);
    }, 350);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotRoll.trim()) {
      setForgotMessage('Please enter your Roll Number or registered email.');
      return;
    }
    setForgotMessage(null);
    setForgotStep('otp');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setForgotMessage('Please enter the 4-digit verification code.');
      return;
    }
    setForgotStep('success');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-600/10 via-amber-500/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[130px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0c0e15]/80 backdrop-blur-md px-4 py-2.5 z-20">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Autonomous Grading System (R20 / R22)
            </span>
            <span className="hidden sm:inline text-zinc-400">
              NSRIT Student Examination Portal • Visakhapatnam
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300 text-[11px]">
            <a 
              href={`tel:${INSTITUTION_INFO.phone}`} 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Helpline: {INSTITUTION_INFO.phone}</span>
            </a>
            <a 
              href={`https://wa.me/${INSTITUTION_INFO.whatsapp}?text=Hello%20Exam%20Cell%2C%20I%20need%20assistance%20logging%20into%20NSRIT%20Student%20Portal`}
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Center Content: Student Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 z-10">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="bg-[#0e111a] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
            {/* Top Subtle Amber Border Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-indigo-600" />

            {/* NSRIT Logo at the top */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="mb-3 p-2 rounded-2xl bg-gradient-to-b from-blue-500/10 to-amber-500/10 border border-amber-500/20 shadow-lg">
                <NsritLogo size="lg" />
              </div>

              {/* College name below the logo */}
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans leading-tight">
                Nadimpalli Satyanarayana Raju
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-400 tracking-wide uppercase mt-0.5">
                Institute of Technology (NSRIT)
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-[10px] text-blue-300 font-medium">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>Autonomous • NAAC 'A' Grade • Affiliated to JNTU-GV</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 font-medium">
                Student Examination & Results Portal
              </p>
            </div>

            {/* Error or Success Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{successMessage} Opening dashboard...</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4" id="student-login-form">
              {/* Field 1: Email or Roll Number */}
              <div>
                <label 
                  htmlFor="login-identifier" 
                  className="block text-xs font-semibold text-zinc-300 mb-1.5"
                >
                  Email or Roll Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 21A91A0503 or student@nsrit.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#151924] border border-zinc-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                </div>
                <span className="block text-[10px] text-zinc-500 mt-1">
                  Enter JNTU-GV / NSRIT Hall Ticket No (e.g. 21A91A0503) or email
                </span>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="login-password" 
                    className="block text-xs font-semibold text-zinc-300"
                  >
                    Password
                  </label>
                  {/* Forgot Password option */}
                  <button
                    type="button"
                    onClick={() => {
                      setForgotRoll(identifier);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#151924] border border-zinc-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="block text-[10px] text-zinc-500 mt-1">
                  Default: DOB (DDMMYYYY) or student@123
                </span>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <span className="text-xs text-zinc-400">Remember on this device</span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                id="student-login-button"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Demo Logins for Instant Testing */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  Quick Demo Student Logins:
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickStudent('21A91A0503')}
                  className="p-2 rounded-lg bg-[#141722] hover:bg-[#1a1f2e] border border-zinc-800 text-left transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-amber-400 block text-[11px]">
                    Mahesh Togu
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">21A91A0503 (CSE)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStudent('21A91A0502')}
                  className="p-2 rounded-lg bg-[#141722] hover:bg-[#1a1f2e] border border-zinc-800 text-left transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-amber-400 block text-[11px]">
                    Ananya Sharma
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">21A91A0502 (10.0 SGPA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStudent('21A91A0501')}
                  className="p-2 rounded-lg bg-[#141722] hover:bg-[#1a1f2e] border border-zinc-800 text-left transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-amber-400 block text-[11px]">
                    Kalyan C.
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">21A91A0501 (CSE)</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickAdmin}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-950/40 to-indigo-950/40 hover:from-blue-900/50 hover:to-indigo-900/50 border border-blue-700/40 text-left transition-all group"
                >
                  <span className="font-bold text-blue-300 group-hover:text-blue-200 block text-[11px]">
                    Faculty / Admin
                  </span>
                  <span className="text-[10px] text-zinc-400">Exam Cell Controller</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-4 text-center text-xs text-zinc-500">
            <p className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official NSRIT Examination Cell Security Protocols Active</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="border-t border-zinc-800/80 bg-[#0a0c12] py-4 px-4 text-center text-xs text-zinc-500 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {INSTITUTION_INFO.name}. All Rights Reserved.
          </span>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>Sontyam, Visakhapatnam - 531173</span>
            <span>•</span>
            <a 
              href={`https://wa.me/${INSTITUTION_INFO.whatsapp}?text=Hello%20NSRIT%20Exam%20Cell`} 
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e111a] border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Student Password</h3>
                <p className="text-xs text-zinc-400">NSRIT Examination Cell Credential Recovery</p>
              </div>
            </div>

            {forgotStep === 'request' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enter your registered Hall Ticket Number or College Email ID. We will verify your academic enrollment and send a password reset verification code.
                </p>

                {forgotMessage && (
                  <p className="text-xs text-red-400">{forgotMessage}</p>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Roll Number / Email ID
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotRoll}
                    onChange={(e) => setForgotRoll(e.target.value)}
                    placeholder="e.g. 21A91A0503 or student@nsrit.edu.in"
                    className="w-full px-3.5 py-2.5 bg-[#151924] border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotStep('request');
                      setForgotMessage(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20"
                  >
                    Send Verification Code
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'otp' && (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs">
                  <p>
                    A 4-digit verification code has been dispatched for <b>{forgotRoll}</b> to your registered mobile/WhatsApp (+91 63724 81457).
                  </p>
                </div>

                {forgotMessage && (
                  <p className="text-xs text-red-400">{forgotMessage}</p>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Enter 4-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-32 text-center tracking-widest text-lg font-mono px-3.5 py-2 bg-[#151924] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">For testing, enter any 4 digits (e.g. 1234)</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold"
                  >
                    Verify & Reset
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'success' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Password Reset Successful!</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your temporary password is set to: <b className="text-amber-400 font-mono">student@123</b>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStep('request');
                    setPassword('student@123');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Return to Login with New Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
