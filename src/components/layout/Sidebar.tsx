import { Wifi, WifiLock, Logout, HelpCenter, ArrowDropDown, AccountCircle} from '@mui/icons-material';
import { Box, Collapse, Icon, List,  ListItemIcon, ListItemText, SxProps, Theme, Typography} from '@mui/material';
import React, { CSSProperties, useContext } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import NoImageProfile from '../shared/NoImageProfile';
import WaziGateSVG from '../../assets/wazigate.svg';
import { DevicesContext } from '../../context/devices.context';
export const IconStyle: SxProps<Theme> = {
    color:'inherit',
    mr:2,
};
const bottomStyle:SxProps<Theme> = {
    position:'absolute',
    borderTop:'1px solid rgba(255, 255, 255, 0.4)',
    display:'flex',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignSelf:'center',
    bottom: 0,
    width:'100%'
};
export const ListItemButtonStyle:SxProps<Theme> ={
    color: 'inherit',
    borderRadius: 1,
    ":hover": {
        bgcolor: '#fff',
        color: '#000',
    },
}
const itemStyles:SxProps<Theme> ={
    color: '#fff',
    ":hover": {
        bgcolor:'#fff',
        color:'#000',
    },
    display: 'flex',
    width: '100%',
    py: 1,
    alignItems: 'center',
    alignSelf: 'center'
}
const commonstyle = {
    display:'flex',
    alignItems:'center',
    justifyContent: 'space-between',
    textDecoration:'none',
    width:'100%'
}
const styleFunc = ():CSSProperties=>{
    return{
        textDecoration:'none',
        alignSelf:'center',
        alignItems:'center',
        width:'100%',
    }
}
const styleFunc1 = ({isActive,}:{isActive:boolean}):CSSProperties=>{
    return{
        color:isActive?DEFAULT_COLORS.primary_black:'inherit',
        backgroundColor:isActive?'#D4E3F5':'inherit',
        borderBottom:'0.1px solid #797979',
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
        // borderRadius:4,
        textDecoration:'none',
        padding:'7px 0px',
    }
}
interface NavigationItemProps{
    location:string,
    path:string,
    icon: string,
    iconColor:string,
    text?:string,
    title?:string,
    otherItem?:JSX.Element,
    onClick?:()=> void
}
const NavigationItem = ({path,otherItem,icon,onClick,location,iconColor, text}:NavigationItemProps) => {
    return(
        <Box sx={{ display:'flex', alignItems:'center'}}>
            <NavLink state={{title:text}} to={path} onClick={onClick} style={styleFunc}>
                <Box sx={{...itemStyles,px:2,bgcolor:location.includes(path)?'#fff':'',}}>
                    <Icon sx={{mr:2, color: iconColor}}>{icon}</Icon>
                    <ListItemText sx={{color:iconColor}} primary={text} />
                </Box>
            </NavLink>
            {otherItem}
        </Box>
    )
}
const NavigationSmall = ({path,otherItem,icon,onClick,iconColor }:NavigationItemProps) => {
    return(
        <NavLink to={path} onClick={onClick} style={styleFuncSmall}>
            <Box display='flex' alignItems='center'>
                <Icon sx={{color: iconColor}}>{icon}</Icon>
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
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const {profile,setProfile,setAccessToken} = useContext(DevicesContext);
    const handleLogout = ()=>{
        const cf = window.confirm('Are you sure you want to logout?');
        if(!cf) return;
        setProfile(null);
        setAccessToken('');
        navigate('/')
    }
    return (
        <Box position={'relative'} height={'100%'} width={'100%'} display={'flex'}  flexDirection={'column'} alignItems={'center'}>
            <Box my={1} width={'100%'} display={'flex'} justifyContent={'center'} alignSelf={'center'} mx={'auto'} py={1} borderBottom={'0.05px solid rgba(255, 255, 255, 0.4)'}>
                <Box component={'img'} src={WaziGateSVG} width={'70%'} mb={1} height={50} />
            </Box>
            {
                !matchesMd?(

                    <>
                        <List sx={{ width: '100%', maxWidth: 360, }} component="nav" aria-labelledby="nested-list-subheader">
                            <NavigationItem 
                                location={location} 
                                path={'/dashboard'} 
                                icon='dashboard'
                                iconColor={location==='/dashboard'?'#292F3F':''}
                                // icon={<DashboardOutlined sx={{...IconStyle,color:location==='/dashboard'?'#292F3F':'white'}} />} 
                                text={'Dashboard'}
                                onClick={()=>setOpen(false)}
                            />
                            <NavigationItem 
                                location={location} 
                                path={'/devices'} 
                                icon='settings_remote_sharp'
                                iconColor={location.includes('/devices')?'#292F3F':''}
                                // icon={<SettingsRemoteSharp sx={{...IconStyle,color:location.includes('/devices')?'#292F3F':'white'}} />} 
                                text={'Devices'}
                                onClick={()=>setOpen(false)}
                            />
                            <NavigationItem 
                                onClick={()=>setOpen(false)}
                                location={location} 
                                path={'/apps'} 
                                icon='apps'
                                iconColor={location.includes('/apps')?'#292F3F':''}
                                // icon={<Apps sx={{...IconStyle,color:location.includes('/apps')?'#292F3F':'white'}} />} 
                                text={'Apps'} 
                            />
                            {/* <NavigationItem location={location} path={'/automation'} icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'black':'white'}} />} text={'Automation'} /> */}
                            <Box sx={{":hover":{bgcolor:'#fff',color:'#000'},color:'white', bgcolor:(location==='/settings' || location==='/settings/networking' || location==='/settings/maintenance')? '#fff':'inherit'}}>
                                <NavigationItem 
                                    location={location} 
                                    path={'/settings'}
                                    onClick={()=>setOpen(true)}
                                    icon='settings_two_tone'
                                    iconColor={(location==='/settings' || location==='/settings/networking' || location==='/settings/maintenance')?'#292F3F':''}
                                    // icon={ <SettingsTwoTone sx={{...IconStyle,color:(location==='/settings' || location==='/settings/networking' || location==='/settings/maintenance')?'#292F3F':'#fff'}} />} 
                                    text={'Settings'}
                                    otherItem={open ? <ArrowDropDown sx={{cursor:'pointer',color:location.includes('/settings')? '#000':'inherit',}} onClick={handleClick} /> : <ArrowDropDown sx={{cursor:'pointer',color:location.includes('/settings')? '#000':'inherit',borderRadius:2}} onClick={handleClick} />}
                                />
                                
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" sx={{}} disablePadding>
                                        <NavLink state={{title:'Networking'}} to={'/settings/networking'} style={styleFunc1}>
                                            <Box display='flex' sx={{py:.8,px:2,":hover":{bgcolor:'#D4E3F5'}}} width={'100%'} alignItems='center'>
                                                <ListItemIcon>
                                                    <Wifi sx={{...IconStyle,ml:2,fontSize:20, color:location.includes('/settings')?'#292F3F':'white'}} />
                                                </ListItemIcon>
                                                <ListItemText sx={{fontSize:1,color:'#000'}} primary='Networking' />
                                            </Box>
                                        </NavLink>
                                        <NavLink state={{title:'Maintenance'}} to={'/settings/maintenance'} style={styleFunc1}>
                                            <Box display='flex' sx={{py:.8,px:2,":hover":{bgcolor:'#D4E3F5'}}} width={'100%'} alignItems='center'>
                                                <ListItemIcon>
                                                    <WifiLock sx={{...IconStyle,ml:2,fontSize:20, color:location.includes('/settings')?'#292F3F':'white'}} />
                                                </ListItemIcon>
                                                <ListItemText sx={{fontSize:1,color:'#000'}} primary='Maintenance' />
                                            </Box>
                                        </NavLink>
                                        
                                    </List>
                                </Collapse>
                            </Box>
                            
                        </List>
                        <Box sx={bottomStyle}>
                            <NavLink onClick={()=>setOpen(false)} style={{display:'flex',justifyContent:'space-between', textDecoration:'none',alignSelf:'center',alignItems:'center',width:'100%'}} to={'/help'}>
                                <Box sx={{...itemStyles,px: 2,bgcolor:location==='/help'?'#fff':''}}>
                                    <HelpCenter sx={{mr: 2,color:location==='/help'?'#000':''}} />
                                    <ListItemText sx={{color:location==='/help'?'#000':''}} primary={'Help and feedback'} />
                                </Box>
                            </NavLink>
                            <Link onClick={()=>setOpen(false)} style={{textDecoration:'none',alignSelf:'center',alignItems:'center',textDecorationColor:'none',width:'100%', color:'#fff', padding:'0px 0',}} to={'/user'}>
                                <Box sx={{...itemStyles,px: 2,bgcolor:location==='/user'?'#fff':''}}>
                                    <AccountCircle sx={{mr: 2,color:location==='/user'?'#000':''}} />
                                    <Box>
                                        <Typography sx={{color:location==='/user'?'#000':''}}>Account</Typography>
                                        <Typography sx={{color:location==='/user'?'#000':''}} fontSize={13}>{profile?.username}</Typography>
                                    </Box>
                                </Box>
                            </Link>
                            <button onClick={handleLogout} style={{cursor:'pointer',alignItems:'center',border:'none', width:'100%',textAlign:'center',backgroundColor: DEFAULT_COLORS.navbar_dark, color:'#fff',padding:'8px 0',}}>
                                <Box sx={{...itemStyles,px: 2,}} >
                                    <Logout sx={{mr: 2,}} />
                                    <Typography>Logout</Typography>
                                </Box>
                            </button>
                        </Box>
                    </>
                ):(
                    <Box mt={2} width={'87%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Box my={1} >
                            <NavigationSmall 
                                location={location} 
                                path={'/dashboard'}
                                title='Dashboard'
                                iconColor={location==='/dashboard'?'#fff':'#fff'}
                                icon='dashboard'
                                // icon={<Dashboard sx={{...IconStyle,color:location==='/dashboard'?'black':'white'}} />} 
                            />
                        </Box>
                        <NavigationSmall 
                            location={location} 
                            path={'/devices'}
                            title='Devices'
                            onClick={()=>setOpen(false)}
                            icon='settings_remote_sharp'
                            iconColor={location ===('/devices')?'#fff':'#fff'}
                            // icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'#000':'white'}} />} 
                        />
                        <NavigationSmall 
                            location={location} 
                            path={'/apps'} 
                            title='Apps'
                            onClick={()=>setOpen(false)}
                            icon='apps'
                            iconColor={location==='/apps'?'#fff':'#fff'}
                            // icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} 
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
                            icon='settings_two_tone'
                            iconColor={(location==='/settings' || location==='/settings/networking' || location==='/settings/maintenance')?'#fff':'#fff'}
                            // icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'#000':'white'}} />} 
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
                                    icon='wifi'
                                    iconColor={location.includes('/settings')?'#292F3F':'#fff'}
                                    // icon={<Wifi sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#000':'white'}} />} 
                                />
                                <NavigationSmall
                                    location={location}
                                    title='Maintenance'
                                    path={'/settings/maintenance'}
                                    icon='wifi_lock'
                                    iconColor={location.includes('/settings')?'#292F3F':'#fff'}
                                    // icon={<WifiLock sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#000':'white'}} />}
                                />
                            </List>
                        </Collapse>
                        
                        <Box sx={{position:'absolute', borderTop:'1px solid rgba(255, 255, 255, 0.4)',display:'flex',alignSelf:'center', flexDirection:'column', alignItems:'center',bottom: 0,width:'100%'}}>
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
                            <button onClick={handleLogout} style={{cursor:'pointer', textDecoration:'none', backgroundColor: DEFAULT_COLORS.navbar_dark,margin: '5px 0'}}>
                                <Box my={.5} display={'flex'} py={1} alignItems={'center'}>
                                    <Logout sx={{color:'white',fontSize:18}} />
                                </Box>
                            </button>
                        </Box>
                    </Box>
                )
            }
        </Box>
    );
}

export default Sidebar;