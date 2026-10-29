import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { useAsync } from "../utils/useAsync";
import "../styles/Categories.css";

export default function Categories() {
  const { data, error, loading } = useAsync(
    () => axiosClient.get("/categories/getAll", { params: { limit: 100 } }),
    [],
  );
  const loaded = !loading || Boolean(error);
  // tolerate either { items: [...] } or a bare array from the API
  const categories = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  // only collections the admin has switched on for the home page
  const featuredCategories = categories.filter((c) => c.active !== false && c.showOnHome !== false);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

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
  }, []);

  return (
    <section className="categories" ref={ref} aria-labelledby="categories-title">
      <header className="cat-head">
        <span className="cat-eyebrow">Our Collections</span>
        <h2 id="categories-title">Shop by Category</h2>
        <p>Handcrafted diamond jewellery, made to order in Dubai.</p>
      </header>

      {loaded && featuredCategories.length === 0 && (
        <p className="cat-empty">Collections are coming soon.</p>
      )}

      <div className={`cat-grid ${seen ? "is-in" : ""}`}>
        {featuredCategories.map((c, i) => (
          <Link
            key={c.slug}
            to={`/collections/${c.slug}`}
            className="cat-card"
            style={{ "--i": i, "--panel-position": `${i * 50}%` }}
          >
            <div
              className={`cat-img ${c.image ? "has-photo" : ""}`}
              style={c.image ? { backgroundImage: `url("${c.image}")` } : undefined}
              aria-hidden="true"
            />
            <div className="cat-body">
              <div>
                <h3>{c.title}</h3>
                {c.description && <p>{c.description}</p>}
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

    </section>
  );
}
