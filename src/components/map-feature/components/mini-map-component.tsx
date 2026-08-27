import { useEffect, useMemo } from 'react';

import Map, {
    Layer,
    Source,
    useMap,
} from '@vis.gl/react-maplibre';

import type { Feature, Polygon } from 'geojson';

import type {
    FillLayerSpecification,
    LineLayerSpecification,
} from 'maplibre-gl';
import { ViewportBounds } from './map-view-component';


const MINI_MAP_ID = 'mini-map';

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

interface MiniMapProps {
    bounds: ViewportBounds;
}

export default function MiniMap({
    bounds,
}: MiniMapProps) {
    const { [MINI_MAP_ID]: miniMap } = useMap();

    const viewportFeature = useMemo<
        Feature<Polygon>
    >(
        () => ({
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [bounds.west, bounds.south],
                        [bounds.east, bounds.south],
                        [bounds.east, bounds.north],
                        [bounds.west, bounds.north],
                        [bounds.west, bounds.south],
                    ],
                ],
            },
        }),
        [bounds],
    );

    useEffect(() => {
        if (!miniMap) {
            return;
        }

        miniMap.fitBounds(
            [
                [bounds.west, bounds.south],
                [bounds.east, bounds.north],
            ],
            {
                padding: 30,
                duration: 0,
                maxZoom: 8,
            },
        );
    }, [miniMap, bounds]);

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
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            }}
        >
            <Map
                id={MINI_MAP_ID}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
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