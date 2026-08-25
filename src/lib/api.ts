import { middleOfUSA } from './constants';

export interface LocationResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export async function getLocation(): Promise<[number, number]> {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const json = (await response.json()) as LocationResponse;

    console.log('%c YouAreHere 2', 'background-color: aqua', { json });

    if (typeof json.lat === 'number' && typeof json.lon === 'number') {
      console.log('%c YouAreHere 3', 'background-color: aqua', { lon: json.lon, lat: json.lat });

      return [json.lon, json.lat];
    }
    // eslint-disable-next-line no-empty
  } catch {}
  return middleOfUSA;
}
