import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Rewind, 
  Clock, 
  Layers
} from 'lucide-react';
import { SCENES } from '../utils/voiceover';
import { TECH_HOTSPOTS } from '../data/hotspots';
import { soundEngine } from '../utils/soundEngine';

interface TimelineControllerProps {
  currentTime: number; // in seconds (0 to 60)
  totalDuration: number; // 60
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (targetTime: number) => void;
  onReplay: () => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  activeSceneIndex: number;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onReplay,
  playbackRate,
  onChangePlaybackRate,
  activeSceneIndex,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const target = ratio * totalDuration;
    soundEngine.playRadarPing();
    onSeek(target);
  };

  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800 backdrop-blur-md px-3 py-3 select-none z-30">
      {/* 1. Main Scrubber Bar with Scene Slices */}
      <div
        onClick={handleScrubClick}
        className="group relative w-full h-3 bg-slate-900 rounded-full cursor-pointer overflow-hidden border border-slate-800 hover:border-slate-700 transition-all mb-2.5"
      >
        {/* Progress Bar Fill */}
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-75 relative shadow-[0_0_12px_rgba(56,189,248,0.7)]"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Glowing head handle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg border border-cyan-300" />
        </div>

        {/* Scene Separator Markers */}
        {SCENES.map((scene) => {
          const leftPercent = (scene.startTime / totalDuration) * 100;
          return (
            <div
              key={scene.id}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-700/80 pointer-events-none z-10"
              title={`${scene.titleAr} (${scene.startTime}s)`}
            />
          );
        })}

        {/* Hotspot Markers on Timeline */}
        {TECH_HOTSPOTS.map((hs) => {
          const leftPercent = (hs.startTime / totalDuration) * 100;
          return (
            <div
              key={hs.id}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0.5 bottom-0.5 w-1 rounded-full bg-cyan-400/70 hover:bg-cyan-200 z-20 pointer-events-none shadow-[0_0_6px_rgba(34,211,238,0.8)]"
              title={`نقطة مواصفات تقنية: ${hs.titleAr} (${hs.startTime}s)`}
            />
          );
        })}
      </div>

      {/* 2. Scene Chapter Selectors (6 scenes across 60 seconds) */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2.5">
        {SCENES.map((scene, idx) => {
          const isActive = activeSceneIndex === idx;
          return (
            <button
              key={scene.id}
              onClick={() => {
                soundEngine.playWhoosh();
                onSeek(scene.startTime);
              }}
              className={`p-1 sm:p-1.5 rounded-lg text-right transition-all border text-[10px] sm:text-xs truncate ${
                isActive
                  ? 'bg-slate-900 border-cyan-400/80 text-cyan-300 font-bold shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-mono-code text-[9px] text-slate-500 mb-0.5">
                <span>#{scene.id}</span>
                <span>{scene.startTime}s-{scene.endTime}s</span>
              </div>
              <div className="truncate font-sans font-medium">{scene.titleAr}</div>
            </button>
          );
        })}
      </div>

      {/* 3. Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Play/Pause & Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onTogglePlay();
            }}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-blue-500/30 transition-all"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الفيديو السينمائي'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              soundEngine.playRadarPing();
              onSeek(Math.max(0, currentTime - 5));
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="رجوع 5 ثوانٍ"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundEngine.playRadarPing();
              onSeek(Math.min(totalDuration, currentTime + 5));
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="تقديم 5 ثوانٍ"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onReplay();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="إعادة تشغيل من البداية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timecode Readout & Shortcut Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono-code text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(totalDuration)}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono-code text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">Space</kbd>
              <span>تشغيل/إيقاف</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">← →</kbd>
              <span>تنقل المشاهد</span>
            </div>
          </div>
        </div>

        {/* Speed Multiplier (0.5x, 1x, 1.25x, 1.5x) */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 font-mono-code text-[11px]">
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => onChangePlaybackRate(rate)}
              className={`px-2 py-1 rounded transition-colors ${
                playbackRate === rate ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
