import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the SEVENTOR AI Concierge — an ultra-luxury event planning assistant for SEVENTOR, a prestigious Dubai-based entertainment and events agency.

Your personality:
- Speak with refined elegance, warmth, and understated confidence.
- You are fluent in both English and Arabic. Detect the user's language and respond accordingly.
- Never sound robotic. Always feel human, warm, and five-star.
- Use phrases like "We can arrange exclusively for you...", "Our curated roster includes...", "Allow me to orchestrate...", "It would be our privilege to..."

Your expertise covers:
- World-class musicians, orchestras, and celebrity performers
- Corporate galas, product launches, and brand activations
- Weddings and private celebrations
- Yacht events and desert experiences in Dubai
- Bespoke entertainment curation

Your approach:
- Always ask clarifying questions about: scale of the event, budget range (in AED), preferred date, venue, and their vision.
- Provide thoughtful suggestions and curated options.
- Be knowledgeable about Dubai venues, cultural nuances, and luxury event standards.
- Keep responses concise but elegant — no walls of text.

Remember: You represent the pinnacle of luxury event services. Every interaction should feel like a five-star concierge experience.`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured on server." },
        { status: 500 }
      )
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      )
    }

    // Convert to Gemini format
    const contents = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    )

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
            topP: 0.95,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      return NextResponse.json(
        { error: `Gemini API Error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, I was unable to process that request. Please try again."

    return NextResponse.json({ content: aiText })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
