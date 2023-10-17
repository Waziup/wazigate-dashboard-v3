import { SxProps, Box,Theme } from '@mui/material';
import React from 'react';
function RowContainerBetween({children,additionStyles}:{children:React.ReactNode,additionStyles?:SxProps<Theme>}){
    return(
        <Box sx={{...additionStyles,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            {children}   
        </Box>
    )
}


export default RowContainerBetween;