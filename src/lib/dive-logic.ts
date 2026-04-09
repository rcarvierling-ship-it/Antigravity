/**
 * Core Logic for Abyss Dive Calculations
 */

export interface SACInput {
  startPsi: number;
  endPsi: number;
  tankVolumeCuft: number;
  avgDepthFt: number;
  durationMin: number;
}

/**
 * Calculates Surface Air Consumption (SAC) rate.
 * Formula: SAC = (Consumed Air / Depth in Atmospheres) / Time
 * Result in CuFt/Min
 */
export function calculateSACRate(input: SACInput): number {
  const { startPsi, endPsi, tankVolumeCuft, avgDepthFt, durationMin } = input;
  
  if (durationMin <= 0) return 0;

  // 1. Calculate pressure consumed (multiplier of full tank)
  const pressureConsumed = startPsi - endPsi;
  const gasConsumedCuFt = (pressureConsumed / 3000) * tankVolumeCuft; // Assuming 3000psi standard fill ref

  // 2. Calculate atmospheres at avg depth: (Depth / 33) + 1
  const atmospheres = (avgDepthFt / 33) + 1;

  // 3. SAC = (CuFt / Atmospheres) / Min
  const sac = (gasConsumedCuFt / atmospheres) / durationMin;
  
  return parseFloat(sac.toFixed(2));
}

/**
 * Badge Logic
 */
export interface BadgeAward {
  slug: string;
  name: string;
}

export function checkBadgeEligibility(dive: any): BadgeAward[] {
  const awards: BadgeAward[] = [];

  // Deep Scout: > 100ft (approx 30m)
  if (dive.max_depth_m > 30) {
    awards.push({ slug: 'deep-scout', name: 'Deep Scout' });
  }

  // Polar Bear: < 55F (approx 13C)
  if (dive.water_temp_c < 13) {
    awards.push({ slug: 'polar-bear', name: 'Polar Bear' });
  }

  // Night Owl: Dive started late (approx after 6 PM local)
  if (dive.date) {
    const time = new Date(dive.date).getHours();
    if (time >= 18 || time <= 5) {
      awards.push({ slug: 'night-owl', name: 'Night Owl' });
    }
  }

  return awards;
}
