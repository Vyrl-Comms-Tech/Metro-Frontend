import { useState } from "react";
import PageHeader from "../components/PageHeader";
import CustomJewelleryModal from "../components/CustomJewelleryModal";
import DataTable from "../components/DataTable";
import TableActions from "../components/TableActions";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

export default function CustomJewelleryAdmin() {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, item = edit
  const [reload, setReload] = useState(0);
  const [actionError, setActionError] = useState("");

  const { data, error, loading } = useAsync(() => axiosClient.get("/custom-jewellery", { params: { limit: 100 } }), [reload]);
  const items = data?.items ?? [];
  const nextOrder = items.length ? Math.max(...items.map((i) => i.order ?? 0)) + 1 : 0;

  const remove = async (item) => {
    if (!window.confirm(`Remove "${item.title || "this item"}"?`)) return;
    setActionError("");
    try {
      await axiosClient.delete(`/custom-jewellery/${item.id}`);
      setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const toggleActive = async (item) => {
    setActionError("");
    try {
      await axiosClient.put(`/custom-jewellery/${item.id}`, { active: item.active === false });
      setReload((n) => n + 1);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { key: "order", label: "Order", render: (item) => item.order ?? 0 },
    { key: "title", label: "Item", cellClassName: "ad-cell-main", render: (item) => <div className="ad-record"><span className="ad-thumb">{item.image && <img src={item.image} alt="" />}</span><span className="ad-primary-text">{item.title || "Custom jewellery"}</span></div> },
    { key: "type", label: "Type", render: (item) => item.video ? <span className="ad-status">Video</span> : "Image" },
    { key: "active", label: "Status", render: (item) => (
      <span className="ad-switch-row">
        <button type="button" role="switch" aria-checked={item.active !== false} aria-label={`${item.title || "Item"} is ${item.active === false ? "inactive" : "active"}`} className="ad-switch" onClick={() => toggleActive(item)} />
        <span className="ad-switch-label">{item.active === false ? "Inactive" : "Active"}</span>
      </span>
    ) },
    { key: "actions", label: "", cellClassName: "ad-actions-cell", render: (item) => <TableActions name={item.title || "item"} onEdit={() => setEditing(item)} onRemove={() => remove(item)} /> },
  ];

  return (
    <>
      <PageHeader title="Custom Jewellery" text="Images and videos shown in the Custom Jewellery section and page, in this order.">
        <button className="ad-btn" onClick={() => setEditing({})}>
          + Add item
        </button>
      </PageHeader>

      {(error || actionError) && (
        <p className="ad-error" role="alert">{error?.message ?? actionError}</p>
      )}

      <section className="ad-card ad-table-card">
        <DataTable caption="Custom jewellery" columns={columns} rows={items} loading={loading} empty="No items yet. The section stays hidden until you add one." />
      </section>

      {editing && (
        <CustomJewelleryModal
          item={editing}
          nextOrder={nextOrder}
          onClose={() => setEditing(null)}
          onSaved={() => setReload((n) => n + 1)}
        />
      )}
    </>
  );
}
