import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CHECK_GROUPS, RANGE_GROUPS, SORTS } from "../data/collectionFilters";
import {
  countActive,
  countOptions,
  emptyFilters,
  matchesFilters,
  sortProducts,
} from "../utils/collection";
import CheckGroup from "../components/collection/CheckGroup";
import Chevron from "../components/collection/Chevron";
import ProductArt from "../components/collection/ProductArt";
import RangeGroup from "../components/collection/RangeGroup";
import { useSite } from "../context/siteContext";
import { useWishlist } from "../context/wishlistContext";
import { assetUrl } from "../api/client";
import { listProducts } from "../api/products";
import { useAsync } from "../api/useAsync";
import bannerImg from "../assets/hero-photo.jpg";
import "../styles/Collection.css";

function Banner({ title, image }) {
  return (
    <section className="col-banner">
      <h1>{title}</h1>
      <img className="col-banner-img" src={assetUrl(image) || bannerImg} alt="" />
    </section>
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const { categories, loaded } = useSite();
  const collection = categories.find((c) => c.slug === slug);
  const { data, error, loading } = useAsync(
    () => listProducts({ collectionSlug: slug, limit: 500 }),
    [slug],
  );

  if (!loaded) {
    return (
      <main className="collection">
        <p className="col-status">Loading…</p>
      </main>
    );
  }
  if (!collection) return <Navigate to="/" replace />;

  if (loading || error) {
    return (
      <main className="collection">
        <Banner title={collection.title} image={collection.banner} />
        <p className="col-status">
          {loading ? "Loading products…" : error.message}
        </p>
      </main>
    );
  }

  return <CollectionView key={slug} collection={collection} items={data.items} />;
}

function CollectionView({ collection, items }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("best");
  const [showFilters, setShowFilters] = useState(false);
  const { has, toggle: toggleWish } = useWishlist();

  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));

  const counts = useMemo(
    () => countOptions(items, filters),
    [filters, items],
  );

  const products = useMemo(
    () =>
      sortProducts(
        items.filter((p) => matchesFilters(p, filters)),
        sort,
      ),
    [filters, sort, items],
  );

  const active = countActive(filters);

  return (
    <main className="collection">
      <Banner title={collection.title} image={collection.banner} />

      <div className="col-layout">
        <aside className={`col-side ${showFilters ? "show" : ""}`}>
          <button
            className="col-filter-toggle"
            onClick={() => setShowFilters((s) => !s)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="8" cy="17" r="2" />
            </svg>
            Filters{active > 0 && ` (${active})`}
          </button>

          <div className="col-filters">
            {active > 0 && (
              <button
                className="col-clear"
                onClick={() => setFilters(emptyFilters())}
              >
                Clear all filters
              </button>
            )}

            {CHECK_GROUPS.map((g) => (
              <CheckGroup
                key={g.key}
                title={g.title}
                options={g.options ?? collection.subCategories}
                counts={counts[g.key]}
                selected={filters[g.key]}
                onToggle={(v) => toggle(g.key, v)}
                scroll={g.scroll}
                defaultOpen={g.defaultOpen}
              />
            ))}

            {RANGE_GROUPS.map((g) => (
              <RangeGroup
                key={g.key}
                title={g.title}
                bounds={g.bounds}
                ticks={g.ticks}
                value={filters[g.key]}
                onChange={(v) => setFilters((f) => ({ ...f, [g.key]: v }))}
              />
            ))}
          </div>
        </aside>

        <section className="col-main">
          <div className="col-toolbar">
            <p>
              <b>{products.length}</b> products
            </p>
            <div className="col-sort">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort by"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>

          {products.length === 0 ? (
            <p className="col-empty">
              {items.length === 0
                ? "No products have been added to this collection yet."
                : "No products match these filters."}
            </p>
          ) : (
            <div className="col-grid">
              {products.map((p) => (
                <article key={p.id} className="prod">
                  <Link to={`/product/${p.id}`} className="prod-img">
                    {p.images?.[0] ? (
                      <img src={assetUrl(p.images[0])} alt="" />
                    ) : (
                      <ProductArt metal={p.metal} />
                    )}
                  </Link>
                  <button
                    className={`prod-wish ${has(p.id) ? "on" : ""}`}
                    aria-label="Add to wishlist"
                    aria-pressed={has(p.id)}
                    onClick={() =>
                      toggleWish({
                        id: p.id,
                        name: p.name,
                        metal: p.metal,
                        image: p.images?.[0] ? assetUrl(p.images[0]) : undefined,
                        to: `/product/${p.id}`,
                      })
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill={has(p.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    >
                      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
                    </svg>
                  </button>
                  <h3>
                    <Link to={`/product/${p.id}`}>{p.name}</Link>
                  </h3>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
