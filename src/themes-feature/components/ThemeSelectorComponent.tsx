import { DarkMode, LightMode } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import type { MouseEvent } from 'react';

export interface ThemeSelectorComponentProps {
    mode: PaletteMode;
    onModeChange: (mode: PaletteMode) => void;
}

export const ThemeSelectorComponent: React.FC<ThemeSelectorComponentProps> = ({ mode, onModeChange }) => {

    const handleChange = (_event: MouseEvent<HTMLElement>, value: PaletteMode | null) => {
        if (value !== null) { onModeChange(value); }
    };

    return (
        <ToggleButtonGroup
            aria-label="Theme selection"
            exclusive
            onChange={handleChange}
            size="small"
            value={mode}
        >
            <ToggleButton aria-label="Light theme" title="Light theme" value="light">
                <LightMode fontSize="small" />
            </ToggleButton>
            <ToggleButton aria-label="Dark theme" title="Dark theme" value="dark">
                <DarkMode fontSize="small" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
