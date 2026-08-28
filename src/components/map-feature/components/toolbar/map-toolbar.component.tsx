// MapToolbar.tsx

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { PrimaryToolbarButtonComponent } from './primary-toolbar-button.component';

export interface PrimaryToolbarItem {
    id: string;
    icon: React.ReactNode;
    tooltip: string;
    subItems: ToolbarItem[];
}


export interface ToolbarItem {
    id: string;
    icon: React.ReactNode;
    tooltip: string;
    onClick: any;
}


interface MapToolbarProps {
    items: PrimaryToolbarItem[];
}

export const MapToolbarComponent: React.FC<MapToolbarProps> = ({ items }) => {

    const [openToolbarId, setOpenToolbarId] = useState<string | null>(null);

    const handleToggle = (toolbarId: string) => {
        setOpenToolbarId((currentId) => currentId === toolbarId ? null : toolbarId);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                left: 16,
                top: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                zIndex: 1000,
            }}
        >
            {items.map((toolbar) => {
                const isOpen = openToolbarId === toolbar.id;

                return (
                    <Box
                        key={toolbar.id}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, }} >

                        <PrimaryToolbarButtonComponent
                            icon={toolbar.icon}
                            tooltip={toolbar.tooltip}
                            selected={isOpen}
                            onClick={() => handleToggle(toolbar.id)}
                        />

                        {/* Sub toolbar */}
                        {isOpen && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    animation: 'toolbarOpen 150ms ease-out',
                                    '@keyframes toolbarOpen': {
                                        from: { opacity: 0, transform: 'translateX(-8px)', },
                                        to: { opacity: 1, transform: 'translateX(0)', },
                                    },
                                }}
                            >
                                {toolbar.subItems.map((subItem) => (
                                    <PrimaryToolbarButtonComponent
                                        key={subItem.id}
                                        icon={subItem.icon}
                                        tooltip={subItem.tooltip}
                                        onClick={subItem.onClick}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

