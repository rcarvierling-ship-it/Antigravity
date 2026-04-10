import { NextResponse } from "next/server";
import { getDiveSiteConditions } from "@/lib/services/conditions";
import { createClient } from "@/lib/supabase/server";

// In-memory cache for environmental telemetry
const conditionCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const country = searchParams.get("country");
  const diveType = searchParams.get("type");
  const siteId = searchParams.get("siteId");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  // 1. Generate precision cache key
  const hour = new Date().getHours();
  const cacheKey = `conditions:${siteId || 'global'}:${lat}:${lng}:${hour}`;

  // 2. Check internal cache
  const cached = conditionCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return NextResponse.json(cached.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=3600' }
    });
  }

  try {
    // 3. Fetch Site Metadata for Intelligence Engine
    let siteMetadata = null;
    if (siteId && siteId !== 'unknown' && siteId !== 'undefined') {
      const supabase = await createClient();
      const { data } = await supabase
        .from('dive_sites')
        .select('id, name, dive_type, skill_level, max_depth_m, site_exposure, protection_level')
        .eq('id', siteId)
        .single();
      siteMetadata = data;
    }

    const data = await getDiveSiteConditions(
      parseFloat(lat), 
      parseFloat(lng), 
      country || undefined,
      diveType || undefined,
      siteMetadata
    );

    // 4. Update cache
    conditionCache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error("Marine Conditions Engine Error:", error);
    return NextResponse.json({ error: "Failed to fetch marine conditions" }, { status: 500 });
  }
}
