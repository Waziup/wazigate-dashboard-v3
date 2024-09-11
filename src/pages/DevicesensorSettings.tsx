import { Box, Breadcrumbs,Button,TextField, FormControl,NativeSelect,Typography,Icon } from "@mui/material";
import { useLocation, Link, useOutletContext, useParams, useNavigate, } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { ArrowForward } from "@mui/icons-material";
import DiscreteSliderMarks from "../components/ui/DiscreteMarks";
import { useCallback, useContext, useEffect, useState } from "react";
import { Actuator, Device, Sensor } from "waziup";
import ontologies from "../assets/ontologies.json";
import { ActuatorX, DevicesContext, SensorX } from "../context/devices.context";
import PrimaryIconButton from "../components/shared/PrimaryIconButton";
import React,{ChangeEvent} from "react";
import OntologyKindInput from "../components/shared/OntologyKindInput";
import { cleanString } from "../utils";
export interface HTMLSelectPropsString extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: ChangeEvent<HTMLSelectElement>) => void,
    title: string,
    conditions: string[],
    value: string
    my?: number
    isDisabled?: boolean
    matches?: boolean
}
export const SelEl = ({ handleChange, title, my,name, conditions, isDisabled, value }: HTMLSelectPropsString) => (
    <Box minWidth={120}  my={my !== undefined ? my : 2} >
        <Typography fontSize={12} color={DEFAULT_COLORS.navbar_dark}>{title}</Typography>
        <FormControl color="primary" disabled={isDisabled} fullWidth>
            <NativeSelect
                defaultValue={30}
                inputProps={{
                    name: name,
                    id: 'uncontrolled-native',
                }}
                name={name}
                required
                value={value}
                onChange={handleChange}
            >
                <option selected style={{ color: '#ccc' }} defaultValue={''}>select option</option>
                {conditions.map((condition, index) => (
                    <option color={DEFAULT_COLORS.navbar_dark} key={index} value={condition}>{condition}</option>
                ))}
            </NativeSelect>
        </FormControl>
    </Box>
);
function DeviceSensorSettings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const { pathname } = useLocation();
    const { id, sensorId } = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensOrActuator, setSensOrActuator] = useState<SensorX | ActuatorX | null>(null);
    const [rActuator, setRemoteActuator] = useState<ActuatorX | SensorX | null>(null);
    // const [conditions, setConditions] = useState<string[]>([]);
    const { getDevicesFc } = useContext(DevicesContext);
    const handleToggleEnableSwitch = () => {
        setSensOrActuator({
            ...sensOrActuator!,
            name: cleanString(sensOrActuator?.name),
            meta: {
                ...sensOrActuator?.meta,
                doNotSync: !sensOrActuator?.meta.doNotSync
            }
        })
    
    }
    const resetHandler = () => {
        setSensOrActuator({
            ...rActuator!,
            name: cleanString(rActuator?.name)
        });
    }
    const navigate = useNavigate();
    const init = useCallback(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensOrActuator({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);
                setRemoteActuator({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);
            
                // const rs = Object.keys(ontologies.sensingDevices)
                // setConditions(rs);
            }
            const actuator = de.actuators.find((actuator) => actuator.id === sensorId);
            if (actuator) {
                setSensOrActuator({
                    ...actuator,
                    name: cleanString(actuator.name)
                } as ActuatorX);
                setRemoteActuator({
                    ...actuator,
                    name: cleanString(actuator.name)
                } as ActuatorX);
                // const rs = Object.keys(ontologies.actingDevices)
                // setConditions(rs);
            }
            setDevice(de);
        });
    },[id, sensorId])
    useEffect(() => {
        init();
    }, [init]);
    const [actuatorValue, setActuatorValue] = useState<number>(0);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setActuatorValue(Number(e.target.value)) }
    const addActuatorValueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.wazigate.addActuatorValue(id as string, sensorId as string, actuatorValue)
            .then(() => {
                alert('Success');
                getDevicesFc();
            }).catch((err) => {
                alert('Error'+err);
            });
    }
    const [quantitiesCondition, setQuantitiesCondition] = React.useState<string[]>([]);
    const [unitsCondition, setUnitsCondition] = React.useState<string[]>([]);
    React.useEffect(() => {
        const kind = sensOrActuator?.meta?.kind? sensOrActuator.meta.kind: sensOrActuator?.kind;
        if (sensOrActuator?.meta.kind && pathname.includes('actuators')) {
            setQuantitiesCondition(
                (ontologies.actingDevices)[kind as keyof typeof ontologies.actingDevices] ?
                (ontologies.actingDevices)[kind as keyof typeof ontologies.actingDevices].quantities: 
                []
            );
        }else if(sensOrActuator?.meta.kind && pathname.includes('sensors')){
            setQuantitiesCondition(
                (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices] ?
                    (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices].quantities : []);
        }
    }, [pathname, sensOrActuator?.kind, sensOrActuator?.meta.kind]);
    React.useEffect(() => {
        const quantity = sensOrActuator?.meta.quantity? sensOrActuator.meta.quantity: sensOrActuator?.quantity;
        if (sensOrActuator?.meta.quantity ) {
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        }else if(sensOrActuator?.quantity){
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        } else {
            setUnitsCondition([]);
        }
    }, [sensOrActuator?.meta.quantity, sensOrActuator?.quantity])
    const onSliderChange=(val:string)=>{
        setSensOrActuator({
            ...sensOrActuator!,
            meta: {
                ...sensOrActuator?.meta,
                syncInterval: val
            }
        })
    }
    const handleChange = (name:string,value:string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : sensOrActuator?.meta.unitSymbol;
        let quantity = sensOrActuator?.meta.quantity? sensOrActuator.meta.quantity: sensOrActuator?.quantity;
        let unit = sensOrActuator?.meta.unit? sensOrActuator.meta.unit: sensOrActuator?.unit;
        let icon = '';
        if(name === 'kind' && pathname.includes('sensors') && value in ontologies.sensingDevices){
            icon = ontologies.sensingDevices[value as keyof typeof ontologies.sensingDevices].icon;
        }else if(name === 'kind' && pathname.includes('actuators') && value in ontologies.actingDevices){
            icon = ontologies.actingDevices[value as keyof typeof ontologies.actingDevices].icon;
        }else if(name==='kind' && !(value in ontologies.sensingDevices) && !(value in ontologies.actingDevices)){
            icon = '';
            unitSymbol = '';
            unit = '';
            quantity = '';
        }else{
            icon = sensOrActuator?.meta.icon? sensOrActuator.meta.icon: '';
        }
    
        setSensOrActuator({
            ...sensOrActuator!,
            [name]: value as string,
            meta: {
                ...sensOrActuator?.meta,
                quantity,
                unit,
                [name]: value as string,
                unitSymbol,
                icon,
            }
        })
    }
    const handleChangeSensorOrActuatorSubmittion = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(pathname.includes('sensors')){
            if(sensOrActuator?.name !== rActuator?.name){ 
                if(!window.confirm(`Are you sure you want to change the name of ${rActuator?.name} to ${sensOrActuator?.name}?`)) return;
                window.wazigate.setSensorName(id as string, sensOrActuator?.id as string, sensOrActuator?.name as string).then(() => {
                    init();
                    getDevicesFc();
                }).catch((err) => {
                    alert('Error'+err);
                })
            }
            if((sensOrActuator?.meta.kind !== rActuator?.meta.kind) || (sensOrActuator?.meta.quantity !== rActuator?.meta.quantity) || (sensOrActuator?.meta.unit !== rActuator?.meta.unit)){
                if(!window.confirm(`Are you sure you want to change fields of ${sensOrActuator?.name}?`)) return;
                window.wazigate.setSensorMeta(id as string, sensOrActuator?.id as string, sensOrActuator?.meta as Sensor['meta']).then(() => {
                    alert('Success');
                    init();
                    getDevicesFc();
                }).catch((err) => {
                    alert('Error'+err);
                });
            }
        }else if(pathname.includes('actuators')){
            if(sensOrActuator?.name !== rActuator?.name){
                if(!window.confirm(`Are you sure you want to change the name of ${sensOrActuator?.name}?`)) return;
                window.wazigate.setActuatorName(id as string, sensOrActuator?.id as string, sensOrActuator?.name as string).then(() => {
                    alert('Success');
                    init();
                    getDevicesFc()
                }).catch((err) => {
                    alert('Error'+err);
                });
            }
            if((sensOrActuator?.meta !== rActuator?.meta) ){
                if(!window.confirm(`Are you sure you want to change fields of ${sensOrActuator?.name}?`)) return;
                window.wazigate.setActuatorMeta(id as string, sensOrActuator?.id as string, sensOrActuator?.meta as Actuator['meta']).then(() => {
                    alert('Success');
                    init();
                    getDevicesFc()
                }).catch((err) => {
                    alert('Error'+err);
                });
            }
        }else{
            return;
        }
    }
    const deleteSensorOrActuator = () => {
        const confDelete = window.confirm(`Are you sure you want to delete ${sensOrActuator?.name}? All data will be lost`);
        if (!confDelete) return;
        if (pathname.includes('sensors')) {
            window.wazigate.deleteSensor(id as string, sensOrActuator?.id as string).then(() => {
                alert('Success');
                getDevicesFc();
                navigate('/devices/'+id)
            }).catch((err) => {
                alert('Error'+err);
            });
        } else if (pathname.includes('actuators')) {
            window.wazigate.deleteActuator(id as string, sensOrActuator?.id as string).then(() => {
                alert('Success');
                getDevicesFc()
                navigate('/devices/'+id)
            }).catch((err) => {
                alert('Error'+err);
            });
        } else {
            return;
        }
    }
    const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSensOrActuator({
            ...sensOrActuator!,
            name: cleanString(event.target.value) as string,
        })
    }
    return (
        <Box sx={{ height: '100%',  }}>
            <Box p={2} px={3}>
                <Typography fontWeight={600} fontSize={24} color={'black'}>{device?.name}</Typography>
                <div role="presentation" onClick={() => { }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/devices">
                            Devices
                        </Link>
                        {
                            matches ? (
                                <Typography fontSize={14} sx={{":hover":{textDecoration:'underlined'}}} color="text.primary">
                                    <Link
                                        style={{ fontSize: 14, color: 'black', fontWeight: '300', textDecoration: 'none' }}
                                        color="black"
                                        to={"/devices/" + device?.id}
                                        state={{ ...device }}
                                    >
                                        {cleanString(device?.name)}
                                    </Link>
                                </Typography>
                            ) : <Typography fontSize={15} color="text.primary">...</Typography>
                        }
                        <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                            <Link
                                style={{ fontSize: 14, color: 'black', fontWeight: '300', textDecoration: 'none' }}
                                color="black"
                                to={"/devices/" + device?.id + "/sensors/" + sensOrActuator?.id}
                            >
                                {sensOrActuator?.name}
                            </Link>
                        </Typography>
                        <Typography fontSize={14} fontWeight={300} color="text.primary">Settings</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box display={'flex'} flexDirection={matches?'row':'column'} bgcolor={matches ? '#fff' : 'inherit'} height={'100%'} width={'100%'} px={1} pt={matches ? 2 : .5}  >
                <Box m={matches?2:0} width={matches?'45%':'95%'}>
                    <Typography fontWeight={500} fontSize={20} my={3} color={'#292F3F'}>Setup {cleanString(sensOrActuator?.name)} kind, quantity and unit</Typography>
                    <>
                        <form onSubmit={handleChangeSensorOrActuatorSubmittion}>
                            <TextField sx={{width:'100%'}} onChange={handleTextInputChange} id="name" value={(sensOrActuator)?.name} variant="standard" />
                            <Box width={'100%'}>
                                <Box my={1}>
                                    <OntologyKindInput
                                        title={`${cleanString(sensOrActuator?.name)} Kind`}
                                        value={sensOrActuator?.meta.kind? sensOrActuator.meta.kind: sensOrActuator?.kind}
                                        onChange={(name, value) => handleChange(name, value as string)}
                                        deviceType={pathname.includes('sensors') ? 'sensor' : 'actuator'}
                                        name="kind"
                                    />
                                </Box>
                                { ((quantitiesCondition.length>0))?
                                    <SelEl
                                    handleChange={(event) => handleChange('quantity', event.target.value)}
                                    title={`${cleanString(sensOrActuator?.name)} Quantity`}
                                    conditions={quantitiesCondition}
                                    value={(sensOrActuator?.meta.quantity)? sensOrActuator.meta.quantity : sensOrActuator?.quantity}
                                    name="quantity"
                                    id="quantity"
                                />: null}
                                {
                                    ((unitsCondition.length>0))?
                                    <SelEl
                                    conditions={unitsCondition}
                                    handleChange={(event) => handleChange('unit', event.target.value)}
                                    title={`${cleanString(sensOrActuator?.name)} Unit`}
                                    value={sensOrActuator?.meta.unit? sensOrActuator.meta.unit: sensOrActuator?.unit}
                                    name="unit"
                                    id="unit"
                                />:null}
                            </Box>
                            <RowContainerBetween additionStyles={{ width: '100%' }}>
                                <Box />
                                <RowContainerBetween >
                                    <PrimaryIconButton type="submit" iconname="save" title="SAVE" />
                                    <Button onClick={resetHandler} sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                </RowContainerBetween>
                            </RowContainerBetween>
                        </form>
                    </>
                </Box>
                <Box width={matches?'45%':'95%'} m={matches?2:0}>
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
                                        <Typography sx={{fontWeight:500,fontSize:matches?20:18,my:2,color:'#292F3F'}}>Setup sync and sync-interface</Typography>
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
                                <RowContainerBetween additionStyles={{}}>
                                    <Box/>
                                    <RowContainerBetween additionStyles={{  }} >
                                        <PrimaryIconButton type="submit" iconname="save" title="SAVE" />
                                        <Button onClick={resetHandler} sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                    </RowContainerBetween>
                                </RowContainerBetween>
                            </form>
                        ) : null
                    }
                    <Box width={'90%'} mt={2}>
                        <Typography fontWeight={500} fontSize={20} my={1} color={'#292F3F'}>Delete {sensOrActuator?.name}</Typography>
                        <RowContainerBetween additionStyles={{ width: '100%' }}>
                            <PrimaryIconButton iconname="delete"  additionStyles={{backgroundColor:'#ff0000'}} onClick={deleteSensorOrActuator} title="DELETE" />
                        </RowContainerBetween>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default DeviceSensorSettings;