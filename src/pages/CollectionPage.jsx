import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CHECK_GROUPS, CHECK_KEYS, RANGE_GROUPS, RANGE_KEYS, SORTS } from "../data/collectionFilters";
import { RANGES } from "../data/collections";
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
import CollectionSkeleton from "../components/collection/CollectionSkeleton";
import ProductSkeleton from "../components/collection/ProductSkeleton";
import RangeGroup from "../components/collection/RangeGroup";
import { useSite } from "../context/siteContext";
import { useWishlist } from "../context/wishlistContext";
import { previewProductsFor } from "../data/previewProducts";
import bannerImg from "../assets/hero-photo.jpg";
import "../styles/Collection.css";
import axiosClient from "../utils/axiosClient";
import { useAsync } from "../utils/useAsync";

function Banner({ title, image }) {
  return (
    <section className="col-banner">
      <h1>{title}</h1>
      <img className="col-banner-img" src={image || bannerImg} alt="" />
    </section>
  );
}

const PER_PAGE = 15;


const SUBCATEGORY_PAGES = {
  bracelets: { title: "Bracelets" },
  necklaces: { title: "Necklaces" },
  earrings: { title: "Earrings" },
  rings: { title: "Rings" },
};

const FACET_KEY = { type: "diamondType" };
const facetOf = (group, facets) => facets?.[FACET_KEY[group.key] ?? group.key] ?? [];

// the active filters as getAll params: checkboxes join with commas, sliders only send the end the user moved
const filterParams = (filters, sort) => {
  const params = sort ? { sort } : {};
  for (const key of CHECK_KEYS) {
    if (key !== "subCategory" && filters[key].length) params[FACET_KEY[key] ?? key] = filters[key].join(",");
  }
  for (const key of RANGE_KEYS) {
    const [lo, hi] = filters[key];
    if (lo !== RANGES[key].min) params[`${key}Min`] = lo;
    if (hi !== RANGES[key].max) params[`${key}Max`] = hi;
  }
  return params;
};

function SubCategoryPage({ slug, sub }) {
  const collection = { title: sub.title, slug, subCategories: [] };
  const [facets, setFacets] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 0, hasNext: false, total: 0 });
  const [state, setState] = useState({ loading: true, refreshing: false, loadingMore: false, error: null });
  const params = useMemo(() => filterParams(filters, sort), [filters, sort]);

  const fetchPage = useCallback(
    (page) =>
      axiosClient.get("/products/getAll", {
        params: { limit: PER_PAGE, mainCategory: "jewellery", subCategory: sub.title, withVariation: true, cardDetails: true, page, ...params },
      }),
    [sub.title, params],
  );

  // the filter options for this page, loaded once
  useEffect(() => {
    axiosClient
      .get("/products/filters", { params: { mainCategory: "jewellery", subCategory: sub.title } })
      .then(setFacets)
      .catch(() => setFacets({}));
  }, [sub.title]);

  // the first page, again whenever a filter changes
  useEffect(() => {
    let live = true;
    fetchPage(1)
      .then((res) => {
        if (!live) return;
        setItems(res.items ?? []);
        setMeta({ page: res.page, hasNext: res.hasNext, total: res.total });
        setState({ loading: false, refreshing: false, loadingMore: false, error: null });
      })
      .catch((error) => live && setState({ loading: false, refreshing: false, loadingMore: false, error }));
    return () => {
      live = false;
    };
  }, [fetchPage]);

  // shows the skeleton while the filtered list loads
  const changeFilters = (next) => {
    setState((st) => ({ ...st, refreshing: true }));
    setFilters(next);
  };

  const changeSort = (next) => {
    setState((st) => ({ ...st, refreshing: true }));
    setSort(next);
  };

  const loadMore = () => {
    setState((st) => ({ ...st, loadingMore: true }));
    fetchPage(meta.page + 1)
      .then((res) => {
        setItems((prev) => [...prev, ...(res.items ?? [])]);
        setMeta({ page: res.page, hasNext: res.hasNext, total: res.total });
        setState((st) => ({ ...st, loadingMore: false }));
      })
      .catch((error) => setState((st) => ({ ...st, loadingMore: false, error })));
  };

  if (state.loading || !facets || (state.error && items.length === 0)) {
    return (
      <main className="collection">
        <Banner title={collection.title} />
        {state.error ? <p className="col-status">{state.error.message}</p> : <CollectionSkeleton />}
      </main>
    );
  }
  return (
    <CollectionView
      collection={collection}
      items={items}
      facets={facets}
      filterState={[filters, changeFilters]}
      sortState={[sort, changeSort]}
      paging={{ total: meta.total, hasNext: meta.hasNext, loadingMore: state.loadingMore, refreshing: state.refreshing, onMore: loadMore }}
    />
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const sub = SUBCATEGORY_PAGES[slug];
  if (sub) return <SubCategoryPage key={slug} slug={slug} sub={sub} />;
  return <GenericCollectionPage slug={slug} />;
}

function GenericCollectionPage({ slug }) {
  const { publicCategories, loaded } = useSite();
  const collection = publicCategories.find((c) => c.slug === slug);
  const previewItems = previewProductsFor(slug);
  const { data, error, loading } = useAsync(
    () => axiosClient.get('/products/getAll', { params: { mainCategory: slug, limit: 500 } }),
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

  if (loading || (error && previewItems.length === 0)) {
    return (
      <main className="collection">
        <Banner title={collection.title} image={collection.banner} />
        {loading ? <CollectionSkeleton /> : <p className="col-status">{error.message}</p>}
      </main>
    );
  }

  const items = data?.items?.length ? data.items : previewItems;
  return <CollectionView key={slug} collection={collection} items={items} />;
}

// a collection's subcategory titles (null), or every third-level option of its subcategories ("all")
const titleOf = (s) => (typeof s === "string" ? s : s.title);
const optionsFor = (group, collection) => {
  const subs = collection.subCategories ?? [];
  if (group.options === null) return subs.map(titleOf);
  if (group.options === "all") return [...new Set(subs.flatMap((s) => s.options ?? []))];
  return group.options;
};

// with `filterState` the server does the filtering (sub category pages); without it the loaded items are filtered here
function CollectionView({ collection, items, facets, paging, filterState, sortState }) {
  const own = useState(emptyFilters);
  const [filters, setFilters] = filterState ?? own;
  const serverSide = Boolean(filterState);
  const ownSort = useState("");
  const [sort, setSort] = sortState ?? ownSort;
  const [showFilters, setShowFilters] = useState(false);
  const [shown, setShown] = useState(PER_PAGE);
  const { has, toggle: toggleWish } = useWishlist();

  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));

  const counts = useMemo(
    () => (serverSide ? {} : countOptions(items, filters)),
    [filters, items, serverSide],
  );

  const products = useMemo(
    () =>
      sortProducts(
        (serverSide ? items : items.filter((p) => matchesFilters(p, filters))),
        serverSide ? "" : sort,
      ),
    [filters, sort, items, serverSide],
  );


  const checkGroups = facets
    ? CHECK_GROUPS.map((g) => ({ ...g, facet: facetOf(g, facets) }))
      .filter((g) => g.facet.length > 0)
      .map((g) => ({
        ...g,
        options: g.facet.map((f) => f.value),
        counts: Object.fromEntries(g.facet.map((f) => [f.value, f.count])),
      }))
    : CHECK_GROUPS.filter((g) => g.key !== "pendantType" || items.some((p) => p.pendantType)).map((g) => ({
      ...g,
      options: optionsFor(g, collection),
      counts: counts[g.key],
    }));

  const active = countActive(filters);
  const visible = paging ? products : products.slice(0, shown);
  const totalVariations =
    serverSide
      ? paging.total
      : products.reduce((sum, p) => sum + (p.variants?.length || 1), 0);
  const hasMore = paging ? paging.hasNext : visible.length < products.length;

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

            {checkGroups.map((g) => (
              <CheckGroup
                key={g.key}
                title={g.title}
                options={g.options}
                counts={g.counts}
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
              <b>{totalVariations}</b> products
            </p>
            <div className="col-sort">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort by"
              >
                <option value="">Sort By</option>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>

          {items[0]?.preview && (
            <p className="col-preview-note">Sample products shown while this collection is being prepared.</p>
          )}

          {paging?.refreshing ? (
            <div className="col-grid">
              <ProductSkeleton count={6} />
            </div>
          ) : products.length === 0 ? (
            <p className="col-empty">
              {items.length === 0
                ? "No products have been added to this collection yet."
                : "No products match these filters."}
            </p>
          ) : (
            <div className="col-grid">
              {visible.map((p) => (
                <article key={p.productCode ?? p.id} className="prod">
                  <Link to={`/product/${p.id}`} className="prod-img">
                    {p.images?.[0] || p.image ? (
                      <>
                        <img src={p.images?.[0] ?? p.image} alt="" />
                        {p.hoverImage && <img className="prod-hover" src={p.hoverImage} alt="" loading="lazy" />}
                      </>
                    ) : (
                      <ProductArt metal={p.metal} />
                    )}
                  </Link>
                  <button
                    className={`prod-wish ${has(p.productCode ?? p.id) ? "on" : ""}`}
                    aria-label="Add to wishlist"
                    aria-pressed={has(p.productCode ?? p.id)}
                    onClick={() =>
                      toggleWish({
                        id: p.productCode ?? p.id,
                        name: p.name,
                        metal: p.metal,
                        image: p.images?.[0] ?? p.image,
                        to: `/product/${p.id}`,
                      })
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill={has(p.productCode ?? p.id) ? "currentColor" : "none"}
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
              {paging?.loadingMore && <ProductSkeleton count={3} />}
            </div>
          )}

          {hasMore && (
            <div className="col-more">
              <button
                className="btn-outline"
                disabled={paging?.loadingMore}
                onClick={paging ? paging.onMore : () => setShown((n) => n + PER_PAGE)}
              >
                Load more
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
