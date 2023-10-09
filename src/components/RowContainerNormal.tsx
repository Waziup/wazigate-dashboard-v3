import { Theme } from "@emotion/react";
import { SxProps, Box } from "@mui/material";

export default function RowContainerNormal({children,additionStyles}:{children:React.ReactNode,additionStyles?:SxProps<Theme>}){
    return(
        <Box flexDirection={'row'} alignItems={'center'} sx={{...additionStyles}} my={2} width={'100%'}display={'flex'} >
            {children}
        </Box>
    )
}