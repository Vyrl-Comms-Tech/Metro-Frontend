import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "../api/client";
import { useSite } from "../context/siteContext";
import "../styles/Categories.css";

export default function Categories() {
  const categories = useSite().categories.filter((c) => c.showOnHome);
  const hasItems = categories.length > 0;
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  // fade the cards in the first time the section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasItems]);

  // no collections set up yet
  if (!hasItems) return null;

  return (
    <section className="categories" ref={ref}>
      <header className="cat-head">
        <span className="cat-eyebrow">Our Collections</span>
        <h2>Shop by Category</h2>
        <p>Handcrafted diamond jewellery, made to order in Dubai.</p>
      </header>

      <div className={`cat-grid ${seen ? "is-in" : ""}`}>
        {categories.map((c, i) => (
          <Link
            key={c.id}
            to={`/collections/${c.slug}`}
            className="cat-card"
            style={{ "--i": i }}
          >
            <div
              className="cat-img"
              style={{
                ...(c.image
                  ? { backgroundImage: `url(${assetUrl(c.image)})` }
                  : {}),
              }}
            >
              {c.tag && <span className="cat-tag">{c.tag}</span>}
            </div>
            <div className="cat-body">
              <div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
              <span className="cat-arrow" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="cat-foot">
        <Link to="/collections/jewellery" className="cat-all">
          View All Jewellery
        </Link>
      </div>
    </section>
  );
}
