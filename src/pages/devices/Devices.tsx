import { Box, Grid, CardContent, Typography, SelectChangeEvent, Breadcrumbs, Snackbar, Alert } from '@mui/material';
import RowContainerBetween from '../../components/shared/RowContainerBetween';
import { DEFAULT_COLORS } from '../../constants';
import { Link, useNavigate, useOutletContext, } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { type Device } from 'waziup';
import { DevicesContext, SensorX } from '../../context/devices.context';
import { devEUIGenerateFc,  lineClamp, time_ago, } from '../../utils';
import PrimaryIconButton from '../../components/shared/PrimaryIconButton';
import SensorActuatorInfo from '../../components/shared/SensorActuatorInfo';
import MenuDropDown from '../../components/shared/MenuDropDown';
import RowContainerNormal from '../../components/shared/RowContainerNormal';
import DeviceImage from '../../assets/device.png';
import EditeCreateDeviceDialog from '../../components/ui/EditCreateDeviceDialog';

const SortOptions = [
    { id: '1', name: 'Date Created' },
    { id: '2', name: 'Name' },
    { id: '3', name: 'Modified' },
    { id: '4', name: 'Latest' },
];

const initialNewDevice: Device = {
    actuators: [],
    created: new Date(),
    id: '',
    meta: {
        type: '',
        codec: '',
        lorawan: null,
    },
    modified: new Date(),
    name: '',
    sensors: [],
}

function Devices() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { devices, wazigateId, getDevicesFc, sortDevices, showDialog } = useContext(DevicesContext);
    const [selectedDevice, setSelectedDevice] = useState<null | Device>(null);
    const [mode, setMode] = useState<"edit" | "create">("create");
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openEditCreateDialog, setOpenEditCreateDialog] = useState(false);

    useEffect(() => {
        if (devices.length === 0) {
            getDevicesFc();
        }
        window.wazigate.subscribe<Device[]>("devices/#", getDevicesFc);
        return () => window.wazigate.unsubscribe("devices/#", getDevicesFc);
    }, [devices, getDevicesFc])

    const handleToggleModal = () => {
        setMode("create");
        setSelectedDevice(initialNewDevice);
        setOpenEditCreateDialog(!openEditCreateDialog)
    };

    const handleToggleEditModal = () => {
        setOpenEditCreateDialog(!openEditCreateDialog)
    }

    const handleToggleEditModalClose = () => {
        setSelectedDevice(null);
        setOpenEditModal(!openEditModal);
    }
    const handleToggleEditCreateDialogClose = () => {
        setSelectedDevice(null);
        setOpenEditCreateDialog(!openEditCreateDialog);
    }
    const changeEditMakeLoraWANDevice = () => {
        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                meta: {
                    ...selectedDevice.meta,
                    lorawan: selectedDevice.meta.lorawan ? null : {
                        profile: 'WaziDev',
                    },
                }
            }) as unknown as Device
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    function submitCreateDevice(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const device: Device = {
            ...selectedDevice as Device,
        }
        window.wazigate.addDevice(device)
            .then(() => {
                handleToggleModal();
                setError({
                    message: "Devices added successfully",
                    severity: 'success'
                })
                getDevicesFc();
            }).catch(err => {
                setError({message: 'Error encountered'+err && err.message ? err.message : err as string,severity:"error"})
            });
    }
    const handleTextInputChangeEditCreateDevice = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedDevice) {
            let devEUI = selectedDevice?.meta.lorawan?.devEUI;
            let devAddr = selectedDevice?.meta.lorawan?.devAddr;
            if (e.target.name === 'devAddr') {
                devAddr = e.target.value;
                devEUI = devEUIGenerateFc(e.target.value);
            }
            setSelectedDevice({
                ...selectedDevice as Device,
                meta: {
                    ...(selectedDevice as Device).meta,
                    lorawan: {
                        ...selectedDevice.meta.lorawan,
                        nwkSEncKey: (e.target.name === 'nwkSEncKey') ? e.target.value : selectedDevice?.meta.lorawan?.nwkSEncKey,
                        appSKey: (e.target.name === 'appSKey') ? e.target.value : selectedDevice?.meta.lorawan?.appSKey,
                        devAddr,
                        devEUI,
                    }
                }
            });
        }
    }

    const handleChangeDeviceCodec = (event: SelectChangeEvent<string>) => {
        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                meta: {
                    ...selectedDevice.meta,
                    codec: event.target.value
                }
            }) as unknown as Device
        }
    };

    function handleDeleteDevice(device: Device) {
        showDialog({
            title: `Deleting Device: [${device.name}]`,
            acceptBtnTitle: "Delete",
            content: `Are you sure you want to delete [${device.name}] ? This action cannot be undone.`,
            onAccept() {
                window.wazigate.deleteDevice(device.id)
                    .then(() => {
                        getDevicesFc();
                        setError({
                            message: "Device removed successfully",
                            severity: 'success'
                        })
                    })
                    .catch(err => {
                        setError({message: 'Error encountered: '+err && err.message ? err.message : err as string,severity:"error"})
                    })
            },
            onCancel() { },
        })

    }

    function handleSelectDevice(device: Device) {
        setMode("edit");
        setSelectedDevice(device);
        handleClose();
        handleToggleEditModal();
    }

    function handleEditCreateDeviceName(e: React.ChangeEvent<HTMLInputElement>) {
        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                name: e.target.value
            }) as unknown as Device
        }
    }

    function handleChangeSelectDeviceType(e: SelectChangeEvent<string>) {
        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                meta: {
                    ...selectedDevice.meta,
                    type: e.target.value
                }
            }) as unknown as Device
        }
    }

    const handleSubmitEditDevice = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const devdev = devices.find((dev) => dev.id === selectedDevice?.id);
        if (selectedDevice?.meta) {
            if (devdev?.meta !== selectedDevice?.meta) {
                window.wazigate.setDeviceMeta(selectedDevice?.id as string, selectedDevice?.meta as Device)
                .then(() => {
                    showDialog({
                        content: "Device meta update updated successfully",
                        onAccept: () => { },
                        onCancel: () => { },
                        hideCloseButton: true,
                        acceptBtnTitle: "Close",
                        title: "Update successfully"
                    });
                    getDevicesFc();
                    return;
                }).catch(err => {
                    setError({message: 'Error encountered '+err && err.message ? err.message : err as string,severity:"error"})
                });
                setMode('create')
            }
            if (devdev?.name !== selectedDevice?.name) {
                // window.wazigate.setDeviceName(selectedDevice.id as string, selectedDevice.name)
                window.wazigate.set(`devices/${selectedDevice?.id}/name`, selectedDevice?.name)
                .then(() => {
                    showDialog({
                        content: "Device name update updated successfully ",
                        onAccept: () => { },
                        onCancel: () => { },
                        acceptBtnTitle: "Close",
                        hideCloseButton: true,
                        title: "Update successfully"
                    });
                    return;
                }).catch(err => {
                    setError({message: err && err.message ? err.message : err as string,severity:"error"})
                });
                setMode('create')
            }
        }
        setSelectedDevice(null);
        handleToggleEditModalClose();
        getDevicesFc();
        navigate('/devices')
    }

    const autoGenerateLoraWANOptions = (title: "devAddr" | "nwkSEncKey" | "appSKey") => {
        switch (title) {
            case 'devAddr':
                if (selectedDevice) {
                    let devEUI = selectedDevice?.meta.lorawan.devEUI;
                    let devAddr = selectedDevice?.meta.lorawan.devAddr;
                    if (title === 'devAddr') {
                        devAddr = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
                        devEUI = devEUIGenerateFc(devAddr.toString())
                    }
                    setSelectedDevice({
                        ...selectedDevice,
                        meta: {
                            ...selectedDevice.meta,
                            lorawan: {
                                ...selectedDevice.meta.lorawan,
                                devEUI,
                                devAddr,
                            }
                        }
                    }) as unknown as Device
                } 
                break;
            case 'nwkSEncKey':
                if (selectedDevice) {
                    setSelectedDevice({
                        ...selectedDevice,
                        meta: {
                            ...selectedDevice.meta,
                            lorawan: {
                                ...selectedDevice.meta.lorawan,
                                nwkSEncKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
                            }
                        }
                    }) as unknown as Device
                }
                break;
            case 'appSKey':
                if (selectedDevice) {
                    setSelectedDevice({
                        ...selectedDevice,
                        meta: {
                            ...selectedDevice.meta,
                            lorawan: {
                                ...selectedDevice.meta.lorawan,
                                appSKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
                            }
                        }
                    }) as unknown as Device
                }
                break;
            default:
                break;
        }
    }
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={error !==null} autoHideDuration={3000} onClose={()=>setError(null)}>
                <Alert onClose={()=>setError(null)} severity={error ? error.severity:'info'} sx={{ width: '100%' }}>
                    {error?error.message as string:''}
                </Alert>
            </Snackbar>
            <Box sx={{ height: '100%' }}>
                <EditeCreateDeviceDialog
                    mode={mode}
                    matchesWidth={matches}
                    device={selectedDevice as Device}
                    openModal={openEditCreateDialog}
                    isFirst={wazigateId === selectedDevice?.id}
                    handleChangeSelectDeviceType={handleChangeSelectDeviceType}
                    handleToggleModal={handleToggleEditCreateDialogClose}
                    handleChangeDeviceCodec={handleChangeDeviceCodec}
                    handleNameChange={handleEditCreateDeviceName}
                    handleTextInputChangeEditCreateDevice={handleTextInputChangeEditCreateDevice}
                    submitEditDevice={mode==="edit"?handleSubmitEditDevice:submitCreateDevice}
                    changeEditMakeLoraWANDevice={changeEditMakeLoraWANDevice}
                    autoGenerateLoraWANOptionsHandler={autoGenerateLoraWANOptions}
                />
                <Box sx={{ px: matches ? 4 : 2, py: [0, 2], width: '100%', height: '100%' }}>
                    <RowContainerBetween >
                        <Box>
                            <Typography variant='h5'>Devices</Typography>
                            <div role="presentation" onClick={() => { }}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Typography fontSize={16} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                        <Link style={{ color: 'black', textDecoration: 'none', fontWeight: 300 }} state={{ title: 'Devices' }} color="inherit" to="/">
                                            Home
                                        </Link>
                                    </Typography>
                                    <Typography style={{ textDecoration: 'none', fontWeight: 300 }} color="text.primary">
                                        Devices
                                    </Typography>
                                </Breadcrumbs>
                            </div>
                        </Box>

                    </RowContainerBetween>
                    <RowContainerBetween additionStyles={{ my: 2 }}>
                        {/* {
                            matches ? (
                                <PrimaryIconButton fontSize={16} title={'New Device'} iconname={'add'} onClick={handleToggleModal} />
                            ) : null
                        } */}
                        <PrimaryIconButton title={'New Device'} color={'secondary'} iconName={'add'} onClick={handleToggleModal} />

                        <Box sx={{ overflow: "hidden", position: "relative", display: 'flex', zIndex: 1, }}>
                            <Typography  style={{ color: '#797979',}}>Sort by:&nbsp;</Typography>
                            <select
                                onChange={(e) => sortDevices(e.target.value as '1' | '2' | '3' | '4')}
                                style={{ border: 'none', color: '#797979', cursor: 'pointer', outline: "none", background: "none" }}
                                name="tanks"
                                id="tanks"
                            >
                                {SortOptions.map((it, idx) => (
                                    <option key={idx} style={{ padding: '10px 10px', color: '#797979' }} value={it.id}>
                                        {it.name} &nbsp; &nbsp;
                                    </option>
                                ))}
                            </select>
                        </Box>
                    </RowContainerBetween>
                    {
                        devices.length === 0 ? (
                            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography fontSize={20} fontWeight={500} color={'#000'}>No devices found</Typography>
                            </Box>
                        ) : null
                    }
                    <Grid container my={[2]} spacing={2}>
                        {
                            devices.map((device, id) => {
                                return (
                                    <Grid item key={id} xs={12} sm={6} lg={4} px={0}>
                                        <Box sx={{ boxShadow: 1, height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 1, }}>
                                            <RowContainerBetween additionStyles={{ p: 2, borderBottom: '1px solid #dddddd', py: 1.5, }}>
                                                <RowContainerNormal onClick={() => { navigate(`/devices/${device.id}`, { state: { title: device.name } }) }} additionStyles={{ my: 1, gap: 1, flexGrow: 1, cursor: 'pointer' }}>
                                                    <Box component={'img'} src={DeviceImage} width={35} height={35} mr={1} />
                                                    <Box >
                                                        {/* <Typography sx={{ ...lineClamp(1) }} >{(device.name && device.name.length > 10) ? device.name : device.name ? device.name : ''}</Typography> */}
                                                        <Typography sx={{ ...lineClamp(1) }} >{device.name || 'New Device'}</Typography>
                                                        <Typography color={DEFAULT_COLORS.secondary_black} variant='caption'>{time_ago(new Date(device.modified).toISOString()).toString()}</Typography>
                                                    </Box>
                                                </RowContainerNormal>
                                                <MenuDropDown
                                                    open={open}
                                                    menuItems={[
                                                        {
                                                            clickHandler() {
                                                                handleSelectDevice(device);
                                                                handleClose();
                                                            },
                                                            icon: 'mode_outlined',
                                                            text: 'Edit'
                                                        },
                                                        device.id === wazigateId ? null : {
                                                            clickHandler() {
                                                                handleDeleteDevice(device);
                                                                handleClose();
                                                            },
                                                            icon: 'delete',
                                                            text: 'Delete'
                                                        }
                                                    ]}
                                                />
                                            </RowContainerBetween>

                                            <CardContent
                                                sx={{
                                                    p: 0,
                                                    maxHeight: ((device.sensors.length + device.actuators.length) > 3) ? 200 : null,
                                                    overflowY: 'auto',
                                                    '&::-webkit-scrollbar': {
                                                        width: '5px',
                                                    },
                                                    '&::-webkit-scrollbar-thumb': {
                                                        backgroundColor: DEFAULT_COLORS.primary_blue,
                                                        borderRadius: '8px',
                                                        border: '2px solid transparent',
                                                    },
                                                }}>
                                                {device.sensors.length === 0 && device.actuators.length === 0 && (
                                                    <Box m={5} position={'relative'} textAlign={'center'} top={'50%'} display={'flex'} flexDirection={'column'}>
                                                        <Typography color={'#797979'} variant='caption'>No interfaces found</Typography>
                                                        <Typography color={'#797979'} variant='body2' component={'span'}> Click <Link style={{ textDecoration: 'underline', color: '#f25f16', fontWeight: '500' }} to={device.id}>here</Link> to create </Typography>
                                                    </Box>
                                                )}
                                                {
                                                    device.sensors.length > 0 ? device.sensors.map((sensor) => (
                                                        <Box key={sensor.id} sx={{ cursor: 'pointer' }}>
                                                            <SensorActuatorInfo
                                                                type='sensor'
                                                                key={sensor.id}
                                                                onClick={() => {
                                                                    navigate(`/devices/${device.id}/sensors/${sensor.id}`, { state: { devicename: device.name, sensorId: sensor.id, deviceId: device.id, sensorname: sensor.name } })
                                                                }}
                                                                lastUpdated={sensor ? time_ago(new Date(sensor.time ? sensor.time : sensor.modified).toISOString()).toString() ?? '' : ''}
                                                                kind={(sensor.meta && sensor.meta.kind) ? sensor.meta.kind : (sensor as SensorX).kind ? (sensor as SensorX).kind : 'AirThermometer'}
                                                                iconname={(sensor.meta && sensor.meta.icon) ? sensor.meta.icon : ''}
                                                                name={sensor.name}
                                                                unit={(sensor.meta && sensor.meta.unitSymbol) ? sensor.meta.unitSymbol : ''}
                                                                text={sensor.value ? sensor.value : 0}
                                                            />
                                                        </Box>
                                                    )) : (
                                                        null
                                                    )
                                                }
                                                {
                                                    device.actuators.length > 0 ? device.actuators.map((act) => (
                                                        <Box key={act.id} sx={{ cursor: 'pointer' }}>
                                                            <SensorActuatorInfo
                                                                onClick={() => {
                                                                    navigate(`/devices/${device.id}/actuators/${act.id}`, { state: { deviceId: device.id, actuatordId: act.id, actuatorname: act.name } })
                                                                }}
                                                                lastUpdated={act ? time_ago(new Date(act.time ? act.time as Date : act.modified).toISOString()).toString() ?? '' : ''}
                                                                key={act.id}
                                                                type='actuator'
                                                                iconname={(act.meta && act.meta.icon) ? act.meta.icon : ''}
                                                                name={act.name}
                                                                unit={(act.meta && act.meta.unit && act.value) ? act.meta.unit : ''}
                                                                kind={(act.meta && act.meta.kind) ? act.meta.kind : 'Motor'}
                                                                text={act.meta ? act.meta.quantity === 'Boolean' ? act.value ? 'Running' : 'Closed' : Math.round(act.value * 100) / 100 : ''}
                                                            />
                                                        </Box>
                                                    )) : (
                                                        null
                                                    )
                                                }
                                            </CardContent>
                                        </Box>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
            </Box>
            {/* {
                !matches ? (
                    <SpeedDial color={DEFAULT_COLORS.primary_blue} ariaLabel='New Device' sx={{ color: '#499dff', position: 'absolute', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
                        <SpeedDialAction
                            key={'New Device'}
                            icon={<Add />}
                            tooltipOpen
                            onClick={handleToggleModal}
                            tooltipTitle='New'
                        />
                    </SpeedDial>
                ) : null
            } */}
        </>
    );
}

export default Devices;