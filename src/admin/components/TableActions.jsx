export default function TableActions({ name, onEdit, onRemove }) {
  return (
    <div className="ad-row-actions">
      <button type="button" onClick={onEdit} aria-label={`Edit ${name}`}>Edit</button>
      <button type="button" className="danger" onClick={onRemove} aria-label={`Remove ${name}`}>Remove</button>
    </div>
  )
}
