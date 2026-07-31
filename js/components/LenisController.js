/**
 * LenisController.js
 * Wraps Lenis smooth scroll and converts scroll position
 * into a 0..1 progress value fed to SceneManager.
 */
export default class LenisController {
  constructor(onScroll) {
    this.lenis = null
    this.onScroll = onScroll
    this.totalHeight = 0
  }

  init() {
    // We use a virtual scroll height — the page itself doesn't scroll visually,
    // but Lenis needs scrollable content. We create a tall spacer.
    this.totalHeight = window.innerHeight * 40 // 40 "pages" of scroll
    const spacer = document.createElement('div')
    spacer.id = 'virtual-scroll-spacer'
    spacer.style.height = this.totalHeight + 'px'
    spacer.style.width = '1px'
    spacer.style.position = 'absolute'
    spacer.style.top = '0'
    spacer.style.left = '0'
    spacer.style.pointerEvents = 'none'
    spacer.style.opacity = '0'
    document.body.appendChild(spacer)
    // Make body scrollable
    document.body.style.position = 'static'
    document.body.style.height = 'auto'
    document.body.style.overflow = 'auto'

    const Lenis = window.Lenis
    if (!Lenis) {
      // Fallback to native scroll
      window.addEventListener('scroll', () => this._handleScroll())
      this._handleScroll()
      return
    }

    this.lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    const raf = (time) => {
      this.lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    this.lenis.on('scroll', () => this._handleScroll())
  }

  _handleScroll() {
    const scrollY = this.lenis ? this.lenis.scroll : window.scrollY
    const progress = Math.min(scrollY / (this.totalHeight - window.innerHeight), 1)
    if (this.onScroll) this.onScroll(progress)
  }

  scrollTo(progress, immediate = false) {
    const target = progress * (this.totalHeight - window.innerHeight)
    if (this.lenis) {
      this.lenis.scrollTo(target, { immediate })
    } else {
      window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
    }
  }

  destroy() {
    if (this.lenis) this.lenis.destroy()
  }
}
