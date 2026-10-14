import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { loadModel } from './models'

const FOV = 30
const CAMERA_DISTANCE = 1 / Math.sin(THREE.MathUtils.degToRad(FOV / 2)) + 0.5
const REST_ANGLE = 0.55
const TAU = Math.PI * 2

// ONE renderer / ONE canvas for every 3D icon on the Memory Card screen. Each slot
// is a DOM element; every frame its on-screen rectangle becomes a scissored viewport
// on the shared canvas. Six <canvas>es would mean six WebGL contexts (and the site
// already runs the background and the orbiting cubes), so this keeps it to one.
export default function ModelStage({ getSlots, onSlotsChange, onFail }) {
  const hostRef = useRef(null)
  const latest = useRef({ getSlots, onSlotsChange, onFail })
  latest.current = { getSlots, onSlotsChange, onFail }

  useEffect(() => {
    const host = hostRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      latest.current.onFail?.()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const canvas = renderer.domElement
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' })
    host.appendChild(canvas)

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50)
    camera.position.set(0, 0.25, CAMERA_DISTANCE)
    camera.lookAt(0, 0, 0)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const entries = new Map() // slot key -> { scene, pivot, model, angle, scale, loading }
    let ready = new Set()
    let disposed = false
    let raf = 0
    let last = performance.now()

    const publish = () => latest.current.onSlotsChange?.(new Set(ready))

    const makeScene = () => {
      const scene = new THREE.Scene()
      scene.add(new THREE.HemisphereLight(0xffffff, 0x6a6a74, 1.5))
      const key = new THREE.DirectionalLight(0xffffff, 2.2)
      key.position.set(2.5, 3.5, 4)
      const fill = new THREE.DirectionalLight(0xbfd2ff, 0.7)
      fill.position.set(-3, 0.5, 2)
      scene.add(key, fill)
      const pivot = new THREE.Group()
      scene.add(pivot)
      return { scene, pivot }
    }

    const ensure = (slot) => {
      let e = entries.get(slot.key)
      if (e && e.model !== slot.model) {
        e.pivot.clear()
        ready.delete(slot.key)
        publish()
        e = null
      }
      if (!e) {
        const { scene, pivot } = makeScene()
        e = { scene, pivot, model: slot.model, angle: REST_ANGLE, scale: 1, loading: true }
        entries.set(slot.key, e)
        loadModel(slot.model)
          .then((root) => {
            if (disposed || entries.get(slot.key) !== e) return
            e.pivot.add(root.clone(true))
            e.loading = false
            ready.add(slot.key)
            publish()
          })
          .catch(() => latest.current.onFail?.())
      }
      return e
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) {
        last = now
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
        renderer.setSize(w, h, false)
      }
      const hostRect = host.getBoundingClientRect()

      const slots = latest.current.getSlots().filter((s) => s.el)
      const live = new Set(slots.map((s) => s.key))
      for (const [key, e] of entries) {
        if (!live.has(key)) {
          entries.delete(key)
          if (ready.delete(key)) publish()
          e.pivot.clear()
        }
      }

      renderer.setScissorTest(true)
      renderer.setViewport(0, 0, w, h)
      renderer.setScissor(0, 0, w, h)
      renderer.clear()
      for (const slot of slots) {
        const e = ensure(slot)
        if (e.loading) continue
        const r = slot.el.getBoundingClientRect()
        if (r.width < 2 || r.height < 2 || r.bottom < hostRect.top || r.top > hostRect.bottom) continue

        if (slot.active && !reduceMotion) {
          e.angle += dt * 1.5
        } else if (slot.active) {
          // reduced motion: no full turns, just a gentle horizontal sway
          e.angle = REST_ANGLE + Math.sin(now / 600) * 0.6
        } else {
          const target = Math.round((e.angle - REST_ANGLE) / TAU) * TAU + REST_ANGLE
          e.angle += (target - e.angle) * Math.min(1, dt * 7)
        }
        const wantScale = slot.active ? 1.14 : 1
        e.scale += (wantScale - e.scale) * Math.min(1, dt * 8)
        e.pivot.rotation.y = e.angle
        e.pivot.scale.setScalar(e.scale)
        e.pivot.position.y = slot.active && !reduceMotion ? Math.sin(now / 420) * 0.05 : 0

        const x = r.left - hostRect.left
        const y = hostRect.bottom - r.bottom
        camera.aspect = r.width / r.height
        camera.updateProjectionMatrix()
        renderer.setViewport(x, y, r.width, r.height)
        renderer.setScissor(x, y, r.width, r.height)
        renderer.render(e.scene, camera)
      }
    }
    raf = requestAnimationFrame(frame)

    const onLost = (ev) => {
      ev.preventDefault()
      latest.current.onFail?.()
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', onLost)
      // Geometries/materials live in the shared model cache (reused across mounts),
      // so only the per-visit renderer is torn down here.
      renderer.dispose()
      canvas.remove()
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} />
}
