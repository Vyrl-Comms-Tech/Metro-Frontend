import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { CHECK_GROUPS, CHECK_KEYS, RANGE_GROUPS, RANGE_KEYS, SORTS } from "../data/collectionFilters";
import { rangesFor } from "../data/collections";
import {
  countActive,
  countOptions,
  emptyFilters,
  matchesFilters,
  sortProducts,
} from "../utils/collection";
import { categoryFromSlug } from "../components/menuData";
import { productPath } from "../utils/productPath";
import { useSessionState } from "../utils/useSessionState";
import Banner from "../components/collection/Banner";
import CheckGroup from "../components/collection/CheckGroup";
import Chevron from "../components/collection/Chevron";
import ProductArt from "../components/collection/ProductArt";
import CollectionSkeleton from "../components/collection/CollectionSkeleton";
import ProductSkeleton from "../components/collection/ProductSkeleton";
import RangeGroup from "../components/collection/RangeGroup";
import { DrawerBackdrop, DrawerFoot, DrawerHead, FilterButton } from "../components/collection/FilterDrawer";
import { onDrawerScreen, useDrawerLock } from "../utils/useDrawerLock";
import { useSite } from "../context/siteContext";
import { useWishlist } from "../context/wishlistContext";
import { previewProductsFor } from "../data/previewProducts";
import "../styles/Collection.css";
import axiosClient from "../utils/axiosClient";
import { useAsync } from "../utils/useAsync";

// 16 per page where the grid is two across (phones and tablets), so the last row is never half empty; 15 for the three-across grid
const PER_PAGE = window.matchMedia("(max-width: 1000px)").matches ? 16 : 15;


const SUBCATEGORY_PAGES = {
  bracelets: { title: "Bracelets" },
  necklaces: { title: "Necklaces" },
  earrings: { title: "Earrings" },
  rings: { title: "Rings" },
};

// the wedding rings are a category of Rings of their own, listed one card per ring (not per metal): View All Rings leaves them out
const WEDDING = "Wedding Rings";
const WEDDING_GROUPS = ["gender", "category", "ringCovering", "style", "metal"];

const FACET_KEY = { type: "diamondType" };
const facetOf = (group, facets) => facets?.[FACET_KEY[group.key] ?? group.key] ?? [];


// the active filters as getAll params: checkboxes join with commas, sliders only send the end the user moved
const filterParams = (filters, sort, ranges) => {
  const params = sort ? { sort } : {};
  for (const key of CHECK_KEYS) {
    if (key !== "subCategory" && filters[key].length) params[FACET_KEY[key] ?? key] = filters[key].join(",");
  }
  for (const key of RANGE_KEYS) {
    const [lo, hi] = filters[key];
    if (lo !== ranges[key].min) params[`${key}Min`] = lo;
    if (hi !== ranges[key].max) params[`${key}Max`] = hi;
  }
  return params;
};

function SubCategoryPage({ slug, sub, category }) {
  const wedding = category === WEDDING;
  const collection = { title: wedding ? WEDDING : sub.title, slug, subCategories: [] };
  const [facets, setFacets] = useState(null);
  const ranges = useMemo(() => rangesFor(wedding ? "wedding-rings" : slug), [slug, wedding]);
  // which products the page is about: the wedding rings (Plain / Diamond), or the rest of Rings
  const scope = useMemo(
    () => (wedding ? { onlyCategory: "Plain,Diamond", perProduct: true } : slug === "rings" ? { notCategory: "Plain,Diamond" } : {}),
    [slug, wedding],
  );
  // the filters and the sort live in the URL (?metal=18k White Gold&widthMin=2&sort=az), so a filtered page can be shared and survives a reload
  const [urlParams, setUrlParams] = useSearchParams();
  const pathCategory = category && !wedding ? category : null; // the page's own category is the default choice, until the visitor changes it
  const filters = useMemo(() => {
    const f = emptyFilters(ranges);
    for (const key of CHECK_KEYS) {
      const name = FACET_KEY[key] ?? key;
      if (key !== "subCategory" && urlParams.has(name)) f[key] = urlParams.get(name).split(",").filter(Boolean);
    }
    if (pathCategory && !urlParams.has("category")) f.category = [pathCategory];
    for (const key of RANGE_KEYS) {
      const lo = Number(urlParams.get(`${key}Min`) ?? ranges[key].min);
      const hi = Number(urlParams.get(`${key}Max`) ?? ranges[key].max);
      f[key] = [Number.isNaN(lo) ? ranges[key].min : lo, Number.isNaN(hi) ? ranges[key].max : hi];
    }
    return f;
  }, [urlParams, ranges, pathCategory]);
  const sort = urlParams.get("sort") ?? "";
  const setFilters = (next) => {
    const value = typeof next === "function" ? next(filters) : next;
    setUrlParams((prev) => {
      const out = new URLSearchParams(prev);
      for (const key of CHECK_KEYS) {
        if (key === "subCategory") continue;
        const name = FACET_KEY[key] ?? key;
        if (value[key].length) out.set(name, value[key].join(","));
        else if (key === "category" && pathCategory) out.set(name, ""); // "none chosen" must not fall back to the page's category
        else out.delete(name);
      }
      for (const key of RANGE_KEYS) {
        const [lo, hi] = value[key];
        if (lo !== ranges[key].min) out.set(`${key}Min`, lo); else out.delete(`${key}Min`);
        if (hi !== ranges[key].max) out.set(`${key}Max`, hi); else out.delete(`${key}Max`);
      }
      return out;
    }, { replace: true });
  };
  const setSort = (next) =>
    setUrlParams((prev) => {
      const out = new URLSearchParams(prev);
      if (next) out.set("sort", next); else out.delete("sort");
      return out;
    }, { replace: true });
  const store = `sub:${slug}${category ? `:${category}` : ""}`;
  const [savedPages, setSavedPages] = useSessionState(`${store}:pages`, 1);
  const restorePages = useRef(savedPages); // the pages to load again on the first visit
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 0, hasNext: false, total: 0 });
  const [state, setState] = useState({ loading: true, refreshing: false, loadingMore: false, error: null });
  const params = useMemo(() => filterParams(filters, sort, ranges), [filters, sort, ranges]);

  const fetchPage = useCallback(
    (page, limit = PER_PAGE) =>
      axiosClient.get("/products/getAll", {
        params: { limit, mainCategory: "jewellery", subCategory: sub.title, withVariation: !wedding, cardDetails: true, page, ...scope, ...params },
      }),
    [sub.title, scope, params, wedding],
  );

  // the filter options with their counts, loaded again whenever a filter changes so they match the chosen filters
  const facetParams = useMemo(() => filterParams(filters, "", ranges), [filters, ranges]);
  useEffect(() => {
    let live = true;
    axiosClient
      .get("/products/filters", { params: { mainCategory: "jewellery", subCategory: sub.title, ...scope, ...facetParams } })
      .then((res) => live && setFacets(res))
      .catch(() => live && setFacets((prev) => prev ?? {}));
    return () => {
      live = false;
    };
  }, [sub.title, scope, facetParams]);

  // the first page, again whenever a filter changes; coming back, every page that was loaded before in one request
  useEffect(() => {
    let live = true;
    const pages = Math.min(restorePages.current, Math.floor(500 / PER_PAGE)); // the server returns at most 500 per request
    fetchPage(1, PER_PAGE * pages)
      .then((res) => {
        if (!live) return;
        restorePages.current = 1;
        setItems(res.items ?? []);
        setMeta({ page: pages, hasNext: res.hasNext, total: res.total });
        setSavedPages(pages);
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
    setSavedPages(1);
    setFilters(next);
  };

  const changeSort = (next) => {
    setState((st) => ({ ...st, refreshing: true }));
    setSavedPages(1);
    setSort(next);
  };

  const loadMore = () => {
    setState((st) => ({ ...st, loadingMore: true }));
    fetchPage(meta.page + 1)
      .then((res) => {
        setItems((prev) => [...prev, ...(res.items ?? [])]);
        setMeta({ page: res.page, hasNext: res.hasNext, total: res.total });
        setSavedPages(res.page);
        setState((st) => ({ ...st, loadingMore: false }));
      })
      .catch((error) => setState((st) => ({ ...st, loadingMore: false, error })));
  };

  if (state.loading || !facets || (state.error && items.length === 0)) {
    return (
      <main className="collection">
        <Banner title={collection.title} slug={collection.slug} />
        {state.error ? <p className="col-status">{state.error.message}</p> : <CollectionSkeleton />}
      </main>
    );
  }
  return (
    <CollectionView
      collection={collection}
      ranges={ranges}
      items={items}
      facets={facets}
      groups={wedding ? WEDDING_GROUPS : undefined}
      filterState={[filters, changeFilters]}
      sortState={[sort, changeSort]}
      paging={{ total: meta.total, hasNext: meta.hasNext, loadingMore: state.loadingMore, refreshing: state.refreshing, onMore: loadMore }}
    />
  );
}

export default function CollectionPage() {
  const { slug, option } = useParams();
  const category = option ? categoryFromSlug(slug, option) : null;
  const sub = SUBCATEGORY_PAGES[slug];
  if (sub) return <SubCategoryPage key={`${slug}/${category}`} slug={slug} sub={sub} category={category} />;
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
        <Banner title={collection.title} image={collection.banner} slug={collection.slug} />
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
function CollectionView({ collection, items, facets, groups, paging, filterState, sortState, ranges = rangesFor(collection.slug) }) {
  // the other collections filter in the browser: their filters, sort and shown count are kept per collection for the session
  const [ownFilters, setOwnFilters] = useSessionState(`collection:${collection.slug}:filters`, () => emptyFilters(ranges));
  const mergedOwn = useMemo(() => ({ ...emptyFilters(ranges), ...ownFilters }), [ranges, ownFilters]);
  const [filters, setFilters] = filterState ?? [mergedOwn, setOwnFilters];
  const serverSide = Boolean(filterState);
  const ownSort = useSessionState(`collection:${collection.slug}:sort`, "");
  const [sort, setSort] = sortState ?? ownSort;
  const [showFilters, setShowFilters] = useState(false);
  const closeFilters = useCallback(() => setShowFilters(false), []);
  useDrawerLock(showFilters, closeFilters);
  const [groupsOpen] = useState(() => !onDrawerScreen()); // in the filter panel every group starts closed
  const [shown, setShown] = useSessionState(`collection:${collection.slug}:shown`, PER_PAGE);
  const { has, toggle: toggleWish } = useWishlist();

  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));

  const counts = useMemo(
    () => (serverSide ? {} : countOptions(items, filters, ranges)),
    [filters, items, serverSide, ranges],
  );

  const products = useMemo(
    () =>
      sortProducts(
        (serverSide ? items : items.filter((p) => matchesFilters(p, filters, undefined, ranges))),
        serverSide ? "" : sort,
      ),
    [filters, sort, items, serverSide, ranges],
  );


  const checkGroups = facets
    ? CHECK_GROUPS.map((g) => ({ ...g, facet: facetOf(g, facets) }))
      .filter((g) => g.facet.length > 0 && (!groups || groups.includes(g.key)))
      .map((g) => ({
        ...g,
        options: g.facet.map((f) => f.value),
        counts: Object.fromEntries(g.facet.map((f) => [f.value, f.count])),
      }))
    : CHECK_GROUPS.filter((g) => !g.serverOnly && (g.key !== "pendantType" || items.some((p) => p.pendantType))).map((g) => ({
      ...g,
      options: optionsFor(g, collection),
      counts: counts[g.key],
    }));

  const active = countActive(filters, ranges);
  const visible = paging ? products : products.slice(0, shown);
  const totalVariations =
    serverSide
      ? paging.total
      : products.reduce((sum, p) => sum + (p.variants?.length || 1), 0);
  const hasMore = paging ? paging.hasNext : visible.length < products.length;

  return (
    <main className="collection">
      <Banner title={collection.title} image={collection.banner} slug={collection.slug} />

      <div className="col-layout col-drawer">
        <DrawerBackdrop open={showFilters} onClose={closeFilters} />
        <aside className={`col-side ${showFilters ? "show" : ""}`}>
          <DrawerHead active={active} onClose={closeFilters} />
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
                onClick={() => setFilters(emptyFilters(ranges))}
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
                defaultOpen={groupsOpen && g.defaultOpen}
              />
            ))}

            {RANGE_GROUPS.map((g) => (
              <RangeGroup
                key={g.key}
                defaultOpen={groupsOpen}
                title={g.title}
                bounds={ranges[g.key]}
                ticks={Array.from({ length: Math.floor(ranges[g.key].max - ranges[g.key].min) + 1 }, (_, i) => ranges[g.key].min + i)}
                value={filters[g.key]}
                onChange={(v) => setFilters((f) => ({ ...f, [g.key]: v }))}
              />
            ))}
          </div>
          <DrawerFoot count={totalVariations} label="products" active={active} onReset={() => setFilters(emptyFilters(ranges))} onClose={closeFilters} />
        </aside>

        <section className="col-main">
          <div className="col-toolbar">
            <FilterButton active={active} onOpen={() => setShowFilters(true)} />
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
                  <Link to={productPath(p)} className="prod-img">
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
                        to: productPath(p),
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
                    <Link to={productPath(p)}>{p.name}</Link>
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
