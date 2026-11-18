// Passport sections, in the order they appear. Each starts on a fresh page;
// a continent with no countries is left out.
export const CONTINENTS = [
  "Oceania",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
] as const;
export type Continent = (typeof CONTINENTS)[number];

export interface Country {
  slug: string;
  name: string;
  // ISO 3166 alpha-3, the abbreviation border stamps use.
  code: string;
  continent: Continent;
  // Home gets a "HOME" stamp and isn't counted as a place visited.
  home?: boolean;
  note?: string;
  // Remote hosts must be allowed in `images.remotePatterns` in next.config.ts.
  photo?: { src: string; alt: string; credit?: string };
}

const c = (name: string, code: string, continent: Continent, extra: Partial<Country> = {}): Country => ({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  code,
  continent,
  ...extra,
});

const listed: Country[] = [
  c("Australia", "AUS", "Oceania", {
    home: true,
    note: "Grew up in Melbourne, moved to Sydney for AMD. Home.",
  }),
  c("New Zealand", "NZL", "Oceania"),
  c("Fiji", "FJI", "Oceania"),

  c("China", "CHN", "Asia"),
  c("Hong Kong", "HKG", "Asia"),
  c("Macao", "MAC", "Asia"),
  c("Japan", "JPN", "Asia"),
  c("South Korea", "KOR", "Asia"),
  c("Vietnam", "VNM", "Asia"),
  c("Indonesia", "IDN", "Asia"),

  c("United Kingdom", "GBR", "Europe"),
  c("France", "FRA", "Europe"),
  c("Switzerland", "CHE", "Europe"),
  c("Italy", "ITA", "Europe"),
  c("Vatican City", "VAT", "Europe"),
  c("Greece", "GRC", "Europe"),

  c("United States", "USA", "North America"),
  c("Canada", "CAN", "North America"),

  c("South Africa", "ZAF", "Africa"),
  c("Lesotho", "LSO", "Africa"),
  c("Eswatini", "SWZ", "Africa"),
  c("Mozambique", "MOZ", "Africa"),
  c("Zimbabwe", "ZWE", "Africa"),
  c("Zambia", "ZMB", "Africa"),
];

// Section order, then home first, then the order listed above.
export const countries: Country[] = CONTINENTS.flatMap((continent) =>
  listed
    .filter((country) => country.continent === continent)
    .sort((a, b) => Number(!!b.home) - Number(!!a.home)),
);

export const countriesVisited = countries.filter((country) => !country.home).length;
