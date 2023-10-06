import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation, } from 'react-router-dom';
import Sidebar from './sidebar';
import { Search, Menu, } from '@mui/icons-material';
import RowContainerBetween from '../rowcontainerbetween';
import { DEFAULT_COLORS } from '../../constants';
import { useState } from 'react';
const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
}
function Layout() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const [open, setOpen] = useState(false);
    const handleToggle = () => { setOpen(!open) }
    const location = useLocation().pathname;
    return (
        <>
            {
                matches ? (
                    <Grid overflow={'hidden'} height={'100vh'} container sx={{ background: '#F0F2F5', scrollbarWidth: '.5rem', "::-webkit-slider-thumb": { backgroundColor: 'transparent' } }}>
                        <Grid item bgcolor={DEFAULT_COLORS.navbar_dark} height={'100%'} xs={2}  >
                            <Sidebar />
                        </Grid>
                        <Grid item xs={9.5} md={9.5} height={'100%'}>
                            <Outlet context={[matches]} />
                        </Grid>
                    </Grid>
                ) : (
                    <Box height={'100vh'} bgcolor={'#F0F2F5'} overflow={'hidden'}>
                        <RowContainerBetween additionStyles={{ bgcolor: '#292F3F' }} >
                            <Box display={'flex'} py={2} alignItems={'center'}>
                                <Menu onClick={handleToggle} sx={{ mx: 2, color: 'white', cursor: 'pointer' }} />
                                <Typography color={'white'} fontWeight={'600'}>{capitalizeFirstLetter(location).length > 0 ? capitalizeFirstLetter(location) : 'Dashboard'}</Typography>
                            </Box>
                            <Search sx={{ color: 'white', mx: 1 }} />
                        </RowContainerBetween>
                        <Box display={open ? 'flex' : 'none'} position={'absolute'} sx={{ height: '100%', width: '100%' }} bgcolor={'rgba(0,0,0,.5)'} zIndex={99}>
                            <Box bgcolor={DEFAULT_COLORS.navbar_dark} display={'flex'} flexDirection={'column'} alignItems={'center'} sx={{ height: '100%', width: '60%' }}>
                                <Sidebar />
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