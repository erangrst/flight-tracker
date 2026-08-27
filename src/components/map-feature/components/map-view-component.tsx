import { Map, MapLayerMouseEvent, MapProvider, ViewStateChangeEvent } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from '../../../lib/constants';
import { useCallback, useState } from 'react';
import { OverviewMapComponent } from './overview-map-component';
import { ViewportBoundsModel } from '../models/viewport-bounds.model';
import { libertyMapStyle } from '../map-styles/build-in-styles';

export default function MapViewComponent() {

    const [viewportBounds, setViewportBounds] = useState<ViewportBoundsModel>({ west: -180, south: -85, east: 180, north: 85, });

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

                    onMove={(event: ViewStateChangeEvent) => handleMove(event)}
                    onClick={(event: MapLayerMouseEvent) => handleMapClick(event)}

                    renderWorldCopies={false}
                    mapStyle={libertyMapStyle}
                >
                    <OverviewMapComponent bounds={viewportBounds} />
                </Map >

            </div>
        </MapProvider >
    );
}