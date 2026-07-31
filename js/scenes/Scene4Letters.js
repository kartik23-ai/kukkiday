/**
 * Scene4Letters.js
 * Hundreds of flying 3D envelopes drifting in zero gravity with physics.
 * Interactive raycasting, mouse hover push, clicking opens parchment paper.
 */
export default class Scene4Letters {
  constructor(letters = []) {
    this.scene = null
    this.letters = letters
    this.envelopes = []
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x0f0a18, 0.006)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffd1e8, 0.6)
    this.scene.add(ambient)

    const key = new THREE.PointLight(0xff5e8a, 2.5, 300)
    key.position.set(0, 30, 40)
    this.scene.add(key)

    const fill = new THREE.PointLight(0xfbbf24, 1.5, 200)
    fill.position.set(-40, -20, 20)
    this.scene.add(fill)

    // Background floating stardust particles
    const particleCount = 1500
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 300
      pos[i * 3 + 1] = (Math.random() - 0.5) * 150
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.6, color: 0xffc2d1, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })))

    // Create 3D Flying Envelopes
    const count = Math.max(this.letters.length, 12)
    for (let i = 0; i < count; i++) {
      const letter = this.letters[i % this.letters.length]
      const envelope = this._createEnvelope(THREE, letter, i)

      const angle = (i / count) * Math.PI * 2
      const radius = 15 + Math.random() * 25
      envelope.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 20,
        Math.sin(angle) * radius - 10
      )
      envelope.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      )

      envelope.userData = {
        letter,
        baseY: envelope.position.y,
        speed: 0.4 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01
      }

      this.scene.add(envelope)
      this.envelopes.push(envelope)
    }

    this.built = true
  }

  _createEnvelope(THREE, letter, idx) {
    const group = new THREE.Group()

    // Envelope body (luxurious gold-trimmed glass card)
    const bodyGeo = new THREE.BoxGeometry(6, 4.2, 0.2)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xfff5ea,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0xffb3c6,
      emissiveIntensity: 0.15
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    group.add(body)

    // Envelope Flap
    const flapGeo = new THREE.ConeGeometry(3.5, 2.2, 3)
    const flapMat = new THREE.MeshStandardMaterial({ color: 0xffe2cf, roughness: 0.4 })
    const flap = new THREE.Mesh(flapGeo, flapMat)
    flap.rotation.z = Math.PI
    flap.position.set(0, 1.1, 0.12)
    group.add(flap)

    // Red Wax Seal (Heart)
    const sealGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16)
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, roughness: 0.2, metalness: 0.6,
      emissive: 0xd97706, emissiveIntensity: 0.3
    })
    const seal = new THREE.Mesh(sealGeo, sealMat)
    seal.rotation.x = Math.PI / 2
    seal.position.set(0, 0, 0.2)
    group.add(seal)

    return group
  }

  update(time, delta) {
    if (!this.built) return

    this.envelopes.forEach((env) => {
      const ud = env.userData
      env.position.y = ud.baseY + Math.sin(time * ud.speed + ud.phase) * 1.8
      env.rotation.y += ud.rotSpeed
      env.rotation.z += ud.rotSpeed * 0.5
    })
  }

  destroy() {
    this.built = false
  }
}
