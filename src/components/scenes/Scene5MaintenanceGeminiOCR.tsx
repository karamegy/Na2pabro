import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gauge, 
  AlertTriangle, 
  Wrench, 
  Scan, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Bot, 
  Truck, 
  Scale, 
  FileCheck, 
  Calendar 
} from 'lucide-react';
import { MEDIA_ASSETS } from '../../assets/media';
import { soundEngine } from '../../utils/soundEngine';
import { ScaleTicketOCRResult } from '../../types';

interface Scene5Props {
  playbackProgress: number;
  isInteractive?: boolean;
}

const SAMPLE_TICKET: ScaleTicketOCRResult = {
  ticketNumber: 'TK-88902-ALX',
  truckPlate: 'ط ر ق ٨٤٩٢ (TRK-104)',
  carrierName: 'شركة الأمل للنقل الدولي',
  entryTimestamp: '2026-09-04 14:22:18',
  grossWeightKg: 44820,
  tareWeightKg: 15310,
  netWeightKg: 29510,
  commodity: 'حبوب قمح صب (Wheat Grain)',
  confidenceScore: 99.4,
  moisturePercent: 11.2,
  scaleOperator: 'ميزان كوبري الإسكندرية الدولي #04',
  verified: true,
};

export const Scene5MaintenanceGeminiOCR: React.FC<Scene5Props> = ({ playbackProgress }) => {
  const [activeTab, setActiveTab] = useState<'ocr' | 'maintenance' | 'visitor'>('ocr');
  const [ocrScanning, setOcrScanning] = useState(true);
  const [visitorCode, setVisitorCode] = useState('N2L-88410-EG');
  const [trackingFound, setTrackingFound] = useState(true);

  // Sync timeline with OCR scan sound & animations
  useEffect(() => {
    if (playbackProgress < 0.3) {
      setActiveTab('maintenance');
    } else if (playbackProgress >= 0.3 && playbackProgress < 0.75) {
      setActiveTab('ocr');
      if (playbackProgress > 0.4 && ocrScanning) {
        soundEngine.playOcrDataStream();
        setOcrScanning(false);
      }
    } else if (playbackProgress >= 0.75) {
      setActiveTab('visitor');
      soundEngine.playRadarPing();
    }
  }, [playbackProgress]);

  const handleManualScan = () => {
    setOcrScanning(true);
    soundEngine.playWhoosh();
    setTimeout(() => {
      soundEngine.playOcrDataStream();
      setOcrScanning(false);
    }, 1200);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none bg-cyber-grid">
      {/* Top Header & Tab Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-tech text-xs flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              GEMINI PRO VISION AI // FLEET TELEMETRY
            </span>
            <span className="text-xs font-mono-code text-cyan-300">
              MULTIMODAL OCR ENGINE V10
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white mt-1">
            مساعد Gemini Pro لقراءة بونات الميزان وتتبع الشحنات للزوار
          </h2>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveTab('ocr');
              soundEngine.playRadarPing();
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ocr' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>تحليل بون الميزان (OCR)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('maintenance');
              soundEngine.playRadarPing();
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'maintenance' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>صيانة الشاحنات والزيت</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('visitor');
              soundEngine.playRadarPing();
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'visitor' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>تتبع الزوار</span>
          </button>
        </div>
      </div>

      {/* Main Center Display: Dynamically toggled based on tab or playback sequence */}
      <div className="relative z-10 my-auto py-2">
        <AnimatePresence mode="wait">
          {/* TAB 1: GEMINI PRO OCR SCALE TICKET ANALYZER */}
          {activeTab === 'ocr' && (
            <motion.div
              key="ocr-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
            >
              {/* Ticket Image with Laser Scan Line (5 cols) */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-slate-900 group">
                <img
                  src={MEDIA_ASSETS.scaleTicketDoc}
                  alt="Scale Ticket Receipt"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 md:h-72 object-cover filter contrast-110"
                />

                {/* Laser Scanning Effect */}
                {ocrScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)] animate-laser z-20" />
                )}

                {/* Optical Bounding Boxes Overlay */}
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-mono-code bg-slate-950/80 px-2 py-1 rounded border border-emerald-500/40 text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      GEMINI PRO VISION ACTIVE
                    </span>
                    <span>AI ACCURACY: 99.4%</span>
                  </div>

                  {/* Bounding Box Highlights */}
                  <div className="space-y-1 text-[10px] font-mono-code">
                    <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-200">
                      GROSS: 44,820 KG [DETECTED]
                    </div>
                    <div className="block" />
                    <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-200">
                      NET: 29,510 KG [VERIFIED]
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Data HUD (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">
                      بيانات بون الميزان المستخرجة آلياً (OCR Extraction):
                    </span>
                  </div>
                  <span className="text-xs font-mono-code text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/40">
                    رقم البون: {SAMPLE_TICKET.ticketNumber}
                  </span>
                </div>

                {/* 3 Main Weight Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400">الوزن القائم (Gross)</div>
                    <div className="text-lg md:text-xl font-black font-tech text-white mt-1">
                      {SAMPLE_TICKET.grossWeightKg.toLocaleString()} <span className="text-xs font-sans text-slate-400">كجم</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400">الوزن الفارغ (Tare)</div>
                    <div className="text-lg md:text-xl font-black font-tech text-slate-300 mt-1">
                      {SAMPLE_TICKET.tareWeightKg.toLocaleString()} <span className="text-xs font-sans text-slate-400">كجم</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 shadow-lg shadow-emerald-500/10">
                    <div className="text-[11px] text-emerald-300 font-bold">الوزن الصافي (Net Cargo)</div>
                    <div className="text-xl md:text-2xl font-black font-tech text-emerald-400 mt-1">
                      {SAMPLE_TICKET.netWeightKg.toLocaleString()} <span className="text-xs font-sans text-emerald-300">كجم</span>
                    </div>
                  </div>
                </div>

                {/* Additional Verification Info */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono-code text-slate-300">
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-950/50 border border-slate-800">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>نوع الشحنة: {SAMPLE_TICKET.commodity}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-950/50 border border-slate-800">
                    <Truck className="w-4 h-4 text-purple-400" />
                    <span>رقم اللوحة: {SAMPLE_TICKET.truckPlate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم التوثيق التلقائي في الفاتورة دون أي تدخل بشري</span>
                  </div>
                  <button
                    onClick={handleManualScan}
                    className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-mono-code transition-colors"
                  >
                    إعادة المسح بالليزر
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FLEET MAINTENANCE & ODOMETER SCREEN */}
          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Odometer Mileage Card */}
              <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white">عداد الكيلومترات (Odometer)</span>
                    <Gauge className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black font-tech text-white tracking-widest mt-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    284,950 <span className="text-xs font-mono-code text-cyan-400">KM</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-400 text-right">
                    متوسط المسافة الشهرية: <span className="text-cyan-300 font-bold">12,400 كم</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>معايرة العداد:</span>
                  <span className="font-mono-code font-bold">GPS CERTIFIED</span>
                </div>
              </div>

              {/* Oil Change Alert Card */}
              <div className="bg-slate-900/90 border-2 border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                      تنبيه: استحقاق غيار الزيت
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono-code">
                      تحذير مبكر
                    </span>
                  </div>
                  
                  {/* Gauge Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-slate-400">صلاحية زيت المحرك:</span>
                      <span className="text-amber-400 font-bold">14% متبقية</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div className="w-[14%] h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 text-right">
                    موعد تغيير الزيت القادم بعد: <span className="font-bold text-white">850 كم فقط</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">الإجراء المقترح:</span>
                  <button className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors">
                    حجز الورشة فوراً
                  </button>
                </div>
              </div>

              {/* Maintenance Health Index */}
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white">حالة تيل الفرامل والإطارات</span>
                    <Wrench className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="space-y-3 mt-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 text-slate-300 font-mono-code">
                        <span>سماكة تيل الفرامل:</span>
                        <span className="text-emerald-400 font-bold">78% ممتازة</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="w-[78%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-300 font-mono-code">
                        <span>ضغط الإطارات (TPMS):</span>
                        <span className="text-cyan-400 font-bold">110 PSI متزن</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="w-[92%] h-full bg-cyan-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>الفحص الدوري القادم:</span>
                  <span className="font-mono-code text-white">2026-10-15</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: VISITOR SHIPMENT TRACKING */}
          {activeTab === 'visitor' && (
            <motion.div
              key="visitor-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto bg-slate-900/90 border border-purple-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="text-center mb-5">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold inline-flex items-center gap-1.5 mb-2">
                  <Search className="w-3.5 h-3.5" />
                  بوابة الزوار والعملاء للتتبع الفوري
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  تتبع مسار شحنتك لحظياً برقم الشحنة
                </h3>
              </div>

              {/* Search Bar Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={visitorCode}
                  onChange={(e) => setVisitorCode(e.target.value)}
                  placeholder="أدخل كود الشحنة (مثال: N2L-88410-EG)"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono-code text-sm focus:outline-none focus:border-purple-400 text-center"
                />
                <button
                  onClick={() => {
                    soundEngine.playRadarPing();
                    setTrackingFound(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                >
                  <Search className="w-4 h-4" />
                  <span>تتبع</span>
                </button>
              </div>

              {/* Live Tracking Milestones */}
              {trackingFound && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="text-slate-400">حالة الشحنة الحالية:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      على الطريق نحو الوجهة (طريق الإسكندرية الصحراوي)
                    </span>
                  </div>

                  {/* Horizontal Timeline */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono-code pt-2">
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-300">
                      <div className="font-bold">1. التحميل</div>
                      <div className="text-[10px] text-slate-400">10:30 AM ✓</div>
                    </div>
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-300">
                      <div className="font-bold">2. وزن الميزان</div>
                      <div className="text-[10px] text-emerald-400 font-bold">Gemini OCR ✓</div>
                    </div>
                    <div className="p-2 rounded bg-blue-950/60 border border-blue-400 text-blue-300 animate-pulse">
                      <div className="font-bold">3. على الطريق</div>
                      <div className="text-[10px] text-cyan-300 font-bold">86 كم/س</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-500">
                      <div className="font-bold">4. التسليم</div>
                      <div className="text-[10px]">ETA 04:30 PM</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Ticker */}
      <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">GEMINI_OCR: READY</span>
          <span className="hidden sm:inline">SCALE_SLIP_ACCURACY: 99.4%</span>
        </div>
        <span className="text-slate-500">Na2la V10 PRO Intelligent Logistics</span>
      </div>
    </div>
  );
};
