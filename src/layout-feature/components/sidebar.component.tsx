import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { SideBarItem } from '../models/sidebar-item.model';
import { useSidebarItems } from '../logic/sidebar.logic';

export interface SideBarComponentProps {
    isExpanded: boolean;
    onExpandedToggle: (expanded: boolean) => void;
    expandedWidth?: number | string;
    collapsedWidth?: number | string;
    items?: SideBarItem[];
    activeItemId?: string;
    onActiveItemChange?: (id: string) => void;
}

export const SideBarComponent: React.FC<SideBarComponentProps> = ({
    isExpanded,
    onExpandedToggle,
    expandedWidth = 320,
    collapsedWidth = 48,
    activeItemId: controlledActiveId,
    onActiveItemChange,
}) => {
    // Read registered items from the registry (or fallback to propsItems if provided)
    const registeredItems = useSidebarItems();
    const allItems = registeredItems;

    // Track user's explicit selection when not controlled from outside
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Derive active item directly during render (no effect, prevents cascading renders)
    const effectiveId = controlledActiveId ?? selectedId;
    const activeItem = allItems.find((item) => item.id === effectiveId) ?? allItems[0];
    const currentActiveId = activeItem?.id ?? '';

    // Smoothly trigger window resize events during expansion/collapse transition
    // so MapLibre GL immediately resizes without lag or clipping
    useEffect(() => {
        const intervalId = window.setInterval(() => {
            window.dispatchEvent(new Event('resize'));
        }, 30);

        const timeoutId = window.setTimeout(() => {
            window.clearInterval(intervalId);
            window.dispatchEvent(new Event('resize'));
        }, 300);

        return () => {
            window.clearInterval(intervalId);
            window.clearTimeout(timeoutId);
        };
    }, [isExpanded]);

    function handleItemClick(item: SideBarItem) {
        if (!isExpanded) {
            // When collapsed, pressing an icon expands the sidebar and displays the component
            if (controlledActiveId === undefined) { setSelectedId(item.id); }
            onActiveItemChange?.(item.id);
            onExpandedToggle(true);
        } else {
            // When already expanded:
            if (item.id === currentActiveId) {
                // Clicking the active item's icon collapses the sidebar
                onExpandedToggle(false);
            } else {
                // Clicking another icon switches the displayed component
                if (controlledActiveId === undefined) { setSelectedId(item.id); }
                onActiveItemChange?.(item.id);
            }
        }
    };

    function handleCollapse() {
        onExpandedToggle(false);
    };

    const currentWidth = isExpanded ? expandedWidth : collapsedWidth;
    const ActiveComponent = activeItem?.component;

    return (
        <Box
            component="aside"
            aria-label="Application Sidebar"
            onTransitionEnd={() => window.dispatchEvent(new Event('resize'))}
            sx={{
                width: currentWidth,
                minWidth: currentWidth,
                maxWidth: currentWidth,
                height: '100%',
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'row',
                transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                flexShrink: 0,
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 10,
            }}
        >
            {/* Left Activity Rail (contains all injected icons) */}
            <Box
                sx={{
                    width: collapsedWidth,
                    minWidth: collapsedWidth,
                    maxWidth: collapsedWidth,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 1,
                    gap: 1,
                    borderRight: isExpanded ? '1px solid' : 'none',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                }}
            >
                {allItems.map((item) => {
                    const isSelected = isExpanded && item.id === currentActiveId;

                    return (
                        <Tooltip key={item.id} title={item.tooltip} placement="right" arrow>
                            <IconButton
                                onClick={() => handleItemClick(item)}
                                size="medium"
                                aria-label={item.tooltip}
                                sx={{
                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                    bgcolor: isSelected ? 'action.selected' : 'transparent',
                                    borderRadius: 1.5,
                                    border: isSelected ? '1px solid' : '1px solid transparent',
                                    borderColor: isSelected ? 'primary.light' : 'transparent',
                                    transition: 'all 150ms ease',
                                    '&:hover': {
                                        bgcolor: isSelected ? 'action.selected' : 'action.hover',
                                        color: 'primary.main',
                                    },
                                }}
                            >
                                {item.icon}
                            </IconButton>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* Right Expanded Content Panel (displayed when sidebar is expanded) */}
            {isExpanded && (
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header: Displays active title + icon (clickable to collapse) & collapse button */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            minHeight: 56,
                            maxHeight: 56,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Tooltip title="Click to collapse panel" arrow>
                            <Box
                                onClick={handleCollapse}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    minWidth: 0,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    borderRadius: 1,
                                    px: 0.75,
                                    py: 0.5,
                                    transition: 'background-color 150ms ease',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                {activeItem?.icon}
                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1.05rem',
                                        color: 'text.primary',
                                    }}
                                >
                                    {activeItem?.title || activeItem?.tooltip || 'Information'}
                                </Typography>
                            </Box>
                        </Tooltip>

                        <Tooltip title="Collapse panel" arrow>
                            <IconButton
                                onClick={handleCollapse}
                                size="small"
                                aria-label="Collapse panel"
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&:hover': { bgcolor: 'action.hover', },
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Content Body: Dynamically renders the active component with its registered props */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                        }}
                    >
                        {ActiveComponent ? (
                            <ActiveComponent {...(activeItem?.props || {})} />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No content available.
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};
