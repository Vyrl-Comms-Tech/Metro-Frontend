import { useState } from "react";
import PageHeader from "../components/PageHeader";
import FaqModal from "../components/FaqModal";
import DataTable from "../components/DataTable";
import TableActions from "../components/TableActions";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

export default function FaqsAdmin() {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, faq = edit
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => axiosClient.get('/faqs', { params: { limit: 500 } }), [reload]);
  const faqs = data?.items ?? [];

  const faqCategories = [...new Set(faqs.map((faq) => faq.category))];
  const nextOrder = faqs.length ? Math.max(...faqs.map((f) => f.order ?? 0)) + 1 : 0;

  const remove = async (faq) => {
    if (!window.confirm(`Remove "${faq.question}"?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/faqs/${faq.id}`);
      setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { key: 'question', label: 'Question', render: (faq) => <span className="ad-primary-text">{faq.question}</span> },
    { key: 'category', label: 'Category' },
    { key: 'answer', label: 'Answer', render: (faq) => <span className="ad-table-summary">{faq.answer}</span> },
    { key: 'featured', label: 'Home page', render: (faq) => faq.featured ? <span className="ad-status">Featured</span> : '—' },
    { key: 'actions', label: '', cellClassName: 'ad-actions-cell', render: (faq) => <TableActions name={faq.question} onEdit={() => setEditing(faq)} onRemove={() => remove(faq)} /> },
  ];

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

      <section className="ad-card ad-table-card">
        <DataTable caption="FAQs" columns={columns} rows={faqs} loading={loading} empty="No FAQs yet. Add a question to get started." />
      </section>

      {editing && (
        <FaqModal
          faq={editing}
          categories={faqCategories}
          nextOrder={nextOrder}
          onClose={() => setEditing(null)}
          onSaved={() => setReload((n) => n + 1)}
        />
      )}
    </>
  );
}
