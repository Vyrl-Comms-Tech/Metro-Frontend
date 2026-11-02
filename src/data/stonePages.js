// Sample stones for the Gemstone, Loose Diamond and Diamonds pages, until the real ones are added
const stone = (id, name, type, shape, carat, color) => ({ id: `preview-${id}`, name, type, shape, carat, color })

export const STONE_PAGES = {
  gemstone: {
    title: 'Gemstones',
    intro: 'Explore our collection of natural and lab grown gemstones.',
    stones: [
      stone('sapphire', 'Sapphire', 'Natural', 'Oval', 2.15, 'Blue'),
      stone('emerald', 'Emerald', 'Natural', 'Emerald', 3.02, 'Green'),
      stone('ruby', 'Ruby', 'Natural', 'Round', 1.86, 'Red'),
      stone('citrine', 'Citrine', 'Natural', 'Oval', 4.2, 'Yellow'),
      stone('amethyst', 'Amethyst', 'Natural', 'Cushion', 5.1, 'Purple'),
      stone('tanzanite', 'Tanzanite', 'Natural', 'Pear', 2.74, 'Violet'),
      stone('aquamarine', 'Aquamarine', 'Natural', 'Emerald', 3.4, 'Light Blue'),
      stone('garnet', 'Garnet', 'Natural', 'Round', 1.62, 'Red'),
    ],
  },
  'loose-diamond': {
    title: 'Loose Diamonds',
    intro: 'Choose a natural or lab grown loose diamond, then have it set in a design of your own.',
    stones: [
      stone('ld-round', 'Round Brilliant Diamond', 'Natural', 'Round', 1.0, 'D · VS1'),
      stone('ld-oval', 'Oval Diamond', 'Lab Grown', 'Oval', 1.5, 'E · VS2'),
      stone('ld-emerald', 'Emerald Cut Diamond', 'Natural', 'Emerald', 2.01, 'F · VVS2'),
      stone('ld-pear', 'Pear Diamond', 'Lab Grown', 'Pear', 1.2, 'E · VS1'),
      stone('ld-cushion', 'Cushion Diamond', 'Natural', 'Cushion', 1.75, 'G · VS2'),
      stone('ld-princess', 'Princess Diamond', 'Lab Grown', 'Princess', 1.1, 'D · VVS1'),
      stone('ld-marquise', 'Marquise Diamond', 'Natural', 'Marquise', 0.9, 'F · SI1'),
      stone('ld-radiant', 'Radiant Diamond', 'Lab Grown', 'Radiant', 2.3, 'E · VS1'),
    ],
  },
  diamonds: {
    title: 'Diamonds',
    intro: 'Discover our natural and lab grown diamonds, graded and cut to the highest standard.',
    stones: [
      stone('d-round', 'Round Diamond', 'Lab Grown', 'Round', 2.0, 'E · VS1'),
      stone('d-oval', 'Oval Diamond', 'Natural', 'Oval', 1.3, 'F · VS2'),
      stone('d-heart', 'Heart Diamond', 'Lab Grown', 'Heart', 1.05, 'E · VS2'),
      stone('d-asscher', 'Asscher Diamond', 'Natural', 'Asscher', 1.6, 'G · VS1'),
      stone('d-baguette', 'Baguette Diamond', 'Lab Grown', 'Baguette', 0.5, 'D · VVS2'),
      stone('d-black', 'Black Diamond', 'Natural', 'Round', 1.4, 'Black'),
      stone('d-pink', 'Pink Diamond', 'Lab Grown', 'Cushion', 1.02, 'Fancy Pink'),
      stone('d-yellow', 'Yellow Diamond', 'Natural', 'Radiant', 1.25, 'Fancy Yellow'),
    ],
  },
}
