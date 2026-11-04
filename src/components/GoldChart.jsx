import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
];

const PAD = { top: 20, right: 12, bottom: 30, left: 56 };
const PAD_SM = { top: 16, right: 8, bottom: 26, left: 42 }; // phones: a tighter frame

const fmtPrice = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d, opts = { day: "numeric", month: "short" }) => d.toLocaleDateString("en-US", opts);
const fmtTime = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const LONG_DATE = { day: "numeric", month: "short", year: "numeric" };

// round axis values (1, 2, 2.5, 5 x 10^n) that cover [lo, hi]
function niceTicks(lo, hi, count = 5) {
  const raw = (hi - lo || 1) / (count - 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((m) => m >= raw);
  const ticks = [];
  for (let v = Math.floor(lo / step) * step; v < hi + step - 1e-9; v += step) ticks.push(v);
  return ticks;
}

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
  const [box, setBox] = useState(null);
  const [width, setWidth] = useState(800);
  // on a phone the currency list shows just the codes (AED, USD)
  const [phone, setPhone] = useState(() => window.matchMedia("(max-width: 560px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 560px)");
    const onChange = (e) => setPhone(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const { data, error } = useAsync(
    () => axiosClient.get('/gold', { params: { range: range.label } }),
    [range.label],
  );

  // the chart is drawn at the size it is shown, so the text stays sharp on every screen
  useEffect(() => {
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(box);
    return () => observer.disconnect();
  }, [box]);

  const compact = width < 560;
  const pad = compact ? PAD_SM : PAD;
  const H = compact ? 240 : 340;
  const iw = Math.max(width - pad.left - pad.right, 1);
  const ih = H - pad.top - pad.bottom;

  const rate = data?.rates?.[currency] ?? 1;
  const series = useMemo(() => {
    const list = (data?.history ?? []).map((p) => ({ date: new Date(p.date), price: p.usd * rate }));
    // finish the line on the live price
    if (list.length && data?.current?.usd != null && data.current.updatedAt) {
      const live = new Date(data.current.updatedAt);
      if (live > list.at(-1).date) list.push({ date: live, price: data.current.usd * rate });
    }
    return list;
  }, [data, rate]);

  const { points, ticks, min, max } = useMemo(() => {
    const prices = series.map((p) => p.price);
    const ticks = niceTicks(Math.min(...prices), Math.max(...prices), compact ? 4 : 5);
    const min = ticks[0];
    const max = ticks.at(-1);
    const t0 = series[0]?.date.getTime();
    const span = series.at(-1)?.date.getTime() - t0 || 1;
    // x follows the date, so gaps (weekends) show as gaps and the date labels are evenly spaced
    const points = series.map((p) => ({
      ...p,
      x: pad.left + ((p.date.getTime() - t0) / span) * iw,
      y: pad.top + (1 - (p.price - min) / (max - min || 1)) * ih,
    }));
    return { points, ticks, min, max };
  }, [series, iw, ih, compact, pad]);

  // the backend builds history over time, so a fresh install has a single point
  const hasChart = points.length > 1;
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = hasChart
    ? `${line} L${points.at(-1).x.toFixed(1)},${pad.top + ih} L${points[0].x.toFixed(1)},${pad.top + ih} Z`
    : "";

  const currentUsd = data?.current?.usd ?? series.at(-1)?.price / rate;
  const current = Number.isFinite(currentUsd) ? currentUsd * rate : null;
  const first = series[0]?.price ?? current;
  const change = current != null ? current - first : 0;
  const pct = first ? (change / first) * 100 : 0;
  const up = change >= 0;

  const prices = series.map((p) => p.price);
  const low = prices.length ? Math.min(...prices) : null;
  const high = prices.length ? Math.max(...prices) : null;

  const yPos = (v) => pad.top + (1 - (v - min) / (max - min || 1)) * ih;
  const xCount = compact ? 4 : 5;
  const xTicks = hasChart
    ? Array.from({ length: xCount }, (_, i) => {
        const t0 = points[0].date.getTime();
        const t1 = points.at(-1).date.getTime();
        return { x: pad.left + (i / (xCount - 1)) * iw, date: new Date(t0 + ((t1 - t0) * i) / (xCount - 1)) };
      })
    : [];
  const xFormat = range.label === "1Y" ? { month: "short", year: "numeric" } : undefined;

  const onMove = (e) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    let best = 0;
    for (let i = 1; i < points.length; i++) {
      if (Math.abs(points[i].x - x) < Math.abs(points[best].x - x)) best = i;
    }
    setHover(best);
  };

  const h = hasChart && hover !== null ? points[hover] : null;
  // the tooltip doesn't need hover: it rests on the current (latest) point until a point is touched/hovered
  const tip = h ?? (hasChart ? points.at(-1) : null);
  const shownPrice = h ? h.price : current;
  const shownDate = h ? h.date : data?.current?.updatedAt ? new Date(data.current.updatedAt) : null;
  const hourly = range.label === "1W";

  if (error) {
    return (
      <section className="gold">
        <h2>Gold Price</h2>
        <p className="gold-note">Gold price is unavailable right now.</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="gold" aria-busy="true" aria-label="Loading gold price">
        <div className="gold-card">
          <div className="gold-head">
            <div className="gold-title">
              <Skeleton circle width={48} height={48} />
              <div>
                <Skeleton width={120} height={22} />
                <Skeleton width={240} height={14} />
              </div>
            </div>
            <Skeleton width={180} height={40} />
          </div>
          <Skeleton width={260} height={38} style={{ marginTop: 20 }} />
          <Skeleton width={180} height={14} />
          <Skeleton width={200} height={34} style={{ margin: "16px 0" }} />
          <Skeleton height={300} />
        </div>
      </section>
    );
  }

  return (
    <section className="gold">
      <div className="gold-card">
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
                  {phone ? c.code : `${c.code} – ${c.name}`}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
        </div>

        <div className="gold-stats">
          <strong>
            <span className="gold-cur">{currency}</span> {shownPrice != null ? fmtPrice(shownPrice) : "—"}
          </strong>
          {hasChart && (
            <span className={`gold-change ${up ? "up" : "down"}`}>
              {up ? "▲" : "▼"} {fmtPrice(Math.abs(change))} ({Math.abs(pct).toFixed(2)}%) <em>{range.label}</em>
            </span>
          )}
          {shownDate && (
            <span className="gold-date">
              {fmtDate(shownDate, LONG_DATE)}
              {(h ? hourly : true) && `, ${fmtTime(shownDate)}`}
            </span>
          )}
        </div>
        <p className="gold-unit">1 Troy Ounce (31.1035 g) • 24K Gold</p>

        <div className="gold-ranges" role="tablist" aria-label="Time range">
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
            The price chart builds up as prices are recorded. Check back soon.
          </p>
        ) : (
          <div className="gold-plot" ref={setBox}>
            <svg
              className="gold-svg"
              width={width}
              height={H}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
              role="img"
              aria-label={`Gold price chart for the last ${range.label}, from ${currency} ${fmtPrice(low)} to ${fmtPrice(high)}`}
            >
              <defs>
                <linearGradient id="gold-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#c9a24b" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#c9a24b" stopOpacity="0" />
                </linearGradient>
              </defs>

              {ticks.map((v) => (
                <g key={v}>
                  <line x1={pad.left} x2={width - pad.right} y1={yPos(v)} y2={yPos(v)} className="gold-grid" />
                  <text x={pad.left - 10} y={yPos(v) + 4} textAnchor="end" className="gold-axis">
                    {Math.round(v).toLocaleString()}
                  </text>
                </g>
              ))}
              {xTicks.map((t, k) => (
                <text
                  key={k}
                  x={t.x}
                  y={H - 8}
                  className="gold-axis"
                  textAnchor={k === 0 ? "start" : k === xTicks.length - 1 ? "end" : "middle"}
                >
                  {fmtDate(t.date, xFormat)}
                </text>
              ))}

              <path d={area} fill="url(#gold-fill)" />
              <path d={line} className="gold-line" />

              {!tip && (
                <g>
                  <circle cx={points.at(-1).x} cy={points.at(-1).y} r="9" className="gold-pulse" />
                  <circle cx={points.at(-1).x} cy={points.at(-1).y} r="4.5" className="gold-dot" />
                </g>
              )}
              {tip && (
                <g>
                  <line x1={tip.x} x2={tip.x} y1={pad.top} y2={pad.top + ih} className="gold-cross" />
                  <circle cx={tip.x} cy={tip.y} r="5" className="gold-dot" />
                </g>
              )}
            </svg>

            {tip && (
              <div
                className="gold-tip"
                style={{ left: Math.min(Math.max(tip.x, 76), width - 76), top: Math.max(tip.y - 64, 0) }}
                aria-hidden="true"
              >
                <b>
                  {currency} {fmtPrice(tip.price)}
                </b>
                <span>
                  {fmtDate(tip.date, LONG_DATE)}
                  {hourly && `, ${fmtTime(tip.date)}`}
                </span>
              </div>
            )}
          </div>
        )}

        {hasChart && (
          <dl className="gold-range-stats">
            <div>
              <dt>{range.label} low</dt>
              <dd>{fmtPrice(low)}</dd>
            </div>
            <div>
              <dt>{range.label} high</dt>
              <dd>{fmtPrice(high)}</dd>
            </div>
            <div>
              <dt>{range.label} change</dt>
              <dd className={up ? "up" : "down"}>
                {up ? "+" : "−"}
                {Math.abs(pct).toFixed(2)}%
              </dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
