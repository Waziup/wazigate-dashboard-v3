import { Box, Breadcrumbs, Button, FormControl,  NativeSelect, TextField, Typography } from "@mui/material";
import { useLocation,Link, useOutletContext, useParams } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/RowContainerBetween";
import { Save,  Sensors,  ToggleOff, ToggleOn,  } from "@mui/icons-material";
import RowContainerNormal from "../components/RowContainerNormal";
import DiscreteSliderMarks from "../components/DiscreteMarks";
import { ChangeEvent, useEffect, useState } from "react";
import { Actuator, Device, Sensor } from "waziup";
import ontologies from "../ontologies.json";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: ChangeEvent<HTMLSelectElement>)=>void,
    title:string,
    conditions:string[], 
    value: string
    isDisabled?:boolean
    matches?:boolean
}
export const SelectElement = ({handleChange,title,conditions,isDisabled,matches, value}:HTMLSelectProps)=>(
    <Box minWidth={120} mx={2}>
        <Typography  fontSize={12} color={DEFAULT_COLORS.secondary_black}>{title}</Typography>
        <RowContainerNormal additionStyles={{borderBottom:'2px solid black', backgroundColor:matches?'inherit':'#F0F2F5'}}>
            <Sensors sx={{color:'#292F3F',mx:1}} />
            <FormControl disabled={isDisabled} fullWidth>
                <NativeSelect
                    defaultValue={30}
                    inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                    }}
                    sx={{border:0}}
                    value={value}
                    onChange={handleChange}
                >
                    {conditions.map((condition,index)=>(
                        <option id="" key={index} value={condition}>{condition}</option>
                    ))}
                </NativeSelect>
            </FormControl>
        </RowContainerNormal>
    </Box>
);
function DeviceSensorSettings() {
    const [matches] = useOutletContext<[matches:boolean]>();
    const { pathname } = useLocation();
    const {id,sensorId} = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensOrActuator,setSensOrActuator] = useState<Sensor | Actuator | null>(null)
    const [conditions,setConditions]= useState<string[]>([]);
    // const [condy,setCondY] = useState<{id:string,name:string}[]>([]);
    const [sensor,setSensor] = useState<Sensor |Actuator | null>(null)
    useEffect(() => {
        window.wazigate.getDevice(id).then(setDevice);
        if(pathname.includes('actuators')){

            window.wazigate.getActuator(sensorId as string).then((res)=>{
                setSensOrActuator(res);
                const rs= Object.keys(ontologies.actingDevices)
                // const ids = Object.keys(rs);
                // const names = Object.values(rs.Motor.label);
                // const ress = ids.map((id,index)=>{
                //     return {id:id,name:names[index]}
                // })
                // setCondY(ress);
                setConditions(rs);
                setSensor(res);
            });
        }else{
            window.wazigate.getSensor(sensorId as string).then((res)=>{
                setSensOrActuator(res);
                const rs= Object.keys(ontologies.sensingDevices)
                setConditions(rs);
                setSensor(res);
            });
        }
    },[id, pathname, sensorId]);
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSensor({
            ...sensor!,
            meta:{
                ...sensor?.meta,
                [event.target.name]:event.target.value as string
            }
        })
    }
    
    return (
        <Box height={'100%'}>
            <Box p={2} px={3}>
                <Typography fontWeight={500} fontSize={18} color={'black'}>Device 1</Typography>
                <div role="presentation" onClick={()=>{}}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link style={{fontSize:12}} color="inherit" to="/devices">
                            Device
                        </Link>
                        {
                            matches?(
                                <Link
                                    style={{fontSize:12}} 
                                    color="inherit"
                                    to={"/device"+device?.id}
                                >
                                    {device?.name}/
                                </Link>
                            ):<Typography fontSize={15} color="text.primary">...</Typography>
                        }
                        <Link
                            style={{fontSize:12}}
                            color="inherit"
                            to={"/device"+device?.id+"/sensors/"+sensOrActuator?.id}
                        >
                            {sensOrActuator?.name}
                        </Link>
                        <Typography fontSize={12} color="text.primary">Settings</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box bgcolor={matches?'#fff':'inherit'} height={'100%'} width={'100%'} px={2} pt={matches?2:2}  >
                <Typography color={'#292F3F'}>Setup the sensor type, quantity and unit</Typography>
                <Box my={2} width={matches?'30%':'100%'}>
                    <TextField id="standard-basic" value={(sensor)?.name} label="Name" variant="standard" />
                    {
                        
                        pathname.includes('actuators')?(
                            <>
                                <SelectElement matches={matches} 
                                    isDisabled={false} 
                                    title={`${sensOrActuator?.name} Kind`} 
                                    handleChange={handleChange} 
                                    conditions={conditions} 
                                    value={sensor?.meta.kind} 
                                    name="kind"
                                />
                                <SelectElement matches={matches} 
                                    isDisabled={false} 
                                    title={`${sensOrActuator?.name} Quantity`} 
                                    handleChange={handleChange} 
                                    conditions={(ontologies.actingDevices)[sensor?.meta.kind as keyof typeof ontologies.actingDevices].quantities} 
                                    value={sensor?.meta.quantity} 
                                    name="quantity"
                                />
                                <SelectElement matches={matches} 
                                    isDisabled={false} 
                                    title={`${sensOrActuator?.name} Unit`} 
                                    handleChange={handleChange} 
                                    conditions={(ontologies.quantities)[sensor?.meta.quantity as keyof typeof ontologies.quantities].units} 
                                    value={sensor?.meta.unit} 
                                    name="unit"
                                />
                            </>
                        ):(
                            <>
                                <SelectElement matches={matches} 
                                    isDisabled={false} 
                                    title={`${sensOrActuator?.name} Type`} 
                                    handleChange={handleChange} 
                                    conditions={(conditions)} 
                                    value={sensor?.meta.kind} 
                                    name="kind"
                                />

                                
                            </>
                        )
                    }
                </Box>
                {
                    pathname.includes('sensors')?(
                        <>
                            <Box width={matches?'30%':'90%'}>
                                <Typography my={3} color={'#292F3F'}>Setup sync and sync interface</Typography>
                                <RowContainerBetween additionStyles={{mt:3}}>
                                    <Typography fontSize={15} color={'#292F3F'}>Sync Sensor</Typography>
                                    <ToggleOff sx={{color:DEFAULT_COLORS.secondary_gray,fontSize:40, }} />
                                </RowContainerBetween>
                                <RowContainerBetween>
                                    <Typography fontSize={15} color={'#292F3F'}>Sync Interval</Typography>
                                    <ToggleOn sx={{color:DEFAULT_COLORS.primary_blue,fontSize:40, }} />
                                </RowContainerBetween>
                            </Box>
                            <DiscreteSliderMarks matches={matches}/>
                        </>
                    ):(
                        <>
                            <Box width={matches?'30%':'90%'}>
                                <TextField id="standard-basic" value={(sensor as Actuator).value?'Running':'Closed'} label="Add a value with the current time stamp" variant="standard" />
                            </Box>
                        </>
                    )
                }
                <Box width={matches?'30%':'90%'}>
                    <RowContainerNormal>
                        <Button sx={{mx:1}} startIcon={<Save/>} variant={'contained'}>Save</Button>
                        <Button sx={{mx:1,color:'#292F3F'}} variant={'text'}>RESET</Button>
                    </RowContainerNormal>
                </Box>
            </Box>
        </Box>
    );
}

export default DeviceSensorSettings;