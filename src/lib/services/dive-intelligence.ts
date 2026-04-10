import { BaseDiveConditions, DiveSiteConditions, SiteCategory } from "@/types/conditions";

export interface SiteMetadata {
  id: string;
  name: string;
  dive_type: string;
  skill_level: string;
  max_depth_m: number;
  shore_access_type?: string;
  reef_orientation?: string;
  site_exposure?: "exposed" | "semi-protected" | "protected";
  protection_level?: "low" | "medium" | "high";
}

export class DiveIntelligenceService {
  static analyze(data: BaseDiveConditions, site: SiteMetadata): DiveSiteConditions {
    const { marine, weather, meta } = data;
    const category = meta.siteCategory;

    // 1. Normalized values
    const waves = typeof marine.waveHeight.value === 'number' ? marine.waveHeight.value : 0;
    const swell = typeof marine.waveHeight.value === 'number' ? marine.waveHeight.value : 0;
    const period = typeof marine.wavePeriod.value === 'number' ? marine.wavePeriod.value : 0;
    const current = typeof marine.currentSpeed.value === 'number' ? marine.currentSpeed.value : 0; // m/s
    const wind = typeof weather.windSpeed.value === 'number' ? weather.windSpeed.value : 0; // m/s
    const depth = site.max_depth_m || 20;

    // 2. Surge Estimation
    // surgeValue = (swell * period) / factor
    const surgeValue = (swell * (period || 8)) / (depth > 0 ? Math.sqrt(depth) : 4.5);
    let surgeRisk: "Low" | "Moderate" | "High" = "Low";
    if (surgeValue > 2.5) surgeRisk = "High";
    else if (surgeValue > 1.2) surgeRisk = "Moderate";

    // 3. Current Risk
    let currentRisk: "Low" | "Moderate" | "High" = "Low";
    const currentKts = current * 1.94384; // m/s to knots
    if (currentKts > 1.5) currentRisk = "High";
    else if (currentKts > 0.6) currentRisk = "Moderate";

    // 4. Diveability Score Calculation (0-100)
    let score = 100;
    const notes: string[] = [];

    // Wave impact (Dampened by protection level)
    const exposureFactor = site.site_exposure === "protected" ? 0.2 : site.site_exposure === "semi-protected" ? 0.6 : 1.0;
    const effectiveWaves = waves * exposureFactor;

    if (category === 'shore' || category === 'bridge') {
      if (effectiveWaves > 0.6) {
        score -= 40;
        notes.push("Challenging entry conditions due to waves.");
      } else if (effectiveWaves > 0.3) {
        score -= 20;
        notes.push("Small surf at entry point.");
      }
    } else {
      if (effectiveWaves > 1.5) {
        score -= 40;
        notes.push("Heavy seas; boat stability and surface safety impacted.");
      } else if (effectiveWaves > 1.0) {
        score -= 20;
        notes.push("Choppy conditions on the surface.");
      }
    }

    // Swell/Surge impact
    if (surgeRisk === "High") {
      score -= 30;
      notes.push("Strong underwater surge expected at depth.");
    } else if (surgeRisk === "Moderate") {
      score -= 15;
      notes.push("Moderate surge likely near structure or bottom.");
    }

    // Wind impact
    const windKts = wind * 1.94384;
    if (windKts > 22) {
      score -= 30;
      notes.push("High winds; surface visibility and navigation difficult.");
    } else if (windKts > 15) {
      score -= 10;
      notes.push("Breezy conditions creating surface chop.");
    }

    // Current impact (Category specific)
    if (category !== 'drift') {
      if (currentRisk === "High") {
        score -= 40;
        notes.push("Strong current makes precise buoyancy and positioning difficult.");
      } else if (currentRisk === "Moderate") {
        score -= 15;
        notes.push("Moderate current present.");
      }
    } else {
      // For drifts, moderate current is GOOD
      if (currentKts < 0.3) {
        score -= 10;
        notes.push("Weak current for a dedicated drift site.");
      } else if (currentKts > 2.5) {
        score -= 30;
        notes.push("Extreme current; technical experience required.");
      }
    }

    // 5. Overall Rating & Beginner Suitability
    let overallRating: "Excellent" | "Good" | "Fair" | "Poor" | "Avoid" = "Excellent";
    if (score < 40) overallRating = "Avoid";
    else if (score < 60) overallRating = "Poor";
    else if (score < 75) overallRating = "Fair";
    else if (score < 90) overallRating = "Good";

    let beginnerSuitability: "Good" | "Caution" | "Poor" = "Good";
    const skillLevel = site.skill_level?.toLowerCase() || 'beginner';
    
    if (score < 50 || currentRisk === "High" || surgeRisk === "High") {
      beginnerSuitability = "Poor";
    } else if (score < 75 || currentRisk === "Moderate" || skillLevel === 'advanced') {
      beginnerSuitability = "Caution";
    }

    // 6. Summary Generation
    let summary = "Good conditions for most divers.";
    if (score < 40) summary = "Unfavorable conditions; mission aborted recommended.";
    else if (currentRisk === "High") summary = "Strong current; better for advanced divers.";
    else if (surgeRisk === "High") summary = "Offshore swell creating significant surge at depth.";
    else if (score < 60) summary = "Poor conditions for beginner divers today.";
    else if (score < 80 && waves > 0.8) summary = "Choppy surface but underwater conditions likely manageable.";
    else if (site.site_exposure === 'protected') summary = "Protected site with shielded conditions.";

    // 7. Recommendations
    let recommendedFor = "All Divers";
    if (beginnerSuitability === "Poor") recommendedFor = "Advanced Only";
    else if (beginnerSuitability === "Caution") recommendedFor = "Intermediate / Guided";
    if (category === 'drift' && currentKts > 0.5) recommendedFor = "Drift Specialists";

    return {
      ...data,
      analysis: {
        diveabilityScore: Math.max(0, score),
        overallRating,
        currentRisk,
        surgeRisk,
        beginnerSuitability,
        summary,
        recommendedFor,
        notes: notes.length > 0 ? notes : ["Mission telemetry looks stable."]
      }
    };
  }
}
