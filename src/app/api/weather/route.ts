import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  const stormGlassKey = process.env.NEXT_PUBLIC_STORMGLASS_API_KEY;

  try {
    // 1. Fetch Air Weather from Open-Meteo (Free, Reliable)
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=cloudcover`;
    const openMeteoRes = await fetch(openMeteoUrl, { next: { revalidate: 3600 } });
    const openMeteoData = await openMeteoRes.json();

    // 2. Fetch specialized Marine Data from StormGlass
    let marineData = {
      waveHeight: "---",
      currentSpeed: "---",
      waterTemperature: "---"
    };

    if (stormGlassKey && stormGlassKey !== "your_stormglass_api_key_here") {
      const stormglassUrl = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=waveHeight,waterTemperature,currentSpeed`;
      const sgRes = await fetch(stormglassUrl, {
        headers: { Authorization: stormGlassKey },
        next: { revalidate: 3600 }
      });

      if (sgRes.ok) {
        const json = await sgRes.json();
        const current = json.hours[0];
        const ex = (p: any) => p?.sg || p?.noaa || p?.icon || 0;
        
        marineData = {
          waveHeight: ex(current.waveHeight).toFixed(1),
          currentSpeed: ex(current.currentSpeed).toFixed(2),
          waterTemperature: ex(current.waterTemperature).toFixed(1)
        };
      }
    }

    // 3. Combine Data
    const airTemp = openMeteoData.current_weather?.temperature || "---";
    const windSpeed = openMeteoData.current_weather?.windspeed || "---";
    const clouds = openMeteoData.hourly?.cloudcover?.[0] || "0";

    return NextResponse.json({
      mocked: !stormGlassKey || stormGlassKey === "your_stormglass_api_key_here",
      data: {
        waveHeight: marineData.waveHeight,
        currentSpeed: marineData.currentSpeed,
        waterTemperature: marineData.waterTemperature,
        airTemperature: airTemp,
        windSpeed: windSpeed,
        cloudCover: clouds,
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error("Weather API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch hybrid weather data" }, { status: 500 });
  }
}
