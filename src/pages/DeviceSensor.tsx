import { Box, Typography, Breadcrumbs } from "@mui/material";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Chart from 'react-apexcharts';
import { useCallback, useLayoutEffect, useState } from "react";
import type { Actuator, Device, Sensor } from "waziup";
import { Link } from "react-router-dom";
import PrimaryIconButton from "../components/shared/PrimaryIconButton";
import SensorTable from "../components/ui/DeviceTable";
function Device() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const { pathname } = useLocation();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensOrActuator, setSensOrActuator] = useState<Sensor | Actuator | null>(null)
    const [values, setValues] = useState<{ value: number | string, modified: string }[]>([]);
    const [valsLimit, setValsLimit] = useState<number>(700);
    const [graphValues, setGraphValues] = useState<{ y: number, x: string }[]>([]);
    const [matches] = useOutletContext<[matches: boolean]>();

    const navigate = useNavigate();
    const { id, sensorId } = useParams();
    console.log(id);
    const getGraphValues = useCallback(function (deviceId: string, sensorId: string) {
        window.wazigate.getSensorValues(deviceId, sensorId)
            .then((res) => {
                const values = (res as { time: string, value: number }[]).map((value) => {
                    const date = new Date(value.time);
                    const hours = String(date.getUTCHours()).padStart(2, '0');

                    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                    return { 
                        y: Math.round(value.value * 100) / 100,
                        x: `${hours}:${minutes}`
                    }
                });
                setGraphValues(values);
                const valuesTable = (res as { time: string, value: number }[]).map((value) => {
                    const date = new Date(value.time);
                    const hours = String(date.getUTCHours()).padStart(2, '0');

                    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                    return {
                        value: Math.round(value.value * 100) / 100,
                        modified: `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()} ${hours}:${minutes}`
                    }
                })
                setValues(valuesTable);
            })
    }, []);
    async function fetchMoreData() {
        let newValsx:{time:string,value: number}[]=[];
        if(pathname.includes('actuators')){
            newValsx= await window.wazigate.getActuatorValues(id as string, sensorId as string, valsLimit);
        }else{
            newValsx= await window.wazigate.getSensorValues(id as string, sensorId as string, valsLimit);
        }
        setValsLimit(valsLimit+200);
        const valuesGraph = (newValsx as { time: string, value: number }[]).map((value) => {
            const date = new Date(value.time);
            const hours = String(date.getUTCHours()).padStart(2, '0');

            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return { 
                y: Math.round(value.value * 100) / 100,
                x: `${hours}:${minutes}`
            }
        });
        setGraphValues(valuesGraph);
        const valuesTable = (newValsx as { time: string, value: number }[]).map((value) => {
            const date = new Date(value.time);
            const hours = String(date.getUTCHours()).padStart(2, '0');

            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return {
                value: Math.round(value.value * 100) / 100,
                modified: `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()} ${hours}:${minutes}`
            }
        });
        setValues(valuesTable);
    }
    useLayoutEffect(() => {
        console.log(pathname.includes('actuators'));
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensOrActuator(sensor);
                getGraphValues(id as string, sensorId as string);
            }
            const actuator = de.actuators.find((actuator) => actuator.id === sensorId);
            if (actuator) {
                setSensOrActuator(actuator);
                window.wazigate.getActuatorValues(id as string, sensorId as string)
                .then((res) => {
                    const values = (res as { time: string, value: number }[]).map((value) => {
                        const date = new Date(value.time);
                        const hours = String(date.getUTCHours()).padStart(2, '0');

                        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                        return { 
                            y: (typeof value.value==='boolean') ? (value.value ? 1 : 0) :  Math.round(value.value * 100) / 100, 
                            x: `${hours}:${minutes}`
                        }
                    });
                    setGraphValues(values);
                    const valuesTable = (res as { time: string, value: number }[]).map((value) => {
                        const date = new Date(value.time);
                        const hours = String(date.getUTCHours()).padStart(2, '0');

                        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                        return {
                            value: actuator.meta.quantity === 'Boolean' ? (value.value ? 'Running' : 'Stopped') : Math.round(value.value * 100) / 100,
                            modified: `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()} ${hours}:${minutes}`
                        }
                    });
                    setValues(valuesTable);
                })
            }
            setDevice(de)
        });
    }, [getGraphValues, id, pathname, sensorId]);
    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            <RowContainerBetween additionStyles={{ p: 2 }}>
                <Box>
                    <Typography fontWeight={500} fontSize={24} color={'black'}>{device?.name}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link  style={{fontSize:14,textDecoration:'none',color:'inherit'}} to={`/devices/${device?.id}`}>
                                {device?.name}
                            </Link>
                            <Typography fontSize={14} fontWeight={300} color="inherit">{pathname.includes('actuators') ? 'actuators' : 'sensors'} <span style={{fontSize:14,color:'inherit',fontWeight:500}}>/</span>  {sensOrActuator?.name.toLocaleLowerCase()}</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                {
                    matches ? (
                        <PrimaryIconButton title={'SETTINGS'} iconname={'settings_two_ton'} onClick={() => navigate(`/devices/${device?.id}/${pathname.includes('actuators') ? 'actuators' : 'sensors'}/${sensOrActuator?.id}/settings`)} />
                    ) : null
                }
            </RowContainerBetween>
            <Box bgcolor={'#fff'} display={'flex'} width={'100%'} pt={matches ? 5 : 2} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Box width={matches ? '85%' : '95%'} mb={3}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography color={'#1D2129'} fontSize={15} fontWeight={500}>Readings</Typography>
                        
                    </Box>
                    <Chart
                        options={{
                            chart: {
                                id: 'sensor_actuator_plot',
                                // height: 350,
                                type: 'area',
                                zoom: {
                                    enabled: true,
                                },
                                animations: {
                                    enabled: true,
                                    easing: 'linear',
                                    dynamicAnimation: {
                                        speed: 1000
                                    }
                                },
                            },
                            xaxis: {
                                categories: graphValues.map((value) => value.x),
                                tickAmount: 10,
                                // type: 'numeric',
                            },
                            markers:{
                                size: 0,
                            },
                            dataLabels:{
                                enabled:false
                            },
                            stroke: {
                                curve: 'smooth',
                                width: 2
                            },
                            colors: ['#4592F6'],
                        }}
                        series={[
                            {
                                name: "series-1",
                                data: graphValues.map((value) => value.y)
                            }
                        ]}
                        type="area"
                        width={'100%'}
                        height={matches ? 350 : 290}
                    />
                </Box>
                <Box bgcolor={'#fff'} width={matches ? '80%' : '90%'}>
                    {
                        values.length>0?(
                            <SensorTable
                                fetchMoreData={fetchMoreData}
                                values={values}
                            />
                        ):(
                            <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',height:300}}>
                                <Typography fontSize={14} fontWeight={300} color={'#1D2129'}>No readings available</Typography>
                            </Box>
                        )
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default Device;