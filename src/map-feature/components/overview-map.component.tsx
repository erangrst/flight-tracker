import React, { useEffect, useMemo } from 'react';
import Map, { Layer, Source, useMap, } from '@vis.gl/react-maplibre';
import type { Feature, Polygon } from 'geojson';
import { OVERVIEW_MAP_ID } from '../types';
import { ViewportBoundsModel } from '../models/viewport-bounds.model';
import { libertyMapStyle } from '../map-styles/build-in-styles';

const viewportFillLayer = {
    id: 'overview-map-viewport-fill',
    type: 'fill' as const,
    paint: {
        'fill-color': '#1976d2',
        'fill-opacity': 0.15,
    },
};

const viewportLineLayer = {
    id: 'overview-map-viewport-line',
    type: 'line' as const,
    paint: {
        'line-color': '#1976d2',
        'line-width': 2,
    },
};

interface OverviewMapProps { bounds: ViewportBoundsModel; }

export const OverviewMapComponent: React.FC<OverviewMapProps> = ({ bounds }: OverviewMapProps) => {

    const { [OVERVIEW_MAP_ID]: overviewMap } = useMap();

    const viewportFeature = useMemo<Feature<Polygon>>(() => ({
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
    }), [bounds]);

    useEffect(() => {
        if (!overviewMap) { return; }

        overviewMap.fitBounds(
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
    }, [overviewMap, bounds]);

    return (
        <div
            style={{
                position: 'absolute',
                right: 10,
                top: 10,
                width: 225,
                height: 150,
                zIndex: 100,
                border: '4px solid black',
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            }}
        >
            <Map
                id={OVERVIEW_MAP_ID}
                mapStyle={libertyMapStyle}
                initialViewState={{ longitude: 0, latitude: 20, zoom: 1 }}
                attributionControl={false}
                maplibreLogo={false}
                dragPan={false}
                dragRotate={false}
                scrollZoom={false}
                doubleClickZoom={false}
                boxZoom={false}
                keyboard={false}
                touchZoomRotate={false}
                style={{ width: '100%', height: '100%' }}
            >
                <Source
                    id="overview-map-viewport-source"
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