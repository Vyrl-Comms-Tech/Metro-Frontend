import { useRef, useState } from 'react'
import '../styles/Reels.css'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'

const pad = (n) => String(n + 1).padStart(2, '0')

const DEFAULT_TINT = ['#e9d6c6', '#a98b74']

// https://www.instagram.com/reel/XXXX/?igsh=… -> https://www.instagram.com/reel/XXXX/embed
const embedUrl = (href) => {
  const m = /instagram\.com\/(reel|reels|p|tv)\/([\w-]+)/i.exec(href ?? '')
  return m ? `https://www.instagram.com/${m[1] === 'reels' ? 'reel' : m[1]}/${m[2]}/embed` : ''
}

// shortest signed distance from the active card, wrapping around the loop
const offsetOf = (i, active, n) => {
  let d = (i - active + n) % n
  if (d > n / 2) d -= n
  return d
}

export default function Reels() {
  const { data } = useAsync(() => axiosClient.get('/reels', { params: { limit: 100 } }), [])
  const reels = (data?.items ?? []).map((r) => ({
    ...r,
    tint: r.tint?.length >= 2 ? r.tint : DEFAULT_TINT,
    video: r.video,
    poster: r.poster,
  }))

  // no reels added in the admin yet
  if (reels.length === 0) return null
  return <ReelCarousel reels={reels} />
}

function ReelCarousel({ reels }) {
  const N = reels.length
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const startX = useRef(null)

  // Newly selected videos start muted so browsers can autoplay them.
  const select = (index) => {
    setMuted(true)
    setActive(index)
  }
  const go = (dir) => select((active + dir + N) % N)

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }
  const onDown = (e) => { startX.current = e.clientX }
  const onUp = (e) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  return (
    <section className="reels" aria-roledescription="carousel" aria-label="Customer reels">
      <header className="reels-head">
        <span className="reels-eyebrow">@metrojewellers</span>
        <h2>Loved by Our Clients</h2>
        <p>Real stories, real sparkle — straight from Instagram.</p>
      </header>

      <div className="reels-stage" tabIndex={0} onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp}>
        <span className="reels-num left" aria-hidden="true">{pad((active - 1 + N) % N)}</span>

        {reels.map((r, i) => {
          const off = offsetOf(i, active, N)
          const isActive = off === 0
          const canEmbed = !r.video && Boolean(embedUrl(r.href))
          const showEmbed = isActive && canEmbed
          return (
            <article
              key={r.id}
              className={`reel ${isActive ? 'is-active' : ''}`}
              style={{
                '--off': off,
                '--t1': r.tint[0],
                '--t2': r.tint[1],
                ...(r.poster ? { backgroundImage: `url(${r.poster})` } : {}),
              }}
              aria-hidden={Math.abs(off) > 1}
              aria-label={`${i + 1} of ${N}: ${r.name}`}
              onClick={() => !isActive && select(i)}
            >
              {isActive && r.video && (
                <video className="reel-video" src={r.video} poster={r.poster || undefined} autoPlay loop muted={muted} playsInline />
              )}

              {isActive && r.video && (
                <button className="reel-mute" aria-label={muted ? 'Unmute' : 'Mute'} onClick={(e) => { e.stopPropagation(); setMuted((m) => !m) }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                    {muted && <path d="m16 9 5 6m0-6-5 6" fill="none" strokeLinecap="round" />}
                  </svg>
                </button>
              )}

              {showEmbed && (
                <div className="reel-embed-crop">
                  <div className="reel-embed-frame">
                    <iframe src={embedUrl(r.href)} title={r.name || 'Instagram reel'} loading="lazy" allow="autoplay; fullscreen" allowFullScreen />
                  </div>
                </div>
              )}

              {!r.video && !showEmbed && (
                <span className="reel-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
              )}

              {!showEmbed && (r.name || r.video || !canEmbed) && (
                <div className="reel-info">
                  {r.name && <h3>{r.name}</h3>}
                  <ul>{(r.tags ?? []).map((t) => <li key={t}>{t}</li>)}</ul>
                  <a href={r.href} target="_blank" rel="noreferrer" tabIndex={isActive ? 0 : -1}>Watch Reel</a>
                </div>
              )}
            </article>
          )
        })}

        <span className="reels-num right" aria-hidden="true">{pad((active + 1) % N)}</span>
      </div>

      <div className="reels-controls">
        <button onClick={() => go(-1)} aria-label="Previous reel">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        </button>
        <div className="reels-dots">
          {reels.map((r, i) => (
            <button key={r.id} className={i === active ? 'on' : ''} onClick={() => select(i)} aria-label={`Go to reel ${i + 1}`} aria-current={i === active} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next reel">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </section>
  )
}
