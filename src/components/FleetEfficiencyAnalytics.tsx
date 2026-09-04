import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Fuel,
  Route,
  TrendingDown,
  Activity,
  Zap,
  Gauge,
  Clock,
  Truck,
  RefreshCw,
  Award,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

// Initial Corridor Performance Data
const INITIAL_CORRIDOR_DATA = [
  { corridor: 'القاهرة - الإسكندرية', traditionalKm: 228, na2laKm: 198, savedKm: 30, fuelSavedEgp: 2450, efficiencyRate: 94 },
  { corridor: 'السخنة - الميناء', traditionalKm: 146, na2laKm: 124, savedKm: 22, fuelSavedEgp: 1820, efficiencyRate: 96 },
  { corridor: 'الدلتا - المحلة', traditionalKm: 115, na2laKm: 98, savedKm: 17, fuelSavedEgp: 1410, efficiencyRate: 91 },
  { corridor: 'القاهرة - أسيوط', traditionalKm: 382, na2laKm: 334, savedKm: 48, fuelSavedEgp: 3960, efficiencyRate: 95 },
  { corridor: 'السويس - العاشر', traditionalKm: 92, na2laKm: 79, savedKm: 13, fuelSavedEgp: 1120, efficiencyRate: 93 },
];

// Timeline Efficiency Trends (Day by Day / Weekly)
const INITIAL_TIMELINE_DATA = [
  { period: 'السبت', fuelLitersPer100Km: 34.8, na2laFuelRate: 28.1, idleMinutes: 44, savingsEgp: 18400 },
  { period: 'الأحد', fuelLitersPer100Km: 35.2, na2laFuelRate: 27.9, idleMinutes: 38, savingsEgp: 21200 },
  { period: 'الإثنين', fuelLitersPer100Km: 36.0, na2laFuelRate: 28.4, idleMinutes: 42, savingsEgp: 22900 },
  { period: 'الثلاثاء', fuelLitersPer100Km: 34.5, na2laFuelRate: 27.6, idleMinutes: 35, savingsEgp: 24100 },
  { period: 'الأربعاء', fuelLitersPer100Km: 35.8, na2laFuelRate: 28.0, idleMinutes: 39, savingsEgp: 23600 },
  { period: 'الخميس', fuelLitersPer100Km: 37.1, na2laFuelRate: 28.6, idleMinutes: 48, savingsEgp: 26800 },
  { period: 'الجمعة', fuelLitersPer100Km: 32.4, na2laFuelRate: 26.8, idleMinutes: 22, savingsEgp: 15850 },
];

export const FleetEfficiencyAnalytics: React.FC = () => {
  const [activeView, setActiveView] = useState<'corridors' | 'timeline'>('corridors');
  const [isLiveTelemetry, setIsLiveTelemetry] = useState<boolean>(true);
  const [liveMultiplier, setLiveMultiplier] = useState<number>(1);
  const [lastUpdated, setLastUpdated] = useState<string>('الآن');

  // Real-time live CAN-Bus ticker simulation
  useEffect(() => {
    if (!isLiveTelemetry) return;

    const interval = setInterval(() => {
      setLiveMultiplier((prev) => {
        const delta = (Math.random() - 0.48) * 0.04;
        return Math.max(0.92, Math.min(1.08, prev + delta));
      });
      const now = new Date();
      setLastUpdated(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveTelemetry]);

  // Derived dynamic corridor data based on live telemetry
  const dynamicCorridorData = useMemo(() => {
    return INITIAL_CORRIDOR_DATA.map((item) => ({
      ...item,
      savedKm: Math.round(item.savedKm * liveMultiplier),
      fuelSavedEgp: Math.round(item.fuelSavedEgp * liveMultiplier),
    }));
  }, [liveMultiplier]);

  // Derived dynamic timeline data
  const dynamicTimelineData = useMemo(() => {
    return INITIAL_TIMELINE_DATA.map((item) => ({
      ...item,
      na2laFuelRate: Number((item.na2laFuelRate * (2 - liveMultiplier)).toFixed(1)),
      savingsEgp: Math.round(item.savingsEgp * liveMultiplier),
    }));
  }, [liveMultiplier]);

  // Aggregate KPI computations
  const totalSavedKm = useMemo(
    () => dynamicCorridorData.reduce((acc, curr) => acc + curr.savedKm, 0),
    [dynamicCorridorData]
  );

  const totalFuelSavedEgp = useMemo(
    () => dynamicCorridorData.reduce((acc, curr) => acc + curr.fuelSavedEgp, 0),
    [dynamicCorridorData]
  );

  const averageFuelDropPercent = useMemo(() => {
    return (18.4 * liveMultiplier).toFixed(1);
  }, [liveMultiplier]);

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Top Banner & Telemetry Controls */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-l from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>محرك تحليلات كفاءة الأسطول الذكي</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono-code">
                  V10 TELEMETRY
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                مؤشرات استهلاك السولار وتوفير الكيلومترات في الزمن الحقيقي
              </div>
            </div>
          </div>

          {/* Live Pulse Badge */}
          <button
            onClick={() => {
              setIsLiveTelemetry(!isLiveTelemetry);
              soundEngine.playRadarPing();
            }}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono-code flex items-center gap-1.5 transition-all ${
              isLiveTelemetry
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveTelemetry ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            <span>{isLiveTelemetry ? `مباشر: ${lastUpdated}` : 'إيقاف التحديث'}</span>
          </button>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* 1. Fuel Savings EGP */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <Fuel className="w-3 h-3 text-emerald-400" />
                <span>وفر وقود المسارات</span>
              </span>
              <span className="text-emerald-400 text-[10px] font-bold flex items-center">
                +14.2% <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
              </span>
            </div>
            <div className="text-base font-bold font-mono-code text-white">
              {totalFuelSavedEgp.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ج.م/يوم</span>
            </div>
          </div>

          {/* 2. Fuel Consumption Rate */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span>انخفاض استهلاك السولار</span>
              </span>
              <span className="text-cyan-400 text-[10px] font-bold">
                -{averageFuelDropPercent}%
              </span>
            </div>
            <div className="text-base font-bold font-mono-code text-cyan-300">
              27.9 <span className="text-xs text-slate-400 font-normal">لتر/100كم</span>
            </div>
          </div>

          {/* 3. Distance Cut */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <Route className="w-3 h-3 text-purple-400" />
                <span>كيلومترات مقتصدة</span>
              </span>
              <span className="text-purple-400 text-[10px] font-bold">خوارزمية V10</span>
            </div>
            <div className="text-base font-bold font-mono-code text-white">
              {totalSavedKm.toLocaleString()} <span className="text-xs text-slate-400 font-normal">كم مقتصد</span>
            </div>
          </div>

          {/* 4. Idle Time Reduction */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>تقليص زمن الوقوف</span>
              </span>
              <span className="text-amber-400 text-[10px] font-bold">-76%</span>
            </div>
            <div className="text-base font-bold font-mono-code text-amber-300">
              11 <span className="text-xs text-slate-400 font-normal">دقيقة / نقطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Selector Segment */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>الرسوم البيانية التفاعلية (Recharts):</span>
        </div>
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              setActiveView('corridors');
              soundEngine.playRadarPing();
            }}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeView === 'corridors'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المسارات اللوجستية
          </button>
          <button
            onClick={() => {
              setActiveView('timeline');
              soundEngine.playRadarPing();
            }}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeView === 'timeline'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اتجاهات الأسبوع
          </button>
        </div>
      </div>

      {/* 1. Corridor Route Comparison Chart */}
      {activeView === 'corridors' && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white">
              مقارنة المسافة المقطوعة (كم): المسار التقليدي vs نقلة V10
            </span>
            <span className="text-[10px] font-mono-code text-cyan-400">
              خوارزمية منع التضارب 12ms
            </span>
          </div>

          <div className="h-56 w-full font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dynamicCorridorData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="corridor"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-right text-xs font-sans">
                          <div className="font-bold text-white mb-1">{label}</div>
                          <div className="text-slate-400 flex items-center justify-between gap-3">
                            <span>مسار تقليدي:</span>
                            <span className="font-mono-code font-bold text-rose-400">
                              {data.traditionalKm} كم
                            </span>
                          </div>
                          <div className="text-slate-400 flex items-center justify-between gap-3">
                            <span>مسار V10 المحسّن:</span>
                            <span className="font-mono-code font-bold text-emerald-400">
                              {data.na2laKm} كم
                            </span>
                          </div>
                          <div className="text-cyan-300 font-bold border-t border-slate-800 pt-1 mt-1 flex items-center justify-between gap-3">
                            <span>وفر الوقود المحقق:</span>
                            <span>{data.fuelSavedEgp} ج.م</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(value) => (
                    <span className="text-slate-300">
                      {value === 'traditionalKm' ? 'مسار تقليدي (كم)' : 'مسار V10 المحسّن (كم)'}
                    </span>
                  )}
                />
                <Bar dataKey="traditionalKm" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="na2laKm" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Corridor Efficiency Highlights */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">أعلى مسار وفراً:</span>
              <span className="font-bold text-emerald-400">طريق أسيوط (48 كم)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">معدل دقة المسارات:</span>
              <span className="font-bold text-cyan-400">96.4% GNSS RTK</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Weekly Fuel & Cost Savings Trend */}
      {activeView === 'timeline' && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white">
              معدل استهلاك الوقود اليومي (لتر/100كم) والأرباح الموفرة
            </span>
            <span className="text-[10px] font-mono-code text-emerald-400">
              مقارنة مستمرة مع معايير الأسطول
            </span>
          </div>

          <div className="h-56 w-full font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dynamicTimelineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-right text-xs font-sans">
                          <div className="font-bold text-white mb-1">{label}</div>
                          <div className="text-slate-400 flex items-center justify-between gap-3">
                            <span>استهلاك أسطول تقليدي:</span>
                            <span className="font-mono-code font-bold text-rose-400">
                              {data.fuelLitersPer100Km} لتر/100كم
                            </span>
                          </div>
                          <div className="text-slate-400 flex items-center justify-between gap-3">
                            <span>استهلاك نظام نقلة V10:</span>
                            <span className="font-mono-code font-bold text-emerald-400">
                              {data.na2laFuelRate} لتر/100كم
                            </span>
                          </div>
                          <div className="text-cyan-300 font-bold border-t border-slate-800 pt-1 mt-1 flex items-center justify-between gap-3">
                            <span>وفر مالي محقق:</span>
                            <span>{data.savingsEgp.toLocaleString()} ج.م</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(value) => (
                    <span className="text-slate-300">
                      {value === 'fuelLitersPer100Km'
                        ? 'معدل تقليدي (لتر)'
                        : 'معدل نقلة V10 المحسّن (لتر)'}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="fuelLitersPer100Km"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={0.1}
                  fill="#f43f5e"
                />
                <Area
                  type="monotone"
                  dataKey="na2laFuelRate"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-bold">إجمالي الوفر الأسبوعي للأسطول:</span>
            </div>
            <span className="font-mono-code font-bold text-emerald-400 text-sm">
              151,050 ج.م / أسبوع
            </span>
          </div>
        </div>
      )}

      {/* Technical CAN-Bus Standard Footer */}
      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] font-mono-code text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Truck className="w-3.5 h-3.5" />
          <span>CAN-Bus J1939 + OBD-II Engine ECU Telemetry</span>
        </div>
        <span className="text-slate-500">محدث دورياً • 100Hz</span>
      </div>
    </div>
  );
};
