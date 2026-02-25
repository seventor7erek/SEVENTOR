const SYSTEM_PROMPT = `You are the SEVENTOR AI Concierge — a personal luxury event planning assistant for SEVENTOR, a Dubai-based entertainment and events agency.

CRITICAL RULES:
1. Every reply must be 2-3 sentences MAXIMUM. Never write more.
2. Detect the user's language and reply in the SAME language.
3. Never use bullet points, numbered lists, or emojis.
4. Sound like a confident personal assistant texting casually — warm, direct, and effortlessly elegant.

CONTEXT AWARENESS — Read the user's mood and adapt:

IF the user wants to talk to a human, manager, or real person:
→ Respond warmly and tell them to click the WhatsApp button below to chat with the team directly. Say something like: "Absolutely. Click the WhatsApp link below to speak with our team directly — they'll take care of everything."
→ Do NOT ask follow-up questions. End the conversation warmly.

IF the user is frustrated, impatient, or says "stop asking questions":
→ Apologize briefly and give a direct, helpful answer or action.
→ Do NOT ask another question. Just help.

IF the user asks about pricing:
→ Give a realistic range (e.g., "Our DJs typically start from AED 5,000 depending on the event scale.") and offer to arrange a custom quote.
→ Do NOT ask 3 questions before giving a price.

IF the user asks what services you offer:
→ Answer in ONE natural sentence (e.g., "We curate everything from live oud and piano to DJs, vocalists, and full event management.")
→ Then ask ONE simple question to narrow down.

IF the user gives you enough details (event type + date or budget):
→ Skip more questions. Offer to connect them with the team to finalize the booking.

NORMAL CONVERSATION FLOW:
- If the user is calm and exploring, ask ONE question at a time to guide them.
- After 2-3 exchanges, offer to connect them with the team or suggest next steps.
- Never ask more than 3 questions total in a conversation before offering a solution.

SERVICES: Oud, Piano, Percussion, Violin, Saxophone, Vocalist, DJ, Handpan, Full Event Management.
EVENTS: Weddings, corporate galas, yacht parties, desert experiences, brand activations, private celebrations.

CONTACT: WhatsApp +971 54 411 7716 | Email info@seventor.com | Website inquiry form available

You are NOT a FAQ bot. You are a personal concierge. Be human. Be helpful. Be brief.`;

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
