/**
 * AudioManager.js
 * Generates all audio procedurally with the Web Audio API —
 * heartbeat, wind, rain, birds, piano notes, orchestral pads.
 * No external audio files needed. Crossfades between scenes.
 */
export default class AudioManager {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.sceneGains = []
    this.enabled = false
    this.currentScene = 0
    this.heartbeatInterval = null
    this.ambientNodes = []
    this.musicNodes = []
    this.currentMusic = null
  }

  async init() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      this.ctx = new AC()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0
      this.masterGain.connect(this.ctx.destination)

      // Create per-scene gains for crossfading
      for (let i = 0; i < 8; i++) {
        const g = this.ctx.createGain()
        g.gain.value = 0
        g.connect(this.masterGain)
        this.sceneGains.push(g)
      }

      this.enabled = true
    } catch (e) {
      console.warn('Audio init failed', e)
    }
  }

  async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 1.5)
    }
  }

  setScene(index) {
    if (!this.enabled) return
    this.currentScene = index
    const t = this.ctx.currentTime
    this.sceneGains.forEach((g, i) => {
      const target = i === index ? 1 : 0
      g.gain.cancelScheduledValues(t)
      g.gain.linearRampToValueAtTime(target, t + 1.5)
    })

    // Stop previous ambient
    this._stopAmbient()
    this._stopMusic()

    // Start scene-specific audio
    switch (index) {
      case 0: this._startHeartbeat(); this._startSpaceDrone(); break
      case 1: this._startBirds(); this._startWind(); this._startMusicPad(220); break
      case 2: this._startMusicPad(330); this._startSoftPad(); break
      case 3: this._startWind(); this._startMusicPad(196); break
      case 4: this._startBirds(); this._startWind(); this._startMusicPad(261); break
      case 5: this._startMusicPad(174); break
      case 6: this._startMusicPad(247); break
      case 7: this._startHeartbeat(); this._startSpaceDrone(); break
    }
  }

  // ─── HEARTBEAT ───
  _startHeartbeat() {
    if (!this.enabled) return
    const playBeat = () => {
      if (this.currentScene !== 0 && this.currentScene !== 7) return
      this._playHeartbeat()
    }
    this.heartbeatInterval = setInterval(playBeat, 1100)
    playBeat()
  }

  _playHeartbeat() {
    const t = this.ctx.currentTime
    const gain = this.sceneGains[this.currentScene]
    // "lub"
    const o1 = this.ctx.createOscillator()
    const g1 = this.ctx.createGain()
    o1.frequency.value = 60
    o1.type = 'sine'
    g1.gain.setValueAtTime(0, t)
    g1.gain.linearRampToValueAtTime(0.5, t + 0.02)
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    o1.connect(g1).connect(gain)
    o1.start(t); o1.stop(t + 0.2)

    // "dub"
    const o2 = this.ctx.createOscillator()
    const g2 = this.ctx.createGain()
    o2.frequency.value = 50
    o2.type = 'sine'
    g2.gain.setValueAtTime(0, t + 0.2)
    g2.gain.linearRampToValueAtTime(0.35, t + 0.22)
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    o2.connect(g2).connect(gain)
    o2.start(t + 0.2); o2.stop(t + 0.4)
  }

  // ─── SPACE DRONE ───
  _startSpaceDrone() {
    if (!this.enabled) return
    const gain = this.sceneGains[this.currentScene]
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    const droneGain = this.ctx.createGain()

    osc1.frequency.value = 55
    osc1.type = 'sine'
    osc2.frequency.value = 82.5
    osc2.type = 'sine'
    lfo.frequency.value = 0.1
    lfoGain.gain.value = 0.05
    droneGain.gain.value = 0.08

    lfo.connect(lfoGain).connect(droneGain.gain)
    osc1.connect(droneGain)
    osc2.connect(droneGain)
    droneGain.connect(gain)

    osc1.start(); osc2.start(); lfo.start()
    this.ambientNodes.push(osc1, osc2, lfo)
  }

  // ─── WIND ───
  _startWind() {
    if (!this.enabled) return
    const gain = this.sceneGains[this.currentScene]
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400
    filter.Q.value = 0.5

    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    lfo.frequency.value = 0.15
    lfoGain.gain.value = 200
    lfo.connect(lfoGain).connect(filter.frequency)

    const windGain = this.ctx.createGain()
    windGain.gain.value = 0.06

    noise.connect(filter).connect(windGain).connect(gain)
    noise.start(); lfo.start()
    this.ambientNodes.push(noise, lfo)
  }

  // ─── RAIN ───
  _startRain() {
    if (!this.enabled) return
    const gain = this.sceneGains[this.currentScene]
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1000

    const rainGain = this.ctx.createGain()
    rainGain.gain.value = 0.04

    noise.connect(filter).connect(rainGain).connect(gain)
    noise.start()
    this.ambientNodes.push(noise)
  }

  // ─── BIRDS ───
  _startBirds() {
    if (!this.enabled) return
    const gain = this.sceneGains[this.currentScene]
    const playChirp = () => {
      if (this.currentScene !== 1 && this.currentScene !== 4) return
      const t = this.ctx.currentTime
      const o = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(2000 + Math.random() * 1500, t)
      o.frequency.linearRampToValueAtTime(2500 + Math.random() * 2000, t + 0.05)
      o.frequency.linearRampToValueAtTime(1800 + Math.random() * 1000, t + 0.1)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.08, t + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
      o.connect(g).connect(gain)
      o.start(t); o.stop(t + 0.15)
    }
    this.ambientNodes.push({ _interval: setInterval(playChirp, 2000 + Math.random() * 3000) })
    playChirp()
  }

  // ─── MUSIC PAD (orchestral-like sustained chord) ───
  _startMusicPad(rootFreq) {
    if (!this.enabled) return
    const gain = this.sceneGains[this.currentScene]
    const intervals = [1, 1.5, 2, 2.5, 3] // harmonic series-ish
    intervals.forEach((mult, i) => {
      const o = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      o.type = i % 2 === 0 ? 'sine' : 'triangle'
      o.frequency.value = rootFreq * mult
      g.gain.value = 0.02 / (i + 1)

      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.value = 0.2 + i * 0.1
      lfoGain.gain.value = 0.01
      lfo.connect(lfoGain).connect(g.gain)

      o.connect(g).connect(gain)
      o.start(); lfo.start()
      this.musicNodes.push(o, lfo)
    })
  }

  _startSoftPad() {
    this._startMusicPad(261.63)
  }

  // ─── PIANO NOTE ───
  playPianoNote(freq, duration = 1) {
    if (!this.enabled) return
    const t = this.ctx.currentTime
    const gain = this.sceneGains[this.currentScene] || this.masterGain
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = 'triangle'
    o.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.15, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t + duration)
    o.connect(g).connect(gain)
    o.start(t); o.stop(t + duration)
  }

  // ─── STOP / CLEANUP ───
  _stopAmbient() {
    this.ambientNodes.forEach(n => {
      try {
        if (n._interval) clearInterval(n._interval)
        else if (n.stop) n.stop()
      } catch (e) {}
    })
    this.ambientNodes = []
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  _stopMusic() {
    this.musicNodes.forEach(n => {
      try { if (n.stop) n.stop() } catch (e) {}
    })
    this.musicNodes = []
  }

  setVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = v
  }

  isMuted() { return !this.enabled }
}
