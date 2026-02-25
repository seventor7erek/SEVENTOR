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

Available Services at SEVENTOR:
- Oud Performance (Traditional & fusion)
- Piano Performance (Classical, jazz & contemporary)
- Percussion (Tabla, darbuka & percussion ensembles)
- Violin Performance (Solo & ensemble)
- Saxophone (Smooth jazz & live saxophone)
- Vocalist (Arabic, international & multilingual)
- DJ (Deep house, lounge, Afro & party sets)
- Handpan (Ambient & relaxing melodies)
- Full Event Management (Concept to execution)

Remember: You represent the pinnacle of luxury event services. Every interaction should feel like a five-star concierge experience.`;

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
];

async function callGemini(apiKey, contents, modelIndex = 0) {
  const model = MODELS[modelIndex];
  if (!model) {
    throw new Error('All models exhausted. Please try again later.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  });

  if (response.status === 429) {
    console.log(`[chat] Model ${model} returned 429, trying next model...`);
    // Try next model
    if (modelIndex + 1 < MODELS.length) {
      return callGemini(apiKey, contents, modelIndex + 1);
    }
    // All models exhausted, wait and retry once
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const retryResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024, topP: 0.95 },
      }),
    });
    if (!retryResponse.ok) {
      const errText = await retryResponse.text();
      throw new Error(`Rate limited (429). Please wait a moment and try again. Details: ${errText}`);
    }
    return retryResponse;
  }

  if (response.status === 400) {
    const errData = await response.text();
    console.error(`[chat] Model ${model} returned 400:`, errData);
    // Try next model for compatibility issues
    if (modelIndex + 1 < MODELS.length) {
      return callGemini(apiKey, contents, modelIndex + 1);
    }
    throw new Error(`Bad request: ${errData}`);
  }

  if (response.status === 403) {
    throw new Error('API key is invalid or does not have permission. Please check your GEMINI_API_KEY.');
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errText}`);
  }

  return response;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[chat] GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({
        error: 'AI Concierge is not configured yet. The GEMINI_API_KEY environment variable is missing.',
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided.' });
    }

    // Filter to only user and assistant messages (skip the welcome message)
    const contents = messages
      .filter((msg) => msg.content && msg.content.trim())
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // Gemini requires the first message to be from the user
    if (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: 'No valid messages to process.' });
    }

    const response = await callGemini(apiKey, contents);
    const data = await response.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I apologize, I was unable to process that request. Please try again.';

    return res.status(200).json({ content: aiText });
  } catch (error) {
    console.error('[chat] Error:', error.message);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
}
