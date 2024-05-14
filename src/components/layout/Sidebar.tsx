import { ExpandLess,SettingsRemoteSharp,Apps, ExpandMore,Dashboard, SettingsTwoTone, Wifi, WifiLock, Logout, HelpCenter, DashboardOutlined} from '@mui/icons-material';
import { Box, Collapse, List,  ListItemIcon, ListItemText, SxProps, Theme, Typography} from '@mui/material';
import React, { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import NoImageProfile from '../shared/NoImageProfile';

export const IconStyle: SxProps<Theme> = {
    color:'inherit',
    mr:2,
}
export const ListItemButtonStyle:SxProps<Theme> ={
    color:'#fff',
    borderRadius:1,
    ":hover":{
        bgcolor:'#fff',
        color:'#000',
    },
}
const commonstyle = {
    display:'flex',
    alignItems:'center',
    justifyContent: 'space-between',
    borderRadius:4,
    textDecoration:'none',
    padding:'7px 10px',
    width:'100%'
}
const styleFunc = ({isActive,}:{isActive:boolean}):CSSProperties=>{
    return{
        color:isActive?DEFAULT_COLORS.primary_black:'#fff',
        backgroundColor:isActive?'white':'',
        ...commonstyle
    }
}
const styleFunc1 = ({isActive,}:{isActive:boolean}):CSSProperties=>{
    return{
        color:isActive?DEFAULT_COLORS.primary_black:'inherit',
        backgroundColor:isActive?'#D4E3F5':'inherit',
        ...commonstyle
    }
}
const styleFuncSmall = ({isActive,}:{isActive:boolean}):CSSProperties=>{
    return{
        color:isActive?DEFAULT_COLORS.primary_black:'#fff',
        // backgroundColor:isActive?'white':'',
        display:'flex',
        alignItems:'center',
        alignSelf:'center',
        justifyContent: 'space-between',
        borderRadius:4,
        textDecoration:'none',
        padding:'7px 10px',
    }
}
interface NavigationItemProps{
    location:string,
    path:string,
    icon:React.ReactNode,
    text?:string,
    title?:string,
    otherItem?:JSX.Element,
    onClick?:()=> void
}
const NavigationItem = ({path,otherItem,icon,onClick,location, text}:NavigationItemProps) => {
    return(
        <Box sx={{borderRadius:2, display:'flex',bgcolor:location===path?'#fff':'',justifyContent:'space-between',width:'100%',px:1,alignItems:'center'}}>
            <NavLink state={{title:text}} to={path} onClick={onClick} style={styleFunc}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText sx={{fontSize:1}} primary={text} />
            </NavLink>
            {otherItem}
        </Box>
    )
}
const NavigationSmall = ({path,otherItem,icon,onClick, }:NavigationItemProps) => {
    return(
        <NavLink to={path} onClick={onClick} style={styleFuncSmall}>
            <Box display='flex' alignItems='center'>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
            </Box>
            {otherItem}
        </NavLink>
    )
}
import WaziGateSVG from '../../assets/wazigate.svg';
function Sidebar({matchesMd}:{matchesMd:boolean}) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    const location = useLocation().pathname;
    return (
        <Box position={'relative'} height={'100%'} width={'100%'} display={'flex'}  flexDirection={'column'} alignItems={'center'}>
            <Box component={'img'} src={WaziGateSVG} width={'70%'} mb={1} height={50} />
            {
                !matchesMd?(

                    <>
                        <Box my={1} width={'100%'} alignSelf={'center'} mx={'auto'} py={1} borderBottom={'0.05px solid #ebebeb'}>
                            <Box width={'87%'} alignSelf={'center'} mx={'auto'}>
                                <NavigationItem 
                                    location={location} 
                                    path={'/dashboard'} 
                                    icon={<DashboardOutlined sx={{...IconStyle,color:location==='/dashboard'?'#292F3F':'white'}} />} 
                                    text={'Dashboard'}
                                    onClick={()=>setOpen(false)}
                                />
                            </Box>
                        </Box>
                        <List sx={{ width: '87%', maxWidth: 360, }} component="nav" aria-labelledby="nested-list-subheader">
                                <NavigationItem 
                                    location={location} 
                                    path={'/devices'} 
                                    icon={<SettingsRemoteSharp sx={{...IconStyle,color:location.includes('/devices')?'#292F3F':'white'}} />} 
                                    text={'Devices'}
                                    onClick={()=>setOpen(false)}
                                />
                            {/* <NavigationItem location={location} path={'/automation'} icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'black':'white'}} />} text={'Automation'} /> */}
                            <Box sx={{bgcolor:(location==='/settings' || location==='/settings/networking' || location==='/settings/maintenance')? '#fff':'inherit',borderRadius:2}}>
                                <NavigationItem 
                                    location={location} 
                                    path={'/settings'}
                                    onClick={()=>setOpen(true)}
                                    icon={
                                        <SettingsTwoTone sx={{...IconStyle,color:(location==='/settings' || location==='/settings/networking' || location==='/settings/maintenance')?'#292F3F':'#fff'}} />} 
                                    text={'Settings'}
                                    otherItem={open ? <ExpandLess sx={{cursor:'pointer',color:location === '/settings'? '#000':'#fff',borderRadius:2}} onClick={handleClick} /> : <ExpandMore sx={{cursor:'pointer',color:location ==='/settings'? '#000':'#fff',borderRadius:2}} onClick={handleClick} />}
                                />
                                
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <NavLink state={{title:'Networking'}} to={'/settings/networking'} style={styleFunc1}>
                                            <Box display='flex' width={'87%'} alignItems='center'>
                                                <ListItemIcon>
                                                    <Wifi sx={{...IconStyle,ml:2, color:location.includes('/settings')?'#292F3F':'white'}} />
                                                </ListItemIcon>
                                                <ListItemText sx={{fontSize:1}} primary='Networking' />
                                            </Box>
                                        </NavLink>
                                        <NavLink state={{title:'Maintenance'}} to={'/settings/maintenance'} style={styleFunc1}>
                                            <Box display='flex' width={'87%'} alignItems='center'>
                                                <ListItemIcon>
                                                    <WifiLock sx={{...IconStyle,ml:2, color:location.includes('/settings')?'#292F3F':'white'}} />
                                                </ListItemIcon>
                                                <ListItemText sx={{fontSize:1}} primary='Maintenance' />
                                            </Box>
                                        </NavLink>
                                        
                                    </List>
                                </Collapse>
                            </Box>
                            <NavigationItem 
                                onClick={()=>setOpen(false)}
                                location={location} 
                                path={'/apps'} 
                                icon={<Apps sx={{...IconStyle,color:location.includes('/apps')?'#292F3F':'white'}} />} text={'Apps'} 
                            />
                        </List>
                        <Box position={'absolute'} display={'flex'}  justifyContent={'center'} flexDirection={'column'} alignItems={'center'} bottom={0} width={'100%'} >
                            <NavLink style={{textDecoration:'none',width:'100%'}} to={'/help'}>
                                <Box display={'flex'} p={2} alignItems={'center'}>
                                    <ListItemIcon>  
                                        <HelpCenter sx={{color:'white'}} />
                                    </ListItemIcon>
                                    <ListItemText sx={{color:'white'}} primary={'Help and feedback'} />
                                </Box>
                            </NavLink>
                            <Link style={{textDecoration:'none',textDecorationColor:'none',width:'100%', color:'#fff',borderBottom:'1px solid #fff',padding:'4px 0', borderTop:'1px solid white'}} to={'/user'}>
                                <Box display={'flex'} px={2}>
                                    <NoImageProfile/>
                                    <Box>
                                        <Typography>Wazigate User</Typography>
                                        <Typography fontSize={13}>admin</Typography>
                                    </Box>
                                </Box>
                            </Link>
                            <Link style={{textDecoration:'none',textDecorationColor:'none',width:'100%', color:'#fff',borderBottom:'1px solid #fff',padding:'4px 0', borderTop:'1px solid white'}} to={'/'}>
                                <Box width={'100%'} px={2} display={'flex'} alignItems={'center'}>
                                    <Logout sx={{color:'white',mr:1,}} />
                                    <Typography>Logout</Typography>
                                </Box>
                            </Link>
                        </Box>
                    </>
                ):(
                    <Box mt={2} width={'87%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Box my={1} >
                            <NavigationSmall 
                                location={location} 
                                path={'/dashboard'}
                                title='Dashboard'
                                icon={<Dashboard sx={{...IconStyle,color:location==='/dashboard'?'black':'white'}} />} 
                            />
                        </Box>
                        <NavigationSmall 
                            location={location} 
                            path={'/devices'}
                            title='Devices'
                            onClick={()=>setOpen(false)}
                            icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'#000':'white'}} />} 
                        />
                        {/* <NavigationSmall 
                            location={location} 
                            path={'/automation'} 
                            title='Automation'
                            icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'#000':'white'}} />} 
                        /> */}
                        <NavigationSmall 
                            location={location} 
                            path={'/settings'} 
                            icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'#000':'white'}} />} 
                            onClick={handleClick} 
                            title='Settings'
                            // otherItem={open ? <ExpandLess /> : <ExpandMore />}
                        />
                        
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <NavigationSmall 
                                    location={location} 
                                    title='Networking'
                                    path={'/settings/networking'} 
                                    icon={<Wifi sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#000':'white'}} />} 
                                />
                                <NavigationSmall
                                    location={location}
                                    title='Maintenance'
                                    path={'/settings/maintenance'}
                                    icon={<WifiLock sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#000':'white'}} />}
                                />
                            </List>
                        </Collapse>
                        <NavigationSmall 
                            location={location} 
                            path={'/apps'} 
                            title='Apps'
                            onClick={()=>setOpen(false)}
                            icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} 
                        />
                        <Box position={'absolute'} display={'flex'} flexDirection={'column'} alignItems={'center'} bottom={0} width={'100%'} >
                            <Link state={{title:"Help"}} style={{textDecoration:'none',margin:'5px 0' }} to={'/help'}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <HelpCenter sx={{color:'white'}} />
                                </Box>
                            </Link>
                            <Link state={{title:"Profile"}} style={{textDecoration:'none',margin:'5px 0'}} to={'/user'}>
                                <Box display={'flex'} >
                                    <NoImageProfile/>
                                </Box>
                            </Link>
                            <Box my={.5} display={'flex'} py={1} alignItems={'center'}>
                                <Logout sx={{color:'white',fontSize:18}} />
                            </Box>
                        </Box>
                    </Box>
                )
            }
            
        </Box>
    );
}

export default Sidebar;