import { SxProps, Box, Theme } from '@mui/material';
import React from 'react';
function RowContainerBetween({ children, onClick, additionStyles }: { onClick?: () => void, children?: React.ReactNode, additionStyles?: SxProps<Theme> }) {
    return (
        <Box onClick={onClick} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...additionStyles }}>
            {children}
        </Box>
    )
}


export default RowContainerBetween;