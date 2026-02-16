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

function setLang(l) {
    lang = l;
    document.body.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;

    // Toggle button states
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

    // Update category tabs
    document.querySelectorAll('.cat-tab').forEach(tab => {
        const key = 'data-' + l;
        if (tab.hasAttribute(key)) {
            tab.textContent = tab.getAttribute(key);
        }
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

// ===== Contact Form Submit =====
function submitContactForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-btn');
    const originalText = btn.textContent;
    btn.textContent = lang === 'ar' ? '✓ تم الإرسال' : '✓ Sent Successfully';
    btn.style.background = 'var(--emerald-light)';
    btn.style.borderColor = 'var(--emerald-light)';
    btn.style.color = 'var(--gold-light)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        e.target.reset();
    }, 3500);
}

// ===== Artists/Services Category Filter =====
function filterArtists(category, clickedTab) {
    document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    const cards = document.querySelectorAll('.artist-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden');
            setTimeout(() => card.classList.add('visible'), 50);
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
}

// ===== Service Data =====
const serviceData = {
    oud: { icon: '🪕', en: 'Oud Performance', ar: 'عزف عود' },
    piano: { icon: '🎹', en: 'Piano Performance', ar: 'عزف بيانو' },
    percussion: { icon: '🥁', en: 'Percussion', ar: 'إيقاع' },
    violin: { icon: '🎻', en: 'Violin Performance', ar: 'عزف كمان' },
    saxophone: { icon: '🎷', en: 'Saxophone', ar: 'ساكسفون' },
    vocalist: { icon: '🎤', en: 'Vocalist', ar: 'مغنّي' },
    dj: { icon: '🎧', en: 'DJ', ar: 'دي جي' }
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
    msg += `👤 *Name:* ${name}\n`;
    msg += `📱 *Phone:* ${phone}\n`;
    msg += `📅 *Date:* ${formattedDate}\n`;
    msg += `🕐 *Time:* ${formatTime(startTime)} — ${formatTime(endTime)}\n`;
    if (eventType) msg += `🎯 *Event Type:* ${eventType}\n`;
    if (notes) msg += `📝 *Notes:* ${notes}\n`;
    msg += `\n_Sent from seventor.vercel.app_`;

    // Open WhatsApp with pre-filled message
    const waURL = 'https://wa.me/971544117716?text=' + encodeURIComponent(msg);
    window.open(waURL, '_blank');

    // Reset form and close modal
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
