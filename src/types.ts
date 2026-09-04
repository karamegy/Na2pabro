/**
 * Types for Na2la V10 PRO Cinematic Video Presentation & Interactive Platform
 */

export interface SceneMeta {
  id: number;
  key: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  voiceoverAr: string;
  voiceoverEn: string;
  accentColor: 'blue' | 'emerald' | 'purple';
  hudCode: string;
}

export interface FinancialMetric {
  id: string;
  titleAr: string;
  titleEn: string;
  amount: number;
  currency: string;
  change: string;
  isPositive: boolean;
  statusAr: string;
  iconName: string;
  chartData: number[];
  subtextAr: string;
}

export interface TruckTelemetry {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  progressPercent: number;
  speedKmH: number;
  fuelPercent: number;
  cargoType: string;
  cargoWeightKg: number;
  tempCelsius?: number;
  status: 'in_transit' | 'scheduled' | 'maintenance' | 'conflict_resolved';
  coords: { x: number; y: number };
}

export interface DriverConflictEvent {
  conflictId: string;
  driverName: string;
  tripA: string;
  tripB: string;
  overlapWindow: string;
  severity: 'critical' | 'warning' | 'resolved';
  resolvedAt?: string;
  autoSolution: string;
}

export interface FleetMaintenanceItem {
  truckId: string;
  model: string;
  odometerKm: number;
  oilLifePercent: number;
  oilChangeDueKm: number;
  brakePadsPercent: number;
  tirePressurePsi: number;
  status: 'optimal' | 'warning' | 'critical';
  lastServiceDate: string;
}

export interface ScaleTicketOCRResult {
  ticketNumber: string;
  truckPlate: string;
  carrierName: string;
  entryTimestamp: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  commodity: string;
  confidenceScore: number;
  moisturePercent: number;
  scaleOperator: string;
  verified: boolean;
}

export type AspectRatioMode = 'cinematic' | 'standard' | 'vertical';

export type VideoFilterMode = 'none' | 'vhs' | 'night_vision' | 'monochrome';

export type SceneTransitionEffect = 'digital_wipe' | 'glitch' | 'cyber_shutter' | 'fade';

export interface TechSpecItem {
  labelAr: string;
  labelEn: string;
  value: string;
  detailAr?: string;
}

export interface TechHotspot {
  id: string;
  sceneId: number; // 1 to 6
  startTime: number;
  endTime: number;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  hudCode: string;
  accentColor: 'blue' | 'emerald' | 'purple' | 'cyan';
  specs: TechSpecItem[];
}

export interface VolumeNormalizationMetrics {
  sceneDuration: number;
  speechTextLength: number;
  speechDensityCharsPerSec: number;
  normalizedVolume: number; // 0.0 to 1.0 (applied to SpeechSynthesisUtterance.volume)
  calibratedRate: number; // speech rate dynamically balanced
  gainAdjustmentDb: number; // calculated relative decibels (+/- dB)
  targetLufs: number; // e.g. -14 to -18 LUFS standard
  profileName: string; // e.g. 'ديناميكي عالي الحضور' or 'متوازن سينمائي'
  isAutoNormalized: boolean;
}
