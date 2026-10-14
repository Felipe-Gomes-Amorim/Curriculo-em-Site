import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import robotUrl from '../../assets/models/robot.glb?url'
import laptopUrl from '../../assets/models/laptop.glb?url'
import toolboxUrl from '../../assets/models/toolbox.glb?url'

// Downloaded models (optimized: animation/skin stripped, pose baked, quantized):
//   robot   — "Animated Robot" by Quaternius, CC0
//   laptop  — "Laptop / MacBook Pro" by Alex Safayan, CC BY 3.0 (via Poly Pizza)
//   toolbox — "Toolbox" by jeremy, CC BY 3.0 (via Poly Pizza)
// The rest are built from primitives below, so they match the same flat low-poly look.
// Credits shown on screen live in data/skills.js (this file pulls in three.js).

const FILES = { robot: robotUrl, laptop: laptopUrl, toolbox: toolboxUrl }

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.55, metalness: 0.1, ...extra })

function database() {
  const g = new THREE.Group()
  const body = mat('#6e5bd6')
  const plate = mat('#b9afff')
  for (let i = 0; i < 3; i++) {
    const y = i * 0.62 - 0.62
    const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.5, 20), body)
    disk.position.y = y
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.97, 0.08, 20), plate)
    cap.position.y = y + 0.29
    g.add(disk, cap)
    // front status light
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.06), mat(i === 1 ? '#ffb347' : '#5cf2c8', { emissive: i === 1 ? '#ff9a1f' : '#2fe0b0', emissiveIntensity: 0.8 }))
    led.position.set(0.5, y, 0.93)
    g.add(led)
  }
  return g
}

function browser() {
  const g = new THREE.Group()
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.7, 0.16), mat('#2a6fd6'))
  const header = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 0.2), mat('#1d4f9e'))
  header.position.set(0, 0.7, 0.02)
  g.add(frame, header)
  ;['#ff7a7a', '#ffd27a', '#7af0a0'].forEach((c, i) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat(c))
    dot.position.set(-1.0 + i * 0.2, 0.7, 0.14)
    g.add(dot)
  })
  const white = mat('#eaf6ff')
  const side = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.0, 0.1), white)
  side.position.set(-0.75, -0.12, 0.12)
  g.add(side)
  ;[0.28, -0.05, -0.38].forEach((y, i) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.15 - i * 0.25, 0.2, 0.1), mat('#cfe6ff'))
    bar.position.set(0.55 - i * 0.12, y, 0.12)
    g.add(bar)
  })
  return g
}

function speech() {
  const g = new THREE.Group()
  const a = new THREE.Group()
  a.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.0, 0.34), mat('#1f9fb0')))
  const tailA = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 4), mat('#1f9fb0'))
  tailA.position.set(-0.5, -0.7, 0)
  tailA.rotation.set(0, Math.PI / 4, Math.PI)
  a.add(tailA)
  ;[0.22, -0.05].forEach((y, i) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.1 - i * 0.35, 0.12, 0.1), mat('#0e5d68'))
    line.position.set(-0.1 - i * 0.17, y, 0.2)
    a.add(line)
  })
  a.position.set(-0.35, 0.4, 0)
  const b = new THREE.Group()
  b.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.34), mat('#f2f5f8')))
  const tailB = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.45, 4), mat('#f2f5f8'))
  tailB.position.set(0.45, -0.62, 0)
  tailB.rotation.set(0, Math.PI / 4, Math.PI)
  b.add(tailB)
  const lineB = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.1), mat('#5b6b7a'))
  lineB.position.set(0.05, 0.05, 0.2)
  b.add(lineB)
  b.position.set(0.45, -0.55, 0.45)
  g.add(a, b)
  return g
}

const BUILDERS = { database, browser, speech }

const loader = new GLTFLoader()
const cache = new Map()

// Resolves to a Group centred on the origin and scaled so its bounding sphere has
// radius 1 — every model then fits a tile the same way regardless of source units.
export function loadModel(id) {
  if (!cache.has(id)) {
    const make = BUILDERS[id]
      ? Promise.resolve(BUILDERS[id]())
      : loader.loadAsync(FILES[id]).then((gltf) => gltf.scene)
    cache.set(
      id,
      make.then((obj) => {
        const root = new THREE.Group()
        root.add(obj)
        const box = new THREE.Box3().setFromObject(obj)
        const sphere = box.getBoundingSphere(new THREE.Sphere())
        obj.position.sub(sphere.center)
        root.scale.setScalar(1 / sphere.radius)
        return root
      })
    )
  }
  return cache.get(id)
}

export function disposeModelCache() {
  cache.forEach((p) =>
    p.then((root) =>
      root.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose()
          ;(Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        }
      })
    )
  )
  cache.clear()
}
