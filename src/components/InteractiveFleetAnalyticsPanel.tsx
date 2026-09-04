import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Fuel,
  Gauge,
  Zap,
  TrendingDown,
  TrendingUp,
  Truck,
  Clock,
  Navigation,
  Sliders,
  Maximize2,
  Minimize2,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  BarChart3,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Download,
  FileSpreadsheet,
  FileJson,
  ChevronDown,
  Check,
  FileText,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface InteractiveFleetAnalyticsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  currentSceneTitle?: string;
  playbackProgress?: number;
}

// Initial live streaming timeline telemetry data
interface LiveTelemetryPoint {
  timeLabel: string;
  traditionalFuel: number; // L / 100km
  na2laFuel: number;        // L / 100km
  traditionalSpeed: number; // km/h
  na2laSpeed: number;       // km/h
  congestionLevel: number;  // 0 - 100%
  savedEgpPerMin: number;
}

const INITIAL_STREAMING_DATA: LiveTelemetryPoint[] = [
  { timeLabel: '14:00', traditionalFuel: 36.2, na2laFuel: 27.4, traditionalSpeed: 48, na2laSpeed: 74, congestionLevel: 42, savedEgpPerMin: 140 },
  { timeLabel: '14:05', traditionalFuel: 37.5, na2laFuel: 27.8, traditionalSpeed: 44, na2laSpeed: 76, congestionLevel: 56, savedEgpPerMin: 165 },
  { timeLabel: '14:10', traditionalFuel: 38.1, na2laFuel: 26.9, traditionalSpeed: 41, na2laSpeed: 78, congestionLevel: 68, savedEgpPerMin: 195 },
  { timeLabel: '14:15', traditionalFuel: 36.8, na2laFuel: 27.1, traditionalSpeed: 46, na2laSpeed: 77, congestionLevel: 52, savedEgpPerMin: 172 },
  { timeLabel: '14:20', traditionalFuel: 35.9, na2laFuel: 26.4, traditionalSpeed: 52, na2laSpeed: 81, congestionLevel: 38, savedEgpPerMin: 180 },
  { timeLabel: '14:25', traditionalFuel: 38.4, na2laFuel: 27.0, traditionalSpeed: 39, na2laSpeed: 79, congestionLevel: 75, savedEgpPerMin: 220 },
  { timeLabel: '14:30', traditionalFuel: 36.5, na2laFuel: 26.6, traditionalSpeed: 49, na2laSpeed: 82, congestionLevel: 45, savedEgpPerMin: 185 },
];

// Corridor Speed & Velocity Benchmark Data
interface CorridorSpeedData {
  corridor: string;
  traditionalSpeed: number; // km/h
  na2laSpeed: number;        // km/h
  traditionalTimeMin: number;
  na2laTimeMin: number;
  timeSavedMin: number;
  fuelSavedLiters: number;
}

const CORRIDOR_BENCHMARKS: CorridorSpeedData[] = [
  { corridor: 'الإسكندرية الصحراوي', traditionalSpeed: 54, na2laSpeed: 79, traditionalTimeMin: 190, na2laTimeMin: 135, timeSavedMin: 55, fuelSavedLiters: 24.5 },
  { corridor: 'محور ميناء السخنة', traditionalSpeed: 50, na2laSpeed: 76, traditionalTimeMin: 125, na2laTimeMin: 88, timeSavedMin: 37, fuelSavedLiters: 17.2 },
  { corridor: 'طريق الدلتا الصناعي', traditionalSpeed: 38, na2laSpeed: 64, traditionalTimeMin: 140, na2laTimeMin: 94, timeSavedMin: 46, fuelSavedLiters: 19.8 },
  { corridor: 'محور الصعيد الحر', traditionalSpeed: 62, na2laSpeed: 84, traditionalTimeMin: 260, na2laTimeMin: 195, timeSavedMin: 65, fuelSavedLiters: 34.0 },
  { corridor: 'العاشر - السويس', traditionalSpeed: 46, na2laSpeed: 72, traditionalTimeMin: 95, na2laTimeMin: 65, timeSavedMin: 30, fuelSavedLiters: 13.6 },
];

// Live Dispatched Truck Units
interface LiveTruckTelemetry {
  id: string;
  plate: string;
  corridor: string;
  speed: number;
  fuelRate: number;
  status: 'optimal' | 'rerouting' | 'dispatching';
  driverScore: number;
}

export const InteractiveFleetAnalyticsPanel: React.FC<InteractiveFleetAnalyticsPanelProps> = ({
  isVisible,
  onClose,
  currentSceneTitle = 'المشهد الحالي',
}) => {
  const [activeTab, setActiveTab] = useState<'fuel' | 'speed' | 'units'>('fuel');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [trafficLoadPreset, setTrafficLoadPreset] = useState<'fluid' | 'standard' | 'congested'>('standard');
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2 | 5>(1);
  const [streamingData, setStreamingData] = useState<LiveTelemetryPoint[]>(INITIAL_STREAMING_DATA);

  // Dynamic Truck Fleet Units
  const [truckUnits, setTruckUnits] = useState<LiveTruckTelemetry[]>([
    { id: 'TRK-881', plate: 'ق ن ٤٨٢١', corridor: 'الإسكندرية الصحراوي', speed: 78, fuelRate: 26.8, status: 'optimal', driverScore: 98 },
    { id: 'TRK-402', plate: 'س ف ٩١٠٤', corridor: 'ميناء السخنة', speed: 74, fuelRate: 27.2, status: 'optimal', driverScore: 95 },
    { id: 'TRK-905', plate: 'د ل ٣٢٦٥', corridor: 'الدلتا - المحلة', speed: 65, fuelRate: 28.1, status: 'rerouting', driverScore: 92 },
    { id: 'TRK-114', plate: 'ص ع ٧٧٥١', corridor: 'محور الصعيد الحر', speed: 82, fuelRate: 25.9, status: 'optimal', driverScore: 99 },
  ]);

  // Real-time telemetry generator loop
  useEffect(() => {
    if (!isVisible || !isSimulating) return;

    const intervalMs = Math.max(800, 2400 / simulationSpeed);
    const interval = setInterval(() => {
      // Traffic load multipliers
      let fuelCongestionFactor = 1.0;
      let speedFactor = 1.0;

      if (trafficLoadPreset === 'fluid') {
        fuelCongestionFactor = 0.94;
        speedFactor = 1.12;
      } else if (trafficLoadPreset === 'congested') {
        fuelCongestionFactor = 1.18;
        speedFactor = 0.82;
      }

      setStreamingData((prev) => {
        const last = prev[prev.length - 1];
        const now = new Date();
        const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        // Add subtle natural jitter
        const jitterFuel = (Math.random() - 0.48) * 0.8;
        const jitterSpeed = (Math.random() - 0.48) * 4;

        const nextPoint: LiveTelemetryPoint = {
          timeLabel,
          traditionalFuel: Number((Math.max(33, Math.min(42, (last.traditionalFuel + jitterFuel) * fuelCongestionFactor))).toFixed(1)),
          na2laFuel: Number((Math.max(24.2, Math.min(29.8, (last.na2laFuel + jitterFuel * 0.4)))).toFixed(1)),
          traditionalSpeed: Math.round(Math.max(30, Math.min(60, (last.traditionalSpeed + jitterSpeed) * speedFactor))),
          na2laSpeed: Math.round(Math.max(65, Math.min(88, (last.na2laSpeed + jitterSpeed * 0.5)))),
          congestionLevel: Math.round(
            trafficLoadPreset === 'congested'
              ? 70 + Math.random() * 25
              : trafficLoadPreset === 'fluid'
              ? 20 + Math.random() * 20
              : 40 + Math.random() * 25
          ),
          savedEgpPerMin: Math.round(160 + Math.random() * 70),
        };

        const updated = [...prev.slice(1), nextPoint];
        return updated;
      });

      // Fluctuate truck telemetry
      setTruckUnits((prev) =>
        prev.map((trk) => {
          const spdDelta = (Math.random() - 0.5) * 3;
          const fuelDelta = (Math.random() - 0.5) * 0.3;
          return {
            ...trk,
            speed: Math.round(Math.max(55, Math.min(88, trk.speed + spdDelta))),
            fuelRate: Number(Math.max(24.5, Math.min(30.5, trk.fuelRate + fuelDelta)).toFixed(1)),
          };
        })
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isVisible, isSimulating, simulationSpeed, trafficLoadPreset]);

  // Derived KPI metrics from latest streaming tick
  const latestTick = streamingData[streamingData.length - 1];
  const fuelReductionPercent = useMemo(() => {
    if (!latestTick) return 26.4;
    const diff = latestTick.traditionalFuel - latestTick.na2laFuel;
    return Number(((diff / latestTick.traditionalFuel) * 100).toFixed(1));
  }, [latestTick]);

  const speedBoostPercent = useMemo(() => {
    if (!latestTick) return 38.5;
    const diff = latestTick.na2laSpeed - latestTick.traditionalSpeed;
    return Number(((diff / latestTick.traditionalSpeed) * 100).toFixed(1));
  }, [latestTick]);

  // Dynamic Corridor data scaled with current traffic scenario
  const dynamicCorridors = useMemo(() => {
    return CORRIDOR_BENCHMARKS.map((item) => {
      let speedMult = 1;
      if (trafficLoadPreset === 'congested') speedMult = 0.85;
      if (trafficLoadPreset === 'fluid') speedMult = 1.1;

      return {
        ...item,
        traditionalSpeed: Math.round(item.traditionalSpeed * speedMult),
        na2laSpeed: Math.round(item.na2laSpeed * (speedMult * 0.95 + 0.05)),
      };
    });
  }, [trafficLoadPreset]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 z-40 select-none text-right font-sans"
        dir="rtl"
      >
        <div className="bg-slate-950/92 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden shadow-cyan-500/10">
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            {/* Title & Live Status */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-bold text-white tracking-wide">
                    لوحة تحليلات الأسطول الحية <span className="text-cyan-400 font-mono-code font-bold">V10 TELEMETRY</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono-code">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>مباشر: {latestTick?.timeLabel ?? 'الآن'}</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 hidden md:block">
                  محاكاة فورية لمؤشرات استهلاك الوقود وسرعة تسليم الشحنات وتفادي الاختناقات المرورية
                </div>
              </div>
            </div>

            {/* Quick Controls & Close */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Simulation Pause / Resume */}
              <button
                onClick={() => {
                  setIsSimulating(!isSimulating);
                  soundEngine.playRadarPing();
                }}
                className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                  isSimulating
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                }`}
                title={isSimulating ? 'إيقاف المحاكاة مؤقتاً' : 'استئناف تدفق البيانات'}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-mono-code hidden lg:inline">
                  {isSimulating ? 'توقف' : 'تشغيل'}
                </span>
              </button>

              {/* Simulation Speed */}
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono-code">
                {( [1, 2, 5] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setSimulationSpeed(spd);
                      soundEngine.playRadarPing();
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      simulationSpeed === spd
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Minimize / Maximize */}
              <button
                onClick={() => {
                  setIsMinimized(!isMinimized);
                  soundEngine.playRadarPing();
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title={isMinimized ? 'توسيع اللوحة' : 'تصغير اللوحة إلى شريط مبسط'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playWhoosh();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="إغلاق لوحة التحليلات"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          {!isMinimized && (
            <div className="p-3 md:p-4 space-y-3">
              {/* Secondary Control Ribbon: Tabs + Traffic Presets */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
                {/* Metric Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      setActiveTab('fuel');
                      soundEngine.playRadarPing();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'fuel'
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Fuel className="w-3.5 h-3.5" />
                    <span>معدل الوقود (L/100km)</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('speed');
                      soundEngine.playRadarPing();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'speed'
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>سرعة التسليم (km/h)</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('units');
                      soundEngine.playRadarPing();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'units'
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>الشاحنات المتصلة ({truckUnits.length})</span>
                  </button>
                </div>

                {/* Simulated Traffic Load Presets */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono-code ml-1 hidden sm:inline">
                    ظروف الطريق:
                  </span>
                  <button
                    onClick={() => {
                      setTrafficLoadPreset('fluid');
                      soundEngine.playRadarPing();
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono-code transition-colors ${
                      trafficLoadPreset === 'fluid'
                        ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    انسيابي
                  </button>
                  <button
                    onClick={() => {
                      setTrafficLoadPreset('standard');
                      soundEngine.playRadarPing();
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono-code transition-colors ${
                      trafficLoadPreset === 'standard'
                        ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    قياسي
                  </button>
                  <button
                    onClick={() => {
                      setTrafficLoadPreset('congested');
                      soundEngine.playRadarPing();
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono-code transition-colors ${
                      trafficLoadPreset === 'congested'
                        ? 'bg-rose-950 border border-rose-500/60 text-rose-300 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    تكدس وذروة
                  </button>
                </div>
              </div>

              {/* 4 Summary Live Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Metric 1: Fuel Reduction */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-emerald-400" />
                      <span>انخفاض استهلاك السولار</span>
                    </span>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg md:text-xl font-bold font-mono-code text-emerald-400">
                      -{fuelReductionPercent}%
                    </span>
                    <span className="text-[10px] text-slate-500">مقارنة بالتقليدي</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    الحالي: {latestTick?.na2laFuel} L / 100km
                  </div>
                </div>

                {/* Metric 2: Delivery Speed Boost */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-cyan-400" />
                      <span>زيادة سرعة التوصيل</span>
                    </span>
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg md:text-xl font-bold font-mono-code text-cyan-400">
                      +{speedBoostPercent}%
                    </span>
                    <span className="text-[10px] text-slate-500">متوسط السرعة</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    الحالي: {latestTick?.na2laSpeed} km/h
                  </div>
                </div>

                {/* Metric 3: Real-Time Cost Savings */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>وفر مالي تشغيلي</span>
                    </span>
                    <span className="text-[10px] font-mono-code text-yellow-400/90">EGP/min</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg md:text-xl font-bold font-mono-code text-yellow-400">
                      {latestTick?.savedEgpPerMin ?? 185}
                    </span>
                    <span className="text-[10px] text-slate-400">ج.م/دقيقة</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    ~{( (latestTick?.savedEgpPerMin ?? 185) * 60).toLocaleString()} ج.م / ساعة
                  </div>
                </div>

                {/* Metric 4: Congestion Avoidance */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-purple-400" />
                      <span>مؤشر تفادي الاختناق</span>
                    </span>
                    <span className="text-[10px] font-mono-code text-purple-400">AI REROUTE</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg md:text-xl font-bold font-mono-code text-purple-400">
                      {100 - (latestTick?.congestionLevel ?? 45)}%
                    </span>
                    <span className="text-[10px] text-slate-500">كفاءة المسار</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    التكدس المتبقي: {latestTick?.congestionLevel}%
                  </div>
                </div>
              </div>

              {/* Main Chart Content Area */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {activeTab === 'fuel' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                        <span>منحنى استهلاك الوقود المباشر: أسطول تقليدي مقابل Na2la V10 (L/100km)</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono-code">
                        <span className="flex items-center gap-1 text-slate-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                          تقليدي: {latestTick?.traditionalFuel} L
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                          Na2la V10: {latestTick?.na2laFuel} L
                        </span>
                      </div>
                    </div>

                    <div className="h-44 sm:h-52 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={streamingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorNa2laFuel" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorTradFuel" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={10} />
                          <YAxis domain={[20, 45]} stroke="#64748b" fontSize={10} unit=" L" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#020617',
                              borderColor: '#10b981',
                              borderRadius: '8px',
                              fontSize: '11px',
                              direction: 'rtl',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="traditionalFuel"
                            name="أسطول تقليدي"
                            stroke="#f43f5e"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTradFuel)"
                          />
                          <Area
                            type="monotone"
                            dataKey="na2laFuel"
                            name="Na2la V10 الذكي"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorNa2laFuel)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'speed' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        <span>مقارنة سرعة التوصيل عبر المحاور اللوجستية الرئيسية (km/h)</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono-code">
                        <span className="flex items-center gap-1 text-slate-400">
                          <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                          تقليدي
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400 font-bold">
                          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
                          Na2la V10 AI
                        </span>
                      </div>
                    </div>

                    <div className="h-44 sm:h-52 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dynamicCorridors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="corridor" stroke="#64748b" fontSize={10} />
                          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} unit=" km/h" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#020617',
                              borderColor: '#06b6d4',
                              borderRadius: '8px',
                              fontSize: '11px',
                              direction: 'rtl',
                            }}
                          />
                          <Bar dataKey="traditionalSpeed" name="السرعة التقليدية (km/h)" fill="#475569" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="na2laSpeed" name="سرعة نقلة الذكية (km/h)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'units' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-purple-400" />
                        <span>شاحنات الأسطول المتصلة والمراقبة عبر شبكة CAN-Bus الفورية</span>
                      </div>
                      <span className="text-[11px] text-purple-300 font-mono-code">
                        تحديث كل {Math.round(2400 / simulationSpeed)}ms
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {truckUnits.map((trk) => (
                        <div
                          key={trk.id}
                          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white font-mono-code">{trk.id}</span>
                                <span className="text-[10px] text-slate-400 font-mono-code">[{trk.plate}]</span>
                              </div>
                              <div className="text-[10px] text-slate-400">{trk.corridor}</div>
                            </div>
                          </div>

                          <div className="text-left font-mono-code">
                            <div className="text-xs font-bold text-cyan-300">{trk.speed} km/h</div>
                            <div className="text-[10px] text-emerald-400">{trk.fuelRate} L/100km</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compact Mini Bar when Minimized */}
          {isMinimized && (
            <div className="px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono-code bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  <span>وفر السولار: -{fuelReductionPercent}% ({latestTick?.na2laFuel} L/100km)</span>
                </span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  <span>سرعة التسليم: +{speedBoostPercent}% ({latestTick?.na2laSpeed} km/h)</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setIsMinimized(false);
                  soundEngine.playRadarPing();
                }}
                className="text-cyan-400 hover:text-cyan-300 text-[11px] underline flex items-center gap-1"
              >
                <span>فتح التفاصيل</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
