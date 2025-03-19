import { Avatar, Box, Breadcrumbs, Card, CardContent, Grid, Paper, Stack, Typography, styled } from "@mui/material";
import { CloudOff, Wifi, CloudQueue, SearchOff, } from '@mui/icons-material';
import BasicTable from "../components/ui/BasicTable";
import React, { useContext, useMemo, FC, useCallback } from "react";
import { DEFAULT_COLORS } from "../constants";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import MobileDashboard from "../components/layout/MobileDashboard";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { DevicesContext } from "../context/devices.context";
import { App, Device } from "waziup";
import { allActiveDevices, appChecker, capitalizeFirstLetter, orderByLastUpdated, returnAppURL } from "../utils";
import InternetIndicator from "../components/ui/InternetIndicator";

interface ItemProps {
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
    path: string;
    onClick: (path: string) => void;
}
export const InfoCard: FC<ItemProps> = ({ path, onClick, children, icon, title }) => {
    const handleClick = useCallback(() => onClick(path), [onClick, path]);

    return (
        <Card onClick={handleClick} sx={{ width: 350, cursor: 'pointer' }}>
            <CardContent>
                {/* <Stack direction={'row'} spacing={2} mb={2}> */}
                    {icon}
                    <Typography gutterBottom >{title}</Typography>
                {/* </Stack> */}
                {children}
            </CardContent>
        </Card>
    );
};
const DeviceStatus = ({ devices, onDeviceClick, activeDevices, totalDevices }: { totalDevices: number, activeDevices: number, onDeviceClick: (devId: string) => void, devices: Device[] }) => {
    // const navigate = useNavigate();
    return <Paper sx={{ height: '100%', width: '100%', borderRadius: 2, bgcolor: 'white', p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', my: 0, alignItems: 'flex-start', p: 2 }}>
            <Box>
                <NormalText title="Device Status" />
                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <Typography variant="caption">{activeDevices} of {totalDevices} devices {activeDevices === 1 ? 'are' : 'is'} active</Typography>
                </Box>
            </Box>
            <Link style={{ textDecoration: 'underline', color: DEFAULT_COLORS.orange, }} to={'/devices'}>
                <Typography fontSize={14}>See all</Typography>
            </Link>
        </Box>
        <BasicTable onDeviceClick={onDeviceClick} devices={devices} />
    </Paper>
}
    ;
// const TextItem = ({ text }: { text: string }) => <Typography sx={{ fontSize: [10, 10, 12, 13, 10], color: DEFAULT_COLORS.secondary_black, fontWeight: 300 }} >{text}</Typography>

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

export function countActiveApp(items: App[]): number{
    let count = 0;
    items.forEach((item)=>{
        if(item.state.running){
            count++;
        }
    });
    return count;
}

const AppStatus = ({ apps }: { apps: App[] }) => (
    <Paper sx={{ height: '100%', bgcolor: 'white', borderRadius: 2, }}>
        <RowContainerBetween additionStyles={{ p: 2 }}>
            <Box>
                <NormalText title="App Status" />
                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <Typography variant="caption">{countActiveApp(apps)} of {apps.length} apps active</Typography>
                </Box>
            </Box>
            <Link style={{ textDecoration: 'underline', color: DEFAULT_COLORS.orange, }} to={'/apps'}>
                <Typography fontSize={14}>See all</Typography>
            </Link>
        </RowContainerBetween>
        <MyScrollingElement sx={{ overflowY: 'auto' }} width={'100%'} height={'100%'}>
            {
                apps && apps.length > 0 ? apps.map((app, index) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const [imageError, setImageError] = React.useState(false);
                    const handleImageError = () => { setImageError(true) }
                    return (
                        <Link to={returnAppURL(app)} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }} key={index}>
                            <RowContainerBetween additionStyles={{ px: 2, ":hover": { bgcolor: '#f5f5f5', cursor: 'pointer', } }} key={index}>
                                <RowContainerNormal>
                                    {
                                        imageError ? (
                                            <Avatar sx={{ bgcolor: DEFAULT_COLORS.primary_blue }}>W</Avatar>
                                        ) : (app.waziapp && (app.waziapp as App['waziapp'] & { icon: string }).icon) ? (
                                            <Avatar src={`/apps/${app.id}/` + (app.waziapp as App['waziapp'] & { icon: string }).icon} alt={app.name} onError={handleImageError} />
                                            // <Box sx={{ width: 32, height: 32, alignItems: 'center', display: 'flex', justifyContent: 'center', borderRadius: 16, overflow: 'hidden' }}>
                                            //     <img onError={handleImageError} src={`/apps/${app.id}/` + (app.waziapp as App['waziapp'] & { icon: string }).icon} alt={app.name} style={{ width: 20, height: 20 }} />
                                            // </Box>
                                        ) : (
                                            <Avatar sx={{ bgcolor: 'info.main' }}>W</Avatar>
                                        )
                                    }
                                    <Box ml={1}>
                                        <Typography variant="body2" >{app.name}</Typography>
                                        <Typography variant="caption" >{((app.state !== null || app.state) ? appChecker(app.state) : '')}</Typography>
                                        {/* <TextItem
                                            text={((app.state !== null || app.state) ? appChecker(app.state) : '')}
                                        /> */}
                                    </Box>
                                </RowContainerNormal>
                                <Typography variant="body2" sx={{ color: app.state ? app.state.running ? DEFAULT_COLORS.primary_blue : DEFAULT_COLORS.red : DEFAULT_COLORS.primary_blue, fontWeight: 600 }}>
                                    {
                                        app.state ? capitalizeFirstLetter(app.state.status) : ''
                                    }
                                </Typography>
                            </RowContainerBetween>
                        </Link>
                    )
                }) : (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <SearchOff sx={{ fontSize: 20, color: '#325460' }} />
                        <Typography fontSize={18} color={'#325460'}>No Apps Installed</Typography>
                    </Box>
                )
            }
        </MyScrollingElement>
    </Paper>
);

export const NormalText = ({ title }: { title: string }) => (<Typography color={DEFAULT_COLORS.navbar_dark}>{title}</Typography>)

function Dashboard() {
    const { devices, networkDevices, selectedCloud, apps } = useContext(DevicesContext);
    const [matches] = useOutletContext<[matches: boolean]>();
    const [apConn, eth0] = useMemo(() => {
        const apCn = networkDevices?.wlan0 ? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId) : null
        const eth0 = networkDevices?.eth0;
        return [apCn, eth0];
    }, [networkDevices]);
    const navigate = useNavigate();
    const onClick = (path: string) => {
        navigate(path)
    }
    return (
        <>
            {
                matches ? (
                    <Box sx={{ px: 4, py: 2, height: '100%', overflowY: 'hidden' }}>
                        <Box>
                            <Typography variant="h5">Gateway Dashboard</Typography>
                            <Box role="presentation" onClick={() => { }}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Typography fontSize={16} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                        <Link style={{ color: 'black', textDecoration: 'none', fontWeight: 300 }} state={{ title: 'Devices' }} color='text.secondary' to="/">
                                            Home
                                        </Link>
                                    </Typography>
                                </Breadcrumbs>
                            </Box>
                        </Box>
                        <Stack direction={'row'} mt={2} spacing={2}>
                            <InfoCard icon={selectedCloud?.paused ? (<CloudOff sx={{ my:1, color: '#D9D9D9' }} />) : (<CloudQueue sx={{ my:1, color: 'black' }} />)} path='/settings/networking' onClick={onClick} title="Cloud Synchronization">
                                <Typography variant="subtitle2" color='text.secondary' fontWeight={300}>
                                    {!(selectedCloud?.paused) ? 'Synched with Waziup Cloud' : 'Not Synchronized'}
                                </Typography>
                                <RowContainerNormal additionStyles={{ gap: 1, m: 0 }}>
                                    <Typography variant="subtitle2" color='text.secondary'>Status: </Typography>
                                    <Typography variant="subtitle2" color={selectedCloud?.paused ? "#FA9E0E" : DEFAULT_COLORS.primary_blue} fontWeight={600}>{selectedCloud?.paused ? "Inactive" : 'Active'}</Typography>
                                </RowContainerNormal>
                            </InfoCard>
                            {
                                (eth0 && eth0.IP4Config) ? (
                                    <InfoCard icon={<Wifi sx={{ my:1, color: 'black' }} />} path='/settings/networking' onClick={onClick} title="Ethernet Connection" >
                                        <Typography variant="subtitle2" color='text.secondary' fontWeight={300}>
                                            {`IP Address: ${(eth0 && eth0.IP4Config) ? eth0.IP4Config.Addresses[0].Address : ''}`}
                                        </Typography>
                                        <RowContainerNormal additionStyles={{ gap: 1, m: 0 }}>
                                            <Typography variant="subtitle2" color='text.secondary'>Internet: </Typography>
                                            <InternetIndicator />
                                        </RowContainerNormal>
                                    </InfoCard>
                                ) : (
                                    <InfoCard icon={<Wifi sx={{ my:1, color: 'black' }} />} path='/settings/networking' onClick={onClick} title="Wifi Connection"  >
                                        <Typography variant="subtitle2" color='text.secondary' fontWeight={300}>
                                            {`Wifi Name: ${apConn?.connection.id}`}
                                        </Typography>
                                        <RowContainerNormal additionStyles={{ gap: 1, m: 0 }}>
                                            <Typography variant="subtitle2" color='text.secondary'>Internet: </Typography>
                                            <InternetIndicator />
                                        </RowContainerNormal>
                                    </InfoCard>
                                )
                            }
                        </Stack>
                        <Grid mt={2} container spacing={2}>
                            <Grid item py={6} sm={12} md={8} >
                                <DeviceStatus
                                    onDeviceClick={onClick}
                                    totalDevices={devices ? devices.length : 0}
                                    activeDevices={devices ? allActiveDevices(devices) : 0}
                                    devices={devices ? orderByLastUpdated(devices.slice(-5)) : []}
                                />
                            </Grid>
                            <Grid py={6} item sm={12} md={4} >
                                <AppStatus apps={apps ? apps.slice(-5) : []} />
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        <MobileDashboard
                            onClick={onClick}
                            apConn={apConn}
                            eth0={eth0}
                            selectedCloud={selectedCloud}
                            apps={apps.slice(-5)}
                            totalDevices={devices ? devices.length : 0}
                            activeDevices={devices ? allActiveDevices(devices) : 0}
                            devices={devices ? orderByLastUpdated(devices.slice(-5)) : []}
                        />
                    </Box>
                )
            }
        </>
    );
}

export default Dashboard;