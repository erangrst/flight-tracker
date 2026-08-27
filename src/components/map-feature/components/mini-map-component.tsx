import { useEffect, useMemo } from 'react';
import Map, { Layer, Source, useMap, } from '@vis.gl/react-maplibre';
import type { Feature, Polygon } from 'geojson';

const MINI_MAP_ID = 'mini-map';

export interface ViewportPolygon {
    coordinates: [number, number][];
}

interface MiniMapProps {
    viewport: ViewportPolygon;
}

const viewportFillLayer = {
    id: 'minimap-viewport-fill',
    type: 'fill' as const,
    paint: {
        'fill-color': '#1976d2',
        'fill-opacity': 0.15,
    },
};

const viewportLineLayer = {
    id: 'minimap-viewport-line',
    type: 'line' as const,
    paint: {
        'line-color': '#1976d2',
        'line-width': 2,
    },
};

export default function MiniMap({
    viewport,
}: MiniMapProps) {
    const { [MINI_MAP_ID]: miniMap } = useMap();

    /*
     * Convert the four screen corners into a GeoJSON polygon.
     */
    const viewportFeature = useMemo<Feature<Polygon>>(
        () => ({
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        ...viewport.coordinates,
                        viewport.coordinates[0],
                    ],
                ],
            },
        }),
        [viewport],
    );

    /*
     * Move the minimap so that the current
     * main-map viewport is visible.
     */
    useEffect(() => {
        if (!miniMap || viewport.coordinates.length === 0) {
            return;
        }

        const lngs = viewport.coordinates.map(
            ([lng]) => lng,
        );

        const lats = viewport.coordinates.map(
            ([, lat]) => lat,
        );

        const west = Math.min(...lngs);
        const east = Math.max(...lngs);
        const south = Math.min(...lats);
        const north = Math.max(...lats);

        miniMap.fitBounds(
            [
                [west, south],
                [east, north],
            ],
            {
                padding: 30,
                duration: 0,
                maxZoom: 5,
            },
        );
    }, [miniMap, viewport]);

    return (
        <div
            style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                width: 220,
                height: 150,
                zIndex: 100,
                border: '2px solid white',
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow:
                    '0 2px 8px rgba(0, 0, 0, 0.4)',
                background: '#fff',
            }}
        >
            <Map
                id={MINI_MAP_ID}
                mapStyle="https://demotiles.maplibre.org/style.json"
                initialViewState={{
                    longitude: 0,
                    latitude: 20,
                    zoom: 1,
                }}
                attributionControl={false}
                maplibreLogo={false}
                dragPan={false}
                dragRotate={false}
                scrollZoom={false}
                doubleClickZoom={false}
                boxZoom={false}
                keyboard={false}
                touchZoomRotate={false}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <Source
                    id="minimap-viewport-source"
                    type="geojson"
                    data={viewportFeature}
                >
                    <Layer {...viewportFillLayer} />
                    <Layer {...viewportLineLayer} />
                </Source>
            </Map>
        </div>
    );
}