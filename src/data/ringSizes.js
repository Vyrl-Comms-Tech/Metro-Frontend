const halves = (from, to) =>
  Array.from({ length: (to - from) * 2 + 1 }, (_, i) => from + i / 2).map((n) => (n % 1 ? `${Math.floor(n)}½` : `${n}`));

// UK and Australia use letters (F½ up to Z)
const LETTERS = ["F½", ..."GHIJKLMNOPQRSTUVWXYZ".split("").flatMap((letter) => [letter, `${letter}½`])];

// the sizes each country offers; "I DONT KNOW" has none, so the size list stays disabled
export const RING_SIZES = {
  UK: LETTERS,
  USA: halves(3, 13),
  EUROPE: Array.from({ length: 27 }, (_, i) => `${44 + i}`),
  AUSTRALIA: LETTERS,
  "I DONT KNOW": [],
};

export const RING_COUNTRIES = Object.keys(RING_SIZES);
