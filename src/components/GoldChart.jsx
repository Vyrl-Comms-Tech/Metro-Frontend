import { useMemo, useState } from "react";
import "../styles/GoldChart.css";

const RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

const W = 800;
const H = 320;
const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

// Placeholder series (seeded random walk) until a real price feed is wired in.
// Pass `data` as [{ date: Date, price: number }] to replace it.
function sampleData(days = 365, start = 2300) {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const out = [];
  let price = start;
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    price += (rnd() - 0.46) * 22;
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({ date: d, price: Math.round(price * 100) / 100 });
  }
  return out;
}

const fmtPrice = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d, long) =>
  d.toLocaleDateString(
    "en-US",
    long
      ? { day: "numeric", month: "short", year: "numeric" }
      : { day: "numeric", month: "short" },
  );

export default function GoldChart({ data, unit = "USD / oz" }) {
  const [range, setRange] = useState(RANGES[1]);
  const [hover, setHover] = useState(null);

  const all = useMemo(() => data ?? sampleData(), [data]);
  const series = useMemo(() => all.slice(-range.days), [all, range]);

  const { points, min, max } = useMemo(() => {
    const prices = series.map((p) => p.price);
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const pad = (hi - lo || 1) * 0.1;
    const min = lo - pad;
    const max = hi + pad;
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const points = series.map((p, i) => ({
      ...p,
      x: PAD.left + (i / (series.length - 1)) * iw,
      y: PAD.top + (1 - (p.price - min) / (max - min)) * ih,
    }));
    return { points, min, max };
  }, [series]);

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${points.at(-1).x},${H - PAD.bottom} L${points[0].x},${H - PAD.bottom} Z`;

  const first = series[0].price;
  const last = series.at(-1).price;
  const change = last - first;
  const pct = (change / first) * 100;
  const up = change >= 0;

  const yTicks = Array.from(
    { length: 5 },
    (_, i) => min + ((max - min) * i) / 4,
  );
  const yPos = (v) =>
    PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const xTickIdx = Array.from({ length: 5 }, (_, i) =>
    Math.round((i / 4) * (points.length - 1)),
  );

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (x - PAD.left) / (W - PAD.left - PAD.right);
    setHover(
      Math.max(
        0,
        Math.min(points.length - 1, Math.round(ratio * (points.length - 1))),
      ),
    );
  };

  const h = hover !== null ? points[hover] : null;
  const shown = h ?? points.at(-1);

  return (
    <section className="gold">
      <div className="gold-head">
        <div>
          <h2>Gold Price</h2>
          <p className="gold-sub">Sample data · {unit}</p>
        </div>
        <div className="gold-ranges" role="tablist">
          {RANGES.map((r) => (
            <button
              key={r.label}
              role="tab"
              aria-selected={r === range}
              className={r === range ? "on" : ""}
              onClick={() => {
                setRange(r);
                setHover(null);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="gold-stats">
        <strong>{fmtPrice(shown.price)}</strong>
        <span className={`gold-change ${up ? "up" : "down"}`}>
          {up ? "▲" : "▼"} {fmtPrice(Math.abs(change))} (
          {Math.abs(pct).toFixed(2)}%) <em>{range.label}</em>
        </span>
        <span className="gold-date">{fmtDate(shown.date, true)}</span>
      </div>

      <svg
        className="gold-svg"
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`Gold price chart, ${range.label}`}
      >
        <defs>
          <linearGradient id="gold-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9a24b" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c9a24b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yPos(v)}
              y2={yPos(v)}
              className="gold-grid"
            />
            <text
              x={PAD.left - 8}
              y={yPos(v) + 4}
              textAnchor="end"
              className="gold-axis"
            >
              {Math.round(v).toLocaleString()}
            </text>
          </g>
        ))}
        {xTickIdx.map((i, k) => (
          <text
            key={i}
            x={points[i].x}
            y={H - 8}
            className="gold-axis"
            textAnchor={
              k === 0 ? "start" : k === xTickIdx.length - 1 ? "end" : "middle"
            }
          >
            {fmtDate(points[i].date)}
          </text>
        ))}

        <path d={area} fill="url(#gold-fill)" />
        <path d={line} className="gold-line" />

        {h && (
          <g>
            <line
              x1={h.x}
              x2={h.x}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="gold-cross"
            />
            <circle cx={h.x} cy={h.y} r="5" className="gold-dot" />
          </g>
        )}
      </svg>
    </section>
  );
}
