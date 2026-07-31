import os

BASE_DIR = r"c:\Users\karti\Downloads\gf day"

# Helper for shared Dock Navigation
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
            <span class="music-status" id="music-status-text">Click vinyl to play</span>
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

        const light = new THREE.PointLight(0xffd700, 2, 100);
        light.position.set(10, 10, 10);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        function animate() {{
            requestAnimationFrame(animate);
            heartMesh.rotation.y += 0.015;
            heartMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
            renderer.render(scene, camera);
        }}
        animate();
    }}
    </script>
</body>
</html>
"""

# 2. GALLERY.HTML
html_pages['gallery.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Gallery — Floating Art Museum | Kamya ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/transitions.css">
    <style>
        .gallery-grid {{ max-width: 1200px; margin: 40px auto 100px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; padding: 0 20px; }}
        .gallery-item {{ height: 380px; border-radius: var(--radius-md); overflow: hidden; position: relative; cursor: pointer; }}
        .gallery-item img {{ width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }}
        .gallery-item:hover img {{ transform: scale(1.1); }}
        .gallery-caption {{ position: absolute; bottom: 0; inset-x: 0; padding: 22px; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent-gold); }}
    </style>
</head>
<body class="theme-museum">
    <canvas id="webgl-canvas"></canvas>
    <div class="ambient-glow glow-2"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='active', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    {MUSIC_DOCK.format(theme_name='Art Museum Theme')}

    <main class="page-hero">
        <div class="sparkle-badge" style="color:var(--accent-gold); border-color:var(--accent-gold);"><i class="fa-solid fa-landmark"></i> Floating Art Museum</div>
        <h1 class="page-title">Gallery of Grace</h1>
        <p class="page-subtitle">Precious portraits of Kamya displayed in luxury gold museum frames.</p>
    </main>

    <section class="gallery-grid">
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_5.jpg" alt="Kamya 5"><div class="gallery-caption">Pure Elegance</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_6.jpg" alt="Kamya 6"><div class="gallery-caption">Radiant Smile</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_7.jpg" alt="Kamya 7"><div class="gallery-caption">Subtle Charm</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_8.jpg" alt="Kamya 8"><div class="gallery-caption">Coffee & Sunshine</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_9.jpg" alt="Kamya 9"><div class="gallery-caption">Precious Moments</div></div>
        <div class="glass-card gallery-item museum-frame tilt-card"><img src="assets/images/kamya_10.jpg" alt="Kamya 10"><div class="gallery-caption">Unmatched Grace</div></div>
    </section>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="letters.html" class="btn-primary"><span>Visit Love Letters</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Museum Realm')}
</body>
</html>
"""

# Write files
for fname, content in html_pages.items():
    with open(os.path.join(BASE_DIR, fname), 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Generated {len(html_pages)} HTML files successfully!")
