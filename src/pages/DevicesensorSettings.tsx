import { Box, Breadcrumbs,Button,SelectChangeEvent,TextField,Typography,Icon } from "@mui/material";
import { useLocation, Link, useOutletContext, useParams, useNavigate } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { ArrowForward } from "@mui/icons-material";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import DiscreteSliderMarks from "../components/ui/DiscreteMarks";
import { useContext, useEffect, useState } from "react";
import { Actuator, Device, Sensor } from "waziup";
import ontologies from "../assets/ontologies.json";
import { DevicesContext } from "../context/devices.context";
import SelectElementString from "../components/shared/SelectElementString";
import PrimaryIconButton from "../components/shared/PrimaryIconButton";
import React from "react";
function DeviceSensorSettings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const { pathname } = useLocation();
    const { id, sensorId } = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensOrActuator, setSensOrActuator] = useState<Sensor | Actuator | null>(null)
    const [conditions, setConditions] = useState<string[]>([]);
    const navigate = useNavigate();
    const { getDevicesFc } = useContext(DevicesContext);
    const handleToggleEnableSwitch = () => {
        setSensOrActuator({
            ...sensOrActuator!,
            meta: {
                ...sensOrActuator?.meta,
                doNotSync: !sensOrActuator?.meta.doNotSync
            }
        })
    
    }
    useEffect(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensOrActuator(sensor);
                const rs = Object.keys(ontologies.sensingDevices)
                setConditions(rs);
            }
            const actuator = de.actuators.find((actuator) => actuator.id === sensorId);
            if (actuator) {
                setSensOrActuator(actuator);
                const rs = Object.keys(ontologies.actingDevices)
                setConditions(rs);
            }
            setDevice(de);
        });
    }, [id,sensorId]);
    const [actuatorValue, setActuatorValue] = useState<number>(0);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setActuatorValue(Number(e.target.value)) }
    const addActuatorValueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.wazigate.addActuatorValue(id as string, sensorId as string, actuatorValue)
            .then(() => {
                alert('Success');
                getDevicesFc()
                navigate('/devices');
            }).catch((err) => {
                alert('Error');
                console.log(err);
            });
    }
    const [quantitiesCondition, setQuantitiesCondition] = React.useState<string[]>([]);
    const [unitsCondition, setUnitsCondition] = React.useState<string[]>([]);
    React.useEffect(() => {
        if (sensOrActuator?.meta.type && pathname.includes('actuators')) {
            setQuantitiesCondition(
                (ontologies.actingDevices)[sensOrActuator?.meta?.type as keyof typeof ontologies.actingDevices] ?
                    (ontologies.actingDevices)[sensOrActuator?.meta?.type as keyof typeof ontologies.actingDevices].quantities : []);
        }else if(sensOrActuator?.meta.type && pathname.includes('sensors')){
            setQuantitiesCondition(
                (ontologies.sensingDevices)[sensOrActuator?.meta?.type as keyof typeof ontologies.sensingDevices] ?
                    (ontologies.sensingDevices)[sensOrActuator?.meta?.type as keyof typeof ontologies.sensingDevices].quantities : []);
        }
    }, [pathname, sensOrActuator?.meta.type]);
    React.useEffect(() => {
        if (sensOrActuator?.meta.quantity ) {
            setUnitsCondition((ontologies.quantities)[sensOrActuator?.meta?.quantity as keyof typeof ontologies.quantities].units);
        }
    }, [sensOrActuator?.meta.quantity])
    const onSliderChange=(val:string)=>{
        console.log(val,'slider value');
        setSensOrActuator({
            ...sensOrActuator!,
            meta: {
                ...sensOrActuator?.meta,
                syncInterval: val
            }
        })
    }
    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value, event.target.name);
        const unitSymbol = event.target.name === 'unit' ? ontologies.units[event.target.value as keyof typeof ontologies.units].label : sensOrActuator?.meta.unit;
        let icon = '';
        if(event.target.name === 'type' && pathname.includes('sensors')){
            icon = ontologies.sensingDevices[event.target.value as keyof typeof ontologies.sensingDevices].icon;
        }else if(event.target.name === 'type' && pathname.includes('actuators')){
            console.log(ontologies.actingDevices[event.target.value as keyof typeof ontologies.actingDevices]);
            icon = ontologies.actingDevices[event.target.value as keyof typeof ontologies.actingDevices].icon;
        }else{
            icon = sensOrActuator?.meta.icon;
        }
        console.log(icon,unitSymbol);
        const unit = event.target.name === 'unit' ? ontologies.units[event.target.value as keyof typeof ontologies.units].label : sensOrActuator?.meta.unit;
        setSensOrActuator({
            ...sensOrActuator!,
            meta: {
                ...sensOrActuator?.meta,
                [event.target.name]: event.target.value as string,
                unit: unit,
                unitSymbol,
                icon,
            }
        })
    }
    const handleChangeSensorOrActuatorSubmittion = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(pathname.includes('sensors')){
            window.wazigate.setSensorName(id as string, sensOrActuator?.id as string, sensOrActuator?.name as string).then(() => {
                window.wazigate.setSensorMeta(id as string, sensOrActuator?.id as string, sensOrActuator?.meta as Sensor['meta']).then(() => {
                    alert('Success');
                    getDevicesFc()
                    navigate('/devices');
                }).catch((err) => {
                    alert('Error');
                    console.log(err);
                });
            }).catch((err) => {
                alert('Error');
                console.log(err);
            });
        }else if(pathname.includes('actuators')){
            window.wazigate.setActuatorName(id as string, sensOrActuator?.id as string, sensOrActuator?.name as string).then(() => {
                window.wazigate.setActuatorMeta(id as string, sensOrActuator?.id as string, sensOrActuator?.meta as Actuator['meta']).then(() => {
                    alert('Success');
                    getDevicesFc()
                    navigate('/devices');
                }).catch((err) => {
                    alert('Error');
                    console.log(err);
                });
            }).catch((err) => {
                alert('Error');
                console.log(err);
            });
        }else{
            return;
        }
    }
    const deleteSensorOrActuator = () => {
        const confDelete = window.confirm(`Are you sure you want to delete ${sensOrActuator?.name}?`);
        if (!confDelete) return;
        if (pathname.includes('sensors')) {
            window.wazigate.deleteSensor(id as string, sensOrActuator?.id as string).then(() => {
                alert('Success');
                getDevicesFc()
                navigate('/devices');
            }).catch((err) => {
                alert('Error');
                console.log(err);
            });
        } else if (pathname.includes('actuators')) {
            window.wazigate.deleteActuator(id as string, sensOrActuator?.id as string).then(() => {
                alert('Success');
                getDevicesFc()
                navigate('/devices');
            }).catch((err) => {
                alert('Error');
                console.log(err);
            });
        } else {
            return;
        }
    }
    const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSensOrActuator({
            ...sensOrActuator!,
            name: event.target.value as string,
        })
    }
    return (
        <Box height={'100%'}>
            <Box p={2} px={3}>
                <Typography fontWeight={600} fontSize={18} color={'black'}>{device?.name}</Typography>
                <div role="presentation" onClick={() => { }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/devices">
                            Devices
                        </Link>
                        {
                            matches ? (
                                <Link
                                    style={{ fontSize: 14, color: 'black', fontWeight: '300', textDecoration: 'none' }}
                                    color="black"
                                    to={"/devices/" + device?.id}
                                    state={{ ...device }}
                                >
                                    {device?.name}
                                </Link>
                            ) : <Typography fontSize={15} color="text.primary">...</Typography>
                        }
                        <Link
                            style={{ fontSize: 14, color: 'black', fontWeight: '300', textDecoration: 'none' }}
                            color="black"
                            to={"/devices/" + device?.id + "/sensors/" + sensOrActuator?.id}
                        >
                            {sensOrActuator?.name}
                        </Link>
                        <Typography fontSize={14} fontWeight={300} color="text.primary">Settings</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box display={'flex'} flexDirection={matches?'row':'column'} bgcolor={matches ? '#fff' : 'inherit'} height={'100%'} width={'100%'} px={2} pt={matches ? 2 : .5}  >
                <Box m={2} width={matches?'45%':'95%'}>
                    <Typography fontWeight={500} fontSize={20} my={3} color={'#292F3F'}>Setup the sensor type, quantity and unit</Typography>
                    <>
                        <form onSubmit={handleChangeSensorOrActuatorSubmittion}>
                            <TextField sx={{width:'100%'}} onChange={handleTextInputChange} id="name" value={(sensOrActuator)?.name} variant="standard" />
                            <Box width={'90%'}>
                                
                                <SelectElementString matches={matches}
                                    title={`${sensOrActuator?.name} Type`}
                                    handleChange={handleChange}
                                    conditions={conditions}
                                    value={sensOrActuator?.meta.type}
                                    name="type"
                                    id="type"
                                />
                                <SelectElementString matches={matches}
                                    title={`${sensOrActuator?.name} Quantity`}
                                    handleChange={handleChange}
                                    conditions={quantitiesCondition}
                                    value={sensOrActuator?.meta.quantity}
                                    name="quantity"
                                    id="quantity"
                                />
                                <SelectElementString matches={matches}
                                    isDisabled={false}
                                    title={`${sensOrActuator?.name} Unit`}
                                    handleChange={handleChange}
                                    conditions={unitsCondition}
                                    value={sensOrActuator?.meta.unit}
                                    name="unit"
                                    id="unit"
                                />
                            </Box>
                            <Box width={matches ? '100%' : '90%'}>
                                <RowContainerNormal additionStyles={{ width: '100%' }}>
                                    <PrimaryIconButton type="submit" iconname="save" onClick={() => { }} title="SAVE" />
                                    <Button sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                </RowContainerNormal>
                            </Box>
                        </form>
                    </>
                </Box>
                <Box width={matches?'45%':'95%'} m={2}>
                    {
                        pathname.includes('actuators') ? (
                            <>
                                <Box width={'90%'}>
                                    <form onSubmit={addActuatorValueSubmit}>
                                        <Typography color={'primary'} mb={.4} fontSize={12}>Add a value with the current time stamp</Typography>
                                        <input
                                            autoFocus
                                            onInput={onInputChange}
                                            name="name" 
                                            placeholder='Actuator value'
                                            required
                                            style={{ border: 'none', width: '100%', padding: '6px 0', borderBottom: '1px solid #292F3F', outline: 'none' }}
                                        />
                                        <Button type="submit" sx={{ mx: 1, mt: 2, color: '#fff' }} color="info" startIcon={<ArrowForward />} variant={'contained'}>Push</Button>
                                    </form>
                                </Box>
                            </>
                        ) : (
                            null
                        )
                    }
                    {
                        pathname.includes('sensors') ? (
                            <form style={{margin:'3px 0'}} onSubmit={handleChangeSensorOrActuatorSubmittion} >
                                <Box width={ '90%'}>
                                    <Box>
                                        <Typography sx={{fontWeight:500,fontSize:20,my:2,color:'#292F3F'}}>Setup sync and sync-interface</Typography>
                                        <RowContainerBetween additionStyles={{ my: .5 }}>
                                            <Typography fontSize={15} color={'#292F3F'}>Sync Sensor</Typography>
                                            <Icon 
                                                onClick={handleToggleEnableSwitch}
                                                sx={{ color: sensOrActuator?.meta.doNotSync ? DEFAULT_COLORS.secondary_gray : DEFAULT_COLORS.primary_blue, fontSize: 40, }} 
                                                >{
                                                    sensOrActuator?.meta.doNotSync ? 'toggle_off' : 'toggle_on'}
                                            </Icon>
                                        </RowContainerBetween>
                                        <Typography fontSize={15} color={'#292F3F'}>Sync Interval</Typography>
                                    </Box>
                                </Box>
                                <DiscreteSliderMarks 
                                    value={sensOrActuator?.meta.syncInterval ?sensOrActuator.meta.syncInterval:"5s"}
                                    onSliderChange={onSliderChange} 
                                    matches={matches} 
                                />
                                <Box sx={{ width: '100%', mt: 1 }}>
                                    <RowContainerBetween additionStyles={{ width: matches ? '20%' : '90%',  }} >
                                        <PrimaryIconButton type="submit" iconname="save" onClick={() => { }} title="SAVE" />
                                        <Button sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                    </RowContainerBetween>
                                </Box>
                            </form>
                        ) : null
                    }
                    <Box width={'90%'}>
                        <Typography fontWeight={500} fontSize={20} my={1} color={'#292F3F'}>Delete {sensOrActuator?.name}</Typography>
                        <RowContainerBetween additionStyles={{ width: '100%' }}>
                            <PrimaryIconButton iconname="delete" onClick={deleteSensorOrActuator} title="DELETE" />
                        </RowContainerBetween>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default DeviceSensorSettings;