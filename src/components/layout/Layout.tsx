import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation, } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Menu, } from '@mui/icons-material';
import RowContainerBetween from '../RowContainerBetween';
import { useState } from 'react';
const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
}
function Layout() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const matchesMd = useMediaQuery(theme.breakpoints.between('sm','md'));
    const [open,setOpen] = useState(false);
    const handleToggle=()=>{setOpen(!open)}
    const location = useLocation().pathname;
    return (
        <>
            {
                matches?(
                    <Grid container sx={{background: 'background.default',height:'100vh',overflow:'hidden',maxWidth:'1400px', scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}}}>
                        <Grid item sx={{height:'100%', bgcolor:'primary.main'}} md={2} sm={1} lg={3} xl={3} xs={2.5} >
                            <Sidebar matchesMd={matchesMd} />
                        </Grid>
                        <Grid item xs={9.5} sm={11} lg={9} xl={9} md={10} height={'100%'}>
                            <Outlet context={[matches]} />
                        </Grid>
                    </Grid>
                ):(
                    <Box sx={{height:'100vh',bgcolor:'#F0F2F5',overflow:'hidden'}}>
                        <RowContainerBetween additionStyles={{bgcolor:'primary.main'}} >
                            <Box sx={{display:'flex',py:2,alignItems:'center'}} >
                                <Menu onClick={handleToggle}  sx={{mx:2,color:'white', cursor:'pointer'}}/>
                                <Typography color={'white'} fontWeight={'600'}>{capitalizeFirstLetter(location).length>0?capitalizeFirstLetter(location):'Dashboard'}</Typography>
                            </Box>
                            <Search sx={{ color: 'white', mx: 1 }} />
                        </RowContainerBetween>
                        <Box onClick={handleToggle} sx={{position:'absolute',top:0, display:open?'flex':'none', height:'100%',width:'100%',bgcolor:'rgba(0,0,0,.5)',zIndex:99}}>
                            <Box sx={{bgcolor:'primary.main',display:'flex',flexDirection:'column',alignItems:'center', height:'100%',width:'65%'}}>
                                <Sidebar matchesMd={matchesMd} />
                            </Box>
                        </Box>
                        <Outlet context={[matches]} />
                    </Box>
                )
            }
        </>
    );
}

export default Layout;