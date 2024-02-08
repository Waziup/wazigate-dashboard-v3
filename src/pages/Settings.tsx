import { Box, Grid, Typography,  Button, CircularProgress } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { AccessTime, CellTower, CheckCircle, Logout, PowerSettingsNew, RestartAlt, Save } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import RowContainerNormal from '../components/shared/RowContainerNormal';
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState, useEffect } from 'react';
import { shutdown,reboot, getTime, getTimezones,getNetworkDevices,Devices, } from '../utils/systemapi';

import { Android12Switch } from '../components/shared/Switch';
import SelectElementString from '../components/shared/SelectElementString';
const IconStyle: SxProps<Theme> = { fontSize: 20, mr: 2, color: DEFAULT_COLORS.primary_black };
const GridItem = ({ children, text, matches, icon }: { matches: boolean, additionStyles?: SxProps<Theme>, text: string, children: React.ReactNode, icon: React.ReactNode }) => (
    <Grid item xs={12} md={5} m={matches ? 2 : 0} my={1} borderRadius={2} bgcolor={'#fff'} >
        <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, bgcolor: '#D8D8D8', p: 1, alignItems: 'center' }} p={1} >
            {icon}
            <Typography color={'#212529'} fontWeight={500}>{text}</Typography>
        </Box>
        {children}
    </Grid>
);
const RowContainer = ({ children, additionStyles }: { children: React.ReactNode, additionStyles?: SxProps<Theme> }) => (
    <>
        <RowContainerBetween additionStyles={{ ...additionStyles, alignItems: 'center', bgcolor: '#D4E3F5', m: 1, borderRadius: 1, p: 1 }}>
            {children}
        </RowContainerBetween>
    </>
)
function Settings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const today = new Date();
    const [currentTime, setCurrentTime] = useState<string>('');
    const [networkDevices, setNetworkDevices] = useState<Devices>({});
    const [isSetDateManual, setIsSetDateManual] = useState<boolean>(false);
    const [data, setData] = useState<{
        time: Date | null,
        utc: Date | null,
        zone: string
    } | null>(null);
    const [wazigateID, setWazigateID] = useState<string>(''); 
    const [timezones, setTimezones] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    function loopLoad() {
        setLoading(true);
        getTime().then(
          (res) => {
            setData({
                time: isNaN(Date.parse(res.time)) ? null : new Date(res.time),
                utc: isNaN(Date.parse(res.utc)) ? null : new Date(res.utc),
                zone: res.zone,
            });
            setTimeout(
              () => {
                    loopLoad();
              },
            ); // Update the time from server every 30 seconds
          },
          () => {
            setLoading(false);
          }
        );
      }
    useEffect(() => {
        window.wazigate.getID().then(setWazigateID);
        getNetworkDevices().then((res) => {
            setNetworkDevices(res);
        }, () => {
            setNetworkDevices({});
        });
        getTimezones()
        .then((res) => {
            setTimezones(res);
        },() => {
            setTimezones([]);
        });
        loopLoad();
        const timer = setInterval(() => {
            setCurrentTime(dayjs().format('HH:mm:ss'));
        }, 1000);
        return () => { clearInterval(timer); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const apConn = networkDevices.wlan0.AvailableConnections.find(conn => conn.connection.id === "WAZIGATE-AP");
    const eth0 = networkDevices.eth0;
    function handleSetDateManually() {
        setIsSetDateManual(!isSetDateManual);
    }
    return (
        <>
            {
                loading ? (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                        <Typography fontWeight={700} color={'black'}>Loading...</Typography>
                    </Box>
                ):null
            }
            <Box sx={{ p: 3, overflowY: 'auto',scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}, height: '100%' }}>
                <Box>
                    <Typography fontWeight={700} color={'black'}>Devices</Typography>
                    <Typography sx={{ color: DEFAULT_COLORS.secondary_black }}>Setup your Wazigate Edge Apps</Typography>
                </Box>
                <Grid container m={0}>
                    <GridItem matches={matches} text='Network' icon={<CellTower sx={IconStyle} />}>
                        <Box my={2}>
                            <RowContainer>
                                <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>
                                    {
                                        atob(apConn?.['802-11-wireless']?.ssid as unknown as string) || 'WAZIGATE-AP'
                                    }
                                    </Typography>
                                <CheckCircle sx={{ color: DEFAULT_COLORS.primary_black, fontSize: 17 }} />
                            </RowContainer>
                            <RowContainer>
                                <Typography color={'primary.main'} fontWeight={300}>IP address</Typography>
                                <Typography color={DEFAULT_COLORS.primary_black} fontWeight={700}>
                                    {
                                        eth0?.IP4Config ? (
                                            eth0.IP4Config.Addresses[0].Address
                                        ):(
                                            <CircularProgress/>
                                        )
                                    }
                                </Typography>
                            </RowContainer>
                        </Box>
                    </GridItem>
                    <GridItem matches={matches} text='Time Settings' icon={<AccessTime sx={IconStyle} />}>
                        <Box my={2}>
                            <RowContainer>
                                <Typography color={'primary.main'} fontWeight={300}>Local Time</Typography>
                                <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.primary_black} fontWeight={700}>{currentTime}</Typography>
                            </RowContainer>
                            <RowContainer>
                                <Typography color={'primary.main'} fontWeight={300}>Date</Typography>
                                <Typography textTransform={'uppercase'} fontSize={14} color={DEFAULT_COLORS.primary_black} fontWeight={700}>{today.toLocaleDateString().toString().replaceAll('/', '-')}</Typography>
                            </RowContainer>
                            <RowContainer>
                                <Typography color={'primary.main'} fontWeight={300}>Time Zone</Typography>
                                <Typography color={DEFAULT_COLORS.primary_black} fontSize={14} fontWeight={700}>{data? data.zone:''}</Typography>
                            </RowContainer>
                            <Box bgcolor={'#D4E3F5'} borderRadius={1} p={1} m={1}>
                                <RowContainerBetween additionStyles={{ m: 1, px: 1 }}>
                                    <Typography color={DEFAULT_COLORS.navbar_dark} fontSize={14} fontWeight={300}>Set TimeZone Automatically</Typography>
                                    <Android12Switch checked color='info' />
                                </RowContainerBetween>
                                <SelectElementString
                                    conditions={timezones}
                                    handleChange={()=>{}}
                                    title='Time Zone'
                                    value={''}

                                />
                            </Box>
                            <Box bgcolor={'#D4E3F5'} borderRadius={1} p={1} m={1}>
                                <RowContainerBetween additionStyles={{ m: 1, }}>
                                    <Typography color={DEFAULT_COLORS.navbar_dark} fontSize={14} fontWeight={300}>set time and date manually</Typography>
                                    <Android12Switch checked={isSetDateManual} onClick={handleSetDateManually} color='info' />
                                </RowContainerBetween>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem label="">
                                            <DesktopDatePicker disabled={!isSetDateManual} sx={{ p: 0 }} defaultValue={dayjs(today.toLocaleDateString().toString().replaceAll('/', '-' + " "))} />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                                <Button disabled={!isSetDateManual} variant="text" sx={{ color: '#fff', m: 1, bgcolor: 'info.main' }} startIcon={<Save />}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </GridItem>
                    <GridItem matches={matches} text='Gateway Power' icon={<PowerSettingsNew sx={IconStyle} />}>
                        <RowContainerNormal additionStyles={{ m: 1, borderRadius: 1, p: 1 }}>
                            <Button onClick={shutdown} variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<PowerSettingsNew />}>
                                Shutdown
                            </Button>
                            <Button onClick={reboot} variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<RestartAlt />}>
                                Restart
                            </Button>
                            <Button variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<Logout />}>
                                Logout
                            </Button>
                        </RowContainerNormal>
                    </GridItem>
                    <GridItem matches={matches} text='Wazigate Version' icon={<PowerSettingsNew sx={IconStyle} />}>
                        <RowContainer>
                            <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>
                                Wazigate Version
                            </Typography>
                            <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>
                                {wazigateID}
                            </Typography>
                        </RowContainer>
                    </GridItem>
                </Grid>
            </Box>
        </>
    );
}

export default Settings;