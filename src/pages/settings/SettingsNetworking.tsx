import { Box, Breadcrumbs, ListItemText, Grid, Icon, Theme, Typography, CircularProgress, Grow, LinearProgress,Button,  Input, Alert, Snackbar, Divider, useMediaQuery, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import RowContainerNormal from "../../components/shared/RowContainerNormal";
import { ChangeCircleSharp } from "@mui/icons-material";
import { Android12Switch } from "../../components/shared/Switch";
// import PrimaryButton from "../../components/shared/PrimaryButton";
import { getWiFiScan, setConf as setConfFc, AccessPoint, getConf, setWiFiConnect, WifiReq, setAPMode,setAPInfo, removeWifi } from "../../utils/systemapi";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import GridItemEl from "../../components/shared/GridItemElement";
import { Cloud } from "waziup";
import Backdrop from "../../components/Backdrop";
import WaziLogo from '../../assets/wazilogo.svg';
import { nameForState, orderAccessPointsByStrength } from "../../utils";
import { InputField } from "../Login";
import { SettingsContext } from "../../context/settings.context";
import { GlobalContext } from "../../context/global.context";

export default function SettingsNetworking() {

    const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
    const [scanLoading, setScanLoading] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<AccessPoint[]>([]);
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    const [selectedWifi, setSelectedWifi] = useState<AccessPoint & { password?: string } | undefined>(undefined);
    const { showDialog } = useContext(GlobalContext)
    const { networkDevices, selectedCloud, setNetWorkDevices, setSelectedCloud } = useContext(SettingsContext)
    const [rSelectedCloud,setRSelectedCloud]=useState<Cloud | null>(null)
    const scan = () => {
        if (!networkDevices) {
            setNetWorkDevices()
        }
        setScanLoading(true);
        getWiFiScan()
            .then((res) => {
                setScanLoading(false);
                const orderedAccessPoints = orderAccessPointsByStrength(res).filter((i)=>i.ssid !== (apConn? atob(apConn["802-11-wireless"]?.ssid as string):''))
                setWifiList(orderedAccessPoints);
            }).catch((err) => {
                setError({
                    message: err,
                    severity: 'error'
                });
                setScanLoading(false);
            });
    }
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);
    const [accessPointInfo,setAccessPointInfo] = useState<{password: string,name:string}| null>(null)
    const [conf, setConf] = useState<{ rfan_trigger_temp: number | undefined,  fan_trigger_temp: number | undefined, oled_halt_timeout: number | undefined,roled_halt_timeout: number | undefined }>({
        fan_trigger_temp: undefined,
        rfan_trigger_temp: undefined,
        oled_halt_timeout: undefined,
        roled_halt_timeout: undefined
    });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("===========I was called=========")
        const name = event.target.name;
        const value = event.target.value;
        if(selectedCloud?.paused === false){
            setError({
                severity:"error",
                message:"Cannot change values when Sync is active, disable it"
            })
            return;
        }
        setSelectedCloud({
            ...selectedCloud,
            [name]: value
        } as Cloud);
        sethasUnsavedChanges(true);
    };
    const handleSaveClickConfirm =async ()=>{
        console.log(rSelectedCloud)
        console.log(selectedCloud)
        if (rSelectedCloud?.username !==selectedCloud?.username || rSelectedCloud?.token !== selectedCloud?.token) {
            showDialog({
                title: "Change Sync details",
                content: (
                    <Box>
                        <Alert icon={<></>} severity="warning">
                            <pre>
                                It seems that you are changing the WaziCloud Sync account details. {"\n"}
                                Be careful, the WaziGate will NOT change the owner of the devices and gateway{"\n"}
                                instances that have been created on the WaziCloud.{"\n"}
                                They still belong to the previous account owner!{"\n"}
                                If you want to use a new WaziCloud account on this gateway{"\n"}
                                You need to either:{"\n"}
                                1. Logging with the old account on the WaziCloud and{"\n"} 
                                delete devices and gateways instances{"\n"}
                                2. OR contact an admin{"\n"} 
                                (who will delete the devices and gateways instances on the WaziCloud).{"\n"}
                                After this, the WaziGate will recreate the new devices{"\n"} 
                                and gateway instances on the WaziCloud under your account.{"\n"}
                            </pre>
                        </Alert>

                    </Box>
                ),
                acceptBtnTitle: "EDIT",
                onAccept: async ()=>{
                    await handleSaveClick();
                },
                onCancel: () => { },
            });
        } else{
            await handleSaveClick()
        }
    }
    const handleSaveClick = async () => {
        if (hasUnsavedChanges) {
            setLoading(true);
            await Promise.all([
                await window.wazigate.set(`clouds/${selectedCloud?.id as string}/rest`, selectedCloud?.rest)
                    .catch((err: Error) => {
                        setError({
                            message: "Error saving REST address:\n " + err,
                            severity: 'error'
                        });
                        return
                    }),
                await window.wazigate.set(`clouds/${selectedCloud?.id}/mqtt`, selectedCloud?.mqtt)
                    .catch((err: Error) => {
                        setError({
                            message: "Error saving MQTT address:\n " + err,
                            severity: 'error'
                        });
                        return
                    }),
                await window.wazigate.setCloudCredentials(selectedCloud?.id as string, selectedCloud?.username as string, selectedCloud?.token as string).catch((err: Error) => {
                    setError({
                        message: "Error saving credentials:\n " + err,
                        severity: 'error'
                    });
                    return
                }),
            ]).then(() => {
                sethasUnsavedChanges(false);
                setLoading(false);
                showDialog({
                    title: "Success",
                    content: "Changes saved successfully!",
                    acceptBtnTitle: "CLOSE",
                    hideCloseButton: true,
                    onAccept: () => { },
                    onCancel: () => { },
                });
            })
                .catch((err) => {
                    setError({message: err && err.message ? err.message : err as string,severity:"error"})
                    setLoading(false);
                });
        } else {
            showDialog({
                title: "No change",
                content: "No changes made",
                acceptBtnTitle: "CLOSE",
                hideCloseButton: true,
                onAccept: () => { },
                onCancel: () => { },
            });
        }
    }
    const handleEnabledChange = async (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (hasUnsavedChanges) {
            showDialog({
                title: "Warning",
                content: "Save all changes before activating the synchronization!",
                acceptBtnTitle: "OK",
                hideCloseButton: true,
                onAccept: () => { },
                onCancel: () => { },
            });
            return
        }
        setSaving(true);
        const timer = new Promise(resolve => setTimeout(resolve, 2000));
        await window.wazigate.setCloudPaused(selectedCloud?.id as string, !checked).then(async () => {
            showDialog({
                title: "Success",
                content: `Sync ${checked ? 'activated' : 'deactivated'}.`,
                acceptBtnTitle: "CLOSE",
                hideCloseButton: true,
                onAccept: () => { },
                onCancel: () => { },
            });
            setNetWorkDevices()
            timer.then(() => {
                setSaving(false);
            })
        }).catch((err) => {
            setSaving(false);
            setError({message: err && err.message ? err.message : err as string,severity:"error"});
        });
    }
    const submitConf = (event: React.FormEvent) => {
        event.preventDefault();
        const data = {
            fan_trigger_temp: conf.fan_trigger_temp as number,
            oled_halt_timeout: conf.oled_halt_timeout as number
        };
        setConfFc(data).then(() => {
            showDialog({
                title: "Success",
                content: "Settings saved",
                acceptBtnTitle: "CLOSE",
                hideCloseButton: true,
                onAccept: () => { },
                onCancel: () => { },
            });
        }).catch((err) => {
            setError({message:'Error encountered '+ err && err.message ? err.message : err as string,severity:"error"})
        });
    };
    
    const switchToAPMode = () => {
        showDialog({
            title: "Activating Hotspot",
            content:(
                <Alert icon={<></>} severity="warning">
                    <pre>
                        IF YOU'RE CONNECTED TO ACCESS POINT YOU WILL LOOSE CONNECTION.
                    </pre>
                </Alert>
            ),
            acceptBtnTitle: "SWITCH",
            onAccept: () => {
                setAPMode().then(() => {
                    setError({
                        message: "Switched to AP Mode\n ",
                        severity: 'success'
                    });
                }).catch((error) => {
                    setError({
                        message: error,
                        severity: 'error'
                    });
                });
            },
            onCancel: () => { },
        });
    };
    const fcInit =useCallback(() => {
        getConf().then((cf) => {
            setConf({
                ...cf,
                rfan_trigger_temp: cf?.fan_trigger_temp,
                roled_halt_timeout: cf?.oled_halt_timeout
            });
        }).catch((err) => {
            setError({
                message: err,
                severity: 'error'
            });
            setConf({
                fan_trigger_temp: undefined,
                oled_halt_timeout: undefined,
                rfan_trigger_temp: undefined,
                roled_halt_timeout: undefined
            });
        });
        setRSelectedCloud(selectedCloud)
    },[selectedCloud]);
    useEffect(() => {
        fcInit();
    }, [fcInit]);
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        showDialog({
            title: "Connecting to wifi ",
            content: (
                <Alert icon={<></>} severity="warning">
                    <pre>
                        If you connect to this wifi you will loose connection
                    </pre>
                </Alert>
            ),
            acceptBtnTitle: "CONNECT",
            onAccept: ()=>{
                const data: WifiReq = {
                    ssid: selectedWifi?.ssid as string,
                    password: selectedWifi?.password,
                    autoConnect: true
                }
                setScanLoading(true)
                setLoading(true);
                setWiFiConnect(data).then(() => {
                    setError({message:"You can now close this page and connect to your wifi then access this interface at wazigate.local. If the password was wrong, it will still open the access point, reconnect to it and enter a correct password.",severity:"success"})
                    setScanLoading(false)
                    setSelectedWifi(undefined);
                    setLoading(false);
                }).catch((error) => {
                    setLoading(false)
                    setScanLoading(false)
                    setError({message: 'Error encountered'+error && error.message ? error.message : error as string,severity:"error"})
                });
            },
            onCancel: () => { 
                setExpandedWifi(null)
                setSelectedWifi(undefined);
            },
        });
    }
    const forget = (wifiSSID: string) => {
        showDialog({
            title: `Forget ${wifiSSID}?`,
            content: (
                <Alert icon={<></>} severity="warning">
                    <pre>
                    ARE YOU SURE YOU WANT TO FORGET {wifiSSID.toUpperCase()}? {'\n'}
                    IF YOU PROCEED, YOU WILL LOOSE CONNECTION {`\n`}
                    </pre>
                </Alert>
            ),
            acceptBtnTitle: "FORGET",
            onAccept: ()=>{
                setScanLoading(true)
                setLoading(true);
                removeWifi(wifiSSID).then(() => {
                    setError({message:"You can now close this page and connect to your wifi then access this interface at wazigate.local. If the password was wrong, it will still open the access point, reconnect to it and enter a correct password.",severity:"success"})
                    setScanLoading(false)
                    setLoading(false);
                }).catch((error) => {
                    setLoading(false)
                    setScanLoading(false)
                    setError({message: 'Error encountered'+error && error.message ? error.message : error as string,severity:"error"})
                });
            },
            onCancel: () => { 
                setExpandedWifi(null)
                setSelectedWifi(undefined);
            },
        });
    }
    const submitSSID = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = {
            ssid: accessPointInfo?.name,
            password: accessPointInfo?.password
        }
        showDialog({
            title: "Access point settings",
            content: 'Are you sure you want to change the Access Point settings?',
            acceptBtnTitle: "OK",
            onAccept:async  () => {
                setAPInfo(data).then(()=>{
                    setError({
                        message: "Successfully configured",
                        severity: 'success'
                    });
                    setNetWorkDevices()
                }).catch((error) => {
                    setError({
                        message: error,
                        severity: 'warning'
                    });
                });
                setAccessPointInfo(null)
            },
            onCancel: () => { },
        });
    };
    useEffect(() => {
        scan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [apConn, eth0, stateName] = useMemo(() => {
        const accessName = networkDevices.wlan0 ? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === "WAZIGATE-AP") : null
        console.log(accessName)
        console.log(networkDevices.wlan0 && networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === "WAZIGATE-AP"))
        if(accessName){
            setAccessPointInfo({
                ...accessPointInfo,
                name: accessName ? atob(accessName["802-11-wireless"]?.ssid as string) : "",
                password: accessPointInfo?.password || ""
            })
        }
        const apCn = networkDevices?.wlan0 ? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId) : null
        const eth0 = networkDevices?.eth0;
        const stateName = networkDevices.wlan0 ? nameForState(networkDevices.wlan0.State) : ''
        return [apCn, eth0, stateName];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [networkDevices]);


    const [expandedWifi, setExpandedWifi] = useState<string | null>(null);

    const handleWifiClick = (wifi: AccessPoint) => {
        setSelectedWifi(wifi);
        setExpandedWifi(prev => (prev === wifi.hwAddress ? null : wifi.hwAddress)); // Toggle expand
    };
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={error !==null} autoHideDuration={5000} onClose={()=>setError(null)}>
                <Alert onClose={()=>setError(null)} severity={error ? error.severity:'info'} sx={{ width: '100%' }}>
                    {error?error.message as string:''}
                </Alert>
            </Snackbar>
            
            {
                loading ? (
                    <Backdrop>
                        <CircularProgress color="info" size={70} />
                    </Backdrop>
                ) : null
            }
            <Box sx={{ px: matches ? 4 : 2, py: [0, 2],}} >
                <Box>
                    <Typography typography='h5'>Networks</Typography>
                    <Box role="presentation" >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                <Link style={{ color: 'black', textDecoration: 'none', fontWeight: '300', fontSize: 16 }} state={{ title: 'Devices' }} color="inherit" to="/settings">
                                    Settings
                                </Link>
                            </Typography>
                            <Typography style={{ textDecoration: 'none', fontWeight: 300,  }} color="text.primary">
                                Networks
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                </Box>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} lg={6}>
                        <GridItemEl text={selectedCloud?.name as string} icon={'cloud'} additionStyles={{ paddingBottom: 2 }} >
                            <Grow in={saving}>
                                <LinearProgress />
                            </Grow>
                            <RowContainerBetween additionStyles={{ pr: 1, borderBottom: '1px solid #ccc' }}>
                                <RowContainerNormal>
                                    <Box component={'img'} src={WaziLogo} ml={2} mr={1} />
                                    <Box>
                                        <ListItemText
                                            primary={selectedCloud?.name || selectedCloud?.id}
                                            secondary={``}
                                        />
                                    </Box>
                                </RowContainerNormal>
                            </RowContainerBetween>

                            {/* Cloud Information box */}
                            <Box px={2}>
                                <RowContainerNormal additionStyles={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography>Sync {selectedCloud?.paused?"Inactive":"Active"}</Typography>
                                    <Android12Switch
                                        sx={{ m: 0 }}
                                        checked={!selectedCloud?.paused}
                                        onChange={handleEnabledChange}
                                        color="secondary"
                                    />
                                </RowContainerNormal>

                                <InputField label="REST Address" mendatory>
                                    <Input
                                        fullWidth
                                        placeholder="Enter REST address"
                                        name="rest"
                                        onInput={handleInputChange}
                                        value={selectedCloud?.rest}
                                        required
                                        sx={{
                                            borderBottom: '1px solid #D5D6D8',
                                            '&:before, &:after': { borderBottom: 'none' }
                                        }}
                                    />
                                </InputField>
                                <InputField label="MQTT Address" mendatory>
                                    <Input
                                        fullWidth
                                        placeholder="Enter MQTT address"
                                        name="mqtt"
                                        onInput={handleInputChange}
                                        value={selectedCloud?.mqtt}
                                        required
                                        sx={{
                                            borderBottom: '1px solid #D5D6D8',
                                            '&:before, &:after': { borderBottom: 'none' }
                                        }}
                                    />
                                </InputField>
                                <InputField label="User Name">
                                    <Input
                                        fullWidth
                                        placeholder="Enter user name"
                                        name="username"
                                        onInput={handleInputChange}
                                        value={selectedCloud?.username}
                                        sx={{
                                            borderBottom: '1px solid #D5D6D8',
                                            '&:before, &:after': { borderBottom: 'none' }
                                        }}
                                    />
                                </InputField>
                                <InputField label="Password">
                                    <Input
                                        placeholder="****"
                                        name="token"
                                        type="password"
                                        fullWidth
                                        
                                        onInput={handleInputChange}
                                        value={selectedCloud?.token}
                                        sx={{
                                            borderBottom: '1px solid #D5D6D8',
                                            '&:before, &:after': { borderBottom: 'none' }
                                        }}
                                    />
                                </InputField>

                                <Button
                                    sx={{ mt: 2 }}
                                    fullWidth
                                    disabled={!hasUnsavedChanges}
                                    color="secondary"
                                    variant="contained"
                                    onClick={handleSaveClickConfirm}
                                // startIcon={<Icon sx={{ fontSize: 20, mr: 1 }}>save</Icon>}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </GridItemEl>

                        <GridItemEl text={'Access Point Settings'} icon={'key'}>
                            <Box sx={{ display: 'flex', flexDirection: matches ? 'row' : 'column', alignItems: 'center' }}>
                                <Box width={'100%'} borderRadius={1} p={2} m={1}>
                                    <form  onSubmit={submitSSID}>

                                        <InputField label="Access Point SSID" mendatory>
                                            <Input
                                                id="SSID"
                                                fullWidth
                                                placeholder="Enter SSID"
                                                name="SSID"
                                                value={accessPointInfo?.name}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{setAccessPointInfo({name:e.target.value, password: accessPointInfo?.password || ""})}}
                                                sx={{
                                                    borderBottom: '1px solid #D5D6D8',
                                                    '&:before, &:after': { borderBottom: 'none' }
                                                }}
                                            />
                                        </InputField>

                                        <InputField label="Access Point Password" mendatory>
                                            <Input
                                                id="password"
                                                placeholder="Enter password"
                                                name="password"
                                                fullWidth
                                                value={accessPointInfo?.password}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{setAccessPointInfo({name: accessPointInfo?.name || "", password: e.target.value})}}
                                                sx={{
                                                    borderBottom: '1px solid #D5D6D8',
                                                    '&:before, &:after': { borderBottom: 'none' }
                                                }}
                                            />
                                        </InputField>
                                        <Button sx={{ mt: 2 }} fullWidth color="secondary" variant="contained" type="submit">Save Changes</Button>
                                    </form>
                                    <Divider sx={{my:4}} />
                                    <Box display='flex' flexDirection='column' gap={1}>
                                        <Alert severity="warning">Activate the WaziGate Hotspot in order to connect to your gateway</Alert>
                                        <Button title="Switch" onClick={switchToAPMode} variant="outlined" color="secondary" startIcon={<ChangeCircleSharp />}>ACTIVATE HOTSPOT</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </GridItemEl>

                        <GridItemEl text={'Misc. Settings'} icon={'settings_outlined'}>
                            <Box p={2}>
                                <form onSubmit={submitConf}>
                                    <InputField label="Fan Trigger Temperature (C)">
                                        {/* <ModeFanOffOutlined sx={{ fontSize: 20, mx: 1 }} /> */}
                                        <Input
                                            placeholder="Enter temperature in Celsius"
                                            name="fan"
                                            fullWidth
                                            type="number"
                                            onInput={(e) => {
                                                setConf({
                                                    ...conf,
                                                    fan_trigger_temp: parseFloat((e.target as HTMLInputElement).value)
                                                })
                                            }}
                                            value={conf ? (conf?.fan_trigger_temp as unknown as string) : "Loading..."}
                                            sx={{
                                                borderBottom: '1px solid #D5D6D8',
                                                '&:before, &:after': { borderBottom: 'none' }
                                            }}
                                        />
                                    </InputField>

                                    <InputField label="Fan Trigger Temperature (C)">
                                        {/* <DesktopWindowsOutlined sx={{ fontSize: 20, mx: 1 }} /> */}
                                        <Input
                                            placeholder="OLED halt timeout (seconds)"
                                            name="oled"
                                            fullWidth
                                            type="number"
                                            onInput={(e) => {
                                                setConf({
                                                    ...conf,
                                                    oled_halt_timeout: parseFloat((e.target as HTMLInputElement).value)
                                                })
                                            }}
                                            value={conf ? (conf?.oled_halt_timeout as unknown as string) : "Loading..."}
                                            sx={{
                                                borderBottom: '1px solid #D5D6D8',
                                                '&:before, &:after': { borderBottom: 'none' }
                                            }}
                                        />
                                    </InputField>

                                    <Button sx={{ mt: 2 }} disabled={!(conf?.fan_trigger_temp !== conf?.rfan_trigger_temp || conf?.oled_halt_timeout !== conf.roled_halt_timeout)} fullWidth color="secondary" variant="contained" type="submit">Save Changes</Button>
                                </form>
                            </Box>
                        </GridItemEl>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        

                        <GridItemEl text='Available Wifi Connections' icon={'cell_tower'}>
                            {/* <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, border: '.5px solid #d8d8d8', bgcolor: '#f7f7f7', alignItems: 'center' }} p={1} >
                                <WifiOutlined sx={IconStyle} />
                                <Typography color={'#212529'} fontWeight={500}>Available Wifi</Typography>
                            </Box> */}
                            <Stack direction={'row'} borderBottom={'1px solid #ccc'} px={2} alignItems='center'>
                                <RowContainerNormal >
                                    <Icon color="info">{'signal_wifi_4_bar_outlined'}</Icon>
                                    <Typography ml={1}>
                                        {
                                            (apConn && apConn.connection.id === 'WAZIGATE-AP') ? (
                                                <Typography>{stateName} - Access Point Mode</Typography>
                                            ) : (apConn) ? (
                                                <Typography>Connected to {"  "}
                                                    {
                                                        apConn ? atob(apConn["802-11-wireless"]?.ssid as string) : "No network"
                                                    }
                                                </Typography>
                                            ) : (eth0 && eth0.IP4Config) ? (
                                                <Typography>Connected to Ethernet</Typography>
                                            ) : (<Typography>Not connected </Typography>)
                                        }
                                    </Typography>
                                </RowContainerNormal>
                                {
                                    (apConn && apConn.connection.id !== 'WAZIGATE-AP')? (
                                        <Button onClick={()=>{forget(apConn ? atob(apConn["802-11-wireless"]?.ssid as string) : "No network")}} variant={'text'}>Forget</Button>
                                    ):null
                                }
                            </Stack>
                            <Box sx={{}}>
                                <Box sx={{ overflowY: 'auto', height: 380 }}>
                                    {scanLoading ? (
                                        <Box
                                            sx={{
                                                mx: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                            }}
                                        >
                                            <Typography>Checking for available networks</Typography>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        wifiList.map((wifi,idx) => (

                                            <Box
                                                key={idx}
                                                
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Box
                                                    sx={{
                                                        bgcolor: selectedWifi?.hwAddress === wifi.hwAddress ? '#e8f0fd' : '',
                                                        ":hover": { bgcolor: '#e8f0fd' },
                                                        // borderBottom: '1px solid #ccc',
                                                        p: 1,
                                                        pl: 2,
                                                    }}
                                                >
                                                    <Box onClick={() => handleWifiClick(wifi)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography color='black'>{wifi.ssid}</Typography>
                                                            {wifi.freq >= 6000 ? (
                                                                <Typography sx={{ fontWeight: '600', mx: 2, color: 'blue' }}>6Ghz</Typography>
                                                            ) : wifi.freq >= 5000 ? (
                                                                <Typography sx={{ fontWeight: '600', mx: 2, color: 'blue' }}>5Ghz</Typography>
                                                            ) : null}
                                                        </Box>

                                                        <Icon sx={{ opacity: wifi.strength / 100 }}>
                                                            {wifi.strength > 80
                                                                ? 'signal_wifi_4_bar_outlined'
                                                                : wifi.strength > 60
                                                                    ? 'network_wifi_outlined'
                                                                    : wifi.strength > 40
                                                                        ? 'network_wifi_3_bar_outlined'
                                                                        : wifi.strength > 20
                                                                            ? 'network_wifi_2_bar_outlined'
                                                                            : wifi.strength > 0
                                                                                ? 'network_wifi_1_bar_outlined'
                                                                                : 'signal_wifi_0_bar_outlined'}
                                                        </Icon>
                                                    </Box>

                                                    {/* Expanded Section */}
                                                    {expandedWifi === wifi.hwAddress && (
                                                        <Box sx={{ mt: 1, borderRadius: 1 }}>
                                                            <Box display='flex' flexDirection='column' alignItems='flex-start'>
                                                                <Typography variant="body2">strength: {wifi.strength}%</Typography>
                                                                <Typography variant="body2">Max bit-rate: {wifi.maxBitrate}</Typography>

                                                                <Box sx={{ mt: 1, }}>
                                                                    <form onSubmit={submitHandler}>
                                                                        <InputField label="Access Point Password" mendatory>
                                                                            <Input
                                                                                id="password"
                                                                                placeholder="Enter password"
                                                                                name="password"
                                                                                fullWidth
                                                                                sx={{
                                                                                    borderBottom: '1px solid #D5D6D8',
                                                                                    '&:before, &:after': { borderBottom: 'none' },
                                                                                    fontSize: 16
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    setSelectedWifi({
                                                                                        ...selectedWifi as AccessPoint,
                                                                                        password: e.target.value
                                                                                    }) as unknown as AccessPoint;
                                                                                }}
                                                                            />
                                                                        </InputField>
                                                                        {/* <TextInputField
                                                                            icon={<LockOutlined sx={{ fontSize: 20, mx: 1 }} />}
                                                                            onChange={(e) => {
                                                                                setSelectedWifi({
                                                                                    ...selectedWifi as AccessPoint,
                                                                                    password: e.target.value
                                                                                }) as unknown as AccessPoint;
                                                                            }}
                                                                            label="Access Point Password"
                                                                            placeholder="Enter password"
                                                                            name="password"
                                                                        /> */}
                                                                        <Button variant="contained" size="small" disableElevation color="secondary" type="submit" sx={{mt:1}}>Connect</Button>
                                                                    </form>
                                                                </Box>
                                                            </Box>
                                                            {/* <Box display={'flex'} justifyContent={'flex-end'}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    size="small"
                                                                    disableElevation
                                                                    sx={{ mt: 1 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Prevent toggling when clicking Connect
                                                                        console.log(`Connecting to ${wifi.ssid}`);
                                                                    }}
                                                                >
                                                                    Connect
                                                                </Button>
                                                            </Box> */}
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            </Box>

                        </GridItemEl>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
