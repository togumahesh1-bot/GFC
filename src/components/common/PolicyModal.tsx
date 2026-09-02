import React from 'react';
import { X, Shield, FileText, RefreshCw } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'refund' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && <Shield className="w-5 h-5 text-amber-400" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-orange-400" />}
            {type === 'refund' && <RefreshCw className="w-5 h-5 text-emerald-400" />}
            <h3 className="text-lg font-bold text-white">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms & Conditions'}
              {type === 'refund' && 'Refund & Cancellation Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-zinc-300 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p className="font-semibold text-white">1. Information We Collect</p>
              <p>
                Gangamma Fast Food collects your name, contact phone number, delivery address, and order history strictly for processing your food orders and providing real-time order tracking.
              </p>
              <p className="font-semibold text-white">2. Direct Customer Relationship</p>
              <p>
                Unlike third-party aggregator apps, Gangamma Fast Food does not sell or share your personal contact details with commercial data brokers or marketing affiliates.
              </p>
              <p className="font-semibold text-white">3. Security & Payments</p>
              <p>
                We do not store complete credit card or debit card numbers on our servers. All UPI and digital transactions are processed through authorized banking gateways.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-semibold text-white">1. Direct Ordering Agreement</p>
              <p>
                By placing an order via Gangamma Fast Food’s online web portal, you agree that all dishes are prepared fresh to order. Minimum order amounts may apply for coupon eligibility or complimentary delivery.
              </p>
              <p className="font-semibold text-white">2. Estimated Delivery & Takeaway Times</p>
              <p>
                Preparation and transit times displayed (typically 20–35 minutes) are estimates based on kitchen volume, rain, or traffic conditions in Hyderabad.
              </p>
              <p className="font-semibold text-white">3. Loyalty Points Program</p>
              <p>
                Every ₹100 spent earns 10 reward points. Points may be redeemed for discounts on subsequent orders. Points cannot be redeemed for physical currency.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <p className="font-semibold text-white">1. Order Cancellations</p>
              <p>
                Orders may be cancelled free of charge if the restaurant has not yet accepted or started preparing your meal (status: "Order Placed"). Once food preparation has begun in our kitchen, cancellations cannot be accepted.
              </p>
              <p className="font-semibold text-white">2. Quality Guarantee & Replacements</p>
              <p>
                If an item is missing, damaged, or does not meet our high culinary standards, please call us directly at <b>+91 63724 81457</b> or message our WhatsApp helpline at <a href="https://wa.me/916372481457" target="_blank" rel="noreferrer" className="text-emerald-400 font-semibold underline hover:text-emerald-300">+91 63724 81457</a> within 30 minutes of delivery. We will promptly dispatch a fresh replacement or issue an instant store credit/refund.
              </p>
              <p className="font-semibold text-white">3. Refund Processing</p>
              <p>
                Approved UPI or online refunds are processed within 2–4 hours to your original payment method.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
