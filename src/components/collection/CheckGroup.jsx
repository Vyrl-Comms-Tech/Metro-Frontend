import Collapsible from './Collapsible'

export default function CheckGroup({
  title,
  options,
  counts,
  selected,
  onToggle,
  scroll,
  defaultOpen,
}) {
  return (
    <Collapsible title={title} defaultOpen={defaultOpen}>
      <ul className={scroll ? 'scroll' : ''}>
        {options.map((o) => (
          <li key={o}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => onToggle(o)}
              />
              <span className="box" />
              <span className="lbl">{o}</span>
              <span className="cnt">({counts[o] ?? 0})</span>
            </label>
          </li>
        ))}
      </ul>
    </Collapsible>
  )
}
