/* ==========================================================================
   TRANSITIONS.JS — Portal Transition System
   Light bloom wipe from click point · Particle scatter · Fog reveal
   ========================================================================== */

(function() {
    'use strict';

    function init() {
        // Create overlay if not present
        let overlay = document.getElementById('portal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'transition-overlay';
            overlay.id = 'portal-overlay';

            const cvs = document.createElement('canvas');
            overlay.appendChild(cvs);
            document.body.appendChild(overlay);
        }

        const cvs = overlay.querySelector('canvas');
        const c = cvs.getContext('2d');
        let w, h;

        function resize() {
            w = cvs.width = window.innerWidth;
            h = cvs.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        let isTransitioning = false;

        function resetOverlay() {
            isTransitioning = false;
            overlay.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            c.clearRect(0, 0, w, h);
        }

        // ─── LIGHT BLOOM WIPE ───
        function bloomWipe(originX, originY, callback) {
            overlay.classList.add('active');
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';

            const maxRadius = Math.hypot(
                Math.max(originX, w - originX),
                Math.max(originY, h - originY)
            ) * 1.2;

            let radius = 0;
            const startTime = performance.now();
            const duration = 650; // Snappy & smooth

            // Particles for scatter effect
            const particles = [];
            for (let i = 0; i < 40; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 4;
                particles.push({
                    x: originX,
                    y: originY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 1 + Math.random() * 3,
                    alpha: 1,
                    color: ['#ff4d8d', '#ffd700', '#c084fc', '#ffffff'][Math.floor(Math.random() * 4)]
                });
            }

            function animate(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const eased = 1 - Math.pow(1 - progress, 3);
                radius = eased * maxRadius;

                c.clearRect(0, 0, w, h);

                const gradient = c.createRadialGradient(originX, originY, 0, originX, originY, Math.max(1, radius));
                gradient.addColorStop(0, 'rgba(255, 77, 141, 0.15)');
                gradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.08)');
                gradient.addColorStop(0.85, 'rgba(3, 1, 8, 0.95)');
                gradient.addColorStop(1, 'rgba(3, 1, 8, 1)');

                c.fillStyle = gradient;
                c.fillRect(0, 0, w, h);

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= 0.018;
                    if (p.alpha > 0) {
                        c.save();
                        c.globalAlpha = p.alpha;
                        c.fillStyle = p.color;
                        c.shadowBlur = 6;
                        c.shadowColor = p.color;
                        c.beginPath();
                        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        c.fill();
                        c.restore();
                    }
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    c.fillStyle = 'rgba(3, 1, 8, 1)';
                    c.fillRect(0, 0, w, h);
                    if (callback) callback();
                    // Safety net so buttons never get permanently stuck
                    setTimeout(resetOverlay, 2000);
                }
            }

            requestAnimationFrame(animate);
        }

        // ─── BIND NAVIGATION ───
        document.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript') || href.startsWith('mailto:')) return;

            if (isTransitioning) return;
            isTransitioning = true;

            e.preventDefault();

            const rect = link.getBoundingClientRect();
            const ox = rect.left + rect.width / 2;
            const oy = rect.top + rect.height / 2;

            bloomWipe(ox, oy, () => {
                window.location.href = href;
            });
        }, false);

        // Reset state on back/forward (bfcache) or page hide/show
        window.addEventListener('pageshow', resetOverlay);
        window.addEventListener('popstate', resetOverlay);

        // ─── ENTRANCE FADE-IN (when page loads) ───
        overlay.classList.add('active');
        overlay.style.opacity = '1';
        c.fillStyle = 'rgba(3, 1, 8, 1)';
        c.fillRect(0, 0, w, h);

        let fadeStart = null;
        function fadeIn(now) {
            if (!fadeStart) fadeStart = now;
            const elapsed = now - fadeStart;
            const progress = Math.min(elapsed / 600, 1);

            c.clearRect(0, 0, w, h);
            c.fillStyle = `rgba(3, 1, 8, ${1 - progress})`;
            c.fillRect(0, 0, w, h);

            if (progress < 1) {
                requestAnimationFrame(fadeIn);
            } else {
                resetOverlay();
            }
        }

        setTimeout(() => requestAnimationFrame(fadeIn), 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
