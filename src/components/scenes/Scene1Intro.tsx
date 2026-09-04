import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck, Zap, Activity, Navigation, Radio } from 'lucide-react';
import { MEDIA_ASSETS } from '../../assets/media';
import { soundEngine } from '../../utils/soundEngine';

interface Scene1Props {
  playbackProgress: number; // 0 to 1 for this scene
  isInteractive?: boolean;
}

export const Scene1Intro: React.FC<Scene1Props> = ({ playbackProgress }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex flex-col justify-between select-none">
      {/* Cinematic Background Footage with Pan & Zoom */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="w-full h-full"
          animate={{
            scale: [1, 1.08, 1.04],
            x: [0, -15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={MEDIA_ASSETS.truckCinematic}
            alt="Na2la Heavy Freight Truck at Night"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-[0.72] contrast-[1.18]"
          />
        </motion.div>
        
        {/* Dynamic Dark Vignette & Cyber Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-purple-950/40" />
        <div className="absolute inset-0 bg-scanlines opacity-40 pointer-events-none" />
      </div>

      {/* Top HUD Telemetry Bar */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between border-b border-blue-500/20 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-tech text-xs md:text-sm tracking-wider text-blue-400">
            RADAR_LOC: HIGHWAY_CORRIDOR_04
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-300 font-mono-code">
            LAT 30.0444° N // LON 31.2357° E
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code">
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>تحذير: فوضى لوجستية وتكدس في المسارات القديمة</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5" />
            <span>معدل الفاقد التقليدي: 28.4%</span>
          </div>
        </div>
      </div>

      {/* Central Cinematic Anamorphic Typography & Brand Reveal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Anomaly to Order Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/40 border border-blue-400/40 backdrop-blur-md"
        >
          <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-blue-200 tracking-wide">
            نظام التحكم السحابي الموحد للأساطيل الذكية
          </span>
        </motion.div>

        {/* Grand Title with Neon Blue and Purple Aura */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-blue-600/20 via-purple-600/30 to-emerald-600/20 blur-2xl -z-10" />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-tech">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Na2la
            </span>{' '}
            <span className="text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text">
              V10
            </span>{' '}
            <span className="inline-block px-3 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-3xl sm:text-5xl font-black shadow-lg shadow-purple-500/30 border border-purple-400/40">
              PRO
            </span>
          </h1>
        </motion.div>

        {/* Subtitle in Arabic Typography */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 text-lg sm:text-2xl md:text-3xl font-bold text-slate-200 max-w-3xl leading-relaxed"
        >
          عالم النقل لم يعد يحتمل الفوضى..
          <span className="text-emerald-400"> الأسطول يحتاج لعقل سحابي لا ينام</span>
        </motion.p>

        {/* Live HUD Telemetry Box in Corner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono-code"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/80 border border-blue-500/30 text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>حماية البيانات: عزل سحابي تام</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/80 border border-purple-500/30 text-purple-300">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>خوارزميات الذكاء الاصطناعي: جاهزة للعمل</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>زمن استجابة المنظومة: 12ms</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Cinematic Telemetry Grid Bar */}
      <div className="relative z-10 p-3 md:p-4 bg-slate-950/80 border-t border-blue-500/20 backdrop-blur-md flex items-center justify-between text-[11px] font-mono-code text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            ONLINE_TELEMETRY: CONNECTED
          </span>
          <span className="hidden md:inline">FLEET_UNITS_ACTIVE: 1,420</span>
        </div>

        <button
          onClick={() => soundEngine.playWhoosh()}
          className="hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <span>CINEMATIC_SCENE_01</span>
          <span className="text-blue-400">[{Math.round(playbackProgress * 100)}%]</span>
        </button>
      </div>
    </div>
  );
};
