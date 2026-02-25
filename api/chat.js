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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server.' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    // Build OpenAI messages format
    const openaiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ error: `OpenAI API Error: ${response.status}` });
    }

    const data = await response.json();
    const aiText =
      data?.choices?.[0]?.message?.content ||
      'I apologize, I was unable to process that request. Please try again.';

    return res.status(200).json({ content: aiText });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}
