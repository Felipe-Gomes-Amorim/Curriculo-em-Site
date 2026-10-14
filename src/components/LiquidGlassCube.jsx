// Liquid Glass Cube — adapted from Originkit (TS -> JS, "use client" dropped: not Next.js).
// Flattened the original's base-component + preset-props wrapper split into one component —
// the preset only restated `rounding: 0`, which was already the default, so the extra layer
// of indirection had no effect. Also dropped `LiquidGlassCube.defaultProps`: React 19 no
// longer honors `defaultProps` on function components, and every prop already has a default
// via destructuring below, so it was dead code.

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PERSPECTIVE = 0.15

const DEFAULTS = {
  glass: '#FFFFFF',
  roomTop: '#FFFFFF',
  roomBottom: '#FFFFFF',
  highlight: '#FFC500',
  refraction: 20,
  dispersion: 20,
  clarity: 20,
  edge: 20,
  gloss: 20,
  speed: 5,
  direction: 'right',
  dragSensitivity: 3,
  sizePercent: 100,
}

function clamp(v, lo, hi, fallback) {
  const n = typeof v === 'number' && isFinite(v) ? v : fallback
  return Math.max(lo, Math.min(hi, n))
}

function settingsFor(cfg) {
  return {
    ior: 1.05 + clamp(cfg.refraction, 1, 20, DEFAULTS.refraction) * 0.042,
    dispersion: clamp(cfg.dispersion, 0, 20, DEFAULTS.dispersion) * 0.004,
    clarity: clamp(cfg.clarity, 1, 20, DEFAULTS.clarity) / 20,
    edge: clamp(cfg.edge, 1, 20, DEFAULTS.edge) * 0.09,
    gloss: 20 + clamp(cfg.gloss, 1, 20, DEFAULTS.gloss) * 34,
    speed: clamp(cfg.speed, 0, 20, DEFAULTS.speed) * 0.09,
    heading: cfg.direction === 'left' ? -1 : 1,
  }
}

const GLASS_VERTEX = `
    varying vec3 vNormal;
    varying vec3 vView;

    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
    }
`

const GLASS_FRAGMENT = `
    uniform vec3 uGlass;
    uniform vec3 uRoomTop;
    uniform vec3 uRoomBottom;
    uniform vec3 uHighlight;
    uniform float uIor;
    uniform float uDispersion;
    uniform float uClarity;
    uniform float uEdge;
    uniform float uGloss;

    varying vec3 vNormal;
    varying vec3 vView;

    const vec3 KEY = vec3(0.55, 0.72, 0.42);
    const vec3 FILL = vec3(-0.62, -0.28, 0.73);

    vec3 room(vec3 dir) {
        vec3 base = mix(uRoomBottom, uRoomTop, clamp(dir.y * 0.5 + 0.5, 0.0, 1.0));
        float key = pow(max(dot(dir, normalize(KEY)), 0.0), 28.0);
        float fill = pow(max(dot(dir, normalize(FILL)), 0.0), 12.0);
        return base + uHighlight * (key * 1.6 + fill * 0.35);
    }

    void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);

        if (!gl_FrontFacing) n = -n;
        float facing = gl_FrontFacing ? 1.0 : 0.45;

        float f = clamp(pow(1.0 - max(dot(n, v), 0.0), 5.0), 0.0, 1.0);
        float rim = clamp(f * uEdge, 0.0, 1.0);

        vec3 reflected = room(reflect(-v, n));

        float eta = 1.0 / max(1.001, uIor);
        vec3 rRay = refract(-v, n, eta * (1.0 + uDispersion));
        vec3 gRay = refract(-v, n, eta);
        vec3 bRay = refract(-v, n, eta * (1.0 - uDispersion));
        vec3 refracted = vec3(room(rRay).r, room(gRay).g, room(bRay).b);

        vec3 tinted = mix(refracted, refracted * uGlass, 1.0 - uClarity);

        vec3 col = mix(tinted, reflected, rim);

        float face = smoothstep(-0.35, 0.9, dot(n, normalize(KEY)));
        col *= 0.72 + face * 0.55;

        vec3 hKey = normalize(normalize(KEY) + v);
        vec3 hFill = normalize(normalize(FILL) + v);
        float spec =
            pow(max(dot(n, hKey), 0.0), uGloss) * 1.35 +
            pow(max(dot(n, hFill), 0.0), uGloss * 0.35) * 0.5 +
            pow(max(dot(n, hKey), 0.0), 6.0) * 0.12;
        col += uHighlight * spec * facing;

        float alpha = 0.05 + rim * 0.85 + clamp(spec, 0.0, 1.0) * 0.75;
        alpha += (1.0 - uClarity) * 0.16;

        alpha += face * 0.1;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0) * facing);
    }
`

class GlassScene {
  constructor(container, cfg) {
    this.container = container
    this.cfg = cfg
    this.spinAngle = 0
    this.dragX = 0
    this.dragY = 0
    this.velX = 0
    this.velY = 0
    this.isDragging = false
    this.lastX = 0
    this.lastY = 0
    this.width = 0
    this.height = 0
    this.frameId = 0
    this.lastT = 0
    this.disposed = false
    this.unbind = () => {}

    const S = settingsFor(cfg)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000)
    this.group = new THREE.Group()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    const el = this.renderer.domElement
    el.style.position = 'absolute'
    el.style.inset = '0'
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.cursor = 'grab'
    el.style.touchAction = 'none'
    container.appendChild(el)

    this.material = new THREE.ShaderMaterial({
      vertexShader: GLASS_VERTEX,
      fragmentShader: GLASS_FRAGMENT,
      uniforms: {
        uGlass: { value: new THREE.Color(cfg.glass) },
        uRoomTop: { value: new THREE.Color(cfg.roomTop) },
        uRoomBottom: { value: new THREE.Color(cfg.roomBottom) },
        uHighlight: { value: new THREE.Color(cfg.highlight) },
        uIor: { value: S.ior },
        uDispersion: { value: S.dispersion },
        uClarity: { value: S.clarity },
        uEdge: { value: S.edge },
        uGloss: { value: S.gloss },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    // A real 6-face box (24 vertices) instead of the original's rounded-cube
    // geometry (a 192x144-segment sphere warped per-vertex with `pow()` into a
    // superellipsoid — ~27k vertices doing real math). Sharp edges only, no
    // rounding control, but this is what actually made the boot animation janky:
    // building that sphere+warp twice (one per orbiting cube) right as the intro
    // text starts typing was blocking the main thread long enough to drop frames.
    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.group.add(this.mesh)
    this.scene.add(this.group)

    this.bindEvents()
  }

  bindEvents() {
    const el = this.renderer.domElement
    const down = (e) => {
      this.isDragging = true
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.velX = 0
      this.velY = 0
      el.style.cursor = 'grabbing'
    }
    const move = (e) => {
      if (!this.isDragging) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.lastX = e.clientX
      this.lastY = e.clientY
      const s = clamp(this.cfg.dragSensitivity, 0, 10, 3) * 0.007
      this.dragY += dx * s
      this.dragX += dy * s
      this.velY = dx * s
      this.velX = dy * s
    }
    const up = () => {
      this.isDragging = false
      el.style.cursor = 'grab'
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('pointerleave', up)
    this.unbind = () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.removeEventListener('pointerleave', up)
    }
  }

  start() {
    this.lastT = performance.now()
    const loop = () => {
      this.frameId = requestAnimationFrame(loop)
      this.step()
    }
    loop()
  }

  setSize(width, height) {
    if (this.disposed || width <= 0 || height <= 0) return
    this.width = width
    this.height = height
    this.renderer.setSize(width, height, false)
    this.updateCamera()
  }

  updateConfig(cfg) {
    if (this.disposed) return
    this.cfg = cfg
    const S = settingsFor(cfg)
    const u = this.material.uniforms

    u.uGlass.value.set(cfg.glass || '#ffffff')
    u.uRoomTop.value.set(cfg.roomTop || '#ffffff')
    u.uRoomBottom.value.set(cfg.roomBottom || '#000000')
    u.uHighlight.value.set(cfg.highlight || '#ffffff')
    u.uIor.value = S.ior
    u.uDispersion.value = S.dispersion
    u.uClarity.value = S.clarity
    u.uEdge.value = S.edge
    u.uGloss.value = S.gloss

    this.updateCamera()
  }

  updateCamera() {
    const w = Math.max(1, this.width)
    const h = Math.max(1, this.height)
    const aspect = w / h
    const distance = 1 / PERSPECTIVE
    const sizePct = clamp(this.cfg.sizePercent, 20, 200, 85)

    const span = 3.1 * (100 / sizePct)
    const visibleHeight = aspect < 1 ? span / aspect : span

    this.camera.aspect = aspect
    this.camera.position.set(0, 0, distance)
    this.camera.lookAt(0, 0, 0)
    this.camera.fov = 2 * Math.atan(visibleHeight / 2 / distance) * (180 / Math.PI)
    this.camera.near = Math.max(0.1, distance - 20)
    this.camera.far = distance + 20
    this.camera.updateProjectionMatrix()
  }

  step() {
    if (this.disposed) return
    const now = performance.now()
    let dt = (now - this.lastT) / 1000
    this.lastT = now
    if (!isFinite(dt) || dt < 0) dt = 0
    if (dt > 0.05) dt = 0.05

    const S = settingsFor(this.cfg)

    if (!this.isDragging) {
      const decay = Math.exp(-dt * 3)
      this.dragY += this.velY
      this.dragX += this.velX
      this.velX *= decay
      this.velY *= decay
      this.spinAngle += S.speed * S.heading * dt
    }

    this.group.rotation.y = this.spinAngle + this.dragY
    this.group.rotation.x = clamp(this.dragX * 0.5, -0.9, 0.9, 0)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frameId)
    this.unbind()
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
    const el = this.renderer.domElement
    if (el.parentNode === this.container) this.container.removeChild(el)
  }
}

export default function LiquidGlassCube(props) {
  const {
    glass = DEFAULTS.glass,
    roomTop = DEFAULTS.roomTop,
    roomBottom = DEFAULTS.roomBottom,
    highlight = DEFAULTS.highlight,
    refraction = DEFAULTS.refraction,
    dispersion = DEFAULTS.dispersion,
    clarity = DEFAULTS.clarity,
    edge = DEFAULTS.edge,
    gloss = DEFAULTS.gloss,
    speed = DEFAULTS.speed,
    direction = DEFAULTS.direction,
    dragSensitivity = DEFAULTS.dragSensitivity,
    sizePercent = DEFAULTS.sizePercent,
    style,
  } = props

  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  const cfgRef = useRef(null)
  cfgRef.current = {
    glass,
    roomTop,
    roomBottom,
    highlight,
    refraction,
    dispersion,
    clarity,
    edge,
    gloss,
    speed,
    direction,
    dragSensitivity,
    sizePercent,
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let scene
    try {
      scene = new GlassScene(container, cfgRef.current)
    } catch {
      return
    }
    sceneRef.current = scene
    scene.setSize(container.clientWidth, container.clientHeight)
    scene.start()

    const ro = new ResizeObserver(() => {
      scene.setSize(container.clientWidth, container.clientHeight)
    })
    ro.observe(container)
    return () => {
      ro.disconnect()
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.updateConfig(cfgRef.current)
  }, [
    glass,
    roomTop,
    roomBottom,
    highlight,
    refraction,
    dispersion,
    clarity,
    edge,
    gloss,
    speed,
    direction,
    dragSensitivity,
    sizePercent,
  ])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Liquid glass cube"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minWidth: 160,
        minHeight: 160,
        overflow: 'hidden',
        ...style,
      }}
    />
  )
}
