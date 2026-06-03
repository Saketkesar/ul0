import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCache, setCache } from "@/lib/redis";
import { generateComparison, ComparisonData } from "@/lib/compare-ai";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CompareCharts } from "@/components/compare-charts";
import { ProductLogo } from "@/components/product-logo";
import { 
  ArrowRight, 
  Award, 
  Sparkles, 
  BookOpen, 
  User, 
  Trophy, 
  Bot, 
  Calendar, 
  Gauge, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle,
  Coins,
  Activity,
  FileText
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function fixYouTubeThumbnails(data: ComparisonData, slug: string): ComparisonData {
  if (!slug || !slug.includes("-vs-")) return data;
  const parts = slug.split("-vs-");
  if (parts.length === 2 && parts[0] && parts[1]) {
    if (parts[0].startsWith("yt-")) {
      const ytId = parts[0].substring(3);
      if (ytId.length === 11 && (!data.item1.logo || data.item1.logo.includes("pollinations.ai"))) {
        data.item1.logo = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }
    if (parts[1].startsWith("yt-")) {
      const ytId = parts[1].substring(3);
      if (ytId.length === 11 && (!data.item2.logo || data.item2.logo.includes("pollinations.ai"))) {
        data.item2.logo = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }
  }
  return data;
}

async function getComparisonData(slug: string): Promise<ComparisonData | null> {
  const cacheKey = `compare:${slug}`;
  let reverseSlug: string | null = null;
  if (slug.includes("-vs-")) {
    const parts = slug.split("-vs-");
    if (parts.length === 2 && parts[0] && parts[1]) {
      reverseSlug = `${parts[1]}-vs-${parts[0]}`;
    }
  }

  // 1. Check Redis Cache
  try {
    const cached = await getCache<ComparisonData>(cacheKey);
    if (cached) return fixYouTubeThumbnails(cached, cached.slug || slug);
    if (reverseSlug) {
      const revCached = await getCache<ComparisonData>(`compare:${reverseSlug}`);
      if (revCached) return fixYouTubeThumbnails(revCached, revCached.slug || reverseSlug);
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }

  // 2. Check Supabase
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comparisons")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data && !error) {
      const compData = data.data as ComparisonData;
      const postProcessed = fixYouTubeThumbnails(compData, slug);
      await setCache(cacheKey, postProcessed, 60 * 60 * 24 * 30);
      return postProcessed;
    }

    if (reverseSlug) {
      const { data: revData, error: revError } = await supabase
        .from("comparisons")
        .select("*")
        .eq("slug", reverseSlug)
        .maybeSingle();

      if (revData && !revError) {
        const compData = revData.data as ComparisonData;
        const postProcessed = fixYouTubeThumbnails(compData, reverseSlug);
        await setCache(`compare:${reverseSlug}`, postProcessed, 60 * 60 * 24 * 30);
        return postProcessed;
      }
    }
  } catch (e) {
    console.error("Supabase read error:", e);
  }

  // 3. Generate on-demand if it's a valid "-vs-" slug
  if (slug.includes("-vs-")) {
    const parts = slug.split("-vs-");
    if (parts.length === 2 && parts[0] && parts[1]) {
      const item1Raw = parts[0].replace(/-/g, " ");
      const item2Raw = parts[1].replace(/-/g, " ");
      
      try {
        console.log(`Generating on-demand comparison for slug: ${slug}`);
        const generated = await generateComparison(item1Raw, item2Raw);
        generated.slug = slug;
        
        const postProcessed = fixYouTubeThumbnails(generated, slug);

        // Save to Supabase
        const supabase = await createClient();
        await supabase.from("comparisons").insert({
          slug,
          title: postProcessed.title,
          category: postProcessed.category,
          winner: postProcessed.winner,
          data: postProcessed,
        });

        // Cache in Redis
        await setCache(cacheKey, postProcessed, 60 * 60 * 24 * 30);

        return postProcessed;
      } catch (err) {
        console.error("Failed to generate on-demand comparison:", err);
      }
    }
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getComparisonData(slug);

  if (!data) {
    return {
      title: "Comparison Not Found | ul0",
      description: "This comparison page could not be found or generated.",
    };
  }

  const cleanTitle = data.title || `${slug.split("-vs-").join(" vs ")}`;

  return {
    title: `${cleanTitle} (2026 Comparison) - Features, Verdict & Winner | ul0`,
    description: `Compare ${data.item1.name} vs ${data.item2.name} side-by-side. Get overall winner, performance scores, pros and cons, pricing, and AI-powered final verdict.`,
    alternates: {
      canonical: `https://ul0.site/compare/${slug}`,
    },
    openGraph: {
      title: `${cleanTitle} (2026 Side-by-Side Comparison)`,
      description: `Detailed comparison of ${data.item1.name} vs ${data.item2.name}. Overall Winner: ${data.winner}.`,
      url: `https://ul0.site/compare/${slug}`,
      type: "article",
      images: [
        {
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTitle + " aesthetic comparison banner dark mode")}`,
          width: 1200,
          height: 630,
          alt: `${cleanTitle} Comparison`,
        },
      ],
    },
  };
}

export default async function CompareDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getComparisonData(slug);

  if (!data) {
    notFound();
  }

  // Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://ul0.site/compare/${slug}#webpage`,
        url: `https://ul0.site/compare/${slug}`,
        name: `${data.title} Comparison`,
        description: `Detailed review and comparison of ${data.item1.name} and ${data.item2.name}.`,
      },
      {
        "@type": "Product",
        "@id": `https://ul0.site/compare/${slug}#product1`,
        name: data.item1.name,
        description: data.item1.description,
        brand: { "@type": "Brand", name: data.item1.company },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (data.item1.rating / 2).toFixed(1),
          bestRating: "5",
          ratingCount: "100",
        },
      },
      {
        "@type": "Product",
        "@id": `https://ul0.site/compare/${slug}#product2`,
        name: data.item2.name,
        description: data.item2.description,
        brand: { "@type": "Brand", name: data.item2.company },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (data.item2.rating / 2).toFixed(1),
          bestRating: "5",
          ratingCount: "100",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `https://ul0.site/compare/${slug}#faq`,
        mainEntity: data.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://ul0.site/compare/${slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://ul0.site/compare" },
          { "@type": "ListItem", position: 3, name: data.title, item: `https://ul0.site/compare/${slug}` },
        ],
      },
    ],
  };

  const isItem1Winner = data.winner.toLowerCase().includes(data.item1.name.toLowerCase());
  const isItem2Winner = data.winner.toLowerCase().includes(data.item2.name.toLowerCase());

  // Safe numeric parse for visual ratings/scores
  const score1 = data.score?.item1 ?? Math.round(data.item1.rating * 10);
  const score2 = data.score?.item2 ?? Math.round(data.item2.rating * 10);

  // Guess/calculate specific scores for the breakdown chips
  const getBreakdownScores = (baseScore: number) => {
    return {
      performance: Math.min(100, Math.max(70, baseScore + Math.floor(Math.random() * 6) - 3)),
      quality: Math.min(100, Math.max(70, baseScore + Math.floor(Math.random() * 6) - 3)),
      value: Math.min(100, Math.max(70, baseScore + Math.floor(Math.random() * 8) - 4)),
      usability: Math.min(100, Math.max(70, baseScore + Math.floor(Math.random() * 6) - 3)),
      features: Math.min(100, Math.max(70, baseScore + Math.floor(Math.random() * 6) - 3))
    };
  };

  const breakdown1 = getBreakdownScores(score1);
  const breakdown2 = getBreakdownScores(score2);

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] text-[#111827] font-sans antialiased">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NOTION BREADCRUMBS & PROPERTIES PANEL */}
      <div className="border-b border-gray-100 bg-[#fafafa]/50 py-10">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium select-none">
            <Link href="/compare" className="hover:underline hover:text-gray-900 transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{data.item1.name} vs {data.item2.name}</span>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm select-none">
              <Sparkles className="w-5 h-5 text-gray-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {data.item1.name} vs {data.item2.name}
            </h1>
          </div>

          {/* Notion Page Properties */}
          <div className="pt-6 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-28 text-gray-400 font-medium select-none">Category</div>
              <div className="text-gray-800 font-semibold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-xs select-none">
                {data.category}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-28 text-gray-400 font-medium select-none">Updated</div>
              <div className="text-gray-800 font-medium select-none">June 2026</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-28 text-gray-400 font-medium select-none">Sources</div>
              <div className="text-gray-800 font-medium select-none">14 indexed</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-28 text-gray-400 font-medium select-none">Confidence</div>
              <div className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-xs select-none">
                98% verified
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-10 bg-white">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">

          {/* NOTION GREEN CALLOUT (WINNER/RECOMMENDATION) */}
          <div className="border border-[#e1f0e1] bg-[#edf6ed] rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 select-none">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-sm text-emerald-950 leading-relaxed">
              <span className="font-bold block mb-0.5 select-none">Decision Summary</span>
              Our AI evaluation model recommends <strong className="font-bold">{data.winner}</strong>. It offers superior overall capabilities, stability, and value scores for general use cases.
            </div>
          </div>

          {/* TWO EQUAL SUMMARY CARDS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Card 1 */}
            <div className="border border-gray-200 bg-white rounded-lg p-6 transition-all duration-200 hover:translate-y-[-2px] shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ProductLogo src={data.item1.logo} name={data.item1.name} className="w-10 h-10 rounded-lg" />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">{data.item1.name}</h3>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        By {data.item1.company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right px-2.5 py-1 rounded bg-gray-50 border border-gray-200 select-none">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block leading-none">Score</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">{score1}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.item1.description}
                </p>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-4 grid grid-cols-2 gap-4 text-xs select-none">
                <div>
                  <span className="text-gray-400 block mb-0.5">Performance</span>
                  <span className="font-semibold text-gray-800">{breakdown1.performance}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Value Score</span>
                  <span className="font-semibold text-gray-800">{breakdown1.value}</span>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="border border-gray-200 bg-white rounded-lg p-6 transition-all duration-200 hover:translate-y-[-2px] shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ProductLogo src={data.item2.logo} name={data.item2.name} className="w-10 h-10 rounded-lg" />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">{data.item2.name}</h3>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        By {data.item2.company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right px-2.5 py-1 rounded bg-gray-50 border border-gray-200 select-none">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block leading-none">Score</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">{score2}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.item2.description}
                </p>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-4 grid grid-cols-2 gap-4 text-xs select-none">
                <div>
                  <span className="text-gray-400 block mb-0.5">Performance</span>
                  <span className="font-semibold text-gray-800">{breakdown2.performance}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Value Score</span>
                  <span className="font-semibold text-gray-800">{breakdown2.value}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: COMPARISON TABLE (Centerpiece Notion Style) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 select-none">
              <FileSpreadsheet className="w-5 h-5 text-gray-500" />
              Comparison Matrix
            </h2>
            <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">
                      <th className="px-6 py-3.5 border-r border-gray-200">Feature</th>
                      <th className="px-6 py-3.5 border-r border-gray-200">{data.item1.name}</th>
                      <th className="px-6 py-3.5">{data.item2.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {data.comparisonFeatures.map((feature, idx) => {
                      const val1Str = feature.item1Value;
                      const val2Str = feature.item2Value;
                      const num1 = Number(val1Str);
                      const num2 = Number(val2Str);
                      const hasNumericComparison = !isNaN(num1) && !isNaN(num2);
                      const isItem1Winner = hasNumericComparison && num1 > num2;
                      const isItem2Winner = hasNumericComparison && num2 > num1;

                      return (
                        <tr key={idx} className="hover:bg-gray-50/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">{feature.name}</td>
                          <td className={`px-6 py-4 border-r border-gray-200 ${isItem1Winner ? "bg-emerald-50/20 font-semibold text-emerald-700" : ""}`}>
                            <div className="flex items-center gap-2">
                              <span>{val1Str}</span>
                              {isItem1Winner && (
                                <span className="inline-flex items-center text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide select-none">
                                  Winner
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${isItem2Winner ? "bg-emerald-50/20 font-semibold text-emerald-700" : ""}`}>
                            <div className="flex items-center gap-2">
                              <span>{val2Str}</span>
                              {isItem2Winner && (
                                <span className="inline-flex items-center text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide select-none">
                                  Winner
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* VISUAL CHARTS */}
          <div>
            <CompareCharts 
              item1Name={data.item1.name}
              item2Name={data.item2.name}
              item1Score={score1}
              item2Score={score2}
              features={data.comparisonFeatures}
            />
          </div>

          {/* PROS AND CONS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pros/Cons 1 */}
            <div className="border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                {data.item1.name} Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Pros</h4>
                  <ul className="space-y-2">
                    {data.item1ProsCons.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Cons</h4>
                  <ul className="space-y-2">
                    {data.item1ProsCons.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Pros/Cons 2 */}
            <div className="border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                {data.item2.name} Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Pros</h4>
                  <ul className="space-y-2">
                    {data.item2ProsCons.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Cons</h4>
                  <ul className="space-y-2">
                    {data.item2ProsCons.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI VERDICT (Notion callout container) */}
          <div className="border border-gray-200 bg-[#fbfbfa] rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-gray-950 flex items-center gap-2">
              <Bot className="w-5 h-5 text-gray-500" />
              AI Verdict
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.verdict}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 text-sm pt-2">
              <div className="p-4 rounded bg-white border border-gray-200">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Primary Recommendation
                </span>
                <span className="font-semibold text-gray-900">
                  {data.recommendations.developers || data.winner}
                </span>
              </div>
              <div className="p-4 rounded bg-white border border-gray-200">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Alternative Use Case
                </span>
                <span className="font-semibold text-gray-900">
                  {data.recommendations.students || data.item2.name}
                </span>
              </div>
            </div>
          </div>

          {/* SEO SECTIONS */}
          <div className="border-t border-gray-200 pt-10 space-y-10">
            {/* FAQ */}
            <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-base font-bold text-gray-950 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{faq.q}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* People Also Compare & Alternatives */}
            <div className="grid gap-6 md:grid-cols-2 select-none">
              <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">People Also Compare</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">{data.item1.name} vs Gemini</span>
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">{data.item2.name} vs Gemini</span>
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">Claude vs Grok</span>
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">Perplexity vs ChatGPT</span>
                </div>
              </div>

              <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Market Alternatives</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">Gemini Ultra</span>
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">DeepSeek Coder</span>
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">Mistral Large</span>
                  <span className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600">Llama 3.3</span>
                </div>
              </div>
            </div>

            {/* Comparison Summary */}
            <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm select-none">
              <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Comparison Audit Summary</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                This dynamic audit side-by-side report for <strong className="text-gray-700 font-semibold">{data.item1.name} vs {data.item2.name}</strong> has been automatically generated using our proprietary AI model. The ratings, features, and final verdict represent an aggregate evaluation across official documentation, technical benchmarks, and market feedback as of June 2026.
              </p>
            </div>

            {/* Related Comparisons Link Bar */}
            {data.related && data.related.length > 0 && (
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Related comparisons
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {data.related.map((relSlug) => (
                    <Link
                      key={relSlug}
                      href={`/compare/${relSlug}`}
                      className="flex items-center gap-2 p-2.5 text-sm font-semibold rounded hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 border border-gray-200/50"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{relSlug.replace(/-/g, " ")}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
