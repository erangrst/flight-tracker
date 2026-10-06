import { MapRef } from '@vis.gl/react-maplibre';

export function handleZoomIn(mapRef: React.RefObject<MapRef | null>) {
  console.log('Zooming in with mapRef:', { mapRef, curr: mapRef.current });

  mapRef.current?.getMap().zoomIn();
}

export function handleZoomOut(mapRef: React.RefObject<MapRef | null>) {
  mapRef.current?.getMap().zoomOut();
}

export function handleResetZoom(mapRef: React.RefObject<MapRef | null>) {
  mapRef.current?.getMap().setZoom(10);
}

export function handleOverviewMap(setShowOverviewMap: any) {
  setShowOverviewMap((current: any) => !current);
}

export function handleCoordinates(setShowCoordinates: any) {
  setShowCoordinates((current: any) => !current);
}
