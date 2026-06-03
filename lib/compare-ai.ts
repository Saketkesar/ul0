export interface ComparisonData {
  title: string;
  slug: string;
  category: string;
  winner: string;
  score: {
    item1: number;
    item2: number;
  };
  item1: {
    name: string;
    logo: string;
    rating: number;
    company: string;
    description: string;
  };
  item2: {
    name: string;
    logo: string;
    rating: number;
    company: string;
    description: string;
  };
  comparisonFeatures: {
    name: string;
    item1Value: number | string;
    item2Value: number | string;
  }[];
  whyItem1Wins: string[];
  whyItem2Wins: string[];
  recommendations: {
    students: string;
    developers: string;
    researchers: string;
    writers: string;
    businesses: string;
  };
  item1ProsCons: {
    pros: string[];
    cons: string[];
  };
  item2ProsCons: {
    pros: string[];
    cons: string[];
  };
  verdict: string;
  faqs: {
    q: string;
    a: string;
  }[];
  related: string[];
}

// Helpers for YouTube check and metadata fetch
export function isYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);
}

export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function getYouTubeMetadata(url: string) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;
    const json = await res.json();
    return {
      title: json.title as string,
      author_name: json.author_name as string,
      thumbnail_url: json.thumbnail_url as string,
    };
  } catch (e) {
    console.error("YouTube metadata fetch error:", e);
    return null;
  }
}

// Helpers for general Website check and metadata fetch
export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export async function fetchWebsiteMetadata(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);

    return {
      title: titleMatch ? titleMatch[1].trim() : new URL(url).hostname,
      description: descMatch ? descMatch[1].trim() : "Comparison website details",
    };
  } catch (e) {
    console.error("Website metadata fetch error:", e);
    return null;
  }
}

export async function postProcessComparison(
  parsed: ComparisonData,
  item1Input: string,
  item2Input: string
): Promise<ComparisonData> {
  if (isYouTubeUrl(item1Input)) {
    try {
      const meta = await getYouTubeMetadata(item1Input);
      if (meta?.thumbnail_url) {
        parsed.item1.logo = meta.thumbnail_url;
      }
    } catch (e) {
      console.error("Failed to post-process YouTube metadata for item1:", e);
    }
  }
  if (isYouTubeUrl(item2Input)) {
    try {
      const meta = await getYouTubeMetadata(item2Input);
      if (meta?.thumbnail_url) {
        parsed.item2.logo = meta.thumbnail_url;
      }
    } catch (e) {
      console.error("Failed to post-process YouTube metadata for item2:", e);
    }
  }
  return parsed;
}

// Clean JSON response block out of LLM text response
function extractJson(text: string): string {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.substring(jsonStart, jsonEnd + 1);
  }
  return text;
}

export function checkSecurity(input: string): { safe: boolean; reason?: string } {
  const normalized = input.toLowerCase().trim();
  
  // Prompt injection checks
  const injectionPatterns = [
    /ignore previous/i,
    /system prompt/i,
    /you are now/i,
    /dan mode/i,
    /developer mode/i,
    /bypass restriction/i,
    /ignore instructions/i,
    /ignore rules/i,
    /forget rules/i,
    /jailbreak/i
  ];
  
  // Code generation & hacking exploit checks
  const codePatterns = [
    /\b(write|create|generate|implement|script|code|exploit|payload)\b.*\b(javascript|python|c\+\+|java|rust|go|sql|html|css|bash|php|ruby|assembly|script|code)\b/i,
    /write a script/i,
    /generate code/i,
    /write code/i,
    /create a function/i,
    /code to delete/i,
    /sql injection/i,
    /cross-site scripting/i,
    /xss payload/i
  ];
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(normalized)) {
      return { safe: false, reason: "Security violation: Malicious input or prompt injection detected." };
    }
  }
  
  for (const pattern of codePatterns) {
    if (pattern.test(normalized)) {
      return { safe: false, reason: "Security violation: Code generation and exploits are not supported." };
    }
  }
  
  return { safe: true };
}

// Main AI comparison generator function
export async function generateComparison(item1Input: string, item2Input: string): Promise<ComparisonData> {
  // Security Checks
  const sec1 = checkSecurity(item1Input);
  if (!sec1.safe) {
    throw new Error(sec1.reason);
  }
  const sec2 = checkSecurity(item2Input);
  if (!sec2.safe) {
    throw new Error(sec2.reason);
  }
  let item1Name = item1Input;
  let item2Name = item2Input;
  let category = "General";
  let context = "";

  // 1. YouTube details extraction
  if (isYouTubeUrl(item1Input) && isYouTubeUrl(item2Input)) {
    category = "YouTube Video";
    const meta1 = await getYouTubeMetadata(item1Input);
    const meta2 = await getYouTubeMetadata(item2Input);
    item1Name = meta1 ? meta1.title : "YouTube Video 1";
    item2Name = meta2 ? meta2.title : "YouTube Video 2";
    context = `
      Comparing YouTube Videos:
      Video 1 Title: ${item1Name} (by ${meta1?.author_name || "Unknown Channel"})
      Video 1 URL: ${item1Input}
      Video 2 Title: ${item2Name} (by ${meta2?.author_name || "Unknown Channel"})
      Video 2 URL: ${item2Input}
    `;
  }
  // 2. Website details extraction
  else if (isUrl(item1Input) && isUrl(item2Input)) {
    category = "Website";
    const meta1 = await fetchWebsiteMetadata(item1Input);
    const meta2 = await fetchWebsiteMetadata(item2Input);
    item1Name = meta1 ? meta1.title : new URL(item1Input).hostname;
    item2Name = meta2 ? meta2.title : new URL(item2Input).hostname;
    context = `
      Comparing Websites:
      Website 1 URL: ${item1Input}
      Website 1 Title: ${item1Name}
      Website 1 Description: ${meta1?.description || "No description available"}
      Website 2 URL: ${item2Input}
      Website 2 Title: ${item2Name}
      Website 2 Description: ${meta2?.description || "No description available"}
    `;
  }

  // 3. Construct prompt
  const systemPrompt = `You are an expert AI comparison assistant. You analyze products, frameworks, services, electronics, websites, or videos and produce highly detailed, objective, side-by-side comparison reports. You must return ONLY a JSON response matching the schema. No markdown wrapping outside the JSON.`;

  const userPrompt = `
    Compare these two entities:
    Entity 1: "${item1Name}" (Raw Input: "${item1Input}")
    Entity 2: "${item2Name}" (Raw Input: "${item2Input}")
    
    ${context ? `Extra Context: ${context}` : ""}
    
    Instructions:
    1. Detect the most appropriate category for these entities (e.g. Phone, Laptop, TV, Bike, Car, AI Tool, Framework, Hosting, Website, YouTube Video, College, Course, etc.)
    2. Compute a score out of 100 for each (e.g. 95 and 97) and set the overall 'winner'.
    3. Generate ratings, company names, and descriptions for both.
    4. Provide 5-6 comparison features in a side-by-side array. Feature values can be numbers (scores/ratings) or strings (e.g. "Yes", "No", "$20/mo", "24GB").
    5. List 3 key reasons why Entity 1 wins and 3 reasons why Entity 2 wins.
    6. Provide recommendation mappings for personas (students, developers, researchers, writers, businesses).
    7. Provide 3 pros and 2 cons for each entity.
    8. Write a clear final verdict and explanation.
    9. Generate 4 relevant FAQ questions and answers.
    10. Generate 4 related comparison slug pairs (format: "item1-vs-item2", lowercase, hyphenated).
    11. Generate aesthetic placeholder logo URLs for both using Pollinations image API: "https://image.pollinations.ai/prompt/[simple prompt description]?width=100&height=100&nologo=true".
    
    JSON Schema to return:
    {
      "title": "${item1Name} vs ${item2Name}",
      "slug": "${item1Name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-vs-${item2Name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}",
      "category": "string (Detected Category)",
      "winner": "string (Name of the winner)",
      "score": {
        "item1": number,
        "item2": number
      },
      "item1": {
        "name": "string",
        "logo": "string",
        "rating": number (e.g. 9.4),
        "company": "string",
        "description": "string"
      },
      "item2": {
        "name": "string",
        "logo": "string",
        "rating": number (e.g. 9.6),
        "company": "string",
        "description": "string"
      },
      "comparisonFeatures": [
        { "name": "string", "item1Value": number|string, "item2Value": number|string }
      ],
      "whyItem1Wins": ["string"],
      "whyItem2Wins": ["string"],
      "recommendations": {
        "students": "string (which one and why)",
        "developers": "string",
        "researchers": "string",
        "writers": "string",
        "businesses": "string"
      },
      "item1ProsCons": {
        "pros": ["string"],
        "cons": ["string"]
      },
      "item2ProsCons": {
        "pros": ["string"],
        "cons": ["string"]
      },
      "verdict": "string (verdict rationale)",
      "faqs": [
        { "q": "string", "a": "string" }
      ],
      "related": ["string (e.g., 'claude-vs-gemini')"]
    }
  `;

  // Load all Groq keys
  const groqKeysEnv = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "";
  const groqKeys = groqKeysEnv
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.startsWith("gsk_"));

  // Shuffle keys to distribute loads randomly
  const shuffledKeys = [...groqKeys].sort(() => Math.random() - 0.5);

  if (shuffledKeys.length > 0) {
    console.log(`Found ${shuffledKeys.length} Groq API key(s) to use.`);
    for (let i = 0; i < shuffledKeys.length; i++) {
      const key = shuffledKeys[i];
      console.log(`Trying Groq API key ${i + 1}/${shuffledKeys.length} (${key.substring(0, 10)}...)...`);
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (response.ok) {
          const json = await response.json();
          const textContent = json.choices[0].message.content;
          const parsed = JSON.parse(extractJson(textContent)) as ComparisonData;
          console.log(`Successfully generated comparison using Groq key ${key.substring(0, 10)}...`);
          return await postProcessComparison(parsed, item1Input, item2Input);
        } else {
          const errText = await response.text();
          console.warn(`Groq API key ${key.substring(0, 10)}... returned status ${response.status}:`, errText);
        }
      } catch (e: any) {
        console.error(`Request failed with Groq API key ${key.substring(0, 10)}... Error:`, e.message);
      }
    }
    console.warn("All Groq API keys failed or were rate-limited. Falling back to Pollinations AI...");
  } else {
    console.log("No Groq API keys configured. Falling back to Pollinations AI...");
  }

  // Fallback: Pollinations AI (free, keyless text generation)
  console.log("Using Pollinations AI for keyless comparison generation...");
  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: `${systemPrompt} Return only valid raw JSON. Do not wrap in markdown codeblocks.` },
          { role: "user", content: userPrompt }
        ],
        model: "openai",
        jsonMode: true
      })
    });

    if (response.ok) {
      const text = await response.text();
      const cleanText = extractJson(text);
      const parsed = JSON.parse(cleanText) as ComparisonData;
      return await postProcessComparison(parsed, item1Input, item2Input);
    } else {
      throw new Error(`Pollinations API returned status ${response.status}`);
    }
  } catch (e) {
    console.error("Pollinations AI request failed:", e);
    throw e;
  }
}
