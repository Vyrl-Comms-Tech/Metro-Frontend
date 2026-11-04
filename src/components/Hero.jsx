import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/siteContext'
import '../styles/Hero.css'

const SLIDE_INTERVAL_MS = 4000 // how long each slide stays before moving to the next

export default function Hero() {
  const { homeBanner } = useSite().content
  const [active, setActive] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const pointerStart = useRef(null)
  const swiped = useRef(false)
  const autoDirection = useRef(1)

  const slides = [
    {
      heading: homeBanner.heading,
      buttonText: homeBanner.buttonText,
      image: '/hero-wedding-rings.png',
      to: '/collections/rings/wedding-rings',
      className: 'hero-slide-rings',
    },
    {
      heading: 'Earrings for every occasion',
      buttonText: 'Shop Earrings',
      image: '/hero-earrings.png',
      to: '/collections/earrings',
      className: 'hero-slide-earrings',
    },
    {
      heading: 'Bracelets made to shine',
      buttonText: 'Shop Bracelets',
      image: '/hero-bracelets.png',
      to: '/collections/bracelets',
      className: 'hero-slide-bracelets',
    },
  ]

  useEffect(() => {
    // a tap on a touch screen also counts as hover and focus, so only a mouse or keyboard user pauses the slides
    const touch = window.matchMedia('(hover: none)').matches
    if (dragging || (!touch && (hovered || focused)) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      setActive((index) => {
        if (index === slides.length - 1) autoDirection.current = -1
        if (index === 0) autoDirection.current = 1
        return index + autoDirection.current
      })
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [active, dragging, hovered, focused, slides.length])

  const go = (direction) => setActive((index) => Math.max(0, Math.min(slides.length - 1, index + direction)))
  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    pointerStart.current = event.clientX
    swiped.current = false
  }
  const onPointerMove = (event) => {
    if (pointerStart.current == null) return
    const distance = event.clientX - pointerStart.current
    if (Math.abs(distance) < 8 && !dragging) return
    if (!dragging) {
      setDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setDragX(distance)
  }
  const onPointerUp = (event) => {
    if (pointerStart.current == null) return
    const distance = event.clientX - pointerStart.current
    pointerStart.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false)
    setDragX(0)
    if (Math.abs(distance) >= 50) {
      swiped.current = true
      go(distance < 0 ? 1 : -1)
    }
  }

  return (
    <section
      className={`hero ${dragging ? 'is-dragging' : ''}`}
      aria-label="Featured jewellery collections. Drag to browse or use the left and right arrow keys."
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); go(1) }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerStart.current = null
        setDragging(false)
        setDragX(0)
      }}
      onClickCapture={(event) => {
        if (!swiped.current) return
        event.preventDefault()
        event.stopPropagation()
        swiped.current = false
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.className}
          className={`hero-slide ${slide.className} ${index === active ? 'is-active' : ''}`}
          style={{ '--slide-position': `${(index - active) * 100}%`, '--drag-x': `${dragX}px` }}
          aria-hidden={index !== active}
          inert={index !== active}
        >
          <img
            className="hero-photo"
            src={slide.image}
            alt=""
            draggable="false"
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
          />
          <div className="hero-copy">
            <h1>{slide.heading}</h1>
            <Link className="hero-btn" to={slide.to}>{slide.buttonText}</Link>
          </div>
        </div>
      ))}

      <div className="hero-dots" role="tablist" aria-label="Choose a slide" onPointerDown={(event) => event.stopPropagation()}>
        {slides.map((slide, index) => (
          <button
            key={slide.className}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Slide ${index + 1}: ${slide.heading}`}
            className={index === active ? 'on' : ''}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  )
}
