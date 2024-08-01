import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, SettingsOutlined } from '@mui/icons-material';
import RowContainerBetween from '../shared/RowContainerBetween';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DevicesContext } from '../../context/devices.context';
function Layout() {
    const {setAccessToken, setProfile} = useContext(DevicesContext);
    const navigate = useNavigate();
    const reToken =useCallback(() => {
        window.wazigate.set<string>("auth/retoken", {})
        .then(async(res)=>{
            setAccessToken(res);
            await window.wazigate.setToken(res);
        })
        .catch((error) => {
            console.log(error);
        });
    },[setAccessToken]);
    const isAuthorized =useCallback(() => {
        fetch("sys/uptime")
        .then((resp)=>{
            if(resp.status !== 200){
                setAccessToken('');
                setProfile(null);
                navigate('/');
            }  
        })
        .catch(()=>{
            (document.getElementById("dashboard") as HTMLElement).innerHTML = "<div style='margin-top: 10%;color:black; text-align: center;border: 1px solid #BBB;border-radius: 5px;padding: 5%;margin-left: 10%;margin-right: 10%;background-color: #EEE;'><h1>Wazigate is not accessible...</h1></div>";
        });
    },[navigate, setProfile, setAccessToken]);
    useEffect(()=>{
        const int = setInterval(reToken, 1000 * 60 * 5);
        const timer = setInterval(isAuthorized, 1000 * 10);
        return ()=>{
            clearInterval(int);
            clearInterval(timer);
        }
    },[reToken,isAuthorized])
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const matchesMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [open, setOpen] = useState(false);
    const handleToggle = () => {setOpen(!open)}
    const { state, pathname } = useLocation();
    return (
        <>
            {
                matches ? (
                    <Grid container sx={{ background: 'background.default', height: '100vh', overflow: 'hidden', maxWidth: '1400px', scrollbarWidth: '.5rem', "::-webkit-slider-thumb": { backgroundColor: 'transparent' } }}>
                        <Grid item sx={{ height: '100%', bgcolor: 'primary.main' }} md={2.3} sm={1} lg={2.3} xl={2.3} xs={2.3} >
                            <Sidebar matchesMd={matchesMd} />
                        </Grid>
                        <Grid item sx={{height:'100%'}} md={9.7} sm={11} lg={9.7} xl={9.7} xs={9.7}>
                            <Outlet context={[matches, matchesMd]} />
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={{height:'100vh',  bgcolor: '#F0F2F5', overflow: 'hidden' }}>
                        <RowContainerBetween additionStyles={{ bgcolor: 'primary.main' }} >
                            <Box sx={{ display: 'flex', py: 2, alignItems: 'center' }} >
                                <Menu onClick={handleToggle} sx={{ mx: 2, color: 'white', cursor: 'pointer' }} />
                                <Typography color={'white'} fontWeight={'600'}>{state ? state.title : 'Wazigate'}</Typography>
                            </Box>
                            {
                                (pathname.endsWith('/settings')) ? (
                                    null
                                ) : (pathname.includes('/sensors') || pathname.includes('/actuators'))?(
                                    <Link to={pathname+'/settings'} state={{title:'Settings'}}>
                                        <SettingsOutlined sx={{ color: 'white', mx: 1, }} />
                                    </Link>
                                ):(pathname.includes('/devices/'))?(
                                    <Link to={pathname+'/settings'} state={{title:'Settings'}}>
                                        <SettingsOutlined sx={{ color: 'white', mx: 1, }} />
                                    </Link>
                                ):null
                            }
                        </RowContainerBetween>
                        <Box onClick={handleToggle} sx={{ position: 'absolute', top: 0, display: open ? 'flex' : 'none', height: '100%', width: '100%', bgcolor: 'rgba(0,0,0,.5)', zIndex: 99 }}>
                            <Box sx={{ bgcolor: 'primary.main', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '65%' }}>
                                <Sidebar matchesMd={matchesMd} />
                            </Box>
                        </Box>
                        <Box sx={{height:'100%',mb:4}}>
                            <Outlet context={[matches]} />
                        </Box>
                    </Box>
                )
            }
        </>
    );
}

export default Layout;