import { Map } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
// import Map from '@vis.gl/react-maplibre/maplibre';
// import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from './lib/constants';
import YouAreHere from './components/you-are-here';
export default function App() {
  return (
    <Map
      mapLib={maplibregl}
      initialViewState={{
        longitude: middleOfUSA[0],
        latitude: middleOfUSA[1],
        zoom: 2
      }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      onLoad={(e) => {
        const map = e.target as any;
        if (typeof map.setFog === 'function') {
          map.setFog(null);
        }
      }}
    >
      <YouAreHere />
    </Map>
  );
}