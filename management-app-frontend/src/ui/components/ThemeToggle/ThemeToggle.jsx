import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import {useThemeMode} from "../../../context/ThemeContext.jsx";

const ThemeToggle = () => {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <Box>
                <IconButton
                    onClick={toggleTheme}
                    sx={{
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Box>
        </Tooltip>
    );
};

export default ThemeToggle;