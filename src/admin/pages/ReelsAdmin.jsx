import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ReelModal from "../components/ReelModal";
import DataTable from "../components/DataTable";
import TableActions from "../components/TableActions";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

export default function ReelsAdmin() {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, reel = edit
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => axiosClient.get('/reels', { params: { limit: 100 } }), [reload]);
  const reels = data?.items ?? [];
  const nextOrder = reels.length ? Math.max(...reels.map((r) => r.order ?? 0)) + 1 : 0;

  const remove = async (reel) => {
    if (!window.confirm(`Remove "${reel.name || "this reel"}"?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/reels/${reel.id}`);
      setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { key: 'order', label: 'Order', render: (reel) => reel.order ?? 0 },
    { key: 'name', label: 'Reel', cellClassName: 'ad-cell-main', render: (reel) => <div className="ad-record"><span className="ad-thumb">{reel.poster && <img src={reel.poster} alt="" />}</span><span className="ad-primary-text">{reel.name || 'Instagram reel'}</span></div> },
    { key: 'href', label: 'Link', render: (reel) => <a className="ad-table-link" href={reel.href} target="_blank" rel="noreferrer">Open reel ↗</a> },
    { key: 'video', label: 'Video', render: (reel) => reel.video ? <span className="ad-status">Uploaded</span> : 'Link only' },
    { key: 'actions', label: '', cellClassName: 'ad-actions-cell', render: (reel) => <TableActions name={reel.name || 'reel'} onEdit={() => setEditing(reel)} onRemove={() => remove(reel)} /> },
  ];

  return (
    <>
      <PageHeader title="Instagram Reels" text="Videos shown in the home page carousel, in this order.">
        <button className="ad-btn" onClick={() => setEditing({})}>
          + Add reel
        </button>
      </PageHeader>

      {(error || actionError) && (
        <p className="ad-error" role="alert">{error?.message ?? actionError}</p>
      )}

      <section className="ad-card ad-table-card">
        <DataTable caption="Instagram reels" columns={columns} rows={reels} loading={loading} empty="No reels yet. Add a reel to get started." />
      </section>

      {editing && (
        <ReelModal
          reel={editing}
          nextOrder={nextOrder}
          onClose={() => setEditing(null)}
          onSaved={() => setReload((n) => n + 1)}
        />
      )}
    </>
  );
}
