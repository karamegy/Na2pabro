/**
 * Voiceover and Scene Timeline Data for Na2la V10 PRO
 * Exact Arabic script with timestamp mapping and speech synthesis management.
 */

import { SceneMeta, VolumeNormalizationMetrics } from '../types';
import { soundEngine } from './soundEngine';

export const SCENES: SceneMeta[] = [
  {
    id: 1,
    key: 'chaos_to_order',
    startTime: 0,
    endTime: 9,
    titleAr: 'تحدي الطرق والفوضى اللوجستية',
    titleEn: 'Taming Roadway Chaos: The Cloud Mind',
    subtitleAr: 'صعود الجيل العاشر من أنظمة التحكم اللوجستي',
    subtitleEn: 'Ascension of V10 Enterprise Fleet Intelligence',
    voiceoverAr: 'عالم النقل واللوجستيات لم يعد يحتمل الفوضى. الطرق تحتاج لمن يروّضها، والأسطول يحتاج لعقل سحابي لا ينام.',
    voiceoverEn: 'The world of transport and logistics can no longer tolerate chaos. Roads need a master, and fleets demand a cloud mind that never sleeps.',
    accentColor: 'blue',
    hudCode: 'SYS_INIT // ANOMALY_SUPPRESSION // NEURAL_GRID',
  },
  {
    id: 2,
    key: 'cloud_biometric',
    startTime: 9,
    endTime: 20,
    titleAr: 'العزل السحابي والمصادقة البيومترية',
    titleEn: 'Multi-Tenant Isolation & Biometric Security',
    subtitleAr: 'خصوصية مطلقة لكل مستأجر مع تشفير بنكي وبصمة حيوية',
    subtitleEn: 'Full Cloud Tenant Partitioning & Fingerprint Auth',
    voiceoverAr: 'نقدم لك منصة Na2la V10 PRO، النظام المتكامل الذي يضع إمبراطوريتك اللوجستية في راحة يدك. عزل تام وسحابي لكل شركة ببياناتها الخاصة، وأمان مطلق بمصادقة البصمة البيومترية.',
    voiceoverEn: 'Introducing Na2la V10 PRO: the integrated ecosystem putting your logistics empire in the palm of your hand. Full multi-tenant cloud isolation for every enterprise, and absolute security with biometric authentication.',
    accentColor: 'emerald',
    hudCode: 'CLOUD_ISOLATE // AES_256_GCM // BIO_FINGERPRINT_OK',
  },
  {
    id: 3,
    key: 'tracking_conflict',
    startTime: 20,
    endTime: 31,
    titleAr: 'تتبع الشحنات ومنع تضارب السائقين',
    titleEn: 'Live GPS Tracking & Driver Conflict Prevention',
    subtitleAr: 'خوارزميات ذكية تقضي على تضارب الرحلات في أجزاء من الثانية',
    subtitleEn: 'Real-time Telemetry & Smart Dispatch Deconfliction',
    voiceoverAr: 'تابع شحناتك لحظة بلحظة، بخوارزميات ذكية تمنع تضارب رحلات السائقين، وتدقيق دقيق لصيانة الشاحنات ومواعيد الزيت.',
    voiceoverEn: 'Track your shipments second-by-second with smart algorithms preventing driver trip conflicts, and precision fleet maintenance with oil change intervals.',
    accentColor: 'purple',
    hudCode: 'GPS_RADAR // SPEED_88KMH // CONFLICT_RESOLVER_12MS',
  },
  {
    id: 4,
    key: 'financial_5cards',
    startTime: 31,
    endTime: 41,
    titleAr: 'الجدول الخماسي المالي المعتمد',
    titleEn: 'The Certified 5-Card Financial Dashboard',
    subtitleAr: 'صافي الأرباح، الخزينة، الفواتير الآجلة والمجمعة بضغطة زر',
    subtitleEn: 'Net Profits, Treasury Liquidity & Deferred Invoices',
    voiceoverAr: 'ومع الجدول الخماسي المعتمد، تتبع أرباحك، خزينتك، وفواتيرك الآجلة والمجمعة بضغطة زر واحدة.',
    voiceoverEn: 'And with the certified 5-Card Matrix, track net profits, treasury, and deferred and consolidated invoices at the click of a single button.',
    accentColor: 'blue',
    hudCode: 'FIN_MATRIX_5X // CASH_FLOW // INSTANT_RECONCILE',
  },
  {
    id: 5,
    key: 'maintenance_ocr',
    startTime: 41,
    endTime: 52,
    titleAr: 'ذكاء Gemini Pro وقراءة بونات الميزان OCR',
    titleEn: 'Gemini Pro AI OCR & Public Visitor Tracking',
    subtitleAr: 'تحليل فوري لأوزان الشاحنات وتتبع الشحنات للزوار برقم الشحنة',
    subtitleEn: 'Computer Vision Weight Ticket Slip & Cargo Verification',
    voiceoverAr: 'بالإضافة إلى مساعد Gemini Pro الذكي الذي يُحلل بونات الميزان بتقنية OCR، ويُتيح للزوار تتبع شحناتهم فورياً برقم الشحنة.',
    voiceoverEn: 'In addition to the Gemini Pro AI Assistant that analyzes scale ticket weight slips via OCR, and enables visitors to track their shipments instantly with a tracking code.',
    accentColor: 'emerald',
    hudCode: 'GEMINI_PRO_VISION // OCR_SCALE_EXTRACT // VISITOR_TRACK',
  },
  {
    id: 6,
    key: 'call_to_action',
    startTime: 52,
    endTime: 60,
    titleAr: 'أنت أسطورة الطريق - انضم إلى Na2la V10 PRO',
    titleEn: 'You Are The Legend of The Road - Join Na2la',
    subtitleAr: 'ابدأ قيادة إمبراطوريتك اللوجستية الآن',
    subtitleEn: 'Scale Your Fleet Operations with V10 PRO',
    voiceoverAr: 'منصة نقلة V10 PRO.. لأنك لست مجرد ناقل، أنت أسطورة الطريق. انضم إلينا الآن عبر: https://karamegy.github.io/Na2la/',
    voiceoverEn: 'Na2la V10 PRO Platform.. Because you are not just a carrier, you are a legend of the road. Join us now at: https://karamegy.github.io/Na2la/',
    accentColor: 'purple',
    hudCode: 'LEGEND_ROAD // PROMO_FINALE // karamegy.github.io/Na2la',
  },
];

export const OFFICIAL_CTA_URL = 'https://karamegy.github.io/Na2la/';

export interface VoiceoverSpeakOptions {
  rate?: number;
  pitch?: number;
  sceneDuration?: number; // detected scene duration in seconds
  autoNormalize?: boolean;
}

class VoiceoverSynthesizer {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private arabicVoice: SpeechSynthesisVoice | null = null;
  private isVoiceLoaded: boolean = false;
  private isAutoNormalizationEnabled: boolean = true;
  private lastNormalizationMetrics: VolumeNormalizationMetrics | null = null;
  private metricsListeners: Array<(metrics: VolumeNormalizationMetrics) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer Arabic voices (e.g. ar-EG, ar-SA, ar)
    this.arabicVoice =
      voices.find(v => v.lang.startsWith('ar')) ||
      voices.find(v => v.lang.includes('ar')) ||
      null;
    this.isVoiceLoaded = true;
  }

  public getArabicVoice(): SpeechSynthesisVoice | null {
    if (!this.arabicVoice) this.initVoices();
    return this.arabicVoice;
  }

  /**
   * Automatic Volume Normalization Calculation:
   * Dynamically balances audio gain/volume and speech delivery rate based on detected scene duration.
   * Shorter scenes or high text density -> boosts perceived loudness and slightly tightens rate so audio doesn't bleed.
   * Longer/relaxed scenes -> eases volume to prevent acoustic fatigue, balancing with cyber synth ambiance.
   */
  public calculateNormalization(
    text: string,
    detectedSceneDuration: number = 10
  ): VolumeNormalizationMetrics {
    const cleanText = text.replace('https://karamegy.github.io/Na2la/', 'رابط نقلة دوت جيت هب دوت آي أو سلاش نقلة');
    const textLength = cleanText.length;
    const safeDuration = Math.max(2, detectedSceneDuration);
    const density = textLength / safeDuration; // characters per second

    let normalizedVolume: number;
    let calibratedRate: number;
    let gainDb: number;
    let profileName: string;
    let targetLufs: number;

    if (density >= 14.5) {
      // High density / Compact scene (e.g., Scene 6 Finale CTA or Scene 2 Multi-Tenant)
      normalizedVolume = 1.0;
      calibratedRate = 1.02;
      gainDb = +1.8;
      targetLufs = -14.0;
      profileName = 'حضور عالي وتركيز صوتي مكثف';
    } else if (density >= 11.5) {
      // Standard balanced scene (e.g., Scene 1, Scene 3, Scene 4)
      normalizedVolume = 0.92;
      calibratedRate = 0.96;
      gainDb = +0.5;
      targetLufs = -16.0;
      profileName = 'توازن سينمائي قياسي';
    } else {
      // Spacious scene / Light density
      normalizedVolume = 0.84;
      calibratedRate = 0.93;
      gainDb = -0.8;
      targetLufs = -18.0;
      profileName = 'أجواء محيطية مريحة';
    }

    if (!this.isAutoNormalizationEnabled) {
      normalizedVolume = 1.0;
      calibratedRate = 0.95;
      gainDb = 0.0;
      targetLufs = -14.0;
      profileName = 'تعطيل المعايرة (أقصى مستوى)';
    }

    return {
      sceneDuration: safeDuration,
      speechTextLength: textLength,
      speechDensityCharsPerSec: Number(density.toFixed(1)),
      normalizedVolume: Number(normalizedVolume.toFixed(2)),
      calibratedRate: Number(calibratedRate.toFixed(2)),
      gainAdjustmentDb: Number(gainDb.toFixed(1)),
      targetLufs,
      profileName,
      isAutoNormalized: this.isAutoNormalizationEnabled,
    };
  }

  public speak(
    text: string,
    optionsOrRate: number | VoiceoverSpeakOptions = 0.95,
    pitch: number = 1.0
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stop();

    let rate = 0.95;
    let actualPitch = pitch;
    let sceneDuration = 10;
    let autoNormalize = this.isAutoNormalizationEnabled;

    if (typeof optionsOrRate === 'number') {
      rate = optionsOrRate;
    } else if (typeof optionsOrRate === 'object' && optionsOrRate !== null) {
      if (optionsOrRate.rate !== undefined) rate = optionsOrRate.rate;
      if (optionsOrRate.pitch !== undefined) actualPitch = optionsOrRate.pitch;
      if (optionsOrRate.sceneDuration !== undefined) sceneDuration = optionsOrRate.sceneDuration;
      if (optionsOrRate.autoNormalize !== undefined) autoNormalize = optionsOrRate.autoNormalize;
    }

    // Clean URL spoken text so it doesn't sound awkward
    const spokenText = text.replace('https://karamegy.github.io/Na2la/', 'رابط نقلة دوت جيت هب دوت آي أو سلاش نقلة');

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'ar-SA';
    if (this.arabicVoice) {
      utterance.voice = this.arabicVoice;
    }

    // Dynamic Volume Normalization & Rate Calibration based on detected scene duration
    let metrics: VolumeNormalizationMetrics;
    if (autoNormalize) {
      metrics = this.calculateNormalization(text, sceneDuration);
      utterance.volume = metrics.normalizedVolume;
      utterance.rate = metrics.calibratedRate;
    } else {
      metrics = {
        sceneDuration,
        speechTextLength: spokenText.length,
        speechDensityCharsPerSec: Number((spokenText.length / sceneDuration).toFixed(1)),
        normalizedVolume: 1.0,
        calibratedRate: rate,
        gainAdjustmentDb: 0,
        targetLufs: -14,
        profileName: 'ثابت يدوي',
        isAutoNormalized: false,
      };
      utterance.volume = 1.0;
      utterance.rate = rate;
    }

    utterance.pitch = actualPitch;
    this.lastNormalizationMetrics = metrics;
    this.notifyMetricsListeners(metrics);

    // Duck ambient background sound during speech for clean acoustic hierarchy
    soundEngine.duckAmbient(0.35, sceneDuration);

    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public setAutoNormalization(enabled: boolean) {
    this.isAutoNormalizationEnabled = enabled;
  }

  public getAutoNormalization(): boolean {
    return this.isAutoNormalizationEnabled;
  }

  public getLastNormalizationMetrics(): VolumeNormalizationMetrics | null {
    return this.lastNormalizationMetrics;
  }

  public onNormalizationMetricsChange(callback: (metrics: VolumeNormalizationMetrics) => void): () => void {
    this.metricsListeners.push(callback);
    if (this.lastNormalizationMetrics) {
      callback(this.lastNormalizationMetrics);
    }
    return () => {
      this.metricsListeners = this.metricsListeners.filter(cb => cb !== callback);
    };
  }

  private notifyMetricsListeners(metrics: VolumeNormalizationMetrics) {
    this.metricsListeners.forEach(cb => {
      try {
        cb(metrics);
      } catch {
        // Safe listener execution
      }
    });
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}

export const voSynthesizer = new VoiceoverSynthesizer();

