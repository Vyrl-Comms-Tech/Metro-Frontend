import { useState } from "react";
import { assetUrl } from "../../api/client";
import { reelsApi } from "../../api/resources";
import { useAsync } from "../../api/useAsync";
import PageHeader from "../components/PageHeader";
import ReelModal from "../components/ReelModal";

export default function ReelsAdmin() {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, reel = edit
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => reelsApi.list({ limit: 100 }), [reload]);
  const reels = data?.items ?? [];
  const nextOrder = reels.length ? Math.max(...reels.map((r) => r.order ?? 0)) + 1 : 0;

  const remove = async (reel) => {
    if (!window.confirm(`Remove "${reel.name || "this reel"}"?`)) return;
    setActionError("");
    try {
      await reelsApi.remove(reel.id);
      setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

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

      {!loading && reels.length === 0 && !error && (
        <section className="ad-card">
          <p className="ad-empty">No reels yet. Click “Add reel”.</p>
        </section>
      )}

      <ul className="ad-reels">
        {reels.map((r, i) => (
          <li key={r.id} className="ad-card">
            <div
              className="ad-reel-thumb"
              style={{
                background: r.poster
                  ? `center / cover url(${assetUrl(r.poster)})`
                  : "linear-gradient(165deg, var(--brand-card-1), var(--brand-card-2))",
              }}
              aria-hidden="true"
            >
              <span>{i + 1}</span>
            </div>
            <h3>{r.name || "Instagram reel"}</h3>
            <a href={r.href} target="_blank" rel="noreferrer">
              {r.href}
            </a>
            <div className="ad-row-actions">
              <button onClick={() => setEditing(r)}>Edit</button>
              <button className="danger" onClick={() => remove(r)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

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
