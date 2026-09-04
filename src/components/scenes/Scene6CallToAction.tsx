import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  RotateCcw, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Award,
  Globe
} from 'lucide-react';
import { MEDIA_ASSETS } from '../../assets/media';
import { OFFICIAL_CTA_URL } from '../../utils/voiceover';
import { soundEngine } from '../../utils/soundEngine';

interface Scene6Props {
  playbackProgress: number;
  onReplay: () => void;
  isInteractive?: boolean;
}

export const Scene6CallToAction: React.FC<Scene6Props> = ({ onReplay }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_CTA_URL);
      setCopied(true);
      soundEngine.playBiometricScan();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4 md:p-8 select-none">
      {/* Background Command Center Image with Subtle Pulse */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="w-full h-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={MEDIA_ASSETS.fleetCommandHud}
            alt="Na2la Fleet Command Center"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-[0.45] contrast-[1.2]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        <div className="absolute inset-0 bg-scanlines opacity-40 pointer-events-none" />
      </div>

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span className="font-tech text-xs md:text-sm text-purple-300 font-bold tracking-wider">
            NA2LA V10 PRO // THE FUTURE OF SAAS LOGISTICS
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>المنظومة اللوجستية السحابية المعتمدة</span>
        </div>
      </div>

      {/* Central Epic Call-To-Action Card */}
      <div className="relative z-10 max-w-3xl mx-auto my-auto text-center space-y-5 px-4">
        {/* Slogan Pill */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 via-blue-900/60 to-emerald-900/60 border border-purple-400/40 backdrop-blur-xl shadow-xl shadow-purple-500/10"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span className="text-xs md:text-sm font-bold text-slate-100">
            لأنك لست مجرد ناقل.. أنت أسطورة الطريق
          </span>
        </motion.div>

        {/* Big Climax Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-tech leading-tight"
        >
          منصة{' '}
          <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
            Na2la
          </span>{' '}
          <span className="text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text">
            V10
          </span>{' '}
          <span className="inline-block px-3 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/40 text-2xl sm:text-4xl">
            PRO
          </span>
        </motion.h1>

        {/* Call to action subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto font-medium leading-relaxed"
        >
          ضع إمبراطوريتك اللوجستية في راحة يدك الآن. انضم إلى الآلاف من مديري الأساطيل والشاحنات
          المتميزة.
        </motion.p>

        {/* The Requested URL Display & Interactive Buttons */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="p-5 rounded-2xl bg-slate-900/90 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20 backdrop-blur-2xl space-y-4"
        >
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-purple-300 font-bold">
              <Globe className="w-4 h-4 text-cyan-400" />
              البوابة الرسمية للمنصة:
            </span>
            <span className="text-emerald-400">ONLINE ACCESS AVAILABLE</span>
          </div>

          {/* Highlighted URL Box */}
          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono-code text-cyan-300 text-sm sm:text-base md:text-lg font-bold select-all tracking-wide text-left">
              {OFFICIAL_CTA_URL}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                title="نسخ الرابط إلى الحافظة"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>

              <button
                onClick={() => {
                  setShowQr(!showQr);
                  soundEngine.playRadarPing();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                title="عرض رمز الاستجابة السريعة QR"
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>QR</span>
              </button>
            </div>
          </div>

          {/* QR Code Popdown */}
          {showQr && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 text-center space-y-2"
            >
              <div className="text-xs text-purple-300 font-bold">
                امسح الرمز بكاميرا الهاتف لزيارة المنصة مباشرة:
              </div>
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg flex items-center justify-center shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    OFFICIAL_CTA_URL
                  )}`}
                  alt="QR Code to Na2la platform"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[11px] font-mono-code text-slate-400">
                karamegy.github.io/Na2la
              </div>
            </motion.div>
          )}

          {/* Primary Action Button to visit URL */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={OFFICIAL_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playBiometricScan()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-2"
            >
              <span>انضم إلينا الآن في منصة Na2la</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                soundEngine.playWhoosh();
                onReplay();
              }}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>إعادة تشغيل الفيديو (60s)</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400">
        <div>
          <span>Na2la V10 PRO © 2026 // Next-Gen Fleet SaaS Platform</span>
        </div>
        <div className="text-cyan-400 font-bold">
          {OFFICIAL_CTA_URL}
        </div>
      </div>
    </div>
  );
};
