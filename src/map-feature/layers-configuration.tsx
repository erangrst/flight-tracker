import { SymbolLayerSpecification } from "maplibre-gl";


export function poiLayerStyle(isPoiVisible: boolean) {
    const layerStyle: SymbolLayerSpecification = {
        id: 'poi-layer',
        type: 'symbol',
        source: 'poi-source', // Matches the id of the <Source> component below
        layout: {
            'icon-image': ['get', 'icon'],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'text-field': ['get', 'title'],
            'text-offset': [0, 1.25],
            'text-anchor': 'top',
            'visibility': isPoiVisible ? 'visible' : 'none'
        }
    };

    return layerStyle;
}