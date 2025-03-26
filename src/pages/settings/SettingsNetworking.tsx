import { Box, Breadcrumbs, ListItemText, Grid, Icon, Typography, CircularProgress, Grow, LinearProgress,Button,  Input, Divider, Alert } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import RowContainerNormal from "../../components/shared/RowContainerNormal";
import { ChangeCircleSharp } from "@mui/icons-material";
import { Android12Switch } from "../../components/shared/Switch";
// import PrimaryButton from "../../components/shared/PrimaryButton";
import { getWiFiScan, setConf as setConfFc, AccessPoint, getConf, setWiFiConnect, WifiReq, setAPMode, setAPInfo } from "../../utils/systemapi";
import React, { useContext, useEffect, useMemo, useState } from "react";
import GridItemEl from "../../components/shared/GridItemElement";
import { Cloud } from "waziup";
import MenuComponent from "../../components/shared/MenuDropDown";
import { DevicesContext } from "../../context/devices.context";
import Backdrop from "../../components/Backdrop";
import WaziLogo from '../../assets/wazilogo.svg';
import { nameForState, orderAccessPointsByStrength } from "../../utils";
import SnackbarComponent from "../../components/shared/Snackbar";
import { InputField } from "../Login";

export default function SettingsNetworking() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const [scanLoading, setScanLoading] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<AccessPoint[]>([]);
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    const [selectedWifi, setSelectedWifi] = useState<AccessPoint & { password?: string } | undefined>(undefined);
    const { networkDevices, selectedCloud, setNetWorkDevices, setSelectedCloud, showDialog } = useContext(DevicesContext)
    const scan = () => {
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
    const [conf, setConf] = useState<{ rfan_trigger_temp: number | undefined,  fan_trigger_temp: number | undefined, oled_halt_timeout: number | undefined,roled_halt_timeout: number | undefined }>({
        fan_trigger_temp: undefined,
        rfan_trigger_temp: undefined,
        oled_halt_timeout: undefined,
        roled_halt_timeout: undefined
    });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setSelectedCloud({
            ...selectedCloud,
            [name]: value
        } as Cloud);
        sethasUnsavedChanges(true);
    };
    const handleRenameClick = () => {
        const oldName = selectedCloud?.name || selectedCloud?.id;
        const newCloudName = prompt("New cloud name:", oldName);
        if (newCloudName) {
            setSelectedCloud({
                ...selectedCloud,
                name: newCloudName
            } as Cloud);
            window.wazigate.set(`clouds/${selectedCloud?.id}/name`, newCloudName).then(() => {
                // OK
            }, (err) => {
                setError({
                    message: "Cannot change cloud name:\n " + err,
                    severity: 'warning'
                });
                setSelectedCloud({
                    ...selectedCloud,
                    name: oldName
                } as Cloud);
            })
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
                    showDialog({
                        title: "Error encountered",
                        content: err && err.message ? err.message : err as string,
                        acceptBtnTitle: "CLOSE",
                        hideCloseButton: true,
                        onAccept: () => { },
                        onCancel: () => { },
                    });
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
        await window.wazigate.setCloudPaused(selectedCloud?.id as string, !checked)
            .then(async () => {
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
            })
            .catch((err) => {
                setSaving(false);
                showDialog({
                    title: "Error encountered",
                    content: err,
                    acceptBtnTitle: "CLOSE",
                    hideCloseButton: true,
                    onAccept: () => { },
                    onCancel: () => { },
                });
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
        })
            .catch((err) => {
                showDialog({
                    title: "Error encountered",
                    content: err,
                    acceptBtnTitle: "CLOSE",
                    hideCloseButton: true,
                    onAccept: () => { },
                    onCancel: () => { },
                });
            });
    };
    const switchToAPMode = () => {
        showDialog({
            title: "Switch AP mode",
            content: 'Are you sure you want to switch to AP Mode?',
            acceptBtnTitle: "SWITCH",
            onAccept: () => {
                setAPMode().then(() => {
                    setError({
                        message: "Switched to AP Mode\n ",
                        severity: 'success'
                    });
                })
                    .catch((error) => {
                        setError({
                            message: error,
                            severity: 'error'
                        });
                    });
            },
            onCancel: () => { },
        });
    };
    const fcInit = () => {
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
    }
    useEffect(() => {
        fcInit();
    }, []);
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const data: WifiReq = {
            ssid: selectedWifi?.ssid as string,
            password: selectedWifi?.password,
            autoConnect: true
        }
        setScanLoading(true)
        setWiFiConnect(data).then(() => {
            setScanLoading(false)
            setSelectedWifi(undefined);
            setLoading(true);
        })
            .catch((error) => {
                setLoading(false)
                setScanLoading(false)
                showDialog({
                    title: "Error encountered",
                    content: error,
                    acceptBtnTitle: "CLOSE",
                    hideCloseButton: true,
                    onAccept: () => { },
                    onCancel: () => { },
                });
            });
    };
    const submitSSID = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formEl = document.getElementById('submitform') as HTMLFormElement;
        const data = {
            SSID: formEl.SSID.value,
            password: formEl.password.value,
        }
        showDialog({
            title: "Access point settings",
            content: 'Are you sure you want to change the Access Point settings?',
            acceptBtnTitle: "OK",
            onAccept: () => {
                setAPInfo(data)
                    .then((msg) => {
                        setError({
                            message: "Success: \n " + msg,
                            severity: 'success'
                        });
                    }).catch((error) => {
                        setError({
                            message: error,
                            severity: 'warning'
                        });
                    });
            },
            onCancel: () => { },
        });
    };
    useEffect(() => {
        scan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [apConn, eth0, accessName, stateName] = useMemo(() => {
        const accessName = networkDevices.wlan0 ? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === "WAZIGATE-AP") : null
        const apCn = networkDevices?.wlan0 ? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId) : null
        const eth0 = networkDevices?.eth0;
        const stateName = networkDevices.wlan0 ? nameForState(networkDevices.wlan0.State) : ''
        return [apCn, eth0, accessName, stateName];
    }, [networkDevices]);


    const [expandedWifi, setExpandedWifi] = useState<string | null>(null);

    const handleWifiClick = (wifi: AccessPoint) => {
        setSelectedWifi(wifi);
        setExpandedWifi(prev => (prev === wifi.hwAddress ? null : wifi.hwAddress)); // Toggle expand
    };
    return (
        <>
            {
                error ? (
                    <SnackbarComponent
                        autoHideDuration={5000}
                        severity={error.severity}
                        message={(error.message as Error).message ? (error.message as Error).message : (error.message as string)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    />
                ) : null
            }
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
                                <MenuComponent
                                    open={false}
                                    menuItems={[
                                        {
                                            text: 'Rename',
                                            icon: 'edit',
                                            clickHandler: handleRenameClick
                                        }
                                    ]}
                                />
                            </RowContainerBetween>

                            {/* Cloud Information box */}
                            <Box px={2}>
                                <RowContainerNormal additionStyles={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography >Active Sync</Typography>
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
                                        name="password"
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
                                    onClick={handleSaveClick}
                                // startIcon={<Icon sx={{ fontSize: 20, mr: 1 }}>save</Icon>}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </GridItemEl>

                        <GridItemEl text={'Access Point Settings'} icon={'key'}>
                            <Box sx={{ display: 'flex', flexDirection: matches ? 'row' : 'column', alignItems: 'center' }}>
                                <Box width={'100%'} borderRadius={1} p={2} m={1}>
                                    <form id="submitform" onSubmit={submitSSID}>

                                        <InputField label="Access Point SSID" mendatory>
                                            <Input
                                                id="SSID"
                                                fullWidth
                                                placeholder="Enter SSID"
                                                name="SSID"
                                                value={accessName ? atob(accessName["802-11-wireless"]?.ssid as string) : ""}
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
                                                sx={{
                                                    borderBottom: '1px solid #D5D6D8',
                                                    '&:before, &:after': { borderBottom: 'none' }
                                                }}
                                            />
                                        </InputField>
                                        <Button sx={{ mt: 2 }} fullWidth color="secondary" variant="contained" type="submit">Save Changes</Button>
                                    </form>

                                    <Divider sx={{ my: 4 }} />

                                    <Box display='flex' flexDirection='column' gap={1}>
                                        <Alert severity="warning">Connect to Wazigate Hotspot after pressing the button to manage your gateway over WiFi.</Alert>
                                        <Button title="Switch" onClick={switchToAPMode} variant="outlined" color="secondary" startIcon={<ChangeCircleSharp />}>Switch</Button>
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
                            <Box p={1}>
                                <Icon color="info">{'signal_wifi_4_bar_outlined'} </Icon>
                                <Typography>
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
                            </Box>
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
