import { Box, Breadcrumbs,Button,Icon, FormControl,Typography, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import {  Link, useOutletContext, useParams, useNavigate, } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Actuator, Device } from "waziup";
import React from "react";
import OntologyKindInput from "../../components/shared/OntologyKindInput";
import PrimaryIconButton from "../../components/shared/PrimaryIconButton";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import SnackbarComponent from "../../components/shared/Snackbar";
import { DEFAULT_COLORS } from "../../constants";
import {  ActuatorX, DevicesContext } from "../../context/devices.context";
import { cleanString } from "../../utils";
import ontologies from "../../assets/ontologies.json";
import DiscreteMarks from "../../components/ui/DiscreteMarks";
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
export default function ActuatorSettings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const { id, actuatorId } = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [actuator, setActuator] = useState<ActuatorX | null>(null);
    const [rActuator, setRemoteActuator] = useState<ActuatorX | null>(null);
    const [error, setError] = useState<{message: Error | null | string,severity: "error" | "warning" | "info" | "success"} | null>(null);
    const { getDevicesFc,showDialog } = useContext(DevicesContext);
    const handleToggleEnableSwitch = () => {
        setActuator({
            ...actuator!,
            name: cleanString(actuator?.name),
            meta: {
                ...actuator?.meta,
                doNotSync: !actuator?.meta.doNotSync
            }
        })
    
    }
    const resetHandler = () => {
        setActuator({
            ...rActuator!,
            name: cleanString(rActuator?.name)
        });
    }
    const navigate = useNavigate();
    const init = useCallback(() => {
        window.wazigate.getDevice(id).then((de) => {
            const actuator = de.actuators.find((actuator) => actuator.id === actuatorId);
            if (actuator) {
                setActuator({
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
    },[id, actuatorId])
    useEffect(() => {
        init();
    }, [init]);
    const [actuatorValue, setActuatorValue] = useState<number | undefined>(undefined);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setActuatorValue(Number(e.target.value)) }
    const addActuatorValueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.wazigate.addActuatorValue(id as string, actuatorId as string, actuatorValue)
            .then(() => {
                setError({
                    message:'Actuator value added successfully',
                    severity:'success'
                });
                setActuatorValue(undefined);
                getDevicesFc();
            }).catch((err) => {
                setError({
                    message: "Error: "+err,
                    severity:'error'
                });
            });
    }
    const [quantitiesCondition, setQuantitiesCondition] = React.useState<string[]>([]);
    const [unitsCondition, setUnitsCondition] = React.useState<string[]>([]);
    React.useEffect(() => {
        const kind = actuator?.meta?.kind? actuator.meta.kind: actuator?.kind;
        if (actuator?.meta && actuator?.meta.kind ) {
            setQuantitiesCondition(
                (ontologies.actingDevices)[kind as keyof typeof ontologies.actingDevices] ?
                (ontologies.actingDevices)[kind as keyof typeof ontologies.actingDevices].quantities: 
                []
            );
        }
    }, [ actuator?.kind, actuator?.meta]);
    React.useEffect(() => {
        const quantity = actuator?.meta.quantity? actuator.meta.quantity: actuator?.quantity;
        if (actuator?.meta && actuator?.meta.quantity ) {
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        }else if(actuator?.quantity){
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        } else {
            setUnitsCondition([]);
        }
    }, [actuator?.meta, actuator?.quantity])
    const onSliderChange=(val:string)=>{
        setActuator({
            ...actuator!,
            meta: {
                ...actuator?.meta,
                syncInterval: val
            }
        })
    }
    const handleChange = (name:string,value:string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : actuator?.meta.unitSymbol;
        let quantity = actuator?.meta.quantity? actuator.meta.quantity: actuator?.quantity;
        let unit = actuator?.meta.unit? actuator.meta.unit: actuator?.unit;
        let icon = '';
        if(name === 'kind' && value in ontologies.actingDevices){
            icon = ontologies.actingDevices[value as keyof typeof ontologies.actingDevices].icon;
        }else if(name==='kind' && !(value in ontologies.actingDevices)){
            icon = '';
            unitSymbol = '';
            unit = '';
            quantity = '';
        }else{
            icon = actuator?.meta.icon? actuator.meta.icon: '';
        }
        if (name === 'quantity') {
            unit=''
            unitSymbol=''
        }
    
        setActuator({
            ...actuator!,
            [name]: value as string,
            meta: {
                ...actuator?.meta,
                quantity,
                unit,
                [name]: value as string,
                unitSymbol,
                icon,
            }
        })
    }
    const handleChangeActuatorSubmission = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(actuator?.name !== rActuator?.name){
            showDialog({
                title:"Change Name",
                acceptBtnTitle:"CHANGE",
                content: `Are you sure you want to change the name of ${actuator?.name}?`,
                onAccept:()=>{
                    window.wazigate.setActuatorName(id as string, actuator?.id as string, actuator?.name as string).then(() => {
                        init();
                        getDevicesFc()
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
        if((actuator?.meta !== rActuator?.meta) ){
            showDialog({
                title:"Change Meta fields",
                acceptBtnTitle:"CHANGE",
                content: `Are you sure you want to change fields of ${actuator?.name}?`,
                onAccept:()=>{
                    window.wazigate.setActuatorMeta(id as string, actuator?.id as string, actuator?.meta as Actuator['meta']).then(() => {
                        init();
                        getDevicesFc()
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
    }
    const deleteActuator = () => {
        showDialog({
            title: `Deleting ${actuator?.name}`,
            acceptBtnTitle:"DELETE",
            content: `Deleting ${actuator?.name} will lose all data. Are you sure you want to delete ? `,
            onAccept:()=>{
                window.wazigate.deleteActuator(id as string, actuator?.id as string).then(() => {
                    getDevicesFc()
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
        setActuator({
            ...actuator!,
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
                    <Typography fontWeight={600} fontSize={24} color='black'>{actuator?.name} Settings</Typography>
                    <div role="presentation" onClick={() => { }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/">
                                    Home
                                </Link>
                            </Typography>
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
                                    to={"/devices/" + device?.id + "/actuators/" + actuator?.id}
                                >
                                    {actuator?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14}  >settings</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Box sx={{borderTopRightRadius:10,display:'flex',flexDirection:matches?'row':'column',px:matches?4:3,height:'auto', width:'100%',pt:matches?0:.5}} >
                    <Box bgcolor={'white'} boxShadow={1} borderRadius={2} p={2}  width={matches?'50%':'99%'}>
                        <Typography fontWeight={500} fontSize={20}  color={'#292F3F'}>{'Actuator'} settings</Typography>
                        <>
                            <form onSubmit={handleChangeActuatorSubmission}>
                                <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid #292F3F'}}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Name</Typography>
                                    <input 
                                        autoFocus 
                                        onInput={handleTextInputChange} 
                                        name="name"
                                        placeholder='Enter device name' 
                                        value={(actuator)?.name}
                                        required
                                        id="name"
                                        style={{border:'none',background:'none',width:'100%',padding:'6px 0', outline:'none'}}
                                    />
                                </FormControl>
                                <Box width={'100%'}>
                                    <Box my={2}>
                                        <OntologyKindInput
                                            title={`Measurement Kind`}
                                            value={ (actuator?.meta && actuator?.meta.kind)? actuator.meta.kind: actuator?.kind}
                                            onChange={(name, value) => handleChange(name, value as string)}
                                            deviceType={'actuator'}
                                            name="kind"
                                        />
                                    </Box>
                                    { ((quantitiesCondition.length>0))?
                                        <SelEl
                                            my={3}
                                            handleChange={(event) => handleChange('quantity', event.target.value)}
                                            title={`Measurement Type`}
                                            conditions={quantitiesCondition}
                                            value={(actuator?.meta.quantity)? actuator.meta.quantity : actuator?.quantity}
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
                                            value={actuator?.meta.unit? actuator.meta.unit: actuator?.unit}
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
                                <Box width={ '90%'}>
                                    <Box>
                                        <Typography sx={{fontWeight:500,fontSize:matches?20:18,mb:2,color:'#292F3F'}}>Cloud Synchronization</Typography>                                                    <RowContainerBetween additionStyles={{ my: .5 }}>
                                            <Typography fontSize={15} color={'#292F3F'}>Sync Actuator</Typography>
                                            <Icon 
                                                onClick={handleToggleEnableSwitch}
                                                sx={{cursor:'pointer', color: actuator?.meta && actuator?.meta.doNotSync ? DEFAULT_COLORS.secondary_gray : DEFAULT_COLORS.primary_blue, fontSize: 40, }} 
                                                >{
                                                    actuator?.meta && actuator?.meta.doNotSync ? 'toggle_off' : 'toggle_on'}
                                            </Icon>
                                        </RowContainerBetween>
                                        <Typography fontSize={15} color={'#292F3F'}>Sync Interval</Typography>
                                    </Box>
                                </Box>
                                <DiscreteMarks 
                                    value={actuator?.meta && actuator?.meta.syncInterval ?actuator.meta.syncInterval:"5s"}
                                    onSliderChange={onSliderChange} 
                                    matches={matches} 
                                />
                                
                                <RowContainerBetween additionStyles={{mt:.5}}>
                                    <Box/>
                                    <RowContainerBetween additionStyles={{  }} >
                                        <Button onClick={resetHandler} sx={{ mx: 1, color: DEFAULT_COLORS.navbar_dark }} variant={'text'}>RESET</Button>
                                        <PrimaryIconButton  type="submit" iconname="save" title="SAVE" />
                                    </RowContainerBetween>
                                </RowContainerBetween>
                            </form>
                        </>
                        <Box mt={1} width={'90%'}>
                            <form onSubmit={addActuatorValueSubmit}>
                                <Typography color={'primary'} mb={.4} fontSize={18}>Add actuator value</Typography>
                                <input
                                    type="number"
                                    onInput={onInputChange}
                                    name="name"
                                    value={actuatorValue}
                                    placeholder='Actuator value'
                                    required
                                    style={{background:'none', border: 'none', width: '100%',backgroundColor:'none', padding: '6px 0', borderBottom: '1px solid #292F3F', outline: 'none' }}
                                />
                                <Button type="submit" sx={{ mx: 1, mt: 2, color: '#fff' }} color="info" startIcon={<ArrowForward />} variant={'contained'}>Push</Button>
                            </form>
                        </Box>
                        
                        <Box sx={{ minHeight: 150, mt:2, borderWidth: 1, borderRadius: 1, borderStyle: "solid", borderColor: 'red', p: 3, mb: 6 }}>
                            <Typography variant="h4" sx={{ bgcolor: "#fff",fontSize:14, px: 2, mt: -4.0, mb: 3, color: "error.main", width: "fit-content" }}>Danger Zone</Typography>

                            <Stack direction="row" alignItems="center" gap={3}>
                                <Button variant="outlined" color="error" onClick={deleteActuator}>Delete</Button>
                                <Typography variant="body2">This can not be undone!</Typography>
                            </Stack>

                        </Box>
                        {/* <Button sx={{mt:2}} color="error" onClick={deleteActuator}  variant='outlined'>DELETE</Button>  */}
                    </Box>
                </Box>
            </Box>
        </>
    );
}