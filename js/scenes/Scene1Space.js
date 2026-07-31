/**
 * Scene1Space.js
 * Black void. Stars that bend to the mouse. Rotating galaxies.
 * Moving nebulas. A glowing heart forms in space. Camera flies toward it.
 */
export default class Scene1Space {
  constructor() {
    this.scene = null
    this.stars = null
    this.galaxies = []
    this.nebulas = []
    this.heart = null
    this.heartParticles = null
    this.cameraStart = { x: 0, y: 0, z: 120 }
    this.cameraEnd = { x: 0, y: 0, z: 20 }
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x000005, 0.002)

    // ─── STARS (10,000) ───
    const starCount = 10000
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    const starColor = new Float32Array(starCount * 3)
    const starSize = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const r = 200 + Math.random() * 800
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPos[i * 3 + 2] = r * Math.cos(phi)

      const hue = 0.55 + Math.random() * 0.45
      const sat = Math.random() * 0.5
      const light = 0.6 + Math.random() * 0.4
      const c = new THREE.Color().setHSL(hue, sat, light)
      starColor[i * 3] = c.r
      starColor[i * 3 + 1] = c.g
      starColor[i * 3 + 2] = c.b
      starSize[i] = Math.random() * 2 + 0.5
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColor, 3))
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSize, 1))

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } },
      vertexShader: `
        attribute float aSize;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vTwinkle;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vColor = color;
          vec3 pos = position;
          float bend = sin(uTime * 0.5 + pos.x * 0.01) * 3.0;
          pos.x += uMouse.x * bend;
          pos.y += uMouse.y * bend;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vTwinkle = sin(uTime * 2.0 + pos.x * 0.1 + pos.y * 0.1) * 0.5 + 0.5;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = (1.0 - d * 2.0) * (0.5 + vTwinkle * 0.5);
          gl_FragColor = vec4(vColor, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.stars = new THREE.Points(starGeo, starMat)
    this.scene.add(this.stars)
    this.starMat = starMat

    // ─── GALAXIES (3 spiral galaxies) ───
    for (let g = 0; g < 3; g++) {
      const galaxy = this._createGalaxy(THREE, g)
      galaxy.position.set(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400,
        -200 - g * 200
      )
      galaxy.rotation.z = Math.random() * Math.PI
      this.scene.add(galaxy)
      this.galaxies.push(galaxy)
    }

    // ─── NEBULAS (volumetric clouds) ───
    for (let n = 0; n < 4; n++) {
      const nebula = this._createNebula(THREE, n)
      this.scene.add(nebula)
      this.nebulas.push(nebula)
    }

    // ─── HEART (particle heart) ───
    this.heart = this._createHeart(THREE)
    this.scene.add(this.heart)

    // ─── COMET (occasional) ───
    this.comet = null
    this.cometTimer = 5 + Math.random() * 10

    this.built = true
  }

  _createGalaxy(THREE, idx) {
    const count = 3000
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * 3)
      const angle = (i / count) * Math.PI * 8 + (arm * Math.PI * 2 / 3)
      const radius = (i / count) * 80
      const spread = (1 - i / count) * 10
      pos[i * 3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.3
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread

      const t = i / count
      const c = new THREE.Color().setHSL(0.55 + t * 0.3, 0.7, 0.5 + t * 0.3)
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))

    const mat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return new THREE.Points(geo, mat)
  }

  _createNebula(THREE, idx) {
    const count = 500
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cx = (Math.random() - 0.5) * 500
    const cy = (Math.random() - 0.5) * 300
    const cz = -100 - Math.random() * 300
    const hue = idx % 2 === 0 ? 0.85 : 0.55

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 80
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = cx + r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = cy + r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = cz + r * Math.cos(phi)
      const c = new THREE.Color().setHSL(hue + Math.random() * 0.1, 0.8, 0.4)
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))

    const mat = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const points = new THREE.Points(geo, mat)
    points.userData = { cx, cy, cz, baseOpacity: 0.08 }
    return points
  }

  _createHeart(THREE) {
    const count = 8000
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const scale = 8

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2
      // Heart parametric equation
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      const z = (Math.random() - 0.5) * 4
      pos[i * 3]     = x * scale + (Math.random() - 0.5) * 3
      pos[i * 3 + 1] = y * scale + (Math.random() - 0.5) * 3
      pos[i * 3 + 2] = z * scale
      const c = new THREE.Color().setHSL(0.95 + Math.random() * 0.05, 0.9, 0.5 + Math.random() * 0.3)
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDist;
        uniform float uTime;
        uniform float uPulse;
        void main() {
          vColor = color;
          vec3 pos = position;
          float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
          pos *= 1.0 + pulse * 0.08 * uPulse;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vDist = -mv.z;
          gl_PointSize = 4.0 * (200.0 / vDist);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDist;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = (1.0 - d * 2.0);
          a = pow(a, 1.5);
          gl_FragColor = vec4(vColor * 1.5, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return new THREE.Points(geo, mat)
  }

  _spawnComet(THREE) {
    const geo = new THREE.BufferGeometry()
    const count = 200
    const pos = new Float32Array(count * 3)
    const startX = -300
    const startY = 100 + Math.random() * 100
    const startZ = -100
    for (let i = 0; i < count; i++) {
      const trail = i / count
      pos[i * 3]     = startX + trail * 600
      pos[i * 3 + 1] = startY - trail * 200
      pos[i * 3 + 2] = startZ + trail * 50
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      size: 3,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.comet = new THREE.Points(geo, mat)
    this.comet.userData = { life: 0, maxLife: 3 }
    this.scene.add(this.comet)
  }

  update(dt, t, localProgress, mouse, globalScroll) {
    if (!this.built) return
    const THREE = window.THREE

    // Camera flies toward heart
    const ease = localProgress
    const z = this.cameraStart.z + (this.cameraEnd.z - this.cameraStart.z) * ease
    if (this._camera) {
      this._camera.position.z = z
      this._camera.position.x += (mouse.nx * 5 - this._camera.position.x) * 0.02
      this._camera.position.y += (mouse.ny * 5 - this._camera.position.y) * 0.02
      this._camera.lookAt(0, 0, 0)
    }

    // Star shader uniforms
    if (this.starMat) {
      this.starMat.uniforms.uTime.value = t
      this.starMat.uniforms.uMouse.value.set(mouse.nx, mouse.ny)
    }

    // Rotate galaxies
    this.galaxies.forEach((g, i) => {
      g.rotation.y += dt * 0.05 * (i + 1) * 0.5
      g.rotation.z += dt * 0.01
    })

    // Drift nebulas
    this.nebulas.forEach((n, i) => {
      n.rotation.y += dt * 0.02
      n.material.opacity = n.userData.baseOpacity * (0.7 + Math.sin(t * 0.3 + i) * 0.3)
    })

    // Heart pulse
    if (this.heart) {
      this.heart.material.uniforms.uTime.value = t
      this.heart.material.uniforms.uPulse.value = Math.min(localProgress * 2, 1)
      this.heart.rotation.y = Math.sin(t * 0.3) * 0.1
    }

    // Comet
    this.cometTimer -= dt
    if (this.cometTimer <= 0 && !this.comet) {
      this._spawnComet(THREE)
      this.cometTimer = 8 + Math.random() * 12
    }
    if (this.comet) {
      this.comet.userData.life += dt
      const lifeT = this.comet.userData.life / this.comet.userData.maxLife
      this.comet.material.opacity = 0.8 * (1 - lifeT)
      if (lifeT >= 1) {
        this.scene.remove(this.comet)
        this.comet = null
      }
    }
  }

  getScene() { return this.scene }

  enter() {}
  exit() {}

  onResize(w, h) {}
}
