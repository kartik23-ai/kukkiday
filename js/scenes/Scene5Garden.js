/**
 * Scene5Garden.js
 * Dream garden with dynamic 3D weather environments (Morning, Golden Hour, Starlight Night, Rainy).
 * Smooth crossfade weather transitions, glowing flowers, fireflies, wind particles.
 */
export default class Scene5Garden {
  constructor() {
    this.scene = null
    this.weather = 'morning'
    this.built = false
    this.textures = {}
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x1a2e1a, 0.007)

    // Lighting
    this.ambient = new THREE.AmbientLight(0xffe7a8, 0.7)
    this.scene.add(this.ambient)

    this.sun = new THREE.DirectionalLight(0xffd166, 1.8)
    this.sun.position.set(40, 60, 20)
    this.scene.add(this.sun)

    // Load Weather Wallpapers
    const texLoader = new THREE.TextureLoader()
    this.textures = {
      morning: texLoader.load('images/garden_morning.jpg'),
      golden_hour: texLoader.load('images/garden_golden_hour.jpg'),
      starlight_night: texLoader.load('images/garden_starlight_night.jpg'),
      rainy: texLoader.load('images/garden_rainy.jpg')
    }

    // Sky Background Dome / Plane
    const skyGeo = new THREE.PlaneGeometry(320, 180)
    this.skyMat = new THREE.MeshBasicMaterial({
      map: this.textures.morning,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    })
    this.skyPlane = new THREE.Mesh(skyGeo, this.skyMat)
    this.skyPlane.position.set(0, 20, -120)
    this.scene.add(this.skyPlane)

    // Glowing Garden Flowers
    this.flowers = []
    const flowerColors = [0xff5e8a, 0xffb3c6, 0xfbbf24, 0xa855f7, 0xf43f5e]

    for (let i = 0; i < 25; i++) {
      const flower = this._createFlower(THREE, flowerColors[i % flowerColors.length])
      const angle = (i / 25) * Math.PI * 2
      const radius = 15 + Math.random() * 30
      flower.position.set(Math.cos(angle) * radius, -8 + Math.random() * 4, Math.sin(angle) * radius - 20)
      this.scene.add(flower)
      this.flowers.push(flower)
    }

    // Fireflies & Light Dust
    this.fireflies = this._createFireflies(THREE, 350)
    this.scene.add(this.fireflies)

    this.built = true
  }

  setWeather(weatherMode) {
    if (!this.built || !this.textures[weatherMode]) return
    this.weather = weatherMode

    const THREE = window.THREE
    if (window.gsap) {
      window.gsap.to(this.skyMat, {
        opacity: 0.2,
        duration: 0.8,
        onComplete: () => {
          this.skyMat.map = this.textures[weatherMode]
          this.skyMat.needsUpdate = true
          window.gsap.to(this.skyMat, { opacity: 0.95, duration: 0.8 })
        }
      })
    } else {
      this.skyMat.map = this.textures[weatherMode]
      this.skyMat.needsUpdate = true
    }
  }

  _createFlower(THREE, colorHex) {
    const group = new THREE.Group()

    const stemGeo = new THREE.CylinderGeometry(0.1, 0.15, 3, 8)
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
    const stem = new THREE.Mesh(stemGeo, stemMat)
    stem.position.y = 1.5
    group.add(stem)

    const petalCount = 6
    for (let p = 0; p < petalCount; p++) {
      const pGeo = new THREE.SphereGeometry(0.8, 8, 8)
      const pMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.4,
        roughness: 0.3
      })
      const petal = new THREE.Mesh(pGeo, pMat)
      const angle = (p / petalCount) * Math.PI * 2
      petal.position.set(Math.cos(angle) * 0.8, 3, Math.sin(angle) * 0.8)
      group.add(petal)
    }

    group.userData = { baseY: group.position.y, floatPhase: Math.random() * Math.PI * 2 }
    return group
  }

  _createFireflies(THREE, count) {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const phase = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40 + 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200
      phase[i]       = Math.random() * Math.PI * 2
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aPhase;
        varying float vGlow;
        uniform float uTime;
        void main() {
          vGlow = sin(uTime * 2.5 + aPhase) * 0.5 + 0.5;
          vec3 pos = position;
          pos.y += sin(uTime + aPhase) * 1.5;
          pos.x += cos(uTime * 0.6 + aPhase) * 1.0;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 8.0 * (100.0 / -mv.z) * vGlow;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vGlow;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          if (length(c) > 0.5) discard;
          gl_FragColor = vec4(1.0, 0.85, 0.3, vGlow * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.fireflyMat = mat
    return new THREE.Points(geo, mat)
  }

  update(time, delta) {
    if (!this.built) return

    if (this.fireflyMat) this.fireflyMat.uniforms.uTime.value = time

    this.flowers.forEach((flower) => {
      flower.rotation.y += 0.005
    })
  }

  destroy() {
    this.built = false
  }
}
