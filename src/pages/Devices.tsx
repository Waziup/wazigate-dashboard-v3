import { Box, Button, Grid, CardContent, Typography, ListItemIcon, Menu, MenuItem, SelectChangeEvent, SpeedDial, SpeedDialAction, SpeedDialIcon, } from '@mui/material';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import { Add, DeleteOutline, ModeOutlined, MoreVert, Sensors, } from '@mui/icons-material';
import { DEFAULT_COLORS } from '../constants';
import { useNavigate, useOutletContext, } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { type Device } from 'waziup';
import CreateDeviceModalWindow from '../components/ui/ModalCreateDevice';
import EditDeviceModal from '../components/ui/EditDeviceModal';
import { DevicesContext } from '../context/devices.context';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { capitalizeFirstLetter, differenceInMinutes } from '../utils';
import PrimaryIconButton from '../components/shared/PrimaryIconButton';
import SensorActuatorInfo from '../components/shared/SensorActuatorInfo';


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
    const { devices, getDevicesFc } = useContext(DevicesContext);
    const [selectedDevice, setSelectedDevice] = useState<null | Device>(null);
    const [newDevice, setNewDevice] = useState<Device>(initialNewDevice);
    const [matches] = useOutletContext<[matches: boolean]>();
    const handleToggleModal = () => {
        setOpenModal(!openModal);
        if (!openModal) {
            setNewDevice(initialNewDevice);
        }
    };
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const handleToggleEditModal = () => {
        setOpenEditModal(!openEditModal);
    }
    useEffect(()=>{
        if (devices.length===0) {
            getDevicesFc();
        }
    },[devices, getDevicesFc])
    const handleToggleEditModalClose = () => {
        setSelectedDevice(null);
        setOpenEditModal(!openEditModal);
    }
    const changeMakeLoraWAN = () => {
        setNewDevice({
            ...newDevice,
            meta: {
                ...newDevice.meta,
                lorawan: newDevice.meta.lorawan ? null : { devEUI: null, },
            }
        })
    }
    const changeEditMakeLoraWAN = () => {
        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                meta: {
                    ...selectedDevice.meta,
                    lorawan: selectedDevice.meta.lorawan ? null : { devEUI: null, },
                }
            }) as unknown as Device
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewDevice({
            ...newDevice,
            name: event.target.value,
        })
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    function submitCreateDevice(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const device: Device = {
            ...newDevice,
        }
        window.wazigate.addDevice(device)
        .then(() => {
            handleToggleModal();
            getDevicesFc();
        }).catch(err => {
            console.log('Error encountered: ', err)
        });
    }
    const [selectedValue, setSelectedValue] = useState('');
    const blockOnClick = (value: string) => {
        setSelectedValue(value);
    }
    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        setSelectedValue(event.target.value);
        setNewDevice({
            ...newDevice,
            meta: {
                ...newDevice.meta,
                type: event.target.value
            }
        })
    };
    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name, e.target.value);
        setNewDevice({
            ...newDevice,
            meta: {
                ...newDevice.meta,
                lorawan: {
                    [e.target.name]: e.target.value
                },
            }
        })
    }
    const handleChangeDeviceCodec = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewDevice({
            ...newDevice,
            meta: {
                ...newDevice.meta,
                codec: event.target.value
            }
        })
    };
    const [screen, setScreen] = useState<'tab1' | 'tab2'>('tab1');
    const handleScreenChange = (screen: 'tab1' | 'tab2') => {
        setScreen(screen);
    }
    function handleDeleteDevice(device: Device) {
        const delEL = confirm(`Are you sure you want to remove ${device.name}?`)
        if (!delEL) {
            return;
        } else {
            window.wazigate.deleteDevice(device.id)
            .then(() => {
                getDevicesFc();
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
    function handleSelectDevice(device: Device) {
        console.log(device);
        setSelectedDevice(device);
        handleClose();
        handleToggleEditModal();
    }
    function handleEditSelectedDeviceName(e: React.ChangeEvent<HTMLInputElement>) {
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
    const handleTextInputEditCodec = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name, e.target.value);
        setNewDevice({
            ...newDevice,
            meta: {
                ...newDevice.meta,
                [e.target.name]: e.target.value
            }
        })
    }
    const handleSubmitEditDevice = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Selected Device: ", selectedDevice);
        const device = devices.find((dev) => dev.id === selectedDevice?.id);
        if (selectedDevice?.meta) {
            if (device?.meta !== selectedDevice?.meta) {
                console.log("Change codec: ", selectedDevice.meta.codec);
                window.wazigate.setDeviceMeta(selectedDevice?.id as string, selectedDevice?.meta as Device)
                    .then(() => {
                        alert("Device meta updated");
                        getDevicesFc();
                        return;
                    }).catch(err => {
                        console.log(err);
                        alert("Error updating device meta");
                    });
            }
            if (device?.name !== selectedDevice?.name) {
                window.wazigate.setDeviceName(selectedDevice.id as string, selectedDevice.name.toString())
                    .then(() => {
                        alert("Device name updated");
                        return;
                    }).catch(err => {
                        console.log(err);
                        alert("Error updating device name");
                    });
            }
        }
        handleToggleEditModalClose();
        getDevicesFc();
        navigate('/devices')
    }
    
    const autoGenerateLoraWANOptions = (title: "devAddr" | "nwkSEncKey" | "appSKey") => {
        switch (title) {
            case 'devAddr':
                if (selectedDevice) {
                    setSelectedDevice({
                        ...selectedDevice,
                        meta: {
                            ...selectedDevice.meta,
                            lorawan: {
                                ...selectedDevice.meta.lorawan,
                                devAddr: Math.floor(Math.random() * 90000000) + 10000000,
                            }
                        }
                    }) as unknown as Device
                } else {
                    setNewDevice({
                        ...newDevice,
                        meta: {
                            ...newDevice.meta,
                            lorawan: {
                                ...newDevice.meta.lorawan,
                                devAddr: Math.floor(Math.random() * 90000000) + 10000000,
                            }
                        }
                    });
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
                else {
                    setNewDevice({
                        ...newDevice,
                        meta: {
                            ...newDevice.meta,
                            lorawan: {
                                ...newDevice.meta.lorawan,
                                nwkSEncKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
                            }
                        }
                    });
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
                                appSKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
                            }
                        }
                    }) as unknown as Device
                }
                else {
                    setNewDevice({
                        ...newDevice,
                        meta: {
                            ...newDevice.meta,
                            lorawan: {
                                ...newDevice.meta.lorawan,
                                appSKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
                            }
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            <CreateDeviceModalWindow
                openModal={openModal}
                handleToggleModal={handleToggleModal}
                submitCreateDevice={submitCreateDevice}
                handleChange={handleChange}
                handleChangeSelect={handleChangeSelect}
                selectedValue={selectedValue}
                screen={screen}
                handleScreenChange={handleScreenChange}
                blockOnClick={blockOnClick}
                newDevice={newDevice}
                changeMakeLoraWAN={changeMakeLoraWAN}
                handleChangeDeviceCodec={handleChangeDeviceCodec}
                onTextInputChange={handleTextInputChange}
                autoGenerateLoraWANOptionsHandler={autoGenerateLoraWANOptions}
            />
            <EditDeviceModal
                device={selectedDevice as Device}
                openModal={openEditModal}
                handleChangeSelectDeviceType={handleChangeSelectDeviceType}
                handleToggleModal={handleToggleEditModalClose}
                handleNameChange={handleEditSelectedDeviceName}
                handleTextInputEditCodec={handleTextInputEditCodec}
                submitEditDevice={handleSubmitEditDevice}
                changeEditMakeLoraWAN={changeEditMakeLoraWAN}
                autoGenerateLoraWANOptionsHandler={autoGenerateLoraWANOptions}
            />
            <Box sx={{ px:2, py:3,  height: '100%' }}>
                <RowContainerBetween>
                    <Typography fontWeight={700} color={'black'}>Devices</Typography>
                    {
                        matches?(
                            <PrimaryIconButton title={'New Device'} iconname={'add'} onClick={handleToggleModal} />
                        ):null
                    }
                </RowContainerBetween>
                <Grid container my={2} spacing={2}>
                    {
                        devices.map((device, id) => {
                            return (
                                <Grid item m={1} key={id} md={6} lg={3.5} xl={4} sm={8} xs={12} >
                                    <Box sx={{ boxShadow: 3, cursor: 'pointer', height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: -8, my: -1, px: 1, py: .4, borderRadius: 1, mx: 1, bgcolor: DEFAULT_COLORS.primary_blue }}>
                                            <Sensors sx={{ fontSize: 15, color: '#fff' }} />
                                            <Typography fontSize={13} mx={1} color={'white'} component={'span'}>{device.meta ? capitalizeFirstLetter(device.meta.type) : ''}</Typography>
                                        </Box>
                                        <Box sx={{ borderBottom: '1px solid rgba(0,0,0,.1)', py: 1.5, ":hover": { py: 1.5 }, px: 2, }}>
                                            <RowContainerBetween additionStyles={{}} >
                                                <Box onClick={() => { navigate(`${device.id}`) }}>
                                                    <Typography color={'info'} fontWeight={700}>{device.name.length > 10 ? device.name.slice(0, 10) + '....' : device.name}</Typography>
                                                    <Typography color={DEFAULT_COLORS.secondary_black} fontSize={12} fontWeight={300}>Last Updated {Math.round(differenceInMinutes(device.modified) / 60)} mins ago</Typography>
                                                </Box>
                                                <Box position={'relative'}>
                                                    <PopupState variant="popover" popupId="demo-popup-menu">
                                                        {(popupState) => (
                                                            <React.Fragment>
                                                                <Button id="demo-positioned-button"
                                                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={open ? 'true' : undefined}
                                                                    {...bindTrigger(popupState)}
                                                                >
                                                                    <MoreVert sx={{ color: 'black' }} />
                                                                </Button>

                                                                <Menu {...bindMenu(popupState)}>
                                                                    <MenuItem onClick={() => { handleSelectDevice(device); popupState.close }} value={device.id} >
                                                                        <ListItemIcon>
                                                                            <ModeOutlined fontSize="small" />
                                                                        </ListItemIcon>
                                                                        Edit
                                                                    </MenuItem>
                                                                    <MenuItem value={id} onClick={() => { handleDeleteDevice(device); popupState.close }}>
                                                                        <ListItemIcon>
                                                                            <DeleteOutline fontSize="small" />
                                                                        </ListItemIcon>
                                                                        Uninstall
                                                                    </MenuItem>
                                                                </Menu>
                                                            </React.Fragment>
                                                        )}
                                                    </PopupState>
                                                </Box>
                                            </RowContainerBetween>
                                        </Box>
                                        <CardContent sx={{ py: 0 }}>
                                            {
                                                device.sensors.length > 0 ? device.sensors.map((sensor) => (
                                                    <Box key={sensor.id}>
                                                        <SensorActuatorInfo
                                                            onClick={() => {
                                                                navigate(`/devices/${device.id}/sensors/${sensor.id}`, { state: { devicename: device.name, sensorId: sensor.id, deviceId: device.id, sensorname: sensor.name } })
                                                            }}
                                                            iconname={sensor.meta.icon}
                                                            name={sensor.name}
                                                            text={sensor.value}
                                                        />
                                                    </Box>
                                                )) : (
                                                    <Box my={2}></Box>
                                                )
                                            }
                                            {
                                                device.actuators.length > 0 ? device.actuators.map((act) => (
                                                    <Box key={act.id}>
                                                        <SensorActuatorInfo onClick={() => {
                                                            navigate(`/devices/${device.id}/actuators/${act.id}`, { state: { deviceId: device.id, actuatordId: act.id, actuatorname: act.name } })
                                                        }}
                                                            iconname={act.meta.icon}
                                                            name={act.name}
                                                            text={act.value ? 'Running' : 'Closed'}
                                                        />
                                                    </Box>
                                                )) : (
                                                    <Box my={2}></Box>
                                                )
                                            }
                                        </CardContent>
                                    </Box>
                                </Grid>
                            )
                        })
                    }
                </Grid>
                {
                    !matches ? (
                        <SpeedDial color='info' ariaLabel='New Device' sx={{color:'#499', position: 'absolute', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
                            <SpeedDialAction
                                key={'New Device'}
                                icon={<Add />}
                                onClick={handleToggleModal}
                                tooltipTitle='New Device'
                            />
                        </SpeedDial>
                    ): null
                }
            </Box>
        </Box>
    );
}

export default Devices;