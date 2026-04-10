import { Confidence, DiveSiteConditions, ConditionMetric } from "@/types/conditions";

const OPEN_METEO_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";
const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const NOAA_STATIONS_URL = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json";
const NOAA_DATA_URL = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

export async function getDiveSiteConditions(lat: number, lon: number, country?: string): Promise<DiveSiteConditions> {
  const isUS = country?.toLowerCase() === 'usa' || country?.toLowerCase() === 'united states' || country?.toLowerCase() === 'us';
  
  try {
    if (isUS) {
      const noaaData = await fetchNOAAData(lat, lon);
      if (noaaData) return noaaData;
    }
  } catch (err) {
    console.warn("NOAA Fetch failed, falling back to Open-Meteo:", err);
  }

  return fetchOpenMeteoData(lat, lon);
}

async function fetchNOAAData(lat: number, lon: number): Promise<DiveSiteConditions | null> {
  // 1. Find nearest station within 25nm
  const stationsRes = await fetch(`${NOAA_STATIONS_URL}?lat=${lat}&lng=${lon}&radius=25`);
  const stationsData = await stationsRes.json();
  
  if (!stationsData.stations || stationsData.stations.length === 0) return null;

  // Prefer stations with water temperature and wind
  const station = stationsData.stations[0]; // Simplification for now, could find best match
  const stationId = station.id;

  // 2. Fetch latest data from station
  const metrics = ["water_temperature", "air_temperature", "wind", "predictions"];
  const dataPromises = metrics.map(product => 
    fetch(`${NOAA_DATA_URL}?product=${product}&station=${stationId}&units=metric&time_zone=lst_ldt&format=json&date=latest`)
      .then(res => res.json())
      .catch(() => null)
  );

  const [waterTemp, airTemp, wind, tides] = await Promise.all(dataPromises);

  // 3. Fallback to Open-Meteo for missing fields (like wave height if not a buoy)
  const omFallback = await fetchOpenMeteoData(lat, lon);

  return {
    marine: {
      waveHeight: omFallback.marine.waveHeight, // NOAA Tides/Currents stations often lack waves (need buoys)
      waveDirection: omFallback.marine.waveDirection,
      wavePeriod: omFallback.marine.wavePeriod,
      seaSurfaceTemp: waterTemp?.data ? {
        value: waterTemp.data[0].v,
        unit: "°C",
        source: `NOAA Station ${stationId}`,
        confidence: "High"
      } : omFallback.marine.seaSurfaceTemp,
      currentSpeed: omFallback.marine.currentSpeed,
      currentDirection: omFallback.marine.currentDirection,
      tide: tides?.predictions ? {
        value: tides.predictions[0].v,
        unit: "m",
        source: `NOAA Station ${stationId}`,
        confidence: "High"
      } : { value: "Unavailable", unit: "", source: "NOAA", confidence: "Low" }
    },
    weather: {
      airTemp: airTemp?.data ? {
        value: airTemp.data[0].v,
        unit: "°C",
        source: `NOAA Station ${stationId}`,
        confidence: "High"
      } : omFallback.weather.airTemp,
      windSpeed: wind?.data ? {
        value: wind.data[0].s,
        unit: "m/s",
        source: `NOAA Station ${stationId}`,
        confidence: "High"
      } : omFallback.weather.windSpeed,
      windDirection: wind?.data ? {
        value: wind.data[0].d,
        unit: "°",
        source: `NOAA Station ${stationId}`,
        confidence: "High"
      } : omFallback.weather.windDirection,
      precipitationChance: omFallback.weather.precipitationChance,
      cloudCover: omFallback.weather.cloudCover,
      visibility: omFallback.weather.visibility
    },
    meta: {
      primarySource: "NOAA / NWS",
      confidenceSummary: "High",
      note: "Based on official nearby coastal forecast/station data.",
      lastUpdated: new Date().toISOString()
    }
  };
}

async function fetchOpenMeteoData(lat: number, lon: number): Promise<DiveSiteConditions> {
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
    confidence: "Medium" as Confidence
  });

  const w = (val: any, unit: string, source = "Open-Meteo Weather") => ({
    value: val ?? "Unavailable",
    unit,
    source,
    confidence: "Medium" as Confidence
  });

  return {
    marine: {
      waveHeight: m(marine.current?.wave_height, "m"),
      waveDirection: m(marine.current?.wave_direction, "°"),
      wavePeriod: m(marine.current?.wave_period, "s"),
      seaSurfaceTemp: m(forecast.current?.temperature_2m, "°C"), // Open-Meteo defaults to air temp if sea temp not in simple forecast
      currentSpeed: m(marine.current?.ocean_current_velocity, "km/h"),
      currentDirection: m(marine.current?.ocean_current_direction, "°"),
      tide: m(null, "", "Open-Meteo (Non-tidal)")
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
      primarySource: "Open-Meteo Marine",
      confidenceSummary: "Medium",
      note: "Model-based marine forecast; local coastal conditions may vary.",
      lastUpdated: new Date().toISOString()
    }
  };
}
