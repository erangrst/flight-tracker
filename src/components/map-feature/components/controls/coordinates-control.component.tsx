import { Box, Paper, Typography } from "@mui/material";
import { useControl } from "@vis.gl/react-maplibre";
import { useRef } from "react";
import { Root, createRoot } from "react-dom/client";

interface CoordinatesControlProps {
    position?: maplibregl.ControlPosition;
    precision?: number;
}

interface CoordinatesDisplayProps {
    longitude: number | null;
    latitude: number | null;
    precision: number;
}

export const CoordinatesControl = ({ position = 'bottom-left', precision = 6, }: CoordinatesControlProps) => {
    const rootRef = useRef<Root | null>(null);

    useControl(() => {
        const container = document.createElement('div');
        rootRef.current = createRoot(container);

        rootRef.current.render(<CoordinatesDisplayComponent longitude={null} latitude={null} precision={precision} />
        );

        return {
            onAdd: (map: maplibregl.Map) => {
                const handleMouseMove = (event: maplibregl.MapMouseEvent) => {
                    rootRef.current?.render(<CoordinatesDisplayComponent longitude={event.lngLat.lng} latitude={event.lngLat.lat} precision={precision} />);
                };

                map.on('mousemove', handleMouseMove);
                (
                    container as HTMLDivElement & { _handleMouseMove?: typeof handleMouseMove; }
                )._handleMouseMove = handleMouseMove;

                return container;
            },

            onRemove: (map: maplibregl.Map) => {
                const handleMouseMove = (container as HTMLDivElement & {
                    _handleMouseMove?: (event: maplibregl.MapMouseEvent) => void;
                }
                )._handleMouseMove;

                if (handleMouseMove) {
                    map.off('mousemove', handleMouseMove);
                }

                rootRef.current?.unmount();
                rootRef.current = null;
            },
        };
    },
        {
            position,
        }
    );

    return null;
};


const CoordinatesDisplayComponent: React.FC<CoordinatesDisplayProps> = ({ longitude, latitude, precision }) => {

    function formatCoordinate(coordinate: number | null) {
        if (coordinate === null) { return '—'.padStart(6 + precision, '-'); }

        const [integerPart, fractionPart] = Math.abs(coordinate).toFixed(precision).split('.');
        const sign = coordinate < 0 ? '-' : ' ';

        return `${sign}${integerPart.padStart(3, '0')}${fractionPart !== undefined ? `.${fractionPart}` : ''}`;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                border: '2px solid black',
                px: 1.5,
                py: 0.75,
                width: '18rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
        >
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre' }}>
                    Longitude: {formatCoordinate(longitude)}
                </Typography>

                <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre' }}>
                    Latitude: {formatCoordinate(latitude)}
                </Typography>
            </Box>
        </Paper>
    );
};