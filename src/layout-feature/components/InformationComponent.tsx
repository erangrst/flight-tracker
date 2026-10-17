import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Divider,
    Tooltip,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

export interface InformationComponentProps {
    title?: string;
    isExpanded: boolean;
    onExpandedToggle: (expanded: boolean) => void;
    expandedWidth?: number | string;
    collapsedWidth?: number | string;
}

export const InformationComponent: React.FC<InformationComponentProps> = ({
    title = 'Information',
    isExpanded,
    onExpandedToggle,
    expandedWidth = 320,
    collapsedWidth = 48,
}) => {

    const handleToggle = () => {
        const nextState = !isExpanded;
        onExpandedToggle?.(nextState);
    };

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

    const currentWidth = isExpanded ? expandedWidth : collapsedWidth;

    return (
        <Box
            component="aside"
            aria-label="Information Panel"
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
                flexDirection: 'column',
                transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                flexShrink: 0,
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 10,
            }}
        >
            {isExpanded ? (
                /* Expanded Panel Header */
                <Box
                    onClick={handleToggle}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.5,
                        minHeight: 56,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        boxSizing: 'border-box',
                    }}
                >
                    <Tooltip title="Click to collapse panel" arrow sx={{ backgroundColor: 'green' }}>
                        <Box
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
                            <InfoOutlinedIcon color="primary" />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    color: 'text.primary',
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                    </Tooltip>

                    <Tooltip title="Collapse panel" arrow>
                        <IconButton
                            onClick={handleToggle}
                            size="small"
                            aria-label="Collapse panel"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : (
                /* Collapsed Panel Header */
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 1,
                        minHeight: 56,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        boxSizing: 'border-box',
                    }}
                >
                    <Tooltip title="Expand panel" placement="right" arrow>
                        <IconButton
                            onClick={handleToggle}
                            size="small"
                            aria-label="Expand panel"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Panel Body */}
            {isExpanded ? (
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        boxSizing: 'border-box',
                    }}
                >

                    <Stack spacing={2}>
                        <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <MapOutlinedIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Map & Flight Tracker
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Use the interactive map on the right to track flights, inspect points of interest, and manage bookmarks.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined">
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <BookmarkBorderIcon fontSize="small" color="secondary" />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Bookmarks
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Right-click anywhere on the map to add a new bookmark or copy coordinates. Right-click existing markers to edit or delete them.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined">
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TouchAppOutlinedIcon fontSize="small" color="action" />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Quick Controls
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Access the zoom controls and layer toggles using the toolbar located on the map.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            ) : (
                /* Collapsed Body Strip: clickable to expand */
                <Box
                    onClick={handleToggle}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: 2,
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    <Tooltip title="Click to expand Information" placement="right" arrow>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <InfoOutlinedIcon color="action" fontSize="small" />
                            <Typography
                                variant="caption"
                                sx={{
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px',
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};
