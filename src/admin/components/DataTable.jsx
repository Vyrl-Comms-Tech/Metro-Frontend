export default function DataTable({ columns, rows, rowKey = 'id', empty = 'No records yet.', loading = false, rowClassName, caption }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        {caption && <caption className="ad-sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={column.className}>
                {column.label || <span className="ad-sr-only">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]} className={rowClassName?.(row)}>
              {columns.map((column) => (
                <td key={column.key} className={column.cellClassName}>
                  {column.render ? column.render(row) : (row[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="ad-empty">
                {loading ? 'Loading…' : empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
