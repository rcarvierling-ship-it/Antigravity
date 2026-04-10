import { NextResponse } from "next/server";
import { getDiveSiteConditions } from "@/lib/services/conditions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const country = searchParams.get("country");
  const diveType = searchParams.get("type");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  try {
    const data = await getDiveSiteConditions(
      parseFloat(lat), 
      parseFloat(lng), 
      country || undefined,
      diveType || undefined
    );

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error("Marine Conditions Engine Error:", error);
    return NextResponse.json({ error: "Failed to fetch marine conditions" }, { status: 500 });
  }
}
