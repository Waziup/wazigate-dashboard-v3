import React, { useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Typography, SxProps, Theme } from '@mui/material';
import { ExpandLess, ExpandMore, Dashboard, SettingsRemoteSharp, Apps, PrecisionManufacturing, SettingsTwoTone, Wifi, WifiLock, Logout, HelpCenter, } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import NoImageProfile from '../NoImageProfile';

export const IconStyle: SxProps<Theme> = {
    color: 'inherit',
};

const Sidebar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const location = useLocation().pathname;

    const handleClick = () => {
        setOpen(!open);
    };

    const listItemButtonStyle = {
        color: '#fff',
        borderRadius: 1,
        pt: 2,
        pb: 2,
        ":hover": {
            bgcolor: '#fff',
            color: '#000',
        },
    };

    const renderNavItem = (path: string, icon: React.ReactNode, text: string) => (
        <ListItemButton
            onClick={() => navigate(path)}
            sx={{
                ...listItemButtonStyle,
                color: location === path ? 'black' : '#fff',
                bgcolor: location === path ? 'white' : '',
                mb: 1,
            }}
        >
            <ListItemIcon sx={{ color: location === path ? 'black' : 'white' }}>
                {React.cloneElement(icon as React.ReactElement, {
                    sx: {
                        color: 'inherit', // Set the icon's color to inherit
                    },
                })}
            </ListItemIcon>
            <ListItemText sx={{ fontSize: 1 }} primary={text} />
        </ListItemButton>
    );

    return (
        <Box sx={{ position: 'relative', height: '100%', pl: 2, pr: 2 }} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Box component='img' src='/wazigate.svg' height="fit-content" />
            <List sx={{ width: '100%', }} component="nav" aria-labelledby="nested-list-subheader">
                {renderNavItem('/', <Dashboard sx={{ color: "inherit" }} />, 'Dashboard')}
                {renderNavItem('/devices', <SettingsRemoteSharp sx={{ color: "inherit" }} />, 'Devices')}
                {renderNavItem('/automation', <PrecisionManufacturing sx={{ color: "inherit" }} />, 'Automation')}
                <ListItemButton
                    onClick={handleClick}
                    sx={{
                        borderTopLeftRadius: 3,
                        ...listItemButtonStyle,
                        color: location.includes('/settings') ? 'black' : '#fff',
                        bgcolor: location.includes('/settings') ? 'white' : '',
                        mb: 1,
                    }}
                >
                    <ListItemIcon>
                        <SettingsTwoTone sx={{ color: location.includes('/settings') ? 'black' : 'white', }} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {renderNavItem('/settings/networking', <Wifi sx={{ color: "inherit" }} />, 'Networking')}
                        {renderNavItem('/settings/maintenance', <WifiLock sx={{ color: "inherit" }} />, 'Maintenance')}
                    </List>
                </Collapse>
                {renderNavItem('/apps', <Apps sx={{ color: "inherit" }} />, 'Apps')}
            </List>
            <Box position={'absolute'} alignItems={'center'} bottom={0} width={'100%'}>
                <Box component={'a'} onClick={() => navigate('/help')} display={'flex'} px={'10%'} py={1} alignItems={'center'} sx={{cursor:'pointer'}}>
                    <HelpCenter sx={{ color: 'white' }} />
                    <Typography sx={{ color: 'white' }}>Help and feedback</Typography>
                </Box>
                <Box py={.5} px={'10%'} onClick={() => navigate('/user')} sx={{ textDecoration: 'none', color: '#fff', cursor:'pointer' }} component={'a'} borderBottom={'1px solid white'} borderTop={'1px solid white'} display={'flex'} alignItems={'center'}>
                    <NoImageProfile />
                    <Box>
                        <Typography>John Doe</Typography>
                        <Typography fontSize={13}>johndoe@waziup.org</Typography>
                    </Box>
                </Box>
                <Box px={'10%'} display={'flex'} py={1} alignItems={'center'} sx={{cursor:'pointer'}}>
                    <Logout sx={{ color: 'white' }} />
                    <Typography sx={{ color: 'white' }}>Logout</Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Sidebar;