import { useState } from 'react'
import Chevron from './Chevron'

export default function Collapsible({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="col-group">
      <button
        className="col-group-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <Chevron open={open} />
      </button>
      {open && children}
    </div>
  )
}
