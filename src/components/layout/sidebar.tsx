import { ExpandLess,SettingsRemoteSharp,Apps, PrecisionManufacturing, ExpandMore,Dashboard, SettingsTwoTone, Wifi, WifiLock, Logout, HelpCenter} from '@mui/icons-material';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme, Typography} from '@mui/material';
import React, { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import NoImageProfile from '../noimageprofile';
import { NavLink } from 'react-router-dom';
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
export const NavItem = ({location,path, icon,text}:{location:string,path:string, icon:React.ReactNode,text:string}) => {
    return(
        <ListItemButton href={path} sx={{...ListItemButtonStyle,color:location.includes(path)?DEFAULT_COLORS.primary_black:'#fff', bgcolor:location.includes(path)?'white':'', }}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText sx={{fontSize:1}} primary={text} />
        </ListItemButton>
    )
}
function Sidebar() {
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    };
    const location = useLocation().pathname;
    console.log(location)
    return (
        <Box position={'relative'} height={'100%'} display={'flex'}  flexDirection={'column'} alignItems={'center'}>
            <Box component={'img'} src={'/wazigate.svg'} width={'80%'} height={100} />
            <List sx={{ width: '87%', maxWidth: 360,}} component="nav" aria-labelledby="nested-list-subheader">
                <Box my={1} borderBottom={'0.1px solid #ccc'}>
                    <NavigationItem 
                        location={location} 
                        path={'/'} 
                        icon={<Dashboard sx={{...IconStyle,color:location==='/'?'black':'white'}} />} 
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
                    onClick={handleClick} 
                    otherItem={open ? <ExpandLess /> : <ExpandMore />}
                />
                
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <NavigationItem 
                            location={location} 
                            path={'/settings/networking'} 
                            icon={<Wifi sx={{...IconStyle,pl:2, color:location.includes('/settings')?'black':'white'}} />} 
                            text={'Networking'}
                        />
                        <NavigationItem
                            location={location}
                            path={'/settings/maintenance'}
                            icon={<WifiLock sx={{...IconStyle,pl:2, color:location.includes('/settings')?'black':'white'}} />}
                            text={'Maintenance'}
                        />
                    </List>
                </Collapse>
                <NavigationItem location={location} path={'/apps'} icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} text={'Apps'} />
            </List>
            <Box position={'absolute'} alignItems={'center'} bottom={0} width={'100%'} >
                <NavLink style={{margin:'5px 10px',textDecoration:'none'}} to={'/help'}>
                    <Box display={'flex'} alignItems={'center'}>
                        <ListItemIcon>  

                            <HelpCenter sx={{color:'white'}} />
                        </ListItemIcon>
                        <ListItemText sx={{color:'white'}} primary={'Help and feedback'} />
                        {/* <Typography sx={{color:'white'}}>Help and feedback</Typography> */}
                    </Box>
                </NavLink>
                <Link style={{margin:'5px 10px',textDecoration:'none', borderBottom:'1px solid white'}} to={'/user'}>
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
        </Box>
    );
}

export default Sidebar;