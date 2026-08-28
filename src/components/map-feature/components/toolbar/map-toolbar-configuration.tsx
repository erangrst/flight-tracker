import { handleZoomIn, handleZoomOut, handleResetZoom, handleOverviewMap, handleCoordinates } from '../../logic/map.logic';
import { PrimaryToolbarItem } from './map-toolbar.component';
import { Map, ZoomOutMap, ZoomIn, LocationOn, ZoomInMap, ZoomOut } from '@mui/icons-material';


export function buildToolbarItems(mapRef, setShowOverviewMap, setShowCoordinates): PrimaryToolbarItem[] {

    console.log('Building toolbar items with mapRef:', { mapRef });

    return [
        {
            id: 'zoom',
            icon: <ZoomInMap />,
            tooltip: 'Zoom',

            subItems: [
                {
                    id: 'zoom-in',
                    icon: <ZoomIn />,
                    tooltip: 'Zoom in',
                    onClick: () => handleZoomIn(mapRef)
                },
                {
                    id: 'zoom-out',
                    icon: <ZoomOut />,
                    tooltip: 'Zoom out',
                    onClick: () => handleZoomOut(mapRef),
                },
                {
                    id: 'reset-zoom',
                    icon: <ZoomOutMap />,
                    tooltip: 'Reset zoom',
                    onClick: () => handleResetZoom(mapRef),
                },
            ],
        },

        {
            id: 'view',
            icon: <Map />,
            tooltip: 'View',

            subItems: [
                {
                    id: 'overview-map',
                    icon: <Map />,
                    tooltip: 'Display overview map',
                    onClick: () => handleOverviewMap(setShowOverviewMap),
                },
                {
                    id: 'coordinates',
                    icon: <LocationOn />,
                    tooltip: 'Display coordinates',
                    onClick: () => handleCoordinates(setShowCoordinates),
                },
            ],
        },
    ];

};
