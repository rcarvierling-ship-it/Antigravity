export type Confidence = "High" | "Medium" | "Low";

export type SiteCategory = 'bridge' | 'shore' | 'inlet' | 'muck' | 'reef' | 'wreck' | 'wall' | 'drift' | 'open_ocean' | 'unknown';

export interface ConditionMetric {
  value: string | number;
  unit: string;
  source: string;
  confidence: Confidence;
  distanceKm?: number;
  isObserved?: boolean;
  interpretationLabel?: string;
}

export interface DiveSiteConditions {
  marine: {
    waveHeight: ConditionMetric;
    waveDirection: ConditionMetric;
    wavePeriod: ConditionMetric;
    seaSurfaceTemp: ConditionMetric;
    currentSpeed: ConditionMetric;
    currentDirection: ConditionMetric;
    tide: ConditionMetric;
  };
  weather: {
    airTemp: ConditionMetric;
    windSpeed: ConditionMetric;
    windDirection: ConditionMetric;
    precipitationChance: ConditionMetric;
    cloudCover: ConditionMetric;
    visibility: ConditionMetric;
  };
  analysis: {
    diveabilityScore: number;
    overallRating: "Excellent" | "Good" | "Fair" | "Poor" | "Avoid";
    currentRisk: "Low" | "Moderate" | "High";
    surgeRisk: "Low" | "Moderate" | "High";
    beginnerSuitability: "Good" | "Caution" | "Poor";
    summary: string;
    recommendedFor: string;
    notes: string[];
  };
  meta: {
    primarySource: string;
    confidenceSummary: Confidence;
    note: string;
    lastUpdated: string;
    siteCategory: SiteCategory;
    interpretationLabel: string;
  };
}
