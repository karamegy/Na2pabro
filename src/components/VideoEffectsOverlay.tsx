import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoFilterMode } from '../types';
import { 
  Tv, 
  Eye, 
  Camera, 
  CircleDot, 
  Radio, 
  Battery, 
  Compass, 
  Crosshair,
  Sparkles
} from 'lucide-react';

interface VideoEffectsOverlayProps {
  filterMode: VideoFilterMode;
  currentTime: number;
}

export const VideoEffectsOverlay: React.FC<VideoEffectsOverlayProps> = ({
  filterMode,
  currentTime,
}) => {
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  // Occasional random glitch pulse in VHS mode
  useEffect(() => {
    if (filterMode !== 'vhs') return;

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setGlitchTrigger(true);
        setTimeout(() => setGlitchTrigger(false), 180);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [filterMode]);

  if (filterMode === 'none') return null;

  const formatVhsTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 30); // 30fps frames
    return `00:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden select-none">
      {/* ---------------- VHS GLITCH FILTER ---------------- */}
      {filterMode === 'vhs' && (
        <div className="w-full h-full relative">
          {/* CRT Scanline Striping */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-70" />

          {/* VHS Tape Tracking Static Distortion Band */}
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-vhs-tracking backdrop-blur-[1px] mix-blend-screen" />

          {/* Glitch Frame Flash */}
          {glitchTrigger && (
            <div className="absolute inset-0 bg-red-500/10 mix-blend-color-dodge backdrop-invert-[0.15] animate-vhs-jitter" />
          )}

          {/* Top OSD Vintage Overlay */}
          <div className="absolute top-4 inset-x-6 flex items-center justify-between text-xs font-mono-code text-emerald-400 tracking-wider">
            <div className="flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse inline-block" />
              <span className="font-bold text-white">REC ● PLAY</span>
              <span className="text-slate-400 text-[10px]">SP 30FPS</span>
            </div>

            <div className="flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-cyan-300 font-bold">TAPE_01 // AUTO-TRACK</span>
              <span className="text-white bg-black/60 px-2 py-0.5 rounded border border-white/20">
                {formatVhsTime(currentTime)}
              </span>
            </div>
          </div>

          {/* Bottom Tracking Noise Bar */}
          <div className="absolute bottom-0 inset-x-0 h-6 bg-slate-900/60 border-t border-white/20 flex items-center justify-between px-6 text-[10px] font-mono-code text-slate-300">
            <span>VHS HI-FI STEREO</span>
            <div className="flex items-center gap-1 text-cyan-300">
              <span>TRACKING:</span>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- NIGHT VISION FILTER ---------------- */}
      {filterMode === 'night_vision' && (
        <div className="w-full h-full relative animate-nv-phosphor">
          {/* Circular NVG Lens Vignette (Military Night Vision Goggles Mask) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,20,5,0.75)_75%,rgba(2,10,2,0.98)_100%)] pointer-events-none" />

          {/* High-Tech Reticle & Sensor Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="relative w-44 h-44 border border-emerald-400/50 rounded-full flex items-center justify-center">
              <Crosshair className="w-12 h-12 text-emerald-400/80" />
              <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          {/* Night Vision Phosphor Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0)_50%,rgba(6,78,59,0.3)_50%)] bg-[length:100%_3px] mix-blend-overlay" />

          {/* Top Military HUD Info */}
          <div className="absolute top-4 inset-x-6 flex items-center justify-between text-xs font-mono-code text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]">
            <div className="flex items-center gap-2.5 bg-emerald-950/70 border border-emerald-500/50 px-2.5 py-1 rounded-lg backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span className="font-bold text-white tracking-widest">[IR-FLIR ACTIVE]</span>
              <span className="text-[10px] text-emerald-300">GAIN +24dB</span>
            </div>

            <div className="flex items-center gap-3 bg-emerald-950/70 border border-emerald-500/50 px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px]">
              <div className="flex items-center gap-1 text-emerald-300">
                <Compass className="w-3.5 h-3.5" />
                <span>AZ 312° // ELEV +4°</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Battery className="w-3.5 h-3.5" />
                <span>94%</span>
              </div>
            </div>
          </div>

          {/* Bottom Sensor Telemetry */}
          <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-[10px] font-mono-code text-emerald-300/80">
            <div className="bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              BAND: LONG-WAVE INFRARED (8-14 µm)
            </div>
            <div className="bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              THERMAL TARGET ACQUISITION // AUTO-STABILIZED
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MONOCHROME NOIR FILTER ---------------- */}
      {filterMode === 'monochrome' && (
        <div className="w-full h-full relative">
          {/* Heavy Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.85)_100%)]" />

          {/* Fine Film Grain Noise Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3px_3px] opacity-60" />

          {/* Film Edge Camera Frame Marks */}
          <div className="absolute top-4 left-6 text-[10px] font-mono-code text-slate-300/80 tracking-widest flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-white" />
            <span className="font-bold text-white">35MM MONOCHROME</span>
            <span className="text-slate-400">ISO 400 • F/2.8 • 1/50S</span>
          </div>

          <div className="absolute top-4 right-6 text-[10px] font-mono-code text-slate-400">
            <span>[NOIR CINEMA GRADE]</span>
          </div>

          {/* Subtle Frame Corner Brackets */}
          <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-white/40 pointer-events-none" />
          <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-white/40 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-white/40 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-white/40 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
