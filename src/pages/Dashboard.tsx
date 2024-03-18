import { Box, Grid, Stack, Typography } from "@mui/material";
import { Router, CloudOff, Wifi, WaterDrop, } from '@mui/icons-material';
import BasicTable from "../components/ui/BasicTable";
import React, { useContext, useMemo, } from "react";
import { DEFAULT_COLORS } from "../constants";
import { Link, useOutletContext } from "react-router-dom";
import MobileDashboard from "../components/layout/MobileDashboard";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { DevicesContext } from "../context/devices.context";
import { App, Device } from "waziup";
import { capitalizeFirstLetter, returnAppURL } from "../utils";
export const Item = ({ more, color, children, title }: { more: string, children: React.ReactNode, color: string, title: string }) => (
    <Box mx={2} sx={{ width: '33%', minWidth: 250, mx: 2, height: '100%', borderRadius: 2, bgcolor: 'white', p: 2 }}>
        {children}
        <NormalText title={title} />
        <Typography fontSize={14} color={color} fontWeight={300}>{more}</Typography>
    </Box>
);
const DeviceStatus = ({ devices }: { devices: Device[] }) => (
    <Box sx={{ height: '100%', borderRadius: 2, bgcolor: 'white', p: 2 }}>
        <NormalText title="Device Status" />
        <BasicTable devices={devices} />
    </Box>
);
const TextItem = ({ text }: { text: string }) => <Typography sx={{ fontSize: [10, 10, 12, 13, 10], color: DEFAULT_COLORS.secondary_black, fontWeight: 300 }} >{text}</Typography>

const AppStatus = ({ apps }: { apps: App[] }) => (
    <Box sx={{ height: '100%',overflowY:'auto', bgcolor: 'white', borderRadius: 2, p: 2 }}>
        <NormalText title="App Status" />
        <Stack width={'100%'} height={'100%'}>
            {
                apps.map((app, index) => (
                    <Link to={returnAppURL(app)} style={{textDecoration: 'none',cursor:'pointer' }} key={index}>
                        <RowContainerBetween additionStyles={{":hover":{bgcolor:'#f5f5f5',cursor:'pointer',}}} key={index}>
                            <RowContainerNormal >
                                <WaterDrop sx={{ fontSize: [20, 35, 38, 40, 40], color: 'info.main' }} />
                                <Box>
                                    <Typography color={'black'} fontSize={[10, 12, 10, 12, 14]} fontWeight={300}>{app.name}</Typography>
                                    <TextItem text="Last active 3h ago" />
                                </Box>
                            </RowContainerNormal>
                            <Typography sx={{ 
                                color: app.state ? app.state.running ? 'info.main' : '#CCC400' : 'info.main', 
                                fontWeight: 300, 
                                fontSize: [10, 12, 16, 12, 10] 
                                }}>
                                    {
                                        app.state ? capitalizeFirstLetter(app.state.status) : 'Running'
                                    }
                            </Typography>
                        </RowContainerBetween>
                    </Link>
                ))
            }
        </Stack>
    </Box>
);
export const NormalText = ({ title }: { title: string }) => (<Typography color={DEFAULT_COLORS.navbar_dark}>{title}</Typography>)
function Dashboard() {
    const { devices,networkDevices, apps } = useContext(DevicesContext);
    const [matches] = useOutletContext<[matches: boolean]>();
    const [apConn,eth0] = useMemo(() => {
        const apCn = networkDevices?.wlan0? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId): null
        const eth0 = networkDevices?.eth0;
        return [apCn, eth0]; 
    },[networkDevices]);
    return (
        <>
            {
                matches?(
                    <Box sx={{ height: '100%', overflowY: 'hidden' }}>
                        <Box p={3} sx={{ width: '100%' }}>
                            <Typography color={'black'} fontWeight={700}>Gateway Dashboard</Typography>
                            <Stack direction={'row'} mt={2} spacing={2}>
                                <Item color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                                    <Router sx={{ mb: 2, fontSize: 42, color: 'black' }} />
                                </Item>
                                <Item color="#CCC400" title="Cloud Synchronization" more="Last active 3h ago" >
                                    <CloudOff sx={{ mb: 2, fontSize: 42, color: '#D9D9D9' }} />
                                </Item>
                                {
                                    apConn?(
                                        <Item color={DEFAULT_COLORS.secondary_black} title="Wifi Connection" more={`Wifi Name: ${apConn.connection.id}`} >
                                            <Wifi sx={{ mb: 2, fontSize: 42, color: 'black' }} />
                                        </Item>
                                    ):(
                                        <Item color={DEFAULT_COLORS.secondary_black} title="Ethernet Connection" more={`IP Address: ${(eth0 && eth0.IP4Config)?eth0.IP4Config.Addresses[0].Address:''}`} >
                                            <Wifi sx={{ mb: 2, fontSize: 42, color: 'black' }} />
                                        </Item>
                                    )
                                }
                            </Stack>
                            <Grid mt={2} container spacing={2}>
                                <Grid item py={6} sm={11} md={8} >
                                    <DeviceStatus devices={devices} />
                                </Grid>
                                <Grid py={6} item sm={12} md={4} >
                                    <AppStatus apps={apps} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                ):(
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        <MobileDashboard />
                    </Box>
                )
            }
        </>
    );
}

export default Dashboard;