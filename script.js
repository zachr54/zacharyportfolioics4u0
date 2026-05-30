document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. Mobile Menu Toggle
    // ============================================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn && mobileBtn.querySelector('i');
            if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // ============================================================
    // 2. Navbar Scroll Effect
    // ============================================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Highlight active link based on current URL path
    const page = window.location.pathname.split('/').pop() || 'index.html';
    navLinksItems.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === page || (href === 'index.html' && (page === '' || page === 'index.html'));
        link.classList.toggle('active', isActive);
    });

    // ============================================================
    // 3. Scroll Reveal Animations (staggered via IntersectionObserver)
    // ============================================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);

        // Activate content already on screen (fixes tall containers that never hit a high threshold)
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
        }
    });

    // ============================================================
    // 4. Animated Counter (lift numbers count up on scroll)
    // ============================================================
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const decimal = el.dataset.decimal || '';
        const duration = 1400;
        const start = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOut(progress) * target);
            el.textContent = progress === 1 ? value + decimal : value;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.lift-counter');
                counters.forEach(c => animateCounter(c));

                // Animate progress bars
                entry.target.querySelectorAll('.lift-bar').forEach(bar => {
                    const pct = bar.dataset.pct;
                    // Small delay so the section slides in first
                    setTimeout(() => { bar.style.width = pct + '%'; }, 200);
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const powerliftingSection = document.querySelector('.powerlifting-section');
    if (powerliftingSection) counterObserver.observe(powerliftingSection);

    // Also trigger counter for the total box (separate reveal)
    const totalBox = document.querySelector('.powerlifting-total');
    if (totalBox) {
        const totalObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.lift-counter').forEach(c => animateCounter(c));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        totalObserver.observe(totalBox);
    }

    // ============================================================
    // 5. Interactive Array Visualization (ICS4U0 page)
    // ============================================================
    const arrayCells = document.querySelectorAll('.array-cell');
    let currentIndex = 0;

    if (arrayCells.length > 0) {
        setInterval(() => {
            arrayCells.forEach(cell => cell.classList.remove('active'));
            arrayCells[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % arrayCells.length;
        }, 1500);
    }

    // ============================================================
    // 6. Hero Typing Effect
    // ============================================================
    const heroP = document.querySelector('.hero-content > p');
    if (heroP) {
        const fullText = heroP.textContent.trim();
        heroP.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        heroP.appendChild(cursor);

        let charIdx = 0;
        const typingSpeed = 28; // ms per character

        // Small delay before starting so the hero reveal plays first
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (charIdx < fullText.length) {
                    heroP.insertBefore(document.createTextNode(fullText[charIdx]), cursor);
                    charIdx++;
                } else {
                    clearInterval(typeInterval);
                    // Remove cursor blink after a moment
                    setTimeout(() => cursor.remove(), 2000);
                }
            }, typingSpeed);
        }, 600);
    }

    // ============================================================
    // 7. Hero Parallax on Mouse Move
    // ============================================================
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            // Subtle parallax shift on hero content
            heroContent.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;

            // Move the decorative shapes in opposite direction
            const shape1 = document.querySelector('.shape-1');
            const shape2 = document.querySelector('.shape-2');
            if (shape1) shape1.style.transform = `translate(${-dx * 20}px, ${-dy * 15}px) scale(1)`;
            if (shape2) shape2.style.transform = `translate(${dx * 20}px, ${dy * 15}px) scale(1)`;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = '';
            const shape1 = document.querySelector('.shape-1');
            const shape2 = document.querySelector('.shape-2');
            if (shape1) shape1.style.transform = '';
            if (shape2) shape2.style.transform = '';
        });
    }

    // ============================================================
    // 8. Card Tilt Effect on Hover
    // ============================================================
    document.querySelectorAll('.card, .lift-card, .award-item, .competition-item').forEach(card => {
        if (card.closest('#ics4u0')) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -5;
            const rotateY = ((x - cx) / cx) * 5;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================================================
    // 9. Copy Email & Toast Notification
    // ============================================================
    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            const email = link.getAttribute('href').replace('mailto:', '');
            navigator.clipboard.writeText(email)
                .then(() => showToast('📋 Email copied to clipboard!'))
                .catch(() => {});
        });
    });

});
