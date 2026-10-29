import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Categories.css";

const featuredCategories = [
  {
    title: "Loose Diamond",
    slug: "loose-diamond",
    description: "Explore natural and lab grown loose diamonds.",
  },
  {
    title: "Diamonds",
    slug: "diamonds",
    description: "Discover natural and lab grown diamonds.",
  },
  {
    title: "Jewellery",
    slug: "jewellery",
    description: "Explore the full collection of fine jewellery.",
  },
];

export default function Categories() {
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
  }, []);

  return (
    <section className="categories" ref={ref} aria-labelledby="categories-title">
      <header className="cat-head">
        <span className="cat-eyebrow">Our Collections</span>
        <h2 id="categories-title">Shop by Category</h2>
        <p>Handcrafted diamond jewellery, made to order in Dubai.</p>
      </header>

      <div className={`cat-grid ${seen ? "is-in" : ""}`}>
        {featuredCategories.map((c, i) => (
          <Link
            key={c.slug}
            to={`/collections/${c.slug}`}
            className="cat-card"
            style={{ "--i": i, "--panel-position": `${i * 50}%` }}
          >
            <div className="cat-img" aria-hidden="true" />
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

    </section>
  );
}
