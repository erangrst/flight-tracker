export interface LocationModel {
  latitude: number;
  longitude: number;
  altitude: number;
}

export const EmptyLocation: LocationModel = {
  latitude: 0,
  longitude: 0,
  altitude: 0,
};
