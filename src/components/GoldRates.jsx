import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosClient from "../utils/axiosClient";
import { useAsync } from "../utils/useAsync";
import "../styles/GoldRates.css";

// API returns today's rates only: [{ label: "24K GOLD", aed: 427.81 }, ...]
const GOLD_ENDPOINT = "/gold";

const fmt = (n) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

export default function GoldRates() {
  const { data, error } = useAsync(() => axiosClient.get(GOLD_ENDPOINT), []);
  const RATES = Array.isArray(data) ? data : [];

  if (error) return null;

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

        <p className="gold-rates-updated">Updated {today()}</p>
      </div>
    </section>
  );
}
