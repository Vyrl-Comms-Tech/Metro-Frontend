import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { useAsync } from "../utils/useAsync";
import "../styles/GoldChart.css";

const RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

const CURRENCIES = [
  { code: "AED", name: "UAE Dirham" },
  { code: "USD", name: "US Dollar" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "QAR", name: "Qatari Riyal" },
];

const W = 800;
const H = 320;
const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

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

function GoldBarsIcon({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gold-bars-top" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF0A8" />
          <stop offset="0.5" stopColor="#F8C84B" />
          <stop offset="1" stopColor="#D99508" />
        </linearGradient>
        <linearGradient id="gold-bars-front" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFD65C" />
          <stop offset="1" stopColor="#E3A11A" />
        </linearGradient>
        <linearGradient id="gold-bars-side" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#D9940B" />
          <stop offset="1" stopColor="#B87306" />
        </linearGradient>
      </defs>
      <g stroke="#C48A15" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M45 39 57 18h24l12 21-12 9H57Z" fill="url(#gold-bars-top)" />
        <path d="M45 39h48l-6 29H51Z" fill="url(#gold-bars-front)" />
        <path d="M93 39 81 48l6 20 13-12Z" fill="url(#gold-bars-side)" />
        <path d="M12 82 27 60h30l14 22-13 11H25Z" fill="url(#gold-bars-top)" />
        <path d="M12 82h59l-8 27H19Z" fill="url(#gold-bars-front)" />
        <path d="M71 82 58 93l5 16 15-13Z" fill="url(#gold-bars-side)" />
        <path d="M62 82 77 60h29l14 22-13 11H75Z" fill="url(#gold-bars-top)" />
        <path d="M62 82h58l-8 27H69Z" fill="url(#gold-bars-front)" />
        <path d="M120 82 107 93l5 16 12-12Z" fill="url(#gold-bars-side)" />
      </g>
      <path d="m57 23 22 0M28 65h25M78 65h25" stroke="#FFF5C9" strokeWidth="2" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}

export default function GoldChart() {
  const [range, setRange] = useState(RANGES[1]);
  const [currency, setCurrency] = useState("AED");
  const [hover, setHover] = useState(null);

  const { data, error } = useAsync(
    () => axiosClient.get('/gold', { params: { range: range.label } }),
    [range.label],
  );

  const rate = data?.rates?.[currency] ?? 1;
  const series = useMemo(
    () =>
      (data?.history ?? []).map((p) => ({
        date: new Date(p.date),
        price: p.usd * rate,
      })),
    [data, rate],
  );

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

  // the backend builds history over time, so a fresh install has a single point
  const hasChart = points.length > 1;
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = hasChart
    ? `${line} L${points.at(-1).x},${H - PAD.bottom} L${points[0].x},${H - PAD.bottom} Z`
    : "";

  const currentUsd = data?.current?.usd ?? series.at(-1)?.price / rate;
  const current = Number.isFinite(currentUsd) ? currentUsd * rate : null;
  const first = series[0]?.price ?? current;
  const change = current != null ? current - first : 0;
  const pct = first ? (change / first) * 100 : 0;
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

  const h = hasChart && hover !== null ? points[hover] : null;
  const shownPrice = h ? h.price : current;
  const shownDate = h ? h.date : data?.current?.updatedAt ? new Date(data.current.updatedAt) : null;

  if (error) {
    return (
      <section className="gold">
        <h2>Gold Price</h2>
        <p className="gold-note">Gold price is unavailable right now.</p>
      </section>
    );
  }

  return (
    <section className="gold">
      <div className="gold-head">
        <div className="gold-title">
          <span className="gold-icon" aria-hidden="true">
            <GoldBarsIcon />
          </span>
          <div>
            <h2>Gold Price</h2>
            <p className="gold-sub">Live international gold price per troy ounce</p>
          </div>
        </div>
        <label className="gold-currency">
          <span className="sr-only">Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} – {c.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
      </div>

      <div className="gold-stats">
        <strong>
          {currency} {shownPrice != null ? fmtPrice(shownPrice) : "—"}
        </strong>
        {hasChart && (
          <span className={`gold-change ${up ? "up" : "down"}`}>
            {up ? "▲" : "▼"} {fmtPrice(Math.abs(change))} (
            {Math.abs(pct).toFixed(2)}%) <em>{range.label}</em>
          </span>
        )}
        {shownDate && <span className="gold-date">{fmtDate(shownDate, true)}</span>}
      </div>
      <p className="gold-unit">1 Troy Ounce (31.1035 g) • 24K Gold</p>

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

      {!hasChart ? (
        <p className="gold-note">
          {data
            ? "The price chart builds up as prices are recorded. Check back soon."
            : "Loading gold price…"}
        </p>
      ) : (
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
      )}
    </section>
  );
}
