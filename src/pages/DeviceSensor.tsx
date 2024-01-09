import { SettingsTwoTone, ToggleOff } from "@mui/icons-material";
import { Box, Typography, Button, Link,  Breadcrumbs } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
import EnhancedTable from "../components/DeviceTable";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Chart from 'react-apexcharts';  
import { DEFAULT_COLORS } from "../constants";
import { useCallback, useEffect,useState } from "react";
import type { Device } from "waziup";
function Device() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const {state} = useLocation();
    console.log(state);
    const [device, setDevice] = useState<Device | null>(null);
    const [values,setValues] = useState<{value:number,modified:string}[]>([]);
    const [graphValues,setGraphValues] = useState<{y:number,x:string}[]>([]);
    const [matches] = useOutletContext<[matches:boolean]>();

    const navigate = useNavigate();
    const {id} = useParams();
    console.log(id);
    const getGraphValues = useCallback(function(deviceId:string, sensorId:string) {
        window.wazigate.getSensorValues(deviceId,sensorId)
        .then((res)=>{
            const values = (res as {time:string,value:number}[]).map((value)=>{
                return {y:value.value,x:value.time}
            })
            const valuesTable = (res as {time:string,value:number}[]).map((value)=>{
                return {
                    value:value.value,
                    modified:value.time
                }
            })
            setValues(valuesTable);
            setGraphValues(values);
        })
    },[]);
    
    useEffect(() => {
        getGraphValues(state.deviceId,state.sensorId);
        window.wazigate.getDevice(id).then(setDevice);
    },[getGraphValues, id, state]);
    console.log(device);
    return (
        <Box sx={{height:'100%',overflowY:'scroll'}}>
            <RowContainerBetween additionStyles={{px:2,py:2}}>
                <Box>
                    <Typography fontWeight={500} fontSize={18} color={'black'}>{state.devicename}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link fontSize={14} underline="hover" color="inherit" href={`/devices/${state.deviceId}`}>
                                {state.devicename}
                            </Link>
                            <Typography fontSize={14} color="text.primary">Sensors / {state.sensorname}</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                {
                    matches?(
                        <Button onClick={()=>navigate(`/devices/${state.deviceId}/sensors/${state.sensorId}/settings`,{state:{deviceName:device?.name,sensorname:state.sensorname, sensorId:state.sensorId}})} variant={'contained'}>
                            <SettingsTwoTone/>
                            SETTINGS
                        </Button>
                    ):null
                }
            </RowContainerBetween>
            <Box bgcolor={'#fff'} display={'flex'} width={'100%'} pt={matches?5:2} flexDirection={'column'} alignItems={'center'}  justifyContent={'center'}>
                <Box width={matches?'85%':'95%'} mb={3}>
                    <Box sx={{width:'100%',display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                        <Typography color={'#1D2129'} fontSize={18} fontWeight={500}>Current Temperature</Typography>
                        <Box sx={{display:'flex',alignItems:'center'}}>
                            <Typography fontWeight={100} fontSize={18} color={'#949494'}>°F</Typography>
                            <ToggleOff sx={{color:DEFAULT_COLORS.secondary_gray,fontSize:40, }} />
                            <Typography fontWeight={100} fontSize={18} color={'#949494'}>°C</Typography>
                        </Box>
                    </Box>
                    <Chart
                        options={{
                            chart: {
                                id: "basic-bar",
                            },
                            xaxis: {
                                categories: graphValues.map((value)=>value.x),
                                type: 'numeric',
                                
                            },
                            stroke:{
                                curve:'smooth',
                                width:2
                            },
                            legend:{
                                show:false
                            },
                        }}
                        series={[
                            {
                                name: "series-1",
                                data: graphValues.map((value)=>value.y)
                            }
                        ]}
                        type="line"
                        width={'100%'}
                        height={matches?350:290}
                    />
                </Box>
                <Box bgcolor={'#fff'} width={matches?'80%':'90%'}>
                    <EnhancedTable
                        values={values}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Device;