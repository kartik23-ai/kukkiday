/**
 * main.js — Entry point
 * Orchestrates the entire cinematic experience:
 * - Bootstraps SceneManager, AudioManager, Cursor, LenisController
 * - Registers all 8 scenes
 * - Handles UI overlays, memory lightbox, letter modal, music player, mini-games
 * - Manages scene transitions and scroll-driven camera
 */
import SceneManager from './js/components/SceneManager.js'
import AudioManager from './js/components/AudioManager.js'
import Cursor from './js/components/Cursor.js'
import LenisController from './js/components/LenisController.js'
import Scene1Space from './js/scenes/Scene1Space.js'
import Scene2World from './js/scenes/Scene2World.js'
import Scene3Memories from './js/scenes/Scene3Memories.js'
import Scene4Letters from './js/scenes/Scene4Letters.js'
import Scene5Garden from './js/scenes/Scene5Garden.js'
import Scene6Music from './js/scenes/Scene6Music.js'
import Scene7Games from './js/scenes/Scene7Games.js'
import Scene8Finale from './js/scenes/Scene8Finale.js'

/* ═════════════════════════════════════════════════════
   CONTENT — Memories, Letters, Songs, Lyrics
═════════════════════════════════════════════════════ */

const MEMORIES = [
  {
    image: 'images/6070883797445579078.jpg',
    date: 'Dec 1, 2024',
    caption: 'The First Rose 🌹',
    message: 'The day I gave you a rose and my heart started racing. The beginning of our story.',
  },
  {
    image: 'images/6070883797445579079.jpg',
    date: 'Jan 1, 2025',
    caption: 'She Said Yes 💍',
    message: 'The proposal on New Year\'s Day — the happiest yes of my life.',
  },
  {
    image: 'images/6070883797445579080.jpg',
    date: 'Sep 5, 2025',
    caption: 'Birthday Girl Kukki 🎂',
    message: 'Celebrating the most beautiful soul\'s birthday with love and laughter.',
  },
  {
    image: 'images/6070883797445579081.jpg',
    date: 'Jan 1, 2026',
    caption: 'One Year Together 💫',
    message: '365 days of love, happiness, growth, and forever to go.',
  },
  {
    image: 'images/6070883797445579082.jpg',
    date: 'Jun 28, 2026',
    caption: 'Advance Birthday Surprise 🎁',
    message: 'Advance birthday surprise for Kukki because you deserve everyday celebrations.',
  },
  {
    image: 'images/6070883797445579083.jpg',
    date: 'Aug 1, 2026',
    caption: 'Happy Girlfriend Day 💝',
    message: 'Today! Dedicated to my universe, my best friend, my love, Kamya.',
  },
  {
    image: 'images/6070883797445579084.jpg',
    date: 'Precious Moments',
    caption: 'Your Beautiful Smile ✨',
    message: 'Your smile lights up my entire world every single day.',
  },
  {
    image: 'images/6070883797445579085.jpg',
    date: 'Golden Hour',
    caption: 'Precious Moments 💕',
    message: 'Every single minute with you is a gift I cherish.',
  },
  {
    image: 'images/6070883797445579086.jpg',
    date: 'Starlight Romance',
    caption: 'My Favorite Place 🌌',
    message: 'No matter where life takes us, you are my favourite place.',
  },
  {
    image: 'images/6070883797445579087.jpg',
    date: 'Pure Joy',
    caption: 'Laughter & Happiness 😊',
    message: 'Your laughter is the sweetest melody in the universe.',
  },
  {
    image: 'images/6070883797445579088.jpg',
    date: 'Forever Us',
    caption: 'Unforgettable Days 🌟',
    message: 'Building memories that will stay with us forever.',
  },
  {
    image: 'images/6070883797445579089.jpg',
    date: 'Sweet Moments',
    caption: 'Forever Yours ❤️',
    message: 'My heart belongs to you, today and for all eternity.',
  },
  {
    image: 'images/6070883797445579090.jpg',
    date: 'Cosmic Love',
    caption: 'Starlight Romance ✨',
    message: 'Written in the stars, forever and ever.',
  },
  {
    image: 'images/6070883797445579091.jpg',
    date: 'Sweet Memories',
    caption: 'Sweet Memories 🍬',
    message: 'Tasting the sweetness of true love.',
  },
  {
    image: 'images/6070883797445579092.jpg',
    date: 'My Sunshine',
    caption: 'My Sunshine ☀️',
    message: 'You bring warmth and light into my life.',
  },
  {
    image: 'images/6070883797445579093.jpg',
    date: 'Together Forever',
    caption: 'Together Forever 💖',
    message: 'Hand in hand, walking into forever together.',
  }
]

const LETTERS = [
  {
    date: 'Written on a quiet Tuesday',
    body: 'I have started this letter a hundred times. Each time the words rearrange themselves, as if they too are shy around you. So let me say the simplest true thing: you are the calm in every storm I have ever weathered, and the storm in every calm I took for granted. I do not know how I earned a place in your story, but I intend to guard it with everything I have.',
  },
  {
    date: 'From a train window, somewhere between cities',
    body: 'The fields outside are blurring past, and all I can think is that distance is just a test the universe gives to people who matter. Every mile is a question, and you are the only answer I have ever been sure of. I will keep moving toward you, in every direction, until the road runs out of reasons not to.',
  },
  {
    date: 'Late, when the house was asleep',
    body: 'There is a kind of quiet that only exists when you are in the next room. It is not empty — it is full of you. Full of the soft weight of your breathing, the small sounds of your dreams finding their way down the hall. I sat in it tonight and realized: this is what people mean when they say home.',
  },
  {
    date: 'On the day the rain would not stop',
    body: 'The rain has been writing its own letter against the window for hours. It is not as good at words as I am, but it has more patience. So I will steal its rhythm and say this: you are the weather I would choose if the sky let me pick. Always you. Even the storms. Especially the storms.',
  },
  {
    date: 'After you fell asleep in the garden',
    body: 'You fell asleep with a book open on your chest and a single petal caught in your hair. I did not move it. I wanted the afternoon to have that, to have proof it had been close to you. I sat beside you and learned what it means to protect something so small it fits in a single held breath.',
  },
  {
    date: 'A letter I will probably never send',
    body: 'Some loves announce themselves. Ours just moved in quietly, the way light enters a room before you notice. One day I looked around and every corner of my life had been rearranged by you — and I had not felt a single thing move. That is how I knew it was real. That is how I knew it would last.',
  },
  {
    date: 'From the last page of a notebook I almost threw away',
    body: 'If I ever forget the exact color of your laugh, I hope this page remembers for me. I hope it holds the shape of your name the way I hold it — carefully, and like it might break if I am not paying attention. You are the word I underline twice. You always have been.',
  },
]

const SONGS = [
  { name: 'Tere Bina', artist: 'Our Mixtape', lyrics: ['Every note was written for you', 'In the silence between heartbeats', 'I hear your name like a melody'] },
  { name: 'A Thousand Years', artist: 'Christina Perri', lyrics: ['I have died every day waiting for you', 'Darling, do not be afraid', 'I have loved you for a thousand years'] },
  { name: 'Pee Loon', artist: 'Once More', lyrics: ['I would drink the sky for you', 'Every star a drop of light', 'Just to see you shine the way you do'] },
  { name: 'Tum Se Hi', artist: 'Jab We Met', lyrics: ['Every moment begins with you', 'And ends in the same place', 'You are the breath between my lines'] },
  { name: 'Raabta', artist: 'Our Song', lyrics: ['Kehta hai saawan baarishon se', 'Some unspoken things', 'Are felt in the space between two people'] },
]

/* ═════════════════════════════════════════════════════
   BOOTSTRAP
═════════════════════════════════════════════════════ */

const canvas = document.getElementById('gl-canvas')
const sceneManager = new SceneManager(canvas)
const audioManager = new AudioManager()
const lenisController = new LenisController((progress) => {
  sceneManager.setScroll(progress)
  updateScrollUI(progress)
})

let cursor = null
let currentSceneIndex = 0
let gardenScene = null
let gameScene = null

async function init() {
  // Wait for Three.js to load
  await waitForThree()

  await sceneManager.init()
  await audioManager.init()

  // Register scenes
  sceneManager.register(new Scene1Space())
  sceneManager.register(new Scene2World())
  sceneManager.register(new Scene3Memories(MEMORIES))
  sceneManager.register(new Scene4Letters(LETTERS))
  gardenScene = new Scene5Garden()
  sceneManager.register(gardenScene)
  sceneManager.register(new Scene6Music())
  gameScene = new Scene7Games()
  sceneManager.register(gameScene)
  sceneManager.register(new Scene8Finale())

  sceneManager.onSceneChange = (idx, prev) => {
    handleSceneChange(idx, prev)
  }

  await sceneManager.buildAll()
  sceneManager.start()

  // Loader animation
  runLoader(() => {
    document.getElementById('loader').classList.add('done')
    document.getElementById('audio-gate').classList.remove('hidden')
    document.getElementById('scene-nav').classList.add('visible')
  })
}

function waitForThree() {
  return new Promise((resolve) => {
    if (window.THREE) return resolve()
    const check = setInterval(() => {
      if (window.THREE) { clearInterval(check); resolve() }
    }, 50)
  })
}

/* ═════════════════════════════════════════════════════
   LOADER
═════════════════════════════════════════════════════ */

function runLoader(onComplete) {
  const bar = document.getElementById('loader-bar')
  const percent = document.getElementById('loader-percent')
  let p = 0
  const interval = setInterval(() => {
    p += Math.random() * 8 + 2
    if (p >= 100) {
      p = 100
      clearInterval(interval)
      bar.style.width = '100%'
      percent.textContent = '100%'
      setTimeout(onComplete, 400)
    }
    bar.style.width = p + '%'
    percent.textContent = Math.floor(p) + '%'
  }, 80)
}

/* ═════════════════════════════════════════════════════
   AUDIO GATE
═════════════════════════════════════════════════════ */

document.getElementById('enter-btn').addEventListener('click', async () => {
  await audioManager.resume()
  audioManager.setScene(0)
  startExperience()
})

document.getElementById('enter-mute').addEventListener('click', () => {
  startExperience()
})

function startExperience() {
  document.getElementById('audio-gate').classList.add('hidden')
  lenisController.init()
  cursor = new Cursor()
  showSceneOverlay(0)
  initAmbientParticles()
  initPetalCanvas()
  initMemoryGrid()
  initLetterInteraction()
  initGardenControls()
  initMusicPlayer()
  initGames()
  initNav()
  initFinale()
}

/* ═════════════════════════════════════════════════════
   SCENE OVERLAY MANAGEMENT
═════════════════════════════════════════════════════ */

const overlays = [
  document.getElementById('scene-1-overlay'),
  document.getElementById('scene-2-overlay'),
  document.getElementById('scene-3-overlay'),
  document.getElementById('scene-4-overlay'),
  document.getElementById('scene-5-overlay'),
  document.getElementById('scene-6-overlay'),
  document.getElementById('scene-7-overlay'),
  document.getElementById('scene-8-overlay'),
]

function showSceneOverlay(idx) {
  overlays.forEach((o, i) => {
    if (i === idx) { o.classList.remove('hidden'); o.classList.add('active') }
    else { o.classList.remove('active'); o.classList.add('hidden') }
  })
}

function handleSceneChange(idx, prev) {
  currentSceneIndex = idx
  showSceneOverlay(idx)
  audioManager.setScene(idx)

  // Update nav dots
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx)
  })

  // Trigger transition wipe
  triggerWipe()

  // Special scene logic
  if (idx === 7) triggerFinaleSequence()
}

function triggerWipe() {
  const wipe = document.getElementById('transition-wipe')
  wipe.classList.remove('exit')
  wipe.classList.add('active')
  setTimeout(() => {
    wipe.classList.remove('active')
    wipe.classList.add('exit')
    setTimeout(() => wipe.classList.remove('exit'), 800)
  }, 800)
}

/* ═════════════════════════════════════════════════════
   SCROLL UI
═════════════════════════════════════════════════════ */

function updateScrollUI(progress) {
  const fill = document.getElementById('scroll-fill')
  fill.style.width = (progress * 100) + '%'
}

/* ═════════════════════════════════════════════════════
   NAV DOTS
═════════════════════════════════════════════════════ */

function initNav() {
  document.querySelectorAll('.nav-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.scene)
      const progress = idx / 8 + 0.001
      lenisController.scrollTo(progress)
    })
  })
}

/* ═════════════════════════════════════════════════════
   AMBIENT PARTICLES (DOM)
═════════════════════════════════════════════════════ */

function initAmbientParticles() {
  const container = document.getElementById('ambient-particles')
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div')
    p.className = 'ambient-particle'
    const size = 2 + Math.random() * 4
    p.style.width = size + 'px'
    p.style.height = size + 'px'
    p.style.left = Math.random() * 100 + '%'
    p.style.top = Math.random() * 100 + '%'
    const hue = 330 + Math.random() * 40
    p.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.6), transparent)`
    p.style.animation = `drift ${15 + Math.random() * 20}s linear infinite`
    p.style.animationDelay = -Math.random() * 20 + 's'
    container.appendChild(p)
  }
}

/* ═════════════════════════════════════════════════════
   PETAL CANVAS (2D falling petals overlay)
═════════════════════════════════════════════════════ */

function initPetalCanvas() {
  const pc = document.getElementById('petal-canvas')
  const ctx = pc.getContext('2d')
  let petals = []

  function resize() { pc.width = window.innerWidth; pc.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize)

  for (let i = 0; i < 60; i++) {
    petals.push({
      x: Math.random() * pc.width,
      y: Math.random() * pc.height,
      vx: 0.3 + Math.random() * 0.5,
      vy: 0.5 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.05,
      size: 4 + Math.random() * 6,
      hue: 340 + Math.random() * 30,
      alpha: 0.4 + Math.random() * 0.4,
    })
  }

  function tick() {
    requestAnimationFrame(tick)
    ctx.clearRect(0, 0, pc.width, pc.height)
    petals.forEach((p) => {
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.5
      p.y += p.vy
      p.rot += p.vrot
      if (p.y > pc.height) { p.y = -10; p.x = Math.random() * pc.width }
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${p.alpha})`
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }
  tick()
}

/* ═════════════════════════════════════════════════════
   MEMORY GRID + LIGHTBOX
═════════════════════════════════════════════════════ */

function initMemoryGrid() {
  const grid = document.getElementById('memories-grid')
  MEMORIES.forEach((mem, i) => {
    const card = document.createElement('div')
    card.className = 'memory-card'
    card.dataset.index = i
    card.innerHTML = `
      <img src="${mem.image}" alt="${mem.caption}" loading="lazy" />
      <div class="memory-card-overlay">
        <div class="memory-date">${mem.date}</div>
        <div class="memory-caption">${mem.caption}</div>
      </div>
      <div class="memory-glass-frame"></div>
    `
    card.addEventListener('click', () => openMemory(mem))
    grid.appendChild(card)
  })
}

function openMemory(mem) {
  const lb = document.getElementById('memory-lightbox')
  document.getElementById('lightbox-img').src = mem.image
  document.getElementById('lightbox-img').alt = mem.caption
  document.getElementById('lightbox-date').textContent = mem.date
  document.getElementById('lightbox-caption').textContent = mem.caption
  document.getElementById('lightbox-message').textContent = mem.message
  lb.classList.remove('hidden')
  // Animate particles in lightbox
  spawnLightboxParticles()
}

function spawnLightboxParticles() {
  const container = document.getElementById('lightbox-particles')
  container.innerHTML = ''
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div')
    p.className = 'ambient-particle'
    p.style.position = 'absolute'
    p.style.width = '3px'
    p.style.height = '3px'
    p.style.left = Math.random() * 100 + '%'
    p.style.top = Math.random() * 100 + '%'
    p.style.background = 'radial-gradient(circle, rgba(255,179,198,0.8), transparent)'
    p.style.animation = `float ${3 + Math.random() * 3}s ease-in-out infinite`
    p.style.animationDelay = -Math.random() * 3 + 's'
    container.appendChild(p)
  }
}

document.getElementById('lightbox-close').addEventListener('click', closeMemory)
document.getElementById('lightbox-close-btn').addEventListener('click', closeMemory)

function closeMemory() {
  document.getElementById('memory-lightbox').classList.add('hidden')
}

/* ═════════════════════════════════════════════════════
   LETTER INTERACTION (envelopes → letter modal)
═════════════════════════════════════════════════════ */

function initLetterInteraction() {
  // Raycasting on the 3D envelopes is handled by clicking the canvas in scene 4
  canvas.addEventListener('click', (e) => {
    if (currentSceneIndex !== 3) return
    // Pick a random letter for now (raycasting would be more precise)
    const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)]
    openLetter(letter)
  })
}

function openLetter(letter) {
  const modal = document.getElementById('letter-modal')
  document.getElementById('letter-date').textContent = letter.date
  const body = document.getElementById('letter-body')
  body.innerHTML = ''
  modal.classList.remove('hidden')

  // Animate ink writing
  const text = letter.body
  body.innerHTML = text.split('').map((c) => {
    if (c === ' ') return ' '
    return `<span class="ink-char">${c}</span>`
  }).join('')

  const chars = body.querySelectorAll('.ink-char')
  chars.forEach((c, i) => {
    c.style.animationDelay = (i * 0.015) + 's'
  })
}

document.getElementById('letter-modal-close-bg').addEventListener('click', closeLetter)
document.getElementById('letter-close').addEventListener('click', closeLetter)

function closeLetter() {
  document.getElementById('letter-modal').classList.add('hidden')
}

/* ═════════════════════════════════════════════════════
   GARDEN WEATHER CONTROLS
═════════════════════════════════════════════════════ */

function initGardenControls() {
  document.querySelectorAll('.weather-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.weather-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const w = btn.dataset.weather
      gardenScene.setWeather(w)
      document.getElementById('garden-time').textContent = btn.textContent
    })
  })
}

/* ═════════════════════════════════════════════════════
   MUSIC PLAYER
═════════════════════════════════════════════════════ */

let currentSong = 0
let musicPlaying = false
let lyricsInterval = null

function initMusicPlayer() {
  // Create visualizer bars
  const viz = document.getElementById('music-visualizer')
  for (let i = 0; i < 48; i++) {
    const bar = document.createElement('div')
    bar.className = 'viz-bar'
    viz.appendChild(bar)
  }

  document.getElementById('play-pause-btn').addEventListener('click', toggleMusic)
  document.getElementById('prev-song').addEventListener('click', () => changeSong(-1))
  document.getElementById('next-song').addEventListener('click', () => changeSong(1))

  updateSongDisplay()
  startVisualizer()
}

function toggleMusic() {
  musicPlaying = !musicPlaying
  const playIcon = document.querySelector('.play-icon')
  const pauseIcon = document.querySelector('.pause-icon')
  const vinyl = document.getElementById('vinyl-record')
  const arm = document.getElementById('vinyl-arm')

  if (musicPlaying) {
    playIcon.classList.add('hidden')
    pauseIcon.classList.remove('hidden')
    vinyl.classList.add('playing')
    arm.classList.add('playing')
    startLyrics()
    // Play piano notes
    playSongMelody()
  } else {
    playIcon.classList.remove('hidden')
    pauseIcon.classList.add('hidden')
    vinyl.classList.remove('playing')
    arm.classList.remove('playing')
    stopLyrics()
  }
}

function changeSong(dir) {
  currentSong = (currentSong + dir + SONGS.length) % SONGS.length
  updateSongDisplay()
  if (musicPlaying) {
    stopLyrics()
    startLyrics()
    playSongMelody()
  }
}

function updateSongDisplay() {
  document.getElementById('vinyl-song-name').textContent = SONGS[currentSong].name
  document.getElementById('vinyl-artist').textContent = SONGS[currentSong].artist
}

function startLyrics() {
  const display = document.getElementById('lyrics-display')
  const lyrics = SONGS[currentSong].lyrics
  let idx = 0
  display.textContent = lyrics[0]
  display.classList.add('active')
  lyricsInterval = setInterval(() => {
    idx = (idx + 1) % lyrics.length
    display.classList.remove('active')
    setTimeout(() => {
      display.textContent = lyrics[idx]
      display.classList.add('active')
    }, 600)
  }, 4000)
}

function stopLyrics() {
  if (lyricsInterval) { clearInterval(lyricsInterval); lyricsInterval = null }
}

function playSongMelody() {
  if (!musicPlaying) return
  const notes = [261.63, 293.66, 329.63, 392, 440, 523.25]
  let i = 0
  const playNext = () => {
    if (!musicPlaying) return
    audioManager.playPianoNote(notes[i % notes.length], 0.8)
    i++
    if (i < 16) setTimeout(playNext, 400)
  }
  playNext()
}

function startVisualizer() {
  const bars = document.querySelectorAll('.viz-bar')
  function tick() {
    requestAnimationFrame(tick)
    bars.forEach((bar, i) => {
      const h = musicPlaying
        ? 10 + Math.abs(Math.sin(Date.now() * 0.003 + i * 0.5)) * 60 + Math.random() * 20
        : 4 + Math.sin(Date.now() * 0.001 + i) * 3
      bar.style.height = h + 'px'
    })
  }
  tick()
}

/* ═════════════════════════════════════════════════════
   MINI GAMES
═════════════════════════════════════════════════════ */

let activeGame = null
let gameCanvas = null
let gameCtx = null
let gameLoop = null
let gameState = { score: 0 }

function initGames() {
  document.querySelectorAll('.game-start-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const g = btn.dataset.game
      startGame(g)
    })
  })
  document.getElementById('game-quit').addEventListener('click', quitGame)
}

function startGame(name) {
  document.getElementById('game-arena').classList.remove('hidden')
  gameCanvas = document.getElementById('game-canvas')
  gameCanvas.width = 800
  gameCanvas.height = 600
  gameCtx = gameCanvas.getContext('2d')
  gameState = { score: 0 }
  updateGameScore()

  if (name === 'heartcatch') activeGame = new HeartCatchGame(gameCtx, gameCanvas)
  else if (name === 'memory') activeGame = new MemoryMatchGame(gameCtx, gameCanvas)
  else if (name === 'constellation') activeGame = new ConstellationGame(gameCtx, gameCanvas)

  activeGame.start()
  gameLoop = setInterval(() => {
    activeGame.update()
    activeGame.draw()
    if (activeGame.score !== gameState.score) {
      gameState.score = activeGame.score
      updateGameScore()
    }
    if (activeGame.done) {
      showGameMessage(activeGame.message)
      setTimeout(() => quitGame(), 2500)
    }
  }, 1000 / 60)
}

function updateGameScore() {
  document.getElementById('game-score').textContent = 'Score: ' + gameState.score
}

function showGameMessage(msg) {
  const el = document.getElementById('game-message')
  el.textContent = msg
  el.classList.remove('hidden')
}

function quitGame() {
  if (gameLoop) { clearInterval(gameLoop); gameLoop = null }
  activeGame = null
  document.getElementById('game-arena').classList.add('hidden')
  document.getElementById('game-message').classList.add('hidden')
}

// ─── Heart Catch Game ───
class HeartCatchGame {
  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
    this.hearts = []
    this.basket = { x: 400, y: 540, w: 80, h: 20 }
    this.score = 0
    this.done = false
    this.message = ''
    this.spawnTimer = 0
    this.lives = 3
    this._bind()
  }

  _bind() {
    this._moveHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width)
      this.basket.x = Math.max(40, Math.min(this.canvas.width - 40, x))
    }
    this.canvas.addEventListener('mousemove', this._moveHandler)
  }

  start() {}

  update() {
    this.spawnTimer++
    if (this.spawnTimer > 40) {
      this.spawnTimer = 0
      this.hearts.push({
        x: Math.random() * (this.canvas.width - 40) + 20,
        y: -20,
        vy: 2 + Math.random() * 2,
        size: 16,
        hue: 330 + Math.random() * 30,
      })
    }
    this.hearts.forEach((h) => { h.y += h.vy })
    // Catch
    this.hearts = this.hearts.filter((h) => {
      if (h.y > this.basket.y - 10 && h.y < this.basket.y + 20 &&
          Math.abs(h.x - this.basket.x) < this.basket.w / 2) {
        this.score += 10
        audioManager.playPianoNote(523, 0.3)
        return false
      }
      if (h.y > this.canvas.height) {
        this.lives--
        if (this.lives <= 0) { this.done = true; this.message = 'Game Over! Score: ' + this.score }
        return false
      }
      return true
    })
  }

  draw() {
    const ctx = this.ctx
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, 600)
    grad.addColorStop(0, '#1a0a2a')
    grad.addColorStop(1, '#2a1a3a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 600)

    // Hearts
    this.hearts.forEach((h) => {
      ctx.fillStyle = `hsl(${h.hue}, 80%, 65%)`
      ctx.shadowBlur = 20
      ctx.shadowColor = `hsl(${h.hue}, 80%, 65%)`
      ctx.beginPath()
      ctx.font = `${h.size * 2}px serif`
      ctx.textAlign = 'center'
      ctx.fillText('♥', h.x, h.y)
      ctx.shadowBlur = 0
    })

    // Basket
    ctx.fillStyle = '#ff5e8a'
    ctx.shadowBlur = 15
    ctx.shadowColor = '#ff5e8a'
    ctx.fillRect(this.basket.x - this.basket.w / 2, this.basket.y, this.basket.w, this.basket.h)
    ctx.shadowBlur = 0

    // Lives
    ctx.fillStyle = 'white'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Lives: ' + '♥'.repeat(this.lives), 20, 30)
  }
}

// ─── Memory Match Game ───
class MemoryMatchGame {
  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
    this.cards = []
    this.flipped = []
    this.score = 0
    this.done = false
    this.message = ''
    this._initCards()
    this._bind()
  }

  _initCards() {
    const symbols = ['♥', '✿', '★', '♪', '☀', '☾']
    const pairs = [...symbols, ...symbols]
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]]
    }
    this.cards = pairs.map((s, i) => ({
      symbol: s, x: 100 + (i % 4) * 160, y: 80 + Math.floor(i / 4) * 160,
      w: 130, h: 130, flipped: false, matched: false,
    }))
  }

  _bind() {
    this._clickHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height)
      this.cards.forEach((c) => {
        if (!c.flipped && !c.matched && x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) {
          if (this.flipped.length < 2) {
            c.flipped = true
            this.flipped.push(c)
            audioManager.playPianoNote(440, 0.3)
          }
        }
      })
    }
    this.canvas.addEventListener('click', this._clickHandler)
  }

  start() {}

  update() {
    if (this.flipped.length === 2) {
      const [a, b] = this.flipped
      if (a.symbol === b.symbol) {
        a.matched = true; b.matched = true
        this.score += 20
        audioManager.playPianoNote(523, 0.5)
        this.flipped = []
      } else {
        setTimeout(() => { a.flipped = false; b.flipped = false; this.flipped = [] }, 800)
      }
    }
    if (this.cards.every((c) => c.matched) && !this.done) {
      this.done = true
      this.message = 'You found all pairs! Score: ' + this.score
    }
  }

  draw() {
    const ctx = this.ctx
    ctx.fillStyle = '#1a0a2a'
    ctx.fillRect(0, 0, 800, 600)
    this.cards.forEach((c) => {
      ctx.fillStyle = c.matched ? 'rgba(255,94,138,0.3)' : c.flipped ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'
      ctx.strokeStyle = c.matched ? '#ff5e8a' : 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(c.x, c.y, c.w, c.h, 16)
      ctx.fill()
      ctx.stroke()
      if (c.flipped || c.matched) {
        ctx.fillStyle = c.matched ? '#ff5e8a' : 'white'
        ctx.font = '60px serif'
        ctx.textAlign = 'center'
        ctx.fillText(c.symbol, c.x + c.w / 2, c.y + c.h / 2 + 20)
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.font = '40px serif'
        ctx.textAlign = 'center'
        ctx.fillText('?', c.x + c.w / 2, c.y + c.h / 2 + 15)
      }
    })
  }
}

// ─── Constellation Drawing Game ───
class ConstellationGame {
  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
    this.stars = []
    this.lines = []
    this.currentStar = null
    this.score = 0
    this.done = false
    this.message = ''
    this._initStars()
    this._bind()
  }

  _initStars() {
    for (let i = 0; i < 12; i++) {
      this.stars.push({
        x: 100 + Math.random() * 600,
        y: 80 + Math.random() * 440,
        r: 4 + Math.random() * 4,
        connected: false,
        index: i,
      })
    }
  }

  _bind() {
    this._clickHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height)
      for (const s of this.stars) {
        if (Math.hypot(x - s.x, y - s.y) < s.r + 10) {
          if (this.currentStar === null) {
            this.currentStar = s
            s.connected = true
            audioManager.playPianoNote(440, 0.3)
          } else if (this.currentStar !== s) {
            this.lines.push({ a: this.currentStar, b: s })
            s.connected = true
            this.score += 10
            audioManager.playPianoNote(523, 0.3)
            this.currentStar = s
            if (this.stars.every((st) => st.connected)) {
              this.done = true
              this.message = 'You drew our constellation! Score: ' + this.score
            }
          }
          break
        }
      }
    }
    this.canvas.addEventListener('click', this._clickHandler)
  }

  start() {}

  update() {}

  draw() {
    const ctx = this.ctx
    const grad = ctx.createRadialGradient(400, 300, 0, 400, 300, 500)
    grad.addColorStop(0, '#0a0a2a')
    grad.addColorStop(1, '#000005')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 600)

    // Lines
    ctx.strokeStyle = 'rgba(255,179,198,0.6)'
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 10
    ctx.shadowColor = '#ff5e8a'
    this.lines.forEach((l) => {
      ctx.beginPath()
      ctx.moveTo(l.a.x, l.a.y)
      ctx.lineTo(l.b.x, l.b.y)
      ctx.stroke()
    })
    ctx.shadowBlur = 0

    // Stars
    this.stars.forEach((s) => {
      ctx.fillStyle = s.connected ? '#ff5e8a' : 'white'
      ctx.shadowBlur = 15
      ctx.shadowColor = s.connected ? '#ff5e8a' : 'white'
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    })
  }
}

/* ═════════════════════════════════════════════════════
   FINALE SEQUENCE
═════════════════════════════════════════════════════ */

function initFinale() {
  const photos = document.getElementById('s8-photos')
  MEMORIES.forEach((mem, i) => {
    const div = document.createElement('div')
    div.className = 's8-photo'
    div.style.animationDelay = (6 + i * 0.2) + 's'
    div.innerHTML = `<img src="${mem.image}" alt="${mem.caption}" />`
    photos.appendChild(div)
  })
}

function triggerFinaleSequence() {
  const universe = document.getElementById('s8-universe-text')
  const name = document.getElementById('s8-name')
  const final = document.getElementById('s8-final')
  const photos = document.getElementById('s8-photos')

  universe.classList.remove('hidden')
  name.classList.add('hidden')
  final.classList.add('hidden')
  photos.classList.add('hidden')

  // Reset animations
  universe.style.animation = 'none'
  name.style.animation = 'none'
  final.style.animation = 'none'

  setTimeout(() => {
    universe.style.animation = ''
    name.classList.remove('hidden')
    name.style.animation = ''
  }, 2500)

  setTimeout(() => {
    final.classList.remove('hidden')
    final.style.animation = ''
  }, 5000)

  setTimeout(() => {
    photos.classList.remove('hidden')
  }, 6000)
}

/* ═════════════════════════════════════════════════════
   KEYBOARD NAV
═════════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    const next = Math.min(currentSceneIndex + 1, 7)
    lenisController.scrollTo(next / 8 + 0.001)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    const prev = Math.max(currentSceneIndex - 1, 0)
    lenisController.scrollTo(prev / 8 + 0.001)
  } else if (e.key === 'Escape') {
    closeMemory()
    closeLetter()
    quitGame()
  }
})

/* ═════════════════════════════════════════════════════
   GO
═════════════════════════════════════════════════════ */

init()
