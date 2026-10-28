import { CircleLayerSpecification, FillLayerSpecification, LineLayerSpecification, SymbolLayerSpecification } from "maplibre-gl";


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

export function builtInAreasFiltersLayerStyle(isVisible: boolean = true) {
    const layerStyle: FillLayerSpecification = {
        id: 'builtin-area-filters-source',
        type: 'fill',
        source: 'builtin-area-filters-source',
        filter: ['==', '$type', 'Polygon'],
        paint: {
            'fill-color': 'darkorange',
            'fill-opacity': 0.15,
            'fill-outline-color': 'darkorange',
        },
        layout: {
            'visibility': isVisible ? 'visible' : 'none',
        },
    };

    return layerStyle;
}

export function builtInAreasFiltersOutlineLayerStyle(isVisible: boolean = true) {
    const layerStyle: LineLayerSpecification = {
        id: 'builtin-area-filters-source-outline',
        type: 'line',
        source: 'builtin-area-filters-source-outline',
        filter: ['==', '$type', 'Polygon'],
        paint: {
            'line-color': 'red',
            'line-width': 2,
        },
        layout: {
            'visibility': isVisible ? 'visible' : 'none',
        },
    };

    return layerStyle;
}

export function builtInAreasFiltersCenterLayerStyle(isVisible: boolean = true) {
    const layerStyle: CircleLayerSpecification = {
        id: 'builtin-area-filters-source-center',
        type: 'circle',
        source: 'builtin-area-filters-source-center',
        filter: ['==', '$type', 'Point'],
        paint: {
            'circle-radius': 5,
            'circle-color': 'darkorange',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
        },
        layout: {
            'visibility': isVisible ? 'visible' : 'none',
        },
    };

    return layerStyle;
}
