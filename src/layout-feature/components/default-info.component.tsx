import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';

export interface DefaultInfoComponentProps {
    heading?: string;
    description?: string;
    showTips?: boolean;
}

export const DefaultInfoComponent: React.FC<DefaultInfoComponentProps> = ({
    heading = 'Flight Tracker Map111',
    description = 'Use the interactive map to track flights, inspect points of interest, and manage bookmarks.',
    showTips = true,
}) => {
    return (
        <Stack spacing={2}>
            <Card variant="outlined">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MapOutlinedIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {heading}aaa
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </Card>

            {showTips && (
                <>
                    <Card variant="outlined">
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <BookmarkBorderIcon fontSize="small" color="secondary" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Bookmarks
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Right-click anywhere on the map to add a new bookmark. Right-click existing markers to edit, delete, or set as Home location.
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
                                Access zoom controls and layer visibility using the floating toolbar located directly on the map.
                            </Typography>
                        </CardContent>
                    </Card>
                </>
            )}
        </Stack>
    );
};

