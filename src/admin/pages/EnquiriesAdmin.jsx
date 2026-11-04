import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

const formatDate = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const PAGE_SIZE = 10;

export default function EnquiriesAdmin() {
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => axiosClient.get("/enquiries", { params: { page, limit: PAGE_SIZE } }), [page, reload]);
  const items = data?.items ?? [];

  const remove = async (item) => {
    if (!window.confirm(`Delete the enquiry from "${item.name}"?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/enquiries/${item.id}`);
      // deleting the only row on the last page would leave it empty, so go back one page
      if (items.length === 1 && page > 1) setPage(page - 1);
      else setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { key: "createdAt", label: "Received", render: (item) => formatDate(item.createdAt) },
    { key: "name", label: "Name", cellClassName: "ad-cell-main", render: (item) => <span className="ad-primary-text">{item.name}</span> },
    { key: "contact", label: "Contact", render: (item) => (
      <>
        <a href={`mailto:${item.email}`}>{item.email}</a>
        {item.phone && <div><a href={`tel:${item.phone}`}>{item.phone}</a></div>}
      </>
    ) },
    { key: "message", label: "Message", render: (item) => <span className="ad-table-summary">{item.message}</span> },
    { key: "actions", label: "", cellClassName: "ad-actions-cell", render: (item) => (
      <button type="button" className="ad-btn" onClick={() => remove(item)}>Delete</button>
    ) },
  ];

  return (
    <>
      <PageHeader title="Enquiries" text="Messages sent from the Contact Us page." />

      {(error || actionError) && (
        <p className="ad-error" role="alert">{error?.message ?? actionError}</p>
      )}

      <section className="ad-card ad-table-card">
        <DataTable caption="Enquiries" columns={columns} rows={items} loading={loading} empty="No enquiries yet." />
      </section>

      {data && data.total > 0 && (
        <nav className="ad-pager" aria-label="Enquiries pages" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
          <span>Page {data.page} of {data.pages} ({data.total} total)</span>
          <button type="button" className="ad-btn" disabled={!data.hasPrev || loading} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <button type="button" className="ad-btn" disabled={!data.hasNext || loading} onClick={() => setPage((p) => p + 1)}>Next</button>
        </nav>
      )}
    </>
  );
}
