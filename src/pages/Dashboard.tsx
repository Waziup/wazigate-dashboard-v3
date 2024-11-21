import { Box, Grid, Stack, Typography,styled } from "@mui/material";
import {  CloudOff, Wifi,  Cloud, SearchOff, } from '@mui/icons-material';
import BasicTable from "../components/ui/BasicTable";
import React, { useContext, useMemo, } from "react";
import { DEFAULT_COLORS } from "../constants";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import MobileDashboard from "../components/layout/MobileDashboard";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { DevicesContext } from "../context/devices.context";
import { App, Device } from "waziup";
import { allActiveDevices, appChecker, capitalizeFirstLetter,orderByLastUpdated, returnAppURL } from "../utils";
import InternetIndicator from "../components/ui/InternetIndicator";
export const Item = ({ path, onClick, children,icon, title, }: { path:string, onClick:(path: string)=>void ,icon: React.ReactNode, children: React.ReactNode, title: string }) => (
    <Box onClick={()=>onClick(path)} mx={2} sx={{cursor:'pointer', width: '33%', minWidth: 250, mx: 2, height: '100%', borderRadius: 2, bgcolor: 'white', p: 2 }}>
        {icon}
        <NormalText title={title} />
        {children}
    </Box>
);
const DeviceStatus = ({ devices,onDeviceClick,activeDevices,totalDevices }: {totalDevices: number,activeDevices:number, onDeviceClick:(devId:string)=>void, devices: Device[] }) => (
    <Box sx={{ height: '100%',width:'100%', borderRadius: 2, bgcolor: 'white', p: 0 }}>
        <RowContainerBetween additionStyles={{width:'100%',my:0, p:2}}>
            <NormalText title="Device Status" />
            <Box sx={{display:'flex',alignItems:'center',}}>
                <Typography fontSize={14} color={DEFAULT_COLORS.secondary_black} fontWeight={300}>{activeDevices} of {totalDevices} devices {activeDevices===1?'are':'is'} active.</Typography>
            </Box>
        </RowContainerBetween>
        <BasicTable onDeviceClick={onDeviceClick} devices={devices} />
    </Box>
);
const TextItem = ({ text }: { text: string }) => <Typography sx={{ fontSize: [10, 10, 12, 13, 10], color: DEFAULT_COLORS.secondary_black, fontWeight: 300 }} >{text}</Typography>
const MyScrollingElement = styled(Stack)(() => ({
    overflow: "auto",
    width: '100%',
    height: '100%',
    scrollbarWidth: "none", // Hide the scrollbar for firefox
    '&::-webkit-scrollbar': {
        display: 'none', // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
    },
    '&-ms-overflow-style:': {
        display: 'none', // Hide the scrollbar for IE
    },
}));
const AppStatus = ({ apps }: { apps: App[] }) => (
    <Box sx={{ height: '100%', bgcolor: 'white', borderRadius: 2,  }}>
        <Box p={2}>
            <NormalText title="App Status" />
        </Box>
        <MyScrollingElement sx={{overflowY:'auto'}} width={'100%'} height={'100%'}>
            {
                apps && apps.length >0?apps.map((app, index) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const [imageError, setImageError] = React.useState(false);
                    const handleImageError = () => {setImageError(true)}
                    return(
                        <Link to={returnAppURL(app)} style={{textDecoration: 'none',cursor:'pointer' }} key={index}>
                            <RowContainerBetween additionStyles={{px:2,":hover":{bgcolor:'#f5f5f5',cursor:'pointer',}}} key={index}>
                                <RowContainerNormal>
                                    {
                                        imageError?(
                                            <Box sx={{ width: 32, height: 32, borderRadius: 16, bgcolor: 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography sx={{ fontSize: 15, color: 'white'}}>W</Typography>
                                            </Box>
                                        ):(app.waziapp && (app.waziapp as App['waziapp'] &{icon:string}).icon) ? (
                                            <Box sx={{ width: 32, height: 32,alignItems:'center',display:'flex',justifyContent:'center', borderRadius: 16, overflow: 'hidden' }}>
                                                <img onError={handleImageError} src={`/apps/${app.id}/`+(app.waziapp as App['waziapp'] &{icon:string}).icon} alt={app.name} style={{ width: 20, height: 20 }} />
                                            </Box>
                                        ) : (
                                            <Box sx={{ width: 32, height: 32, borderRadius: 16, bgcolor: 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography sx={{ fontSize: 15, color: 'white'}}>W</Typography>
                                            </Box>
                                        )
                                    }
                                    <Box ml={1}>
                                        <Typography color={'black'} fontSize={[10, 12, 10, 12, 14]} fontWeight={300}>{app.name}</Typography>
                                        <TextItem 
                                            text={((app.state !== null || app.state)?appChecker(app.state):'')}
                                        />
                                    </Box>
                                </RowContainerNormal>
                                <Typography sx={{  color: app.state ? app.state.running ? 'info.main' : '#CCC400' : 'info.main', fontWeight: 300,  fontSize: [10, 12, 12, 12, 14] }}>
                                    {
                                        app.state ? capitalizeFirstLetter(app.state.status) : ''
                                    }
                                </Typography>
                            </RowContainerBetween>
                        </Link>
                )}): (
                    <Box sx={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <SearchOff sx={{fontSize:20,color:'#325460'}}/>
                        <Typography fontSize={18} color={'#325460'}>No Apps Installed</Typography>
                    </Box>
                )
            }
        </MyScrollingElement>
    </Box>
);
export const NormalText = ({ title }: { title: string }) => (<Typography color={DEFAULT_COLORS.navbar_dark}>{title}</Typography>)
function Dashboard() {
    const { devices,networkDevices,selectedCloud, apps } = useContext(DevicesContext);
    const [matches] = useOutletContext<[matches: boolean]>();
    const [apConn,eth0] = useMemo(() => {
        const apCn = networkDevices?.wlan0? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId): null
        const eth0 = networkDevices?.eth0;
        return [apCn, eth0]; 
    },[networkDevices]);
    const navigate = useNavigate();
    const onClick = (path:string)=>{
        navigate(path)
    }
    return (
        <>
            {
                matches?(
                    <Box sx={{px:4,py:2, height: '100%', overflowY: 'hidden' }}>
                        <Typography fontSize={24} color={'black'} fontWeight={700}>Gateway Dashboard</Typography>
                        <Stack direction={'row'} mt={2} spacing={2}>
                            <Item icon={selectedCloud?.paused?(<CloudOff sx={{ mb: 2, fontSize: 42, color: '#D9D9D9' }} /> ):( <Cloud sx={{mb: 2, fontSize: 42, color: 'black' }} /> )} path='/settings/networking' onClick={onClick} title="Cloud Synchronization">
                                <Typography fontSize={14} color={DEFAULT_COLORS.secondary_black} fontWeight={300}>
                                    {!(selectedCloud?.paused)?'Synched with Waziup Cloud':'Not Synchronized'}
                                </Typography>
                                <Typography fontSize={14} color={selectedCloud?.paused?"#CCC400":DEFAULT_COLORS.primary_blue} fontWeight={300}>{selectedCloud?.paused?"Inactive":'Active'}</Typography>
                            </Item>
                            {
                                (eth0 && eth0.IP4Config)?(
                                    <Item icon={<Wifi sx={{ mb: 2, fontSize: 42, color: 'black' }} />} path='/settings/networking' onClick={onClick} title="Ethernet Connection" >
                                        <Typography fontSize={14} color={DEFAULT_COLORS.secondary_black} fontWeight={300}>
                                            {`IP Address: ${(eth0 && eth0.IP4Config)?eth0.IP4Config.Addresses[0].Address:''}`}
                                        </Typography>
                                        <RowContainerNormal additionStyles={{m:0}}>
                                            <Typography fontSize={14} fontWeight={300} color={DEFAULT_COLORS.secondary_black} mr={1}>Internet: </Typography>
                                            <InternetIndicator />
                                        </RowContainerNormal>
                                    </Item>
                                ):(
                                    <Item icon={<Wifi sx={{ mb: 2, fontSize: 42, color: 'black' }} />} path='/settings/networking'  onClick={onClick} title="Wifi Connection"  >
                                        <Typography fontSize={14} color={DEFAULT_COLORS.secondary_black} fontWeight={300}>
                                            {`Wifi Name: ${apConn?.connection.id}`}
                                        </Typography>
                                        <RowContainerNormal additionStyles={{m:0}}>
                                            <Typography fontSize={14} fontWeight={300} color={DEFAULT_COLORS.secondary_black} mr={1}>Internet: </Typography>
                                            <InternetIndicator />
                                        </RowContainerNormal>
                                    </Item>
                                )
                            }
                        </Stack>
                        <Grid mt={2} container spacing={2}>
                            <Grid item py={6} sm={11} md={8} >
                                <DeviceStatus 
                                    onDeviceClick={onClick}
                                    totalDevices={devices?devices.length:0}
                                    activeDevices={devices? allActiveDevices(devices):0}
                                    devices={devices?orderByLastUpdated(devices.slice(-5)): []} 
                                />
                            </Grid>
                            <Grid py={6} item sm={12} md={4} >
                                <AppStatus apps={apps?apps.slice(-5):[]} />
                            </Grid>
                        </Grid>
                    </Box>
                ):(
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        <MobileDashboard
                            onClick={onClick}
                            apConn={apConn}
                            eth0={eth0}
                            selectedCloud={selectedCloud}
                            apps={apps.slice(-5)}
                            totalDevices={devices?devices.length:0}
                            activeDevices={devices? allActiveDevices(devices):0}
                            devices={devices?orderByLastUpdated(devices.slice(-5)): []} 
                        />
                    </Box>
                )
            }
        </>
    );
}

export default Dashboard;