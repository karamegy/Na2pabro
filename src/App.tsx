import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Tv, 
  Monitor, 
  Smartphone, 
  ExternalLink, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { SCENES, OFFICIAL_CTA_URL, voSynthesizer } from './utils/voiceover';
import { soundEngine } from './utils/soundEngine';
import { AspectRatioMode, VideoFilterMode, SceneTransitionEffect, VolumeNormalizationMetrics } from './types';
import { getSceneTransitionVariants } from './utils/sceneTransitions';

// Components
import { VideoPlayerHeader } from './components/VideoPlayerHeader';
import { TimelineController } from './components/TimelineController';
import { SubtitlesOverlay } from './components/SubtitlesOverlay';
import { InteractiveSandboxDrawer } from './components/InteractiveSandboxDrawer';
import { TechHotspotsOverlay } from './components/TechHotspotsOverlay';
import { VideoEffectsOverlay } from './components/VideoEffectsOverlay';
import { SceneTransitionOverlay } from './components/SceneTransitionOverlay';
import { InteractiveFleetAnalyticsPanel } from './components/InteractiveFleetAnalyticsPanel';

// Scenes
import { Scene1Intro } from './components/scenes/Scene1Intro';
import { Scene2MultiTenant } from './components/scenes/Scene2MultiTenant';
import { Scene3TrackingConflict } from './components/scenes/Scene3TrackingConflict';
import { Scene4Financial5Cards } from './components/scenes/Scene4Financial5Cards';
import { Scene5MaintenanceGeminiOCR } from './components/scenes/Scene5MaintenanceGeminiOCR';
import { Scene6CallToAction } from './components/scenes/Scene6CallToAction';

export default function App() {
  const TOTAL_DURATION = 60.0; // 60-second video

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('standard');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [subtitleLang, setSubtitleLang] = useState<'ar' | 'en' | 'both'>('both');
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);
  const [hotspotsEnabled, setHotspotsEnabled] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<VideoFilterMode>('none');
  const [transitionEffect, setTransitionEffect] = useState<SceneTransitionEffect>('digital_wipe');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceoverNormalizationEnabled, setVoiceoverNormalizationEnabled] = useState<boolean>(true);
  const [normalizationMetrics, setNormalizationMetrics] = useState<VolumeNormalizationMetrics | null>(() => {
    return voSynthesizer.calculateNormalization(SCENES[0].voiceoverAr, SCENES[0].endTime - SCENES[0].startTime);
  });

  const lastSceneIndexRef = useRef<number>(-1);
  const lastTimeRef = useRef<number>(performance.now());
  const requestRef = useRef<number | null>(null);

  // Subscribe to voiceover normalization updates
  useEffect(() => {
    return voSynthesizer.onNormalizationMetricsChange((metrics) => {
      setNormalizationMetrics(metrics);
    });
  }, []);

  // Compute active scene from currentTime
  const activeSceneIndex = SCENES.findIndex(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );
  const safeSceneIndex = activeSceneIndex >= 0 ? activeSceneIndex : SCENES.length - 1;
  const currentScene = SCENES[safeSceneIndex];

  // Normalized progress within current scene (0 to 1)
  const sceneDuration = currentScene.endTime - currentScene.startTime;
  const sceneProgress = Math.max(
    0,
    Math.min(1, (currentTime - currentScene.startTime) / sceneDuration)
  );

  // Trigger voiceover when scene changes with volume normalization based on detected scene duration
  const speakCurrentScene = useCallback((sceneIdx: number, customRemainingDuration?: number) => {
    if (!voiceoverEnabled) return;
    const scene = SCENES[sceneIdx];
    if (scene) {
      setIsSpeaking(true);
      const sceneFullDuration = scene.endTime - scene.startTime;
      const detectedDuration = customRemainingDuration !== undefined && customRemainingDuration > 1
        ? customRemainingDuration
        : sceneFullDuration;

      voSynthesizer.speak(scene.voiceoverAr, {
        pitch: 1.02,
        sceneDuration: detectedDuration,
        autoNormalize: voiceoverNormalizationEnabled,
      });

      // Reset speaking state after expected duration
      const durationMs = detectedDuration * 1000;
      setTimeout(() => setIsSpeaking(false), durationMs);
    }
  }, [voiceoverEnabled, voiceoverNormalizationEnabled]);

  // Main playback animation loop
  useEffect(() => {
    const updatePlayback = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying && !isInteractiveMode) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackRate;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      }

      requestRef.current = requestAnimationFrame(updatePlayback);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updatePlayback);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, isInteractiveMode, playbackRate]);

  // Check for scene transition to trigger voiceover and transition sound effect
  useEffect(() => {
    if (safeSceneIndex !== lastSceneIndexRef.current) {
      lastSceneIndexRef.current = safeSceneIndex;
      if (transitionEffect === 'glitch') {
        soundEngine.playGlitchTransition();
      } else if (transitionEffect === 'digital_wipe') {
        soundEngine.playDigitalWipe();
      } else {
        soundEngine.playWhoosh();
      }
      if (isPlaying && voiceoverEnabled) {
        speakCurrentScene(safeSceneIndex);
      }
    }
  }, [safeSceneIndex, isPlaying, voiceoverEnabled, speakCurrentScene, transitionEffect]);

  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setShortcutFeedback(msg);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setShortcutFeedback(null);
    }, 900);
  }, []);

  // Stop speech when pausing
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const willPlay = !prev;
      if (!willPlay) {
        voSynthesizer.pause();
        showFeedback('⏸ إيقاف مؤقت (Space)');
      } else {
        soundEngine.startCyberAmbient();
        showFeedback('▶ تشغيل (Space)');
        setCurrentTime((t) => {
          if (t >= TOTAL_DURATION) {
            speakCurrentScene(0);
            return 0;
          } else {
            voSynthesizer.resume();
            return t;
          }
        });
      }
      return willPlay;
    });
  }, [showFeedback, speakCurrentScene]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    const newIdx = SCENES.findIndex((s) => time >= s.startTime && time < s.endTime);
    if (newIdx >= 0 && newIdx !== lastSceneIndexRef.current) {
      lastSceneIndexRef.current = newIdx;
      const remainingDuration = Math.max(1.5, SCENES[newIdx].endTime - time);
      speakCurrentScene(newIdx, remainingDuration);
    }
  }, [speakCurrentScene]);

  const handleReplay = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastSceneIndexRef.current = 0;
    speakCurrentScene(0);
    showFeedback('↺ إعادة تشغيل من البداية');
  }, [speakCurrentScene, showFeedback]);

  // Toggle voiceover volume normalization
  const handleToggleNormalization = useCallback((forcedState?: boolean) => {
    setVoiceoverNormalizationEnabled((prev) => {
      const next = forcedState !== undefined ? forcedState : !prev;
      voSynthesizer.setAutoNormalization(next);
      if (next) {
        showFeedback('🔊 تفعيل مساواة الصوت الذكية (N)');
        soundEngine.playRadarPing();
      } else {
        showFeedback('🔈 تعطيل مساواة الصوت (مستوى افتراضي) (N)');
        soundEngine.playRadarPing();
      }
      return next;
    });
  }, [showFeedback]);

  // Toggle Interactive Hands-on Mode with Real-Time Fleet Analytics
  const handleToggleInteractiveMode = useCallback(() => {
    setIsInteractiveMode((prev) => {
      const next = !prev;
      soundEngine.playRadarPing();
      if (next) {
        showFeedback('⚡ تفعيل وضع التجربة التفاعلية ولوحة التحليلات الحية (I)');
      } else {
        showFeedback('🎬 العودة لوضع العرض السينمائي (I)');
      }
      return next;
    });
  }, [showFeedback]);

  // Handle next / previous scene jumps with active transition sound
  const playCurrentTransitionSound = useCallback(() => {
    if (transitionEffect === 'glitch') {
      soundEngine.playGlitchTransition();
    } else if (transitionEffect === 'digital_wipe') {
      soundEngine.playDigitalWipe();
    } else {
      soundEngine.playWhoosh();
    }
  }, [transitionEffect]);

  const handleNextScene = useCallback(() => {
    playCurrentTransitionSound();
    const nextIdx = Math.min(SCENES.length - 1, safeSceneIndex + 1);
    handleSeek(SCENES[nextIdx].startTime);
    showFeedback(`⏭ المشهد التالي: ${SCENES[nextIdx].titleAr} (→)`);
  }, [safeSceneIndex, handleSeek, showFeedback, playCurrentTransitionSound]);

  const handlePrevScene = useCallback(() => {
    playCurrentTransitionSound();
    const prevIdx = Math.max(0, safeSceneIndex - 1);
    handleSeek(SCENES[prevIdx].startTime);
    showFeedback(`⏮ المشهد السابق: ${SCENES[prevIdx].titleAr} (←)`);
  }, [safeSceneIndex, handleSeek, showFeedback, playCurrentTransitionSound]);

  // Cycle through transition effects (Digital Wipe -> Glitch -> Cyber Shutter -> Fade)
  const handleCycleTransition = useCallback(() => {
    setTransitionEffect((current) => {
      let next: SceneTransitionEffect = 'digital_wipe';
      if (current === 'digital_wipe') next = 'glitch';
      else if (current === 'glitch') next = 'cyber_shutter';
      else if (current === 'cyber_shutter') next = 'fade';
      else next = 'digital_wipe';

      if (next === 'digital_wipe') {
        soundEngine.playDigitalWipe();
        showFeedback('⚡ انتقال: مسح رقمي ليزري (T)');
      } else if (next === 'glitch') {
        soundEngine.playGlitchTransition();
        showFeedback('⚡ انتقال: خلل تقني وتشويش RGB (T)');
      } else if (next === 'cyber_shutter') {
        soundEngine.playWhoosh();
        showFeedback('⚡ انتقال: غالق سيبراني هندسي (T)');
      } else {
        soundEngine.playRadarPing();
        showFeedback('⚡ انتقال: تلاشي سينمائي (T)');
      }

      return next;
    });
  }, [showFeedback]);

  // Cycle through visual filter modes (Normal -> VHS -> Night Vision -> Monochrome)
  const handleCycleFilter = useCallback(() => {
    setFilterMode((current) => {
      let next: VideoFilterMode = 'none';
      if (current === 'none') next = 'vhs';
      else if (current === 'vhs') next = 'night_vision';
      else if (current === 'night_vision') next = 'monochrome';
      else next = 'none';

      if (next === 'vhs') {
        soundEngine.playWhoosh();
        showFeedback('📼 مؤثر بصري: VHS Glitch (F)');
      } else if (next === 'night_vision') {
        soundEngine.playBiometricScan();
        showFeedback('🟢 مؤثر بصري: Night Vision FLIR (F)');
      } else if (next === 'monochrome') {
        soundEngine.playRadarPing();
        showFeedback('🎬 مؤثر بصري: Monochrome Noir (F)');
      } else {
        soundEngine.playRadarPing();
        showFeedback('✨ مؤثر بصري: عادي (F)');
      }

      return next;
    });
  }, [showFeedback]);

  // Keyboard shortcut listener: Space (Play/Pause), ArrowRight/ArrowLeft (Jump scenes), F (Cycle Filters), T (Cycle Transitions)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextScene();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevScene();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleCycleFilter();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        handleCycleTransition();
      } else if (e.code === 'KeyN') {
        e.preventDefault();
        handleToggleNormalization();
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        handleToggleInteractiveMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleTogglePlay, handleNextScene, handlePrevScene, handleCycleFilter, handleCycleTransition, handleToggleNormalization, handleToggleInteractiveMode]);

  // Select scene from drawer
  const handleSelectSceneFromDrawer = (index: number) => {
    const targetScene = SCENES[index];
    if (targetScene) {
      handleSeek(targetScene.startTime);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* 1. Header Toolbar */}
      <VideoPlayerHeader
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        voiceoverEnabled={voiceoverEnabled}
        setVoiceoverEnabled={setVoiceoverEnabled}
        voiceoverNormalizationEnabled={voiceoverNormalizationEnabled}
        setVoiceoverNormalizationEnabled={setVoiceoverNormalizationEnabled}
        normalizationMetrics={normalizationMetrics}
        showSubtitles={showSubtitles}
        setShowSubtitles={setShowSubtitles}
        subtitleLang={subtitleLang}
        setSubtitleLang={setSubtitleLang}
        isInteractiveMode={isInteractiveMode}
        setIsInteractiveMode={setIsInteractiveMode}
        hotspotsEnabled={hotspotsEnabled}
        setHotspotsEnabled={setHotspotsEnabled}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        transitionEffect={transitionEffect}
        setTransitionEffect={setTransitionEffect}
        activeSceneTitle={currentScene.titleAr}
      />

      {/* 2. Main Video Viewport Container with Dynamic Aspect Ratio */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden">
        {/* Dynamic Aspect Ratio Box */}
        <div
          className={`relative w-full mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 transition-all duration-500 ${
            aspectRatio === 'cinematic'
              ? 'max-w-6xl aspect-[2.39/1] min-h-[380px] md:min-h-[520px]'
              : aspectRatio === 'vertical'
              ? 'max-w-md aspect-[9/16] min-h-[580px]'
              : 'max-w-5xl aspect-[16/9] min-h-[420px] md:min-h-[560px]'
          }`}
        >
          {/* Active Scene Content */}
          <div 
            className="w-full h-full relative transition-all duration-300"
            style={
              filterMode === 'night_vision'
                ? { filter: 'sepia(100%) hue-rotate(85deg) saturate(380%) contrast(140%) brightness(95%)' }
                : filterMode === 'monochrome'
                ? { filter: 'grayscale(100%) contrast(140%) brightness(95%)' }
                : filterMode === 'vhs'
                ? { filter: 'contrast(125%) saturate(145%) hue-rotate(-5deg)' }
                : undefined
            }
          >
            <AnimatePresence mode="wait">
              {safeSceneIndex === 0 && (
                <motion.div
                  key="scene-1"
                  variants={getSceneTransitionVariants(transitionEffect)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <Scene1Intro
                    playbackProgress={sceneProgress}
                    isInteractive={isInteractiveMode}
                  />
                </motion.div>
              )}

              {safeSceneIndex === 1 && (
                <motion.div
                  key="scene-2"
                  variants={getSceneTransitionVariants(transitionEffect)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <Scene2MultiTenant
                    playbackProgress={sceneProgress}
                    isInteractive={isInteractiveMode}
                  />
                </motion.div>
              )}

              {safeSceneIndex === 2 && (
                <motion.div
                  key="scene-3"
                  variants={getSceneTransitionVariants(transitionEffect)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <Scene3TrackingConflict
                    playbackProgress={sceneProgress}
                    isInteractive={isInteractiveMode}
                  />
                </motion.div>
              )}

              {safeSceneIndex === 3 && (
                <motion.div
                  key="scene-4"
                  variants={getSceneTransitionVariants(transitionEffect)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <Scene4Financial5Cards
                    playbackProgress={sceneProgress}
                    isInteractive={isInteractiveMode}
                  />
                </motion.div>
              )}

              {safeSceneIndex === 4 && (
                <motion.div
                  key="scene-5"
                  variants={getSceneTransitionVariants(transitionEffect)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <Scene5MaintenanceGeminiOCR
                    playbackProgress={sceneProgress}
                    isInteractive={isInteractiveMode}
                  />
                </motion.div>
              )}

              {safeSceneIndex === 5 && (
                <motion.div
                  key="scene-6"
                  variants={getSceneTransitionVariants(transitionEffect)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <Scene6CallToAction
                    playbackProgress={sceneProgress}
                    onReplay={handleReplay}
                    isInteractive={isInteractiveMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Scene Transition Visual Overlay */}
          <SceneTransitionOverlay
            activeSceneIndex={safeSceneIndex}
            transitionEffect={transitionEffect}
          />

          {/* Keyboard Shortcut HUD Toast Feedback */}
          <AnimatePresence>
            {shortcutFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-cyan-400/60 text-cyan-200 px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{shortcutFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Effect Filters Overlay (VHS Glitch, Night Vision, Monochrome) */}
          <VideoEffectsOverlay
            filterMode={filterMode}
            currentTime={currentTime}
          />

          {/* Interactive Tech Hotspots Overlay */}
          <TechHotspotsOverlay
            currentTime={currentTime}
            activeSceneId={currentScene.id}
            isPlaying={isPlaying}
            onPauseForInspection={() => {
              setIsPlaying(false);
              voSynthesizer.pause();
              showFeedback('⏸ إيقاف مؤقت لفحص المواصفات');
            }}
            hotspotsEnabled={hotspotsEnabled}
          />

          {/* Subtitles Overlay */}
          <SubtitlesOverlay
            currentScene={currentScene}
            showSubtitles={showSubtitles}
            subtitleLang={subtitleLang}
            isSpeaking={isSpeaking}
            onVoiceNarrate={() => speakCurrentScene(safeSceneIndex)}
            normalizationMetrics={normalizationMetrics}
          />

          {/* Real-time Fleet Performance Analytics Panel in Interactive Mode */}
          <InteractiveFleetAnalyticsPanel
            isVisible={isInteractiveMode}
            onClose={() => setIsInteractiveMode(false)}
            currentSceneTitle={currentScene.titleAr}
            playbackProgress={sceneProgress}
          />

          {/* Cinematic Letterbox Bars in Cinematic Aspect Ratio */}
          {aspectRatio === 'cinematic' && (
            <>
              <div className="absolute top-0 inset-x-0 h-4 bg-black pointer-events-none z-30" />
              <div className="absolute bottom-0 inset-x-0 h-4 bg-black pointer-events-none z-30" />
            </>
          )}
        </div>
      </main>

      {/* 3. Bottom Timeline Scrubber & Player Controls */}
      <TimelineController
        currentTime={currentTime}
        totalDuration={TOTAL_DURATION}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onReplay={handleReplay}
        playbackRate={playbackRate}
        onChangePlaybackRate={setPlaybackRate}
        activeSceneIndex={safeSceneIndex}
      />

      {/* 4. Interactive Sandbox Drawer for Quick Testing */}
      <InteractiveSandboxDrawer
        currentSceneIndex={safeSceneIndex}
        onSelectScene={handleSelectSceneFromDrawer}
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        normalizationMetrics={normalizationMetrics}
        normalizationEnabled={voiceoverNormalizationEnabled}
        onToggleNormalization={handleToggleNormalization}
      />
    </div>
  );
}
