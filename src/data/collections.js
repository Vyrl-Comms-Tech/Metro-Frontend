// Option lists and slider bounds used by the filters and the admin forms.
// Collections, products, FAQs and reels live in MongoDB and are loaded through the API.

export const SHAPES = [
  "Round",
  "Oval",
  "Pear",
  "Emerald",
  "Cushion",
  "Princess",
  "Marquise",
  "Radiant",
];
export const METALS = ["18k White Gold", "18k Yellow Gold", "18k Rose Gold"];
export const TYPES = ["Lab Grown", "Natural"];
export const GEMSTONES = [
  "Diamond",
  "Emerald",
  "Blue Sapphire",
  "Ruby",
  "Tanzanite",
  "Pink Sapphire",
];

// slider bounds (width in mm, carat)
export const RANGES = {
  width: { min: 0, max: 7, step: 0.5 },
  carat: { min: 0, max: 27, step: 0.5 },
};
