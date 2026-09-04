import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crosshair, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Layers, 
  Check, 
  Info, 
  X,
  ExternalLink
} from 'lucide-react';
import { TECH_HOTSPOTS } from '../data/hotspots';
import { TechHotspot } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface TechHotspotsOverlayProps {
  currentTime: number;
  activeSceneId: number;
  isPlaying: boolean;
  onPauseForInspection: () => void;
  hotspotsEnabled: boolean;
}

export const TechHotspotsOverlay: React.FC<TechHotspotsOverlayProps> = ({
  currentTime,
  activeSceneId,
  isPlaying,
  onPauseForInspection,
  hotspotsEnabled,
}) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<TechHotspot | null>(null);
  const [pinnedHotspot, setPinnedHotspot] = useState<TechHotspot | null>(null);

  if (!hotspotsEnabled) return null;

  // Filter hotspots active in this timestamp window (or current scene)
  const activeHotspots = TECH_HOTSPOTS.filter(
    (h) => currentTime >= h.startTime && currentTime <= h.endTime
  );

  const displayedHotspot = pinnedHotspot || hoveredHotspot;

  const handleHotspotHover = (hotspot: TechHotspot) => {
    if (hoveredHotspot?.id !== hotspot.id) {
      soundEngine.playRadarPing();
      setHoveredHotspot(hotspot);
    }
  };

  const handleHotspotClick = (hotspot: TechHotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playBiometricScan();
    if (pinnedHotspot?.id === hotspot.id) {
      setPinnedHotspot(null);
    } else {
      setPinnedHotspot(hotspot);
      if (isPlaying) {
        onPauseForInspection();
      }
    }
  };

  const getColorClasses = (accent: TechHotspot['accentColor']) => {
    switch (accent) {
      case 'emerald':
        return {
          ring: 'border-emerald-400 text-emerald-400 shadow-emerald-500/30',
          bg: 'bg-emerald-500/20',
          badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          highlight: 'text-emerald-400',
        };
      case 'purple':
        return {
          ring: 'border-purple-400 text-purple-400 shadow-purple-500/30',
          bg: 'bg-purple-500/20',
          badge: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
          highlight: 'text-purple-400',
        };
      case 'cyan':
        return {
          ring: 'border-cyan-400 text-cyan-400 shadow-cyan-500/30',
          bg: 'bg-cyan-500/20',
          badge: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
          highlight: 'text-cyan-400',
        };
      case 'blue':
      default:
        return {
          ring: 'border-blue-400 text-blue-400 shadow-blue-500/30',
          bg: 'bg-blue-500/20',
          badge: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
          highlight: 'text-blue-400',
        };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* 1. Interactive Pulsing Hotspot Target Pins */}
      {activeHotspots.map((hotspot) => {
        const isPinned = pinnedHotspot?.id === hotspot.id;
        const isHovered = hoveredHotspot?.id === hotspot.id;
        const colorStyles = getColorClasses(hotspot.accentColor);

        return (
          <div
            key={hotspot.id}
            style={{
              left: `${hotspot.xPercent}%`,
              top: `${hotspot.yPercent}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <button
              onMouseEnter={() => handleHotspotHover(hotspot)}
              onMouseLeave={() => !pinnedHotspot && setHoveredHotspot(null)}
              onClick={(e) => handleHotspotClick(hotspot, e)}
              className="relative group focus:outline-none flex items-center justify-center"
              aria-label={`المواصفات التقنية: ${hotspot.titleAr}`}
            >
              {/* Outer Pulsing Concentric Radar Rings */}
              <div
                className={`absolute w-12 h-12 rounded-full border border-dashed ${colorStyles.ring} animate-spin opacity-60 pointer-events-none`}
                style={{ animationDuration: '8s' }}
              />
              <div
                className={`absolute w-9 h-9 rounded-full border ${colorStyles.ring} animate-ping opacity-40 pointer-events-none`}
              />

              {/* Inner Core Pin */}
              <div
                className={`w-7 h-7 rounded-full bg-slate-950/90 border-2 ${
                  isPinned || isHovered ? colorStyles.ring : 'border-slate-400/80'
                } flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-125`}
              >
                <Crosshair className={`w-3.5 h-3.5 ${colorStyles.highlight} group-hover:rotate-45 transition-transform`} />
              </div>

              {/* Floating Pill Label */}
              <div
                className={`absolute top-full mt-1.5 px-2 py-0.5 rounded-full bg-slate-950/90 border ${
                  colorStyles.badge
                } text-[10px] font-mono-code whitespace-nowrap shadow-xl backdrop-blur-md opacity-90 group-hover:opacity-100 flex items-center gap-1 transition-all ${
                  isPinned ? 'ring-2 ring-cyan-400' : ''
                }`}
              >
                <Zap className="w-2.5 h-2.5 text-yellow-400" />
                <span>SPEC // {hotspot.titleAr.split(' ')[0]}</span>
              </div>
            </button>
          </div>
        );
      })}

      {/* 2. Detailed Technical Specification Glassmorphism Modal / Popover */}
      <AnimatePresence>
        {displayedHotspot && (
          <motion.div
            key={displayedHotspot.id}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className={`absolute pointer-events-auto z-40 max-w-sm sm:max-w-md w-full p-4 rounded-2xl bg-slate-950/95 border shadow-2xl backdrop-blur-2xl text-right ${
              getColorClasses(displayedHotspot.accentColor).ring
            } ${
              // Smart positioning based on hotspot coordinate
              displayedHotspot.yPercent > 55
                ? 'top-4'
                : 'bottom-16'
            } ${
              displayedHotspot.xPercent > 50
                ? 'left-4 sm:left-8'
                : 'right-4 sm:right-8'
            }`}
          >
            {/* Top Bar: Category & Close / Pin state */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5 text-xs font-mono-code">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getColorClasses(displayedHotspot.accentColor).badge}`}>
                  {displayedHotspot.categoryAr}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {displayedHotspot.hudCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {pinnedHotspot && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                    مُثبت للقراءة ⏸
                  </span>
                )}
                <button
                  onClick={() => {
                    setPinnedHotspot(null);
                    setHoveredHotspot(null);
                    soundEngine.playWhoosh();
                  }}
                  className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="إغلاق بطاقة المواصفات"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-3">
              <h4 className="text-sm md:text-base font-extrabold text-white flex items-center gap-1.5">
                <Cpu className={`w-4 h-4 ${getColorClasses(displayedHotspot.accentColor).highlight}`} />
                <span>{displayedHotspot.titleAr}</span>
              </h4>
              <p className="text-[11px] font-mono-code text-slate-400 mt-0.5">
                {displayedHotspot.titleEn}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="space-y-1.5 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/90 text-xs">
              {displayedHotspot.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/50 transition-colors text-[11px]"
                >
                  <span className="text-slate-400 font-medium">{spec.labelAr}:</span>
                  <span className="font-mono-code font-bold text-cyan-300 text-left dir-ltr">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer status / pin tip */}
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
              <span>NA2LA V10 ARCHITECTURE SPEC</span>
              <span className="text-emerald-400">
                {pinnedHotspot ? 'انقر ✕ أو استأنف الفيديو' : 'انقر على النقطة لتثبيتها'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
