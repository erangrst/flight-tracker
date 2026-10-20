import { MapRef } from '@vis.gl/react-maplibre';

let activeMapRef: React.RefObject<MapRef | null> | MapRef | null = null;

export function setActiveMapRef(mapRef: React.RefObject<MapRef | null> | MapRef | null) {
  activeMapRef = mapRef;
}

export function getActiveMap(): MapRef | null {
  if (!activeMapRef) {
    return null;
  }
  return 'current' in activeMapRef ? activeMapRef.current : activeMapRef;
}

export function centerMap(longitude: number, latitude: number, zoom?: number) {
  const mapRef = getActiveMap();
  const map = mapRef?.getMap();

  if (map) {
    map.flyTo({
      center: [longitude, latitude],
      zoom: zoom ?? Math.max(map.getZoom(), 12),
      essential: true,
    });
  } else {
    window.dispatchEvent(
      new CustomEvent('map:center', { detail: { longitude, latitude, zoom } })
    );
  }
}

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
