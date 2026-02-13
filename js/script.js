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

    // Update artist card Book Now buttons
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

// ===== Artists Category Filter =====
function filterArtists(category, clickedTab) {
    // Update active tab
    document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.artist-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden');
            // Re-trigger reveal animation
            setTimeout(() => card.classList.add('visible'), 50);
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
}

// ===== Booking Modal =====
function openBooking(artistNameEn, artistNameAr) {
    const modal = document.getElementById('bookingModal');
    const badge = document.getElementById('bookingArtistName');
    const artistSelect = document.getElementById('bookingArtistSelect');

    // Set artist name in badge
    badge.textContent = lang === 'ar' ? artistNameAr : artistNameEn;

    // Pre-fill the hidden select
    if (artistSelect) {
        artistSelect.value = artistNameEn;
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

// Booking form submit
function submitBookingForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-btn');
    const originalText = btn.textContent;
    btn.textContent = lang === 'ar' ? '✓ تم إرسال الحجز' : '✓ Booking Sent!';
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
    }, 2500);
}
