/* ============================================
   SEVENTOR — Luxury Entertainment & Events
   script.js
   ============================================ */

// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pre').classList.add('done'), 2200);
});

// ===== Sparkles =====
(function initSparkles() {
    const container = document.getElementById('sparkles');
    for (let i = 0; i < 35; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = Math.random() * 100 + '%';
        spark.style.top = Math.random() * 100 + '%';
        spark.style.animationDelay = Math.random() * 10 + 's';
        spark.style.animationDuration = (7 + Math.random() * 8) + 's';
        const size = 1 + Math.random() * 3;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        container.appendChild(spark);
    }
})();

// ===== Language Toggle =====
let lang = 'en';

// Auto-detect language on first visit
(function detectLang() {
    const saved = localStorage.getItem('seventor-lang');
    if (saved) {
        // User previously chose a language — respect it
        lang = saved;
    } else {
        // First visit — detect from browser
        const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        lang = browserLang.startsWith('ar') ? 'ar' : 'en';
    }
    // Apply after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setLang(lang));
    } else {
        setLang(lang);
    }
})();

function setLang(l) {
    lang = l;
    localStorage.setItem('seventor-lang', l);
    document.body.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;

    // Toggle ALL language button states (header + mobile overlay)
    document.querySelectorAll('.lang-opt').forEach(btn => {
        btn.classList.toggle('on', btn.dataset.l === l);
    });

    // Update text content
    document.querySelectorAll('[data-' + l + ']').forEach(el => {
        el.textContent = el.getAttribute('data-' + l);
    });

    // Update placeholders
    document.querySelectorAll('[data-' + l + '-ph]').forEach(el => {
        el.placeholder = el.getAttribute('data-' + l + '-ph');
    });

    // Update Book Now buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.textContent = l === 'ar' ? 'احجز الآن' : 'Book Now';
    });
}

// ===== Header Pin on Scroll =====
window.addEventListener('scroll', () => {
    document.getElementById('hdr').classList.toggle('pinned', scrollY > 80);
});

// ===== Mobile Menu =====
function openMob() {
    document.getElementById('mob').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMob() {
    document.getElementById('mob').classList.remove('open');
    document.body.style.overflow = '';
}

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Smooth Scroll Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Service Data =====
const serviceData = {
    oud: { icon: '🪕', en: 'Oud Performance', ar: 'عزف عود' },
    piano: { icon: '🎹', en: 'Piano Performance', ar: 'عزف بيانو' },
    percussion: { icon: '🥁', en: 'Percussion', ar: 'إيقاع' },
    violin: { icon: '🎻', en: 'Violin Performance', ar: 'عزف كمان' },
    saxophone: { icon: '🎷', en: 'Saxophone', ar: 'ساكسفون' },
    vocalist: { icon: '🎤', en: 'Vocalist', ar: 'مغنّي' },
    dj: { icon: '🎧', en: 'DJ', ar: 'دي جي' },
    handpan: { icon: '🪘', en: 'Handpan', ar: 'هاندبان' }
};

// ===== Booking Modal =====
function openBooking(serviceKey) {
    const modal = document.getElementById('bookingModal');
    const iconEl = document.getElementById('bookingServiceIcon');
    const nameEl = document.getElementById('bookingServiceName');
    const hiddenInput = document.getElementById('bookingServiceKey');

    const service = serviceData[serviceKey];
    if (service) {
        iconEl.textContent = service.icon;
        nameEl.textContent = lang === 'ar' ? service.ar : service.en;
        hiddenInput.value = serviceKey;
    }

    // Reset quantity to 1
    const qtyInput = document.getElementById('bk-qty');
    if (qtyInput) qtyInput.value = 1;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', e => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        closeBooking();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeBooking();
        closeMob();
    }
});

// ===== Booking Form → WhatsApp =====
function submitBookingForm(e) {
    e.preventDefault();

    const serviceKey = document.getElementById('bookingServiceKey').value;
    const service = serviceData[serviceKey];
    const serviceName = service ? service.en : serviceKey;
    const serviceNameAr = service ? service.ar : '';
    const qty = document.getElementById('bk-qty').value || '1';
    const name = document.getElementById('bk-name').value.trim();
    const phone = document.getElementById('bk-phone').value.trim();
    const date = document.getElementById('bk-date').value;
    const startTime = document.getElementById('bk-start').value;
    const endTime = document.getElementById('bk-end').value;
    const eventType = document.getElementById('bk-type').value;
    const notes = document.getElementById('bk-notes').value.trim();

    // Format the date nicely
    let formattedDate = date;
    if (date) {
        const d = new Date(date + 'T00:00:00');
        formattedDate = d.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Format time to 12h
    function formatTime(t) {
        if (!t) return '';
        const [h, m] = t.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return h12 + ':' + m + ' ' + ampm;
    }

    // Build WhatsApp message
    let msg = `🎵 *SEVENTOR — Booking Request*\n\n`;
    msg += `📋 *Service:* ${serviceName}`;
    if (serviceNameAr) msg += ` (${serviceNameAr})`;
    msg += `\n`;
    msg += `👥 *Quantity:* ${qty} performer${parseInt(qty) > 1 ? 's' : ''}\n`;
    msg += `👤 *Name:* ${name}\n`;
    msg += `📱 *Phone:* ${phone}\n`;
    msg += `📅 *Date:* ${formattedDate}\n`;
    msg += `🕐 *Time:* ${formatTime(startTime)} — ${formatTime(endTime)}\n`;
    if (eventType) msg += `🎯 *Event Type:* ${eventType}\n`;
    if (notes) msg += `📝 *Notes:* ${notes}\n`;
    msg += `\n_Sent from seventor.com_`;

    // Open WhatsApp with pre-filled message
    const waURL = 'https://wa.me/971544117716?text=' + encodeURIComponent(msg);
    window.open(waURL, '_blank');

    // Visual feedback and reset
    const btn = e.target.querySelector('.form-btn');
    const originalText = btn.textContent;
    btn.textContent = lang === 'ar' ? '✓ تم!' : '✓ Sent!';
    btn.style.background = 'var(--emerald-light)';
    btn.style.borderColor = 'var(--emerald-light)';
    btn.style.color = 'var(--gold-light)';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        e.target.reset();
        closeBooking();
    }, 2000);
}

// ===== Contact WhatsApp =====
function openContactWhatsApp(e) {
    const msgEn = "Hi Ali, I'm interested in working with SEVENTOR for an upcoming event. I'd love to discuss the details!";
    const msgAr = "مرحبا علي، أنا مهتم بالتعاقد مع سِڤَنتور لفعالية قادمة. أحب نتناقش بالتفاصيل!";
    const msg = lang === 'ar' ? msgAr : msgEn;
    const url = 'https://wa.me/971544117716?text=' + encodeURIComponent(msg);
    e.preventDefault();
    window.open(url, '_blank');
    return false;
}
