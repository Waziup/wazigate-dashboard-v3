import { Box, Grid, Typography,  Button, CircularProgress, SelectChangeEvent,  Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { AccessTime, CheckCircle, PowerSettingsNew, RestartAlt } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import RowContainerNormal from '../components/shared/RowContainerNormal';
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { useState, useEffect, useMemo, useContext } from 'react';
import {setTime, shutdown,reboot,getBuildNr,getTimezoneAuto, getTime, getTimezones, setTimezone, } from '../utils/systemapi';
import SelectElementString from '../components/shared/SelectElementString';
import GridItemEl from '../components/shared/GridItemElement';
import SnackbarComponent from '../components/shared/Snackbar';
import { DevicesContext } from '../context/devices.context';
import InternetIndicator from '../components/ui/InternetIndicator';
const IconStyle: SxProps<Theme> = { fontSize: 20, mr: 2, color: DEFAULT_COLORS.primary_black };
const GridItem = ({bgcolor,additionStyles,md, children,}: {xs:number,md:number, matches: boolean,bgcolor?:boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode }) => (
    <Grid sx={{bgcolor: bgcolor?'#fff':'',...additionStyles}} bgcolor={bgcolor?'#fff':''} item md={md} lg={5.8} xl={5.8} sm={5.8} xs={12} my={1} >
        {children}
    </Grid>
);
const RowContainer = ({ children, additionStyles }: { children: React.ReactNode, additionStyles?: SxProps<Theme> }) => (
    <RowContainerBetween additionStyles={{ ...additionStyles, alignItems: 'center',  m: 1, borderRadius: 1, p: 1 }}>
        {children}
    </RowContainerBetween>
);
function padZero(t: number): string {
    if (t < 10) return "0"+t;
    return ""+t;
}
const convTime = (date: Date) => (
    `${date.getFullYear()}-${padZero(date.getMonth()+1)}-${padZero(date.getDate())}T${padZero(date.getHours())}:${padZero(date.getMinutes())}`
);
function Settings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const [currentTime, setCurrentTime] = useState<string>('');
    const [buildNr, setBuildNr] = useState<string>('');
    const [responseMessage , setReponseMessage] = useState<string>('');
    const [isSetTimezoneAuto, setIsSetTimezoneAuto] = useState<boolean>(false);
    const [data, setData] = useState<{
        time: Date | null,
        utc: Date | null,
        zone: string
    } | null>(null);

    const [modalProps, setModalProps] = useState<{ open: boolean, title: string,  }>({ open: false, title: '' });
    const [timezones, setTimezones] = useState<string[]>([]);
    const {wazigateId,networkDevices, showDialog} = useContext(DevicesContext);
    
    const submitTime = () => {
        const date_and_time = convTime(data?.time as Date);
        setTime(date_and_time).then(() => {
            showDialog({
                title:"Time set",
                content:"Time set successfully",
                acceptBtnTitle:"CLOSE",
                hideCloseButton: true,
                onAccept:()=>{},
                onCancel:()=>{},
            });
            setModalProps({open:false,title:''})
        },(error) => {
            showDialog({
                title:"Error",
                content:"Error setting time: " + error,
                acceptBtnTitle:"CLOSE",
                hideCloseButton: true,
                onAccept:()=>{},
                onCancel:()=>{},
            });
            setModalProps({open:false,title:''})
        });
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
        showDialog({
            title:"Shut down",
            acceptBtnTitle:"SHUTDOWN",
            content:"Are you sure you want to shutdown?",
            onAccept() {
                shutdown();
                window.close();
            },
            onCancel() {},
        })
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
        showDialog({
            title:"Reboot",
            acceptBtnTitle:"REBOOT",
            content: "Are you sure you want to reboot?",
            onAccept() {
                reboot();
                window.close();
            },
            onCancel() {},
        });
    }
    function closeModal() {
        setModalProps({ open: false, title: ''});
    }
    return (
        <>
            <Dialog fullWidth open={modalProps.open && modalProps.title === 'Changing Timezone'} onClose={closeModal}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{my:2,overflow:'auto'}}>
                    <SelectElementString
                        conditions={timezones}
                        handleChange={handleSaveTimezone}
                        title='Set TimeZone'
                        value={data? data.zone:''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button  onClick={closeModal} variant={'text'} sx={{ mx: 2,color:'#ff0000' }} color={'info'}>CLOSE</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={modalProps.open && modalProps.title === 'Changing Time and date'} onClose={closeModal}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{overflow:'auto',my:2,}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer  components={[ 'DatePicker',]}>
                            <DemoItem label="">
                                <DesktopDateTimePicker 
                                    onChange={(v)=>onTimeChange(v as dayjs.Dayjs)} 
                                    sx={{ p: 0 }} 
                                    value={dayjs(data?.time)} 
                                    defaultValue={dayjs(data?.time)} 
                                />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} variant={'text'} sx={{ mx: 2,color:'#ff0000' }} color={'info'}>CLOSE</Button>
                    <Button autoFocus onClick={submitTime} sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >SAVE</Button>
                </DialogActions>
            </Dialog>
            <SnackbarComponent anchorOrigin={{ vertical: 'top', horizontal: 'center' }} severity='success' autoHideDuration={6000} message={responseMessage} />
            <Box sx={{px:matches? 4:2,py:2, overflowY: 'auto',scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}, height: '100%' }}>
                <Box>
                    <Typography fontWeight={700} fontSize={24} color={'black'}>Settings</Typography>
                    <Typography sx={{ fontSize:13, color: DEFAULT_COLORS.secondary_black }}>Configure settings for wazigate</Typography>
                </Box>
                <Grid width={'100%'} container>
                    <GridItem additionStyles={{mr: matches?2:0,}} md={12} xs={12} matches={matches} >
                        <GridItemEl additionStyles={{pb:.2,}} icon='cell_tower' text={(eth0 && eth0.IP4Config)?'Ethernet':'Network'}>
                            <RowContainer >
                                <Typography textTransform={'uppercase'} color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>
                                    {
                                        apConn?atob(apConn?.['802-11-wireless']?.ssid as unknown as string) || 'WAZIGATE-AP': connectedWifi? connectedWifi:''
                                    }
                                </Typography>
                                <CheckCircle sx={{ color: DEFAULT_COLORS.primary_blue, fontSize: 17 }} />
                            </RowContainer>
                            <RowContainer>
                                <Typography color='primary.main' fontWeight={300}>IP address</Typography>
                                <Typography color={DEFAULT_COLORS.primary_black} >
                                    {
                                        (eth0 && eth0.IP4Config) ? (
                                            eth0.IP4Config.Addresses[0].Address
                                        ):address? address: (
                                            <CircularProgress size={10} sx={{fontSize:10 }} />
                                        )
                                    }
                                </Typography>
                            </RowContainer>
                            <RowContainer>
                                <Typography color={'primary.main'} fontWeight={300}>Internet</Typography>
                                <InternetIndicator/>
                            </RowContainer>
                        </GridItemEl>
                        <GridItemEl text='Wazigate Identity' icon='fingerprint'>
                            <RowContainer>
                                <Typography sx={{textAlign:'left',color:DEFAULT_COLORS.navbar_dark,fontWeight:300}}>
                                    Wazigate ID
                                </Typography>
                                <Typography textTransform='uppercase' component={'span'}>{wazigateId}</Typography> 
                            </RowContainer>
                            <RowContainer>
                                <Typography sx={{textAlign:'left',color:DEFAULT_COLORS.navbar_dark,fontWeight:300}}>
                                    Version
                                </Typography>
                                <Typography component='span'>3.0.0 (build number: {buildNr})</Typography> 
                            </RowContainer>
                        </GridItemEl>
                        <GridItemEl text='Gateway Power' icon='power_settings_new'>
                            <RowContainerNormal additionStyles={{ m: 1, borderRadius: 1, pb: matches?1:2 }}>
                                <Button onClick={shutdownHandler} variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<PowerSettingsNew />}>
                                    Shutdown
                                </Button>
                                <Button onClick={rebootHandler} variant="contained" sx={{ mx: 1, fontWeight: 'bold', bgcolor: 'info.main' }} startIcon={<RestartAlt />}>
                                    Restart
                                </Button>
                            </RowContainerNormal>
                        </GridItemEl>
                    </GridItem>
                    <GridItem additionStyles={{borderRadius:2}} bgcolor md={12} xs={12} matches={matches} >
                        <Box sx={{ display: 'flex', borderTopLeftRadius: 5,border:'.5px solid #d8d8d8', borderTopRightRadius: 5, bgcolor: '#F7F7F7', alignItems: 'center' }} p={1} >
                            <AccessTime sx={IconStyle} />
                            <Typography color={'#212529'} fontWeight={500}>Time Settings</Typography>
                        </Box>
                        <Box my={2}>
                            <RowContainer>
                                <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>Local Time</Typography>
                                {
                                    currentTime?(
                                        <Typography textTransform='uppercase' mr={1} color={DEFAULT_COLORS.primary_black}>{currentTime}</Typography>    
                                    ): <CircularProgress size={10} sx={{fontSize:10, }} />
                                }
                            </RowContainer>
                            <RowContainer>
                                <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>Time Zone</Typography>
                                <Typography color={DEFAULT_COLORS.primary_black} fontSize={14}>
                                    {
                                        data?(
                                            data.zone
                                        ):(
                                            <CircularProgress size={10} sx={{fontSize:10, }} />
                                        )
                                    }
                                </Typography>
                            </RowContainer>
                            <Box borderRadius={1} p={1} m={1}>
                                
                                {
                                    isSetTimezoneAuto?(null):(
                                        <Box minWidth={120} display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} my={.5}>
                                            <Typography  fontSize={14} fontWeight={'300'} color={'#292F3F'}>Set TimeZone</Typography>
                                            <Button disabled={(data && data.zone)?false:true} onClick={()=>{setModalProps({open:true,title:'Changing Timezone',})}} color='info'>CHANGE</Button>
                                        </Box>
                                    )
                                }
                            </Box>
                            <Box borderRadius={1} p={1} m={1}>
                                <RowContainerBetween additionStyles={{ }}>
                                    <Typography color={DEFAULT_COLORS.navbar_dark} fontSize={14} fontWeight={300}>Set time and date manually</Typography>
                                    <Button disabled={(data && data.time)?false:true} onClick={()=>{setModalProps({open:true,title:'Changing Time and date'})}} color='info'>CHANGE</Button>
                                </RowContainerBetween>
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </>
    );
}

export default Settings;