import { ZoomOutMap } from '@mui/icons-material';
import { useControl } from '@vis.gl/react-maplibre';
import type { ControlPosition, IControl, Map as MapLibreMap } from 'maplibre-gl';
import { createRoot, Root } from 'react-dom/client';

class MyNavigationControl implements IControl {
    private container!: HTMLElement;
    private map!: MapLibreMap;
    private position: ControlPosition;
    private root!: Root;

    constructor(position: ControlPosition = 'top-right') {
        this.position = position;
    }

    onAdd(map: MapLibreMap): HTMLElement {
        this.map = map;

        this.container = document.createElement('div');

        this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        // Zoom in
        const zoomIn = document.createElement('button');

        zoomIn.type = 'button';
        zoomIn.className = 'maplibregl-ctrl-icon';
        zoomIn.setAttribute('aria-label', 'Zoom in');
        zoomIn.innerHTML = '+';

        zoomIn.onclick = () => {
            this.map.zoomIn();
        };

        // Zoom out
        const zoomOut = document.createElement('button');

        zoomOut.type = 'button';
        zoomOut.className = 'maplibregl-ctrl-icon';
        zoomOut.setAttribute('aria-label', 'Zoom out');
        zoomOut.innerHTML = '−';

        zoomOut.onclick = () => {
            this.map.zoomOut();
        };

        // Custom button
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'maplibregl-ctrl-icon';
        button.setAttribute('aria-label', 'Reset zoom');
        button.title = 'Reset zoom';

        this.container.appendChild(button);

        // Render MUI icon inside the MapLibre button
        this.root = createRoot(button);

        this.root.render(<ZoomOutMap fontSize="small" />);

        button.onclick = () => { this.map.easeTo({ zoom: 2, }); };

        this.container.appendChild(zoomIn);
        this.container.appendChild(zoomOut);
        this.container.appendChild(button);

        return this.container;
    }

    onRemove(): void {
        this.container.remove();
    }

    getPosition(): ControlPosition {
        return this.position;
    }
}

export function MyNavigationControlComponent() {
    useControl(() => new MyNavigationControl(), { position: 'top-left', });
    return null;
}
