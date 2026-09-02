import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, Copy, Check, ShieldCheck, Smartphone } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface UpiPaymentModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  amount,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  const upiId = 'gangammafastfood@upi';

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setIsVerifying(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Pay via UPI QR</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Scan with any UPI app (Google Pay, PhonePe, Paytm, CRED)
          </p>
          <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-lg">
            {formatCurrency(amount)}
          </div>
        </div>

        {/* Realistic QR Code Box */}
        <div className="bg-white p-4 rounded-2xl mx-auto w-52 h-52 flex flex-col items-center justify-center shadow-inner relative group">
          {/* Custom SVG QR Code visual pattern */}
          <div className="w-44 h-44 border-4 border-black p-2 relative flex flex-col justify-between">
            {/* Corner squares */}
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-black flex items-center justify-center">
                <div className="w-4 h-4 bg-black"></div>
              </div>
              <div className="w-10 h-10 border-4 border-black flex items-center justify-center">
                <div className="w-4 h-4 bg-black"></div>
              </div>
            </div>

            {/* Center Gangamma Brand Icon inside QR */}
            <div className="absolute inset-0 m-auto w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center border-2 border-white shadow">
              <span className="font-extrabold text-black text-xs">GFF</span>
            </div>

            {/* Bottom corner */}
            <div className="flex justify-between items-end">
              <div className="w-10 h-10 border-4 border-black flex items-center justify-center">
                <div className="w-4 h-4 bg-black"></div>
              </div>
              <div className="text-[9px] font-mono text-zinc-800 font-bold">
                UPI 2.0
              </div>
            </div>
          </div>
        </div>

        {/* UPI ID copy */}
        <div className="mt-4 flex items-center justify-between bg-zinc-950 px-3.5 py-2.5 rounded-xl border border-zinc-800">
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Restaurant UPI ID
            </span>
            <span className="text-sm font-mono text-zinc-200 font-bold">{upiId}</span>
          </div>
          <button
            onClick={handleCopyUpi}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Timer */}
        <div className="mt-3 text-center text-xs text-zinc-400">
          Payment expires in <span className="font-mono text-amber-400 font-bold">{formattedTime}</span>
        </div>

        {/* Confirm Button */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleConfirmPaid}
            disabled={isVerifying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying UPI Transaction...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>I Have Completed Payment</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Cancel & Change Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};
