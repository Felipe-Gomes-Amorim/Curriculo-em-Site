import { Suspense, lazy } from 'react'
import './OrbitingCubes.css'

const LiquidGlassCube = lazy(() => import('./LiquidGlassCube'))

const ORBIT_RADIUS = 300
const ORBIT_DURATION_S = 16

const SLOTS = [
  { angleOffsetDeg: 0, direction: 'right', size: 220 },
  { angleOffsetDeg: 180, direction: 'left', size: 150 },
]

export default function OrbitingCubes({ palette, style }) {
  return (
    <div style={{ position: 'absolute', inset: 0, ...style }}>
      {SLOTS.map((slot) => (
        <div
          key={slot.angleOffsetDeg}
          className="orbit-pivot"
          style={{
            '--orbit-duration': `${ORBIT_DURATION_S}s`,
            '--orbit-delay': `${(slot.angleOffsetDeg / 360) * -ORBIT_DURATION_S}s`,
          }}
        >
          <div
            className="orbit-satellite"
            style={{
              '--orbit-duration': `${ORBIT_DURATION_S}s`,
              '--orbit-delay': `${(slot.angleOffsetDeg / 360) * -ORBIT_DURATION_S}s`,
              '--orbit-radius': `${ORBIT_RADIUS}px`,
              width: slot.size,
              height: slot.size,
            }}
          >
            <Suspense fallback={null}>
              <LiquidGlassCube
                glass="#ffffff"
                roomTop={palette.outer}
                roomBottom={palette.core}
                highlight={palette.mid}
                refraction={16}
                dispersion={12}
                clarity={9}
                edge={15}
                gloss={13}
                speed={6}
                direction={slot.direction}
                sizePercent={100}
              />
            </Suspense>
          </div>
        </div>
      ))}
    </div>
  )
}
