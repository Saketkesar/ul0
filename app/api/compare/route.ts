import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCache, setCache } from "@/lib/redis";
import { generateComparison, ComparisonData, isUrl, isYouTubeUrl, checkSecurity } from "@/lib/compare-ai";

function getSlug(item1: string, item2: string): string {
  const clean = (s: string) => {
    // If it's a YouTube URL, extract video ID
    if (isYouTubeUrl(s)) {
      const id = s.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
      if (id && id[1]) return `yt-${id[1]}`;
    }
    // If it's a general URL, get hostname
    if (isUrl(s)) {
      try {
        const hostname = new URL(s).hostname;
        return hostname.replace(/^(www\.)?/, "").replace(/\./g, "-");
      } catch (_) {}
    }
    // Standard text cleaning
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return `${clean(item1)}-vs-${clean(item2)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item1, item2 } = body;

    if (!item1 || !item2) {
      return NextResponse.json(
        { error: "Both item1 and item2 inputs are required." },
        { status: 400 }
      );
    }

    // Security Checks
    const sec1 = checkSecurity(item1);
    if (!sec1.safe) {
      return NextResponse.json({ error: sec1.reason }, { status: 400 });
    }
    const sec2 = checkSecurity(item2);
    if (!sec2.safe) {
      return NextResponse.json({ error: sec2.reason }, { status: 400 });
    }

    const slug = getSlug(item1, item2);
    const reverseSlug = getSlug(item2, item1);

    const cacheKey = `compare:${slug}`;
    const reverseCacheKey = `compare:${reverseSlug}`;

    // 1. Check Redis Cache for both directions
    const cachedData = await getCache<ComparisonData>(cacheKey);
    if (cachedData) {
      console.log(`Redis cache hit for slug: ${slug}`);
      return NextResponse.json({ success: true, data: cachedData, slug });
    }

    const reverseCachedData = await getCache<ComparisonData>(reverseCacheKey);
    if (reverseCachedData) {
      console.log(`Redis cache hit for reverse slug: ${reverseSlug}`);
      return NextResponse.json({ success: true, data: reverseCachedData, slug: reverseSlug });
    }

    // 2. Check Supabase Database for both directions
    const supabase = await createClient();
    
    // Check forward slug
    const { data: dbData, error: dbError } = await supabase
      .from("comparisons")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (dbData && !dbError) {
      console.log(`Supabase hit for slug: ${slug}`);
      const compData = dbData.data as ComparisonData;
      await setCache(cacheKey, compData, 60 * 60 * 24 * 30); // 30 days cache
      return NextResponse.json({ success: true, data: compData, slug });
    }

    // Check reverse slug
    const { data: reverseDbData, error: reverseDbError } = await supabase
      .from("comparisons")
      .select("*")
      .eq("slug", reverseSlug)
      .maybeSingle();

    if (reverseDbData && !reverseDbError) {
      console.log(`Supabase hit for reverse slug: ${reverseSlug}`);
      const compData = reverseDbData.data as ComparisonData;
      await setCache(reverseCacheKey, compData, 60 * 60 * 24 * 30); // 30 days cache
      return NextResponse.json({ success: true, data: compData, slug: reverseSlug });
    }

    // 3. Generate New Comparison via AI
    console.log(`Generating new AI comparison for: ${item1} vs ${item2} (slug: ${slug})`);
    const generated = await generateComparison(item1, item2);
    
    // Ensure the generated slug matches our determined slug
    generated.slug = slug;

    // 4. Save to Supabase
    const { error: insertError } = await supabase.from("comparisons").insert({
      slug,
      title: generated.title,
      category: generated.category,
      winner: generated.winner,
      data: generated,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
    }

    // 5. Cache in Redis
    await setCache(cacheKey, generated, 60 * 60 * 24 * 30); // 30 days cache

    return NextResponse.json({ success: true, data: generated, slug });
  } catch (error: any) {
    console.error("Comparison API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during comparison.", details: error.message },
      { status: 500 }
    );
  }
}
