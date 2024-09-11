import { Box,  Grid, CardContent, Typography, SelectChangeEvent, SpeedDial, SpeedDialAction, SpeedDialIcon, } from '@mui/material';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import { Add,  Sensors, } from '@mui/icons-material';
import { DEFAULT_COLORS } from '../constants';
import { useNavigate, useOutletContext, } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { type Device } from 'waziup';
import CreateDeviceModalWindow from '../components/ui/ModalCreateDevice';
import EditDeviceModal from '../components/ui/EditDeviceModal';
import { DevicesContext, SensorX } from '../context/devices.context';
import { capitalizeFirstLetter, cleanString, devEUIGenerateFc, differenceInMinutes,  } from '../utils';
import PrimaryIconButton from '../components/shared/PrimaryIconButton';
import SensorActuatorInfo from '../components/shared/SensorActuatorInfo';
import MenuComponent from '../components/shared/MenuDropDown';
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
    const { devices, wazigateId, getDevicesFc } = useContext(DevicesContext);
    const [selectedDevice, setSelectedDevice] = useState<null | Device>(null);
    const [newDevice, setNewDevice] = useState<Device>(initialNewDevice);
    const [matches] = useOutletContext<[matches: boolean,matchesMd: boolean]>();
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
                lorawan: newDevice.meta.lorawan ? null : { 
                    profile: 'WaziDev',
                },
            }
        })
    }
    const changeEditMakeLoraWAN = () => {
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
            setScreen('tab1');
            handleToggleModal();
            getDevicesFc();
        }).catch(err => {
            setScreen('tab1');
            alert('Error encountered: ' + err);
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
        let devEUI = newDevice?.meta.lorawan?.devEUI;
        let devAddr = newDevice?.meta.lorawan?.devAddr;
        const sharedKey= e.target.name==='nwkSEncKey' ? newDevice?.meta.lorawan?.nwkSEncKey: e.target.name==='appSKey'? newDevice?.meta.lorawan?.appSKey:'';
        if(e.target.name === 'devAddr'){
            devAddr = e.target.value;
            devEUI = devEUIGenerateFc(e.target.value);
        }
        setNewDevice({
            ...newDevice,
            meta: {
                ...newDevice.meta,
                lorawan: {
                    ...newDevice.meta.lorawan,
                    nwksEncKey: sharedKey,
                    appSKey: sharedKey,
                    devEUI,
                    devAddr,
                },
            }
        })
    }
    
    const handleChangeDeviceCodec = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if(selectedDevice){
            setSelectedDevice({
                ...selectedDevice,
                meta: {
                    ...selectedDevice.meta,
                    codec: event.target.value
                }
            }) as unknown as Device
        }
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
                alert('Error encountered: ' + err);
            })
        }
    }
    function handleSelectDevice(device: Device) {
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
        let devEUI = selectedDevice?.meta.lorawan?.devEUI;
        let devAddr = selectedDevice?.meta.lorawan?.devAddr;
        const sharedKey= e.target.name==='nwkSEncKey' ? selectedDevice?.meta.lorawan?.nwkSEncKey: e.target.name==='appSKey'? selectedDevice?.meta.lorawan?.appSKey:'';
        if(e.target.name === 'devAddr'){
            devAddr = e.target.value;
            devEUI = devEUIGenerateFc(e.target.value);
        }
        if(selectedDevice){
            setSelectedDevice({
                ...selectedDevice as Device,
                meta: {
                    ...(selectedDevice as Device).meta,
                    lorawan :{
                        ...selectedDevice.meta.lorawan,
                        nwkSEncKey:  (e.target.name === 'nwkSEncKey' || e.target.name === 'appSKey') ? e.target.value : sharedKey,
                        appSKey: (e.target.name==='appSKey' || e.target.name==='nwkSEncKey') ? e.target.value : sharedKey,
                        devAddr,
                        devEUI,
                    }
                }
            });
        }
    }
    const handleSubmitEditDevice = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const devdev = devices.find((dev) => dev.id === selectedDevice?.id);
        if (selectedDevice?.meta) {
            if (devdev?.meta !== selectedDevice?.meta) {
                window.wazigate.setDeviceMeta(selectedDevice?.id as string, selectedDevice?.meta as Device)
                    .then(() => {
                        alert("Device meta updated");
                        getDevicesFc();
                        return;
                    }).catch(err => {
                        alert("Error updating device meta"+err);
                    });
            }
            if (devdev?.name !== selectedDevice?.name) {
                // window.wazigate.setDeviceName(selectedDevice.id as string, selectedDevice.name)
                window.wazigate.set(`devices/${selectedDevice?.id}/name`, selectedDevice?.name)
                .then(() => {
                    alert("Device name updated");
                    return;
                }).catch(err => {
                    alert("Error updating device name"+err);
                });
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
                    let devEUI= selectedDevice?.meta.lorawan.devEUI;
                    let devAddr= selectedDevice?.meta.lorawan.devAddr;
                    if(title==='devAddr'){
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
                } else {
                    let devEUI= newDevice?.meta.lorawan.devEUI;
                    let devAddr= newDevice?.meta.lorawan.devAddr;
                    if(title==='devAddr'){
                        devAddr = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
                        devEUI = devEUIGenerateFc(devAddr.toString())
                    }
                    setNewDevice({
                        ...newDevice,
                        meta: {
                            ...newDevice.meta,
                            lorawan: {
                                ...newDevice.meta.lorawan,
                                devEUI,
                                devAddr,
                            }
                        }
                    });
                }
                break;
            case 'nwkSEncKey':
                if (selectedDevice) {
                    const sharedKey = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
                    setSelectedDevice({
                        ...selectedDevice,
                        meta: {
                            ...selectedDevice.meta,
                            lorawan: {
                                ...selectedDevice.meta.lorawan,
                                nwkSEncKey: sharedKey,
                                appSKey: sharedKey,
                            }
                        }
                    }) as unknown as Device
                }
                else {
                    const sharedKey = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
                    setNewDevice({
                        ...newDevice,
                        meta: {
                            ...newDevice.meta,
                            lorawan: {
                                ...newDevice.meta.lorawan,
                                nwkSEncKey: sharedKey,
                                appSKey: sharedKey,
                            }
                        }
                    });
                }
                break;
            case 'appSKey':
                if (selectedDevice) {
                    const sharedKey = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
                    setSelectedDevice({
                        ...selectedDevice,
                        meta: {
                            ...selectedDevice.meta,
                            lorawan: {
                                ...selectedDevice.meta.lorawan,
                                nwkSEncKey: sharedKey,
                                appSKey: sharedKey,
                            }
                        }
                    }) as unknown as Device
                }
                else {
                    const sharedKey = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
                    setNewDevice({
                        ...newDevice,
                        meta: {
                            ...newDevice.meta,
                            lorawan: {
                                ...newDevice.meta.lorawan,
                                nwkSEncKey: sharedKey,
                                appSKey: sharedKey,
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
        <>
            <Box sx={{ height: '100%',}}>
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
                    isFirst={wazigateId === selectedDevice?.id}
                    handleChangeSelectDeviceType={handleChangeSelectDeviceType}
                    handleToggleModal={handleToggleEditModalClose}
                    handleChangeDeviceCodec={handleChangeDeviceCodec}
                    handleNameChange={handleEditSelectedDeviceName}
                    handleTextInputEditCodec={handleTextInputEditCodec}
                    submitEditDevice={handleSubmitEditDevice}
                    changeEditMakeLoraWAN={changeEditMakeLoraWAN}
                    autoGenerateLoraWANOptionsHandler={autoGenerateLoraWANOptions}
                />
                <Box sx={{ px: 2, py: matches?3:2,width:'100%', bgcolor:'#F0F2F5',  height: '100%' }}>
                    <RowContainerBetween >
                        <Typography fontSize={24} fontWeight={700} color={'black'}>Devices</Typography>
                        {
                            matches?(
                                <PrimaryIconButton fontSize={16} title={'New Device'} iconname={'add'} onClick={handleToggleModal} />
                            ):null
                        }
                    </RowContainerBetween>
                    <Grid container my={matches?2:0} spacing={2}>
                        {
                            devices.map((device, id) => {
                                return (
                                    <Grid item key={id}  md={6} lg={4} xl={4} sm={6} xs={12} minHeight={100} my={1} px={1} >
                                        <Box sx={{ boxShadow: 3, cursor: 'pointer', height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
                                            {
                                                (device.meta && device.meta.type) ?(
                                                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: -8, my: -1, px: 1, py: .4, borderRadius: 1, mx: 1, bgcolor: DEFAULT_COLORS.primary_blue }}>
                                                        <Sensors sx={{ fontSize: 15, color: '#fff' }} />
                                                        <Typography fontSize={13} mx={1} color={'white'} component={'span'}>{device.meta ? capitalizeFirstLetter(device.meta.type) : ''}</Typography>
                                                    </Box>
                                                ):null
                                            }
                                            <Box sx={{ borderBottom: '1px solid rgba(0,0,0,.1)', py: 1.5, ":hover": { py: 1.5 }, px: 1, }}>
                                                <RowContainerBetween  additionStyles={{}} >
                                                    <Box sx={{width:'85%'}} onClick={() => {navigate(`${device.id}`)}}>
                                                        <Typography color={'info'} fontWeight={700}>{(device.name && device.name.length > 10) ? cleanString(device.name).slice(0, 10) + '....' : cleanString(device.name?device.name:'')}</Typography>
                                                        <Typography color={DEFAULT_COLORS.secondary_black} fontSize={12} fontWeight={300}>
                                                            Last updated {differenceInMinutes(new Date(device.modified).toISOString())}
                                                        </Typography>
                                                    </Box>
                                                    <MenuComponent
                                                        open={open}
                                                        menuItems={[
                                                            {
                                                                clickHandler() {
                                                                    handleSelectDevice(device);
                                                                    handleClose();
                                                                },
                                                                icon:'mode_outlined',
                                                                text:'Edit'
                                                            },
                                                            {
                                                                clickHandler() {
                                                                    handleDeleteDevice(device);
                                                                    handleClose();
                                                                },
                                                                icon:'delete_outline',
                                                                text:'Uninstall'
                                                            }
                                                        ]}
                                                    />
                                                </RowContainerBetween>
                                            </Box>
                                            <CardContent sx={{ py: 0 }}>
                                                {device.sensors.length === 0 && device.actuators.length === 0 &&(
                                                    <Typography fontSize={14} textAlign={'center'} m={5} position={'relative'} top={'50%'} fontWeight={500} color={'black'}>No interfaces found</Typography>
                                                )}
                                                {
                                                    device.sensors.length > 0 ? device.sensors.map((sensor) => (
                                                        <Box key={sensor.id}>
                                                            <SensorActuatorInfo
                                                                type='sensor'
                                                                key={sensor.id}
                                                                onClick={() => {
                                                                    navigate(`/devices/${device.id}/sensors/${sensor.id}`, { state: { devicename: device.name, sensorId: sensor.id, deviceId: device.id, sensorname: sensor.name } })
                                                                }}
                                                                kind={(sensor.meta && sensor.meta.kind)? sensor.meta.kind : (sensor as SensorX).kind? (sensor as SensorX).kind : 'AirThermometer'}
                                                                iconname={(sensor.meta && sensor.meta.icon)? sensor.meta.icon : ''}
                                                                name={sensor.name}
                                                                unit={(sensor.meta  && sensor.meta.unitSymbol)? sensor.meta.unitSymbol : ''}
                                                                text={sensor.value? sensor.value :0}
                                                            />
                                                        </Box>
                                                    )) : (
                                                        null
                                                    )
                                                }
                                                {
                                                    device.actuators.length > 0 ? device.actuators.map((act) => (
                                                        <Box key={act.id}>
                                                            <SensorActuatorInfo 
                                                                onClick={() => {
                                                                    navigate(`/devices/${device.id}/actuators/${act.id}`, { state: { deviceId: device.id, actuatordId: act.id, actuatorname: act.name } })
                                                                }}
                                                                key={act.id}
                                                                type='actuator'
                                                                iconname={(act.meta && act.meta.icon) ? act.meta.icon : ''}
                                                                name={act.name}
                                                                unit={(act.meta && act.meta.unit && act.value) ? act.meta.unit : ''}
                                                                kind={(act.meta && act.meta.kind)? act.meta.kind : 'Motor'}
                                                                text={act.meta? act.meta.quantity==='Boolean' ? act.value ? 'Running' : 'Closed': Math.round(act.value * 100) / 100 : ''}
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
            {
                !matches ? (
                    <SpeedDial color={DEFAULT_COLORS.primary_blue} ariaLabel='New Device' sx={{color:'#499dff', position: 'absolute', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
                        <SpeedDialAction
                            key={'New Device'}
                            icon={<Add />}
                            onClick={handleToggleModal}
                            tooltipTitle='New Device'
                        />
                    </SpeedDial>
                ): null
            }
        </>
    );
}

export default Devices;