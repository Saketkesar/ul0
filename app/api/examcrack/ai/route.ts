import { NextRequest, NextResponse } from "next/server";

// Clean JSON response block out of LLM text response
function extractJson(text: string): string {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.substring(jsonStart, jsonEnd + 1);
  }
  return text;
}

// Securely call LLM using Groq or Pollinations AI
async function queryAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const groqKeysEnv = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "";
  const groqKeys = groqKeysEnv
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.startsWith("gsk_"));

  const shuffledKeys = [...groqKeys].sort(() => Math.random() - 0.5);

  if (shuffledKeys.length > 0) {
    for (const key of shuffledKeys) {
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
          return json.choices[0].message.content;
        }
      } catch (e) {
        console.error("Groq key failed:", e);
      }
    }
  }

  // Fallback to Pollinations AI text generation
  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: `${systemPrompt} Return only valid raw JSON. Do not wrap in markdown.` },
          { role: "user", content: userPrompt }
        ],
        model: "openai",
        jsonMode: true
      })
    });

    if (response.ok) {
      return await response.text();
    }
    throw new Error(`Pollinations API returned status ${response.status}`);
  } catch (e) {
    console.error("Pollinations AI failed:", e);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, text, context } = await req.json();

    if (!action) {
      return NextResponse.json({ error: "Missing action parameter" }, { status: 400 });
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "parseDatesheet":
        systemPrompt = "You are an AI datesheet parser. Extract subject names, exam dates (YYYY-MM-DD format), and exam times from the provided text. Return ONLY a valid JSON object matching the schema: { \"subjects\": [ { \"name\": \"Subject Name\", \"examDate\": \"YYYY-MM-DD\", \"examTime\": \"Time (e.g. 10:00 AM)\" } ] }";
        userPrompt = `Please parse this datesheet text and extract subjects, exam dates, and exam times:\n\n${text}`;
        break;

      case "parseSyllabus":
        systemPrompt = "You are an AI syllabus parser. Segment the syllabus text into logical units and topics, estimating topic difficulty (Easy, Medium, Hard) and priority/importance (High, Medium, Low). Return ONLY a valid JSON object matching the schema: { \"units\": [ { \"name\": \"Unit 1: Unit Name\", \"topics\": [ { \"name\": \"Topic Name\", \"difficulty\": \"Easy|Medium|Hard\", \"priority\": \"High|Medium|Low\" } ] } ] }";
        userPrompt = `Please parse this syllabus text and split it into structured units and topics:\n\n${text}`;
        break;

      case "analyzePYQ":
        systemPrompt = "You are an AI Past Year Questions analyzer. Analyze the exam questions text, identify repeated questions, repeated concepts, and expected exam questions. Return ONLY a valid JSON object matching the schema: { \"repeatedQuestions\": [\"question 1\"], \"repeatedConcepts\": [\"concept 1\"], \"expectedQuestions\": [\"predicted question 1\"] }";
        userPrompt = `Analyze the following past questions paper text:\n\n${text}\n\nSubject Context: ${context || "N/A"}`;
        break;

      case "generateFlashcards":
        systemPrompt = "You are an AI flashcard generator. Create a deck of 6-8 comprehensive flashcards covering the requested topics. Return ONLY a valid JSON object matching the schema: { \"flashcards\": [ { \"question\": \"Question text\", \"answer\": \"Answer text\", \"difficulty\": \"Easy|Medium|Hard\" } ] }";
        userPrompt = `Generate study flashcards for these topics:\n\n${text}`;
        break;

      case "generateQuiz":
        systemPrompt = "You are an AI quiz generator. Create a practice quiz of 5 questions (MCQs, Short answers, and long answers). Return ONLY a valid JSON object matching the schema: { \"questions\": [ { \"type\": \"mcq|short|long\", \"question\": \"Question text\", \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"], \"correctAnswer\": \"Correct Option Text or Answer Key\", \"explanation\": \"Brief explanation of the answer\" } ] }";
        userPrompt = `Create a quiz covering these topics:\n\n${text}`;
        break;

      case "generateExamNightMode":
        systemPrompt = "You are an academic exam-night advisor. Compile quick definitions, critical formulas/equations, high-priority topics, and a 30-minute revision guide. Return ONLY a valid JSON object matching the schema: { \"definitions\": [\"Term: Definition\"], \"formulas\": [\"Equation: Description\"], \"criticalTopics\": [\"High-priority concept name\"], \"revisionSummary\": \"Actionable paragraph outlining a 30-minute study strategy\" }";
        userPrompt = `Generate emergency exam-night review notes for this subject and syllabus:\n\nSubject: ${context || "Exam Subject"}\nSyllabus:\n${text}`;
        break;

      default:
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    }

    const rawResponse = await queryAI(systemPrompt, userPrompt);
    const cleanedJson = extractJson(rawResponse);
    const parsed = JSON.parse(cleanedJson);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Examcrack AI Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response", details: error.message },
      { status: 500 }
    );
  }
}
