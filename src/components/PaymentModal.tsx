import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    subscriptionPlans,
    selectedPlanForPayment,
    processPaymentSuccess,
    currentUser,
  } = useApp();

  const [activePlan, setActivePlan] = useState<SubscriptionPlan>(() => {
    return selectedPlanForPayment || subscriptionPlans.find((p) => p.popular) || subscriptionPlans[1];
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);

  if (!isPaymentModalOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Call server to create Razorpay Order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: activePlan.id,
          planName: activePlan.name,
          amount: activePlan.price,
          studentEmail: currentUser.email,
          studentName: currentUser.name,
        }),
      });

      const orderData = await orderRes.json();

      // Simulate network verification
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // 2. Call server to verify payment signature
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_rzp_${Date.now()}`,
          signature: 'sig_verified_mes_2026',
          planId: activePlan.id,
          durationMonths: activePlan.durationMonths,
          amount: activePlan.price,
        }),
      });

      const verifyData = await verifyRes.json();

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      setPaymentSuccessData({
        ...verifyData,
        plan: activePlan,
        method: paymentMethod === 'upi' ? `UPI (${upiVpa || 'Google Pay'})` : paymentMethod === 'card' ? 'Debit/Credit Card' : `Net Banking (${bankName})`,
      });

      // Update app state & unlocked contents
      processPaymentSuccess({
        plan: activePlan,
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'Net Banking',
        paymentId: verifyData.paymentId,
        orderId: verifyData.orderId,
      });
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Razorpay Brand Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  Razorpay Secure Gateway
                </span>
              </div>
              <p className="text-xs text-blue-200">
                256-bit Encrypted Checkout · 100% Verified Safe Payment
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-blue-200 uppercase tracking-wider block font-medium">Total Payable</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                ₹{activePlan.price}
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT SUCCESS SCREEN */}
        {paymentSuccessData ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your subscription to <strong>{paymentSuccessData.plan.name}</strong> has been activated.
              </p>
            </div>

            {/* Official Invoice Summary Box */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
              <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700 font-bold">
                <span>Tax Invoice</span>
                <span>{paymentSuccessData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Student Name:</span>
                <span>{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Plan:</span>
                <span>{paymentSuccessData.plan.name} ({paymentSuccessData.plan.durationLabel})</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Amount Paid:</span>
                <span>₹{paymentSuccessData.amountPaid} (GST Included)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Payment ID:</span>
                <span>{paymentSuccessData.paymentId}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Access Validity:</span>
                <span>{new Date(paymentSuccessData.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Invoice Downloaded: ${paymentSuccessData.invoiceNumber}`);
                  setIsPaymentModalOpen(false);
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download GST Invoice PDF</span>
              </button>

              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full sm:w-auto py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Start Studying Now
              </button>
            </div>
          </div>
        ) : (
          /* REGULAR CHECKOUT FORM */
          <div className="p-6 space-y-6">
            {/* Step 1: Select Plan */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Step 1: Choose Subscription Tier
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {subscriptionPlans
                  .filter((p) => p.id !== 'plan_free')
                  .map((plan) => {
                    const isSelected = activePlan.id === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setActivePlan(plan)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all text-center relative ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-100 shadow-sm ring-2 ring-blue-600/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                            POPULAR
                          </span>
                        )}
                        <h4 className="font-bold text-xs">{plan.name}</h4>
                        <div className="text-lg font-black font-mono my-1">
                          ₹{plan.price}
                        </div>
                        <span className="text-[10px] text-slate-400">{plan.durationLabel}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Step 2: Select Payment Method
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs font-semibold mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* METHOD 1: UPI */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>Supported UPI Apps:</span>
                    <span className="font-semibold text-blue-600">Google Pay · PhonePe · Paytm · BHIM</span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank or 9437123456@ybl"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* METHOD 2: DEBIT/CREDIT CARD */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8910"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: NET BANKING */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Your Bank
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Odisha Gramya Bank">Odisha Gramya Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Checkout Button */}
            <form onSubmit={handleCheckout}>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Contacting Razorpay Bank Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{activePlan.price} & Unlock {activePlan.name} Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
