import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneTransitionEffect } from '../types';

interface SceneTransitionOverlayProps {
  activeSceneIndex: number;
  transitionEffect: SceneTransitionEffect;
}

export const SceneTransitionOverlay: React.FC<SceneTransitionOverlayProps> = ({
  activeSceneIndex,
  transitionEffect,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevScene, setPrevScene] = useState(activeSceneIndex);

  useEffect(() => {
    if (activeSceneIndex !== prevScene) {
      setPrevScene(activeSceneIndex);
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [activeSceneIndex, prevScene]);

  if (!isTransitioning || transitionEffect === 'fade') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {/* DIGITAL WIPE OVERLAY FX */}
        {transitionEffect === 'digital_wipe' && (
          <motion.div
            key={`wipe-${activeSceneIndex}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            {/* Slicing Laser Beam Line */}
            <motion.div
              initial={{ left: '-10%' }}
              animate={{ left: '110%' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 bottom-0 w-2.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_rgba(34,211,238,1)] z-40"
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-4 whitespace-nowrap bg-cyan-950/80 border border-cyan-400/60 px-2 py-0.5 rounded text-[9px] font-mono-code text-cyan-200 tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>WIPE_SYNC // CH.{activeSceneIndex + 1}</span>
              </div>
            </motion.div>

            {/* Subtle Gradient Shadow Wash trailing the laser */}
            <motion.div
              initial={{ width: '0%', opacity: 0.35 }}
              animate={{ width: '100%', opacity: [0.35, 0.1, 0] }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-900/20 to-cyan-500/10 pointer-events-none"
            />
          </motion.div>
        )}

        {/* GLITCH OVERLAY FX */}
        {transitionEffect === 'glitch' && (
          <motion.div
            key={`glitch-${activeSceneIndex}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.9, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48 }}
            className="w-full h-full relative"
          >
            {/* Random Horizontal Glitch Slices */}
            <div className="absolute top-[18%] inset-x-0 h-6 bg-red-500/30 mix-blend-screen translate-x-3 backdrop-invert-[0.1]" />
            <div className="absolute top-[42%] inset-x-0 h-10 bg-cyan-500/30 mix-blend-screen -translate-x-4 backdrop-invert-[0.15]" />
            <div className="absolute top-[68%] inset-x-0 h-4 bg-emerald-500/30 mix-blend-screen translate-x-6 backdrop-invert-[0.08]" />

            {/* Quick Binary Stream Watermark Flash */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-[10px] font-mono-code text-cyan-300/60 bg-black/60 px-4 py-1.5 rounded border border-cyan-500/40 tracking-widest backdrop-blur-sm shadow-2xl">
                [FRAME BUFFER CORRUPT // RE-INDEXING MATRIX: SCENE {activeSceneIndex + 1}]
              </div>
            </div>

            {/* Scanline Burst */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.15)_50%,rgba(255,0,128,0.15)_50%)] bg-[length:100%_4px] opacity-70" />
          </motion.div>
        )}

        {/* CYBER SHUTTER OVERLAY FX */}
        {transitionEffect === 'cyber_shutter' && (
          <motion.div
            key={`shutter-${activeSceneIndex}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            {/* Top & Bottom Shutter Blinds */}
            <motion.div
              initial={{ height: '50%' }}
              animate={{ height: '0%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 inset-x-0 bg-slate-950/80 border-b border-cyan-500/60 z-30"
            />
            <motion.div
              initial={{ height: '50%' }}
              animate={{ height: '0%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 inset-x-0 bg-slate-950/80 border-t border-cyan-500/60 z-30"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
