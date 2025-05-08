import { Wifi, WifiLock, Logout, HelpCenter, ArrowDropDown, ArrowDropUp, } from '@mui/icons-material';
import { Box, Collapse, Icon, List, ListItem, ListItemIcon, ListItemText, SxProps, Theme, Button } from '@mui/material';
import React, { CSSProperties, useContext } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import NoImageProfile from '../shared/NoImageProfile';
import WaziGateSVG from '../../assets/wazigate.svg';
import { DevicesContext } from '../../context/devices.context';
export const IconStyle: SxProps<Theme> = {
    color: 'inherit',
    mr: 1,
};
const bottomStyle: SxProps<Theme> = {
    position: 'absolute',
    borderTop: '1px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 0,
    width: '100%'
};
export const ListItemButtonStyle: SxProps<Theme> = {
    color: 'inherit',
    borderRadius: 1,
    ":hover": {
        bgcolor: '#fff',
        color: '#000',
    },
}
// const itemStyles: SxProps<Theme> = {
//     color: '#fff',
//     ":hover": {
//         bgcolor: '#fff',
//         color: '#000',
//     },
//     display: 'flex',
//     py: 1,
//     alignItems: 'center',
//     alignSelf: 'center'
// }
const commonstyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    width: '100%'
}
const styleFunc1 = ({ isActive, }: { isActive: boolean }): CSSProperties => {
    return {
        color: isActive ? DEFAULT_COLORS.primary_black : 'inherit',
        backgroundColor: isActive ? '#D4E3F5' : 'inherit',
        // borderBottom: '0.1px solid #797979',
        ...commonstyle
    }
}
const styleFuncSmall = ({ isActive, }: { isActive: boolean }): CSSProperties => {
    return {
        color: isActive ? DEFAULT_COLORS.primary_black : '#fff',
        // backgroundColor:isActive?'white':'',
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        // borderRadius:4,
        textDecoration: 'none',
        padding: '7px 0px',
    }
}
interface NavigationItemProps {
    location: string,
    path: string,
    icon: string,
    iconColor: string,
    text?: string,
    title?: string,
    otherItem?: JSX.Element,
    onClick?: () => void
}
const NavigationItem = ({ path, otherItem, icon, onClick, location, iconColor, text }: NavigationItemProps) => {
    return (
        <Link state={{ title: text }} to={path} onClick={onClick} style={{ textDecoration: 'none', width: '100%', }}>
            <ListItem sx={{ color: '#fff', px: 1, bgcolor: location.includes(path) ? '#fff' : '', ":hover": { bgcolor: '#fff', color: '#000' }, }}>
                <Icon sx={{ mr: 1, color: iconColor }}>{icon}</Icon>
                <ListItemText sx={{ color: iconColor }} primary={text} />
                {otherItem}
            </ListItem>
        </Link>
    )
}
const NavigationSmall = ({ path, otherItem, icon, onClick, iconColor }: NavigationItemProps) => {
    return (
        <NavLink to={path} onClick={onClick} style={styleFuncSmall}>
            <Box display='flex' alignItems='center'>
                <Icon sx={{ color: iconColor }}>{icon}</Icon>
            </Box>
            {otherItem}
        </NavLink>
    )
}

function Sidebar({ matchesMd }: { matchesMd: boolean }) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const { setProfile, setAccessToken, showDialog, closeDialog } = useContext(DevicesContext);
    const handleLogout = () => {
        showDialog({
            content: "Are you sure you want to logout? ",
            onAccept: () => {
                setProfile(null);
                setAccessToken('');
                navigate('/')
            },
            onCancel: closeDialog,
            acceptBtnTitle: "Logout",
            title: "Logout"
        });
    }
    return (
        <Box position={'relative'} width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Box my={1} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} py={1} borderBottom={'0.05px solid rgba(255, 255, 255, 0.4)'}>
                <Box component={'img'} width={'70%'} src={WaziGateSVG} mb={1} height={50} />
            </Box>
            {
                !matchesMd ? (

                    <>
                        <List sx={{ width: '100%' }} component="nav" aria-labelledby="nested-list-subheader">
                            <NavigationItem
                                location={location}
                                path={'/dashboard'}
                                icon='dashboard'
                                iconColor={location === '/dashboard' ? '#292F3F' : ''}
                                text={'Dashboard'}
                                onClick={() => setOpen(false)}
                            />
                            <NavigationItem
                                location={location}
                                path={'/devices'}
                                icon='settings_remote_sharp'
                                iconColor={location.includes('/devices') ? '#292F3F' : ''}
                                text={'Devices'}
                                onClick={() => setOpen(false)}
                            />
                            <NavigationItem
                                onClick={() => setOpen(false)}
                                location={location}
                                path={'/apps'}
                                icon='apps'
                                iconColor={location.includes('/apps') ? '#292F3F' : ''}
                                text={'Apps'}
                            />

                            <Box
                                sx={{
                                    ":hover": { bgcolor: '#fff', color: '#000' },
                                    color: 'white',
                                    bgcolor:
                                        location === '/settings' ||
                                            location === '/settings/networking' ||
                                            location === '/settings/maintenance'
                                            ? '#fff'
                                            : 'inherit',
                                    transition: 'background-color 0.3s',
                                }}
                            >
                                <NavigationItem
                                    location={location}
                                    path={'/settings'}
                                    onClick={() => setOpen(!open)} // Toggle collapse state
                                    icon="settings_two_tone"
                                    iconColor={
                                        location === '/settings' ||
                                            location === '/settings/networking' ||
                                            location === '/settings/maintenance'
                                            ? '#292F3F'
                                            : 'inherit'
                                    }
                                    text={'Settings'}
                                    otherItem={
                                        open ? (
                                            <ArrowDropUp
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: location.includes('/settings') ? '#000' : 'inherit',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpen(false);
                                                }}
                                            />
                                        ) : (
                                            <ArrowDropDown
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: location.includes('/settings') ? '#000' : 'inherit',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpen(true);
                                                }}
                                            />
                                        )
                                    }
                                />

                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <NavLink state={{ title: 'Networks' }} to={'/settings/networking'} style={styleFunc1}>
                                            <Box
                                                display="flex"
                                                sx={{
                                                    py: 0.8,
                                                    px: 2,
                                                    bgcolor: location === '/settings/networking'
                                                        ? '#dbeaff'
                                                        : open
                                                            ? 'rgba(219, 234, 255, 0.2)' // 20% transparency of #dbeaff
                                                            : 'transparent',
                                                    ":hover": {
                                                        bgcolor: '#dbeaff',
                                                    },
                                                    transition: 'background-color 0.3s',
                                                }}
                                                width={'100%'}
                                                alignItems="center"
                                            >
                                                <ListItemIcon>
                                                    <Wifi
                                                        sx={{
                                                            ...IconStyle,
                                                            ml: 1,
                                                            fontSize: 20,
                                                            color: location.includes('/settings') ? '#292F3F' : 'white',
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText sx={{ fontSize: 1, color: '#000' }} primary="Networks" />
                                            </Box>
                                        </NavLink>

                                        <NavLink state={{ title: 'Maintenance' }} to={'/settings/maintenance'} style={styleFunc1}>
                                            <Box
                                                display="flex"
                                                sx={{
                                                    py: 0.8,
                                                    px: 2,
                                                    bgcolor: location === '/settings/maintenance'
                                                        ? '#dbeaff'
                                                        : open
                                                            ? 'rgba(219, 234, 255, 0.2)' // 20% transparency of #dbeaff
                                                            : 'transparent',
                                                    ":hover": {
                                                        bgcolor: '#dbeaff',
                                                    },
                                                    transition: 'background-color 0.3s',
                                                }}
                                                width={'100%'}
                                                alignItems="center"
                                            >
                                                <ListItemIcon>
                                                    <WifiLock
                                                        sx={{
                                                            ...IconStyle,
                                                            ml: 1,
                                                            fontSize: 20,
                                                            color: location.includes('/settings') ? '#292F3F' : 'white',
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText sx={{ fontSize: 1, color: '#000' }} primary="Maintenance" />
                                            </Box>
                                        </NavLink>
                                    </List>
                                </Collapse>
                            </Box>
                        </List>


                        <Box sx={bottomStyle}>

                            <NavigationItem
                                onClick={() => setOpen(false)}
                                location={location}
                                path={'/user'}
                                icon='account_circle'
                                iconColor={location.includes('/user') ? '#292F3F' : ''}
                                text={'Profile'}
                            />

                            <NavigationItem
                                onClick={() => setOpen(false)}
                                location={location}
                                path={'/help'}
                                icon='help_center'
                                iconColor={location.includes('/help') ? '#292F3F' : ''}
                                text={'Help & Feedback'}
                            />

                            <Button
                                variant='text'

                                fullWidth
                                sx={{
                                    borderRadius: 0,
                                    fontSize: '1rem',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    textTransform: 'none',
                                    px: 2,
                                    color: '#fff',
                                    backgroundColor: 'transparent',
                                    ":hover": {
                                        backgroundColor: '#fff',
                                        color: '#000',
                                    },
                                    transition: 'background-color 0.3s, color 0.3s',
                                }}
                                startIcon={<Logout />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>

                        </Box>
                    </>
                ) : (
                    <Box mt={2} width={'87%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Box my={1} >
                            <NavigationSmall
                                location={location}
                                path={'/dashboard'}
                                title='Dashboard'
                                iconColor={location === '/dashboard' ? '#fff' : '#fff'}
                                icon='dashboard'
                            // icon={<Dashboard sx={{...IconStyle,color:location==='/dashboard'?'black':'white'}} />} 
                            />
                        </Box>
                        <NavigationSmall
                            location={location}
                            path={'/devices'}
                            title='Devices'
                            onClick={() => setOpen(false)}
                            icon='settings_remote_sharp'
                            iconColor={location === ('/devices') ? '#fff' : '#fff'}
                        // icon={<SettingsRemoteSharp sx={{...IconStyle,color:location==='/devices'?'#000':'white'}} />} 
                        />
                        <NavigationSmall
                            location={location}
                            path={'/apps'}
                            title='Apps'
                            onClick={() => setOpen(false)}
                            icon='apps'
                            iconColor={location === '/apps' ? '#fff' : '#fff'}
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
                            iconColor={(location === '/settings' || location === '/settings/networking' || location === '/settings/maintenance') ? '#fff' : '#fff'}
                            // icon={<SettingsTwoTone sx={{...IconStyle,color:location==='/settings'?'#000':'white'}} />} 
                            onClick={handleClick}
                            title='Settings'
                        // otherItem={open ? <ExpandLess /> : <ExpandMore />}
                        />

                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <NavigationSmall
                                    location={location}
                                    title='Networks'
                                    path={'/settings/networking'}
                                    icon='wifi'
                                    iconColor={location.includes('/settings') ? '#292F3F' : '#fff'}
                                // icon={<Wifi sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#000':'white'}} />} 
                                />
                                <NavigationSmall
                                    location={location}
                                    title='Maintenance'
                                    path={'/settings/maintenance'}
                                    icon='wifi_lock'
                                    iconColor={location.includes('/settings') ? '#292F3F' : '#fff'}
                                // icon={<WifiLock sx={{...IconStyle,ml:1, color:location.includes('/settings')?'#000':'white'}} />}
                                />
                            </List>
                        </Collapse>

                        <Box sx={{ position: 'absolute', borderTop: '1px solid rgba(255, 255, 255, 0.4)', display: 'flex', alignSelf: 'center', flexDirection: 'column', alignItems: 'center', bottom: 0, width: '100%' }}>
                            <Link state={{ title: "Help" }} style={{ textDecoration: 'none', margin: '5px 0' }} to={'/help'}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <HelpCenter sx={{ color: 'white' }} />
                                </Box>
                            </Link>
                            <Link state={{ title: "Profile" }} style={{ textDecoration: 'none', margin: '5px 0' }} to={'/user'}>
                                <Box display={'flex'} >
                                    <NoImageProfile />
                                </Box>
                            </Link>
                            <Logout onClick={handleLogout} sx={{ color: 'white', my: 1, fontSize: 18 }} />

                        </Box>
                    </Box>
                )
            }
        </Box>
    );
}

export default Sidebar;