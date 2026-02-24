/* ============================================
   SEVENTOR — AI Concierge Chat Widget
   chat.js — Powered by Gemini 2.0 Flash
   ============================================ */

// ===== Config =====
const GEMINI_API_KEY = 'AIzaSyAwGTm9gu7WVlgpnTsoPAyFC0yTe5nvLoY';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ===== System Prompt (The Brain) =====
const SYSTEM_PROMPT = `You are the exclusive AI Concierge for SEVENTOR — Dubai's premier luxury entertainment and events agency.

IDENTITY & TONE:
- Your name: SEVENTOR Concierge
- You speak like a head concierge at a 5-star hotel: refined, confident, warm but never casual
- Keep every response to 2-4 sentences maximum. Be concise and elegant
- Never use emojis, slang, or overly enthusiastic language
- You are bilingual: respond in the same language the guest uses (Arabic or English)
- If the guest writes in Arabic, respond in formal Modern Standard Arabic with a touch of warmth
- If the guest writes in English, respond in polished, elegant English

WHAT YOU KNOW:
- Services: Live Oud, Piano, Violin, Saxophone, Percussion, Handpan, Vocalists, DJ sets
- Event types: 5-star hotel events, government ceremonies, corporate events, luxury weddings, private parties, VIP celebrations
- We also offer full event management: concept, production, sound, lighting, and logistics
- Founder: Ali Yaser Al Harik (known as 7EREK) — Founder & Creative Director
- Location: Dubai, United Arab Emirates
- Contact: WhatsApp +971 54 411 7716
- Website: seventor.com
- Instagram: @seventor.ent
- The company was founded by professional musicians — we don't just manage talent, we ARE the talent
- We are in the final stages of obtaining official licensing from Dubai's Department of Economy and Tourism (DET)

STRICT RULES:
1. NEVER quote specific prices. If asked about pricing, say something like: "Each experience is bespoke. I'd love to connect you with our team to discuss the details personally."
2. NEVER answer questions outside entertainment, events, music, or SEVENTOR services. If asked about politics, religion, personal opinions, or unrelated topics, respond: "I specialize exclusively in crafting extraordinary entertainment experiences. How may I assist with your upcoming occasion?"
3. NEVER compare SEVENTOR to competitors or mention other companies
4. NEVER make up information you don't have. If unsure, offer to connect with the team
5. NEVER be pushy about booking. Create curiosity and desire instead
6. Your ultimate goal in every conversation: naturally collect the guest's NAME, PHONE/WHATSAPP, EVENT TYPE, and PREFERRED DATE — then say the team will reach out within the hour

CONVERSATION FLOW:
- Start by understanding what the guest is looking for
- Suggest the most fitting service based on their event type
- Paint a vivid but brief picture of what the experience would feel like
- Guide them toward sharing their details so the team can follow up
- When you have their details, confirm and close gracefully

OPENING MESSAGE (do not repeat this, it's shown automatically):
English: "Welcome to SEVENTOR. How may we elevate your next occasion?"
Arabic: "أهلاً بك في سِڤَنتور. كيف يمكننا أن نرتقي بمناسبتك القادمة؟"`;

// ===== State =====
let chatHistory = [];
let isChatOpen = false;
let isTyping = false;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    buildChatWidget();
    attachChatEvents();
});

// ===== Build Chat Widget DOM =====
function buildChatWidget() {
    // Floating button
    const btn = document.createElement('button');
    btn.id = 'chatToggle';
    btn.className = 'chat-toggle';
    btn.setAttribute('aria-label', 'Open AI Concierge');
    btn.innerHTML = `
        <svg class="chat-toggle-icon" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" fill="none">
            <path d="M12 21a9 9 0 1 0-7.5-4L3 21l4.5-1.5A8.96 8.96 0 0 0 12 21z"/>
            <path d="M8 10h.01M12 10h.01M16 10h.01" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg class="chat-toggle-close" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
        </svg>
        <span class="chat-toggle-pulse"></span>
    `;

    // Chat window
    const chat = document.createElement('div');
    chat.id = 'chatWindow';
    chat.className = 'chat-window';
    chat.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-info">
                <div class="chat-header-avatar">
                    <svg viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none">
                        <path d="M12 21a9 9 0 1 0-7.5-4L3 21l4.5-1.5A8.96 8.96 0 0 0 12 21z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
                <div>
                    <div class="chat-header-name">SEVENTOR Concierge</div>
                    <div class="chat-header-status">
                        <span class="chat-status-dot"></span>
                        <span class="chat-status-text" data-en="AI-Powered" data-ar="مدعوم بالذكاء الاصطناعي">AI-Powered</span>
                    </div>
                </div>
            </div>
            <button class="chat-minimize" onclick="toggleChat()" aria-label="Minimize chat">
                <svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none">
                    <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="chat-messages" id="chatMessages">
            <div class="chat-welcome">
                <div class="chat-welcome-icon">
                    <img src="img/logo.png" alt="SEVENTOR" />
                </div>
                <p class="chat-welcome-text" data-en="Welcome to SEVENTOR. How may we elevate your next occasion?" data-ar="أهلاً بك في سِڤَنتور. كيف يمكننا أن نرتقي بمناسبتك القادمة؟">Welcome to SEVENTOR. How may we elevate your next occasion?</p>
            </div>
        </div>
        <form class="chat-input-area" id="chatForm" onsubmit="handleChatSubmit(event)">
            <input type="text" class="chat-input" id="chatInput"
                   placeholder="Share your vision..."
                   data-en-ph="Share your vision..."
                   data-ar-ph="شاركنا رؤيتك..."
                   autocomplete="off" />
            <button type="submit" class="chat-send" id="chatSend" aria-label="Send message">
                <svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </form>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(chat);
}

// ===== Attach Events =====
function attachChatEvents() {
    document.getElementById('chatToggle').addEventListener('click', toggleChat);

    // Auto-pulse animation after 5 seconds
    setTimeout(() => {
        const toggle = document.getElementById('chatToggle');
        if (toggle && !isChatOpen) {
            toggle.classList.add('attention');
        }
    }, 5000);
}

// ===== Toggle Chat =====
function toggleChat() {
    isChatOpen = !isChatOpen;
    const win = document.getElementById('chatWindow');
    const btn = document.getElementById('chatToggle');

    win.classList.toggle('open', isChatOpen);
    btn.classList.toggle('active', isChatOpen);
    btn.classList.remove('attention');

    if (isChatOpen) {
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 300);
    }
}

// ===== Handle Submit =====
function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message || isTyping) return;

    input.value = '';
    addMessage('user', message);
    sendToGemini(message);
}

// ===== Add Message to Chat =====
function addMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-${role}`;

    if (role === 'typing') {
        bubble.innerHTML = `
            <div class="chat-typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        bubble.id = 'typingIndicator';
    } else {
        bubble.textContent = text;
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
}

// ===== Remove Typing Indicator =====
function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ===== Send to Gemini API =====
async function sendToGemini(userMessage) {
    isTyping = true;
    document.getElementById('chatSend').disabled = true;
    addMessage('typing', '');

    // Build conversation history for context
    chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

    const requestBody = {
        system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: chatHistory,
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 300
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
        ]
    };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || getErrorMessage();

        removeTyping();
        addMessage('assistant', aiText);

        // Add to history
        chatHistory.push({ role: 'model', parts: [{ text: aiText }] });

        // Keep history manageable (last 20 messages)
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

    } catch (err) {
        console.error('SEVENTOR Concierge Error:', err);
        removeTyping();
        addMessage('assistant', getErrorMessage());
    }

    isTyping = false;
    document.getElementById('chatSend').disabled = false;
}

// ===== Error Message =====
function getErrorMessage() {
    const isAr = document.documentElement.lang === 'ar';
    return isAr
        ? 'عذراً، يبدو أن هناك مشكلة مؤقتة. يمكنك التواصل معنا مباشرة عبر واتساب: +971 54 411 7716'
        : 'My apologies, I\'m experiencing a brief interruption. You can reach us directly on WhatsApp: +971 54 411 7716';
}
