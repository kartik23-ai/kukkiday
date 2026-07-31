/**
 * Scene8Finale.js
 * The visitor leaves Earth, the solar system, the galaxy.
 * The entire universe becomes particles. Particles form "Kamya" and a heart.
 * Fade to black. Silence.
 */
export default class Scene8Finale {
  constructor() {
    this.scene = null
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x000005, 0.001)

    // ─── UNIVERSE PARTICLES (50,000) ───
    const count = 50000
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const targetPos = new Float32Array(count * 3) // target shape (heart + name)
    for (let i = 0; i < count; i++) {
      // Start: scattered universe
      const r = 100 + Math.random() * 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Target: heart shape
      const t = Math.random() * Math.PI * 2
      const hx = 16 * Math.pow(Math.sin(t), 3)
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      const hz = (Math.random() - 0.5) * 6
      targetPos[i * 3]     = hx * 3 + (Math.random() - 0.5) * 4
      targetPos[i * 3 + 1] = hy * 3 + (Math.random() - 0.5) * 4
      targetPos[i * 3 + 2] = hz * 3

      const c = new THREE.Color().setHSL(0.95 + Math.random() * 0.05, 0.9, 0.6)
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aTarget', new THREE.BufferAttribute(targetPos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 }, // 0 = universe, 1 = heart
        uMouse: { value: new THREE.Vector2() },
      },
      vertexShader: `
        attribute vec3 aTarget;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uMorph;
        uniform vec2 uMouse;
        void main() {
          vColor = color;
          vec3 pos = mix(position, aTarget, uMorph);
          pos.x += uMouse.x * 3.0 * (1.0 - uMorph);
          pos.y += uMouse.y * 3.0 * (1.0 - uMorph);
          float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
          pos *= 1.0 + pulse * 0.05 * uMorph;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 3.0 * (200.0 / -mv.z);
          vAlpha = 1.0 - uMorph * 0.3;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = pow(1.0 - d * 2.0, 1.5) * vAlpha;
          gl_FragColor = vec4(vColor * 1.3, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.particles = new THREE.Points(geo, mat)
    this.scene.add(this.particles)
    this.particleMat = mat

    // ─── GALAXY SPIRAL (background) ───
    const galaxyCount = 8000
    const galGeo = new THREE.BufferGeometry()
    const galPos = new Float32Array(galaxyCount * 3)
    const galCol = new Float32Array(galaxyCount * 3)
    for (let i = 0; i < galaxyCount; i++) {
      const arm = Math.floor(Math.random() * 3)
      const angle = (i / galaxyCount) * Math.PI * 6 + (arm * Math.PI * 2 / 3)
      const radius = (i / galaxyCount) * 200
      galPos[i * 3]     = Math.cos(angle) * radius
      galPos[i * 3 + 1] = (Math.random() - 0.5) * 20
      galPos[i * 3 + 2] = Math.sin(angle) * radius - 300
      const c = new THREE.Color().setHSL(0.55 + (i / galaxyCount) * 0.3, 0.7, 0.5)
      galCol[i * 3] = c.r; galCol[i * 3 + 1] = c.g; galCol[i * 3 + 2] = c.b
    }
    galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3))
    galGeo.setAttribute('color', new THREE.BufferAttribute(galCol, 3))
    this.galaxy = new THREE.Points(galGeo, new THREE.PointsMaterial({
      size: 1.5, vertexColors: true, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    this.scene.add(this.galaxy)

    this.built = true
  }

  update(dt, t, localProgress, mouse, globalScroll) {
    if (!this.built) return

    // Camera pulls back from universe, then into heart
    if (this._camera) {
      const z = 200 - localProgress * 150
      this._camera.position.z = z
      this._camera.position.x += (mouse.nx * 5 - this._camera.position.x) * 0.02
      this._camera.position.y += (mouse.ny * 5 - this._camera.position.y) * 0.02
      this._camera.lookAt(0, 0, 0)
    }

    // Morph particles from universe to heart
    if (this.particleMat) {
      this.particleMat.uniforms.uTime.value = t
      this.particleMat.uniforms.uMouse.value.set(mouse.nx, mouse.ny)
      // Morph happens in the second half of the scene
      const morph = Math.max(0, (localProgress - 0.3) / 0.7)
      this.particleMat.uniforms.uMorph.value = Math.min(morph, 1)
    }

    // Galaxy rotates slowly
    if (this.galaxy) {
      this.galaxy.rotation.z += dt * 0.02
      this.galaxy.material.opacity = Math.max(0, 0.6 - localProgress * 0.6)
    }

    // Particle rotation
    if (this.particles) {
      this.particles.rotation.y += dt * 0.05
    }
  }

  getScene() { return this.scene }
  enter() {}
  exit() {}
  onResize() {}
}
