import { Box,  Grid,  Stack,  Typography, useMediaQuery, useTheme } from '@mui/material';
import { Outlet,  } from 'react-router-dom';
import Sidebar from './sidebar';
import { Search,Menu,Router, CloudOff, Wifi} from '@mui/icons-material';
import {  RowContainerBetween } from '../../pages/dashboard';
import { DEFAULT_COLORS } from '../../constants';
import { useState } from 'react';
const Item = ({more,color,children, title}:{more:string,children:React.ReactNode, color:string,title:string})=>(
    <Box width={'50%'} minWidth={190} mx={2} sx={{ borderRadius:1,border:'1px solid #ccc', height: '100%', bgcolor: 'white', p: 2 }}>
        {children}
        <Typography fontSize={13} color={'black'}>{title}</Typography>
        <Typography color={color} fontSize={13} fontWeight={300}>{more}</Typography>
    </Box>
)
function Layout() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const [open,setOpen] = useState(false);
    const handleToggle=()=>{setOpen(!open)}
    return (
        <>
            {
                matches?(
                    <Grid overflow={'hidden'} height={'100vh'} container sx={{background: '#F0F2F5', scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}}}>
                        <Grid item bgcolor={DEFAULT_COLORS.navbar_dark} height={'100%'}  xs={2.5} >
                            <Sidebar />
                        </Grid>
                        <Grid item xs={9.5} md={9.5} height={'100%'} spacing={0}>
                            <Outlet />
                        </Grid>
                    </Grid>
                ):(
                    <Box height={'100vh'} overflow={'hidden'}>
                        <RowContainerBetween additionStyles={{bgcolor:'#292F3F'}} >
                            <Box display={'flex'} py={2} alignItems={'center'}>
                                <Menu onClick={handleToggle}  sx={{mx:2,color:'white', cursor:'pointer'}}/>
                                <Typography color={'white'} fontWeight={'600'}>Dashboard</Typography>
                            </Box>
                            <Search sx={{color:'white'}} />
                        </RowContainerBetween>
                        <Box bgcolor={DEFAULT_COLORS.navbar_dark} display={open?'flex':'none'} flexDirection={'column'} alignItems={'center'} position={'absolute'}  sx={{height:'100%',width:'60%'}}>
                            <Sidebar/>
                        </Box>
                        <Stack direction={'row'} overflow={'scroll'} m={2} spacing={2}>
                            <Item color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                                <Router sx={{ fontSize: 20,color:'black' }} />
                            </Item>
                            <Item color="#CCC400" title="Cloud Synchronization" more="Last active 3h ago" >
                                <CloudOff sx={{ fontSize: 20,color:'#D9D9D9' }} />
                            </Item>
                            <Item color={DEFAULT_COLORS.secondary_black} title="Access point mode" more="Wifi Name: 'Wazigate E55344'" >
                                <Wifi sx={{ fontSize: 20,color:'black' }} />
                            </Item>
                        </Stack>
                    </Box>
                )
            }
        </>
    );
}

export default Layout;