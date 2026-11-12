import { Box } from "@mui/material";
export default function Backdrop({children}: {children: React.ReactNode}){
    return(
        <Box zIndex={88} sx={{position:'absolute',bgcolor:'rgba(0,0,0,.5)', overflow:'hidden', width:'100%',height:'100vh',top:0,left:0, display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            {children}
        </Box>
    )
}