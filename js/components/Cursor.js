/**
 * Cursor.js
 * Custom glowing cursor that emits particles and reacts to hover.
 * Uses GSAP for smooth lag-follow on the ring.
 */
export default class Cursor {
  constructor() {
    this.dot = document.getElementById('cursor-dot')
    this.ring = document.getElementById('cursor-ring')
    this.particleContainer = document.getElementById('cursor-particles')
    this.x = window.innerWidth / 2
    this.y = window.innerHeight / 2
    this.ringX = this.x
    this.ringY = this.y
    this.lastSpark = 0
    this.sparks = []
    this.gsap = window.gsap
    this._bind()
  }

  _bind() {
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX
      this.y = e.clientY
      this.dot.style.transform = `translate(${this.x}px, ${this.y}px)`
      this._emitSpark(e.clientX, e.clientY)
    })

    window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'))
    window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'))

    // Hover detection on interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, .memory-card, .game-card, [data-cursor-hover]')) {
        document.body.classList.add('cursor-hover')
      }
    })
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('button, a, .memory-card, .game-card, [data-cursor-hover]')) {
        document.body.classList.remove('cursor-hover')
      }
    })

    this._tick()
  }

  _emitSpark(x, y) {
    const now = performance.now()
    if (now - this.lastSpark < 40) return
    this.lastSpark = now

    const spark = document.createElement('div')
    spark.className = 'cursor-spark'
    spark.style.left = x + 'px'
    spark.style.top = y + 'px'
    this.particleContainer.appendChild(spark)

    const angle = Math.random() * Math.PI * 2
    const dist = 20 + Math.random() * 40
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist

    if (this.gsap) {
      this.gsap.to(spark, {
        x: dx, y: dy, opacity: 0, scale: 0,
        duration: 0.8, ease: 'power2.out',
        onComplete: () => spark.remove(),
      })
    } else {
      spark.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
      ], { duration: 800, easing: 'ease-out' }).onfinish = () => spark.remove()
    }
  }

  _tick() {
    requestAnimationFrame(() => this._tick())
    // Ring follows with lag
    this.ringX += (this.x - this.ringX) * 0.15
    this.ringY += (this.y - this.ringY) * 0.15
    this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`
  }
}
