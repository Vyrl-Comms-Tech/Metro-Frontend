import { useEffect, useState } from "react";
import { useSite } from "../../context/siteContext";
import { GEMSTONES, METALS, PENDANT_TYPES, SHAPES, TYPES } from "../../data/collections";
import ProductArt from "../../components/collection/ProductArt";
import PageHeader from "../components/PageHeader";
import ProductModal from "../components/ProductModal";
import DataTable from "../components/DataTable";
import TableActions from "../components/TableActions";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

const PAGE_SIZE = 10;

const NO_FILTERS = { mainCategory: "", subCategory: "", category: "", type: "", metal: "", gemstone: "", shape: "", pendantType: "" };
// a subcategory is { title, options }; older data may still be a plain string
const subTitle = (s) => (typeof s === "string" ? s : s.title);
const subOptions = (s) => (typeof s === "string" ? [] : (s.options ?? []));
const unique = (list) => [...new Set(list)];

export default function ProductsAdmin() {
  const { categories: collections } = useSite();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // search, once typing pauses
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, error, loading } = useAsync(
    () => axiosClient.get('/products/getAll', { params: { q: query, ...filters, page, limit: PAGE_SIZE } }),
    [query, filters, page, reload],
  );

  // choosing a higher level clears the lower ones, and each list only offers what belongs to the choice above it
  const setFilter = (key) => (e) => {
    const value = e.target.value;
    const reset =
      key === "mainCategory"
        ? { subCategory: "", category: "", pendantType: "" }
        : key === "subCategory"
          ? { category: "", pendantType: "" }
          : {};
    setFilters((f) => ({ ...f, [key]: value, ...reset }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(NO_FILTERS);
    setPage(1);
  };
  const filtered = Object.values(filters).some(Boolean);

  const mainChosen = collections.find((c) => c.slug === filters.mainCategory);
  const subs = (mainChosen ? mainChosen.subCategories : collections.flatMap((c) => c.subCategories ?? [])) ?? [];
  const subChosen = subs.find((s) => subTitle(s) === filters.subCategory);
  const categoryOptions = unique((subChosen ? [subChosen] : subs).flatMap(subOptions));

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;
  const totalVariants = data?.totalVariants ?? 0;
  const breakdown = data?.variantBreakdown ?? []; // [{ variants: 4, products: 75 }]: 75 products have 4 variations

  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.name}"?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/products/remove/${p.id}`);
      // step back a page if that was the last product on it
      if (items.length === 1 && page > 1) setPage(page - 1);
      else setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Product', cellClassName: 'ad-cell-main',
      render: (p) => <div className="ad-record"><span className="ad-thumb">{p.images?.[0] ? <img src={p.images[0]} alt="" /> : <ProductArt metal={p.metal} />}</span><span>{p.name}</span></div>,
    },
    { key: 'mainCategory', label: 'Main category', render: (p) => collections.find((c) => c.slug === p.mainCategory)?.title ?? p.mainCategory },
    { key: 'subCategory', label: 'Sub category' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'From (AED)', render: (p) => (p.price != null ? p.price.toLocaleString() : '') },
    { key: 'variants', label: 'Variants', render: (p) => p.variants?.length ?? 0 },
    { key: 'actions', label: '', cellClassName: 'ad-actions-cell', render: (p) => <TableActions name={p.name} onEdit={() => setEditing(p)} onRemove={() => remove(p)} /> },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        text={
          data ? (
            <span className="ad-hover" tabIndex={0}>
              {total} {total === 1 ? "product" : "products"}
              <span className="ad-hover-box" role="tooltip">
                {breakdown.map((g) => (
                  <span key={g.variants}>
                    {g.products} {g.products === 1 ? "product has" : "products have"} {g.variants}{" "}
                    {g.variants === 1 ? "variation" : "variations"}
                    <b>{g.products * g.variants}</b>
                  </span>
                ))}
                <span className="ad-hover-total">
                  Total: {total} {total === 1 ? "product" : "products"}
                  <b>{totalVariants} variations</b>
                </span>
              </span>
            </span>
          ) : (
            "Loading…"
          )
        }
      >
        <button className="ad-btn" onClick={() => setEditing({})}>
          + Add product
        </button>
      </PageHeader>

      <section className="ad-card">
        <div className="ad-toolbar">
          <input
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="ad-filters">
          <select className={filters.mainCategory ? "on" : ""} value={filters.mainCategory} onChange={setFilter("mainCategory")} aria-label="Main category">
            <option value="">All main categories</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <select className={filters.subCategory ? "on" : ""} value={filters.subCategory} onChange={setFilter("subCategory")} aria-label="Sub category">
            <option value="">All sub categories</option>
            {unique(subs.map(subTitle)).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select className={filters.category ? "on" : ""} value={filters.category} onChange={setFilter("category")} aria-label="Category" disabled={!categoryOptions.length}>
            <option value="">All categories</option>
            {categoryOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {filters.subCategory === "Necklaces" && (
            <select className={filters.pendantType ? "on" : ""} value={filters.pendantType} onChange={setFilter("pendantType")} aria-label="Pendant type">
              <option value="">Any pendant type</option>
              {PENDANT_TYPES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          )}
          <select className={filters.type ? "on" : ""} value={filters.type} onChange={setFilter("type")} aria-label="Diamond type">
            <option value="">Any diamond type</option>
            {TYPES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select className={filters.metal ? "on" : ""} value={filters.metal} onChange={setFilter("metal")} aria-label="Metal">
            <option value="">Any metal</option>
            {METALS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select className={filters.gemstone ? "on" : ""} value={filters.gemstone} onChange={setFilter("gemstone")} aria-label="Gemstone">
            <option value="">Any gemstone</option>
            {GEMSTONES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select className={filters.shape ? "on" : ""} value={filters.shape} onChange={setFilter("shape")} aria-label="Shape">
            <option value="">Any shape</option>
            {SHAPES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {filtered && (
            <button type="button" className="ad-btn ghost" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {(error || actionError) && (
          <p className="ad-error" role="alert">
            {error?.message ?? actionError}
          </p>
        )}

        <DataTable
          caption="Products"
          columns={columns}
          rows={items}
          loading={loading}
          empty={query || filtered ?'No products found.' : 'No products yet. Add your first product to get started.'}
        />

        <div className="ad-pager">
          <span>
            Page {page} of {pages}
          </span>
          <button className="ad-btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <button className="ad-btn ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </section>

      {editing && (
        <ProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setReload((n) => n + 1)}
        />
      )}
    </>
  );
}
