import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

const formatDate = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const PAGE_SIZE = 10;

export default function SubscribersAdmin() {
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => axiosClient.get("/subscribers", { params: { page, limit: PAGE_SIZE } }), [page, reload]);
  const items = data?.items ?? [];

  const remove = async (item) => {
    if (!window.confirm(`Remove "${item.email}" from the newsletter list?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/subscribers/${item.id}`);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { key: "createdAt", label: "Subscribed", render: (item) => formatDate(item.createdAt) },
    { key: "email", label: "Email", cellClassName: "ad-cell-main", render: (item) => <a href={`mailto:${item.email}`}>{item.email}</a> },
    { key: "actions", label: "", cellClassName: "ad-actions-cell", render: (item) => (
      <button type="button" className="ad-btn" onClick={() => remove(item)}>Delete</button>
    ) },
  ];

  return (
    <>
      <PageHeader title="Newsletter" text="Email addresses signed up from the website footer." />

      {(error || actionError) && (
        <p className="ad-error" role="alert">{error?.message ?? actionError}</p>
      )}

      <section className="ad-card ad-table-card">
        <DataTable caption="Newsletter subscribers" columns={columns} rows={items} loading={loading} empty="No subscribers yet." />
      </section>

      {data && data.total > 0 && (
        <nav className="ad-pager" aria-label="Subscribers pages" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
          <span>Page {data.page} of {data.pages} ({data.total} total)</span>
          <button type="button" className="ad-btn" disabled={!data.hasPrev || loading} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <button type="button" className="ad-btn" disabled={!data.hasNext || loading} onClick={() => setPage((p) => p + 1)}>Next</button>
        </nav>
      )}
    </>
  );
}
