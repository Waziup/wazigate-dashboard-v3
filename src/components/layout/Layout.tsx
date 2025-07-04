import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, SettingsOutlined } from '@mui/icons-material';
import RowContainerBetween from '../shared/RowContainerBetween';
import { useCallback, useContext, useEffect, useState } from 'react';
import { tokenChecker } from '../../utils/systemapi';
import { GlobalContext } from '../../context/global.context';
function Layout() {
    const {setAccessToken, setProfile} = useContext(GlobalContext);
    const navigate = useNavigate();
    const isAuthorized =useCallback(async() => {
        const tk = window.sessionStorage.getItem("token");
        await tokenChecker(tk)
        fetch("sys/uptime")
        .then((resp)=>{
            if(resp.status === 401){
                const creds = window.sessionStorage.getItem("creds");
                if(creds){
                    const {username,password} = JSON.parse(creds);
                    window.wazigate.authToken(username,password)
                    .then((res)=>{
                        setAccessToken(res)
                        window.wazigate.setToken(res);
                    })
                    .catch(()=>{
                        setAccessToken('');
                        setProfile(null);
                        navigate('/')
                    })
                }else{
                    setAccessToken('');
                    setProfile(null);
                    navigate('/');
                }
            }  
        })
        .catch(()=>{
            (document.getElementById("dashboard") as HTMLElement).innerHTML = "<div style='margin-top: 10%;color:black; text-align: center;border: 1px solid #BBB;border-radius: 5px;padding: 5%;margin-left: 10%;margin-right: 10%;background-color: #EEE;'><h1>Wazigate is not accessible...</h1></div>";
        });
    },[navigate, setProfile, setAccessToken]);
    useEffect(()=>{
        //delay 30 seconds to check if the user is authorized
        setTimeout(isAuthorized, 1000 * 30);
        const timer = setInterval(isAuthorized, 1000 * 15);
        return ()=>{
            clearInterval(timer);
        }
    },[isAuthorized])
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const matchesMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const matchesLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    
    const [open, setOpen] = useState(false);
    const handleToggle = () => {setOpen(!open)}
    const { state, pathname } = useLocation();
    return (
        <>
            {
                matches ? (
                    <Box minWidth={'100vw'}bgcolor={'#FAFBFB'} sx={{overflowY:'auto',overflowX:'hidden'}}>
                        <Box  sx={{display:'flex',position:'relative',flexWrap:'wrap',height:'100vh',maxWidth:'1400px',}}>
                            <Box sx={{overflowY:'hidden',position:'fixed',top:0,left:0, width: matchesMd?40:matchesLg?200:220, bgcolor:'#292F3F',height:'100%',}}>
                                <Sidebar matchesMd={matchesMd} />
                            </Box>
                            <Box sx={{ml: `${matchesMd?40:matchesLg ? 200 : 220}px`, width: { sm: `calc(100% - ${matchesMd?40:matchesLg?200:220}px)` } }}>
                                <Outlet context={[matches]} />
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{height:'100vh',  bgcolor: '#FAFBFB', overflowY: 'auto' }}>
                        <RowContainerBetween additionStyles={{position:'absolute',top:0,width:'100%',zIndex:50,height: 55, bgcolor: 'primary.main' }} >
                            <Box sx={{ display: 'flex', py: 2, alignItems: 'center' }} >
                                <Menu onClick={handleToggle} sx={{ mx: 2, color: 'white', cursor: 'pointer' }} />
                                <Typography color={'white'} fontWeight={'600'}>{state ? state.title : 'Wazigate'}</Typography>
                            </Box>
                            {
                                (pathname.endsWith('/setting')) ? (
                                    null
                                ) : (pathname.includes('/sensors') || pathname.includes('/actuators'))?(
                                    <Link to={pathname+'/setting'} state={{title:'Settings'}}>
                                        <SettingsOutlined sx={{ color: 'white', mx: 1, }} />
                                    </Link>
                                ):(pathname.includes('/devices/'))?(
                                    <Link to={pathname+'/setting'} state={{title:'Settings'}}>
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
                        <Box sx={{height:'100%',overflowY:'auto',py:2,mt: 6}}>
                            <Outlet context={[matches]} />
                        </Box>
                    </Box>
                )
            }
        </>
    );
}

export default Layout;