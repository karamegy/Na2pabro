import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Lock, ShieldCheck, Database, KeyRound, Server, Building2, CheckCircle2, RefreshCw } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface Scene2Props {
  playbackProgress: number;
  isInteractive?: boolean;
}

interface Tenant {
  id: string;
  nameAr: string;
  nameEn: string;
  fleetCount: number;
  encryptionKey: string;
  dbPartition: string;
  themeColor: 'blue' | 'emerald' | 'purple';
}

const TENANTS: Tenant[] = [
  {
    id: 'TNT-001',
    nameAr: 'شركة الأمل للنقل الدولي واللوجستيات',
    nameEn: 'Al-Amal Global Logistics',
    fleetCount: 240,
    encryptionKey: '0x8F9A...4B2C',
    dbPartition: 'db_tenant_amal_v10',
    themeColor: 'blue',
  },
  {
    id: 'TNT-002',
    nameAr: 'الخليج للشحن البري والترانزيت',
    nameEn: 'Gulf Express Overland',
    fleetCount: 410,
    encryptionKey: '0x3E1C...99AA',
    dbPartition: 'db_tenant_gulf_v10',
    themeColor: 'emerald',
  },
  {
    id: 'TNT-003',
    nameAr: 'مصر لوجستيكس للأسطول الثقيل',
    nameEn: 'Egypt Heavy Haul Fleet',
    fleetCount: 185,
    encryptionKey: '0x7D24...1F08',
    dbPartition: 'db_tenant_eg_v10',
    themeColor: 'purple',
  },
];

export const Scene2MultiTenant: React.FC<Scene2Props> = ({ playbackProgress, isInteractive }) => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(TENANTS[0]);
  const [bioState, setBioState] = useState<'idle' | 'scanning' | 'granted'>('scanning');
  const [authProgress, setAuthProgress] = useState(65);

  // Auto-simulate scan animation synchronized with playback
  useEffect(() => {
    if (playbackProgress < 0.3) {
      setBioState('scanning');
      setAuthProgress(Math.floor(playbackProgress * 300));
    } else if (playbackProgress >= 0.3 && playbackProgress < 0.9) {
      if (bioState !== 'granted') {
        soundEngine.playBiometricScan();
      }
      setBioState('granted');
      setAuthProgress(100);
    }
  }, [playbackProgress]);

  const handleManualScan = () => {
    setBioState('scanning');
    setAuthProgress(15);
    soundEngine.playWhoosh();

    const interval = setInterval(() => {
      setAuthProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setBioState('granted');
          soundEngine.playBiometricScan();
          return 100;
        }
        return prev + 20;
      });
    }, 120);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none bg-cyber-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-tech text-xs">
              SECURITY PROTOCOL V10
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              MULTI-TENANT ENCLAVE // ZERO-LEAKAGE
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white mt-1">
            العزل السحابي التام والمصادقة البيومترية
          </h2>
        </div>

        {/* Live Security Chip */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 rounded-lg shadow-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div className="text-right">
            <div className="text-xs font-bold text-emerald-300">درع الحماية: مشفّر ومفصول</div>
            <div className="text-[10px] text-slate-400 font-mono-code">256-BIT QUANTUM VAULT</div>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Showcase: Multi-Tenant Cloud Architecture + Biometric Scanner */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-2">
        {/* Left Column: Multi-Tenant Partition Architecture */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <div className="text-xs font-mono-code text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>بيئات العمل المنفصلة سحابياً (Multi-Tenant Segregation):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TENANTS.map((tenant) => {
              const isSelected = selectedTenant.id === tenant.id;
              return (
                <button
                  key={tenant.id}
                  onClick={() => {
                    setSelectedTenant(tenant);
                    soundEngine.playRadarPing();
                  }}
                  className={`relative p-3.5 rounded-xl text-right transition-all border ${
                    isSelected
                      ? 'bg-slate-900/90 border-emerald-400/80 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tenant.id}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {tenant.nameAr}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>الأسطول:</span>
                    <span className="font-mono-code font-bold text-cyan-300">{tenant.fleetCount} شاحنة</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
                    <span className="flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      مستقل 100%
                    </span>
                    <span className="text-emerald-400">نشط</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Isolated Tenant Vault Card */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">
                  قاعدة البيانات المشفرة: {selectedTenant.dbPartition}
                </span>
              </div>
              <span className="text-[10px] font-mono-code bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
                AES-256-GCM DEDICATED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">عزل البيانات</div>
                <div className="font-mono-code font-bold text-emerald-400 text-sm">100% مستقل</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">مفتاح التشفير الحصري</div>
                <div className="font-mono-code font-semibold text-blue-300 text-xs truncate">
                  {selectedTenant.encryptionKey}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">سجل التتبع اللوجستي</div>
                <div className="font-mono-code font-bold text-cyan-300 text-xs">مشفّر بالبلوكتشين</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">حماية التداخل</div>
                <div className="font-mono-code font-bold text-emerald-300 text-xs">منعدم 0.00%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Biometric Fingerprint HUD Interactive Scanner */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 rounded-2xl p-6 text-center backdrop-blur-xl shadow-2xl">
            {/* Top scanning badge */}
            <div className="flex items-center justify-between mb-4 text-xs font-mono-code">
              <span className="text-slate-400">BIOMETRIC SENSOR #01</span>
              <span className={bioState === 'granted' ? 'text-emerald-400 font-bold' : 'text-cyan-400 animate-pulse'}>
                {bioState === 'granted' ? '● AUTH_GRANTED' : '◐ SCANNING...'}
              </span>
            </div>

            {/* Interactive Fingerprint Scanner Pad */}
            <div
              onClick={handleManualScan}
              className="relative mx-auto w-36 h-36 rounded-2xl bg-slate-950/90 border-2 border-emerald-500/40 flex items-center justify-center cursor-pointer group hover:border-emerald-400 transition-all shadow-inner overflow-hidden"
              title="اضغط لإعادة محاكاة فحص البصمة"
            >
              {/* Pulsing Concentric Sensor Circles */}
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="absolute w-28 h-28 rounded-full border border-emerald-500/20 animate-ping opacity-30 pointer-events-none" />

              {/* Laser Scanning Bar */}
              {bioState === 'scanning' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,1)] animate-laser z-20" />
              )}

              {/* Fingerprint Icon with glow */}
              <Fingerprint
                className={`w-20 h-20 transition-all duration-500 ${
                  bioState === 'granted'
                    ? 'text-emerald-400 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-105'
                    : 'text-cyan-400/80 group-hover:text-emerald-300'
                }`}
              />

              {/* Verified Check Badge */}
              <AnimatePresence>
                {bioState === 'granted' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 rounded-full p-1 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 font-bold" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar & Identity Readout */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-400">تطابق البصمة الحيوية:</span>
                <span className="text-emerald-400 font-bold">{authProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-500"
                  style={{ width: `${authProgress}%` }}
                />
              </div>
            </div>

            {/* Authentication Status Details */}
            <div className="mt-4 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
              {bioState === 'granted' ? (
                <div className="space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    تم التحقق بنجاح - قائد الأسطول
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono-code">
                    USER: AHMED K. (FLEET_DIRECTOR_V10)
                  </div>
                </div>
              ) : (
                <div className="text-cyan-300 font-medium animate-pulse">
                  جاري قراءة تفاصيل البصمة والتحقق من التشفير السحابي...
                </div>
              )}
            </div>

            {isInteractive && (
              <button
                onClick={handleManualScan}
                className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-300 font-mono-code transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة المصادقة اليدوية</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Ticker */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">TENANT_ISOLATION: 100% SECURE</span>
          <span className="hidden sm:inline">AUTHENTICATION: HARDWARE_TOKEN_VERIFIED</span>
        </div>
        <span className="text-slate-500">Na2la V10 PRO Cloud Architecture</span>
      </div>
    </div>
  );
};
