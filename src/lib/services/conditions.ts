import { Confidence, DiveSiteConditions, ConditionMetric, SiteCategory } from "@/types/conditions";
import { DiveIntelligenceService, SiteMetadata } from "./dive-intelligence";

const OPEN_METEO_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";
const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const NOAA_STATIONS_URL = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json";
const NOAA_DATA_URL = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
const STORMGLASS_URL = "https://api.stormglass.io/v2/weather/point";

export async function getDiveSiteConditions(
  lat: number, 
  lon: number, 
  country?: string, 
  diveType?: string,
  siteMetadata?: SiteMetadata | null
): Promise<DiveSiteConditions> {
  const isUS = country?.toLowerCase() === 'usa' || country?.toLowerCase() === 'united states' || country?.toLowerCase() === 'us';
  const category = getSiteCategory(diveType || '');
  
  // Default metadata if none provided (conservative fallback)
  const meta: SiteMetadata = siteMetadata || {
    id: 'unknown',
    name: 'Unknown Site',
    dive_type: diveType || 'Unknown',
    skill_level: 'Beginner',
    max_depth_m: 20,
    site_exposure: 'exposed',
    protection_level: 'low'
  };

  let rawData: DiveSiteConditions;

  // PRIMARY: Stormglass
  try {
    const stormGlass = await fetchStormGlassData(lat, lon, category);
    if (stormGlass) {
      rawData = stormGlass;
    } else {
      throw new Error("Stormglass returned null");
    }
  } catch (err) {
    console.warn("Stormglass fetch failed, falling back to NOAA/OpenMeteo:", err);
    
    // SECONDARY: NOAA (Regional Station Data)
    try {
      if (isUS) {
        const noaa = await fetchNOAAData(lat, lon, category);
        if (noaa) {
          rawData = noaa;
        } else {
          rawData = await fetchOpenMeteoData(lat, lon, category);
        }
      } else {
        rawData = await fetchOpenMeteoData(lat, lon, category);
      }
    } catch (noaaErr) {
      rawData = await fetchOpenMeteoData(lat, lon, category);
    }
  }

  // Apply Intelligence Engine
  return DiveIntelligenceService.analyze(rawData, meta);
}

async function fetchStormGlassData(lat: number, lon: number, category: SiteCategory): Promise<DiveSiteConditions | null> {
  const apiKey = process.env.STORMGLASS_API_KEY;
  if (!apiKey) {
    console.warn("STORMGLASS_API_KEY missing - skipping Stormglass primary fetch.");
    return null;
  }

  const params = "waveHeight,swellHeight,swellDirection,swellPeriod,waterTemperature,currentSpeed,currentDirection,windSpeed,windDirection,airTemperature";
  const res = await fetch(`${STORMGLASS_URL}?lat=${lat}&lng=${lon}&params=${params}`, {
    headers: { 'Authorization': apiKey }
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Stormglass API Error:", err);
    return null;
  }

  const data = await res.json();
  const current = data.hours[0]; // Nearest hour

  const m = (val: any, unit: string) => ({
    value: val !== undefined ? val : "Unavailable",
    unit,
    source: "Stormglass",
    confidence: "Medium" as Confidence,
    isObserved: false, // Model-based
    distanceKm: 0
  });

  return {
    marine: {
      waveHeight: m(current.waveHeight?.sg, "m"),
      waveDirection: m(current.swellDirection?.sg, "°"), // Using swell direction as proxy if waveDir missing
      wavePeriod: m(current.swellPeriod?.sg, "s"),
      seaSurfaceTemp: m(current.waterTemperature?.sg, "°C"),
      currentSpeed: m(current.currentSpeed?.sg, "m/s"),
      currentDirection: m(current.currentDirection?.sg, "°"),
      tide: { value: "---", unit: "", source: "Stormglass", confidence: "Low" }
    },
    weather: {
      airTemp: m(current.airTemperature?.sg, "°C"),
      windSpeed: m(current.windSpeed?.sg, "m/s"),
      windDirection: m(current.windDirection?.sg, "°"),
      precipitationChance: { value: "---", unit: "", source: "Stormglass", confidence: "Low" },
      cloudCover: { value: "---", unit: "", source: "Stormglass", confidence: "Low" },
      visibility: { value: "---", unit: "", source: "Stormglass", confidence: "Low" }
    },
    meta: {
      primarySource: "Stormglass",
      confidenceSummary: "Medium",
      note: "High-fidelity marine model data curated for dive mission profiles.",
      lastUpdated: new Date().toISOString(),
      siteCategory: category,
      interpretationLabel: "Stormglass Marine Model"
    }
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getSiteCategory(diveType: string): SiteCategory {
    const t = diveType.toLowerCase();
    if (t.includes('bridge')) return 'bridge';
    if (t.includes('shore')) return 'shore';
    if (t.includes('inlet')) return 'inlet';
    if (t.includes('muck')) return 'muck';
    if (t.includes('reef')) return 'reef';
    if (t.includes('wreck')) return 'wreck';
    if (t.includes('wall')) return 'wall';
    if (t.includes('drift')) return 'drift';
    if (t.includes('open ocean')) return 'open_ocean';
    return 'unknown';
}

function getInterpretationLabel(category: SiteCategory): string {
    switch (category) {
        case 'bridge':
        case 'shore':
        case 'inlet':
        case 'muck':
            return 'Local Coastal Condition';
        default:
            return 'Offshore Forecast';
    }
}

async function fetchNOAAData(lat: number, lon: number, category: SiteCategory): Promise<DiveSiteConditions | null> {
  // 1. Find nearest station within 25km (Strict Limit)
  const stationsRes = await fetch(`${NOAA_STATIONS_URL}?lat=${lat}&lng=${lon}&radius=25`);
  const stationsData = await stationsRes.json();
  
  if (!stationsData.stations || stationsData.stations.length === 0) return null;

  // 2. Strict Geolocation Validation
  // The NOAA API radius parameter is sometimes unreliable or uses nautical miles.
  // We calculate real distance to the first few results to ensure accuracy.
  const validStations = stationsData.stations
    .map((s: any) => ({ ...s, dist: calculateDistance(lat, lon, parseFloat(s.lat), parseFloat(s.lng)) }))
    .filter((s: any) => s.dist <= 25)
    .sort((a: any, b: any) => a.dist - b.dist);

  if (validStations.length === 0) {
    console.info(`Discarded ${stationsData.stations.length} NOAA stations due to >25km distance validation.`);
    return null;
  }

  const station = validStations[0];
  const stationId = station.id;
  const stationDist = station.dist;

  // 3. Fetch latest data from station
  const metrics = ["water_temperature", "air_temperature", "wind", "predictions"];
  const dataPromises = metrics.map(product => 
    fetch(`${NOAA_DATA_URL}?product=${product}&station=${stationId}&units=metric&time_zone=lst_ldt&format=json&date=latest`)
      .then(res => res.json())
      .catch(() => null)
  );

  const [waterTemp, airTemp, wind, tides] = await Promise.all(dataPromises);

  // 4. Resolve confidence based on distance
  const confidence: Confidence = stationDist <= 10 ? "High" : "Medium";
  const interpretation = getInterpretationLabel(category);

  // 5. Fallback to Open-Meteo for missing fields
  const omFallback = await fetchOpenMeteoData(lat, lon, category);

  return {
    marine: {
      waveHeight: { ...omFallback.marine.waveHeight, interpretationLabel: 'Offshore model' },
      waveDirection: omFallback.marine.waveDirection,
      wavePeriod: omFallback.marine.wavePeriod,
      seaSurfaceTemp: waterTemp?.data ? {
        value: waterTemp.data[0].v,
        unit: "°C",
        source: `NOAA ${stationId}`,
        confidence,
        distanceKm: stationDist,
        isObserved: true
      } : omFallback.marine.seaSurfaceTemp,
      currentSpeed: omFallback.marine.currentSpeed,
      currentDirection: omFallback.marine.currentDirection,
      tide: tides?.predictions ? {
        value: tides.predictions[0].v,
        unit: "m",
        source: `NOAA ${stationId}`,
        confidence,
        distanceKm: stationDist,
        isObserved: true
      } : { value: "Unavailable", unit: "", source: "NOAA", confidence: "Low" }
    },
    weather: {
      airTemp: airTemp?.data ? {
        value: airTemp.data[0].v,
        unit: "°C",
        source: `NOAA ${stationId}`,
        confidence,
        distanceKm: stationDist,
        isObserved: true
      } : omFallback.weather.airTemp,
      windSpeed: wind?.data ? {
        value: wind.data[0].s,
        unit: "m/s",
        source: `NOAA ${stationId}`,
        confidence,
        distanceKm: stationDist,
        isObserved: true
      } : omFallback.weather.windSpeed,
      windDirection: wind?.data ? {
        value: wind.data[0].d,
        unit: "°",
        source: `NOAA ${stationId}`,
        confidence,
        distanceKm: stationDist,
        isObserved: true
      } : omFallback.weather.windDirection,
      precipitationChance: omFallback.weather.precipitationChance,
      cloudCover: omFallback.weather.cloudCover,
      visibility: omFallback.weather.visibility
    },
    meta: {
      primarySource: "NOAA / NWS",
      confidenceSummary: confidence,
      note: confidence === "High" ? "Based on official nearby station data." : `Using distant station (${Math.round(stationDist)}km). Model values used for gaps.`,
      lastUpdated: new Date().toISOString(),
      siteCategory: category,
      interpretationLabel: interpretation
    }
  };
}

async function fetchOpenMeteoData(lat: number, lon: number, category: SiteCategory): Promise<DiveSiteConditions> {
  const [marineRes, forecastRes] = await Promise.all([
    fetch(`${OPEN_METEO_MARINE_URL}?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction`),
    fetch(`${OPEN_METEO_FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=visibility`)
  ]);

  const marine = await marineRes.json();
  const forecast = await forecastRes.json();

  const m = (val: any, unit: string, source = "Open-Meteo Marine") => ({
    value: val ?? "Unavailable",
    unit,
    source,
    confidence: "Medium" as Confidence,
    isObserved: false,
    distanceKm: 0
  });

  const w = (val: any, unit: string, source = "Open-Meteo Weather") => ({
    value: val ?? "Unavailable",
    unit,
    source,
    confidence: "Medium" as Confidence,
    isObserved: false,
    distanceKm: 0
  });

  return {
    marine: {
      waveHeight: m(marine.current?.wave_height, "m"),
      waveDirection: m(marine.current?.wave_direction, "°"),
      wavePeriod: m(marine.current?.wave_period, "s"),
      seaSurfaceTemp: m(forecast.current?.temperature_2m, "°C"),
      currentSpeed: m(marine.current?.ocean_current_velocity, "km/h"),
      currentDirection: m(marine.current?.ocean_current_direction, "°"),
      tide: m(null, "", "Open-Meteo")
    },
    weather: {
      airTemp: w(forecast.current?.temperature_2m, "°C"),
      windSpeed: w(forecast.current?.wind_speed_10m, "km/h"),
      windDirection: w(forecast.current?.wind_direction_10m, "°"),
      precipitationChance: w(forecast.current?.precipitation, "mm"),
      cloudCover: w(forecast.current?.cloud_cover, "%"),
      visibility: w(forecast.hourly?.visibility?.[0], "m")
    },
    meta: {
      primarySource: "Open-Meteo",
      confidenceSummary: "Medium",
      note: "Model-based marine forecast; local coastal conditions may vary.",
      lastUpdated: new Date().toISOString(),
      siteCategory: category,
      interpretationLabel: getInterpretationLabel(category)
    }
  };
}
