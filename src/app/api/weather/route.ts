import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_STORMGLASS_API_KEY;

  if (!apiKey || apiKey === "your_stormglass_api_key_here") {
    // If no real API key is configured, return mocked data rather than failing
    // This allows the app to continue functioning in development/demo modes
    return NextResponse.json({
      mocked: true,
      data: {
        waveHeight: (Math.random() * 2 + 0.5).toFixed(1),
        currentSpeed: (Math.random() * 0.8 + 0.1).toFixed(2),
        waterTemperature: (Math.random() * 10 + 20).toFixed(1),
        windSpeed: (Math.random() * 15 + 5).toFixed(1),
      }
    });
  }

  try {
    const stormglassUrl = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=waveHeight,waterTemperature,windSpeed,currentSpeed`;
    const response = await fetch(stormglassUrl, {
      headers: {
        Authorization: apiKey,
      },
      // Cache heavily to avoid exhausting 50/day limit on free tier
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      if (response.status === 429) {
        // Fallback to mock data if quota exceeded to prevent UI breakdown
        console.warn("StormGlass API quota exceeded, falling back to mock data.");
        return NextResponse.json({
          mocked: true,
          quotaExceeded: true,
          data: {
            waveHeight: (Math.random() * 2 + 0.5).toFixed(1),
            currentSpeed: (Math.random() * 0.8 + 0.1).toFixed(2),
            waterTemperature: (Math.random() * 10 + 20).toFixed(1),
            windSpeed: (Math.random() * 15 + 5).toFixed(1),
          }
        });
      }
      throw new Error(`StormGlass API error: ${response.status}`);
    }

    const json = await response.json();
    
    // Stormglass returns an array of hours. We take the current hour (index 0).
    const currentData = json.hours[0];
    
    // Extract the primary data source (usually 'sg' for stormglass internal aggregation)
    const extract = (param: any) => param?.sg || param?.noaa || param?.icon || 0;

    return NextResponse.json({
      mocked: false,
      data: {
        waveHeight: extract(currentData.waveHeight).toFixed(1),
        currentSpeed: extract(currentData.currentSpeed).toFixed(2),
        waterTemperature: extract(currentData.waterTemperature).toFixed(1),
        windSpeed: extract(currentData.windSpeed).toFixed(1),
      }
    });

  } catch (error) {
    console.error("Weather API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
