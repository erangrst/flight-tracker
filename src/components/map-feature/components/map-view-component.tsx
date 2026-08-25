import { Map } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from '../../../lib/constants';

export default function MapViewComponent() {
    return (
        <Map
            mapLib={maplibregl}
            initialViewState={{
                longitude: middleOfUSA[0],
                latitude: middleOfUSA[1],
                zoom: 2
            }}
            renderWorldCopies={false}
            mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
        </Map>
    );
}