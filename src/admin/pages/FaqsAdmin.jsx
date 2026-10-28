import { useState } from "react";
import { faqsApi } from "../../api/resources";
import { useAsync } from "../../api/useAsync";
import PageHeader from "../components/PageHeader";
import FaqModal from "../components/FaqModal";

export default function FaqsAdmin() {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, faq = edit
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => faqsApi.list({ limit: 500 }), [reload]);
  const faqs = data?.items ?? [];

  // group by category, in the order they first appear
  const groups = [...new Set(faqs.map((f) => f.category))].map((title) => ({
    title,
    items: faqs.filter((f) => f.category === title),
  }));
  const nextOrder = faqs.length ? Math.max(...faqs.map((f) => f.order ?? 0)) + 1 : 0;

  const remove = async (faq) => {
    if (!window.confirm(`Remove "${faq.question}"?`)) return;
    setActionError("");
    try {
      await faqsApi.remove(faq.id);
      setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="FAQs" text="Questions shown on the FAQ page. Featured ones also appear on the home page.">
        <button className="ad-btn" onClick={() => setEditing({})}>
          + Add FAQ
        </button>
      </PageHeader>

      {(error || actionError) && (
        <p className="ad-error" role="alert">{error?.message ?? actionError}</p>
      )}

      {!loading && groups.length === 0 && !error && (
        <section className="ad-card">
          <p className="ad-empty">No FAQs yet. Click “Add FAQ”.</p>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.title} className="ad-card">
          <h2>{group.title}</h2>
          <ul className="ad-list">
            {group.items.map((faq) => (
              <li key={faq.id}>
                <div>
                  <strong>{faq.question}</strong>
                  {faq.featured && <span className="ad-tag">Featured</span>}
                  <p>{faq.answer}</p>
                </div>
                <div className="ad-row-actions">
                  <button onClick={() => setEditing(faq)}>Edit</button>
                  <button className="danger" onClick={() => remove(faq)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {editing && (
        <FaqModal
          faq={editing}
          categories={groups.map((g) => g.title)}
          nextOrder={nextOrder}
          onClose={() => setEditing(null)}
          onSaved={() => setReload((n) => n + 1)}
        />
      )}
    </>
  );
}
