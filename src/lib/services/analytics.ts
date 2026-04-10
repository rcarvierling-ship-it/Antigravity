/**
 * Abyss Mission Intelligence Engine
 * Specialized telemetry calculations for gas efficiency and decompression variability.
 */

export interface TelemetryData {
  startPressure: number;
  endPressure: number;
  tankSize: number;
  bottomTime: number;
  avgDepthM: number;
  isImperial?: boolean;
}

/**
 * Calculates Surface Air Consumption (SAC) rate.
 * Returns value in Liters/Minute (normalized metric).
 */
export function calculateSAC({
  startPressure,
  endPressure,
  tankSize,
  bottomTime,
  avgDepthM,
  isImperial = true
}: TelemetryData): number {
  if (bottomTime <= 0) return 0;

  let barUsed: number;
  let tankVolL: number;
  let avgDepthATA: number;

  if (isImperial) {
    // Convert PSI to BAR (roughly 14.5038 PSI = 1 BAR)
    barUsed = (startPressure - endPressure) / 14.5038;
    // Convert CUFT to Liters (roughly 1 CUFT = 28.3168 L)
    // Note: This requires "Working Pressure" (usually 3000 PSI) for accurate conversion.
    // For simplicity, we'll assume standard AL80 (80 cuft @ 3000 psi -> 11.1L water volume)
    // Liter_Volume = (Rated_Capacity_CUFT * 28.3168) / (Rated_Pressure_PSI / 14.5038)
    tankVolL = (tankSize * 28.3168) / (3000 / 14.5038); 
    avgDepthATA = (avgDepthM * 3.28084 + 33) / 33;
  } else {
    barUsed = startPressure - endPressure;
    tankVolL = tankSize;
    avgDepthATA = (avgDepthM + 10) / 10;
  }

  const totalLitersUsed = barUsed * tankVolL;
  const sacRate = (totalLitersUsed / bottomTime) / avgDepthATA;

  return Number(sacRate.toFixed(2));
}

/**
 * Categorizes a dive based on depth stratification.
 */
export function getDepthZone(maxDepthM: number): string {
  if (maxDepthM <= 12) return "Shallow";
  if (maxDepthM <= 30) return "Recreational";
  if (maxDepthM <= 40) return "Deep";
  return "Technical";
}

/**
 * Formats SAC rate back to the diver's preferred units for UI.
 */
export function formatSAC(sacLmin: number, isImperial: boolean): string {
  if (isImperial) {
    // Convert L/min to PSI/min (assuming AL80 tank factor of ~0.027)
    // Or just show L/min as a universal mission metric (standard in tech)
    return `${sacLmin} L/min`;
  }
  return `${sacLmin} L/min`;
}
