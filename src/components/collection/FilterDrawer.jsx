import { X } from 'lucide-react'

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
)

// phones and tablets: the filters open as a panel sliding in from the left. These pieces are hidden on wide screens, where the filters stay in the sidebar.

// the button in the toolbar next to the sort box
export function FilterButton({ active, onOpen }) {
  return (
    <button type="button" className="col-filter-open" onClick={onOpen}>
      <FilterIcon />
      Filters{active > 0 && ` (${active})`}
    </button>
  )
}

// title and close button at the top of the panel
export function DrawerHead({ active, onClose }) {
  return (
    <div className="col-drawer-head">
      <span>Filters{active > 0 && ` (${active})`}</span>
      <button type="button" aria-label="Close filters" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  )
}

// the buttons at the bottom: reset every filter, and close the panel on the results
export function DrawerFoot({ count, label, active, onReset, onClose }) {
  return (
    <div className="col-drawer-foot">
      <button type="button" className="col-drawer-reset" disabled={active === 0} onClick={onReset}>
        Reset all
      </button>
      <button type="button" className="col-drawer-show" onClick={onClose}>
        Show {count} {label}
      </button>
    </div>
  )
}

export function DrawerBackdrop({ open, onClose }) {
  return open ? <div className="col-backdrop" onClick={onClose} /> : null
}
