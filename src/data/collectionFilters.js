import { GEMSTONES, METALS, PENDANT_TYPES, SHAPES, TYPES } from "./collections";

export const SORTS = [
  { value: "best", label: "Best selling" },
  { value: "az", label: "Alphabetically, A-Z" },
  { value: "za", label: "Alphabetically, Z-A" },
  { value: "priceAsc", label: "Price, low to high" },
  { value: "priceDesc", label: "Price, high to low" },
];

export const METAL_COLOR = {
  "18k Yellow Gold": "#d9b25a",
  "18k White Gold": "#b9bcc2",
  "18k Rose Gold": "#d8a08c",
};

export const CHECK_KEYS = ["type", "subCategory", "gender", "category", "ringCovering", "style", "pendantType", "shape", "metal", "gemstone"];
export const RANGE_KEYS = ["width", "carat"];

export const CHECK_GROUPS = [
  { key: "type", title: "Diamond Type", options: TYPES, defaultOpen: false },
  { key: "subCategory", title: "Product Type", options: null },
  { key: "gender", title: "Gender", serverOnly: true }, // wedding rings: the options come from the server
  { key: "category", title: "Category", options: "all", scroll: true },
  { key: "ringCovering", title: "Ring Style", serverOnly: true },
  { key: "style", title: "Style", serverOnly: true },
  { key: "pendantType", title: "Pendant Type", options: PENDANT_TYPES },
  { key: "shape", title: "Diamond Shape", options: SHAPES, scroll: true },
  { key: "metal", title: "Metal Color", options: METALS },
  { key: "gemstone", title: "Gemstone", options: GEMSTONES, scroll: true },
];

// dual-thumb slider filters
export const RANGE_GROUPS = [
  { key: "width", title: "Width" },
  { key: "carat", title: "Carat Weight" },
]; // bounds and ticks come from rangesFor(slug) in data/collections.js
