/* ==========================================================================
   ENGINE.JS — Core Runtime Engine
   Cursor · Particle Trail · Scroll Reveal · Parallax
   ========================================================================== */

(function() {
    'use strict';

    // ─── CURSOR ENGINE ───
    function initCursor() {
        if (window.innerWidth < 992) return;

        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        document.body.appendChild(dot);

        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(ring);

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;

        window.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        });

        function lerpRing() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(lerpRing);
        }
        lerpRing();

        // Magnetic effect on interactive elements
        function bindHover() {
            const targets = document.querySelectorAll('a, button, .interactive');
            targets.forEach(el => {
                el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
                el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
            });
        }
        bindHover();

        // Re-bind after potential DOM changes
        const observer = new MutationObserver(() => bindHover());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ─── SPARKLE TRAIL CANVAS ───
    function initSparkleTrail() {
        let canvas = document.getElementById('cursor-trail-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'cursor-trail-canvas';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        const particles = [];
        const colors = ['#ff4d8d', '#ffd700', '#c084fc', '#ffffff', '#38bdf8'];

        class Sparkle {
            constructor(x, y) {
                this.x = x + (Math.random() - 0.5) * 16;
                this.y = y + (Math.random() - 0.5) * 16;
                this.size = Math.random() * 2.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8 - 0.3;
                this.alpha = 1;
                this.decay = 0.015 + Math.random() * 0.01;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.005; // slight gravity
                this.alpha -= this.decay;
            }
            draw() {
                if (this.alpha <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        let lastSpawn = 0;
        window.addEventListener('mousemove', e => {
            const now = Date.now();
            if (now - lastSpawn > 25) {
                particles.push(new Sparkle(e.clientX, e.clientY));
                if (particles.length > 80) particles.shift();
                lastSpawn = now;
            }
        });

        function renderLoop() {
            requestAnimationFrame(renderLoop);
            ctx.clearRect(0, 0, w, h);
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].alpha <= 0) particles.splice(i, 1);
            }
        }
        renderLoop();
    }

    // ─── SCROLL REVEAL (GSAP ScrollTrigger) ───
    function initScrollReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Reveal elements with class .reveal
        gsap.utils.toArray('.reveal').forEach((el, i) => {
            gsap.fromTo(el, 
                { opacity: 0, y: 50, filter: 'blur(6px)' },
                {
                    opacity: 1, y: 0, filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.08
                }
            );
        });

        // Staggered reveal for groups
        gsap.utils.toArray('.reveal-group').forEach(group => {
            const children = group.querySelectorAll('.reveal-child');
            gsap.fromTo(children,
                { opacity: 0, y: 40, filter: 'blur(4px)' },
                {
                    opacity: 1, y: 0, filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // ─── PARALLAX LAYERS ───
    function initParallax() {
        const layers = document.querySelectorAll('[data-parallax]');
        if (!layers.length) return;

        window.addEventListener('mousemove', e => {
            const cx = (e.clientX / window.innerWidth - 0.5) * 2;
            const cy = (e.clientY / window.innerHeight - 0.5) * 2;

            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.parallax) || 0.02;
                const x = cx * speed * 40;
                const y = cy * speed * 40;
                layer.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ─── 3D TILT ON CARDS ───
    function initTilt() {
        if (typeof gsap === 'undefined') return;

        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotX = -((y - cy) / cy) * 10;
                const rotY = ((x - cx) / cx) * 10;

                gsap.to(card, {
                    rotateX: rotX,
                    rotateY: rotY,
                    transformPerspective: 1000,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // ─── SMOOTH SCROLL (LENIS) ───
    function initSmoothScroll() {
        if (typeof Lenis === 'undefined') return;

        const lenis = new Lenis({
            duration: 1.4,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8
        });

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(time => lenis.raf(time * 1000));
        } else {
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        }

        window.__lenis = lenis;
    }

    // ─── BUTTON PARTICLE BURST ───
    function initButtonEffects() {
        document.querySelectorAll('.btn-journey').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                // Create tiny particle burst on hover
                for (let i = 0; i < 6; i++) {
                    const spark = document.createElement('span');
                    spark.style.cssText = `
                        position: absolute;
                        width: 4px; height: 4px;
                        background: #ffd700;
                        border-radius: 50%;
                        pointer-events: none;
                        box-shadow: 0 0 6px #ffd700;
                        z-index: 10;
                    `;
                    btn.appendChild(spark);

                    const angle = (Math.PI * 2 / 6) * i;
                    const dist = 30 + Math.random() * 20;

                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(spark,
                            { x: 0, y: 0, opacity: 1, scale: 1 },
                            {
                                x: Math.cos(angle) * dist,
                                y: Math.sin(angle) * dist,
                                opacity: 0,
                                scale: 0,
                                duration: 0.6,
                                ease: 'power2.out',
                                onComplete: () => spark.remove()
                            }
                        );
                    }
                }
            });
        });
    }

    // ─── INIT ALL ───
    function boot() {
        initCursor();
        initSparkleTrail();
        initSmoothScroll();
        initParallax();

        // Wait for GSAP to load
        if (typeof gsap !== 'undefined') {
            initScrollReveal();
            initTilt();
            initButtonEffects();
        } else {
            window.addEventListener('load', () => {
                initScrollReveal();
                initTilt();
                initButtonEffects();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
