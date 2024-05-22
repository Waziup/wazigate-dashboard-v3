import { Box, Breadcrumbs, Button, Typography, Grid, SelectChangeEvent, TextField, FormControl, MenuItem, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, } from "@mui/material";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import ontologies from '../assets/ontologies.json';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Sensor, Actuator, Device } from "waziup";
import { DevicesContext } from "../context/devices.context";
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
    bgcolor: 'background.paper',
    boxShadow: 24,
    py: 2,
};
const initialState = {
    name: '',
    type: '',
    quantity: '',
    icon: '',
    unitSymbol:''
}
import Logo404 from '../assets/404.svg';
function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [newSensOrAct, setNewSensOrAct] = useState<{ name: string, unitSymbol?:string, type: string,icon:string, quantity: string, unit?: string }>(initialState);
    const [device, setDevice] = useState<Device | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<{ title: string, placeholder: string }>({ title: '', placeholder: '' });
    const [matches,matchesMd] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const { getDevicesFc } = useContext(DevicesContext)
    const { id } = useParams();
    useEffect(() => {
        if (!id) {
            navigate('/devices');
        }
        window.wazigate.getDevice(id)
            .then((dev) => {
                setDevice(dev);
            })
            .catch((err) => {
                console.log('Error encounted', err);
                setIsError(true);
            })
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
        console.log('Creating a sensor', newSensOrAct);
        const sensor: Sensor = {
            name: newSensOrAct.name,
            id: "",
            meta: {
                type: newSensOrAct.type,
                quantity: newSensOrAct.quantity,
                unit: newSensOrAct.unit,
                icon: newSensOrAct.icon,
                unitSymbol:newSensOrAct.unitSymbol
            },
            value: 0,
            time: new Date(),
            modified: new Date(),
            created: new Date(),
        };
        console.log(sensor);
        window.wazigate.addSensor(id as string, sensor)
            .then((res) => {
                console.log(res);
                handleToggleModal();
                getDevicesFc()
                navigate('/devices');
            })
            .catch((err) => {
                console.log('Error encounted', err);
            })
    }
    const handleToggleModal = () => setOpenModal(!openModal);
    const handleCreateActuatorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Creating an actuator', newSensOrAct);
        const actuator: Actuator = {
            name: newSensOrAct.name,
            id: "",
            meta: {
                type: newSensOrAct.type,
                quantity: newSensOrAct.quantity,
                unit: newSensOrAct.unit,
                icon: newSensOrAct.icon,
                unitSymbol:newSensOrAct.unitSymbol
            },
            value: false,
            time: null,
            modified: new Date(),
            created: new Date(),
        };
        console.log(actuator);
        window.wazigate.addActuator(id as string, actuator)
            .then((res) => {
                console.log(res);
                handleToggleModal();
                getDevicesFc();
                navigate('/devices');
            })
            .catch((err) => {
                console.log('Error encounted', err);
                handleToggleModal();
            })
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value, e.target.name);
        setNewSensOrAct({
            ...newSensOrAct,
            name: e.target.value
        });
    }
    const handleSelectChange = (e: SelectChangeEvent) => {
        console.log(e.target.value, e.target.name);
        const unitSymbol = e.target.name === 'unit' ? ontologies.units[e.target.value as keyof typeof ontologies.units].label : newSensOrAct.unit;
        let icon = '';
        if(e.target.name === 'type' && modalProps.title==='sensor'){
            icon = ontologies.sensingDevices[e.target.value as keyof typeof ontologies.sensingDevices].icon;
        }else if(e.target.name === 'type' && modalProps.title==='actuator'){
            console.log(ontologies.actingDevices[e.target.value as keyof typeof ontologies.actingDevices]);
            icon = ontologies.actingDevices[e.target.value as keyof typeof ontologies.actingDevices].icon;
        }else{
            icon = newSensOrAct.icon;
        }
        console.log(icon,unitSymbol);
        
        setNewSensOrAct({
            ...newSensOrAct,
            [e.target.name]: e.target.value,
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
            getDevicesFc()
            navigate('/devices');
        })
        .catch((err) => {
           alert('Error encounted'+err);
            getDevicesFc();
            navigate('/devices')
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
                                            <Typography>Choose Type</Typography>
                                        )
                                    }
                                    <Button onClick={handleCloseModal} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'}>Cancel</Button>
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
                                                        <Box></Box>
                                                        <Button sx={{ mx: 2, color: '#fff' }} variant="contained" color="info" type="submit">Save</Button>
                                                    </RowContainerBetween>
                                                </form>
                                            </Box>
                                        ) : null
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Backdrop>
                ):null
            }
            <Box p={matches?3:1} sx={{ position: 'relative', width: '100%',overflowY:'auto', height: '100%' }}>
                <RowContainerBetween>
                    <Box>
                        <Typography fontWeight={600} fontSize={24} color={'black'}>{device?.name}</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                    Devices
                                </Link>
                                <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                                    {device ? device.name.slice(0, 10) + '...' : ''}
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
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} height={'100%'} alignItems={'center'}>
                            <Box component={'img'} src={Logo404} width={200} height={200} />
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
                                        ) : (device?.sensors.map((sens) => (
                                            <SensorActuatorItem type="sensor" callbackFc={()=>{getDevicesFc(); navigate('/devices')}} deviceId={device.id} sensActuator={sens} open={open} anchorEl={anchorEl} handleClose={handleClose} handleClickMenu={handleClickMenu}>
                                                <Typography mx={1} fontWeight={'900'} fontSize={matches?38:28} >
                                                    {sens.value} {sens.meta.unitSymbol}
                                                </Typography>
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
                                        device?.actuators?.map((act) => (
                                            <SensorActuatorItem type={"actuator"} callbackFc={()=>{getDevicesFc(); navigate('/devices')}} deviceId={device.id} sensActuator={act} open={open} anchorEl={anchorEl} handleClose={handleClose} handleClickMenu={handleClickMenu}>
                                                {
                                                    act.meta.quantity==='Boolean' ?(
                                                        <Typography fontWeight={100} fontSize={15} color={'#2BBBAD'}>
                                                            Status: 
                                                            <Typography component={'span'} fontSize={15} fontWeight={300} color={act.value?'#2BBBAD':'#ff0000'}>{act.value ? '  Running' : '   Stopped'}</Typography>
                                                        </Typography>
                                                    ):null
                                                }                                                
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
                                                                {act.value} {act.meta.unitSymbol}
                                                            </Typography>
                                                        )
                                                    }
                                                </RowContainerBetween>
                                            </SensorActuatorItem>
                                            
                                        ))
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