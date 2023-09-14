import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
function Layout() {
    return (
        <Grid overflow={'hidden'} height={'100vh'} container sx={{background: '#F0F2F5', scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}}}>
            <Grid item bgcolor={'#292F3F'} height={'100%'}  xs={2.5} >
                <Sidebar />
            </Grid>
            <Grid item xs={9.5} md={9.5} height={'100%'} spacing={0}>
                <Outlet />
            </Grid>
        </Grid>
    );
}

export default Layout;