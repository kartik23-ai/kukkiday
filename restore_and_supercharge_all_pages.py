import os

BASE_DIR = r"c:\Users\karti\Downloads\gf day"

NAV_DOCK = """
    <nav class="realm-nav-dock">
        <a href="index.html" class="realm-link {active_index}"><i class="fa-solid fa-house"></i> Home</a>
        <a href="story.html" class="realm-link {active_story}"><i class="fa-solid fa-book-bookmark"></i> Story</a>
        <a href="gallery.html" class="realm-link {active_gallery}"><i class="fa-solid fa-images"></i> Gallery</a>
        <a href="letters.html" class="realm-link {active_letters}"><i class="fa-solid fa-envelope-open-text"></i> Letters</a>
        <a href="garden.html" class="realm-link {active_garden}"><i class="fa-solid fa-seedling"></i> Garden</a>
        <a href="music.html" class="realm-link {active_music}"><i class="fa-solid fa-compact-disc"></i> Music</a>
        <a href="album.html" class="realm-link {active_album}"><i class="fa-solid fa-book-open"></i> Album</a>
        <a href="dreams.html" class="realm-link {active_dreams}"><i class="fa-solid fa-cloud-moon"></i> Dreams</a>
        <a href="wishes.html" class="realm-link {active_wishes}"><i class="fa-solid fa-wand-magic-sparkles"></i> Wishes</a>
        <a href="surprise.html" class="realm-link {active_surprise}"><i class="fa-solid fa-gift"></i> Surprise</a>
        <a href="credits.html" class="realm-link {active_credits}"><i class="fa-solid fa-heart"></i> Credits</a>
    </nav>
"""

MUSIC_DOCK = """
    <div class="music-player-container">
        <div class="vinyl-wrapper" id="vinyl-btn">
            <div class="vinyl-record"><div class="vinyl-label"><i class="fa-solid fa-heart"></i></div></div>
        </div>
        <div class="music-info">
            <span class="music-title">{theme_name}</span>
            <span class="music-status" id="music-status-text">Click vinyl to play soundtrack</span>
        </div>
    </div>
"""

SCRIPTS_FOOTER = """
    <footer class="footer">Made with ❤️ for <strong>Kamya</strong> • {realm_name}</footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
    <script src="js/transitions.js"></script>
    <script src="js/cursor.js"></script>
    <script src="js/audio.js"></script>
    <script src="js/main.js"></script>
"""

html_pages = {}

# 1. INDEX.HTML
html_pages['index.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home — Cosmic Romance | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
</head>
<body class="theme-cosmic">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>
    <div class="fog-overlay"></div>

    {NAV_DOCK.format(active_index='active', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Cosmic Romance Theme')}

    <main class="page-hero">
        <div class="sparkle-badge"><i class="fa-solid fa-sparkles"></i> Cosmic Romance Realm</div>
        <h1 class="page-title">Happy Girlfriend Day <span style="color:#ff4d8d;">❤️</span></h1>
        <p class="page-subtitle">For Kamya — Welcome to your magical romantic universe.</p>
        <a href="story.html" class="btn-primary">
            <span>Begin Journey</span>
            <i class="fa-solid fa-compass"></i>
        </a>
    </main>

    {SCRIPTS_FOOTER.format(realm_name='Cosmic Romance Realm')}

    <script>
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {{
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({{ canvas, alpha: true, antialias: true }});
        renderer.setSize(window.innerWidth, window.innerHeight);

        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 2.5, y + 2.5);
        heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1, y + 7.7, x + 2.5, y + 9.5);
        heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 5.5, x + 8, y + 3.5);
        heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        const extrudeSettings = {{ depth: 1.5, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 }};
        const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        heartGeo.center();

        const heartMat = new THREE.MeshPhongMaterial({{ color: 0xff4d8d, emissive: 0x9d4edd, shininess: 100 }});
        const heartMesh = new THREE.Mesh(heartGeo, heartMat);
        scene.add(heartMesh);

        const light1 = new THREE.PointLight(0xffd700, 2, 100);
        light1.position.set(15, 15, 15);
        scene.add(light1);

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        function animate() {{
            requestAnimationFrame(animate);
            heartMesh.rotation.y += 0.015;
            heartMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.25;
            renderer.render(scene, camera);
        }}
        animate();
    }}
    </script>
</body>
</html>
"""

# 2. STORY.HTML
html_pages['story.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Story — Warm Golden Memories | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .story-timeline {{ max-width: 950px; margin: 60px auto 100px auto; position: relative; padding: 0 20px; }}
        .story-card {{ display: flex; gap: 30px; margin-bottom: 50px; padding: 32px; align-items: center; border-radius: var(--radius-md); }}
        .story-card img {{ width: 250px; height: 180px; object-fit: cover; border-radius: var(--radius-sm); border: 2px solid rgba(255,215,0,0.5); box-shadow: 0 15px 35px rgba(0,0,0,0.6); }}
        .story-info h3 {{ font-family: var(--font-heading); font-size: 2.3rem; color: #fff; margin-bottom: 12px; }}
        .story-info p {{ color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; }}
    </style>
</head>
<body class="theme-golden">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-1" style="background: radial-gradient(circle, #ffd700, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='active', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Warm Golden Memories Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-gold); border-color:var(--accent-gold);"><i class="fa-solid fa-star"></i> Warm Golden Memories</div>
        <h1 class="page-title">Our Constellation Story</h1>
        <p class="page-subtitle">Every milestone with you, Kamya, shines like a constellation in my sky.</p>
    </main>

    <section class="story-timeline">
        <div class="glass-card story-card tilt-card">
            <img src="assets/images/kamya_1.jpg" alt="Chapter 1">
            <div class="story-info">
                <span style="color:var(--accent-gold); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Chapter 01</span>
                <h3>The First Spark</h3>
                <p>From the moment we connected, every conversation filled my life with joy. Your warmth lit up my world instantly.</p>
            </div>
        </div>

        <div class="glass-card story-card tilt-card">
            <img src="assets/images/kamya_2.jpg" alt="Chapter 2">
            <div class="story-info">
                <span style="color:var(--accent-gold); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Chapter 02</span>
                <h3>Endless Conversations</h3>
                <p>Late night laughter and shared secrets. Time flies so fast whenever I am talking to you.</p>
            </div>
        </div>

        <div class="glass-card story-card tilt-card">
            <img src="assets/images/kamya_3.jpg" alt="Chapter 3">
            <div class="story-info">
                <span style="color:var(--accent-gold); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Chapter 03</span>
                <h3>Unmatched Radiance</h3>
                <p>Capturing your grace in every moment. You look stunning effortlessly, inside and out.</p>
            </div>
        </div>

        <div class="glass-card story-card tilt-card">
            <img src="assets/images/kamya_4.jpg" alt="Chapter 4">
            <div class="story-info">
                <span style="color:var(--accent-gold); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Chapter 04</span>
                <h3>Golden Evening Walks</h3>
                <p>Watching sunsets together. Hand in hand, every quiet moment feels completely peaceful.</p>
            </div>
        </div>
    </section>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="gallery.html" class="btn-primary"><span>Continue to Gallery</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Golden Memories Realm')}
</body>
</html>
"""

# 3. GALLERY.HTML
html_pages['gallery.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Gallery — Floating Air Museum | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .gallery-grid {{ max-width: 1250px; margin: 40px auto 100px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 36px; padding: 0 20px; }}
        .gallery-item {{ height: 400px; border-radius: var(--radius-md); overflow: hidden; position: relative; cursor: pointer; }}
        .gallery-item img {{ width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }}
        .gallery-item:hover img {{ transform: scale(1.1); }}
        .gallery-caption {{ position: absolute; bottom: 0; inset-x: 0; padding: 24px; background: linear-gradient(to top, rgba(0,0,0,0.88), transparent); font-family: var(--font-heading); font-size: 1.6rem; color: var(--accent-gold); }}
    </style>
</head>
<body class="theme-museum">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-2"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='active', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Art Museum Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-gold); border-color:var(--accent-gold);"><i class="fa-solid fa-landmark"></i> Floating Air Museum</div>
        <h1 class="page-title">Gallery of Grace</h1>
        <p class="page-subtitle">Precious portraits of Kamya displayed in gold museum frames.</p>
    </main>

    <section class="gallery-grid">
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_5.jpg" alt="Kamya 5"><div class="gallery-caption">Pure Elegance</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_6.jpg" alt="Kamya 6"><div class="gallery-caption">Radiant Smile</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_7.jpg" alt="Kamya 7"><div class="gallery-caption">Subtle Charm</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_8.jpg" alt="Kamya 8"><div class="gallery-caption">Coffee & Sunshine</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_9.jpg" alt="Kamya 9"><div class="gallery-caption">Precious Moments</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_10.jpg" alt="Kamya 10"><div class="gallery-caption">Unmatched Grace</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_11.jpg" alt="Kamya 11"><div class="gallery-caption">Timeless Beauty</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_12.jpg" alt="Kamya 12"><div class="gallery-caption">Gentle Eyes</div></div>
    </section>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="letters.html" class="btn-primary"><span>Visit Love Letters</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Museum Realm')}
</body>
</html>
"""

# 4. LETTERS.HTML
html_pages['letters.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Love Letters — Vintage Candlelight | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .letter-container {{ max-width: 680px; margin: 40px auto 100px auto; position: relative; padding: 0 20px; }}
        .envelope {{ width: 100%; height: 380px; background: linear-gradient(145deg, #2c1220, #14050c); border: 1px solid rgba(255,140,66,0.35); border-radius: var(--radius-md); position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; }}
        .envelope-flap {{ position: absolute; top: 0; left: 0; width: 0; height: 0; border-left: 320px solid transparent; border-right: 320px solid transparent; border-top: 180px solid #3c182c; transform-origin: top; transition: transform 0.8s ease; z-index: 4; }}
        .wax-seal {{ width: 90px; height: 90px; border-radius: 50%; background: radial-gradient(circle, #ff4d8d, #ff8c42); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; z-index: 5; box-shadow: 0 0 25px rgba(255,140,66,0.6); }}
        .letter-paper {{ position: absolute; top: 0; left: 4%; width: 92%; background: #faf6f0; color: #2c1810; padding: 40px; border-radius: var(--radius-sm); opacity: 0; transform: translateY(60px); transition: all 0.8s ease; z-index: 10; pointer-events: none; }}
        .letter-container.open .envelope-flap {{ transform: rotateX(180deg); }}
        .letter-container.open .wax-seal {{ opacity: 0; }}
        .letter-container.open .letter-paper {{ opacity: 1; transform: translateY(-80px); pointer-events: auto; }}
        .letter-salutation {{ font-family: var(--font-heading); font-size: 2rem; color: #8b0032; font-weight: 700; margin-bottom: 16px; }}
        .letter-body {{ font-family: var(--font-heading); font-size: 1.25rem; line-height: 1.8; color: #3a2219; min-height: 180px; }}
    </style>
</head>
<body class="theme-candlelight">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-3" style="background: radial-gradient(circle, #ff8c42, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='active', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Vintage Candlelight Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:#ff8c42; border-color:#ff8c42;"><i class="fa-solid fa-fire"></i> Vintage Candlelight Sanctuary</div>
        <h1 class="page-title">A Special Love Letter</h1>
        <p class="page-subtitle">Click the wax seal below to unseal my heart for you, Kamya.</p>
    </main>

    <div class="letter-container" id="letter-box">
        <div class="envelope" id="env">
            <div class="envelope-flap"></div>
            <div class="wax-seal"><i class="fa-solid fa-heart"></i><span>Open</span></div>
        </div>
        <div class="letter-paper">
            <span class="letter-salutation">My Dearest Kamya,</span>
            <div class="letter-body" id="typing-box"></div>
            <div style="text-align:right; margin-top:20px; font-family:var(--font-handwriting); font-size:2.2rem; color:#8b0032;">Forever Yours ❤️</div>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="garden.html" class="btn-primary"><span>Enter Dream Garden</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Letter Sanctuary')}

    <script>
    const box = document.getElementById('letter-box');
    const env = document.getElementById('env');
    const typingBox = document.getElementById('typing-box');
    let typed = false;

    const text = "From the moment you entered my life, every single day has felt brighter. Your laughter brings light to my world, and your kind soul inspires me constantly. Thank you for being my best friend and my favorite person. Happy Girlfriend Day, Kamya!";

    env.addEventListener('click', () => {{
        box.classList.toggle('open');
        if (box.classList.contains('open') && !typed) {{
            typed = true;
            let idx = 0;
            function type() {{
                if (idx < text.length) {{
                    typingBox.innerHTML += text.charAt(idx);
                    idx++;
                    setTimeout(type, 35);
                }}
            }}
            type();
        }}
    }});
    </script>
</body>
</html>
"""

# 5. GARDEN.HTML
html_pages['garden.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dream Garden — Magical Spring Sunset | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .garden-container {{ max-width: 900px; margin: 40px auto 100px auto; padding: 44px; text-align: center; background: rgba(30,12,38,0.6); backdrop-filter: blur(20px); border-radius: var(--radius-lg); border: 1px solid rgba(255,140,66,0.3); }}
        .garden-card-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 40px; }}
        .flower-card {{ padding: 30px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.12); }}
        .flower-card i {{ font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 16px; }}
        .flower-card h3 {{ font-family: var(--font-heading); font-size: 1.6rem; color: #fff; margin-bottom: 8px; }}
    </style>
</head>
<body class="theme-garden">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-1" style="background: radial-gradient(circle, #ff75a0, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='active', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Magical Spring Sunset Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-gold); border-color:var(--accent-gold);"><i class="fa-solid fa-sun"></i> Magical Spring Sunset</div>
        <h1 class="page-title">Dream Garden</h1>
        <p class="page-subtitle">A place of blooming flowers, drifting petals, and endless peace for Kamya.</p>
    </main>

    <div class="garden-container glass-card">
        <h2 style="font-family:var(--font-heading); font-size:2.4rem; color:var(--accent-gold);">Blooms of Affection</h2>
        <p style="color:var(--text-muted); font-size:1.1rem; max-width:600px; margin:12px auto 0 auto;">Like flowers in a gentle spring wind, every moment with you blossoms into joy.</p>
        
        <div class="garden-card-grid">
            <div class="flower-card">
                <i class="fa-solid fa-spa"></i>
                <h3>Peace & Serenity</h3>
                <p style="color:var(--text-dim); font-size:0.9rem;">Your presence brings a calm that makes everything feel right.</p>
            </div>
            <div class="flower-card">
                <i class="fa-solid fa-sun-plant-wilt"></i>
                <h3>Warmth & Sunlight</h3>
                <p style="color:var(--text-dim); font-size:0.9rem;">Your smile brightens the cloudiest of days effortlessly.</p>
            </div>
            <div class="flower-card">
                <i class="fa-solid fa-clover"></i>
                <h3>Endless Grace</h3>
                <p style="color:var(--text-dim); font-size:0.9rem;">A beauty that blooms brighter with every passing day.</p>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="music.html" class="btn-primary"><span>Enter Music Room</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Garden Realm')}
</body>
</html>
"""

# 6. MUSIC.HTML
html_pages['music.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Music Room — Dreamy Night Lounge | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .music-room-box {{ max-width: 700px; margin: 40px auto 100px auto; padding: 60px; text-align: center; }}
        .big-vinyl {{ width: 190px; height: 190px; border-radius: 50%; background: radial-gradient(circle, #252525 25%, #050505 60%, #151515 100%); border: 4px solid #d4af37; margin: 0 auto 32px auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.5); cursor: pointer; }}
        .big-vinyl.playing {{ animation: spin 4s linear infinite; }}
        .big-label {{ width: 64px; height: 64px; border-radius: 50%; background: var(--primary-pink); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.6rem; }}
    </style>
</head>
<body class="theme-lounge">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-2"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='active', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Dreamy Night Lounge Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-gold); border-color:var(--accent-gold);"><i class="fa-solid fa-music"></i> Dreamy Night Lounge</div>
        <h1 class="page-title">Music Room</h1>
        <p class="page-subtitle">A melody woven for Kamya. Click the gold-foil vinyl record to play our song.</p>
    </main>

    <div class="glass-card music-room-box tilt-card">
        <div class="big-vinyl" id="big-vinyl-btn">
            <div class="big-label"><i class="fa-solid fa-heart"></i></div>
        </div>
        <h2 style="font-family:var(--font-heading); font-size:2.2rem; color:#fff; margin-bottom:12px;" id="music-room-status">Click Record to Play Melody</h2>
        <p style="color:var(--text-muted); font-size:1.05rem;">Synthesized ambient warmth composed specially for Girlfriend Day.</p>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="album.html" class="btn-primary"><span>Open Photo Album</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Music Realm')}

    <script>
    const bigVinyl = document.getElementById('big-vinyl-btn');
    const statusText = document.getElementById('music-room-status');
    const vinylBtn = document.getElementById('vinyl-btn');

    bigVinyl.addEventListener('click', () => {{
        if (vinylBtn) vinylBtn.click();
        bigVinyl.classList.toggle('playing');
        if (bigVinyl.classList.contains('playing')) {{
            statusText.textContent = "Now Playing: Celestial Serenade ❤️";
        }} else {{
            statusText.textContent = "Click Record to Play Melody";
        }}
    }});
    </script>
</body>
</html>
"""

# 7. ALBUM.HTML (With Photos of Kamya 13, 14, 15, 16)
html_pages['album.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Photo Album — Luxury Scrapbook | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .album-book {{ max-width: 820px; height: 460px; margin: 40px auto 100px auto; background: #faf6f0; border-radius: var(--radius-md); box-shadow: 0 30px 60px rgba(0,0,0,0.7); display: flex; overflow: hidden; position: relative; border: 4px solid #8b0032; }}
        .album-page-left, .album-page-right {{ width: 50%; padding: 40px; color: #2c1810; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }}
        .album-page-left {{ border-right: 2px dashed rgba(0,0,0,0.15); background: #f5efe6; }}
        .album-page-left img {{ width: 90%; height: 270px; object-fit: cover; border-radius: var(--radius-sm); border: 4px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }}
        .album-page-right h3 {{ font-family: var(--font-heading); font-size: 2.2rem; color: #8b0032; margin-bottom: 16px; }}
        .album-page-right p {{ font-family: var(--font-heading); font-size: 1.2rem; line-height: 1.7; color: #3a2219; }}
        .album-controls {{ display: flex; gap: 16px; justify-content: center; margin-top: 24px; }}
        .btn-secondary {{ padding: 10px 22px; background: #8b0032; color: #fff; border: none; border-radius: var(--radius-full); cursor: pointer; font-weight:600; }}
    </style>
</head>
<body class="theme-album">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-3"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='active', active_dreams='', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Luxury Scrapbook Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:#d4af37; border-color:#d4af37;"><i class="fa-solid fa-book-journal-whills"></i> Luxury Scrapbook Realm</div>
        <h1 class="page-title">Page-Flip Memories</h1>
        <p class="page-subtitle">Turn the pages to relive our timeless moments, Kamya.</p>
    </main>

    <div class="album-book" id="album-book">
        <div class="album-page-left">
            <img src="assets/images/kamya_13.jpg" id="album-img" alt="Album Page">
        </div>
        <div class="album-page-right">
            <h3 id="album-title">Pure Elegance</h3>
            <p id="album-desc">A snapshot of timeless grace that fills my heart with joy every single time I look at it.</p>
            <div class="album-controls">
                <button class="btn-secondary" id="album-prev"><i class="fa-solid fa-chevron-left"></i> Prev</button>
                <button class="btn-secondary" id="album-next">Next <i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="dreams.html" class="btn-primary"><span>Explore Future Dreams</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Album Realm')}

    <script>
    const pages = [
        {{ img: 'assets/images/kamya_13.jpg', title: 'Pure Elegance', desc: 'A snapshot of timeless grace that fills my heart with joy every single time.' }},
        {{ img: 'assets/images/kamya_14.jpg', title: 'Golden Glow', desc: 'Warmth and laughter captured forever under the soft golden light.' }},
        {{ img: 'assets/images/kamya_15.jpg', title: 'Unmatched Charm', desc: 'Your gentle smile is my absolute favorite sight in the world.' }},
        {{ img: 'assets/images/kamya_16.jpg', title: 'Precious Moments', desc: 'Creating unforgettable memories together day after day.' }}
    ];

    let current = 0;
    const albumImg = document.getElementById('album-img');
    const albumTitle = document.getElementById('album-title');
    const albumDesc = document.getElementById('album-desc');

    document.getElementById('album-next').addEventListener('click', () => {{
        current = (current + 1) % pages.length;
        updateAlbum();
    }});

    document.getElementById('album-prev').addEventListener('click', () => {{
        current = (current - 1 + pages.length) % pages.length;
        updateAlbum();
    }});

    function updateAlbum() {{
        gsap.to('#album-book', {{ opacity: 0.5, duration: 0.2, onComplete: () => {{
            albumImg.src = pages[current].img;
            albumTitle.textContent = pages[current].title;
            albumDesc.textContent = pages[current].desc;
            gsap.to('#album-book', {{ opacity: 1, duration: 0.3 }});
        }}}});
    }}
    </script>
</body>
</html>
"""

# 8. DREAMS.HTML
html_pages['dreams.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Future Dreams — Cosmic Future | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .dreams-grid {{ max-width: 1000px; margin: 40px auto 100px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; padding: 0 20px; }}
        .dream-card {{ padding: 32px; text-align: center; border-radius: var(--radius-md); background: rgba(18,9,36,0.6); border: 1px solid rgba(192,132,252,0.3); }}
        .dream-card i {{ font-size: 2.2rem; color: var(--accent-lavender); margin-bottom: 16px; }}
        .dream-card h3 {{ font-family: var(--font-heading); font-size: 1.8rem; color: #fff; margin-bottom: 8px; }}
        .dream-card p {{ color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }}
    </style>
</head>
<body class="theme-future">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-1"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='active', active_wishes='', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Cosmic Future Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-lavender); border-color:var(--accent-lavender);"><i class="fa-solid fa-moon"></i> Cosmic Future Realm</div>
        <h1 class="page-title">Future Dreams</h1>
        <p class="page-subtitle">A universe of promises written across the starlit sky for Kamya.</p>
    </main>

    <div class="dreams-grid">
        <div class="glass-card dream-card tilt-card">
            <i class="fa-solid fa-plane-departure"></i>
            <h3>Endless Travels</h3>
            <p>Exploring cozy coffee shops, sunsets by the beach, and historic streets hand in hand.</p>
        </div>
        <div class="glass-card dream-card tilt-card">
            <i class="fa-solid fa-house-chimney-heart"></i>
            <h3>Our Sanctuary</h3>
            <p>Building a warm, peaceful space filled with laughter, music, and quiet late nights.</p>
        </div>
        <div class="glass-card dream-card tilt-card">
            <i class="fa-solid fa-infinity"></i>
            <h3>Forever Together</h3>
            <p>Supporting each other’s wild dreams, celebrating every win, and growing closer every day.</p>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="wishes.html" class="btn-primary"><span>Visit Wish Wall</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Dreams Realm')}
</body>
</html>
"""

# 9. WISHES.HTML
html_pages['wishes.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wish Wall — Lantern Festival | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .lantern-container {{ position: relative; width: 100%; height: 500px; max-width: 900px; margin: 20px auto 100px auto; background: rgba(10,5,25,0.6); border-radius: var(--radius-lg); border: 1px solid rgba(255,215,0,0.3); overflow: hidden; }}
        .lantern {{ position: absolute; width: 44px; height: 58px; background: radial-gradient(circle, #ffd700, #ff75a0); border-radius: 8px 8px 14px 14px; box-shadow: 0 0 20px #ffd700, 0 0 40px #ff4d8d; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; transition: transform 0.3s ease; }}
        .lantern:hover {{ transform: scale(1.2); }}
    </style>
</head>
<body class="theme-lanterns">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-2"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='active', active_surprise='', active_credits='')}
    {MUSIC_DOCK.format(theme_name='Lantern Festival Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-gold); border-color:var(--accent-gold);"><i class="fa-solid fa-fire-flame-curved"></i> Lantern Festival Realm</div>
        <h1 class="page-title">Wish Wall</h1>
        <p class="page-subtitle">Click the glowing lanterns to release heartfelt wishes into Kamya's sky.</p>
    </main>

    <div class="lantern-container" id="lantern-box"></div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="surprise.html" class="btn-primary"><span>Unlock Final Surprise</span> <i class="fa-solid fa-gift"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Wish Realm')}

    <script>
    const box = document.getElementById('lantern-box');
    for (let i = 0; i < 15; i++) {{
        const l = document.createElement('div');
        l.className = 'lantern';
        l.style.left = `${{Math.random() * 85 + 5}}%`;
        l.style.top = `${{Math.random() * 70 + 20}}%`;
        l.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        
        l.addEventListener('click', () => {{
            gsap.to(l, {{ y: -500, opacity: 0, duration: 3, ease: 'power2.in' }});
        }});

        box.appendChild(l);
    }}
    </script>
</body>
</html>
"""

# 10. SURPRISE.HTML
html_pages['surprise.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Final Surprise — Infinite Universe | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .surprise-hero {{ min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 100px 24px; position: relative; }}
        .cosmic-ring {{ position: absolute; width: 450px; height: 450px; border-radius: 50%; background: radial-gradient(circle, rgba(255,77,141,0.3), transparent 70%); filter: blur(50px); }}
        .surp-1 {{ font-family: var(--font-heading); font-size: 3.2rem; color: var(--accent-lavender); margin-bottom: 20px; }}
        .surp-2 {{ font-family: var(--font-heading); font-size: 5.2rem; font-weight: 700; background: linear-gradient(135deg, #ffd700, #ff4d8d, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 24px; }}
    </style>
</head>
<body class="theme-infinite">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-1"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='active', active_credits='')}

    <div class="surprise-hero">
        <div class="cosmic-ring"></div>
        <h2 class="surp-1">You are my favorite person.</h2>
        <h1 class="surp-2">Happy Girlfriend Day ❤️ Kamya</h1>
        <p style="color:var(--text-muted); font-size:1.2rem; max-width:650px; margin-bottom:40px;">Thank you for filling my universe with endless light, peace, and warmth.</p>
        <a href="credits.html" class="btn-primary"><span>View Credits & Dedication</span> <i class="fa-solid fa-heart"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Infinite Universe Realm')}
</body>
</html>
"""

# 11. CREDITS.HTML
html_pages['credits.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credits & Dedication | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .credits-card {{ max-width: 700px; margin: 40px auto 100px auto; padding: 60px; text-align: center; }}
    </style>
</head>
<body class="theme-cosmic">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-3"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='active')}

    <main class="page-hero">
        <div class="sparkle-badge"><i class="fa-solid fa-heart"></i> Handcrafted Dedication</div>
        <h1 class="page-title">Created For Kamya</h1>
        <p class="page-subtitle">An interactive universe built with love for Girlfriend Day.</p>
    </main>

    <div class="glass-card credits-card tilt-card">
        <h2 style="font-family:var(--font-heading); font-size:2.4rem; color:var(--accent-gold); margin-bottom:16px;">Dedication</h2>
        <p style="color:var(--text-muted); font-size:1.1rem; line-height:1.7; margin-bottom:32px;">Every single realm, animation, 3D particle, and melody was handcrafted specially for <strong>Kamya</strong>. Thank you for being the highlight of my universe!</p>

        <a href="index.html" class="btn-primary"><span><i class="fa-solid fa-rotate-left"></i> Replay Whole Journey</span></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Girlfriend Day Special')}
</body>
</html>
"""

# Write all 11 HTML pages
for fname, content in html_pages.items():
    with open(os.path.join(BASE_DIR, fname), 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Supercharged all {len(html_pages)} HTML pages successfully!")
