import Collapsible from './Collapsible'
import { compact } from '../../utils/collection'

// two number boxes + a dual-thumb slider with tick labels
export default function RangeGroup({ title, bounds, value, onChange, ticks }) {
  const { min, max, step } = bounds
  const [lo, hi] = value
  const pct = (v) => ((v - min) / (max - min)) * 100

  const setLo = (v) => onChange([Math.min(Math.max(v, min), hi), hi])
  const setHi = (v) => onChange([lo, Math.max(Math.min(v, max), lo)])
  const num = (fn) => (e) => {
    const v = Number(e.target.value)
    if (!Number.isNaN(v)) fn(v)
  }

  return (
    <Collapsible title={title}>
      <div className="rng-inputs">
        <input
          type="number"
          value={lo}
          min={min}
          max={hi}
          step={step}
          onChange={num(setLo)}
          aria-label={`${title} minimum`}
        />
        <input
          type="number"
          value={hi}
          min={lo}
          max={max}
          step={step}
          onChange={num(setHi)}
          aria-label={`${title} maximum`}
        />
      </div>
      <div className="rng-slider">
        <div className="rng-track" />
        {ticks.map((t) => (
          <span key={t} className="rng-tick" style={{ left: `${pct(t)}%` }} />
        ))}
        <div
          className="rng-fill"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={num(setLo)}
          aria-label={`${title} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={num(setHi)}
          aria-label={`${title} maximum`}
        />
      </div>
      <div className="rng-ticks" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t} style={{ left: `${pct(t)}%` }}>
            {compact(t)}
          </span>
        ))}
      </div>
    </Collapsible>
  )
}
