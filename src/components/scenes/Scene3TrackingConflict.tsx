import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, AlertOctagon, CheckCircle2, Zap, Truck, Clock, ShieldAlert, Cpu, Gauge, Fuel } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { TruckTelemetry, DriverConflictEvent } from '../../types';

interface Scene3Props {
  playbackProgress: number;
  isInteractive?: boolean;
}

const TRUCKS: TruckTelemetry[] = [
  {
    id: 'TRK-104',
    plateNumber: 'ط ر ق ٨٤٩٢',
    driverName: 'كابتن / أحمد محمود',
    driverPhone: '+20 102 994 8812',
    origin: 'ميناء الإسكندرية',
    destination: 'الميناء الجاف - 6 أكتوبر',
    progressPercent: 68,
    speedKmH: 86,
    fuelPercent: 74,
    cargoType: 'حاويات مبردة (أدوية ومواد غذائية)',
    cargoWeightKg: 28400,
    tempCelsius: -18,
    status: 'in_transit',
    coords: { x: 38, y: 35 },
  },
  {
    id: 'TRK-208',
    plateNumber: 'ب ن س ٥١٩٠',
    driverName: 'كابتن / تامر حسني',
    driverPhone: '+20 114 832 1099',
    origin: 'ميناء السخنة',
    destination: 'مستودعات العاشر من رمضان',
    progressPercent: 42,
    speedKmH: 91,
    fuelPercent: 82,
    cargoType: 'بضائع مصنعة ومعدات كهربائية',
    cargoWeightKg: 34100,
    status: 'conflict_resolved',
    coords: { x: 68, y: 55 },
  },
  {
    id: 'TRK-315',
    plateNumber: 'س و ز ٧٢٤١',
    driverName: 'كابتن / هشام فاروق',
    driverPhone: '+20 100 451 9023',
    origin: 'ميناء دمياط',
    destination: 'المنطقة الصناعية - السادات',
    progressPercent: 85,
    speedKmH: 82,
    fuelPercent: 61,
    cargoType: 'حبوب قمح خام (صب)',
    cargoWeightKg: 42800,
    status: 'in_transit',
    coords: { x: 50, y: 25 },
  },
];

export const Scene3TrackingConflict: React.FC<Scene3Props> = ({ playbackProgress, isInteractive }) => {
  const [selectedTruck, setSelectedTruck] = useState<TruckTelemetry>(TRUCKS[0]);
  const [conflictState, setConflictState] = useState<'normal' | 'alert' | 'resolving' | 'resolved'>('alert');
  const [conflict, setConflict] = useState<DriverConflictEvent>({
    conflictId: 'CONF-8841',
    driverName: 'كابتن / تامر حسني',
    tripA: 'رحلة #8841 (السخنة -> العاشر)',
    tripB: 'رحلة #8845 (العاشر -> دمياط)',
    overlapWindow: 'تداخل 55 دقيقة في جدول المواعيد',
    severity: 'critical',
    autoSolution: 'إعادة جدولة فورية وتكليف كابتن هشام كبديل معتمد',
  });

  // Timeline sync: Alert triggered at ~0.25, resolved at ~0.60
  useEffect(() => {
    if (playbackProgress < 0.25) {
      setConflictState('normal');
    } else if (playbackProgress >= 0.25 && playbackProgress < 0.55) {
      if (conflictState !== 'alert') {
        soundEngine.playConflictAlert(false);
      }
      setConflictState('alert');
    } else if (playbackProgress >= 0.55 && playbackProgress < 0.7) {
      setConflictState('resolving');
    } else if (playbackProgress >= 0.7) {
      if (conflictState !== 'resolved') {
        soundEngine.playConflictAlert(true);
      }
      setConflictState('resolved');
    }
  }, [playbackProgress]);

  const triggerManualConflict = () => {
    soundEngine.playConflictAlert(false);
    setConflictState('alert');
    setTimeout(() => {
      setConflictState('resolving');
      setTimeout(() => {
        setConflictState('resolved');
        soundEngine.playConflictAlert(true);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none bg-cyber-grid">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-tech text-xs">
              GPS SATELLITE TELEMETRY // AI DISPATCH
            </span>
            <span className="text-xs font-mono-code text-cyan-300">
              RADAR UPDATE: 1.0s REALTIME
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white mt-1">
            تتبع الشحنات الحي وخوارزميات منع تضارب السائقين
          </h2>
        </div>

        {/* Conflict Status Badge */}
        <div className="flex items-center gap-2">
          {conflictState === 'resolved' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold font-mono-code">تم حل التضارب في 12ms</span>
            </div>
          ) : conflictState === 'alert' || conflictState === 'resolving' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/60 text-amber-300 animate-pulse">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold">رصد تضارب في رحلات السائقين</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>مراقبة التضارب: مفعلة</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Radar Map View + Smart Driver Conflict Prevention HUD */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-2">
        {/* Radar Map & Live Convoy Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[290px]">
          {/* Radar Background Grid & Rotating Scanner Sweep */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-blue-500/20 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-t border-cyan-400/40 animate-radar" />
          </div>

          {/* Map Corridors & Interactive Truck Nodes */}
          <div className="relative z-10 flex-1 w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-blue-300">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                شبكة الطرق اللوجستية النشطة (EGYPT CORRIDORS)
              </span>
              <span className="text-emerald-400">3 شاحنات تحت المراقبة اللحظية</span>
            </div>

            {/* Stylized Vector Route Canvas */}
            <div className="relative w-full h-48 bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
              {/* Highway Curves (SVG) */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Route Alexandria -> Cairo */}
                <path
                  d="M 60 50 Q 140 90 220 120"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  fill="none"
                  className="opacity-70"
                />
                {/* Route Suez -> 10th Ramadan */}
                <path
                  d="M 360 140 Q 300 110 220 120"
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  fill="none"
                  className="opacity-70"
                />
                {/* Route Damietta -> Sadat City */}
                <path
                  d="M 280 40 Q 240 80 160 110"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  fill="none"
                  className="opacity-70"
                />
              </svg>

              {/* Waypoint Labels */}
              <span className="absolute top-3 left-4 text-[10px] font-mono-code text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                الإسكندرية (الميناء البحري)
              </span>
              <span className="absolute bottom-3 left-1/3 text-[10px] font-mono-code text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                الميناء الجاف 6 أكتوبر
              </span>
              <span className="absolute bottom-6 right-4 text-[10px] font-mono-code text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                ميناء السخنة
              </span>

              {/* Interactive Truck Marker Pins */}
              {TRUCKS.map((truck) => {
                const isSelected = selectedTruck.id === truck.id;
                return (
                  <button
                    key={truck.id}
                    onClick={() => {
                      setSelectedTruck(truck);
                      soundEngine.playRadarPing();
                    }}
                    style={{ left: `${truck.coords.x}%`, top: `${truck.coords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                      isSelected
                        ? 'bg-blue-500 ring-4 ring-blue-500/40 z-20 scale-125 shadow-lg shadow-blue-500/50'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 z-10'
                    }`}
                    title={truck.plateNumber}
                  >
                    <Truck className="w-3.5 h-3.5 text-white" />
                    {/* Live ping ring */}
                    <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-70 pointer-events-none" />
                  </button>
                );
              })}
            </div>

            {/* Selected Truck Live Telemetry Strip */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">{selectedTruck.plateNumber}</span>
                <span className="text-slate-400 font-mono-code text-[11px]">({selectedTruck.driverName})</span>
              </div>

              <div className="flex items-center gap-4 text-slate-300 font-mono-code text-[11px]">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedTruck.speedKmH} كم/س</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{selectedTruck.fuelPercent}%</span>
                </div>
                <div className="text-cyan-300 font-bold">
                  {selectedTruck.progressPercent}% تم إنجازه
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Driver Conflict Prevention Algorithm Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-purple-500/30 rounded-2xl p-5 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono-code">
              <span className="flex items-center gap-1 text-purple-300">
                <Cpu className="w-4 h-4 text-purple-400" />
                خوارزمية الذكاء الاصطناعي لمنع التضارب
              </span>
              <span className="text-slate-500">v10-CONFLICT-ENGINE</span>
            </div>

            {/* Dynamic Conflict HUD Card */}
            <AnimatePresence mode="wait">
              {conflictState === 'alert' && (
                <motion.div
                  key="alert-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/60 text-right space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                    <AlertOctagon className="w-4 h-4 animate-bounce" />
                    <span>تنبيه: تضارب في جدول رحلات السائق!</span>
                  </div>
                  <div className="text-xs text-slate-200">
                    السائق: <span className="font-bold text-white">{conflict.driverName}</span>
                  </div>
                  <div className="text-[11px] font-mono-code text-slate-300 bg-red-900/30 p-2 rounded border border-red-500/30 space-y-1">
                    <div>• {conflict.tripA}</div>
                    <div>• {conflict.tripB}</div>
                    <div className="text-amber-400 font-bold">🚨 {conflict.overlapWindow}</div>
                  </div>
                  <div className="text-[11px] text-red-300">
                    جاري تشغيل خوارزمية الحل التلقائي لمنع التعطيل اللوجستي...
                  </div>
                </motion.div>
              )}

              {conflictState === 'resolving' && (
                <motion.div
                  key="resolving-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/60 text-center space-y-3"
                >
                  <div className="w-8 h-8 mx-auto rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                  <div className="text-xs font-bold text-purple-300">
                    تحليل المسارات وحساب فترات الراحة والتكليف البديل...
                  </div>
                  <div className="text-[10px] font-mono-code text-slate-400">
                    ALGORITHM: NEURAL_DISPATCH_V10 // RESOLUTION TIME: &lt;15ms
                  </div>
                </motion.div>
              )}

              {conflictState === 'resolved' && (
                <motion.div
                  key="resolved-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/60 text-right space-y-2.5 shadow-lg shadow-emerald-500/10"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حل التضارب آلياً بنجاح في 12ms</span>
                  </div>
                  <div className="text-xs text-slate-200">
                    الحل المطبق: <span className="font-semibold text-emerald-300">{conflict.autoSolution}</span>
                  </div>
                  <div className="text-[11px] font-mono-code text-slate-300 bg-emerald-900/30 p-2 rounded border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>• وقت التأخير المحقق:</span>
                      <span className="text-emerald-400 font-bold">0.0 دقيقة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• توفير استهلاك الوقود:</span>
                      <span className="text-cyan-300 font-bold">+18.4% تحسين</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    تم إرسال إشعار فوري لتطبيق السائقين وتحديث المسار تلقائياً.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Simulation Trigger */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={triggerManualConflict}
              className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>محاكاة رصد تضارب جديد</span>
            </button>

            <span className="text-[10px] font-mono-code text-slate-500">
              ZERO-OVERLAP GUARANTEE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-purple-400">DISPATCH_AI: RUNNING</span>
          <span className="hidden sm:inline">PREVENTED_CONFLICTS_TODAY: 47 TRIPS</span>
        </div>
        <span className="text-slate-500">Na2la V10 PRO Fleet Intelligence</span>
      </div>
    </div>
  );
};
