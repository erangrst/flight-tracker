import { AttributionControl, LogoControl, Map, MapLayerMouseEvent, MapProvider, MapRef, NavigationControl, ScaleControl, useControl, ViewStateChangeEvent } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from '../../../lib/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ViewportBoundsModel } from '../models/viewport-bounds.model';
import { libertyMapStyle } from '../map-styles/build-in-styles';
import { OverviewMapComponent } from './overview-map.component';
import { MapToolbarComponent, PrimaryToolbarItem } from './toolbar/map-toolbar.component';
import { buildToolbarItems } from './toolbar/map-toolbar-configuration';

export default function MapViewComponent() {

    const mapRef = useRef<MapRef>(null);

    const [showOverviewMap, setShowOverviewMap] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(false);

    const [viewportBounds, setViewportBounds] = useState<ViewportBoundsModel>({ west: -180, south: -85, east: 180, north: 85, });

    const [toolbarItems, setToolbarItems] = useState<PrimaryToolbarItem[]>([]);

    useEffect(() => {
        const toolbarItems: PrimaryToolbarItem[] = buildToolbarItems(mapRef, setShowOverviewMap, setShowCoordinates);
        setToolbarItems(toolbarItems);
        console.log('Toolbar items built:', { toolbarItems });
    }, [mapRef]);

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
                    // mapLib={maplibregl}
                    ref={mapRef}
                    initialViewState={{
                        longitude: middleOfUSA[0],
                        latitude: middleOfUSA[1],
                        zoom: 2,
                        pitch: 0,
                        bearing: 0,
                        // padding: { top: 130, bottom: 130, left: 130, right: 130 },
                    }}

                    pitchWithRotate={false}
                    dragRotate={false}


                    // Zoom by mouse wheel
                    scrollZoom={true}

                    onMove={(event: ViewStateChangeEvent) => handleMove(event)}
                    onClick={(event: MapLayerMouseEvent) => handleMapClick(event)}

                    renderWorldCopies={false}
                    mapStyle={libertyMapStyle}

                    attributionControl={false}
                >
                    <OverviewMapComponent bounds={viewportBounds} />
                    {/* <NavigationControl position="top-left" showCompass={true} visualizeRoll={false} showZoom={true} visualizePitch={false} /> */}
                    <ScaleControl position='bottom-left' unit='metric' maxWidth={200} />
                    <LogoControl position='bottom-left' />
                    {/* <AttributionControl compact={true} customAttribution="Map design by me" position='bottom-left' /> */}

                    {/* <MyNavigationControlComponent /> */}
                    <MapToolbarComponent items={toolbarItems} />

                </Map >

            </div>
        </MapProvider >
    );
}