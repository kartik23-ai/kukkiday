/**
 * Scene2World.js
 * Camera enters the heart. A new world: floating islands,
 * cherry blossoms, volumetric fog, butterflies, fireflies, petals, aurora, clouds.
 */
export default class Scene2World {
  constructor() {
    this.scene = null
    this.built = false
  }

  async build(renderer, camera) {
    const THREE = window.THREE
    this._camera = camera
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x1a0a2e, 0.008)

    // ─── LIGHTING ───
    const ambient = new THREE.AmbientLight(0x6a4a8a, 0.5)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffb3c6, 1.4)
    sun.position.set(50, 80, 30)
    this.scene.add(sun)

    const fill = new THREE.PointLight(0x6ec1ff, 1.8, 200)
    fill.position.set(-40, 20, 40)
    this.scene.add(fill)

    // ─── FLOATING ISLANDS ───
    this.islands = []
    for (let i = 0; i < 7; i++) {
      const island = this._createIsland(THREE)
      const angle = (i / 7) * Math.PI * 2
      const r = 30 + Math.random() * 40
      island.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 30, Math.sin(angle) * r - 20)
      island.userData = { baseY: island.position.y, floatSpeed: 0.3 + Math.random() * 0.3, floatPhase: Math.random() * Math.PI * 2 }
      this.scene.add(island)
      this.islands.push(island)
    }

    // ─── CHERRY BLOSSOM TREES on islands ───
    this.trees = []
    this.islands.forEach((island, i) => {
      if (i % 2 === 0) {
        const tree = this._createCherryTree(THREE)
        tree.position.copy(island.position)
        tree.position.y += 4
        this.scene.add(tree)
        this.trees.push(tree)
      }
    })

    // ─── PETALS (thousands) ───
    this.petals = this._createPetals(THREE, 2000)
    this.scene.add(this.petals)

    // ─── BUTTERFLIES WITH AI TEXTURES ───
    this.butterflies = []
    const texLoader = new THREE.TextureLoader()
    const bfTexture = texLoader.load('images/butterfly.jpg')
    const birdTexture = texLoader.load('images/birds.jpg')

    for (let i = 0; i < 20; i++) {
      const bf = this._createButterfly(THREE, i, bfTexture)
      this.scene.add(bf)
      this.butterflies.push(bf)
    }

    // ─── FLYING BIRDS WITH AI TEXTURES ───
    this.birds = []
    for (let i = 0; i < 10; i++) {
      const bird = this._createBird(THREE, i, birdTexture)
      this.scene.add(bird)
      this.birds.push(bird)
    }

    // ─── FIREFLIES ───
    this.fireflies = this._createFireflies(THREE, 400)
    this.scene.add(this.fireflies)

    // ─── AURORA ───
    this.aurora = this._createAurora(THREE)
    this.scene.add(this.aurora)

    // ─── CLOUDS ───
    this.clouds = []
    for (let i = 0; i < 8; i++) {
      const cloud = this._createCloud(THREE)
      cloud.position.set((Math.random() - 0.5) * 200, 20 + Math.random() * 40, -50 - Math.random() * 100)
      this.scene.add(cloud)
      this.clouds.push(cloud)
    }

    // ─── VOLUMETRIC FOG ───
    const fogGeo = new THREE.PlaneGeometry(400, 400, 1, 1)
    const fogMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        float noise(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          vec2 uv = vUv;
          float n = noise(uv * 10.0 + uTime * 0.1);
          n += noise(uv * 20.0 + uTime * 0.05) * 0.5;
          float fade = 1.0 - abs(vUv.y - 0.5) * 2.0;
          vec3 col = mix(vec3(0.1, 0.05, 0.2), vec3(0.5, 0.2, 0.6), n);
          gl_FragColor = vec4(col, n * fade * 0.35);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.fogPlane = new THREE.Mesh(fogGeo, fogMat)
    this.fogPlane.rotation.x = -Math.PI / 2
    this.fogPlane.position.y = -15
    this.scene.add(this.fogPlane)
    this.fogMat = fogMat

    this.built = true
  }

  _createIsland(THREE) {
    const group = new THREE.Group()
    const topGeo = new THREE.CylinderGeometry(8 + Math.random() * 6, 4 + Math.random() * 4, 6 + Math.random() * 4, 12)
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x3a5a3a, roughness: 0.8, metalness: 0.1,
    })
    const islandBody = new THREE.Mesh(topGeo, topMat)
    group.add(islandBody)

    const crystalCount = 3 + Math.floor(Math.random() * 4)
    for (let c = 0; c < crystalCount; c++) {
      const cryGeo = new THREE.ConeGeometry(0.8, 4, 5)
      const cryMat = new THREE.MeshStandardMaterial({
        color: 0xff5e8a, roughness: 0.1, metalness: 0.9,
        emissive: 0xff5e8a, emissiveIntensity: 0.5,
      })
      const cry = new THREE.Mesh(cryGeo, cryMat)
      cry.position.set((Math.random() - 0.5) * 8, 3, (Math.random() - 0.5) * 8)
      cry.rotation.z = (Math.random() - 0.5) * 0.4
      group.add(cry)
    }
    return group
  }

  _createCherryTree(THREE) {
    const group = new THREE.Group()
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 6, 8)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 })
    const trunk = new THREE.Mesh(trunkGeo, trunkMat)
    trunk.position.y = 3
    group.add(trunk)

    for (let b = 0; b < 5; b++) {
      const bGeo = new THREE.SphereGeometry(2 + Math.random() * 1.5, 8, 8)
      const bMat = new THREE.MeshStandardMaterial({
        color: 0xffb3c6, roughness: 0.6,
        emissive: 0xff6b8b, emissiveIntensity: 0.2,
      })
      const crown = new THREE.Mesh(bGeo, bMat)
      crown.position.set((Math.random() - 0.5) * 3, 5 + Math.random() * 2, (Math.random() - 0.5) * 3)
      group.add(crown)
    }
    return group
  }

  _createPetals(THREE, count) {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const rot = new Float32Array(count * 3)
    const speed = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 150
      pos[i * 3 + 1] = Math.random() * 80 - 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150
      rot[i * 3]     = Math.random() * Math.PI
      rot[i * 3 + 1] = Math.random() * Math.PI
      rot[i * 3 + 2] = Math.random() * Math.PI
      speed[i]       = 0.2 + Math.random() * 0.4
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aRot', new THREE.BufferAttribute(rot, 3))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute vec3 aRot;
        attribute float aSpeed;
        uniform float uTime;
        varying vec3 vRot;
        void main() {
          vRot = aRot;
          vec3 p = position;
          p.y -= mod(uTime * aSpeed * 10.0, 80.0) - 40.0;
          p.x += sin(uTime * 0.5 + position.z) * 3.0;
          p.z += cos(uTime * 0.5 + position.x) * 3.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = 8.0 * (100.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          if (length(c) > 0.5) discard;
          gl_FragColor = vec4(1.0, 0.7, 0.8, 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
    })

    this.petalMat = mat
    return new THREE.Points(geo, mat)
  }

  _createButterfly(THREE, idx, texture) {
    const group = new THREE.Group()
    const wingMat = new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      emissive: new THREE.Color().setHSL(idx * 0.1, 0.8, 0.5),
      emissiveIntensity: 0.6,
    })
    const wingGeo = new THREE.PlaneGeometry(2, 2)
    const leftWing = new THREE.Mesh(wingGeo, wingMat)
    leftWing.position.x = -1
    group.add(leftWing)

    const rightWing = new THREE.Mesh(wingGeo, wingMat)
    rightWing.position.x = 1
    group.add(rightWing)

    group.position.set((Math.random() - 0.5) * 100, Math.random() * 30, (Math.random() - 0.5) * 100)
    group.userData = {
      leftWing, rightWing,
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      target: new THREE.Vector3((Math.random() - 0.5) * 100, Math.random() * 30, (Math.random() - 0.5) * 100),
      vel: new THREE.Vector3(),
    }
    return group
  }

  _createBird(THREE, idx, texture) {
    const birdGeo = new THREE.PlaneGeometry(4, 4)
    const birdMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const mesh = new THREE.Mesh(birdGeo, birdMat)
    mesh.position.set((Math.random() - 0.5) * 120, 20 + Math.random() * 20, (Math.random() - 0.5) * 120)
    mesh.userData = {
      speed: 0.8 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
    }
    return mesh
  }

  _createFireflies(THREE, count) {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 150
      pos[i * 3 + 1] = Math.random() * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150
      phase[i] = Math.random() * Math.PI * 2
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
          vGlow = sin(uTime * 2.0 + aPhase) * 0.5 + 0.5;
          vec3 pos = position;
          pos.y += sin(uTime + aPhase) * 2.0;
          pos.x += cos(uTime * 0.5 + aPhase) * 1.0;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 7.0 * (100.0 / -mv.z) * vGlow;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vGlow;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          gl_FragColor = vec4(1.0, 0.9, 0.4, (1.0 - d * 2.0) * vGlow);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.fireflyMat = mat
    return new THREE.Points(geo, mat)
  }

  _createAurora(THREE) {
    const geo = new THREE.PlaneGeometry(300, 80, 50, 10)
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(uv.x * 10.0 + uTime) * 10.0;
          pos.y += cos(uv.x * 5.0 + uTime * 0.5) * 5.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          float alpha = sin(vUv.y * 3.14159) * 0.3;
          vec3 col1 = vec3(0.2, 1.0, 0.6);
          vec3 col2 = vec3(0.8, 0.2, 1.0);
          vec3 col = mix(col1, col2, sin(vUv.x * 5.0 + uTime) * 0.5 + 0.5);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    this.auroraMat = mat
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(0, 40, -100)
    return mesh
  }

  _createCloud(THREE) {
    const group = new THREE.Group()
    const count = 5 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(10 + Math.random() * 15, 8, 8)
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffd1e8, transparent: true, opacity: 0.12, depthWrite: false,
      })
      const part = new THREE.Mesh(geo, mat)
      part.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 20)
      group.add(part)
    }
    return group
  }

  update(time, delta) {
    if (!this.built) return

    if (this.petalMat) this.petalMat.uniforms.uTime.value = time
    if (this.fireflyMat) this.fireflyMat.uniforms.uTime.value = time
    if (this.auroraMat) this.auroraMat.uniforms.uTime.value = time
    if (this.fogMat) this.fogMat.uniforms.uTime.value = time

    this.islands.forEach((island) => {
      const ud = island.userData
      island.position.y = ud.baseY + Math.sin(time * ud.floatSpeed + ud.floatPhase) * 1.5
    })

    this.butterflies.forEach((bf) => {
      const ud = bf.userData
      const flap = Math.sin(time * 15 * ud.speed + ud.phase) * 0.8
      ud.leftWing.rotation.y = flap
      ud.rightWing.rotation.y = -flap

      bf.position.x += Math.sin(time * ud.speed + ud.phase) * 0.1
      bf.position.y += Math.cos(time * ud.speed * 1.3 + ud.phase) * 0.08
    })

    this.birds.forEach((bird) => {
      const ud = bird.userData
      bird.position.x += Math.sin(time * ud.speed + ud.phase) * 0.2
      bird.position.y += Math.cos(time * ud.speed * 0.8 + ud.phase) * 0.1
    })

    this.clouds.forEach((cloud) => {
      cloud.position.x += delta * 2
      if (cloud.position.x > 150) cloud.position.x = -150
    })
  }

  destroy() {
    this.built = false
  }
}
