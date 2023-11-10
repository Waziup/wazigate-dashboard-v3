import { Terminal, MoreVert } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { NormalText } from "../pages/Dashboard";
import { GridItem } from "../pages/Apps";
export default function CustomApp(){
    return(
        <GridItem>
            <Box px={.4} display={'flex'} alignItems={'center'} sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.orange}>
                <Terminal />
                <Typography  mx={1} color={'white'} component={'span'}>Custom App</Typography>
            </Box>
            <Box display={'flex'} py={2}  justifyContent={'space-between'}>
                <Box>
                    <NormalText title="Waziup App" />
                    <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>wazigate-edge</Typography>
                </Box>
                <MoreVert sx={{color:'black'}}/>
            </Box>
            <Typography color={DEFAULT_COLORS.secondary_black}>Status: <span color='red'>Running</span></Typography>
            <Typography color={DEFAULT_COLORS.secondary_black}>Waziup firmware for Edge Computing</Typography>
            
        </GridItem>
    )
}