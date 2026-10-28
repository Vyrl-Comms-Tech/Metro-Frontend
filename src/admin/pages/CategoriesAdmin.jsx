import { useState } from "react";
import { assetUrl } from "../../api/client";
import { categoriesApi } from "../../api/resources";
import { useSite } from "../../context/siteContext";
import PageHeader from "../components/PageHeader";
import CategoryModal from "../components/CategoryModal";

export default function CategoriesAdmin() {
  const { categories, reload } = useSite();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, category = edit
  const [actionError, setActionError] = useState("");

  const nextOrder = categories.length ? Math.max(...categories.map((c) => c.order ?? 0)) + 1 : 0;

  const remove = async (c) => {
    if (!window.confirm(`Remove "${c.title}"? Its products stay in the database but will not be shown.`)) return;
    setActionError("");
    try {
      await categoriesApi.remove(c.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Categories" text="Collections shown on the home page and at /collections/…">
        <button className="ad-btn" onClick={() => setEditing({})}>
          + Add category
        </button>
      </PageHeader>

      <section className="ad-card">
        {actionError && <p className="ad-error" role="alert">{actionError}</p>}

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Link</th>
                <th>Sub-categories</th>
                <th>On home page</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="ad-cell-main">
                    <span className="ad-thumb">{c.image && <img src={assetUrl(c.image)} alt="" />}</span>
                    {c.title}
                  </td>
                  <td>/collections/{c.slug}</td>
                  <td>
                    <ul className="ad-chips">
                      {c.subCategories.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{c.showOnHome ? "Yes" : "No"}</td>
                  <td className="ad-row-actions">
                    <button onClick={() => setEditing(c)}>Edit</button>
                    <button className="danger" onClick={() => remove(c)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="ad-empty">
                    No categories yet. Click “Add category”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <CategoryModal
          category={editing}
          nextOrder={nextOrder}
          onClose={() => setEditing(null)}
          onSaved={reload}
        />
      )}
    </>
  );
}
