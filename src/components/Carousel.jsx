import { useCallback, useEffect, useRef, useState } from 'react'
import './Carousel.css'

const AUTO_NEXT_MS = 7000

function rotate(order, direction) {
  if (direction === 'next') {
    return [...order.slice(1), order[0]]
  }
  return [order[order.length - 1], ...order.slice(0, -1)]
}

export default function Carousel({ projects }) {
  const [order, setOrder] = useState(projects.map((p) => p.id))
  const [direction, setDirection] = useState('next')
  const autoTimer = useRef(null)

  const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
  const active = byId[order[0]]
  const thumbnails = order.slice(1).map((id) => byId[id])

  const goTo = useCallback((dir) => {
    setDirection(dir)
    setOrder((current) => rotate(current, dir))
  }, [])

  const goToId = useCallback((id) => {
    setDirection('next')
    setOrder((current) => {
      const index = current.indexOf(id)
      return [...current.slice(index), ...current.slice(0, index)]
    })
  }, [])

  useEffect(() => {
    clearTimeout(autoTimer.current)
    autoTimer.current = setTimeout(() => goTo('next'), AUTO_NEXT_MS)
    return () => clearTimeout(autoTimer.current)
  }, [order, goTo])

  return (
    <div className="carousel">
      <div className="carousel__stage" key={active.id}>
        <img className="carousel__bg" src={active.image} alt={`fundo ${active.name}`} />
        <div className="carousel__content">
          <div className="carousel__stack">{active.stack}</div>
          <h1 className="carousel__name">{active.name}</h1>
          <div className="carousel__type">{active.type}</div>
          <p className="carousel__description">{active.description}</p>
          <div className="carousel__buttons">
            <button type="button">VER MAIS</button>
            <a href={active.github} target="_blank" rel="noreferrer">
              <button type="button">GITHUB</button>
            </a>
          </div>
        </div>
        <div className="carousel__timer" key={`timer-${active.id}`} />
      </div>

      <div className="carousel__thumbnails">
        {thumbnails.map((project) => (
          <button
            key={project.id}
            type="button"
            className="carousel__thumb"
            onClick={() => goToId(project.id)}
          >
            <img src={project.image} alt={`icone ${project.name}`} />
            <div className="carousel__thumb-content">
              <div className="carousel__thumb-title">{project.name}</div>
              <div className="carousel__thumb-description">{project.stack}</div>
            </div>
          </button>
        ))}
      </div>

      <div className={`carousel__arrows carousel__arrows--${direction}`}>
        <button type="button" onClick={() => goTo('prev')} aria-label="Projeto anterior">
          &lt;
        </button>
        <button type="button" onClick={() => goTo('next')} aria-label="Próximo projeto">
          &gt;
        </button>
      </div>
    </div>
  )
}
