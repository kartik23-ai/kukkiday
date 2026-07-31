/* ==========================================================================
   GLOBAL MAIN JS (Lenis, GSAP Breathing Motion & 3D Tilt)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Continuous Subtle Breathing Animations (No screen feels static!)
    gsap.to('.sparkle-badge', {
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 2.4,
        ease: 'sine.inOut'
    });

    gsap.to('.btn-primary', {
        scale: 1.02,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut'
    });

    // 3D Card Tilt & Specular Coordinates
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -((y - centerY) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;

            gsap.to(card, {
                duration: 0.4,
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.6,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out'
            });
        });
    });
});
