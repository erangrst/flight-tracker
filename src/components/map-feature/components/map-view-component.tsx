import { Map, MapLayerMouseEvent } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from '../../../lib/constants';

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



export default function MapViewComponent() {


    const handleMapClick = (event: MapLayerMouseEvent) => {
        const { lng, lat } = event.lngLat;

        console.log('Clicked:', lng, lat);
    };

    return (
        <Map
            mapLib={maplibregl}
            initialViewState={{
                longitude: middleOfUSA[0],
                latitude: middleOfUSA[1],
                zoom: 2
            }}




            onClick={(event: MapLayerMouseEvent) => handleMapClick(event)}
            // onClick={(event: MapLayerMouseEvent) => {
            //     console.log('Longitude:', event.lngLat.lng);
            //     console.log('Latitude:', event.lngLat.lat);
            // }}

            renderWorldCopies={false}
            mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
        </Map >
    );
}