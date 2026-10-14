import './ScreenTexture.css'

export default function ScreenTexture() {
  return (
    <div className="screen-texture" aria-hidden="true">
      <div className="screen-texture__scanlines" />
      <div className="screen-texture__vignette" />
    </div>
  )
}
