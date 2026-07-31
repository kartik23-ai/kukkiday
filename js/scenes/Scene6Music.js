/**
 * Scene6Music.js
 * Vintage piano + vinyl player. Music creates particles.
 * Bass moves lights. Treble creates stars. Lyrics float in air.
 * Audio is synthesized via AudioManager; visualizer is DOM-based.
 */
export default class Scene6Music {
  constructor() {
    this.scene = null
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x1a0a1a, 0.008)

    this.scene.add(new THREE.AmbientLight(0x3a2a3a, 0.4))
    const key = new THREE.SpotLight(0xff5e8a, 2, 100, Math.PI / 6, 0.5)
    key.position.set(0, 30, 10)
    key.target.position.set(0, 0, 0)
    this.scene.add(key)
    this.scene.add(key.target)
    this.spotlight = key

    // ─── PIANO (vintage) ───
    this.piano = this._createPiano(THREE)
    this.piano.position.set(-15, -5, -5)
    this.piano.rotation.y = 0.3
    this.scene.add(this.piano)

    // ─── VINYL PLAYER ───
    this.vinyl = this._createVinyl(THREE)
    this.vinyl.position.set(15, -3, 0)
    this.scene.add(this.vinyl)

    // ─── MUSIC PARTICLES (bass-driven) ───
    const partCount = 1000
    const partGeo = new THREE.BufferGeometry()
    const partPos = new Float32Array(partCount * 3)
    const partCol = new Float32Array(partCount * 3)
    for (let i = 0; i < partCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 80
      partPos[i * 3 + 1] = (Math.random() - 0.5) * 40
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 80
      const c = new THREE.Color().setHSL(0.95, 0.8, 0.6)
      partCol[i * 3] = c.r; partCol[i * 3 + 1] = c.g; partCol[i * 3 + 2] = c.b
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3))
    partGeo.setAttribute('color', new THREE.BufferAttribute(partCol, 3))
    this.particles = new THREE.Points(partGeo, new THREE.PointsMaterial({
      size: 0.5, vertexColors: true, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    this.scene.add(this.particles)

    // ─── STARS (treble-driven) ───
    const starCount = 500
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200
      starPos[i * 3 + 1] = Math.random() * 80
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    this.stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      size: 0.8, color: 0xffffff, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    this.scene.add(this.stars)

    // ─── FLOATING NOTES ───
    this.notes = []
    for (let i = 0; i < 20; i++) {
      const noteGeo = new THREE.PlaneGeometry(1.5, 1.5)
      const noteMat = new THREE.MeshBasicMaterial({
        color: 0xff5e8a, transparent: true, opacity: 0.4,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      })
      const note = new THREE.Mesh(noteGeo, noteMat)
      note.position.set((Math.random() - 0.5) * 60, Math.random() * 30, (Math.random() - 0.5) * 60)
      note.userData = { phase: Math.random() * 6.28, speed: 0.3 + Math.random() * 0.5 }
      this.scene.add(note)
      this.notes.push(note)
    }

    this.built = true
  }

  _createPiano(THREE) {
    const group = new THREE.Group()
    // Body
    const bodyGeo = new THREE.BoxGeometry(12, 1.5, 4)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a1a1a, roughness: 0.4, metalness: 0.3 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = -1
    group.add(body)
    // Keys
    const keyW = 0.5
    for (let i = 0; i < 14; i++) {
      const keyGeo = new THREE.BoxGeometry(keyW, 0.1, 2)
      const keyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      const k = new THREE.Mesh(keyGeo, keyMat)
      k.position.set(-3.5 + i * keyW, 0, 0.5)
      group.add(k)
    }
    // Black keys
    for (let i = 0; i < 10; i++) {
      if (i % 7 === 2 || i % 7 === 6) continue
      const bkGeo = new THREE.BoxGeometry(0.3, 0.15, 1.2)
      const bkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 })
      const bk = new THREE.Mesh(bkGeo, bkMat)
      bk.position.set(-3.5 + i * 0.5 + 0.25, 0.05, 0.8)
      group.add(bk)
    }
    return group
  }

  _createVinyl(THREE) {
    const group = new THREE.Group()
    const discGeo = new THREE.CircleGeometry(4, 64)
    const discMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8, side: THREE.DoubleSide })
    const disc = new THREE.Mesh(discGeo, discMat)
    disc.rotation.x = -Math.PI / 2
    group.add(disc)
    // Label
    const labelGeo = new THREE.CircleGeometry(1.2, 32)
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xff5e8a, roughness: 0.5 })
    const label = new THREE.Mesh(labelGeo, labelMat)
    label.rotation.x = -Math.PI / 2
    label.position.y = 0.01
    group.add(label)
    // Center
    const centerGeo = new THREE.CircleGeometry(0.15, 16)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
    const center = new THREE.Mesh(centerGeo, centerMat)
    center.rotation.x = -Math.PI / 2
    center.position.y = 0.02
    group.add(center)
    group.userData = { disc }
    return group
  }

  update(dt, t, localProgress, mouse, globalScroll) {
    if (!this.built) return

    // Camera orbits
    if (this._camera) {
      const angle = localProgress * Math.PI * 2
      this._camera.position.x = Math.cos(angle) * 25 + mouse.nx * 5
      this._camera.position.y = 5 + Math.sin(localProgress * Math.PI) * 8 + mouse.ny * 3
      this._camera.position.z = Math.sin(angle) * 25
      this._camera.lookAt(0, 0, 0)
    }

    // Vinyl spins
    if (this.vinyl) this.vinyl.userData.disc.rotation.z += dt * 2

    // Spotlight pulses (bass sim)
    if (this.spotlight) {
      this.spotlight.intensity = 2 + Math.sin(t * 4) * 0.5 + Math.sin(t * 1.5) * 0.3
    }

    // Particles dance
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        pos.array[i * 3 + 1] += Math.sin(t * 2 + i * 0.1) * 0.05
        pos.array[i * 3]     += Math.cos(t + i * 0.05) * 0.02
      }
      pos.needsUpdate = true
    }

    // Stars twinkle (treble sim)
    if (this.stars) {
      this.stars.material.opacity = 0.3 + Math.sin(t * 8) * 0.2 + Math.sin(t * 3) * 0.1
    }

    // Notes float
    this.notes.forEach((note, i) => {
      note.position.y += Math.sin(t * note.userData.speed + note.userData.phase) * 0.02
      note.rotation.z = Math.sin(t * 0.5 + i) * 0.1
      note.material.opacity = 0.3 + Math.sin(t + i) * 0.2
    })
  }

  getScene() { return this.scene }
  enter() {}
  exit() {}
  onResize() {}
}
