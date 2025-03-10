import { Box,  Grid, CardContent, Typography, SelectChangeEvent, SpeedDial, SpeedDialAction, SpeedDialIcon, Breadcrumbs,  } from '@mui/material';
import RowContainerBetween from '../../components/shared/RowContainerBetween';
import { Add } from '@mui/icons-material';
import { DEFAULT_COLORS } from '../../constants';
import { Link, useNavigate, useOutletContext, } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { type Device } from 'waziup';
import CreateDeviceModalWindow from '../../components/ui/ModalCreateDevice';
import EditDeviceModal from '../../components/ui/EditDeviceModal';
import { DevicesContext, SensorX } from '../../context/devices.context';
import { devEUIGenerateFc, differenceInMinutes, lineClamp } from '../../utils';
import PrimaryIconButton from '../../components/shared/PrimaryIconButton';
import SensorActuatorInfo from '../../components/shared/SensorActuatorInfo';
import MenuComponent from '../../components/shared/MenuDropDown';
import RowContainerNormal from '../../components/shared/RowContainerNormal';
import DeviceImage from '../../assets/device.png';
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
    const { devices, wazigateId, getDevicesFc,sortDevices,showDialog } = useContext(DevicesContext);
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
        window.wazigate.subscribe<Device[]>("devices/#", getDevicesFc);
        return  () => window.wazigate.unsubscribe("devices/#", getDevicesFc);
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
            showDialog({
                content:err,
                onAccept:()=>{},
                onCancel:()=>{},
                title:"Error encountered",
                acceptBtnTitle:"Close",
                hideCloseButton: true,
            });
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
                    nwkSEncKey: e.target.name==='nwkSEncKey'? e.target.value: newDevice.meta.lorawan.nwkSEncKey,
                    appSKey: e.target.name==='appSKey'? e.target.value: newDevice.meta.lorawan.appSKey,
                    devEUI,
                    devAddr,
                },
            }
        })
    }
    
    const handleChangeDeviceCodec = (event: SelectChangeEvent<string>) => {
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
        showDialog({
            title:"Remove "+device.name,
            acceptBtnTitle:"OK!",
            content: `Are you sure you want to remove ${device.name}?`,
            onAccept() {
                window.wazigate.deleteDevice(device.id)
                .then(() => {
                    getDevicesFc();
                })
                .catch(err => {
                    showDialog({
                        content:err,
                        onAccept:()=>{},
                        onCancel:()=>{},
                        acceptBtnTitle:"Close",
                        hideCloseButton: true,
                        title:"Error encountered"
                    });
                })
            },
            onCancel() {},
        })

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
                        nwkSEncKey:  (e.target.name === 'nwkSEncKey') ? e.target.value : selectedDevice?.meta.lorawan?.nwkSEncKey,
                        appSKey: (e.target.name==='appSKey') ? e.target.value : selectedDevice?.meta.lorawan?.appSKey,
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
                        showDialog({
                            content:"Device meta update updated successfully ",
                            onAccept:()=>{},
                            onCancel:()=>{},
                            hideCloseButton: true,
                            acceptBtnTitle:"Close",
                            title:"Update successfully"
                        });
                        getDevicesFc();
                        return;
                    }).catch(err => {
                        showDialog({
                            content: err,
                            onAccept:()=>{},
                            onCancel:()=>{},
                            acceptBtnTitle:"Close",
                            title:"Error encountered",
                            hideCloseButton: true,
                        });
                    });
            }
            if (devdev?.name !== selectedDevice?.name) {
                // window.wazigate.setDeviceName(selectedDevice.id as string, selectedDevice.name)
                window.wazigate.set(`devices/${selectedDevice?.id}/name`, selectedDevice?.name)
                .then(() => {
                    showDialog({
                        content:"Device name update updated successfully ",
                        onAccept:()=>{},
                        onCancel:()=>{},
                        acceptBtnTitle:"Close",
                        hideCloseButton: true,
                        title:"Update successfully"
                    });
                    return;
                }).catch(err => {
                    showDialog({
                        content: err,
                        onAccept:()=>{},
                        onCancel:()=>{},
                        hideCloseButton: true,
                        acceptBtnTitle:"Close",
                        title:"Error encountered"
                    });
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
                                appSKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
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
        <>
            <Box sx={{ height: '100%',}}>
                <CreateDeviceModalWindow
                    fullWidth={matches}
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
                    matchesWidth={matches}
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
                <Box sx={{px:matches?4:2,py:matches?2:0, width:'100%', height: '100%' }}>
                    <RowContainerBetween >
                        <Box>
                            <Typography fontSize={24} fontWeight={700} color={'black'}>Devices</Typography>
                            <div role="presentation" onClick={()=>{}}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Typography fontSize={16} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                        <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/">
                                            Home
                                        </Link>
                                    </Typography>
                                    <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                                        Devices
                                    </p>
                                </Breadcrumbs>
                            </div>
                        </Box>
                        {
                            matches?(
                                <PrimaryIconButton fontSize={16} title={'New Device'} iconname={'add'} onClick={handleToggleModal} />
                            ):null
                        }
                    </RowContainerBetween>
                    <RowContainerBetween additionStyles={{my:2}}>
                        <Typography></Typography>
                        <Box sx={{ overflow: "hidden",position: "relative",display:'flex',zIndex: 1,  }}>
                            <p style={{color:'#797979',fontSize:14}}>
                                Sort by:&nbsp;
                            </p>
                            <select onChange={(e)=>sortDevices(e.target.value as '1'|'2'|'3'|'4')} style={{border:'none',color:'#797979', cursor:'pointer',  outline: "none",  background: "none" }} name="tanks"id="tanks">
                                {[{id:'1',name:'Date Created '},{id:'2',name:'Name'},{id:'3',name:'Modified '},{id:'4',name:'Latest'},].map((it, idx) => (
                                    <option key={idx} style={{padding:'10px 10px',color:'#797979'}} value={it.id}>
                                        {it.name} &nbsp; &nbsp;
                                    </option>
                                ))}
                            </select>
                        </Box>
                    </RowContainerBetween>
                    {
                        devices.length===0?(
                            <Box sx={{height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <Typography fontSize={20} fontWeight={500} color={'#000'}>No devices found</Typography>
                            </Box>
                        ):null
                    }
                    <Grid container my={matches?2:0} spacing={2}>
                        {
                            devices.map((device, id) => {
                                return (
                                    <Grid item key={id}  md={6} lg={4} xl={4} sm={6} xs={12}  my={1} px={0} >
                                        <Box sx={{boxShadow:1, cursor: 'pointer', height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 1, }}>
                                            
                                            <RowContainerBetween additionStyles={{p:2,borderBottom: '1px solid rgba(0,0,0,.1)', py: 1.5,}}>
                                                <RowContainerNormal additionStyles={{my:1}}>
                                                    <Box component={'img'} width={35} src={DeviceImage} mr={1} height={35} />
                                                    <Box onClick={()=>{navigate(`/devices/${device.id}`, { state: { title: device.name } })}} >
                                                        <Typography sx={{color:'info',fontWeight:700, ...lineClamp(1)}} >{(device.name && device.name.length > 10) ? device.name: device.name?device.name:''}</Typography>
                                                        <Typography color={DEFAULT_COLORS.secondary_black} fontSize={12} fontWeight={300}> Last updated {differenceInMinutes(new Date(device.modified).toISOString())} </Typography>
                                                    </Box>
                                                </RowContainerNormal>
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
                                                        device.id === wazigateId?null:{
                                                            clickHandler() {
                                                                handleDeleteDevice(device);
                                                                handleClose();
                                                            },
                                                            icon:'delete',
                                                            text:'Delete'
                                                        }
                                                    ]}
                                                />
                                            </RowContainerBetween>
                                            
                                            <CardContent 
                                                sx={{ px:0, maxHeight:((device.sensors.length+device.actuators.length)>3)?200:null, overflowY:'auto', 
                                                '&::-webkit-scrollbar': {
                                                    width: '5px',
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: DEFAULT_COLORS.primary_blue,
                                                    borderRadius: '8px',
                                                    border: '2px solid transparent',
                                                },
                                                }}>
                                                {device.sensors.length === 0 && device.actuators.length === 0 &&(
                                                    <Box m={5} position={'relative'} textAlign={'center'} top={'50%'}>
                                                        <Typography color={'#797979'}  fontSize={14} fontWeight={400}>No interfaces found</Typography>
                                                        <Typography color={'#797979'} fontWeight={300} component={'span'}> Click <Link style={{textDecoration:'none',color:'#499dff'}} to={device.id}> here </Link> to create </Typography>
                                                    </Box>
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
                                                                lastUpdated={sensor?differenceInMinutes(new Date(sensor.time?sensor.time: sensor.modified).toISOString())??'':''}
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
                                                                lastUpdated={act ? differenceInMinutes(new Date(act.time?act.time as Date: act.modified).toISOString())??'':''}
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
                            tooltipOpen
                            onClick={handleToggleModal}
                            tooltipTitle='New'
                        />
                    </SpeedDial>
                ): null
            }
        </>
    );
}

export default Devices;