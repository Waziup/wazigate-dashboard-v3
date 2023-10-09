import { Theme } from '@emotion/react';
import { SxProps, Box } from '@mui/material';
import React from 'react';
function RowContainerBetween({children,additionStyles}:{children:React.ReactNode,additionStyles?:SxProps<Theme>}){
    return(
        <Box display={'flex'} sx={{...additionStyles}} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            {children}   
        </Box>
    )
}


export default RowContainerBetween;