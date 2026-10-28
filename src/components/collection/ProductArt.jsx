import { METAL_COLOR } from '../../data/collectionFilters'

export default function ProductArt({ metal }) {
  const color = METAL_COLOR[metal]
  return (
    <svg viewBox="0 0 200 120" className="prod-art" aria-hidden="true">
      <ellipse
        cx="100"
        cy="62"
        rx="82"
        ry="30"
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeDasharray="1.5 5"
        strokeLinecap="round"
      />
      <ellipse
        cx="100"
        cy="62"
        rx="82"
        ry="30"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.55"
      />
      <rect x="92" y="28" width="16" height="9" rx="2" fill={color} />
    </svg>
  )
}
