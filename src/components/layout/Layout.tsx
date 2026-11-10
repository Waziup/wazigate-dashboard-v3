import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, MenuOpen, SettingsOutlined } from '@mui/icons-material';
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
    // mobile drawer
    const [open, setOpen] = useState(false);
    const handleToggle = () => {setOpen(!open)}
    // desktop: sidebar is either full (pushes content) or squeezed (icons only).
    // Between sm and md (600-900px) it is always squeezed to icons, regardless of the toggle.
    const [collapsed, setCollapsed] = useState(false);
    const sidebarExpanded = !matchesMd && !collapsed;
    const { state, pathname } = useLocation();
    // close the mobile drawer whenever the route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);
    // page title for the desktop header: explicit navigation state first, then the route
    const pageTitle = state?.title || (() => {
        if (pathname.startsWith('/devices')) return 'Devices';
        if (pathname.startsWith('/apps')) return 'Apps';
        if (pathname.startsWith('/settings')) return 'Settings';
        if (pathname.startsWith('/user')) return 'Profile';
        if (pathname.startsWith('/help')) return 'Help & Feedback';
        if (pathname.startsWith('/docs')) return 'Docs';
        return 'Dashboard';
    })();

    return (
        <>
            {
                matches ? (
                    <Box minWidth={'100vw'}bgcolor={'#FAFBFB'} sx={{overflowY:'auto',overflowX:'hidden'}}>
                        <Box  sx={{display:'flex',position:'relative',flexWrap:'wrap',height:'100vh',maxWidth:'1400px',}}>
                            <Box
                                sx={{
                                    position:'relative',
                                    flexShrink:0,
                                    height:'100%',
                                    width: sidebarExpanded ? 220 : 64,
                                    transition:'width 0.2s ease',
                                }}
                            >
                                <Box sx={{position:'absolute',top:0,left:0,width:'100%',height:'100%',bgcolor:'#292F3F',overflow:'hidden'}}>
                                    <Sidebar matchesMd={matchesMd} expanded={sidebarExpanded} onExpand={() => setCollapsed(false)} />
                                </Box>
                            </Box>
                            <Box sx={{flex:1,minWidth:0,display:'flex',flexDirection:'column',height:'100vh'}}>
                                {/* page header: the page name is the sidebar toggle */}
                                <Box sx={{display:'flex',alignItems:'center',pl:2,pr:2,py:1,minHeight:56,boxSizing:'border-box',flexShrink:0,bgcolor:'#FAFBFB',borderBottom:'1px solid #E6E6E6'}}>
                                    <Box
                                        component='button'
                                        onClick={() => setCollapsed(!collapsed)}
                                        title={sidebarExpanded ? 'Hide menu' : 'Show menu'}
                                        sx={{
                                            display:'flex',
                                            alignItems:'center',
                                            gap:1,
                                            border:'none',
                                            background:'none',
                                            p:0.5,
                                            borderRadius:1,
                                            cursor:'pointer',
                                            font:'inherit',
                                            color:'#292F3F',
                                            '&:hover':{ bgcolor:'#EDF0F4' },
                                        }}
                                    >
                                        {sidebarExpanded ? <MenuOpen fontSize='small' /> : <Menu fontSize='small' />}
                                        <Typography fontWeight={'600'} color={'#292F3F'} noWrap>
                                            {pageTitle}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{flex:1,minHeight:0,overflow:'hidden'}}>
                                    <Outlet context={[matches]} />
                                </Box>
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