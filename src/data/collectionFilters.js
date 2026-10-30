import { GEMSTONES, METALS, PENDANT_TYPES, RANGES, SHAPES, TYPES } from "./collections";

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

export const CHECK_KEYS = ["type", "subCategory", "category", "pendantType", "shape", "metal", "gemstone"];
export const RANGE_KEYS = ["width", "carat"];

// checkbox filter groups; `options: null` = the collection's subcategories, `"all"` = all their options
export const CHECK_GROUPS = [
  { key: "type", title: "Diamond Type", options: TYPES, defaultOpen: false },
  { key: "subCategory", title: "Product Type", options: null }, // the collection's subcategories
  { key: "category", title: "Category", options: "all" }, // every third-level option of the collection
  { key: "pendantType", title: "Pendant Type", options: PENDANT_TYPES }, // necklaces only, hidden when no product has one
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
    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  {
    key: "carat",
    title: "Carat Weight",
    bounds: RANGES.carat,
    ticks: [0, 1, 2, 3],
  },
];
