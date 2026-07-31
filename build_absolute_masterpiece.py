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

SHARED_CSS = """
    :root {
        --bg-deep: #05020c;
        --primary-pink: #ff4d8d;
        --primary-rose: #ff75a0;
        --accent-purple: #9d4edd;
        --accent-lavender: #c084fc;
        --accent-gold: #ffd700;
        --text-main: #f8fafc;
        --text-muted: #cbd5e1;
        --font-heading: 'Cormorant Garamond', serif;
        --font-body: 'Plus Jakarta Sans', sans-serif;
        --font-handwriting: 'Great Vibes', cursive;
        --glass-blur: blur(28px);
        --glass-border: 1px solid rgba(255, 255, 255, 0.18);
        --glass-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(255, 77, 141, 0.15);
    }
    body {
        margin: 0;
        padding: 0;
        background-color: var(--bg-deep);
        color: var(--text-main);
        font-family: var(--font-body);
        overflow-x: hidden;
        min-height: 100vh;
        position: relative;
    }
    .ambient-glow {
        position: fixed;
        width: 60vw;
        height: 60vw;
        border-radius: 50%;
        filter: blur(150px);
        pointer-events: none;
        opacity: 0.45;
        z-index: 1;
        animation: floatGlow 14s ease-in-out infinite alternate;
    }
    .glow-left {
        top: -20%; left: -10%;
        background: radial-gradient(circle, #ff4d8d, transparent 70%);
    }
    .glow-right {
        bottom: -20%; right: -10%;
        background: radial-gradient(circle, #9d4edd, transparent 70%);
        animation-delay: -5s;
    }
    @keyframes floatGlow {
        0% { transform: scale(1) translate(0, 0); }
        100% { transform: scale(1.15) translate(50px, -50px); }
    }
    .realm-nav-dock {
        position: fixed;
        top: 24px; left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: rgba(12, 6, 26, 0.82);
        backdrop-filter: var(--glass-blur);
        border: var(--glass-border);
        border-radius: 9999px;
        box-shadow: var(--glass-shadow);
        max-width: 95vw;
        overflow-x: auto;
        scrollbar-width: none;
    }
    .realm-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        border-radius: 9999px;
        white-space: nowrap;
        transition: all 0.3s ease;
    }
    .realm-link:hover, .realm-link.active {
        color: #fff;
        background: rgba(255, 77, 141, 0.25);
        border: 1px solid rgba(255, 77, 141, 0.45);
        box-shadow: 0 0 15px rgba(255, 77, 141, 0.3);
    }
    .glass-card {
        background: rgba(18, 9, 36, 0.65);
        backdrop-filter: var(--glass-blur);
        border: var(--glass-border);
        border-radius: 24px;
        box-shadow: var(--glass-shadow);
        padding: 40px;
        position: relative;
        z-index: 5;
    }
    .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 16px 36px;
        background: linear-gradient(135deg, #ff4d8d 0%, #c084fc 100%);
        color: #fff;
        font-weight: 600;
        text-decoration: none;
        border-radius: 9999px;
        box-shadow: 0 0 20px rgba(255, 77, 141, 0.4);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .btn-primary:hover {
        transform: translateY(-4px);
        box-shadow: 0 0 30px rgba(255, 77, 141, 0.6);
    }
    .page-hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 140px 24px 80px 24px;
        position: relative;
        z-index: 5;
    }
    .page-title {
        font-family: var(--font-heading);
        font-size: 5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ffd700, #ff4d8d, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 16px;
    }
    .page-subtitle {
        font-family: var(--font-handwriting);
        font-size: 2.6rem;
        color: var(--accent-lavender);
        margin-bottom: 36px;
    }
    .footer {
        text-align: center;
        padding: 30px;
        color: var(--text-dim);
        font-size: 0.9rem;
        position: relative;
        z-index: 5;
    }
"""

html_pages = {}

# 1. INDEX.HTML
html_pages['index.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home — Cosmic Romance | Kamya ❤️</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        #space-canvas {{ position: fixed; inset: 0; z-index: 0; }}
        .moon-glow {{
            position: absolute; width: 140px; height: 140px;
            border-radius: 50%; background: radial-gradient(circle, #fff 30%, rgba(255,215,0,0.2) 60%, transparent 100%);
            box-shadow: 0 0 60px rgba(255,215,0,0.5); top: 15%; right: 15%; z-index: 2;
        }}
    </style>
</head>
<body class="theme-cosmic">
    <canvas id="space-canvas"></canvas>
    <div class="ambient-glow glow-left"></div>
    <div class="ambient-glow glow-right"></div>
    <div class="moon-glow"></div>

    {NAV_DOCK.format(active_index='active', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Happy Girlfriend Day</h1>
        <p class="page-subtitle">For Kamya — Welcome to your magical romantic universe.</p>
        <a href="story.html" class="btn-primary"><span>Explore Constellations</span> <i class="fa-solid fa-arrow-right"></i></a>
    </main>

    {SCRIPTS_FOOTER.format(realm_name='Home Realm')}

    <script>
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {{
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }});

    const stars = [];
    for (let i = 0; i < 120; i++) {{
        stars.push({{
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.05 + 0.01,
            alpha: Math.random()
        }});
    }}

    function animate() {{
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        stars.forEach(s => {{
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
            ctx.globalAlpha = Math.max(0, s.alpha);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }});
        requestAnimationFrame(animate);
    }}
    animate();
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .story-timeline {{ max-width: 900px; margin: 40px auto 100px auto; display: flex; flex-direction: column; gap: 40px; padding: 0 20px; }}
        .story-card {{ display: flex; align-items: center; gap: 30px; }}
        .story-card img {{ width: 220px; height: 160px; object-fit: cover; border-radius: 16px; border: 3px solid #ffd700; }}
        .story-info h3 {{ font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 12px; }}
    </style>
</head>
<body class="theme-golden">
    <div class="ambient-glow glow-left" style="background: radial-gradient(circle, #ffd700, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='active', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title" style="background:linear-gradient(135deg, #ffd700, #ff75a0);">Our Story Timeline</h1>
        <p class="page-subtitle">Precious golden moments connecting our chapters.</p>
    </main>

    <div class="story-timeline">
        <div class="glass-card story-card">
            <img src="assets/images/kamya_1.jpg" alt="Chapter 1">
            <div class="story-info">
                <h3>Chapter 1: The Magic Begins</h3>
                <p>From the first day we spoke, every single conversation felt unique. Your laughter filled my heart with warmth instantly.</p>
            </div>
        </div>

        <div class="glass-card story-card">
            <img src="assets/images/kamya_2.jpg" alt="Chapter 2">
            <div class="story-info">
                <h3>Chapter 2: Growing Closer</h3>
                <p>Late night secrets and morning laughter. Time flies so fast when I am looking at you, Kamya.</p>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="gallery.html" class="btn-primary"><span>Go to Gallery</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Our Story Realm')}
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .gallery-grid {{ max-width: 1200px; margin: 40px auto 100px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; padding: 0 20px; }}
        .gallery-item {{ height: 380px; border-radius: 24px; overflow: hidden; position: relative; cursor: pointer; border: 4px solid #d4af37; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }}
        .gallery-item img {{ width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }}
        .gallery-item:hover img {{ transform: scale(1.1); }}
        .gallery-caption {{ position: absolute; bottom: 0; inset-x: 0; padding: 22px; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent-gold); }}
    </style>
</head>
<body class="theme-museum">
    <div class="ambient-glow glow-right" style="background: radial-gradient(circle, #9d4edd, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='active', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Gallery of Grace</h1>
        <p class="page-subtitle">Precious portraits of Kamya displayed in luxury gold museum frames.</p>
    </main>

    <section class="gallery-grid">
        <div class="gallery-item"><img src="assets/images/kamya_5.jpg" alt="Kamya 5"><div class="gallery-caption">Pure Elegance</div></div>
        <div class="gallery-item"><img src="assets/images/kamya_6.jpg" alt="Kamya 6"><div class="gallery-caption">Radiant Smile</div></div>
        <div class="gallery-item"><img src="assets/images/kamya_7.jpg" alt="Kamya 7"><div class="gallery-caption">Subtle Charm</div></div>
    </section>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="letters.html" class="btn-primary"><span>Visit Letters</span> <i class="fa-solid fa-arrow-right"></i></a>
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .letter-container {{ max-width: 650px; margin: 40px auto 100px auto; padding: 0 20px; }}
        .envelope {{
            width: 100%; height: 350px; background: linear-gradient(145deg, #2a111e, #14050d);
            border: 1px solid rgba(255,140,66,0.3); border-radius: 24px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; position: relative;
        }}
        .wax-seal {{
            width: 80px; height: 80px; border-radius: 50%; background: #ff4d8d;
            box-shadow: 0 0 20px #ff4d8d; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.2rem;
        }}
        .letter-paper {{
            background: #faf6f0; color: #2c1810; padding: 40px; border-radius: 16px;
            margin-top: 20px; display: none; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }}
    </style>
</head>
<body class="theme-candlelight">
    <div class="ambient-glow glow-left" style="background: radial-gradient(circle, #ff8c42, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='active', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">A Special Love Letter</h1>
        <p class="page-subtitle">Click the wax seal below to unseal my heart for you, Kamya.</p>
    </main>

    <div class="letter-container">
        <div class="envelope" id="env-btn">
            <div class="wax-seal"><i class="fa-solid fa-heart"></i></div>
        </div>
        <div class="letter-paper" id="paper-letter">
            <h3 style="font-family:var(--font-heading); font-size:2.2rem; color:#8b0032; margin-bottom:20px;">My Dearest Kamya,</h3>
            <p style="font-family:var(--font-heading); font-size:1.3rem; line-height:1.8; color:#3a2219;">
                From the moment you entered my life, every single day has felt brighter. Your laughter brings light to my world, and your kind soul inspires me constantly. Thank you for being my best friend and my favorite person. Happy Girlfriend Day, Kamya!
            </p>
            <div style="text-align:right; font-family:var(--font-handwriting); font-size:2.2rem; color:#8b0032; margin-top:20px;">Forever Yours ❤️</div>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="garden.html" class="btn-primary"><span>Enter Dream Garden</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Letter Sanctuary')}

    <script>
    document.getElementById('env-btn').addEventListener('click', () => {{
        document.getElementById('paper-letter').style.display = 'block';
        document.getElementById('env-btn').style.display = 'none';
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        #petal-canvas {{ position: fixed; inset: 0; z-index: 0; pointer-events: none; }}
        .garden-container {{ max-width: 900px; margin: 40px auto 100px auto; padding: 44px; text-align: center; background: rgba(30,12,38,0.6); backdrop-filter: blur(20px); border-radius: var(--radius-lg); border: 1px solid rgba(255,140,66,0.3); position: relative; z-index: 5; }}
        .garden-card-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 40px; }}
        .flower-card {{ padding: 30px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.12); }}
        .flower-card i {{ font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 16px; }}
    </style>
</head>
<body class="theme-garden">
    <canvas id="petal-canvas"></canvas>
    <div class="ambient-glow glow-left" style="background: radial-gradient(circle, #ff75a0, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='active', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Dream Garden</h1>
        <p class="page-subtitle">A peaceful sanctuary of falling rose petals and soft sunset wind.</p>
    </main>

    <div class="garden-container glass-card">
        <h2 style="font-family:var(--font-heading); font-size:2.4rem; color:var(--accent-gold);">Blooms of Affection</h2>
        <div class="garden-card-grid">
            <div class="flower-card">
                <i class="fa-solid fa-spa"></i>
                <h3>Serenity</h3>
                <p style="color:var(--text-dim); font-size:0.95rem;">Your presence brings a calm that makes everything feel completely right.</p>
            </div>
            <div class="flower-card">
                <i class="fa-solid fa-sun-plant-wilt"></i>
                <h3>Sunlight</h3>
                <p style="color:var(--text-dim); font-size:0.95rem;">Your smile brightens the cloudiest of days effortlessly.</p>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="music.html" class="btn-primary"><span>Enter Music Room</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Garden Realm')}

    <script>
    const canvas = document.getElementById('petal-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {{
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }});

    const petals = [];
    for (let i = 0; i < 40; i++) {{
        petals.push({{
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 1.5 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            rotation: Math.random() * Math.PI
        }});
    }}

    function animate() {{
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#ff75a0';
        petals.forEach(p => {{
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y > height) p.y = -10;
            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }});
        requestAnimationFrame(animate);
    }}
    animate();
    </script>
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .music-room-box {{ max-width: 600px; margin: 40px auto 100px auto; padding: 60px; text-align: center; }}
        .vinyl-disc {{
            width: 180px; height: 180px; border-radius: 50%;
            background: radial-gradient(circle, #252525 25%, #050505 60%, #151515 100%);
            border: 4px solid #ffd700; margin: 0 auto 30px auto;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.4);
            cursor: pointer; transition: transform 0.5s ease;
        }}
        .vinyl-disc.playing {{ animation: spinRecord 4s linear infinite; }}
        @keyframes spinRecord {{ 100% {{ transform: rotate(360deg); }} }}
    </style>
</head>
<body class="theme-lounge">
    <div class="ambient-glow glow-right" style="background: radial-gradient(circle, #9d4edd, transparent 70%);"></div>

    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='active', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Music Room</h1>
        <p class="page-subtitle">A melody woven for Kamya. Click the vinyl record to play.</p>
    </main>

    <div class="glass-card music-room-box">
        <div class="vinyl-disc" id="disc-play">
            <div style="width:50px; height:50px; border-radius:50%; background:#ff4d8d; display:flex; align-items:center; justify-content:center; color:#fff;"><i class="fa-solid fa-play"></i></div>
        </div>
        <h3 id="play-status" style="font-family:var(--font-heading); font-size:2rem; margin-bottom:12px;">Click Disc to Play Song</h3>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="album.html" class="btn-primary"><span>Open Photo Album</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Music Realm')}

    <script>
    const disc = document.getElementById('disc-play');
    const playStatus = document.getElementById('play-status');
    let playing = false;
    let audioCtx = null;
    let osc = null;

    disc.addEventListener('click', () => {{
        playing = !playing;
        disc.classList.toggle('playing');
        
        if (playing) {{
            playStatus.textContent = "Playing Melody...";
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4 note
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
        }} else {{
            playStatus.textContent = "Click Disc to Play Song";
            if (osc) osc.stop();
        }}
    }});
    </script>
</body>
</html>
"""

# 7. ALBUM.HTML
html_pages['album.html'] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Photo Album — Luxury Scrapbook | Kamya ❤️</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .album-box {{ max-width: 800px; height: 420px; margin: 40px auto 100px auto; background: #faf6f0; border-radius: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.7); display: flex; overflow: hidden; border: 4px solid #8b0032; }}
        .album-left, .album-right {{ width: 50%; padding: 40px; color: #2c1810; display: flex; flex-direction: column; justify-content: center; align-items: center; }}
        .album-left {{ background: #f5efe6; border-right: 2px dashed rgba(0,0,0,0.15); }}
        .album-left img {{ width: 90%; height: 240px; object-fit: cover; border-radius: 12px; border: 4px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }}
    </style>
</head>
<body class="theme-album">
    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='active', active_dreams='', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Vintage Scrapbook</h1>
        <p class="page-subtitle">Reliving our timeless snapshots, Kamya.</p>
    </main>

    <div class="album-box">
        <div class="album-left">
            <img src="assets/images/kamya_11.jpg" alt="Scrapbook Page">
        </div>
        <div class="album-right">
            <h3 style="font-family:var(--font-heading); font-size:2.2rem; color:#8b0032; margin-bottom:16px;">Pure Grace</h3>
            <p style="font-family:var(--font-heading); font-size:1.2rem; text-align:center; color:#3a2219;">Your beauty makes my heart skip a beat every time I open these pages.</p>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="dreams.html" class="btn-primary"><span>Explore Future Dreams</span> <i class="fa-solid fa-arrow-right"></i></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Album Realm')}
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .dreams-grid {{ max-width: 1000px; margin: 40px auto 100px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; padding: 0 20px; }}
        .dream-card {{ padding: 32px; text-align: center; border-radius: var(--radius-md); background: rgba(18,9,36,0.6); border: 1px solid rgba(192,132,252,0.3); }}
        .dream-card i {{ font-size: 2.2rem; color: var(--accent-lavender); margin-bottom: 16px; }}
    </style>
</head>
<body class="theme-future">
    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='active', active_wishes='', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Future Dreams</h1>
        <p class="page-subtitle">A universe of stars and promises written for Kamya.</p>
    </main>

    <div class="dreams-grid">
        <div class="glass-card dream-card">
            <i class="fa-solid fa-plane-departure"></i>
            <h3>Endless Travels</h3>
            <p style="color:var(--text-muted); font-size:0.95rem;">Exploring sunsets on the beach and cozy coffee shops with you.</p>
        </div>
        <div class="glass-card dream-card">
            <i class="fa-solid fa-house-chimney-heart"></i>
            <h3>Our Sanctuary</h3>
            <p style="color:var(--text-muted); font-size:0.95rem;">Building a warm, peaceful space filled with laughter and love.</p>
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 80px;">
        <a href="wishes.html" class="btn-primary"><span>Go to Wish Wall</span> <i class="fa-solid fa-arrow-right"></i></a>
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .lantern-container {{ position: relative; width: 100%; height: 480px; max-width: 900px; margin: 20px auto 100px auto; background: rgba(10,5,25,0.6); border-radius: 24px; border: 1px solid rgba(255,215,0,0.3); overflow: hidden; }}
        .lantern {{ position: absolute; width: 40px; height: 55px; background: radial-gradient(circle, #ffd700, #ff75a0); border-radius: 8px 8px 12px 12px; box-shadow: 0 0 20px #ffd700; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; }}
    </style>
</head>
<body class="theme-lanterns">
    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='active', active_surprise='', active_credits='')}

    <main class="page-hero">
        <h1 class="page-title">Wish Wall</h1>
        <p class="page-subtitle">Click the lanterns to launch wishes into Kamya's sky.</p>
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
        l.style.top = `${{Math.random() * 60 + 20}}%`;
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .surprise-hero {{ min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 100px 24px; position: relative; }}
        .surp-1 {{ font-family: var(--font-heading); font-size: 3.2rem; color: var(--accent-lavender); margin-bottom: 20px; }}
        .surp-2 {{ font-family: var(--font-heading); font-size: 5.2rem; font-weight: 700; background: linear-gradient(135deg, #ffd700, #ff4d8d, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 24px; }}
    </style>
</head>
<body class="theme-infinite">
    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='active', active_credits='')}

    <div class="surprise-hero">
        <h2 class="surp-1">You are my favorite person.</h2>
        <h1 class="surp-2">Happy Girlfriend Day ❤️ Kamya</h1>
        <p style="color:var(--text-muted); font-size:1.2rem; max-width:650px; margin-bottom:40px;">Thank you for filling my universe with endless light and warmth.</p>
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        {SHARED_CSS}
        .credits-card {{ max-width: 700px; margin: 40px auto 100px auto; padding: 60px; text-align: center; }}
    </style>
</head>
<body class="theme-cosmic">
    {NAV_DOCK.format(active_index='', active_story='', active_gallery='', active_letters='', active_garden='', active_music='', active_album='', active_dreams='', active_wishes='', active_surprise='', active_credits='active')}

    <main class="page-hero">
        <h1 class="page-title">Created For Kamya</h1>
    </main>

    <div class="glass-card credits-card">
        <h2 style="font-family:var(--font-heading); font-size:2.4rem; color:var(--accent-gold); margin-bottom:16px;">Handcrafted Dedication</h2>
        <p style="color:var(--text-muted); font-size:1.1rem; line-height:1.7; margin-bottom:32px;">Every single realm, animation, 3D particle, and melody was handcrafted specially for <strong>Kamya</strong>.</p>
        <a href="index.html" class="btn-primary"><span><i class="fa-solid fa-rotate-left"></i> Replay Whole Journey</span></a>
    </div>

    {SCRIPTS_FOOTER.format(realm_name='Dedication Realm')}
</body>
</html>
"""

# Write all 11 HTML pages
for fname, content in html_pages.items():
    with open(os.path.join(BASE_DIR, fname), 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Compiled all {len(html_pages)} HTML masterpiece files successfully!")
