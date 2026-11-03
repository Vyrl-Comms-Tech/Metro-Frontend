export default function TableActions({ name, onView, onEdit, onRemove }) {
  return (
    <div className="ad-row-actions">
      {onView && <button type="button" onClick={onView} aria-label={`View ${name}`}>View</button>}
      <button type="button" onClick={onEdit} aria-label={`Edit ${name}`}>Edit</button>
      <button type="button" className="danger" onClick={onRemove} aria-label={`Remove ${name}`}>Remove</button>
    </div>
  )
}
