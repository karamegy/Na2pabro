import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Tv, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Languages, 
  HelpCircle,
  Radio,
  Sliders,
  Crosshair,
  Eye,
  Film,
  Disc,
  Zap,
  Layers,
  Gauge,
  Activity
} from 'lucide-react';
import { AspectRatioMode, VideoFilterMode, SceneTransitionEffect, VolumeNormalizationMetrics } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface VideoPlayerHeaderProps {
  aspectRatio: AspectRatioMode;
  setAspectRatio: (mode: AspectRatioMode) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  voiceoverEnabled: boolean;
  setVoiceoverEnabled: (enabled: boolean) => void;
  voiceoverNormalizationEnabled?: boolean;
  setVoiceoverNormalizationEnabled?: (enabled: boolean) => void;
  normalizationMetrics?: VolumeNormalizationMetrics | null;
  showSubtitles: boolean;
  setShowSubtitles: (show: boolean) => void;
  subtitleLang: 'ar' | 'en' | 'both';
  setSubtitleLang: (lang: 'ar' | 'en' | 'both') => void;
  isInteractiveMode: boolean;
  setIsInteractiveMode: (interactive: boolean) => void;
  hotspotsEnabled: boolean;
  setHotspotsEnabled: (enabled: boolean) => void;
  filterMode: VideoFilterMode;
  setFilterMode: (mode: VideoFilterMode) => void;
  transitionEffect: SceneTransitionEffect;
  setTransitionEffect: (effect: SceneTransitionEffect) => void;
  activeSceneTitle: string;
}

export const VideoPlayerHeader: React.FC<VideoPlayerHeaderProps> = ({
  aspectRatio,
  setAspectRatio,
  isMuted,
  setIsMuted,
  voiceoverEnabled,
  setVoiceoverEnabled,
  voiceoverNormalizationEnabled = true,
  setVoiceoverNormalizationEnabled,
  normalizationMetrics,
  showSubtitles,
  setShowSubtitles,
  subtitleLang,
  setSubtitleLang,
  isInteractiveMode,
  setIsInteractiveMode,
  hotspotsEnabled,
  setHotspotsEnabled,
  filterMode,
  setFilterMode,
  transitionEffect,
  setTransitionEffect,
  activeSceneTitle,
}) => {
  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur-md px-3 py-2.5 flex flex-wrap items-center justify-between gap-2.5 z-40 select-none">
      {/* Brand & Active Scene */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-tech text-base md:text-lg font-black tracking-wider text-white">
            Na2la <span className="text-cyan-400">V10</span> <span className="text-purple-400 text-xs px-1.5 py-0.5 rounded bg-purple-900/50 border border-purple-500/40">PRO</span>
          </span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-slate-800" />

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono-code text-slate-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">المشهد الحالي:</span>
          <span className="text-slate-200 font-bold line-clamp-1">{activeSceneTitle}</span>
        </div>
      </div>

      {/* Mode & Player Settings */}
      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {/* Toggle: Video vs Interactive Hands-on */}
        <button
          onClick={() => {
            soundEngine.playRadarPing();
            setIsInteractiveMode(!isInteractiveMode);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            isInteractiveMode
              ? 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-sm shadow-purple-500/20'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="التبديل بين وضع الفيديو السينمائي ووضع التجربة التفاعلية مع تحليلات الأسطول الفورية (I)"
        >
          <Sliders className={`w-3.5 h-3.5 ${isInteractiveMode ? 'text-cyan-400 animate-pulse' : 'text-purple-400'}`} />
          <span className="hidden md:inline">{isInteractiveMode ? 'وضع التجربة التفاعلية والتحليلات' : 'وضع الفيديو السينمائي'}</span>
          <span className="md:hidden">{isInteractiveMode ? 'تفاعلي + تحليلات' : 'فيديو'}</span>
          {isInteractiveMode && (
            <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-code hidden sm:inline">
              LIVE HUD
            </span>
          )}
        </button>

        {/* Toggle: Interactive Tech Hotspots */}
        <button
          onClick={() => {
            soundEngine.playRadarPing();
            setHotspotsEnabled(!hotspotsEnabled);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono-code transition-all flex items-center gap-1.5 border ${
            hotspotsEnabled
              ? 'bg-cyan-950/80 border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-500/20 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title="تفعيل أو إخفاء نقاط المواصفات التقنية التفاعلية (Tech Hotspots)"
        >
          <Crosshair className={`w-3.5 h-3.5 ${hotspotsEnabled ? 'text-cyan-400 animate-spin' : 'text-slate-500'}`} style={{ animationDuration: '10s' }} />
          <span className="hidden sm:inline">نقاط المواصفات</span>
          <span className="text-[10px] px-1 rounded bg-slate-800 border border-slate-700">
            {hotspotsEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Video Filter Mode Selector (VHS, Night Vision, Monochrome) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              setFilterMode('none');
              soundEngine.playRadarPing();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code ${
              filterMode === 'none' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="فيديو قياسي بدون مؤثرات"
          >
            عادي
          </button>
          <button
            onClick={() => {
              setFilterMode('vhs');
              soundEngine.playWhoosh();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code flex items-center gap-1 ${
              filterMode === 'vhs' ? 'bg-cyan-600 text-white font-bold shadow-sm shadow-cyan-500/50' : 'text-slate-400 hover:text-cyan-300'
            }`}
            title="مؤثر VHS Glitch & Retro CRT Tracking"
          >
            <Disc className="w-3 h-3 text-cyan-300" />
            <span>VHS</span>
          </button>
          <button
            onClick={() => {
              setFilterMode('night_vision');
              soundEngine.playBiometricScan();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code flex items-center gap-1 ${
              filterMode === 'night_vision' ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-500/50' : 'text-slate-400 hover:text-emerald-300'
            }`}
            title="مؤثر الرؤية الليلية العسكرية FLIR / Night Vision"
          >
            <Eye className="w-3 h-3 text-emerald-300" />
            <span className="hidden sm:inline">ليلي</span>
            <span className="sm:hidden">NV</span>
          </button>
          <button
            onClick={() => {
              setFilterMode('monochrome');
              soundEngine.playRadarPing();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code flex items-center gap-1 ${
              filterMode === 'monochrome' ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-500/50' : 'text-slate-400 hover:text-purple-300'
            }`}
            title="مؤثر أحادي اللون وسينما نوار Monochrome Noir"
          >
            <Film className="w-3 h-3 text-purple-300" />
            <span className="hidden sm:inline">أحادي</span>
            <span className="sm:hidden">B&W</span>
          </button>
        </div>

        {/* Scene Transition Effect Selector (Digital Wipe, Glitch, Cyber Shutter, Fade) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <div className="px-1.5 text-[10px] text-slate-500 font-mono-code hidden xl:block">
            انتقال:
          </div>
          <button
            onClick={() => {
              setTransitionEffect('digital_wipe');
              soundEngine.playDigitalWipe();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code flex items-center gap-1 ${
              transitionEffect === 'digital_wipe' ? 'bg-cyan-600 text-white font-bold shadow-sm shadow-cyan-500/50' : 'text-slate-400 hover:text-cyan-300'
            }`}
            title="انتقال مسح رقمي ليزري (Digital Wipe)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            <span className="hidden sm:inline">مسح رقمي</span>
            <span className="sm:hidden">مسح</span>
          </button>
          <button
            onClick={() => {
              setTransitionEffect('glitch');
              soundEngine.playGlitchTransition();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code flex items-center gap-1 ${
              transitionEffect === 'glitch' ? 'bg-rose-600 text-white font-bold shadow-sm shadow-rose-500/50' : 'text-slate-400 hover:text-rose-300'
            }`}
            title="انتقال خلل تقني وتشويش RGB (Glitch)"
          >
            <Zap className="w-3 h-3 text-rose-300" />
            <span className="hidden sm:inline">خلل تقني</span>
            <span className="sm:hidden">خلل</span>
          </button>
          <button
            onClick={() => {
              setTransitionEffect('cyber_shutter');
              soundEngine.playWhoosh();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code flex items-center gap-1 ${
              transitionEffect === 'cyber_shutter' ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/50' : 'text-slate-400 hover:text-indigo-300'
            }`}
            title="انتقال غالق سيبراني هندسي (Cyber Shutter)"
          >
            <Layers className="w-3 h-3 text-indigo-300" />
            <span className="hidden md:inline">غالق</span>
          </button>
          <button
            onClick={() => {
              setTransitionEffect('fade');
              soundEngine.playRadarPing();
            }}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-mono-code ${
              transitionEffect === 'fade' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="تلاشي سينمائي كلاسيكي (Fade)"
          >
            تلاشي
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              setAspectRatio('cinematic');
              soundEngine.playRadarPing();
            }}
            className={`p-1.5 rounded transition-colors ${
              aspectRatio === 'cinematic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="سينمائي عريض (2.39:1 Anamorphic)"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAspectRatio('standard');
              soundEngine.playRadarPing();
            }}
            className={`p-1.5 rounded transition-colors ${
              aspectRatio === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="شاشة قياسية (16:9 Presentation)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAspectRatio('vertical');
              soundEngine.playRadarPing();
            }}
            className={`p-1.5 rounded transition-colors ${
              aspectRatio === 'vertical' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="ستوري وقصص جوال (9:16 Mobile)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtitles Toggle & Language */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              setShowSubtitles(!showSubtitles);
              soundEngine.playRadarPing();
            }}
            className={`px-2 py-1 rounded font-mono-code transition-colors ${
              showSubtitles ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="إظهار / إخفاء شريط الترجمة والنص الصوتي"
          >
            CC
          </button>
          {showSubtitles && (
            <button
              onClick={() => {
                const nextLang = subtitleLang === 'ar' ? 'both' : subtitleLang === 'both' ? 'en' : 'ar';
                setSubtitleLang(nextLang);
                soundEngine.playRadarPing();
              }}
              className="px-1.5 py-1 text-[11px] text-slate-300 hover:text-white font-mono-code"
              title="تغيير لغة الترجمة (عربي / إنجليزي / كلاهما)"
            >
              {subtitleLang.toUpperCase()}
            </button>
          )}
        </div>

        {/* Voiceover Speech Toggle */}
        <button
          onClick={() => {
            setVoiceoverEnabled(!voiceoverEnabled);
            soundEngine.playRadarPing();
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono-code transition-all flex items-center gap-1 border ${
            voiceoverEnabled
              ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title="تفعيل أو كتم التعليق الصوتي العربي الاحترافي (V)"
        >
          <Sparkles className={`w-3.5 h-3.5 ${voiceoverEnabled ? 'text-yellow-400' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">صوت الراوي</span>
        </button>

        {/* Volume Normalization Feature Toggle & Live Acoustic Gain Badge */}
        {setVoiceoverNormalizationEnabled && (
          <button
            onClick={() => {
              const nextState = !voiceoverNormalizationEnabled;
              setVoiceoverNormalizationEnabled(nextState);
              soundEngine.playRadarPing();
            }}
            className={`px-2 py-1 rounded-lg text-xs font-mono-code transition-all flex items-center gap-1.5 border ${
              voiceoverNormalizationEnabled
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`مساواة مستوى الصوت تلقائياً حسب مدة المشهد (Auto Volume Normalization)\nالحالة: ${
              voiceoverNormalizationEnabled ? 'مُفعّل' : 'معطّل'
            }\nالمشهد: ${normalizationMetrics?.sceneDuration ?? 10} ثوانٍ\nالمستوى المعاير: ${
              Math.round((normalizationMetrics?.normalizedVolume ?? 0.92) * 100)
            }%\nالنمط: ${normalizationMetrics?.profileName ?? 'توازن سينمائي'}`}
          >
            <Gauge className={`w-3.5 h-3.5 ${voiceoverNormalizationEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden lg:inline">معايرة الصوت</span>
            <span className={`text-[10px] px-1 py-0.2 rounded border font-mono-code ${
              voiceoverNormalizationEnabled 
                ? 'bg-emerald-900/60 border-emerald-500/40 text-emerald-200' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {voiceoverNormalizationEnabled
                ? `${Math.round((normalizationMetrics?.normalizedVolume ?? 0.92) * 100)}%`
                : 'OFF'}
            </span>
          </button>
        )}

        {/* Master Sound Effects Mute Toggle */}
        <button
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            soundEngine.setMuted(nextMuted);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            isMuted
              ? 'bg-red-950/60 border-red-500/50 text-red-400'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isMuted ? 'إلغاء كتم المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};
