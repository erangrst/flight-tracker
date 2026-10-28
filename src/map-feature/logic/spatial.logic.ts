import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';

/**
 * Generates a GeoJSON Polygon approximating a geodesic circle on the Earth's surface.
 *
 * @param center { lon: number, lat: number } in degrees
 * @param radiusInNm radius in nautical miles
 * @param points number of vertices in polygon (default 72)
 */
export function createGeodesicCircle(index: number, center: { lon: number; lat: number }, radiusInNm: number, points: number = 72): Feature<Polygon> {
  const { lon, lat } = center;
  const radiusInMeters = radiusInNm * 1852; // 1 NM = 1852 meters
  const earthRadius = 6371008.8; // Mean Earth radius in meters (WGS84)
  const angularDistance = radiusInMeters / earthRadius;

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const coordinates: [number, number][] = [];

  for (let i = 0; i <= points; i++) {
    const bearing = (i * 360) / points;
    const bearingRad = (bearing * Math.PI) / 180;

    const pLatRad = Math.asin(Math.sin(latRad) * Math.cos(angularDistance) + Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad));
    const pLonRad = lonRad + Math.atan2(Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad), Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(pLatRad));

    const pLat = (pLatRad * 180) / Math.PI;
    const pLon = (((pLonRad * 180) / Math.PI + 540) % 360) - 180;

    coordinates.push([pLon, pLat]);
  }

  return {
    type: 'Feature',
    id: index,
    geometry: { type: 'Polygon', coordinates: [coordinates] },
    properties: { center, radiusInNm },
  };
}

export const BUILT_IN_AREA_FILTER_CENTER: { lon: number; lat: number }[] = [
  { lon: -163.965236, lat: 72.848333 },
  { lon: -163.965236, lat: -64.848333 },
];

export const BUILT_IN_AREA_FILTER_RADIUS_NM = 245;

export const builtInAreaFiltersGeoJson: FeatureCollection<Polygon | Point> = {
  type: 'FeatureCollection',
  features: [
    ...BUILT_IN_AREA_FILTER_CENTER.map((area, index) => createGeodesicCircle(index, area, BUILT_IN_AREA_FILTER_RADIUS_NM)),
    ...BUILT_IN_AREA_FILTER_CENTER.map((area, index) => ({
      type: 'Feature' as const,
      id: `center-${index}`,
      properties: {
        id: 'builtin-areas-filters-center-point-source',
        areaIndex: index,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [area.lon, area.lat],
      },
    })),
  ],
};
