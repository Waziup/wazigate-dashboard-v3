import { ExpandLess,SettingsRemoteSharp,Apps, PrecisionManufacturing, ExpandMore,Dashboard, SettingsTwoTone, Wifi, WifiLock, Logout, HelpCenter} from '@mui/icons-material';
import { Box, Collapse, List,  ListItemIcon, ListItemText, SxProps, Theme, Typography} from '@mui/material';
import React, { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import NoImageProfile from '../NoImageProfile';

export const IconStyle: SxProps<Theme> = {
    color:'inherit',
}
export const ListItemButtonStyle:SxProps<Theme> ={
    color:'#fff',
    borderRadius:1,
    ":hover":{
        bgcolor:'#fff',
        color:'#000',
    },
}
const styleFunc = ({isActive,}:{isActive:boolean}):CSSProperties=>{
    return{
        color:isActive?DEFAULT_COLORS.primary_black:'#fff',
        backgroundColor:isActive?'white':'',
        display:'flex',
        alignItems:'center',
        justifyContent: 'space-between',
        borderRadius:4,
        textDecoration:'none',
        padding:'7px 10px',
    }
}
const styleFuncSmall = ({isActive,}:{isActive:boolean}):CSSProperties=>{
    return{
        color:isActive?DEFAULT_COLORS.primary_black:'#fff',
        // backgroundColor:isActive?'white':'',
        display:'flex',
        alignItems:'center',
        justifyContent: 'space-between',
        borderRadius:4,
        textDecoration:'none',
        padding:'7px 10px',
    }
}
const NavigationItem = ({path,otherItem,icon,onClick, text}:{location:string,otherItem?:JSX.Element,additionalStyles?:CSSProperties, path:string,onClick?:()=> void, icon:React.ReactNode,text:string}) => {
    return(
        <NavLink to={path} onClick={onClick} style={styleFunc}>
            <Box display='flex' alignItems='center'>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText sx={{fontSize:1}} primary={text} />
            </Box>
            {otherItem}
        </NavLink>
    )
}
const NavigationSmall = ({path,otherItem,icon,onClick, }:{location:string,otherItem?:JSX.Element,additionalStyles?:CSSProperties, path:string,onClick?:()=> void, icon:React.ReactNode,}) => {
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
function Sidebar({matchesMd}:{matchesMd:boolean}) {
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    };
    const location = useLocation().pathname;
    return (
        <Box position={'relative'} height={'100%'} display={'flex'}  flexDirection={'column'} alignItems={'center'}>
            <Box component={'img'} src={'/wazigate.svg'} width={'80%'} height={100} />
            {
                !matchesMd?(

                    <>
                        <List sx={{ width: '87%', maxWidth: 360,}} component="nav" aria-labelledby="nested-list-subheader">
                            <Box my={1} borderBottom={'0.1px solid #ccc'}>
                                <NavigationItem 
                                    location={location} 
                                    path={'/dashboard'} 
                                    icon={<Dashboard sx={{...IconStyle,color:location==='/dashboard'?'black':'white'}} />} 
                                    text={'Dashboard'} 
                                />
                            </Box>
                            <NavigationItem 
                                location={location} 
                                path={'/devices'} 
                                icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'black':'white'}} />} 
                                text={'Devices'} 
                            />
                            <NavigationItem location={location} path={'/automation'} icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'black':'white'}} />} text={'Automation'} />
                            <NavigationItem location={location} 
                                path={'/settings'} 
                                icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'black':'white'}} />} 
                                text={'Settings'}
                                otherItem={open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
                            />
                            
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <NavigationItem 
                                        location={location} 
                                        path={'/settings/networking'} 
                                        icon={<Wifi sx={{...IconStyle,ml:2, color:location.includes('/settings')?'black':'white'}} />} 
                                        text={'Networking'}
                                    />
                                    <NavigationItem
                                        location={location}
                                        path={'/settings/maintenance'}
                                        icon={<WifiLock sx={{...IconStyle,ml:2, color:location.includes('/settings')?'black':'white'}} />}
                                        text={'Maintenance'}
                                    />
                                </List>
                            </Collapse>
                            <NavigationItem location={location} path={'/apps'} icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} text={'Apps'} />
                        </List>
                        <Box position={'absolute'} alignItems={'center'} bottom={0} width={'100%'} >
                            <NavLink style={{textDecoration:'none',}} to={'/help'}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <ListItemIcon>  
                                        <HelpCenter sx={{color:'white'}} />
                                    </ListItemIcon>
                                    <ListItemText sx={{color:'white'}} primary={'Help and feedback'} />
                                </Box>
                            </NavLink>
                            <Link style={{textDecoration:'none',borderBottom:'1px solid white'}} to={'/user'}>
                                <Box display={'flex'} >
                                    <NoImageProfile/>
                                    <Box>
                                        <Typography>John Doe</Typography>
                                        <Typography fontSize={13} >johndoe@waziup.org</Typography>
                                    </Box>
                                </Box>
                            </Link>
                            <Box px={'10%'} display={'flex'} py={1} alignItems={'center'}>
                                <Logout sx={{color:'white'}} />
                                <Typography sx={{color:'white'}}>Logout</Typography>
                            </Box>
                        </Box>
                    </>
                ):(
                    <Box mt={2} width={'87%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Box my={1} >
                            <NavigationSmall 
                                location={location} 
                                path={'/'} 
                                icon={<Dashboard sx={{...IconStyle,color:location==='/'?'black':'white'}} />} 
                            />
                        </Box>
                        <NavigationSmall 
                            location={location} 
                            path={'/devices'} 
                            icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'black':'white'}} />} 
                        />
                        <NavigationSmall location={location} path={'/automation'} icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'black':'white'}} />} />
                        <NavigationSmall location={location} 
                            path={'/settings'} 
                            icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'black':'white'}} />} 
                            onClick={handleClick} 
                            // otherItem={open ? <ExpandLess /> : <ExpandMore />}
                        />
                        
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <NavigationSmall 
                                    location={location} 
                                    path={'/settings/networking'} 
                                    icon={<Wifi sx={{...IconStyle,ml:1, color:location.includes('/settings')?'black':'white'}} />} 
                                />
                                <NavigationSmall
                                    location={location}
                                    path={'/settings/maintenance'}
                                    icon={<WifiLock sx={{...IconStyle,ml:1, color:location.includes('/settings')?'black':'white'}} />}
                                />
                            </List>
                        </Collapse>
                        <NavigationSmall location={location} path={'/apps'} icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} />
                        <Box position={'absolute'} display={'flex'} flexDirection={'column'} alignItems={'center'} bottom={0} width={'100%'} >
                            <Link style={{textDecoration:'none',margin:'5px 0' }} to={'/help'}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <HelpCenter sx={{color:'white'}} />
                                </Box>
                            </Link>
                            <Link style={{textDecoration:'none',margin:'5px 0'}} to={'/user'}>
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