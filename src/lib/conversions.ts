/**
 * Unit conversion utilities for Antigravity (Metric to U.S. Customary)
 */

/**
 * Celsius to Fahrenheit
 */
export function cToF(celsius: number | string): string {
  const c = typeof celsius === "string" ? parseFloat(celsius) : celsius;
  if (isNaN(c)) return "---";
  return Math.round((c * 9) / 5 + 32).toString();
}

/**
 * Meters to Feet
 */
export function mToFt(meters: number | string): string {
  const m = typeof meters === "string" ? parseFloat(meters) : meters;
  if (isNaN(m)) return "---";
  return Math.round(m * 3.28084).toString();
}

/**
 * Meters per second to Miles per hour
 */
export function msToMph(mps: number | string): string {
  const s = typeof mps === "string" ? parseFloat(mps) : mps;
  if (isNaN(s)) return "---";
  return (s * 2.23694).toFixed(1);
}

/**
 * Cloud cover percentage to condition string
 */
export function cloudCoverToCondition(cloudCover: number | string): string {
  const cc = typeof cloudCover === "string" ? parseFloat(cloudCover) : cloudCover;
  if (isNaN(cc)) return "Unknown";
  if (cc < 10) return "Clear Skies";
  if (cc < 30) return "Partly Cloudy";
  if (cc < 70) return "Mostly Cloudy";
  return "Overcast";
}
