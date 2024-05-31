import { Box, Grid, Typography,  Button, CircularProgress, SelectChangeEvent } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { AccessTime, CheckCircle, PowerSettingsNew, RestartAlt, Save } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import RowContainerNormal from '../components/shared/RowContainerNormal';
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { useState, useEffect, useMemo } from 'react';
import {setTime, shutdown,reboot,getBuildNr,getTimezoneAuto, getTime, getTimezones,getNetworkDevices,Devices, setTimezone, } from '../utils/systemapi';

import { Android12Switch } from '../components/shared/Switch';
import SelectElementString from '../components/shared/SelectElementString';
import GridItemEl from '../components/shared/GridItemElement';
import SnackbarComponent from '../components/shared/Snackbar';
const IconStyle: SxProps<Theme> = { fontSize: 20, mr: 2, color: DEFAULT_COLORS.primary_black };
const GridItem = ({bgcolor,additionStyles,md, children,}: {xs:number,md:number, matches: boolean,bgcolor?:boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode }) => (
    <Grid sx={{bgcolor: bgcolor?'#fff':'',...additionStyles}} bgcolor={bgcolor?'#fff':''} item md={md} lg={5.8} xl={5.8} sm={6} xs={12} my={1} >
        {children}
    </Grid>
);
const RowContainer = ({ children, additionStyles }: { children: React.ReactNode, additionStyles?: SxProps<Theme> }) => (
    <RowContainerBetween additionStyles={{ ...additionStyles, alignItems: 'center', bgcolor: '#D4E3F5', m: 1, borderRadius: 1, p: 1 }}>
        {children}
    </RowContainerBetween>
);
function padZero(t: number): string {
    if (t < 10) return "0"+t;
    return ""+t;
}
function Settings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const [currentTime, setCurrentTime] = useState<string>('');
    const [buildNr, setBuildNr] = useState<string>('');
    const [responseMessage , setReponseMessage] = useState<string>('');
    const [networkDevices, setNetworkDevices] = useState<Devices>({});
    const [isSetDateManual, setIsSetDateManual] = useState<boolean>(false);
    const [isSetTimezoneAuto, setIsSetTimezoneAuto] = useState<boolean>(false);
    const [data, setData] = useState<{
        time: Date | null,
        utc: Date | null,
        zone: string
    } | null>(null);
    const [wazigateID, setWazigateID] = useState<string>(''); 
    const [timezones, setTimezones] = useState<string[]>([]);
    const convTime = (date: Date) => {
        //console.log("convTime_Date: " + date)
        return `${date.getFullYear()}-${padZero(date.getMonth()+1)}-${padZero(date.getDate())}T${padZero(date.getHours())}:${padZero(date.getMinutes())}`
    }
    
    const submitTime = () => {
        const date_and_time = convTime(data?.time as Date);
        setTime(date_and_time).then(
            () => {
                alert("Time set successfully");
            },
            (error) => {
                alert("Error setting time: " + error);
            }
        );
    }
    const onTimeChange = (date: dayjs.Dayjs) => {
        setData({
            time: date.toDate(),
            utc: data? data.utc: null,
            zone: data? data.zone: ''
        });
    }
    const handleSaveTimezone = (e: SelectChangeEvent<string>) => {
        setTimezone(e.target.value)
        .then(()=>{
            setReponseMessage("The time zone set");
        })
        .catch(()=>{
            setReponseMessage("Error setting time zone");
        });
    };
    useEffect(() => {
        const isAuto = window.localStorage.getItem('timezoneAuto') === 'true';
        setIsSetTimezoneAuto(isAuto);
        if(isAuto){
            getTimezoneAuto()
            .then((res) => {
                setData({
                    time: null,
                    utc: null,
                    zone: res
                });
            }).catch(()=>{
                setIsSetTimezoneAuto(false);
            });
        }
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
        getBuildNr()
        .then((res) => {
            setBuildNr(res);
        });
        const getTimeInterval = setInterval(() => {
            getTime().then(
                (res) => {
                    setData({
                        time: isNaN(Date.parse(res.time)) ? null : new Date(res.time),
                        utc: isNaN(Date.parse(res.utc)) ? null : new Date(res.utc),
                        zone: isSetTimezoneAuto? data? data.zone: '': res.zone
                    });
                }
            );
        }, 6000);
        const timer = setInterval(() => {
            setCurrentTime(dayjs().format('HH:mm:ss'));
        }, 5000);
        return () => { 
            clearInterval(timer); 
            clearInterval(getTimeInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [apConn,eth0,address,connectedWifi] = useMemo(() => {
        const apCn = networkDevices.wlan0? networkDevices.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId): null
        const eth0 = networkDevices.eth0;
        const addR = networkDevices.wlan0? networkDevices.wlan0.IP4Config.Addresses[0].Address: '';
        const connId = networkDevices.wlan0? networkDevices.wlan0.ActiveConnectionId: '';
        return [apCn, eth0,addR,connId]; 
    },[networkDevices]);
    const shutdownHandler = () => {
        const res = window.confirm("Are you sure you want to shutdown?");
        if (res) {
            shutdown();
            window.close();
        }
    }
    const switchTimezoneAuto = (val:boolean) => {
        setIsSetTimezoneAuto(val);
    }
    useEffect(() => {
        if(isSetTimezoneAuto){
            getTimezoneAuto()
            .then((res) => {
                setData({
                    time: data?.time || null,
                    utc: data?.utc || null,
                    zone: res
                })
                window.localStorage.setItem('timezoneAuto', 'true');
            }).catch(()=>{
                setIsSetTimezoneAuto(false);
            });
        }else{
            window.localStorage.setItem('timezoneAuto', 'false');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isSetTimezoneAuto])

    const rebootHandler = () => {
        const res = window.confirm("Are you sure you want to reboot?");
        if (res) {
            reboot();
            window.close();
        }
    }
    function handleSetDateManually() {
        setIsSetDateManual(!isSetDateManual);
    }
    return (
        <>
            <SnackbarComponent anchorOrigin={{ vertical: 'top', horizontal: 'center' }} severity='success' autoHideDuration={6000} message={responseMessage} />
            <Box sx={{ pt: matches?3:1.5,pl: matches?3:1.5, width:'100%', overflowY: 'auto',scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}, height: '100%' }}>
                <Box>
                    <Typography fontWeight={700} color={'black'}>Settings</Typography>
                    <Typography sx={{ fontSize:13, color: DEFAULT_COLORS.secondary_black }}>Configure settings for wazigate</Typography>
                </Box>
                <Grid width={'100%'} container>
                    <GridItem additionStyles={{m:matches?1:0}} md={12} xs={12} matches={matches} >
                        <GridItemEl icon='cell_tower' text={(eth0 && eth0.IP4Config)?'Ethernet':'Network'}>
                            <Box py={2}>
                                <RowContainer>
                                    <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>
                                        {
                                            apConn?atob(apConn?.['802-11-wireless']?.ssid as unknown as string) || 'WAZIGATE-AP': connectedWifi? connectedWifi:''
                                        }
                                    </Typography>
                                    <CheckCircle sx={{ color: DEFAULT_COLORS.primary_black, fontSize: 17 }} />
                                </RowContainer>
                                <RowContainer>
                                    <Typography color={'primary.main'} fontWeight={300}>IP address</Typography>
                                    <Typography color={DEFAULT_COLORS.primary_black} fontWeight={700}>
                                        {
                                            (eth0 && eth0.IP4Config) ? (
                                                eth0.IP4Config.Addresses[0].Address
                                            ):address? address: (
                                                <CircularProgress size={10} sx={{fontSize:10 }} />
                                            )
                                        }
                                    </Typography>
                                </RowContainer>
                            </Box>
                        </GridItemEl>
                        <GridItemEl text='Wazigate ID' icon='fingerprint'>
                            <Typography sx={{textAlign:'left',textTransform:'uppercase',p:2,color:DEFAULT_COLORS.navbar_dark,fontWeight:300}}>
                                {wazigateID}
                            </Typography>
                        </GridItemEl>
                        <GridItemEl  text='Wazigate Version' icon='account_tree'>
                            <Typography sx={{textAlign:'left',p:2,color:DEFAULT_COLORS.navbar_dark,fontWeight:300}}>
                                {buildNr}
                            </Typography>
                        </GridItemEl>
                        <GridItemEl text='Gateway Power' icon='power_settings_new'>
                            <RowContainerNormal additionStyles={{ m: 1,py: 4, borderRadius: 1, p: 1 }}>
                                <Button onClick={shutdownHandler} variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<PowerSettingsNew />}>
                                    Shutdown
                                </Button>
                                <Button onClick={rebootHandler} variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<RestartAlt />}>
                                    Restart
                                </Button>
                            </RowContainerNormal>
                        </GridItemEl>
                    </GridItem>
                    <GridItem additionStyles={{boxShadow:2,borderRadius:2,}} bgcolor md={12} xs={12} matches={matches} >
                        <Box sx={{ display: 'flex', borderTopLeftRadius: 5,border:'.5px solid #d8d8d8', borderTopRightRadius: 5, bgcolor: '#F7F7F7', alignItems: 'center' }} p={1} >
                            <AccessTime sx={IconStyle} />
                            <Typography color={'#212529'} fontWeight={500}>Time Settings</Typography>
                        </Box>
                        <Box my={2}>
                            <RowContainer>
                                <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>Local Time</Typography>
                                <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.primary_black} fontWeight={700}>{currentTime}</Typography>
                            </RowContainer>
                            <RowContainer>
                                <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>Date</Typography>
                                <Typography textTransform={'uppercase'} fontSize={14} color={DEFAULT_COLORS.primary_black} fontWeight={700}>
                                    {
                                        data?(
                                            dayjs(data.time).format('DD/MM/YYYY')
                                        ):(
                                            <CircularProgress size={10} sx={{fontSize:10 }} />
                                        )
                                    }
                                </Typography>
                            </RowContainer>
                            <RowContainer>
                                <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>Time Zone</Typography>
                                <Typography color={DEFAULT_COLORS.primary_black} fontSize={14} fontWeight={700}>
                                    {
                                        data?(
                                            data.zone
                                        ):(
                                            <CircularProgress size={10} sx={{fontSize:10, }} />
                                        )
                                    }
                                </Typography>
                            </RowContainer>
                            <Box bgcolor={isSetTimezoneAuto?'#fff':'#D4E3F5'} borderRadius={1} p={1} m={1}>
                                <RowContainerBetween additionStyles={{ m: 1, px: 1 }}>
                                    <Typography color={DEFAULT_COLORS.navbar_dark} fontSize={14} fontWeight={300}>Set TimeZone Automatically</Typography>
                                    <Android12Switch onChange={(_e,checked)=>switchTimezoneAuto(checked)} checked={isSetTimezoneAuto} color='info' />
                                </RowContainerBetween>
                                {
                                    isSetTimezoneAuto?(null):(
                                        <SelectElementString
                                            conditions={timezones}
                                            handleChange={handleSaveTimezone}
                                            title='Time Zone'
                                            value={data? data.zone:''}
                                        />
                                    )
                                }
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
                                            <DesktopDateTimePicker 
                                                onChange={(v)=>onTimeChange(v as dayjs.Dayjs)} 
                                                disabled={!isSetDateManual} 
                                                sx={{ p: 0 }} 
                                                value={dayjs(data?.time)} 
                                                defaultValue={dayjs(data?.time)} 
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                                <Button onClick={submitTime} disabled={!isSetDateManual} variant="text" sx={{ color: '#fff', m: 1, bgcolor: 'info.main' }} startIcon={<Save />}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </>
    );
}

export default Settings;