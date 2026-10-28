import { useEffect, useState } from "react";
import { useSite } from "../../context/siteContext";
import { assetUrl } from "../../api/client";
import { deleteProduct, listProducts } from "../../api/products";
import { useAsync } from "../../api/useAsync";
import ProductArt from "../../components/collection/ProductArt";
import PageHeader from "../components/PageHeader";
import ProductModal from "../components/ProductModal";

const PAGE_SIZE = 10;

export default function ProductsAdmin() {
  const { categories: collections } = useSite();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // search, once typing pauses
  const [collection, setCollection] = useState("");
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
    () => listProducts({ q: query, collectionSlug: collection, page, limit: PAGE_SIZE }),
    [query, collection, page, reload],
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.name}"?`)) return;
    setActionError("");
    try {
      await deleteProduct(p.id);
      // step back a page if that was the last product on it
      if (items.length === 1 && page > 1) setPage(page - 1);
      else setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Products"
        text={data ? `${total} ${total === 1 ? "product" : "products"}` : "Loading…"}
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
          <select
            value={collection}
            onChange={(e) => {
              setCollection(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by collection"
          >
            <option value="">All collections</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {(error || actionError) && (
          <p className="ad-error" role="alert">
            {error?.message ?? actionError}
          </p>
        )}

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Collection</th>
                <th>Category</th>
                <th>Metal</th>
                <th>Type</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="ad-cell-main">
                    <span className="ad-thumb">
                      {p.images?.[0] ? (
                        <img src={assetUrl(p.images[0])} alt="" />
                      ) : (
                        <ProductArt metal={p.metal} />
                      )}
                    </span>
                    {p.name}
                  </td>
                  <td>{collections.find((c) => c.slug === p.collectionSlug)?.title ?? p.collectionSlug}</td>
                  <td>{p.category ?? "-"}</td>
                  <td>{p.metal ?? "-"}</td>
                  <td>{p.type ?? "-"}</td>
                  <td className="ad-row-actions">
                    <button onClick={() => setEditing(p)}>Edit</button>
                    <button className="danger" onClick={() => remove(p)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan="6" className="ad-empty">
                    {query || collection
                      ? "No products found."
                      : "No products yet. Click “Add product” to upload your first one."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
