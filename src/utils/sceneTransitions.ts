import { Variants, Transition } from 'motion/react';
import { SceneTransitionEffect } from '../types';

/**
 * Dynamic Scene Transition Variants for Na2la V10 PRO Video Viewport
 * Powered by Framer Motion (motion/react) layout & exit animations.
 */

// 1. DIGITAL WIPE: Clean directional geometric cyber wipe
export const digitalWipeVariants: Variants = {
  initial: {
    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    scale: 1.02,
    opacity: 0.7,
  },
  animate: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    scale: 0.98,
    opacity: 0.4,
    transition: {
      duration: 0.45,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

// 2. GLITCH: RGB split chromatic aberration, slice displacement & jitter
export const glitchVariants: Variants = {
  initial: {
    opacity: [0, 0.85, 0.3, 1],
    x: [-24, 18, -8, 4, 0],
    skewX: [8, -6, 3, 0],
    filter: [
      'drop-shadow(-6px 0 0 rgba(239,68,68,0.9)) drop-shadow(6px 0 0 rgba(6,182,212,0.9)) contrast(150%)',
      'drop-shadow(4px 0 0 rgba(239,68,68,0.8)) drop-shadow(-4px 0 0 rgba(6,182,212,0.8))',
      'none',
    ],
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      times: [0, 0.3, 0.6, 0.85, 1],
    },
  },
  animate: {
    opacity: 1,
    x: 0,
    skewX: 0,
    filter: 'none',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: [1, 0.8, 0.25, 0],
    x: [0, -18, 22, -6],
    skewX: [0, -8, 6, 0],
    filter: [
      'none',
      'drop-shadow(6px 0 0 rgba(239,68,68,0.95)) drop-shadow(-6px 0 0 rgba(6,182,212,0.95)) hue-rotate(-45deg)',
      'drop-shadow(-10px 0 0 rgba(239,68,68,1)) drop-shadow(10px 0 0 rgba(6,182,212,1)) contrast(180%)',
      'none',
    ],
    transition: {
      duration: 0.38,
      ease: 'easeInOut',
    },
  },
};

// 3. CYBER SHUTTER: Futuristic diagonal geometric shutter zoom
export const cyberShutterVariants: Variants = {
  initial: {
    clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
    scale: 1.06,
    opacity: 0,
  },
  animate: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
    scale: 0.94,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

// 4. CINEMATIC FADE: Smooth filmic dissolve with micro-depth
export const cinematicFadeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

/**
 * Retrieve transition variants by mode
 */
export function getSceneTransitionVariants(effect: SceneTransitionEffect): Variants {
  switch (effect) {
    case 'digital_wipe':
      return digitalWipeVariants;
    case 'glitch':
      return glitchVariants;
    case 'cyber_shutter':
      return cyberShutterVariants;
    case 'fade':
    default:
      return cinematicFadeVariants;
  }
}

export const TRANSITION_EFFECT_CONFIGS: {
  id: SceneTransitionEffect;
  nameAr: string;
  nameEn: string;
  iconName: string;
  description: string;
}[] = [
  {
    id: 'digital_wipe',
    nameAr: 'مسح رقمي',
    nameEn: 'Digital Wipe',
    iconName: 'LaserWipe',
    description: 'مسح هندسي ليزري عبر اتجاه الشاشة مع بيانات التزامن',
  },
  {
    id: 'glitch',
    nameAr: 'خلل تقني',
    nameEn: 'Glitch Distortion',
    iconName: 'Zap',
    description: 'تشتت لوني RGB وانزياح أفقي رقمي مع تشويش صوتي',
  },
  {
    id: 'cyber_shutter',
    nameAr: 'غالق سيبراني',
    nameEn: 'Cyber Shutter',
    iconName: 'Aperture',
    description: 'انغلاق وانفتاح رقمي هندسي للبوابات البصرية',
  },
  {
    id: 'fade',
    nameAr: 'تلاشي سينمائي',
    nameEn: 'Cinematic Fade',
    iconName: 'Sparkles',
    description: 'تلاشي سينمائي فائق النعومة مع عمق بصري',
  },
];
