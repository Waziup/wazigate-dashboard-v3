import { SxProps,Theme, Box } from "@mui/material";

export default function RowContainerNormal({children,onClick,additionStyles}:{onClick?:()=>void,children:React.ReactNode,additionStyles?:SxProps<Theme>}){
    return(
        <Box onClick={onClick} sx={{flexDirection:'row',my:2,width:'100%',display:'flex',...additionStyles}} >
            {children}
        </Box>
    )
}