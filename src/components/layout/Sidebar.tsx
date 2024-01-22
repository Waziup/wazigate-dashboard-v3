import { ExpandLess,SettingsRemoteSharp,Apps, ExpandMore,Dashboard, SettingsTwoTone, Wifi, WifiLock, Logout, HelpCenter, DashboardOutlined} from '@mui/icons-material';
import { Box, Collapse, List,  ListItemIcon, ListItemText, SxProps, Theme, Typography} from '@mui/material';
import React, { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import NoImageProfile from '../shared/NoImageProfile';

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
        alignSelf:'center',
        justifyContent: 'space-between',
        borderRadius:4,
        textDecoration:'none',
        padding:'7px 10px',
    }
}
const NavigationItem = ({path,otherItem,icon,onClick, text}:{location:string,  otherItem?:JSX.Element,additionalStyles?:CSSProperties, path:string,onClick?:()=> void, icon:React.ReactNode,text:string}) => {
    return(
        <NavLink state={{title:text}} to={path} onClick={onClick} style={styleFunc}>
            <Box display='flex' width={'87%'} alignItems='center'>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText sx={{fontSize:1}} primary={text} />
            </Box>
            {otherItem}
        </NavLink>
    )
}
const NavigationSmall = ({path,otherItem,icon,onClick, }:{location:string,otherItem?:JSX.Element,additionalStyles?:CSSProperties,title:string, path:string,onClick?:()=> void, icon:React.ReactNode,}) => {
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
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    const location = useLocation().pathname;
    return (
        <Box position={'relative'} height={'100%'} width={'100%'} display={'flex'}  flexDirection={'column'} alignItems={'center'}>
            <Box component={'img'} src={'/wazigate.svg'} width={'70%'} mb={1} height={50} />
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
                                />
                            </Box>
                        </Box>
                        <List sx={{ width: '87%', maxWidth: 360, }} component="nav" aria-labelledby="nested-list-subheader">
                                <NavigationItem 
                                    location={location} 
                                    path={'/devices'} 
                                    icon={<SettingsRemoteSharp sx={{...IconStyle,color:location.includes('/devices')?'#292F3F':'white'}} />} 
                                    text={'Devices'} 
                                />
                            {/* <NavigationItem location={location} path={'/automation'} icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'black':'white'}} />} text={'Automation'} /> */}
                            <NavigationItem location={location} 
                                path={'/settings'} 
                                icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'#292F3F':'white'}} />} 
                                text={'Settings'}
                                otherItem={open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
                            />
                            
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <NavigationItem 
                                        location={location} 
                                        path={'/settings/networking'} 
                                        icon={<Wifi sx={{...IconStyle,ml:2, color:location.includes('/settings')?'#292F3F':'white'}} />} 
                                        text={'Networking'}
                                    />
                                    <NavigationItem
                                        location={location}
                                        path={'/settings/maintenance'}
                                        icon={<WifiLock sx={{...IconStyle,ml:2, color:location.includes('/settings')?'#292F3F':'white'}} />}
                                        text={'Maintenance'}
                                    />
                                </List>
                            </Collapse>
                            <NavigationItem location={location} path={'/apps'} icon={<Apps sx={{...IconStyle,color:location.includes('/apps')?'#292F3F':'white'}} />} text={'Apps'} />
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
                                        <Typography>John Doe</Typography>
                                        <Typography fontSize={13} >johndoe@waziup.org</Typography>
                                    </Box>
                                </Box>
                            </Link>
                            <Box width={'100%'} px={2} display={'flex'} py={1.5} alignItems={'center'}>
                                <Logout sx={{color:'white',mr:1,}} />
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
                                title='Dashboard'
                                icon={<Dashboard sx={{...IconStyle,color:location==='/'?'black':'white'}} />} 
                            />
                        </Box>
                        <NavigationSmall 
                            location={location} 
                            path={'/devices'}
                            title='Devices'
                            icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'#292F3F':'white'}} />} 
                        />
                        {/* <NavigationSmall 
                            location={location} 
                            path={'/automation'} 
                            title='Automation'
                            icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'#292F3F':'white'}} />} 
                        /> */}
                        <NavigationSmall 
                            location={location} 
                            path={'/settings'} 
                            icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'#292F3F':'white'}} />} 
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
                                    icon={<Wifi sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#292F3F':'white'}} />} 
                                />
                                <NavigationSmall
                                    location={location}
                                    title='Maintenance'
                                    path={'/settings/maintenance'}
                                    icon={<WifiLock sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#292F3F':'white'}} />}
                                />
                            </List>
                        </Collapse>
                        <NavigationSmall 
                            location={location} 
                            path={'/apps'} 
                            title='Apps'
                            icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} 
                        />
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