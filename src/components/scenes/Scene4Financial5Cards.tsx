import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  Layers, 
  Fuel, 
  CheckCircle, 
  Sparkles, 
  ArrowUpRight, 
  FileText,
  DollarSign
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface Scene4Props {
  playbackProgress: number;
  isInteractive?: boolean;
}

export const Scene4Financial5Cards: React.FC<Scene4Props> = ({ playbackProgress }) => {
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>('EGP');
  const [isReconciled, setIsReconciled] = useState(false);
  const [counterStep, setCounterStep] = useState(0);

  // Dynamic counter increment during playback
  useEffect(() => {
    setCounterStep(Math.min(1, Math.max(0, playbackProgress * 1.5)));
    if (playbackProgress > 0.6 && !isReconciled) {
      setIsReconciled(true);
      soundEngine.playConflictAlert(true);
    }
  }, [playbackProgress]);

  const currencyMultiplier = currency === 'USD' ? 0.021 : currency === 'SAR' ? 0.078 : 1;
  const currencySymbol = currency === 'USD' ? '$' : currency === 'SAR' ? 'ر.س' : 'ج.م';

  const formatNumber = (val: number) => {
    const calculated = Math.round(val * currencyMultiplier * counterStep);
    return new Intl.NumberFormat('en-US').format(calculated);
  };

  const handleReconcileClick = () => {
    soundEngine.playConflictAlert(true);
    setIsReconciled(true);
    setTimeout(() => {
      soundEngine.playOcrDataStream();
    }, 400);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none bg-cyber-grid">
      {/* Background Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-tech text-xs">
              FINANCIAL CORE // 5-CARD MATRIX
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              REAL-TIME LEDGER RECONCILIATION
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white mt-1">
            الجدول الخماسي المعتمد لإدارة الأرباح والخزينة
          </h2>
        </div>

        {/* Currency Selector & Quick Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs font-mono-code">
            {(['EGP', 'SAR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => {
                  setCurrency(curr);
                  soundEngine.playRadarPing();
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currency === curr
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            onClick={handleReconcileClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              isReconciled
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isReconciled ? <CheckCircle className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isReconciled ? 'تمت مطابقة الفواتير بضغطة زر' : 'مطابقة الفواتير الآن'}</span>
          </button>
        </div>
      </div>

      {/* The Famous 5-Card Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 my-auto py-2">
        {/* CARD 1: صافي الأرباح (Net Profits) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-slate-200">صافي الأرباح المحققة</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-black font-tech text-emerald-400 tracking-tight">
              {formatNumber(3842500)} <span className="text-xs font-sans text-slate-400">{currencySymbol}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono-code text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+28.4% مقارنة بالشهر السابق</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>هامش الربح التشغيلي:</span>
            <span className="font-mono-code text-cyan-300 font-bold">32.1%</span>
          </div>
        </motion.div>

        {/* CARD 2: الخزينة والسيولة المتاحة (Treasury & Cash Flow) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-slate-900/90 border border-blue-500/40 hover:border-blue-400 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-slate-200">الخزينة والسيولة المتاحة</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-black font-tech text-blue-400 tracking-tight">
              {formatNumber(8920450)} <span className="text-xs font-sans text-slate-400">{currencySymbol}</span>
            </div>
            <div className="mt-1 text-[11px] font-mono-code text-blue-300">
              جاهزة للسحب والتحويل اللحظي
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>الحسابات البنكية المتصلة:</span>
            <span className="font-mono-code text-blue-300 font-bold">4 بنوك نشطة</span>
          </div>
        </motion.div>

        {/* CARD 3: الفواتير الآجلة (Deferred Invoices) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-slate-200">الفواتير الآجلة</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-black font-tech text-amber-400 tracking-tight">
              {formatNumber(1450200)} <span className="text-xs font-sans text-slate-400">{currencySymbol}</span>
            </div>
            <div className="mt-1 text-[11px] font-mono-code text-amber-300">
              34 فاتورة قيد التحصيل التلقائي
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>متوسط الاستحقاق:</span>
            <span className="font-mono-code text-amber-300 font-bold">14 يوماً</span>
          </div>
        </motion.div>

        {/* CARD 4: الفواتير المجمعة (Consolidated Invoices) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-slate-200">الفواتير المجمعة</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-black font-tech text-purple-400 tracking-tight">
              128 <span className="text-xs font-sans text-slate-400">دفعة شحن</span>
            </div>
            <div className="mt-1 text-[11px] font-mono-code text-purple-300">
              دمج شحنات العملاء بنقرة واحدة
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>الربط الضريبي الإلكتروني:</span>
            <span className="font-mono-code text-purple-300 font-bold">معتمد 100%</span>
          </div>
        </motion.div>

        {/* CARD 5: تكاليف الوقود والتشغيل (Fleet Operating & Fuel Costs) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-400" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-slate-200">تكاليف الوقود والتشغيل</span>
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Fuel className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-black font-tech text-cyan-400 tracking-tight">
              {formatNumber(985400)} <span className="text-xs font-sans text-slate-400">{currencySymbol}</span>
            </div>
            <div className="mt-1 text-[11px] font-mono-code text-cyan-300">
              متوسط تكلفة الكيلومتر: 14.8 {currencySymbol}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>كفاءة استهلاك الديزل:</span>
            <span className="font-mono-code text-emerald-400 font-bold">+16.2% توفير</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Ledger Summary Strip */}
      <div className="relative z-10 p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            نظام الفاتورة الإلكترونية الموحد (E-INVOICE V10)
          </span>
          <span className="hidden md:inline">AUTOMATED RECONCILIATION: ZERO DISCREPANCY</span>
        </div>
        <div className="text-cyan-300 font-bold">
          ضغطة زر واحدة تلغي أسابيع من الجرد اليدوي
        </div>
      </div>
    </div>
  );
};
