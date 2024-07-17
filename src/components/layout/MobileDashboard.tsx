import React from "react";
import { Cloud, CloudOff, Router,  Wifi } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";
import RowContainerBetween from "../shared/RowContainerBetween";
import RowContainerNormal from "../shared/RowContainerNormal";
const Item = ({ more,path,onClick, color, children, title }: {path:string, onClick:(path: string)=>void, more: string, children: React.ReactNode, color: string, title: string }) => (
    <Box onClick={()=>onClick(path)} sx={{minWidth:220, boxShadow: 3,mx:1,width:'30%', borderRadius: 1, border: '1px solid #ccc', height: '100%', bgcolor: 'white', p: 2 }}>
        {children}
        <Typography fontSize={13} color={'black'}>{title}</Typography>
        <Typography color={color} fontSize={13} fontWeight={300}>{more}</Typography>
    </Box>
);
import { capitalizeFirstLetter, differenceInMinutes, isActiveDevice, returnAppURL } from "../../utils";
import { useNavigate, Link } from "react-router-dom";
import { App, Cloud as Cl, Device as Dev } from "waziup";
import type { Device, Connection } from "../../utils/systemapi";
interface Props{
    apConn: Connection | null | undefined
    eth0: Device | undefined
    apps: App[]
    onClick: (path:string)=>void
    devices: Dev[]
    selectedCloud: Cl | null
}
export default function MobileDashboard({onClick, apConn,apps,devices,selectedCloud, eth0 }: Props) {
    const navigate = useNavigate();
    const handleNav = (devId: string,devName:string) => {
        navigate(`/devices/${devId}`,{state:{title:devName,backUrl:'/devices',backTitle:'Devices',showBack:true}});
    }
    return (
        <Box sx={{ overflowY: 'auto', height: '100%' }} >
            <Stack direction={'row'} overflow={'auto'} m={2} spacing={1}>
                <Item path='/settings' onClick={onClick} color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                    <Router sx={{ fontSize: 20, color: 'black' }} />
                </Item>
                <Item path='/settings' onClick={onClick} color={selectedCloud?.paused?"#E9C68F":DEFAULT_COLORS.primary_blue} title="Cloud Synchronization" more={selectedCloud?.paused?"Inactive":'Active'} >
                    {
                        selectedCloud?.paused?(
                            <CloudOff sx={{ fontSize: 20, color: '#D9D9D9' }} />
                        ):(
                            <Cloud sx={{ fontSize: 20, color: 'black' }} />
                        )
                    }
                </Item>
                {
                    (eth0 && eth0.IP4Config)?(
                        <Item path='/settings/networking' onClick={onClick} color={DEFAULT_COLORS.secondary_black} title="Ethernet Connection" more={`IP Address: ${(eth0 && eth0.IP4Config)?eth0.IP4Config.Addresses[0].Address:''}`} >
                            <Wifi sx={{ fontSize: 20, color: 'black' }} />
                        </Item>
                    ):(
                        <Item path='/settings/networking' onClick={onClick} color={DEFAULT_COLORS.secondary_black} title="Wifi Connection" more={`Wifi Name: ${apConn?.connection.id}`} >
                            <Wifi sx={{ fontSize: 20, color: 'black' }} />
                        </Item>
                    )
                }
            </Stack>
            <Box mt={2} px={1}>
                <RowContainerBetween>
                    <Typography color={'#666666'}>Device status</Typography>
                    <Link style={{textDecoration:'none', color:DEFAULT_COLORS.primary_blue,}} to={'/devices'}>
                        <Typography fontSize={10} textAlign={'center'}>See all</Typography>
                    </Link>
                </RowContainerBetween>
                <Box display={'flex'} flexDirection={'column'} mt={1} py={1} alignItems={'center'}>
                    {
                        devices.length>0?devices.filter((_dev,idx)=>idx<5).map((dev, id) => (

                            <Box onClick={() => { handleNav(dev.id,dev.name) }} key={id} sx={{ cursor: 'pointer', my: 1, ":hover": { bgcolor: 'rgba(0,0,0,.1)' }, width: '100%', height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
                                <Box sx={{ position: 'absolute', top: -5, my: -1, borderRadius: 1, mx: 1, bgcolor: DEFAULT_COLORS.primary_blue }}>
                                    <Typography fontSize={10} mx={1} color={'white'} component={'span'}>{capitalizeFirstLetter(dev.meta.type)}</Typography>
                                </Box>
                                <Box sx={{ py: 1.5, px: 2, }}>
                                    <RowContainerBetween>
                                        <Typography color={'black'} fontSize={18} fontWeight={500}>{dev.name}</Typography>
                                        <Typography color={isActiveDevice(dev.modified)? DEFAULT_COLORS.primary_blue:'#88888D'} fontSize={15} lineHeight={.8} fontWeight={300}>
                                            {isActiveDevice(dev.modified) ? 'active' : 'offline'}
                                        </Typography>
                                    </RowContainerBetween>
                                    <RowContainerBetween>
                                        <Typography fontSize={13} color={'#797979'}>Last updated: {differenceInMinutes(dev.modified)} secs ago</Typography>
                                        <Typography fontSize={10} color={'#797979'} my={1} lineHeight={.8} fontWeight={300}></Typography>
                                    </RowContainerBetween>
                                </Box>
                            </Box>
                        )): <Box p={2} textAlign={'center'}><Typography>No devices found</Typography></Box>
                    }
                </Box>
            </Box>
            <Box mt={1} px={1}>
                <RowContainerBetween>
                    <Typography color={'#666666'}>App status</Typography>
                    <Link style={{textDecoration:'none', color:DEFAULT_COLORS.primary_blue,}} to={'/apps'}>
                        <Typography fontSize={10} textAlign={'center'}>See all</Typography>
                    </Link>
                </RowContainerBetween>
                <Box display={'flex'} flexDirection={'column'} mt={1} borderRadius={2} bgcolor={'#fff'} alignItems={'center'}>
                    {
                        apps.length>0?apps.map((app, id) => {
                            return(
                            <Box onClick={() => {!(app.id.includes("wazigate-system"))? navigate(returnAppURL(app)):'/' }} key={id} sx={{ cursor: 'pointer', ":hover": { bgcolor: 'rgba(0,0,0,.1)' }, borderBottom: '1px solid #E2E2E2', width: '95%', height: '100%', position: 'relative', px: 1, bgcolor: 'white', }}>
                                <RowContainerBetween>
                                    <RowContainerNormal >
                                        <Box sx={{ width: 30, height: 30, borderRadius: 15, bgcolor: 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ fontSize: 15, color: 'white'}}>W</Typography>
                                        </Box>
                                        <Box mx={1}>
                                            <Typography fontSize={[12, 12, 16, 12, 10]} color={'black'} fontWeight={300}>{app.name}</Typography>
                                            <Typography fontSize={[10, 12, 10, 12, 14]} color={DEFAULT_COLORS.secondary_black} fontWeight={300}>
                                            {'Created: '+(app.state !== null || app.state)?app.state?.startedAt?new Date(app.state.startedAt).toDateString():'':''}
                                            </Typography>
                                        </Box>
                                    </RowContainerNormal>
                                    <Box>
                                        <Typography sx={{ color: app.state && app.state.running ?'info.main':'#797979' }} fontSize={[12, 12, 16, 12, 10]} fontWeight={300}>{app.state ? app.state.running ? 'active' : 'Stopped' : ''}</Typography>
                                        <Typography fontSize={10} color={'#797979'} my={1} lineHeight={.8} fontWeight={300}>{app.author.name}</Typography>
                                    </Box>
                                </RowContainerBetween>
                            </Box>
                        )}): <Box p={2} textAlign={'center'}><Typography>No apps installed</Typography></Box>
                    }
                </Box>
            </Box>
        </Box>
    );
}