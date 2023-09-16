import { ExpandLess,SettingsRemoteSharp,Apps, PrecisionManufacturing, ExpandMore,Dashboard, SettingsTwoTone, Wifi, WifiLock, Logout, HelpCenter} from '@mui/icons-material';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme, Typography} from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
const IconStyle: SxProps<Theme> = {
    color:'inherit',
}
const ListItemButtonStyle:SxProps<Theme> ={
    color:'#fff',
    borderRadius:1,
    ":hover":{
        bgcolor:'#fff',
        color:'#000',
        // width:'80%',
        // borderWidth:'100%',
    },
}
const NavItem = ({location,path, icon,text}:{location:string,path:string, icon:React.ReactNode,text:string}) => (
    <ListItemButton href={path} sx={{...ListItemButtonStyle,color:location===path?DEFAULT_COLORS.primary_black:'#fff', bgcolor:location===path?'white':'', }}>
        <ListItemIcon>
            {icon}
        </ListItemIcon>
        <ListItemText sx={{fontSize:1}} primary={text} />
    </ListItemButton>
)
function Sidebar() {
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    };
    const location = useLocation().pathname;
    return (
        <Box sx={{position:'relative',height:'100%'}} display={'flex'}  flexDirection={'column'} alignItems={'center'}  >
            <Box component={'img'} src={'/wazigate.svg'} width={'80%'} height={100} />
            <List sx={{ width: '87%', maxWidth: 360,}} component="nav" aria-labelledby="nested-list-subheader">
                <NavItem location={location} path={'/'} icon={<Dashboard sx={{...IconStyle,color:location==='/'?'black':'white'}} />} text={'Dashboard'} />
                <NavItem location={location} path={'/devices'} icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'black':'white'}} />} text={'Devices'} />
                <NavItem location={location} path={'/automation'} icon={<PrecisionManufacturing sx={{...IconStyle,color:location==='/automation'?'black':'white'}} />} text={'Automation'} />
                <ListItemButton sx={ListItemButtonStyle} onClick={handleClick}>
                    <ListItemIcon>
                        <SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'black':'white'}} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton href='/networking' sx={{...ListItemButtonStyle,pl:4}}>
                            <ListItemIcon>
                                <Wifi sx={{...IconStyle,color:location==='/networking'?'black':'white'}} />
                            </ListItemIcon>
                            <ListItemText primary="Networking" />
                        </ListItemButton>
                        <ListItemButton href='/maintenance' sx={{...ListItemButtonStyle,pl:4}}>
                            <ListItemIcon>
                                <WifiLock sx={{...IconStyle,color:location==='/'?'black':'white'}}/>
                            </ListItemIcon>
                            <ListItemText primary="Maintenance" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <NavItem location={location} path={'/apps'} icon={<Apps sx={{...IconStyle,color:location==='/apps'?'black':'white'}} />} text={'Apps'} />
            </List>
            <Box position={'absolute'} alignItems={'center'} bottom={0} width={'100%'} >
                <Box display={'flex'} px={'10%'} py={1} alignItems={'center'}>
                    <HelpCenter sx={{color:'white'}} />
                    <Typography sx={{color:'white'}}>Help and feedback</Typography>
                </Box>
                <Box py={.5} px={'10%'} borderBottom={'1px solid white'} borderTop={'1px solid white'} display={'flex'} alignItems={'center'}>
                    <Box component={'img'} sx={{objectFit:'contain',borderRadius:25}} src={'https://picsum.photos/200/300'} width={50} height={50} />
                    <Box>
                        <Typography>John Doe</Typography>
                        <Typography fontSize={13} >johndoe@waziup.org</Typography>
                    </Box>
                </Box>
                <Box px={'10%'} display={'flex'} py={1} alignItems={'center'}>
                    <Logout sx={{color:'white'}} />
                    <Typography sx={{color:'white'}}>Logout</Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Sidebar;