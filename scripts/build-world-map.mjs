// Projects Natural Earth country outlines (via world-atlas) into SVG paths for
// the passport map, so the site ships a small JSON file instead of d3 and
// topojson. Rerun after changing WIDTH:
//
//   node scripts/build-world-map.mjs
//
// Writes app/data/world-map.json:
//   graticule: 10° lines of latitude and longitude
//   countries: ISO alpha-3 code, SVG path, and the bounds of the largest
//              landmass (so France is framed in Europe, not French Guiana)

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoArea, geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const isoCountries = require("i18n-iso-countries");

const WIDTH = 1000;
const ANTARCTICA = "010";

const load = (name) => {
  const topology = JSON.parse(readFileSync(require.resolve(`world-atlas/${name}`), "utf8"));
  return feature(topology, topology.objects.countries).features.filter((f) => f.id !== ANTARCTICA);
};
const coarse = load("countries-110m.json");
const fine = load("countries-50m.json");

const projection = geoNaturalEarth1().fitWidth(WIDTH, { type: "FeatureCollection", features: fine });
const path = geoPath(projection).digits(1);
const [[, top], [, bottom]] = path.bounds({ type: "FeatureCollection", features: fine });
const height = Math.ceil(bottom - top);
projection.translate([projection.translate()[0], projection.translate()[1] - top]);

const alpha3 = (f) => (f.id ? isoCountries.numericToAlpha3(f.id) : undefined) ?? null;

// The biggest polygon, so overseas territories don't stretch the bounds.
const mainland = (f) => {
  if (f.geometry.type !== "MultiPolygon") return f;
  const polygons = f.geometry.coordinates.map((coordinates) => ({ type: "Polygon", coordinates }));
  return polygons.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
};

const coarseById = new Map(coarse.map((f) => [f.id, f]));
// Match on name as well as id: some features have no id (Kosovo, Somaliland)
// and some territories share their country's (Ashmore and Cartier Is. and
// Australia), so an id alone would draw one outline several times.
const coarseFor = (f) => {
  const match = f.id ? coarseById.get(f.id) : undefined;
  return match?.properties.name === f.properties.name ? match : undefined;
};
const round1 = (v) => Math.round(v * 10) / 10;
const countries = fine.map((f) => {
  const [[x0, y0], [x1, y1]] = path.bounds(mainland(f));
  return {
    code: alpha3(f),
    // Coarse outlines are plenty at this size; tiny countries only exist in 50m.
    d: path(coarseFor(f) ?? f),
    b: [round1(x0), round1(y0), round1(x1), round1(y1)],
  };
});

const out = new URL("../app/data/world-map.json", import.meta.url);
const graticule = path(geoGraticule10());
writeFileSync(out, JSON.stringify({ width: WIDTH, height, graticule, countries }));
console.log(`world-map.json: ${countries.length} countries, ${WIDTH}x${height}`);
