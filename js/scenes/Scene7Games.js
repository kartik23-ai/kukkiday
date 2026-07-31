/**
 * Scene7Games.js
 * 3D backdrop for the mini-games scene. The actual games run on a 2D canvas
 * overlay (handled in main.js). This scene provides a starfield + aurora background.
 */
export default class Scene7Games {
  constructor() {
    this.scene = null
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x0a0a2a, 0.005)

    this.scene.add(new THREE.AmbientLight(0x334466, 0.5))
    const p = new THREE.PointLight(0xff5e8a, 2, 200)
    p.position.set(0, 20, 30)
    this.scene.add(p)

    // Starfield
    const count = 5000
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400
      pos[i * 3 + 1] = (Math.random() - 0.5) * 300
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.4, 0.5, 0.7)
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    this.stars = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 1, vertexColors: true, transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    this.scene.add(this.stars)

    // Floating hearts
    this.hearts = []
    for (let i = 0; i < 30; i++) {
      const heartGeo = new THREE.SphereGeometry(0.5, 8, 8)
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xff5e8a, emissive: 0xff5e8a, emissiveIntensity: 0.5, transparent: true, opacity: 0.6,
      })
      const h = new THREE.Mesh(heartGeo, heartMat)
      h.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 100)
      h.userData = { phase: Math.random() * 6.28, speed: 0.5 + Math.random() }
      this.scene.add(h)
      this.hearts.push(h)
    }

    this.built = true
  }

  update(dt, t, localProgress, mouse, globalScroll) {
    if (!this.built) return
    if (this._camera) {
      this._camera.position.x = Math.sin(t * 0.1) * 10 + mouse.nx * 5
      this._camera.position.y = Math.cos(t * 0.08) * 5 + mouse.ny * 3
      this._camera.position.z = 60
      this._camera.lookAt(0, 0, 0)
    }
    if (this.stars) this.stars.rotation.y += dt * 0.02
    this.hearts.forEach((h) => {
      h.position.y += Math.sin(t * h.userData.speed + h.userData.phase) * 0.03
      h.rotation.y += dt * 0.5
      h.material.opacity = 0.4 + Math.sin(t + h.userData.phase) * 0.2
    })
  }

  getScene() { return this.scene }
  enter() {}
  exit() {}
  onResize() {}
}
