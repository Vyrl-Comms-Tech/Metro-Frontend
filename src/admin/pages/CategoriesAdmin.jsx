import { useState } from "react";
import { useSite } from "../../context/siteContext";
import PageHeader from "../components/PageHeader";
import CategoryModal from "../components/CategoryModal";
import TableActions from "../components/TableActions";
import "../../styles/CategoriesAdmin.css";
import axiosClient from "../../utils/axiosClient";

export default function CategoriesAdmin() {
  const { categories, reload } = useSite();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, category = edit
  const [actionError, setActionError] = useState("");

  const nextOrder = categories.length ? Math.max(...categories.map((c) => c.order ?? 0)) + 1 : 0;

  const toggleActive = async (c) => {
    setActionError("");
    try {
      await axiosClient.patch(`/categories/${c.id}/status`, { active: !(c.active ?? true) });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Remove "${c.title}"? Its products stay in the database but will not be shown.`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/categories/delete/${c.id}`);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Categories" text="Organise collections, visibility and home page cards.">
        <button className="ad-btn" onClick={() => setEditing({})}>
          + Add category
        </button>
      </PageHeader>

      <section className="ad-category-section" aria-label="Categories">
        {actionError && <p className="ad-error" role="alert">{actionError}</p>}
        <div className="ad-category-summary">
          <span>{categories.length} {categories.length === 1 ? 'collection' : 'collections'}</span>
          <span>Use the order field to arrange collections</span>
        </div>
        {categories.length === 0 ? (
          <div className="ad-category-empty">
            <strong>No categories yet</strong>
            <p>Add your first collection to organise products on the site.</p>
          </div>
        ) : (
          <ul className="ad-category-list">
            {categories.map((category) => (
              <li key={category.id} className={category.active === false ? 'is-inactive' : ''}>
                <div className="ad-category-identity">
                  <span className="ad-category-image">
                    {category.image ? <img src={category.image} alt="" /> : <span aria-hidden="true">◇</span>}
                  </span>
                  <div>
                    <div className="ad-category-title"><strong>{category.title}</strong><span>#{category.order ?? 0}</span></div>
                    <span className="ad-category-slug">/collections/{category.slug}</span>
                  </div>
                </div>
                <div className="ad-category-subcategories">
                  <span className="ad-category-label">Subcategories</span>
                  <span>{category.subCategories?.length ? category.subCategories.map((s) => (typeof s === 'string' ? s : s.title)).join(', ') : 'None added'}</span>
                </div>
                <div className="ad-category-visibility">
                  <span className="ad-category-label">Home page</span>
                  <span className={`ad-category-badge ${category.showOnHome ? '' : 'is-muted'}`}>
                    {category.showOnHome ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="ad-category-status">
                  <span className="ad-category-label">Status</span>
                  <button type="button" role="switch" aria-checked={category.active !== false} aria-label={`${category.title} is ${category.active === false ? 'inactive' : 'active'}`} className="ad-switch" onClick={() => toggleActive(category)} />
                  <span>{category.active === false ? 'Inactive' : 'Active'}</span>
                </div>
                <TableActions name={category.title} onEdit={() => setEditing(category)} onRemove={() => remove(category)} />
              </li>
            ))}
          </ul>
        )}
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
