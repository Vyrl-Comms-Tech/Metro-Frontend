import { ChevronDown, HelpCircle, Heart, Infinity as InfinityIcon } from "lucide-react";
import { RING_COUNTRIES, RING_SIZES } from "../../data/ringSizes";

const MAX_ENGRAVING = 20;
const SYMBOLS = [
  { symbol: "♡", label: "Add a heart", Icon: Heart },
  { symbol: "∞", label: "Add an infinity sign", Icon: InfinityIcon },
];

// a dropdown with our own arrow instead of the browser's
const Select = ({ children, ...props }) => (
  <div className="pd-select">
    <select {...props}>{children}</select>
    <ChevronDown size={16} strokeWidth={1.6} aria-hidden="true" />
  </div>
);

// the ring size (country, then size) and the engraving, for the ring product pages
// `ring` is { country, size, engraving }; `onChange` gets the fields that changed
export default function RingOptions({ ring, onChange }) {
  const sizes = RING_SIZES[ring.country] ?? [];

  return (
    <>
      <div className="pd-options">
        <h2>
          Select Ring Size <HelpCircle size={14} aria-label="Choose your country, then your size" />
        </h2>
        <div className="pd-ring-size">
          <Select value={ring.country} onChange={(e) => onChange({ country: e.target.value, size: "" })} aria-label="Country">
            <option value="">Select Country</option>
            {RING_COUNTRIES.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </Select>
          <Select value={ring.size} disabled={!sizes.length} onChange={(e) => onChange({ size: e.target.value })} aria-label="Ring size">
            <option value="">Options</option>
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="pd-options">
        <h2>Engraving</h2>
        <div className="pd-engraving">
          <input
            value={ring.engraving}
            maxLength={MAX_ENGRAVING}
            placeholder="Add Engraving"
            aria-label="Engraving"
            onChange={(e) => onChange({ engraving: e.target.value })}
          />
          {SYMBOLS.map(({ symbol, label, Icon }) => (
            <button
              key={symbol}
              type="button"
              aria-label={label}
              disabled={ring.engraving.length >= MAX_ENGRAVING}
              onClick={() => onChange({ engraving: ring.engraving + symbol })}
            >
              <Icon size={18} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
