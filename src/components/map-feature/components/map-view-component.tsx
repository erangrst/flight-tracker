import { Map, MapLayerMouseEvent, MapProvider, ViewStateChangeEvent } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from '../../../lib/constants';
import { useCallback, useState } from 'react';
import MiniMapComponent from './mini-map-component';

/*  Available styles:
    
    https://tiles.openfreemap.org/styles/liberty
    https://tiles.openfreemap.org/styles/bright
    https://tiles.openfreemap.org/styles/dark
    https://tiles.openfreemap.org/styles/positron
    https://tiles.openfreemap.org/styles/fiord

    https://demotiles.maplibre.org/globe.json
    https://demotiles.maplibre.org/style.json
    https://demotiles.maplibre.org/osm-bright-gl-style.json
    https://demotiles.maplibre.org/pmtiles/raster/style-watercolor.json


    https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json
    https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
    https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json
*/

export interface ViewportBounds {
    west: number;
    south: number;
    east: number;
    north: number;
}


export default function MapViewComponent() {
    const MAIN_MAP_ID = 'main-map';

    const [viewportBounds, setViewportBounds] =
        useState<ViewportBounds>({
            west: -180,
            south: -85,
            east: 180,
            north: 85,
        });

    const handleMove = useCallback(
        (event: ViewStateChangeEvent) => {
            const bounds = event.target.getBounds();

            setViewportBounds({
                west: bounds.getWest(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                north: bounds.getNorth(),
            });
        },
        [],
    );


    const handleMapClick = (event: MapLayerMouseEvent) => {
        const { lng, lat } = event.lngLat;

        console.log('Clicked:', lng, lat);
    };

    return (

        <MapProvider>
            <div
                style={{
                    border: '4px solid blue',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Map
                    mapLib={maplibregl}
                    initialViewState={{
                        longitude: middleOfUSA[0],
                        latitude: middleOfUSA[1],
                        zoom: 2
                    }}

                    onMove={handleMove}
                    onClick={(event: MapLayerMouseEvent) => handleMapClick(event)}
                    // onClick={(event: MapLayerMouseEvent) => {
                    //     console.log('Longitude:', event.lngLat.lng);
                    //     console.log('Latitude:', event.lngLat.lat);
                    // }}

                    renderWorldCopies={false}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"


                >
                    <MiniMapComponent bounds={viewportBounds} />                </Map >
            </div>
        </MapProvider >
    );
}