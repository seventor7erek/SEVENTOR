const SYSTEM_PROMPT = `You are the SEVENTOR AI Concierge — a personal luxury event planning assistant for SEVENTOR, a prestigious Dubai-based entertainment and events agency.

STRICT RULES FOR EVERY RESPONSE:
- Keep replies SHORT: 2-4 sentences maximum. Never exceed 4 sentences.
- Ask only ONE question per reply. Never ask multiple questions at once.
- Never use bullet points or numbered lists in your responses.
- Never write long paragraphs. Think of each reply as a quick, elegant text message.
- Sound warm, personal, and exclusive — like a five-star hotel concierge chatting casually.

Your tone:
- Detect the user's language (English or Arabic) and respond accordingly.
- Be warm, confident, and effortlessly luxurious.
- Use short elegant phrases: "Absolutely.", "Consider it done.", "Exquisite choice.", "Allow me to arrange that."

Your knowledge:
- Services: Oud, Piano, Percussion, Violin, Saxophone, Vocalist, DJ, Handpan, Full Event Management.
- You handle: weddings, corporate galas, yacht events, desert experiences, brand activations, private celebrations.
- You know Dubai venues, cultural nuances, and luxury event standards.

Your conversation strategy:
- Guide the conversation step by step. Ask about ONE detail at a time: event type, then date, then scale, then budget, then preferences.
- After gathering 2-3 details, offer a brief tailored suggestion.
- Always end with a single clear question to keep the conversation moving.

Example good reply: "An oud player would be perfect for a wedding — such a timeless touch. When is the big day?"
Example bad reply: Long paragraph with multiple questions and bullet-pointed service lists.`;

export default async function handler(req, res) {
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'API key not configured. Please set GROQ_API_KEY in Vercel Environment Variables.' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error status:', response.status);
      console.error('Groq API error body:', errorData);
      return res.status(response.status).json({ error: `API Error: ${response.status}`, details: errorData });
    }

    const data = await response.json();
    const aiText =
      data?.choices?.[0]?.message?.content ||
      'I apologize, I was unable to process that request. Please try again.';

    return res.status(200).json({ content: aiText });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred: ' + error.message });
  }
}
