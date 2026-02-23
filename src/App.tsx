import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Hash, Type, RotateCcw, CreditCard } from 'lucide-react';
import { numberToWords } from './utils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [amount, setAmount] = useState<string>('');
  const [words, setWords] = useState<string>('');
  const [copiedType, setCopiedType] = useState<'normal' | 'caps' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    const num = parseFloat(amount);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setWords('');
      return;
    }
    if (num < 0) {
      setError('Amount cannot be negative');
      setWords('');
      return;
    }
    
    setError(null);
    const result = numberToWords(num);
    setWords(result);

    // Auto-copy Words in All Caps
    const caps = result.toUpperCase();
    navigator.clipboard.writeText(caps).then(() => {
      setCopiedType('caps');
      setTimeout(() => setCopiedType(null), 2000);
    });
  }, [amount]);

  const copyToClipboard = (text: string, type: 'normal' | 'caps') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const handleReset = () => {
    setAmount('');
    setWords('');
    setError(null);
  };

  // Keyboard shortcut for Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && amount) {
        handleConvert();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [amount, handleConvert]);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-24">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-200 mb-4">
            <CreditCard className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Cheque Wordify</h1>
          <p className="text-stone-500">Convert amounts to professional cheque words instantly.</p>
        </motion.header>

        <motion.main
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
            <div className="space-y-4">
              <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">
                Amount to Convert
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-500 transition-colors">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn(
                    "w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-5 pl-14 pr-6 text-2xl font-medium outline-none transition-all",
                    "focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5",
                    error && "border-red-200 focus:border-red-500 focus:ring-red-500/5"
                  )}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 font-medium ml-1">{error}</p>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConvert}
                  disabled={!amount}
                  className={cn(
                    "flex-1 bg-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]",
                    "hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  )}
                >
                  Convert & Copy Caps
                </button>
                <button
                  onClick={handleReset}
                  className="p-4 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 transition-colors active:scale-[0.98]"
                  title="Reset"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {words && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                {/* Normal Words */}
                <div 
                  onClick={() => copyToClipboard(words, 'normal')}
                  className="group relative bg-white rounded-2xl p-6 border border-stone-200 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Words</span>
                    <div className="text-stone-300 group-hover:text-emerald-500 transition-colors">
                      {copiedType === 'normal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                  <p className="text-lg font-medium leading-relaxed pr-8">{words}</p>
                  {copiedType === 'normal' && (
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute bottom-4 right-6 text-xs font-bold text-emerald-600"
                    >
                      Copied!
                    </motion.span>
                  )}
                </div>

                {/* All Caps Words */}
                <div 
                  onClick={() => copyToClipboard(words.toUpperCase(), 'caps')}
                  className="group relative bg-stone-900 rounded-2xl p-6 border border-stone-800 cursor-pointer hover:shadow-xl hover:shadow-stone-900/20 transition-all active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">All Caps</span>
                    <div className="text-stone-600 group-hover:text-emerald-400 transition-colors">
                      {copiedType === 'caps' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                  <p className="text-lg font-bold leading-relaxed text-white pr-8 tracking-wide">
                    {words.toUpperCase()}
                  </p>
                  {copiedType === 'caps' && (
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute bottom-4 right-6 text-xs font-bold text-emerald-400"
                    >
                      Copied!
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-stone-400 text-xs font-medium uppercase tracking-widest"
        >
          Built for Precision & Speed
        </motion.footer>
      </div>
    </div>
  );
}
