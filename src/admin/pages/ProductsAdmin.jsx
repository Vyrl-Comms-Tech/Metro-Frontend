import { useEffect, useState } from "react";
import { useSite } from "../../context/siteContext";
import ProductArt from "../../components/collection/ProductArt";
import PageHeader from "../components/PageHeader";
import ProductModal from "../components/ProductModal";
import DataTable from "../components/DataTable";
import TableActions from "../components/TableActions";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

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
    () => axiosClient.get('/products', { params: { q: query, collectionSlug: collection, page, limit: PAGE_SIZE } }),
    [query, collection, page, reload],
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.name}"?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/products/${p.id}`);
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
    { key: 'collectionSlug', label: 'Collection', render: (p) => collections.find((c) => c.slug === p.collectionSlug)?.title ?? p.collectionSlug },
    { key: 'category', label: 'Category' },
    { key: 'metal', label: 'Metal' },
    { key: 'type', label: 'Type' },
    { key: 'actions', label: '', cellClassName: 'ad-actions-cell', render: (p) => <TableActions name={p.name} onEdit={() => setEditing(p)} onRemove={() => remove(p)} /> },
  ];

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

        <DataTable
          caption="Products"
          columns={columns}
          rows={items}
          loading={loading}
          empty={query || collection ? 'No products found.' : 'No products yet. Add your first product to get started.'}
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
