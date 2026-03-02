/**
 * 프리미엄 기능 분기 유틸리티
 */

export type SubscriptionTier = "free" | "premium";

export interface PremiumLimits {
  maxClubs: number;
  maxDailyDMs: number;
  canUploadReviewPhotos: boolean;
  canViewAllInfo: boolean;
  hasAdFree: boolean;
  hasProfileBoost: boolean;
  hasPremiumBadge: boolean;
}

const LIMITS: Record<SubscriptionTier, PremiumLimits> = {
  free: {
    maxClubs: 3,
    maxDailyDMs: 3,
    canUploadReviewPhotos: false,
    canViewAllInfo: false,
    hasAdFree: false,
    hasProfileBoost: false,
    hasPremiumBadge: false,
  },
  premium: {
    maxClubs: Infinity,
    maxDailyDMs: Infinity,
    canUploadReviewPhotos: true,
    canViewAllInfo: true,
    hasAdFree: true,
    hasProfileBoost: true,
    hasPremiumBadge: true,
  },
};

export function getLimits(tier: SubscriptionTier): PremiumLimits {
  return LIMITS[tier];
}

export function isPremiumFeature(feature: keyof PremiumLimits): boolean {
  return !LIMITS.free[feature];
}
