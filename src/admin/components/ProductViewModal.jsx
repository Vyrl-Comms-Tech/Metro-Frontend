import { useEffect, useId } from "react";
import { useSite } from "../../context/siteContext";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

const upperFirst = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const Row = ({ label, value }) =>
  value != null && value !== "" ? (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  ) : null;

export default function ProductViewModal({ product, onClose, onEdit }) {
  const { categories } = useSite();
  const titleId = useId();
  const { data, error, loading } = useAsync(() => axiosClient.get(`/products/get/${product.id}`), [product.id]);
  const full = data ?? product;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const main = categories.find((c) => c.slug === full.mainCategory)?.title ?? full.mainCategory;

  return (
    <div className="ad-modal">
      <div className="ad-modal-backdrop" onClick={onClose} />
      <div className="ad-modal-box" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header>
          <h2 id={titleId}>{full.variants?.[0]?.name ?? full.name}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="ad-modal-body">
          {error && <p className="ad-error" role="alert">{error.message}</p>}
          {loading && !data && <p>Loading…</p>}

          <dl className="ad-view-list">
            <Row label="Main category" value={main} />
            <Row label="Sub category" value={full.subCategory} />
            <Row label="Category" value={full.category} />
            <Row label="Gemstone" value={full.gemstone} />
            <Row label="Shape" value={full.shape} />
            <Row label="Carat weight" value={full.carat != null ? `${full.carat}ct` : null} />
            <Row label="Width" value={full.width != null ? `${full.width}mm` : null} />
            <Row label="Gender" value={full.gender} />
            <Row label="Ring covering" value={full.ringCovering} />
            <Row label="Pendant type" value={full.pendantType} />
          </dl>

          {(full.variants ?? []).map((v, i) => (
            <section className="ad-variant" key={v.productCode ?? i}>
              <div className="ad-variant-head">
                <strong>
                  Variant {i + 1}
                  {v.productCode && ` · ${v.productCode}`}
                </strong>
              </div>
              <dl className="ad-view-list">
                <Row label="Name" value={v.name} />
                <Row label="Diamond type" value={v.type} />
                <Row label="Metal" value={v.metal} />
                <Row label="Price (AED)" value={v.price != null ? v.price.toLocaleString() : null} />
                <Row label="Compare price (AED)" value={v.compareAtPrice != null ? v.compareAtPrice.toLocaleString() : null} />
                <Row label="Link" value={v.slug} />
              </dl>

              {Object.keys(v.details ?? {}).length > 0 && (
                <>
                  <h4 className="ad-view-title">Product details</h4>
                  <dl className="ad-view-list">
                    {Object.entries(v.details).map(([key, value]) => (
                      <Row key={key} label={upperFirst(key)} value={value} />
                    ))}
                  </dl>
                </>
              )}

              {v.description && (
                <>
                  <h4 className="ad-view-title">Description</h4>
                  <p className="ad-view-text">{v.description}</p>
                </>
              )}

              {v.images?.length > 0 && (
                <ul className="ad-previews">
                  {v.images.map((src) => (
                    <li key={src}>
                      <img src={src} alt="" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer>
          <button type="button" className="ad-btn ghost" onClick={onClose}>
            Close
          </button>
          <button type="button" className="ad-btn" onClick={() => onEdit(full)}>
            Edit
          </button>
        </footer>
      </div>
    </div>
  );
}
