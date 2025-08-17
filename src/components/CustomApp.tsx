import { Terminal } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { NormalText } from "../pages/Dashboard";
import { Button } from "@mui/material";
import React from "react";
import { App } from "waziup";
import { StringSchema } from "yup";
import MenuComponent from "./shared/MenuDropDown";
type App1 =App &{
    customApp:boolean
    description:string
    image:StringSchema
}
interface AppProp{
    onClick?:()=>void
    children: React.ReactNode
}
const GridItem = ({onClick, children }:AppProp) => (
    <Grid item md={6} lg={4} xl={4} sm={6} xs={12} minHeight={100} my={1} px={1} >
        <Box minHeight={100} sx={{ px: 2, py: 1, position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
            {children}
            <Button onClick={onClick} sx={{ fontWeight: '500', bgcolor: '#F4F7F6', my: 1, color: 'info.main', width: '100%' }}>INSTALL</Button>
        </Box>
    </Grid>
);
export default function CustomApp({open,app}:{open?:boolean,app:App}){
    return(
        <GridItem>
            <Box px={.4} display={'flex'} alignItems={'center'} sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.orange}>
                <Terminal sx={{color:'#fff'}} />
                <Typography  mx={1} color={'white'} component={'span'}>Custom App</Typography>
            </Box>
            <Box display={'flex'} py={2}  justifyContent={'space-between'}>
                <Box>
                    <NormalText title={app.name} />
                    <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>wazigate-edge</Typography>
                </Box>
                <MenuComponent
                    open={open as boolean}
                    menuItems={[
                        {
                            icon: 'settings',
                            text: 'Settings',
                            clickHandler: () => { console.log('Settings') }
                        }
                    ]}
                />
            </Box>
            <Typography fontSize={15} fontWeight={100} my={1} color={DEFAULT_COLORS.secondary_black}>Status: {app.state.running?'Running':'Stopped'}</Typography>
            <Typography fontSize={14} fontWeight={100} my={1} color={DEFAULT_COLORS.secondary_black}>{(app as App1).description}</Typography>
        </GridItem>
    )
}