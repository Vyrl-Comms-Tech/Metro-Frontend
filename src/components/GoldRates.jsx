import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosClient from "../utils/axiosClient";
import { useAsync } from "../utils/useAsync";
import "../styles/GoldRates.css";

// API returns { rates: [{ label: "24K GOLD", aed: 437.5 }, ...], asOf: "2026-11-27T06:36:47+04:00" }
const GOLD_ENDPOINT = "/gold";

const fmt = (n) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// the time the rates were published, always shown in UAE time wherever the visitor is
const formatAsOf = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function GoldRates() {
  const { data, error } = useAsync(() => axiosClient.get(GOLD_ENDPOINT), []);
  const RATES = data?.rates ?? [];

  // hide the card if the request fails or sends no rates
  if (error || (data && !RATES.length)) return null;

  return (
    <section className="gold-rates-section">
      <div className="gold-rates">
        <div className="gold-rates-head">
          <div>
            <h2>
              Today's Suggested Retail
              <br />
              Gold Jewellery Price
            </h2>
            <p className="gold-rates-unit">Rates in AED / Gram</p>
          </div>
        </div>

        <ul className="gold-rates-list">
          {!data
            ? Array.from({ length: 5 }, (_, i) => (
              <li key={i}>
                <Skeleton width={90} baseColor="var(--brand-white-glow)" highlightColor="var(--brand-white-soft)" />
                <Skeleton width={110} baseColor="var(--brand-white-glow)" highlightColor="var(--brand-white-soft)" />
              </li>
            ))
            : RATES.map((r) => (
              <li key={r.label}>
                <span>{r.label}</span>
                <strong>AED {fmt(r.aed)}</strong>
              </li>
            ))}
        </ul>

        {data?.asOf && (
          <p className="gold-rates-updated">
            Updated <time dateTime={data.asOf}>{formatAsOf(data.asOf)}</time> (UAE time)
          </p>
        )}
      </div>
    </section>
  );
}
