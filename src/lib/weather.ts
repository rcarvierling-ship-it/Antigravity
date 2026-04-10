/**
 * Weather & Marine Conditions API client
 * Integrating with OpenWeatherMap for general conditions
 * (StormGlass recommended for production swell/tide data)
 */

export interface WeatherData {
  temp: number;
  description: string;
  humidity?: number;
  windSpeed?: number;
  visibility?: number;
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn("Weather API key not found. Returning mock data.");
    return {
      temp: 28,
      description: "Clear sky",
      humidity: 70,
      windSpeed: 5,
      visibility: 10000
    };
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    
    if (data.cod !== 200) throw new Error(data.message);

    return {
      temp: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      visibility: data.visibility
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
