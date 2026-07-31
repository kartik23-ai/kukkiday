/* ==========================================================================
   GLOBAL MAGNETIC GLOWING CURSOR & PARTICLE TRAIL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cursor-dot')) {
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        dot.id = 'cursor-dot';
        document.body.appendChild(dot);
    }

    if (!document.getElementById('cursor-ring')) {
        const ring = document.createElement('div');
        ring.className = 'custom-cursor-ring';
        ring.id = 'cursor-ring';
        document.body.appendChild(ring);
    }

    if (!document.getElementById('cursor-trail-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'cursor-trail-canvas';
        document.body.appendChild(canvas);
    }

    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const trailCanvas = document.getElementById('cursor-trail-canvas');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }
    });

    function animateCursorRing() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        if (cursorRing) {
            cursorRing.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Hover Reactions
    const interactiveElements = document.querySelectorAll('button, a, .glass-card, .envelope, .vinyl-wrapper, .gallery-item');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('active'); });
        el.addEventListener('mouseleave', () => { if (cursorRing) cursorRing.classList.remove('active'); });
    });

    // Sparkle Trail Canvas
    if (trailCanvas) {
        const ctx = trailCanvas.getContext('2d');
        let width = trailCanvas.width = window.innerWidth;
        let height = trailCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = trailCanvas.width = window.innerWidth;
            height = trailCanvas.height = window.innerHeight;
        });

        const trailParticles = [];

        class SparkleParticle {
            constructor(x, y) {
                this.x = x + (Math.random() - 0.5) * 12;
                this.y = y + (Math.random() - 0.5) * 12;
                this.size = Math.random() * 3.5 + 1;
                this.vx = (Math.random() - 0.5) * 0.9;
                this.vy = (Math.random() - 0.5) * 0.9 - 0.4;
                this.alpha = 1;
                this.color = ['#ff4d8d', '#ffd700', '#c084fc', '#ffffff'][Math.floor(Math.random() * 4)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 0.022;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        let lastSpawn = 0;
        window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastSpawn > 18) {
                trailParticles.push(new SparkleParticle(e.clientX, e.clientY));
                lastSpawn = now;
            }
        });

        function renderTrail() {
            requestAnimationFrame(renderTrail);
            ctx.clearRect(0, 0, width, height);

            for (let i = trailParticles.length - 1; i >= 0; i--) {
                const p = trailParticles[i];
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    trailParticles.splice(i, 1);
                }
            }
        }
        renderTrail();
    }
});
