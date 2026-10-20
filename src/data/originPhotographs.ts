export type OriginPhotograph = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  year: string;
};

// Real contextual photographs, separate from the applicant's project evidence.
// Original downloads, source descriptions, and licenses are documented in
// public/assets/images/pakistan/CREDITS.md. The CSS display is grayscale.
export const originPhotographs: readonly OriginPhotograph[] = [
  {
    src: '/assets/images/pakistan/sindh-floodwater.jpg',
    alt: 'A child crossing a makeshift path through stagnant floodwater in Sindh, Pakistan',
    width: 2560,
    height: 1732,
    title: 'People returning home as soon as the water recedes enough',
    author: 'Department for International Development / Magnus Wolfe-Murray',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:People_returning_home_as_soon_as_the_water_recedes_enough_(5330986750).jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    year: '2010',
  },
  {
    src: '/assets/images/pakistan/hanna-lake.jpg',
    alt: 'Cloudy water and floating debris at Hanna Lake near Quetta, Pakistan',
    width: 3264,
    height: 2448,
    title: 'Hanna lake and water Pollution',
    author: 'Izharkasi',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanna_lake_and_water_Pollution.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    year: '2015',
  },
  {
    src: '/assets/images/pakistan/kertee-pond.jpg',
    alt: 'A muddy bank and opaque standing water in a pond in Kertee, Pakistan',
    width: 960,
    height: 576,
    title: 'Water pond in Village Kertee',
    author: 'Gumansingh12340',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Water_pond_in_Village_Kertee.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    year: '2017',
  },
];
