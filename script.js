/**
 * HAIL MARY SINALOA 2026 - Lógica e Interacción
 */

document.addEventListener("DOMContentLoaded", () => {
    initSpaceCanvas();
    initScrollAnimations();
    initTiltEffect();
});

function initSpaceCanvas() {
    const canvas = document.getElementById('space-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const starCount = 120;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.015 + 0.005,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.alpha += star.speed * star.direction;
            if (star.alpha >= 1 || star.alpha <= 0.1) {
                star.direction *= -1;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.75})`;
            ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
            ctx.shadowColor = '#0066FF';
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    }

    animateStars();
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                const countElements = entry.target.querySelectorAll('.count-up');
                countElements.forEach(animateCount);

                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill && progressFill.dataset.fill) {
                    progressFill.style.width = progressFill.dataset.fill;
                }

                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach(el => observer.observe(el));
}

function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const unit = el.getAttribute('data-unit') || '';
    let current = 0;
    const duration = 1800;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + unit;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current) + unit;
        }
    }, stepTime);
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}
