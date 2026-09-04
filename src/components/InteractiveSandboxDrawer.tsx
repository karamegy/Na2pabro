import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  MapPin, 
  AlertOctagon, 
  BarChart3, 
  Wrench, 
  Scan, 
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Fuel,
  Activity,
  Gauge,
  SlidersHorizontal
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { OFFICIAL_CTA_URL } from '../utils/voiceover';
import { VolumeNormalizationMetrics } from '../types';
import { FleetEfficiencyAnalytics } from './FleetEfficiencyAnalytics';

interface InteractiveSandboxDrawerProps {
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  normalizationMetrics?: VolumeNormalizationMetrics | null;
  normalizationEnabled?: boolean;
  onToggleNormalization?: () => void;
}

export const InteractiveSandboxDrawer: React.FC<InteractiveSandboxDrawerProps> = ({
  currentSceneIndex,
  onSelectScene,
  isOpen,
  onToggle,
  normalizationMetrics,
  normalizationEnabled = true,
  onToggleNormalization,
}) => {
  const [drawerTab, setDrawerTab] = useState<'scenes' | 'efficiency'>('scenes');

  const modules = [
    {
      index: 0,
      title: 'مقدمة المنصة والتحكم السحابي',
      desc: 'المشهد السينمائي للشاحنات وشبكة الطرق اللوجستية',
      icon: Layers,
      color: 'text-blue-400',
    },
    {
      index: 1,
      title: 'العزل السحابي ومصادقة البصمة',
      desc: 'فحص البصمة الحيوية وعزل بيانات الشركات بنظام Multi-Tenant',
      icon: Fingerprint,
      color: 'text-emerald-400',
    },
    {
      index: 2,
      title: 'تتبع الشحنات وخوارزميات منع التضارب',
      desc: 'رادار الطرق المباشر وحل تضارب مواعيد السائقين في 12ms',
      icon: AlertOctagon,
      color: 'text-purple-400',
    },
    {
      index: 3,
      title: 'الجدول الخماسي المالي المعتمد',
      desc: 'صافي الأرباح، الخزينة، الفواتير الآجلة والمجمعة بضغطة زر',
      icon: BarChart3,
      color: 'text-blue-400',
    },
    {
      index: 4,
      title: 'ذكاء Gemini Pro وقراءة بونات الميزان OCR',
      desc: 'استخراج أوزان الشحنات آلياً وتتبع الزوار برقم الشحنة',
      icon: Scan,
      color: 'text-emerald-400',
    },
    {
      index: 5,
      title: 'أسطورة الطريق والدعوة للانضمام (CTA)',
      desc: 'رابط المنصة الرسمي karamegy.github.io/Na2la ومشاركة النظام',
      icon: Sparkles,
      color: 'text-purple-400',
    },
  ];

  return (
    <>
      {/* Floating Launcher Button if closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-24 left-4 z-40 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/50 text-purple-200 text-xs font-bold shadow-xl shadow-purple-950/40 backdrop-blur-md flex items-center gap-2 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>لوحة الأنظمة وكفاءة الأسطول (V10)</span>
        </button>
      )}

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-start">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-slate-900 border-r border-slate-800 h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header Title & Close Button */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">
                    مركز تحكم Na2la V10 PRO
                  </h3>
                </div>
                <button
                  onClick={onToggle}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  إغلاق ✕
                </button>
              </div>

              {/* Navigation Tabs: Scenes vs Fleet Efficiency */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
                <button
                  onClick={() => {
                    setDrawerTab('scenes');
                    soundEngine.playWhoosh();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    drawerTab === 'scenes'
                      ? 'bg-purple-950/80 border border-purple-500/60 text-purple-200 shadow-md shadow-purple-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>المشاهد والأنظمة (6x)</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerTab('efficiency');
                    soundEngine.playRadarPing();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    drawerTab === 'efficiency'
                      ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Fuel className="w-4 h-4 text-emerald-400" />
                  <span>كفاءة الأسطول (Recharts)</span>
                </button>
              </div>

              {/* TAB 1: Scenes & Systems */}
              {drawerTab === 'scenes' && (
                <div>
                  <p className="text-xs text-slate-400 mb-3">
                    اختر أي نظام للانتقال المباشر وتجربته فورياً في العرض التفاعلي:
                  </p>

                  <div className="space-y-2.5">
                    {modules.map((mod) => {
                      const Icon = mod.icon;
                      const isActive = currentSceneIndex === mod.index;
                      return (
                        <button
                          key={mod.index}
                          onClick={() => {
                            soundEngine.playWhoosh();
                            onSelectScene(mod.index);
                            onToggle();
                          }}
                          className={`w-full p-3 rounded-xl border text-right transition-all flex items-start justify-between gap-3 ${
                            isActive
                              ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-500/10'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                              <Icon className={`w-4 h-4 ${mod.color}`} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white mb-0.5">{mod.title}</div>
                              <div className="text-[11px] text-slate-400 leading-normal">{mod.desc}</div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 mt-2 shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Voiceover Volume Normalization Telemetry Card */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-[11px] font-mono-code text-slate-400 space-y-2 shadow-md shadow-emerald-500/5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs">
                        <Gauge className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>محرك مساواة الصوت حسب مدة المشهد</span>
                      </div>
                      {onToggleNormalization && (
                        <button
                          onClick={() => {
                            soundEngine.playRadarPing();
                            onToggleNormalization();
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                            normalizationEnabled
                              ? 'bg-emerald-950 border-emerald-500/60 text-emerald-200'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {normalizationEnabled ? 'AUTO NORM: ON' : 'MANUAL: OFF'}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block">مدة المشهد المكتشفة:</span>
                        <span className="text-white font-bold text-xs">{normalizationMetrics?.sceneDuration ?? 10} ثوانٍ</span>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block">المستوى المعاير (Gain):</span>
                        <span className="text-emerald-300 font-bold text-xs">
                          {Math.round((normalizationMetrics?.normalizedVolume ?? 0.92) * 100)}% ({normalizationMetrics?.gainAdjustmentDb && normalizationMetrics.gainAdjustmentDb >= 0 ? `+${normalizationMetrics.gainAdjustmentDb}` : normalizationMetrics?.gainAdjustmentDb ?? 0} dB)
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block">كثافة النص المنطوق:</span>
                        <span className="text-cyan-300 font-bold text-xs">{normalizationMetrics?.speechDensityCharsPerSec ?? 13} حرف/ث</span>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block">الهدف الصوتي (Loudness):</span>
                        <span className="text-purple-300 font-bold text-xs">{normalizationMetrics?.targetLufs ?? -16} LUFS</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <span className="text-slate-500">النمط النشط:</span>
                      <span className="text-slate-200 font-medium">{normalizationMetrics?.profileName ?? 'توازن سينمائي قياسي'}</span>
                    </div>
                  </div>

                  {/* Keyboard Shortcuts Hint */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono-code text-slate-400 space-y-1.5">
                    <div className="font-bold text-slate-300 text-xs mb-1">اختصارات لوحة المفاتيح:</div>
                    <div className="flex items-center justify-between">
                      <span>تشغيل / إيقاف مؤقت:</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">Space</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>المشهد التالي / السابق:</span>
                      <div className="flex gap-1">
                        <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">→</kbd>
                        <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">←</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>تبديل الفلاتر (VHS / ليلي / أحادي):</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">F</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>تبديل تأثير الانتقال (مسح / خلل / غالق):</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">T</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>تبديل معايرة الصوت التلقائية (Volume Normalization):</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">N</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>تبديل الوضع التفاعلي وتحليلات الأسطول (Interactive Analytics):</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-800 text-purple-300 rounded border border-slate-700">I</kbd>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Fleet Efficiency Analytics (Powered by Recharts) */}
              {drawerTab === 'efficiency' && (
                <div>
                  <FleetEfficiencyAnalytics />
                </div>
              )}
            </div>

            {/* Bottom Official Link */}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <a
                href={OFFICIAL_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
              >
                <span>زيارة منصة Na2la الرسمية</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

