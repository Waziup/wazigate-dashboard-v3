import { Box, Breadcrumbs, Button, Typography, Grid, SelectChangeEvent, TextField, FormControl, MenuItem, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, } from "@mui/material";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import ontologies from '../assets/ontologies.json';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Sensor, Actuator, Device } from "waziup";
import { DevicesContext, SensorX } from "../context/devices.context";
import PrimaryIconButton from "../components/shared/PrimaryIconButton";
import CreateSensorModal from "../components/ui/CreateSensorModal";
import CreateActuatorModal from "../components/ui/CreateActuatorModal";
import { Android12Switch } from "../components/shared/Switch";
import SensorActuatorItem from "../components/shared/SensorActuatorItem";
import { PlusOne } from "@mui/icons-material";
import Backdrop from "../components/Backdrop";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    widthPassed?: string
}
export const SelectElement = ({ handleChange, title, conditions, isDisabled, widthPassed, name, value }: HTMLSelectProps) => (
    <Box minWidth={120} width={widthPassed ? widthPassed : '100%'} my={.5}>
        <Typography fontSize={12} fontWeight={'300'} color={'#292F3F'}>{title}</Typography>
        <FormControl variant="standard" disabled={isDisabled} fullWidth>
            <Select
                inputProps={{
                    name: name,
                    id: 'uncontrolled-native',
                }}
                sx={{ fontWeight: 'bold' }}
                value={value}
                onChange={handleChange}
            >
                <MenuItem defaultChecked disabled value={''}>Select</MenuItem>
                {
                    conditions.map((condition, index) => (
                        <MenuItem key={index} value={condition}>{condition}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    </Box>
);
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 2,
    bgcolor: 'background.paper',
    boxShadow: 24,
    py: 2,
};
const initialState = {
    name: '',
    kind: '',
    quantity: '',
    icon: '',
    unitSymbol:''
}
import Logo404 from '../assets/preview.png';
import { cleanString } from "../utils";
function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [newSensOrAct, setNewSensOrAct] = useState<{ name: string, unitSymbol?:string, kind: string,icon:string, quantity: string, unit?: string }>(initialState);
    const [device, setDevice] = useState<Device | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<{ title: string, placeholder: string }>({ title: '', placeholder: '' });
    const [matches,matchesMd] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const { getDevicesFc } = useContext(DevicesContext)
    const { id } = useParams();
    const getDevice = () => {
        window.wazigate.getDevice(id)
            .then((dev) => {
                setDevice({
                    ...dev,
                    name: cleanString(dev.name),
                });
            })
            .catch((err) => {
                alert('Error encounted'+err);
                setIsError(true);
            })
    }
    useEffect(() => {
        if (!id) {
            navigate('/devices');
        }
        getDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const setModalEls = (title: string, placeholder: string) => {
        setModalProps({ title, placeholder });
    }
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreateSensorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sensor = {
            name: newSensOrAct.name,
            id: "",
            kind: newSensOrAct.kind,
            unit: newSensOrAct.unit as string,
            quantity: newSensOrAct.quantity,
            meta: {
                kind: newSensOrAct.kind,
                quantity: newSensOrAct.quantity,
                unit: newSensOrAct.unit,
                icon: newSensOrAct.icon,
                unitSymbol:newSensOrAct.unitSymbol
            },
            time: new Date(),
            modified: new Date(),
            created: new Date(),
        };
        window.wazigate.addSensor(id as string, sensor as unknown as Sensor)
            .then(() => {
                handleToggleModal();
                getDevice();
                getDevicesFc();
                setNewSensOrAct(initialState);
            })
            .catch((err) => {
                alert('Error encounted'+err);
            })
    }
    const handleToggleModal = () => setOpenModal(!openModal);
    const handleCreateActuatorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const actuator = {
            name: newSensOrAct.name,
            id: "",
            kind: newSensOrAct.kind,
            quantity: newSensOrAct.quantity,
            unit: newSensOrAct.unit,
            meta: {
                kind: newSensOrAct.kind,
                quantity: newSensOrAct.quantity,
                unit: newSensOrAct.unit,
                icon: newSensOrAct.icon,
                unitSymbol:newSensOrAct.unitSymbol
            },
            time: null,
            modified: new Date(),
            created: new Date(),
        };
        window.wazigate.addActuator(id as string, actuator as unknown as  Actuator)
            .then(() => {
                handleToggleModal();
                getDevice();
                getDevicesFc();
                setNewSensOrAct(initialState);
            })
            .catch((err) => {
                alert('Error encounted'+err);
                handleToggleModal();
            })
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSensOrAct({
            ...newSensOrAct,
            name: e.target.value
        });
    }
    const handleSelectChange = (name: string,value: string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : newSensOrAct.unit;
        let quantity = newSensOrAct.quantity? newSensOrAct.quantity: '';
        let unit = newSensOrAct.unit? newSensOrAct.unit: '';
        let icon = '';
        if(name === 'kind' && modalProps.title==='sensor' && value in ontologies.sensingDevices){
            icon = ontologies.sensingDevices[value as keyof typeof ontologies.sensingDevices].icon;
        }else if(name === 'kind' && modalProps.title==='actuator' && value in ontologies.actingDevices){
            // reset the unit, quantity and icon
            icon = ontologies.actingDevices[value as keyof typeof ontologies.actingDevices].icon;
        } else if(name ==='kind' && !(value in ontologies.sensingDevices) && !(value in ontologies.actingDevices)){
            icon = 'meter'
            quantity = '';
            unit = '';
            unitSymbol = '';
        }else{
            icon = newSensOrAct.icon? newSensOrAct.icon: 'meter';
        }
        setNewSensOrAct({
            ...newSensOrAct,
            quantity,
            unit,
            [name]: value,
            unitSymbol,
            icon,
        });
    }
    if (isError) {
        return (
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} height={'100%'} alignItems={'center'}>
                <Box component={'img'} src={Logo404} width={200} height={200} />
                <Typography>Hi there</Typography>
                <Typography>Error Encountered while fetching, refresh.</Typography>
            </Box>
        )
    }
    const handleSwitchChange = (actuatorId:string,value:boolean | number) => {
        window.wazigate.addActuatorValue(id as string, actuatorId, !value)
        .then(() => {
            alert('Success');
            getDevicesFc();
        })
        .catch((err) => {
           alert('Error encounted'+err);
            getDevicesFc();
        })
    }
    const handleCloseModal = () => {
        setModalProps({ title: '', placeholder: '', });
        setNewSensOrAct(initialState); 
        handleToggleModal()
    }
    const selectHandler = (e: SelectChangeEvent) => { 
        setNewSensOrAct(initialState); 
        setModalEls(e.target.value === 'actuator' ? 'actuator' : 'sensor', e.target.value)
    }
    return (
        <>
            {
                openModal?(
                    <Backdrop>
                        <Box width={matches ? matchesMd ? '50%' : '30%' : '90%'} sx={{zIndex:50, borderRadius: 10, p: 2 }}>
                            <Box sx={style}>
                                <RowContainerBetween additionStyles={{ p: 1, borderBottom: '.5px solid #ccc' }}>
                                    {
                                        modalProps.title ? (
                                            <Typography>Create  {modalProps.title === 'sensor' ? 'a Sensor' : 'an Actuator'} </Typography>
                                        ) : (
                                            <Typography>Select Interface Type</Typography>
                                        )
                                    }
                                </RowContainerBetween>
                                <Box p={1}>
                                    <SelectElement
                                        conditions={['actuator', 'sensor']}
                                        handleChange={selectHandler}
                                        title="Type"
                                        value={modalProps.title}
                                    />
                                    {
                                        modalProps.title ? (
                                            <Box borderRadius={2} my={1} >
                                                <form style={{borderRadius:2}} onSubmit={modalProps.title === 'actuator' ? handleCreateActuatorClick : handleCreateSensorClick}>
                                                    <TextField value={newSensOrAct.name} onInput={handleNameChange} sx={{ width: '100%', my: 1 }} placeholder={modalProps.placeholder} type="text" id="name" required name="name" label="Name" variant="standard"></TextField>
                                                    {
                                                        modalProps.title === 'sensor' ? (
                                                            <CreateSensorModal newSensOrAct={newSensOrAct} handleSelectChange={handleSelectChange} />
                                                        ) : (
                                                            <CreateActuatorModal newSensOrAct={newSensOrAct} handleSelectChange={handleSelectChange} />
                                                        )
                                                    }
                                                    <RowContainerBetween additionStyles={{ pt: 2 }}>
                                                        <Button onClick={handleCloseModal} sx={{ mx: 2, color: '#fff',backgroundColor:'#ff0000' }} variant="contained" color="warning" >CANCEL</Button>
                                                        <Button sx={{ mx: 2, color: '#fff' }} variant="contained" color="info" type="submit">Save</Button>
                                                    </RowContainerBetween>
                                                </form>
                                            </Box>
                                        ) : (
                                            <RowContainerBetween>
                                                <Box/>
                                                <Button onClick={handleCloseModal} sx={{ textTransform: 'initial',backgroundColor:'#ff0000' }} color="warning" variant={'contained'}>CANCEL</Button>
                                            </RowContainerBetween>
                                        )
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Backdrop>
                ):null
            }
            <Box p={matches?3:1} sx={{ position: 'relative', width: '100%',overflowY: device? (device?.actuators as Actuator[])?.length === 0 && device?.sensors.length === 0?'hidden':'auto':'hidden', height: '100%' }}>
                <RowContainerBetween>
                    <Box>
                        <Typography fontWeight={600} fontSize={24} color={'black'}>{device?.name}</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                    Devices
                                </Link>
                                <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                                    {device && device.name.length > 10 ? device.name.slice(0, 10) + '....' : device?.name}
                                </p>
                            </Breadcrumbs>
                        </div>
                    </Box>
                    {
                        matches ? (
                            <Box>
                                <PrimaryIconButton hideText={!matches} title="Settings" iconname="settingstwotone" onClick={() => { navigate(`/devices/${device?.id}/settings`) }} />
                                <PrimaryIconButton hideText={!matches} title="New Interface" iconname="add" onClick={handleToggleModal} />
                            </Box>
                        ):null
                    }
                </RowContainerBetween>
                {
                    (device?.actuators as Actuator[])?.length === 0 && device?.sensors.length === 0 && (
                        <Box display={'flex'} flexDirection={'column'}  justifyContent={'center'} height={'100%'} alignItems={'center'}>
                            <Box component={'img'} src={Logo404} width={150} height={150} bgcolor={'#f5f5f5'} />
                            <Typography>Hi there</Typography>
                            <Typography>No Sensors and Actuators for this device, create one.</Typography>
                        </Box>
                    )
                }
                <Box mt={2}>
                    {
                        device && device?.sensors.length >0?(
                            <>
                                <Typography fontWeight={700} color={'black'}>Sensors</Typography>
                                <Grid container my={2} spacing={1}>
                                    {
                                        device?.sensors.length === 0 ? (
                                            <Box>
                                                <Typography>No Sensors found</Typography>
                                            </Box>
                                        ) : (device?.sensors.map((sens) =>(
                                            <SensorActuatorItem 
                                                    type="sensor" 
                                                    callbackFc={()=>{getDevice(); getDevicesFc();}} 
                                                    deviceId={device.id} 
                                                    sensActuator={sens} 
                                                    open={open}
                                                    modified={sens.time}
                                                    anchorEl={anchorEl}
                                                    icon={(sens.meta && sens.meta.icon)? sens.meta.icon: ''}
                                                    kind={(sens.meta && sens.meta.kind)? sens.meta.kind : (sens as SensorX).kind? (sens as SensorX).kind : 'AirThermometer'}
                                                    handleClose={handleClose} 
                                                    handleClickMenu={handleClickMenu}
                                                >
                                                    {
                                                        (sens.value && typeof sens.value === 'object' )?(
                                                            <Typography m={1} fontWeight={'900'} fontSize={matches?30:24} >
                                                                {
                                                                    Object.entries(sens.value)
                                                                    .map(([key, value]) => `${key}:${(value as number).toFixed(2)}`)
                                                                    .join(', ')
                                                                }
                                                            </Typography>
                                                        ):(
                                                            <Typography m={1} fontWeight={'900'} fontSize={matches?38:28} >
                                                                {Math.round(sens.value * 100) / 100}
                                                                <Typography component={'span'} fontSize={matches?35:20} fontWeight={900}> 
                                                                    {sens.meta.unitSymbol? sens.meta.unitSymbol: ''}
                                                                </Typography>
                                                            </Typography>
                                                        )
                                                    }
                                            </SensorActuatorItem>
                                        )))
                                    }
                                </Grid>
                            </>
                        ):null
                    }
                    {
                        device && device?.actuators.length >0?(
                            <>
                                <Typography fontWeight={700} color={'black'}>Actuators</Typography>
                                <Grid container my={2} spacing={1}>
                                    {
                                        device?.actuators?.map((act) =>{ return(
                                            <SensorActuatorItem 
                                                type={"actuator"} 
                                                callbackFc={()=>{getDevice(); getDevicesFc(); }} 
                                                deviceId={device.id} 
                                                sensActuator={act} 
                                                open={open} 
                                                modified={act.time as Date}
                                                anchorEl={anchorEl} 
                                                icon={(act.meta && act.meta.icon)? act.meta.icon: ''}
                                                kind={(act.meta && act.meta.kind)? act.meta.kind : 'Motor'}
                                                handleClose={handleClose}
                                                handleClickMenu={handleClickMenu}>
                                                {/* {
                                                    act.meta.quantity==='Boolean' ?(
                                                        <Typography fontWeight={100} fontSize={15} color={'#2BBBAD'}>
                                                            Status: 
                                                            <Typography component={'span'} fontSize={15} fontWeight={300} color={act.value?'#2BBBAD':'#ff0000'}>{act.value ? '  Running' : '   Stopped'}</Typography>
                                                        </Typography>
                                                    ):null
                                                }                                                 */}
                                                <RowContainerBetween additionStyles={{m:1}}>
                                                    {
                                                        act.meta.quantity==='Boolean' ? (
                                                            <Typography fontWeight={100} color={'rgba(0,0,0,.7)'} fontSize={15}>{ act.value?'Stop':'Start'}</Typography>
                                                        ):null
                                                    }
                                                    {
                                                        act.meta.quantity==='Boolean' ? (
                                                            <Android12Switch checked={act.value} onChange={() => {handleSwitchChange(act.id,act.value) }} color='info' />
                                                        ): (
                                                            <Typography mx={1} fontWeight={'900'} fontSize={matches?38:28}>
                                                                {
                                                                    act.value && typeof act.value === 'object' ? (
                                                                        Object.entries(act.value)
                                                                        .map(([key, value]) => `${key}:${(value as number).toFixed(2)}`)
                                                                        .join(', ')
                                                                    ):null
                                                                }
                                                                {Math.round(act.value * 100) / 100}
                                                                <Typography component={'span'} fontSize={matches?35:20} fontWeight={900}>
                                                                    {' '+act.meta.unitSymbol? act.meta.unitSymbol: ''}
                                                                </Typography> 
                                                            </Typography>
                                                        )
                                                    }
                                                </RowContainerBetween>
                                            </SensorActuatorItem>
                                            
                                        )})
                                    }
                                </Grid>
                            </>
                        ):null
                    }
                </Box>
            </Box>
            {
                !matches ? (
                    <SpeedDial ariaLabel='New Device' sx={{ position: 'absolute', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
                        <SpeedDialAction key={'New Sensor'} icon={<PlusOne />} tooltipTitle={'New Sensor'} onClick={() => { setModalEls('sensor', 'Sensor Name'); handleToggleModal() }} />
                        <SpeedDialAction key={'New Actuator'} icon={<PlusOne />} tooltipTitle={'New Actuator'} onClick={() => { setModalEls('actuator', 'Actuator Name'); handleToggleModal() }} />
                    </SpeedDial>
                ): null
            }
        </>
    );
}

export default DeviceSettings;