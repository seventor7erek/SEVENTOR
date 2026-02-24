/* ============================================
   SEVENTOR — Luxury Entertainment & Events
   script.js
   ============================================ */

// ===== Config =====
const WHATSAPP_NUMBER = '971544117716';

// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pre').classList.add('done'), 2200);
});

// ===== Sparkles =====
(function initSparkles() {
    const container = document.getElementById('sparkles');
    for (let i = 0; i < 20; i++) {
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
        lang = saved;
    } else {
        const browserLang = (navigator.language || 'en').toLowerCase();
        lang = browserLang.startsWith('ar') ? 'ar' : 'en';
    }
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

    document.querySelectorAll('.lang-opt').forEach(btn => {
        btn.classList.toggle('on', btn.dataset.l === l);
    });

    document.querySelectorAll('[data-' + l + ']').forEach(el => {
        el.textContent = el.getAttribute('data-' + l);
    });

    document.querySelectorAll('[data-' + l + '-ph]').forEach(el => {
        el.placeholder = el.getAttribute('data-' + l + '-ph');
    });

    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.textContent = l === 'ar' ? 'استفسر' : 'Inquire';
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

// ===== Smooth Scroll (Lenis) =====
const lenis = new window.Lenis({
    lerp: 0.1, // Snappier, more responsive (removes the "floaty" feel)
    wheelMultiplier: 1.1, // Slightly faster scroll per tick
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const targetAttr = anchor.getAttribute('href');
        if (targetAttr === '#') return;
        const target = document.querySelector(targetAttr);
        if (target) {
            lenis.scrollTo(target);
        }
    }
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

    // Reset quantity
    const qtyInput = document.getElementById('bk-qty');
    if (qtyInput) qtyInput.value = 1;

    // Set min date to today
    const dateInput = document.getElementById('bk-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Clear previous errors
    clearFormErrors();

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap: focus first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Close modal on overlay click or Escape
document.addEventListener('click', e => {
    if (e.target === document.getElementById('bookingModal')) {
        closeBooking();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeBooking();
        closeMob();
    }

    // Focus trap for modal
    const modal = document.getElementById('bookingModal');
    if (e.key === 'Tab' && modal.classList.contains('open')) {
        const focusable = modal.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
});

// ===== Form Validation =====
function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function showFieldError(fieldId, messageEn, messageAr) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('error');

    let errorEl = field.parentElement.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = lang === 'ar' ? messageAr : messageEn;
    errorEl.classList.add('visible');
}

function validateBookingForm() {
    clearFormErrors();
    let valid = true;

    const name = document.getElementById('bk-name').value.trim();
    if (name.length < 3) {
        showFieldError('bk-name', 'Name must be at least 3 characters', 'الاسم يجب أن يكون 3 أحرف على الأقل');
        valid = false;
    }

    const phone = document.getElementById('bk-phone').value.trim();
    const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError('bk-phone', 'Please enter a valid phone number', 'يرجى إدخال رقم هاتف صحيح');
        valid = false;
    }

    const date = document.getElementById('bk-date').value;
    if (date) {
        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            showFieldError('bk-date', 'Event date must be in the future', 'يجب أن يكون تاريخ الفعالية في المستقبل');
            valid = false;
        }
    }

    const startTime = document.getElementById('bk-start').value;
    const endTime = document.getElementById('bk-end').value;
    if (startTime && endTime && startTime >= endTime) {
        showFieldError('bk-end', 'End time must be after start time', 'يجب أن يكون وقت الانتهاء بعد وقت البدء');
        valid = false;
    }

    const eventType = document.getElementById('bk-type').value;
    if (!eventType) {
        showFieldError('bk-type', 'Please select an event type', 'يرجى اختيار نوع الفعالية');
        valid = false;
    }

    return valid;
}

// ===== Booking Form → WhatsApp =====
function submitBookingForm(e) {
    e.preventDefault();

    if (!validateBookingForm()) return;

    const serviceKey = document.getElementById('bookingServiceKey').value;
    const service = serviceData[serviceKey];
    if (!service) return;

    const serviceName = service.en;
    const serviceNameAr = service.ar;
    const qty = document.getElementById('bk-qty').value || '1';
    const name = document.getElementById('bk-name').value.trim();
    const phone = document.getElementById('bk-phone').value.trim();
    const date = document.getElementById('bk-date').value;
    const startTime = document.getElementById('bk-start').value;
    const endTime = document.getElementById('bk-end').value;
    const eventType = document.getElementById('bk-type').value;
    const notes = document.getElementById('bk-notes').value.trim();

    // Format date
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

    // Open WhatsApp
    const waURL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    const waWindow = window.open(waURL, '_blank');

    // Fallback if popup blocked
    if (!waWindow) {
        window.location.href = waURL;
    }

    // Visual feedback
    const btn = e.target.querySelector('.form-btn');
    const originalText = btn.textContent;
    btn.textContent = lang === 'ar' ? '✓ تم!' : '✓ Sent!';
    btn.classList.add('success');

    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('success');
        e.target.reset();
        closeBooking();
    }, 2000);
}

// ===== Contact WhatsApp =====
function openContactWhatsApp(e) {
    const msgEn = "Hi Ali, I'm interested in working with SEVENTOR for an upcoming event. I'd love to discuss the details!";
    const msgAr = "مرحبا علي، أنا مهتم بالتعاقد مع سِڤَنتور لفعالية قادمة. أحب نتناقش بالتفاصيل!";
    const msg = lang === 'ar' ? msgAr : msgEn;
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    e.preventDefault();
    const waWindow = window.open(url, '_blank');
    if (!waWindow) {
        window.location.href = url;
    }
    return false;
}

// ===== FAQ Accordion =====
document.addEventListener('click', e => {
    const question = e.target.closest('.faq-question');
    if (!question) return;

    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all other items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle current
    item.classList.toggle('open', !isOpen);
    question.setAttribute('aria-expanded', !isOpen);
});
