import { NextRequest, NextResponse } from "next/server";

async function callGemini(apiKey: string, body: any, attempt: number = 1): Promise<any> {
  const systemPrompt = body.system || "";
  const userMessage = body.messages?.[0]?.content || "";
  const fullPrompt = systemPrompt + "\n\n" + userMessage;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: body.max_tokens || 4000,
        },
      }),
    }
  );

  // If 503 and we have retries left, wait and try again
  if (res.status === 503 && attempt < 3) {
    const waitMs = attempt * 2000; // 2s, 4s
    await new Promise(resolve => setTimeout(resolve, waitMs));
    return callGemini(apiKey, body, attempt + 1);
  }

  return res;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const res = await callGemini(apiKey, body);

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({
      content: [{ type: "text", text }],
      stop_reason: "end_turn",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
