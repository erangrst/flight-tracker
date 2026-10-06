import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface ToolbarButtonProps {
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    selected?: boolean;
}

export const ToolbarButtonComponent: React.FC<ToolbarButtonProps> = ({ icon, tooltip, onClick, selected = false, }) => {
    return (
        <Tooltip title={tooltip} placement="bottom">
            <IconButton
                onClick={onClick}
                size="medium"
                sx={{
                    width: 40,
                    height: 40,
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
