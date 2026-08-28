import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface PrimaryToolbarButtonProps {
    icon: React.ReactNode;
    tooltip: string;
    selected?: boolean;
    onClick: () => void;
}

export const PrimaryToolbarButtonComponent: React.FC<PrimaryToolbarButtonProps> = ({ icon, tooltip, selected = false, onClick, }) => {
    return (
        <Tooltip title={tooltip} placement="right">
            <IconButton
                onClick={onClick}
                size="medium"
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: selected ? 'primary.main' : 'background.paper',
                    color: selected ? 'primary.contrastText' : 'text.primary',
                    boxShadow: 2,
                    '&:hover': { backgroundColor: selected ? 'primary.dark' : 'action.hover', },
                }}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
};

