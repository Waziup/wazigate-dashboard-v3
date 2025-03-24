import { Box, Typography, Breadcrumbs } from "@mui/material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Chart from 'react-apexcharts';
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type {  Device, Sensor } from "waziup";
import { Link } from "react-router-dom";
import PrimaryIconButton from "../../components/shared/PrimaryIconButton";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import ValuesTable from "../../components/ui/DeviceTable";
import { cleanString } from "../../utils";
export default function DeviceSensor() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const [device, setDevice] = useState<Device | null>(null);
    const [sensor, setSensor] = useState<Sensor | null>(null)
    const [values, setValues] = useState<{ value: number | string, modified: string }[]>([]);
    const [valsLimit, setValsLimit] = useState<number>(700);
    const [graphValues, setGraphValues] = useState<{ y: number, x: string }[]>([]);
    const [matches] = useOutletContext<[matches: boolean]>();

    const navigate = useNavigate();
    const { id, sensorId } = useParams();
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
    useEffect(() => {
        window.wazigate.subscribe(`devices/${id}/sensors/${sensorId}/#`, () => {
            getGraphValues(id as string, sensorId as string);
        })
        return () => {
            window.wazigate.unsubscribe(`devices/${id}/sensors/${sensorId}/#`,()=>{});
        }
    }, [graphValues, id, sensorId, values,  sensor, getGraphValues]);
    async function fetchMoreData() {
        const newValsx:{time:string,value: number}[]= await window.wazigate.getSensorValues(id as string, sensorId as string, valsLimit);
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
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensor({...sensor,name: cleanString(sensor.name)});
                getGraphValues(id as string, sensorId as string);
            }
            setDevice({
                ...de,
                name: cleanString(de.name)
            })
        });
    }, [getGraphValues, id, sensorId]);
    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            <RowContainerBetween additionStyles={{ pl:4,py:2, }}>
                <Box>
                    <Typography fontWeight={500} fontSize={24} color={'black'}>{sensor?.name}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        
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
                            <Typography fontSize={14} sx={{fontWeight:'300',":hover":{textDecoration:'underline'}}} color="text.primary">
                                <Link  style={{fontSize:14,fontWeight: '300',textDecoration:'none',color:'inherit'}} to={`/devices/${device?.id}`}>
                                    {device?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14} fontWeight={300} color="inherit">sensors <span style={{fontSize:14,color:'inherit',fontWeight:500}}>/</span>  {cleanString(sensor?.name)}</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                {
                    matches ? (
                        <PrimaryIconButton title={'SETTINGS'} iconname={'settings_two_ton'} onClick={() => navigate(`/devices/${device?.id}/sensors/${sensor?.id}/setting`)} />
                    ) : null
                }
            </RowContainerBetween>
            <Box sx={{borderTopRightRadius:matches?10:0,bgcolor:'#fff',display:'flex',width:'100%',pt:matches?4:2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <Box px={matches?6:2} width={matches ? '100%' : '95%'} mb={3}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography color={'#1D2129'} fontSize={15} fontWeight={500}> Sensor Readings</Typography>
                        
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
                <Box width={matches ? '80%' : '90%'}>
                    {
                        values.length>0?(
                            <ValuesTable
                                title={'Sensor Data'}
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
