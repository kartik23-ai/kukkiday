/* ==========================================================================
   HAPPY GIRLFRIEND DAY — KAMYA (AWWARDS POLISH EDITION)
   JavaScript Engine (GSAP Timelines, 3D Physics, Ink Typing & Audio Sync)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. CUSTOM GLOWING CURSOR & TRAIL ENGINE
    // ----------------------------------------------------------------------
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

    // Hover Reaction for Interactive Elements
    const interactiveElements = document.querySelectorAll('button, a, .magnetic-item, .gallery-card, .envelope, .vinyl-wrapper');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) cursorRing.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorRing) cursorRing.classList.remove('active');
        });
    });

    // Cursor Sparkle Trail
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
            if (now - lastSpawn > 20) {
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

    // ----------------------------------------------------------------------
    // 2. 3D CARD INTERACTIVE TILT & SPECULAR REFLECTION
    // ----------------------------------------------------------------------
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

            const rotateX = -((y - centerY) / centerY) * 12; // Max 12 deg
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

    // ----------------------------------------------------------------------
    // 3. LENIS SMOOTH SCROLLING SETUP
    // ----------------------------------------------------------------------
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

    // Smooth Scroll Actions
    const beginBtn = document.getElementById('btn-begin');
    if (beginBtn) {
        beginBtn.addEventListener('click', () => {
            const target = document.getElementById('quote');
            if (target) lenis.scrollTo(target, { offset: -40 });
        });
    }

    const replayBtn = document.getElementById('btn-replay');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            const target = document.getElementById('hero');
            if (target) lenis.scrollTo(target, { offset: 0 });
        });
    }

    // ----------------------------------------------------------------------
    // 4. THREE.JS 3D ATMOSPHERIC SCENE
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 32;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        function createGlowTexture() {
            const pCanvas = document.createElement('canvas');
            pCanvas.width = 64;
            pCanvas.height = 64;
            const ctx = pCanvas.getContext('2d');
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.35, 'rgba(255, 77, 141, 0.85)');
            gradient.addColorStop(0.7, 'rgba(192, 132, 252, 0.35)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(pCanvas);
        }

        const particleTexture = createGlowTexture();

        // 3D Heart Particle Cloud
        const heartParticleCount = 1500;
        const heartGeometry = new THREE.BufferGeometry();
        const heartPositions = new Float32Array(heartParticleCount * 3);
        const heartColors = new Float32Array(heartParticleCount * 3);

        for (let i = 0; i < heartParticleCount; i++) {
            const t = Math.random() * Math.PI * 2;
            const u = (Math.random() - 0.5) * Math.PI;
            
            const x = 16 * Math.pow(Math.sin(t), 3) * Math.cos(u);
            const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * Math.cos(u);
            const z = 6 * Math.sin(u) * Math.sin(t);

            const scale = 0.85;
            heartPositions[i * 3] = x * scale;
            heartPositions[i * 3 + 1] = y * scale;
            heartPositions[i * 3 + 2] = z * scale;

            const mixRatio = Math.random();
            if (mixRatio < 0.6) {
                heartColors[i * 3] = 1.0;
                heartColors[i * 3 + 1] = 0.3;
                heartColors[i * 3 + 2] = 0.55;
            } else if (mixRatio < 0.85) {
                heartColors[i * 3] = 0.75;
                heartColors[i * 3 + 1] = 0.5;
                heartColors[i * 3 + 2] = 0.98;
            } else {
                heartColors[i * 3] = 1.0;
                heartColors[i * 3 + 1] = 0.84;
                heartColors[i * 3 + 2] = 0.0;
            }
        }

        heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
        heartGeometry.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

        const heartMaterial = new THREE.PointsMaterial({
            size: 0.95,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        const heartPoints = new THREE.Points(heartGeometry, heartMaterial);
        scene.add(heartPoints);

        // Twinkling Starfield
        const starCount = 1100;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 140;
            starPositions[i + 1] = (Math.random() - 0.5) * 140;
            starPositions[i + 2] = (Math.random() - 0.5) * 120 - 20;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            size: 0.55,
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            map: particleTexture,
            blending: THREE.AdditiveBlending
        });

        const starPoints = new THREE.Points(starGeometry, starMaterial);
        scene.add(starPoints);

        // Drifting Petals
        const petalCount = 90;
        const petalGeometry = new THREE.BufferGeometry();
        const petalPositions = new Float32Array(petalCount * 3);
        const petalVelocities = [];

        for (let i = 0; i < petalCount; i++) {
            petalPositions[i * 3] = (Math.random() - 0.5) * 60;
            petalPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

            petalVelocities.push({
                x: (Math.random() - 0.5) * 0.04,
                y: -(Math.random() * 0.06 + 0.02),
                z: (Math.random() - 0.5) * 0.04
            });
        }

        petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
        const petalMaterial = new THREE.PointsMaterial({
            size: 1.25,
            color: 0xff75a0,
            transparent: true,
            opacity: 0.85,
            map: particleTexture,
            blending: THREE.AdditiveBlending
        });

        const petalPoints = new THREE.Points(petalGeometry, petalMaterial);
        scene.add(petalPoints);

        // 3D Moon Mesh
        const moonGeo = new THREE.SphereGeometry(3.6, 32, 32);
        const moonMat = new THREE.MeshBasicMaterial({
            color: 0xfff6d5,
            transparent: true,
            opacity: 0.85
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(18, 14, -15);
        scene.add(moonMesh);

        // Mouse Parallax Camera Lerp
        let targetCamX = 0;
        let targetCamY = 0;
        let camX = 0;
        let camY = 0;

        window.addEventListener('mousemove', (e) => {
            targetCamX = (e.clientX / window.innerWidth - 0.5) * 4;
            targetCamY = -(e.clientY / window.innerHeight - 0.5) * 4;
        });

        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            heartPoints.rotation.y = elapsedTime * 0.22;
            heartPoints.rotation.x = Math.sin(elapsedTime * 0.18) * 0.12;
            
            const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.05;
            heartPoints.scale.set(pulse, pulse, pulse);

            starPoints.rotation.y = elapsedTime * 0.025;
            starMaterial.opacity = 0.6 + Math.sin(elapsedTime * 3) * 0.15;

            const pPositions = petalGeometry.attributes.position.array;
            for (let i = 0; i < petalCount; i++) {
                pPositions[i * 3] += petalVelocities[i].x + Math.sin(elapsedTime + i) * 0.01;
                pPositions[i * 3 + 1] += petalVelocities[i].y;
                pPositions[i * 3 + 2] += petalVelocities[i].z;

                if (pPositions[i * 3 + 1] < -30) {
                    pPositions[i * 3 + 1] = 30;
                    pPositions[i * 3] = (Math.random() - 0.5) * 60;
                }
            }
            petalGeometry.attributes.position.needsUpdate = true;

            moonMesh.position.y = 14 + Math.sin(elapsedTime * 0.5) * 0.8;

            camX += (targetCamX - camX) * 0.05;
            camY += (targetCamY - camY) * 0.05;

            camera.position.x = camX;
            camera.position.y = camY;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ----------------------------------------------------------------------
    // 5. PREMIERE GSAP TIMELINES WITH CUSTOM EASING & STAGGER
    // ----------------------------------------------------------------------
    gsap.from('.hero-content > *', {
        duration: 1.4,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
    });

    gsap.from('#quote .quote-card', {
        scrollTrigger: {
            trigger: '#quote',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        duration: 1.3,
        y: 60,
        opacity: 0,
        scale: 0.94,
        ease: 'back.out(1.4)'
    });

    gsap.to('#timeline-progress', {
        scrollTrigger: {
            trigger: '#timeline',
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 0.5
        },
        height: '100%',
        ease: 'none'
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
        const isRight = item.classList.contains('right');
        gsap.from(item.querySelector('.timeline-content'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 1.1,
            x: isRight ? 70 : -70,
            opacity: 0,
            ease: 'power4.out'
        });
    });

    gsap.from('.envelope-wrapper', {
        scrollTrigger: {
            trigger: '#letter',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        duration: 1.3,
        y: 70,
        opacity: 0,
        ease: 'expo.out'
    });

    gsap.from('.gallery-card', {
        scrollTrigger: {
            trigger: '#gallery',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        duration: 1.1,
        y: 60,
        opacity: 0,
        stagger: 0.12,
        ease: 'power3.out'
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: '#surprise',
            start: 'top 65%',
            toggleActions: 'play none none reverse'
        }
    })
    .to('#surprise-text-1', { duration: 1.1, opacity: 1, y: 0, ease: 'power4.out' })
    .to('#surprise-text-2', { duration: 1.3, opacity: 1, y: 0, ease: 'back.out(1.4)' }, '-=0.6')
    .to('.surprise-subtext', { duration: 1.1, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.6')
    .to('.final-actions', { duration: 1.1, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.6');

    // ----------------------------------------------------------------------
    // 6. LOVE LETTER TYPEWRITER WITH GLOWING INK TIP DOT
    // ----------------------------------------------------------------------
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const typewriterElement = document.getElementById('typewriter-text');
    const inkTip = document.getElementById('ink-tip');
    let hasTyped = false;

    const loveLetterText = `Dearest Kamya,\n\nFrom the moment you entered my life, every day has felt brighter and more beautiful. Your laughter brings warmth to my world, and your gentle soul inspires me endlessly.\n\nThank you for being my best friend, my guiding star, and my favorite person. Celebrating you today is just a small token of how deeply you are loved every single day.\n\nHappy Girlfriend Day, my love!`;

    if (envelope && envelopeWrapper) {
        envelope.addEventListener('click', () => {
            envelopeWrapper.classList.toggle('open');
            
            if (envelopeWrapper.classList.contains('open') && !hasTyped) {
                hasTyped = true;
                if (inkTip) inkTip.classList.add('active');
                typewriterEffect(typewriterElement, loveLetterText, 32, () => {
                    if (inkTip) inkTip.classList.remove('active');
                });
            }
        });
    }

    function typewriterEffect(element, text, speed, onComplete) {
        if (!element) return;
        element.innerHTML = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                const char = text.charAt(index);
                if (char === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += char;
                }
                index++;
                setTimeout(type, speed);
            } else if (onComplete) {
                onComplete();
            }
        }
        type();
    }

    // ----------------------------------------------------------------------
    // 7. PHOTO GALLERY LIGHTBOX MODAL
    // ----------------------------------------------------------------------
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const photoList = [
        { src: 'assets/images/kamya_5.jpg', caption: 'Pure Elegance' },
        { src: 'assets/images/kamya_6.jpg', caption: 'Radiant Smile' },
        { src: 'assets/images/kamya_7.jpg', caption: 'Subtle Charm' },
        { src: 'assets/images/kamya_8.jpg', caption: 'Coffee & Sunshine' },
        { src: 'assets/images/kamya_9.jpg', caption: 'Precious Moments' },
        { src: 'assets/images/kamya_10.jpg', caption: 'Unmatched Grace' },
        { src: 'assets/images/kamya_11.jpg', caption: 'Golden Glow' },
        { src: 'assets/images/kamya_12.jpg', caption: 'Endless Warmth' }
    ];

    let currentPhotoIndex = 0;

    function openLightbox(index) {
        currentPhotoIndex = index;
        const photo = photoList[currentPhotoIndex];
        if (photo && lightboxImg && lightboxCaption) {
            lightboxImg.src = photo.src;
            lightboxCaption.textContent = photo.caption;
            lightbox.classList.add('active');
            gsap.fromTo(lightboxImg, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
        }
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
    }

    galleryCards.forEach((card) => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-index'), 10) || 0;
            openLightbox(idx);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex - 1 + photoList.length) % photoList.length;
            openLightbox(currentPhotoIndex);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
            openLightbox(currentPhotoIndex);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ----------------------------------------------------------------------
    // 8. INTERACTIVE HEART CANVAS PHYSICS
    // ----------------------------------------------------------------------
    const heartCanvas = document.getElementById('interactive-heart-canvas');
    if (heartCanvas) {
        const ctx = heartCanvas.getContext('2d');
        let width = heartCanvas.width = heartCanvas.offsetWidth;
        let height = heartCanvas.height = heartCanvas.offsetHeight;

        window.addEventListener('resize', () => {
            if (heartCanvas.offsetWidth > 0) {
                width = heartCanvas.width = heartCanvas.offsetWidth;
                height = heartCanvas.height = heartCanvas.offsetHeight;
            }
        });

        const hearts = [];
        const heartCount = 40;

        class Heart {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 50;
                this.size = Math.random() * 14 + 10;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = -(Math.random() * 1.2 + 0.8);
                this.alpha = Math.random() * 0.6 + 0.4;
                this.color = Math.random() > 0.4 ? '#ff4d8d' : (Math.random() > 0.5 ? '#c084fc' : '#ffd700');
                this.angle = Math.random() * Math.PI * 2;
                this.angularVelocity = (Math.random() - 0.5) * 0.03;
            }

            update(mouseX, mouseY) {
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.angularVelocity;

                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 100;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    this.x += (dx / dist) * force * 5;
                    this.y += (dy / dist) * force * 5;
                }

                if (this.y < -30) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;

                ctx.beginPath();
                const topCurveHeight = this.size * 0.3;
                ctx.moveTo(0, topCurveHeight);
                ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
                ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
                ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
                ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < heartCount; i++) {
            hearts.push(new Heart());
        }

        const burstParticles = [];

        class BurstParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = Math.random() * 6 + 3;
                this.alpha = 1;
                this.color = ['#ff4d8d', '#ffd700', '#c084fc', '#ffffff'][Math.floor(Math.random() * 4)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.08;
                this.alpha -= 0.02;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        let canvasMouseX = -1000;
        let canvasMouseY = -1000;

        heartCanvas.addEventListener('mousemove', (e) => {
            const rect = heartCanvas.getBoundingClientRect();
            canvasMouseX = e.clientX - rect.left;
            canvasMouseY = e.clientY - rect.top;
        });

        heartCanvas.addEventListener('mouseleave', () => {
            canvasMouseX = -1000;
            canvasMouseY = -1000;
        });

        heartCanvas.addEventListener('click', (e) => {
            const rect = heartCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            for (let i = 0; i < 26; i++) {
                burstParticles.push(new BurstParticle(clickX, clickY));
            }
        });

        function renderHeartCanvas() {
            requestAnimationFrame(renderHeartCanvas);
            ctx.clearRect(0, 0, width, height);

            hearts.forEach((h) => {
                h.update(canvasMouseX, canvasMouseY);
                h.draw();
            });

            for (let i = burstParticles.length - 1; i >= 0; i--) {
                const p = burstParticles[i];
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    burstParticles.splice(i, 1);
                }
            }
        }
        renderHeartCanvas();
    }

    // ----------------------------------------------------------------------
    // 9. FLOATING VINYL MUSIC PLAYER (Web Audio API Synthesizer)
    // ----------------------------------------------------------------------
    const vinylBtn = document.getElementById('vinyl-btn');
    const musicStatusText = document.getElementById('music-status-text');
    const musicProgressCircle = document.getElementById('music-progress-circle');
    let isPlaying = false;
    let audioCtx = null;
    let musicInterval = null;
    let playTimer = 0;

    if (vinylBtn) {
        vinylBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                vinylBtn.classList.add('playing');
                if (musicStatusText) musicStatusText.textContent = "Playing Romantic Melody ❤️";
                startAmbientMelody();
            } else {
                vinylBtn.classList.remove('playing');
                if (musicStatusText) musicStatusText.textContent = "Click vinyl to play";
                stopAmbientMelody();
            }
        });
    }

    function startAmbientMelody() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const chordNotes = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [196.00, 246.94, 293.66, 349.23]  // G7
        ];

        let chordIndex = 0;

        function playChord() {
            if (!isPlaying || !audioCtx) return;
            const now = audioCtx.currentTime;
            const notes = chordNotes[chordIndex];
            chordIndex = (chordIndex + 1) % chordNotes.length;

            notes.forEach((freq) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.03, now + 0.8);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now);
                osc.stop(now + 4.0);
            });

            // Update SVG Progress Ring
            playTimer = (playTimer + 1) % 100;
            if (musicProgressCircle) {
                const offset = 157 - (157 * (playTimer / 100));
                musicProgressCircle.style.strokeDashoffset = `${offset}`;
            }
        }

        playChord();
        musicInterval = setInterval(playChord, 3600);
    }

    function stopAmbientMelody() {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
        if (musicProgressCircle) {
            musicProgressCircle.style.strokeDashoffset = '157';
        }
    }
});
