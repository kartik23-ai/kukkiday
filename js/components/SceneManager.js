/**
 * SceneManager.js
 * Orchestrates the entire 3D experience — one Three.js renderer,
 * multiple scenes, a shared camera that glides between them on scroll.
 * Each scene is a self-contained module that owns its own objects,
 * update(dt, t) loop, and enter()/exit() lifecycle.
 */
export default class SceneManager {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = null
    this.camera = null
    this.scenes = []
    this.activeIndex = 0
    this.clock = null
    this.mouse = { x: 0, y: 0, nx: 0, ny: 0 }
    this.scroll = 0
    this.targetScroll = 0
    this.transitionProgress = 0
    this.running = false
    this.onSceneChange = null
    this.composer = null
  }

  async init() {
    const THREE = window.THREE

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    )
    this.camera.position.set(0, 0, 100)

    this.clock = new THREE.Clock()

    this._bindEvents()
  }

  register(sceneModule) {
    this.scenes.push(sceneModule)
  }

  async buildAll() {
    for (const scene of this.scenes) {
      if (scene.build) await scene.build(this.renderer, this.camera)
    }
  }

  start() {
    this.running = true
    this._tick()
  }

  setScroll(progress) {
    // progress 0..1 across the entire journey
    this.targetScroll = progress
  }

  setActiveScene(index) {
    if (index === this.activeIndex) return
    const prev = this.activeIndex
    this.activeIndex = index
    if (this.scenes[prev] && this.scenes[prev].exit) this.scenes[prev].exit()
    if (this.scenes[index] && this.scenes[index].enter) this.scenes[index].enter()
    if (this.onSceneChange) this.onSceneChange(index, prev)
  }

  getActiveScene() { return this.scenes[this.activeIndex] }

  _bindEvents() {
    window.addEventListener('resize', () => this._onResize())
    window.addEventListener('mousemove', (e) => this._onMouseMove(e))
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this._onMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
      }
    }, { passive: true })
  }

  _onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    for (const scene of this.scenes) {
      if (scene.onResize) scene.onResize(w, h)
    }
  }

  _onMouseMove(e) {
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
    this.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1
  }

  _tick = () => {
    if (!this.running) return
    requestAnimationFrame(this._tick)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.getElapsedTime()

    // Smooth scroll
    this.scroll += (this.targetScroll - this.scroll) * 0.08

    // Determine which scene based on scroll
    const totalScenes = this.scenes.length
    const sceneProgress = this.scroll * totalScenes
    const idx = Math.min(Math.floor(sceneProgress), totalScenes - 1)
    const localProgress = sceneProgress - idx

    if (idx !== this.activeIndex) this.setActiveScene(idx)

    const scene = this.scenes[this.activeIndex]
    if (scene && scene.update) scene.update(dt, t, localProgress, this.mouse, this.scroll)

    if (scene && scene.getScene) {
      this.renderer.render(scene.getScene(), this.camera)
    }
  }
}
