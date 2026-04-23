import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, Loader2, X } from 'lucide-react';

const PaymentModal = ({ amount, onConfirm, onCancel }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    setSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm('sim_pay_' + Math.random().toString(36).substr(2, 9));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-[40px] w-full max-w-md relative"
      >
        <button onClick={onCancel} className="absolute top-6 right-6 text-text-light hover:text-primary">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <CreditCard size={32} />
          </div>
          <h2 className="text-3xl mb-2">Secure Payment</h2>
          <p className="text-text-light">Confirm your booking with a secure payment</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-light">Booking Fee</span>
            <span className="font-bold">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-text-light">
            <span>Transaction ID</span>
            <span>SIM-098234</span>
          </div>
        </div>

        {!success ? (
          <button 
            onClick={handlePay}
            disabled={processing}
            className="btn btn-primary w-full py-4 justify-center text-lg gap-3"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Pay ₹{amount}
              </>
            )}
          </button>
        ) : (
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-center text-green-500 font-bold text-xl"
          >
            Payment Successful!
          </motion.div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-light">
          <ShieldCheck size={14} className="text-green-500" />
          SSL Secured & Encrypted
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
