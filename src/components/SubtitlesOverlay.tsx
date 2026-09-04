import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Languages, Gauge } from 'lucide-react';
import { SceneMeta, VolumeNormalizationMetrics } from '../types';

interface SubtitlesOverlayProps {
  currentScene: SceneMeta;
  showSubtitles: boolean;
  subtitleLang: 'ar' | 'en' | 'both';
  isSpeaking: boolean;
  onVoiceNarrate?: () => void;
  normalizationMetrics?: VolumeNormalizationMetrics | null;
}

export const SubtitlesOverlay: React.FC<SubtitlesOverlayProps> = ({
  currentScene,
  showSubtitles,
  subtitleLang,
  isSpeaking,
  onVoiceNarrate,
  normalizationMetrics,
}) => {
  if (!showSubtitles) return null;

  return (
    <div className="absolute bottom-4 inset-x-4 md:inset-x-12 z-20 pointer-events-auto flex flex-col items-center select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentScene.id}-${subtitleLang}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl w-full bg-slate-950/85 border border-cyan-500/30 rounded-2xl p-3.5 md:p-4 backdrop-blur-xl shadow-2xl text-center space-y-1.5"
        >
          {/* Header pill */}
          <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-bold">VOICEOVER SCRIPT // مشهد #{currentScene.id}</span>
              {normalizationMetrics && normalizationMetrics.isAutoNormalized && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                  <Gauge className="w-2.5 h-2.5 text-emerald-400" />
                  <span>NORM {Math.round(normalizationMetrics.normalizedVolume * 100)}%</span>
                  <span className="text-emerald-400 font-bold">({normalizationMetrics.gainAdjustmentDb >= 0 ? `+${normalizationMetrics.gainAdjustmentDb}` : normalizationMetrics.gainAdjustmentDb}dB)</span>
                </span>
              )}
            </div>

            {onVoiceNarrate && (
              <button
                onClick={onVoiceNarrate}
                className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition-colors"
                title="إعادة نطق التعليق الصوتي"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span>{isSpeaking ? 'جاري السرد الصوتي...' : 'إعادة النطق'}</span>
              </button>
            )}
          </div>

          {/* Arabic Voiceover Subtitle Text */}
          {(subtitleLang === 'ar' || subtitleLang === 'both') && (
            <p className="text-sm md:text-lg font-bold text-white leading-relaxed font-sans text-glow-blue">
              {currentScene.voiceoverAr}
            </p>
          )}

          {/* English Subtitle Translation (if requested) */}
          {(subtitleLang === 'en' || subtitleLang === 'both') && (
            <p className="text-xs md:text-sm text-cyan-200/90 font-mono-code leading-normal">
              {currentScene.voiceoverEn}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
