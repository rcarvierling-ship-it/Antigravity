export type Confidence = "High" | "Medium" | "Low";

export interface ConditionMetric {
  value: string | number;
  unit: string;
  source: string;
  confidence: Confidence;
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
  meta: {
    primarySource: string;
    confidenceSummary: Confidence;
    note: string;
    lastUpdated: string;
  };
}
