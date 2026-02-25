/* ============================================
   SEVENTOR AI Concierge — Chat Widget
   chat-widget.js (Mobile-Optimized v2)
   ============================================ */

(function () {
  'use strict';

  // ===== State =====
  let isOpen = false;
  let isLoading = false;
  let touchStartY = 0;
  let messages = [];

  const welcomeMsg = {
    en: 'Welcome to SEVENTOR. I am your AI Concierge. How may I craft an extraordinary experience for you today?',
    ar: 'أهلاً بك في سِڤَنتور. أنا المساعد الذكي الخاص بك. كيف يمكنني أن أصنع لك تجربة استثنائية اليوم؟',
  };

  const quickActions = [
    { en: 'Plan an Event', ar: 'خطط لفعالية' },
    { en: 'Book a Musician', ar: 'احجز فناناً' },
    { en: 'Wedding Entertainment', ar: 'ترفيه زفاف' },
    { en: 'Corporate Gala', ar: 'حفل شركات' },
    { en: 'Get a Quote', ar: 'طلب عرض سعر' },
  ];

  const placeholders = {
    en: 'Type your message...',
    ar: 'اكتب رسالتك...',
  };

  // ===== Detect language from page =====
  function getLang() {
    return typeof lang !== 'undefined' ? lang : 'en';
  }

  function isRTL() {
    return document.body.getAttribute('dir') === 'rtl' || getLang() === 'ar';
  }

  // ===== Initialize welcome message =====
  function initMessages() {
    var l = getLang();
    messages = [
      { role: 'assistant', content: welcomeMsg[l] || welcomeMsg.en },
    ];
  }

  // ===== Inject CSS =====
  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'seventor-chat-styles';
    style.textContent = `
      /* --- FAB --- */
      .st-chat-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 10001;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 1px solid rgba(200, 169, 81, 0.3);
        background: linear-gradient(135deg, rgba(200, 169, 81, 0.9), rgba(160, 134, 54, 0.9));
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: stFabGlow 3s ease-in-out infinite;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        -webkit-tap-highlight-color: transparent;
      }
      body[dir="rtl"] .st-chat-fab { right: auto; left: 24px; }
      .st-chat-fab:hover { transform: scale(1.08); }
      .st-chat-fab:active { transform: scale(0.95); }
      .st-chat-fab svg { width: 24px; height: 24px; color: #040F0B; fill: none; stroke: currentColor; stroke-width: 2; }

      @keyframes stFabGlow {
        0%, 100% { box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(200, 169, 81, 0.15); }
        50% { box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(200, 169, 81, 0.3); }
      }

      /* --- Backdrop --- */
      .st-chat-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10001;
        background: rgba(4, 15, 11, 0.7);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      .st-chat-backdrop.open { opacity: 1; pointer-events: auto; }

      /* --- Panel (Desktop) --- */
      .st-chat-panel {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 10002;
        width: 380px;
        height: 600px;
        display: flex;
        flex-direction: column;
        background: rgba(4, 15, 11, 0.96);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid rgba(200, 169, 81, 0.1);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 40px rgba(200, 169, 81, 0.04);
        transform: translateY(16px) scale(0.96);
        opacity: 0;
        transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.35s ease;
        pointer-events: none;
      }
      body[dir="rtl"] .st-chat-panel { right: auto; left: 24px; }
      .st-chat-panel.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }

      /* --- Mobile Bottom Sheet --- */
      @media (max-width: 640px) {
        .st-chat-fab { bottom: 20px; right: 20px; }
        body[dir="rtl"] .st-chat-fab { right: auto; left: 20px; }

        .st-chat-panel {
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 90dvh;
          height: 90vh; /* fallback */
          border-radius: 24px 24px 0 0;
          border-bottom: none;
          transform: translateY(100%);
          opacity: 1;
        }
        body[dir="rtl"] .st-chat-panel { right: 0; left: 0; }
        .st-chat-panel.open {
          transform: translateY(0);
        }

        /* Safe area for iPhone notch/home indicator */
        .st-chat-input-area {
          padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .st-chat-footer {
          padding-bottom: calc(4px + env(safe-area-inset-bottom, 0px)) !important;
        }
      }

      /* --- Swipe bar (mobile only) --- */
      .st-swipe-bar {
        display: none;
        justify-content: center;
        padding: 10px 0 4px;
        cursor: grab;
        touch-action: none;
      }
      .st-swipe-bar span {
        width: 40px;
        height: 4px;
        border-radius: 2px;
        background: rgba(200, 169, 81, 0.2);
      }
      @media (max-width: 640px) {
        .st-swipe-bar { display: flex; }
      }

      /* --- Header --- */
      .st-chat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 16px 12px;
        border-bottom: 1px solid rgba(200, 169, 81, 0.06);
        flex-shrink: 0;
      }
      .st-chat-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(200, 169, 81, 0.15), rgba(200, 169, 81, 0.05));
        border: 1px solid rgba(200, 169, 81, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .st-chat-avatar svg { width: 16px; height: 16px; stroke: #C8A951; fill: none; stroke-width: 1.5; }
      .st-chat-header-info { flex: 1; min-width: 0; }
      .st-chat-header-title {
        font-family: var(--fc), 'Georgia', serif;
        font-size: 14px;
        font-weight: 500;
        color: #C8A951;
        letter-spacing: 0.12em;
      }
      .st-chat-header-status {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
      }
      .st-chat-online-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #1A6B53;
        animation: stPulse 2s ease-in-out infinite;
      }
      @keyframes stPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(26, 107, 83, 0.4); }
        50% { box-shadow: 0 0 0 5px rgba(26, 107, 83, 0); }
      }
      .st-chat-status-text {
        font-family: var(--fb), sans-serif;
        font-size: 10px;
        color: rgba(249, 247, 241, 0.4);
        letter-spacing: 0.06em;
      }
      .st-chat-close {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: rgba(200, 169, 81, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }
      .st-chat-close:hover { background: rgba(200, 169, 81, 0.12); }
      .st-chat-close svg { width: 14px; height: 14px; stroke: rgba(249, 247, 241, 0.5); fill: none; stroke-width: 2; }

      /* --- Quick Actions --- */
      .st-quick-actions {
        display: flex;
        gap: 8px;
        padding: 8px 16px;
        overflow-x: auto;
        flex-shrink: 0;
        -ms-overflow-style: none;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .st-quick-actions::-webkit-scrollbar { display: none; }
      .st-quick-btn {
        flex-shrink: 0;
        padding: 6px 14px;
        border-radius: 999px;
        border: 1px solid rgba(200, 169, 81, 0.12);
        background: rgba(200, 169, 81, 0.04);
        color: rgba(200, 169, 81, 0.7);
        font-family: var(--fb), sans-serif;
        font-size: 11px;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, border-color 0.2s;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
      }
      .st-quick-btn:hover {
        background: rgba(200, 169, 81, 0.1);
        color: #C8A951;
        border-color: rgba(200, 169, 81, 0.25);
      }
      .st-quick-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      /* --- Messages --- */
      .st-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      .st-chat-messages::-webkit-scrollbar { width: 4px; }
      .st-chat-messages::-webkit-scrollbar-track { background: transparent; }
      .st-chat-messages::-webkit-scrollbar-thumb { background: rgba(200, 169, 81, 0.2); border-radius: 2px; }

      .st-msg {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 14px;
        font-family: var(--fb), sans-serif;
        font-size: 13px;
        line-height: 1.65;
        animation: stMsgIn 0.3s ease;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      /* RTL message text alignment */
      body[dir="rtl"] .st-msg {
        font-family: var(--fp-ar), 'Tajawal', sans-serif;
        text-align: right;
      }

      @keyframes stMsgIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .st-msg-user {
        align-self: flex-end;
        background: linear-gradient(135deg, rgba(200, 169, 81, 0.15), rgba(200, 169, 81, 0.08));
        border: 1px solid rgba(200, 169, 81, 0.12);
        color: #F9F7F1;
        border-bottom-right-radius: 4px;
      }
      body[dir="rtl"] .st-msg-user {
        border-bottom-right-radius: 14px;
        border-bottom-left-radius: 4px;
      }

      .st-msg-assistant {
        align-self: flex-start;
        background: rgba(13, 59, 46, 0.35);
        border: 1px solid rgba(26, 107, 83, 0.1);
        color: rgba(249, 247, 241, 0.9);
        border-bottom-left-radius: 4px;
      }
      body[dir="rtl"] .st-msg-assistant {
        border-bottom-left-radius: 14px;
        border-bottom-right-radius: 4px;
      }

      /* --- Typing indicator --- */
      .st-typing {
        display: flex;
        gap: 4px;
        padding: 12px 14px;
        align-self: flex-start;
        background: rgba(13, 59, 46, 0.35);
        border: 1px solid rgba(26, 107, 83, 0.1);
        border-radius: 14px;
        border-bottom-left-radius: 4px;
      }
      .st-typing-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(200, 169, 81, 0.5);
      }
      .st-typing-dot:nth-child(1) { animation: stDot 1.4s ease-in-out infinite; }
      .st-typing-dot:nth-child(2) { animation: stDot 1.4s ease-in-out 0.2s infinite; }
      .st-typing-dot:nth-child(3) { animation: stDot 1.4s ease-in-out 0.4s infinite; }
      @keyframes stDot {
        0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
        30% { opacity: 1; transform: scale(1); }
      }

      /* --- Input --- */
      .st-chat-input-area {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid rgba(200, 169, 81, 0.06);
        flex-shrink: 0;
      }
      .st-chat-input {
        flex: 1;
        background: rgba(200, 169, 81, 0.04);
        border: 1px solid rgba(200, 169, 81, 0.1);
        border-radius: 12px;
        padding: 10px 14px;
        color: #F9F7F1;
        font-family: var(--fb), sans-serif;
        font-size: 16px; /* Prevents iOS zoom on focus */
        outline: none;
        transition: border-color 0.2s;
        resize: none;
        min-height: 40px;
        max-height: 100px;
        -webkit-appearance: none;
        appearance: none;
      }
      body[dir="rtl"] .st-chat-input {
        font-family: var(--fp-ar), 'Tajawal', sans-serif;
        text-align: right;
      }
      .st-chat-input::placeholder { color: rgba(249, 247, 241, 0.25); }
      .st-chat-input:focus { border-color: rgba(200, 169, 81, 0.25); }

      .st-chat-send {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, rgba(200, 169, 81, 0.2), rgba(200, 169, 81, 0.1));
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s, transform 0.15s;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }
      .st-chat-send:hover { background: linear-gradient(135deg, rgba(200, 169, 81, 0.3), rgba(200, 169, 81, 0.15)); }
      .st-chat-send:active { transform: scale(0.92); }
      .st-chat-send:disabled { opacity: 0.3; cursor: not-allowed; }
      .st-chat-send svg { width: 16px; height: 16px; stroke: #C8A951; fill: none; stroke-width: 2; }

      /* --- Error --- */
      .st-chat-error {
        padding: 0 16px 4px;
        text-align: center;
        font-family: var(--fb), sans-serif;
        font-size: 11px;
        color: #e74c3c;
        opacity: 0.8;
      }

      /* --- Powered by --- */
      .st-chat-footer {
        text-align: center;
        padding: 4px 0 8px;
        font-family: var(--fb), sans-serif;
        font-size: 9px;
        color: rgba(249, 247, 241, 0.2);
        letter-spacing: 0.08em;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // ===== Build HTML =====
  function buildWidget() {
    // FAB
    const fab = document.createElement('button');
    fab.className = 'st-chat-fab';
    fab.id = 'stChatFab';
    fab.setAttribute('aria-label', 'Open AI Concierge');
    fab.innerHTML = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/><path d="M22 5h-4"/>
    </svg>`;
    fab.addEventListener('click', openChat);

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'st-chat-backdrop';
    backdrop.id = 'stChatBackdrop';
    backdrop.addEventListener('click', closeChat);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'st-chat-panel';
    panel.id = 'stChatPanel';
    panel.innerHTML = `
      <div class="st-swipe-bar" id="stSwipeBar"><span></span></div>
      <div class="st-chat-header">
        <div class="st-chat-avatar">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
          </svg>
        </div>
        <div class="st-chat-header-info">
          <div class="st-chat-header-title">AI CONCIERGE</div>
          <div class="st-chat-header-status">
            <div class="st-chat-online-dot"></div>
            <span class="st-chat-status-text">Online</span>
          </div>
        </div>
        <button class="st-chat-close" id="stChatClose" aria-label="Close chat">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      <div class="st-quick-actions" id="stQuickActions"></div>
      <div class="st-chat-messages" id="stChatMessages"></div>
      <div class="st-chat-error" id="stChatError" style="display:none;"></div>
      <div class="st-chat-input-area">
        <input type="text" class="st-chat-input" id="stChatInput" placeholder="Type your message..." autocomplete="off" enterkeyhint="send">
        <button class="st-chat-send" id="stChatSend" aria-label="Send message">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
          </svg>
        </button>
      </div>
      <div class="st-chat-footer">Powered by SEVENTOR AI</div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    // Event listeners
    document.getElementById('stChatClose').addEventListener('click', closeChat);
    document.getElementById('stChatSend').addEventListener('click', handleSend);
    document.getElementById('stChatInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    // Swipe-to-close on mobile
    setupSwipeToClose();

    // iOS keyboard handling
    setupKeyboardHandling();

    // Build quick actions
    buildQuickActions();

    // Render initial message
    renderMessages();
  }

  // ===== Swipe to Close (Mobile) =====
  function setupSwipeToClose() {
    var swipeBar = document.getElementById('stSwipeBar');
    if (!swipeBar) return;

    swipeBar.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    swipeBar.addEventListener('touchmove', function (e) {
      var diff = e.touches[0].clientY - touchStartY;
      if (diff > 0) {
        var panel = document.getElementById('stChatPanel');
        panel.style.transition = 'none';
        panel.style.transform = 'translateY(' + diff + 'px)';
      }
    }, { passive: true });

    swipeBar.addEventListener('touchend', function (e) {
      var panel = document.getElementById('stChatPanel');
      var diff = e.changedTouches[0].clientY - touchStartY;
      panel.style.transition = '';
      if (diff > 100) {
        closeChat();
      } else {
        panel.style.transform = '';
        panel.classList.add('open');
      }
    }, { passive: true });
  }

  // ===== iOS Keyboard Handling =====
  function setupKeyboardHandling() {
    if (!window.visualViewport) return;

    window.visualViewport.addEventListener('resize', function () {
      if (!isOpen) return;
      var panel = document.getElementById('stChatPanel');
      if (!panel) return;

      // On mobile, when keyboard opens, adjust panel height
      if (window.innerWidth <= 640) {
        var vvh = window.visualViewport.height;
        panel.style.height = vvh + 'px';

        // Scroll messages to bottom
        var msgs = document.getElementById('stChatMessages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }
    });

    window.visualViewport.addEventListener('scroll', function () {
      if (!isOpen || window.innerWidth > 640) return;
      // Keep panel anchored to visual viewport
      var panel = document.getElementById('stChatPanel');
      if (panel) {
        panel.style.bottom = '0px';
      }
    });
  }

  // ===== Quick Actions =====
  function buildQuickActions() {
    const container = document.getElementById('stQuickActions');
    container.innerHTML = '';
    const l = getLang();
    quickActions.forEach(function (action) {
      const btn = document.createElement('button');
      btn.className = 'st-quick-btn';
      btn.textContent = l === 'ar' ? action.ar : action.en;
      btn.addEventListener('click', function () {
        sendMessage(l === 'ar' ? action.ar : action.en);
      });
      container.appendChild(btn);
    });
  }

  // ===== Open / Close =====
  function openChat() {
    isOpen = true;
    document.getElementById('stChatFab').style.display = 'none';
    document.getElementById('stChatBackdrop').classList.add('open');
    document.getElementById('stChatPanel').classList.add('open');

    // Update placeholder for current language
    var l = getLang();
    document.getElementById('stChatInput').placeholder = placeholders[l] || placeholders.en;

    // Lock body scroll on mobile
    if (window.innerWidth <= 640) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '-' + window.scrollY + 'px';
    }

    // Update quick action labels for current language
    buildQuickActions();

    // Focus input after animation
    setTimeout(function () {
      document.getElementById('stChatInput').focus();
    }, 400);
  }

  function closeChat() {
    isOpen = false;
    var panel = document.getElementById('stChatPanel');
    panel.style.transform = '';
    panel.style.height = '';
    document.getElementById('stChatBackdrop').classList.remove('open');
    panel.classList.remove('open');

    // Restore body scroll
    var scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    setTimeout(function () {
      document.getElementById('stChatFab').style.display = 'flex';
    }, 300);
  }

  // ===== Render Messages =====
  function renderMessages() {
    const container = document.getElementById('stChatMessages');
    container.innerHTML = '';

    messages.forEach(function (msg) {
      const div = document.createElement('div');
      div.className = 'st-msg st-msg-' + msg.role;
      div.textContent = msg.content;
      container.appendChild(div);
    });

    if (isLoading) {
      const typing = document.createElement('div');
      typing.className = 'st-typing';
      typing.innerHTML = '<div class="st-typing-dot"></div><div class="st-typing-dot"></div><div class="st-typing-dot"></div>';
      container.appendChild(typing);
    }

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  // ===== Send Message =====
  function handleSend() {
    const input = document.getElementById('stChatInput');
    const text = input.value.trim();
    if (!text || isLoading) return;
    input.value = '';
    sendMessage(text);
  }

  async function sendMessage(content) {
    if (isLoading) return;

    messages.push({ role: 'user', content: content });
    isLoading = true;
    setInputDisabled(true);
    hideError();
    renderMessages();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages }),
      });

      if (!response.ok) {
        const data = await response.json().catch(function () { return {}; });
        throw new Error(data.error || 'Error: ' + response.status);
      }

      const data = await response.json();
      messages.push({ role: 'assistant', content: data.content });
    } catch (err) {
      var errorMsg = err.message || 'Connection interrupted.';
      showError(errorMsg);
      messages.push({
        role: 'assistant',
        content: getLang() === 'ar'
          ? 'أعتذر عن هذا الانقطاع. يبدو أنه حدثت مشكلة في الاتصال. يرجى المحاولة مرة أخرى قريباً.'
          : 'I apologize for the interruption. It seems there was a connection issue. Please try again shortly.',
      });
    } finally {
      isLoading = false;
      setInputDisabled(false);
      renderMessages();
      document.getElementById('stChatInput').focus();
    }
  }

  // ===== Helpers =====
  function setInputDisabled(disabled) {
    document.getElementById('stChatInput').disabled = disabled;
    document.getElementById('stChatSend').disabled = disabled;
    document.querySelectorAll('.st-quick-btn').forEach(function (btn) {
      btn.disabled = disabled;
    });
  }

  function showError(msg) {
    var el = document.getElementById('stChatError');
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideError() {
    document.getElementById('stChatError').style.display = 'none';
  }

  // ===== Initialize =====
  function init() {
    initMessages();
    injectStyles();
    buildWidget();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
