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
  "Heart",
  "Asscher",
  "Baguette",
  "Triangle",
  "Elongated Cushion",
];
export const METALS = ["18k White Gold", "18k Yellow Gold", "18k Rose Gold", "Platinum"];
export const TYPES = ["Lab Grown", "Natural"];
export const PENDANT_TYPES = ["Crosses", "Evil Eyes", "Circles", "Hearts", "Stars", "Others"];
export const GEMSTONES = [
  "Diamond",
  "Black Diamond",
  "Emerald",
  "Blue Sapphire",
  "Ruby",
  "Tanzanite",
  "Pink Sapphire",
  "Yellow Sapphire",
  "Rainbow Sapphire",
  "Green Sapphire",
  "Pink Diamond",
  "Yellow Diamond",
  "Red Garnet",
  "Blue Beryl",
  "Red Spinel",
];

// slider bounds (width in mm, carat)
export const RANGES = {
  width: { min: 0, max: 20, step: 0.5 },
  carat: { min: 0, max: 3, step: 0.25 },
};
