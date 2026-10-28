import { GEMSTONES, METALS, RANGES, SHAPES, TYPES } from "./collections";

export const SORTS = [
  { value: "best", label: "Best selling" },
  { value: "az", label: "Alphabetically, A-Z" },
  { value: "za", label: "Alphabetically, Z-A" },
  { value: "new", label: "Date, new to old" },
];

export const METAL_COLOR = {
  "18k Yellow Gold": "#d9b25a",
  "18k White Gold": "#b9bcc2",
  "18k Rose Gold": "#d8a08c",
};

export const CHECK_KEYS = ["type", "category", "shape", "metal", "gemstone"];
export const RANGE_KEYS = ["width", "carat"];

// checkbox filter groups; `options: null` means "use the collection's own categories"
export const CHECK_GROUPS = [
  { key: "type", title: "Diamond Type", options: TYPES, defaultOpen: false },
  { key: "category", title: "Category", options: null },
  { key: "shape", title: "Diamond Shape", options: SHAPES, scroll: true },
  { key: "metal", title: "Metal Color", options: METALS },
  { key: "gemstone", title: "Gemstone", options: GEMSTONES, scroll: true },
];

// dual-thumb slider filters
export const RANGE_GROUPS = [
  {
    key: "width",
    title: "Width",
    bounds: RANGES.width,
    ticks: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    key: "carat",
    title: "Carat Weight",
    bounds: RANGES.carat,
    ticks: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27],
  },
];
