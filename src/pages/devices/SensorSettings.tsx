import { Box, Breadcrumbs,Button, FormControl,Typography,Icon, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { Link, useOutletContext, useParams, useNavigate, } from "react-router-dom";
import { DEFAULT_COLORS } from "../../constants";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import DiscreteSliderMarks from "../../components/ui/DiscreteMarks";
import { useCallback, useContext, useEffect, useState } from "react";
import { Device, Sensor } from "waziup";
import ontologies from "../../assets/ontologies.json";
import { DevicesContext, SensorX } from "../../context/devices.context";
import PrimaryIconButton from "../../components/shared/PrimaryIconButton";
import React from "react";
import OntologyKindInput from "../../components/shared/OntologyKindInput";
import { cleanString } from "../../utils";
import SnackbarComponent from "../../components/shared/Snackbar";
export interface HTMLSelectPropsString extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (e:SelectChangeEvent<string>)=>void,
    title: string,
    conditions: string[],
    value: string
    my?: number
    isDisabled?: boolean
    matches?: boolean
}
export const SelEl = ({ handleChange, title, my,name, conditions, isDisabled, value }: HTMLSelectPropsString) => (
    <Box minWidth={120}  my={my !== undefined ? my : 2} >
        <Typography fontSize={12} color={DEFAULT_COLORS.secondary_black}>{title}</Typography>
        <FormControl variant="standard" color="primary" disabled={isDisabled} fullWidth>
            <Select
                inputProps={{
                    name: name,
                    id: 'uncontrolled-native',
                }}
                name={name}
                required
                value={value}
                onChange={handleChange}
            >
                {
                    conditions.map((op,idx)=>(
                        <MenuItem key={idx} value={op} sx={{display:'flex',width:'100%', justifyContent:'space-between'}}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Typography fontSize={14} color={'#325460'} >{op}</Typography>
                                
                            </Box>
                            
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    </Box>
);
export default function DeviceSensorSettings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    // const { pathname } = useLocation();
    const { id, sensorId } = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensor, setSensor] = useState<SensorX | null>(null);
    const [rSensor, setRemoteSensor] = useState<SensorX | null>(null);
    const [error, setError] = useState<{message: Error | null | string,severity: "error" | "warning" | "info" | "success"} | null>(null);
    const { getDevicesFc,showDialog } = useContext(DevicesContext);
    const handleToggleEnableSwitch = () => {
        setSensor({
            ...sensor!,
            name: cleanString(sensor?.name),
            meta: {
                ...sensor?.meta,
                doNotSync: !sensor?.meta.doNotSync
            }
        })
    
    }
    const resetHandler = () => {
        setSensor({
            ...rSensor!,
            name: cleanString(rSensor?.name)
        });
    }
    const navigate = useNavigate();
    const init = useCallback(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensor({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);
                setRemoteSensor({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);
            
                // const rs = Object.keys(ontologies.sensingDevices)
                // setConditions(rs);
            }
            
            setDevice(de);
        });
    },[id, sensorId])
    useEffect(() => {
        init();
    }, [init]);
    const [quantitiesCondition, setQuantitiesCondition] = React.useState<string[]>([]);
    const [unitsCondition, setUnitsCondition] = React.useState<string[]>([]);
    React.useEffect(() => {
        const kind = sensor?.meta?.kind? sensor.meta.kind: sensor?.kind;
        if(sensor?.meta.kind ){
            setQuantitiesCondition(
                (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices] ?
                    (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices].quantities : []);
        }
    }, [sensor?.kind, sensor?.meta.kind]);
    React.useEffect(() => {
        const quantity = sensor?.meta.quantity? sensor.meta.quantity: sensor?.quantity;
        if (sensor?.meta.quantity ) {
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        }else if(sensor?.quantity){
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        } else {
            setUnitsCondition([]);
        }
    }, [sensor?.meta.quantity, sensor?.quantity])
    const onSliderChange=(val:string)=>{
        setSensor({
            ...sensor!,
            meta: {
                ...sensor?.meta,
                syncInterval: val
            }
        })
    }
    const handleChange = (name:string,value:string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : sensor?.meta.unitSymbol;
        let quantity = sensor?.meta.quantity? sensor.meta.quantity: sensor?.quantity;
        let unit = sensor?.meta.unit? sensor.meta.unit: sensor?.unit;
        let icon = '';
        if(name === 'kind' &&  value in ontologies.sensingDevices){
            icon = ontologies.sensingDevices[value as keyof typeof ontologies.sensingDevices].icon;
        }else if(name==='kind' && !(value in ontologies.sensingDevices) ){
            icon = '';
            unitSymbol = '';
            unit = '';
            quantity = '';
        }else{
            icon = sensor?.meta.icon? sensor.meta.icon: '';
        }
        if (name === 'quantity') {
            unit=''
            unitSymbol=''
        }
    
        setSensor({
            ...sensor!,
            [name]: value as string,
            meta: {
                ...sensor?.meta,
                quantity,
                unit,
                [name]: value as string,
                unitSymbol,
                icon,
            }
        })
    }
    const handleChangeSensorSubmission = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(sensor?.name !== rSensor?.name){
            showDialog({
                title:"Change name",
                acceptBtnTitle:"CHANGE",
                content:`Are you sure you want to change the name of ${rSensor?.name} to ${sensor?.name}?`,
                onAccept:()=>{
                    window.wazigate.setSensorName(id as string, sensor?.id as string, sensor?.name as string).then(() => {
                        init();
                        getDevicesFc();
                    }).catch((err) => {
                        setError({
                            message: "Error: "+err,
                            severity:'error'
                        });
                    })
                },
                onCancel:()=>{},
            });
        }
        if((sensor?.meta !== rSensor?.meta)){
            showDialog({
                title:"Change Meta fields",
                acceptBtnTitle:"CHANGE",
                content: `Are you sure you want to change fields of ${sensor?.name}?`,
                onAccept:()=>{
                    window.wazigate.setSensorMeta(id as string, sensor?.id as string, sensor?.meta as Sensor['meta']).then(() => {
                        init();
                        setError({
                            message: "Meta fields changed successfully",
                            severity:'success'
                        })
                        getDevicesFc();
                    }).catch((err) => {
                        setError({
                            message: "Error: "+err,
                            severity:'warning'
                        });
                    });
                },
                onCancel:()=>{},
            });
        }
    }
    const deleteSensor = () => {
        showDialog({
            title: `Deleting ${sensor?.name}`,
            acceptBtnTitle:"DELETE",
            content: `Deleting ${sensor?.name} will lose all data. Are you sure you want to delete ? `,
            onAccept:()=>{
                window.wazigate.deleteSensor(id as string, sensor?.id as string).then(() => {
                    getDevicesFc();
                    navigate('/devices/'+id)
                }).catch((err) => {
                    setError({
                        message: "Error: "+err,
                        severity:'error'
                    });
                });
            },
            onCancel:()=>{},
        });
    }
    const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSensor({
            ...sensor!,
            name: cleanString(event.target.value) as string,
        })
    }
    return (
        <>
            {
                error ? (
                    <SnackbarComponent
                        autoHideDuration={5000}
                        severity={error.severity}
                        message={(error.message as Error).message ? (error.message as Error).message : (error.message as string)}
                        anchorOrigin={{vertical:'top',horizontal:'center'}}
                    />
                ):null
            }
            <Box sx={{  }}>
                <Box sx={{px:4,py:2,}}>
                    <Typography fontWeight={600} fontSize={24} color='black'>{sensor?.name} Settings</Typography>
                    <div role="presentation" onClick={() => { }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/devices">
                                    Devices
                                </Link>
                            </Typography>
                            {
                                matches ? (
                                    <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
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
                                    to={"/devices/" + device?.id + "/sensors/" + sensor?.id}
                                >
                                    {sensor?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14}  >settings</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Box sx={{borderTopRightRadius:10,display:'flex',flexDirection:matches?'row':'column',px:matches?4:3,height:'auto', width:'100%',pt:matches?0:.5}} >
                    <Box bgcolor={'white'} boxShadow={1} borderRadius={2} p={2}  width={matches?'50%':'99%'}>
                        <Typography fontWeight={500} fontSize={20}  color={'#292F3F'}>Actuator settings</Typography>
                        <>
                            <form onSubmit={handleChangeSensorSubmission}>
                                <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid #292F3F'}}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Name</Typography>
                                    <input 
                                        autoFocus 
                                        onInput={handleTextInputChange} 
                                        name="name"
                                        placeholder='Enter device name' 
                                        value={(sensor)?.name}
                                        required
                                        id="name"
                                        style={{border:'none',background:'none',width:'100%',padding:'6px 0', outline:'none'}}
                                    />
                                </FormControl>
                                <Box width={'100%'}>
                                    <Box my={2}>
                                        <OntologyKindInput
                                            title={`Measurement Kind`}
                                            value={sensor?.meta.kind? sensor.meta.kind: sensor?.kind}
                                            onChange={(name, value) => handleChange(name, value as string)}
                                            deviceType={'sensor'}
                                            name="kind"
                                        />
                                    </Box>
                                    { ((quantitiesCondition.length>0))?
                                        <SelEl
                                            my={3}
                                            handleChange={(event) => handleChange('quantity', event.target.value)}
                                            title={`Measurement Type`}
                                            conditions={quantitiesCondition}
                                            value={(sensor?.meta.quantity)? sensor.meta.quantity : sensor?.quantity}
                                            name="quantity"
                                            id="quantity"
                                        />: null
                                    }
                                    {
                                        ((unitsCondition.length>0))?
                                        <SelEl
                                            conditions={unitsCondition}
                                            handleChange={(event) => handleChange('unit', event.target.value)}
                                            title={`Measurement Unit`}
                                            value={sensor?.meta.unit? sensor.meta.unit: sensor?.unit}
                                            name="unit"
                                            id="unit"
                                        />:null
                                    }
                                </Box>
                                {/* <RowContainerBetween additionStyles={{ width: '100%' }}>
                                    <Box />
                                    <RowContainerBetween >
                                        <PrimaryIconButton type="submit" iconname="save" title="SAVE" />
                                        <Button onClick={resetHandler} sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                    </RowContainerBetween>
                                </RowContainerBetween> */}
                                <>
                                    <Box width={ '90%'}>
                                        <Box>
                                            <Typography sx={{fontWeight:500,fontSize:matches?20:18,mb:2,color:'#292F3F'}}>Cloud Synchronization</Typography>                                                    <RowContainerBetween additionStyles={{ my: .5 }}>
                                                <Typography fontSize={15} color={'#292F3F'}>Sync {'Actuator'}</Typography>
                                                <Icon 
                                                    onClick={handleToggleEnableSwitch}
                                                    sx={{cursor:'pointer', color: sensor?.meta.doNotSync ? DEFAULT_COLORS.secondary_gray : DEFAULT_COLORS.primary_blue, fontSize: 40, }} 
                                                    >{
                                                        sensor?.meta.doNotSync ? 'toggle_off' : 'toggle_on'}
                                                </Icon>
                                            </RowContainerBetween>
                                            <Typography fontSize={15} color={'#292F3F'}>Sync Interval</Typography>
                                        </Box>
                                    </Box>
                                    <DiscreteSliderMarks 
                                        value={sensor?.meta.syncInterval ?sensor.meta.syncInterval:"5s"}
                                        onSliderChange={onSliderChange} 
                                        matches={matches} 
                                    />
                                </>
                                <RowContainerBetween additionStyles={{mt:.5}}>
                                    <Box/>
                                    <RowContainerBetween additionStyles={{  }} >
                                        <Button onClick={resetHandler} sx={{ mx: 1, color: DEFAULT_COLORS.navbar_dark }} variant={'text'}>RESET</Button>
                                        <PrimaryIconButton  type="submit" iconName="save" title="SAVE" />
                                    </RowContainerBetween>
                                </RowContainerBetween>
                            </form>
                        </>
                        <Box sx={{ minHeight: 150, mt:2, borderWidth: 1, borderRadius: 1, borderStyle: "solid", borderColor: 'red', p: 3, mb: 6 }}>
                            <Typography variant="h4" sx={{ bgcolor: "#fff",fontSize:14, px: 2, mt: -4.0, mb: 3, color: "error.main", width: "fit-content" }}>Danger Zone</Typography>

                            <Stack direction="row" alignItems="center" gap={3}>
                                <Button variant="outlined" color="error" onClick={deleteSensor}>Delete</Button>
                                <Typography variant="body2">This can not be undone!</Typography>
                            </Stack>

                        </Box>
                        {/* <Button sx={{mt:2}} color="error" onClick={deleteSensor}  variant='outlined'>DELETE</Button>  */}
                    </Box>
                </Box>
            </Box>
        </>
    );
}