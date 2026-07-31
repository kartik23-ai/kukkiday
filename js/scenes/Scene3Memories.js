/**
 * Scene3Memories.js
 * Timeline of floating 3D photo frames. Camera flies through them.
 * Soft particles, light bloom. Clicking a photo opens the lightbox (handled in main.js).
 */
export default class Scene3Memories {
  constructor(memories = []) {
    this.scene = null
    this.memories = memories
    this.frames = []
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x0a0a1a, 0.005)

    // Lights
    this.scene.add(new THREE.AmbientLight(0x404060, 0.5))
    const key = new THREE.PointLight(0xff5e8a, 2, 300)
    key.position.set(0, 20, 30)
    this.scene.add(key)

    // Soft particles (background dust)
    const dustCount = 2000
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * 400
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 200
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 400
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    this.scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.5, color: 0xffb3c6, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })))

    // Memory frames — arranged in a flowing curve
    const count = Math.max(this.memories.length, 8)
    for (let i = 0; i < count; i++) {
      const mem = this.memories[i] || this._defaultMemory(i)
      const frame = await this._createFrame(THREE, mem, i)
      const t = i / count
      const angle = t * Math.PI * 4
      const r = 20 + Math.sin(t * Math.PI) * 15
      frame.position.set(
        Math.cos(angle) * r,
        Math.sin(t * Math.PI * 2) * 10,
        -t * 120
      )
      frame.lookAt(0, 0, frame.position.z + 20)
      frame.userData = { mem, baseY: frame.position.y, index: i }
      this.scene.add(frame)
      this.frames.push(frame)
    }

    // Light beams (bloom-like)
    for (let i = 0; i < 5; i++) {
      const beamGeo = new THREE.CylinderGeometry(0.5, 8, 100, 8, 1, true)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xff5e8a, transparent: true, opacity: 0.06,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      beam.position.set((Math.random() - 0.5) * 60, 0, -i * 30 - 20)
      beam.rotation.z = Math.PI / 2
      this.scene.add(beam)
    }

    this.built = true
  }

  async _createFrame(THREE, mem, idx) {
    const group = new THREE.Group()
    const w = 8, h = 10

    // Frame border (glass-like)
    const borderGeo = new THREE.BoxGeometry(w + 0.5, h + 0.5, 0.3)
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, transparent: true, opacity: 0.15,
      metalness: 0.5, roughness: 0.2,
    })
    const border = new THREE.Mesh(borderGeo, borderMat)
    group.add(border)

    // Photo plane — load texture
    const tex = await this._loadTexture(THREE, mem.image)
    const photoGeo = new THREE.PlaneGeometry(w, h)
    const photoMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9 })
    const photo = new THREE.Mesh(photoGeo, photoMat)
    photo.position.z = 0.2
    group.add(photo)

    // Glow behind
    const glowGeo = new THREE.PlaneGeometry(w + 4, h + 4)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff5e8a, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.z = -0.5
    group.add(glow)
    group.userData.glow = glow

    return group
  }

  _loadTexture(THREE, url) {
    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = 'anonymous'
      loader.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        resolve(tex)
      }, undefined, () => {
        // Fallback: create a canvas texture
        const c = document.createElement('canvas')
        c.width = 512; c.height = 640
        const ctx = c.getContext('2d')
        const grad = ctx.createLinearGradient(0, 0, 0, 640)
        grad.addColorStop(0, '#ff5e8a')
        grad.addColorStop(1, '#6ec1ff')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 512, 640)
        ctx.fillStyle = 'white'
        ctx.font = 'italic 40px serif'
        ctx.textAlign = 'center'
        ctx.fillText('Memory', 256, 320)
        resolve(new THREE.CanvasTexture(c))
      })
    })
  }

  _defaultMemory(i) {
    return {
      image: `https://images.pexels.com/photos/${[1549168, 35425405, 31996846, 5473011, 37306174, 5474503][i % 6]}/pexels-photo-${[1549168, 35425405, 31996846, 5473011, 37306174, 5474503][i % 6]}.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
      date: `Memory ${i + 1}`,
      caption: 'A moment in time',
      message: 'Every moment with you is a treasure I keep in my heart.',
    }
  }

  update(dt, t, localProgress, mouse, globalScroll) {
    if (!this.built) return

    // Camera flies through the timeline
    if (this._camera) {
      const totalLen = 120 * this.frames.length / 8
      const z = -localProgress * totalLen
      this._camera.position.z = z + 20
      this._camera.position.x = Math.sin(localProgress * Math.PI * 4) * 8 + mouse.nx * 4
      this._camera.position.y = Math.cos(localProgress * Math.PI * 2) * 5 + mouse.ny * 3
      this._camera.lookAt(0, 0, z - 10)
    }

    // Frames float and glow
    this.frames.forEach((frame, i) => {
      frame.position.y = frame.userData.baseY + Math.sin(t * 0.5 + i) * 0.5
      frame.rotation.y = Math.sin(t * 0.3 + i * 0.5) * 0.1
      if (frame.userData.glow) {
        frame.userData.glow.material.opacity = 0.1 + Math.sin(t * 1.5 + i) * 0.05
      }
    })
  }

  getScene() { return this.scene }
  enter() {}
  exit() {}
  onResize() {}
}
