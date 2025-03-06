import { Box, Typography, Breadcrumbs } from "@mui/material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Chart from 'react-apexcharts';
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { Actuator, Device, } from "waziup";
import { Link } from "react-router-dom";
import PrimaryIconButton from "../../components/shared/PrimaryIconButton";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import SensorTable from "../../components/ui/DeviceTable";
import { cleanString } from "../../utils";
export default function Actuator() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const [device, setDevice] = useState<Device | null>(null);
    const [actuator, setActuator] = useState<Actuator | null>(null)
    const [values, setValues] = useState<{ value: number | string, modified: string }[]>([]);
    const [valsLimit, setValsLimit] = useState<number>(700);
    const [graphValues, setGraphValues] = useState<{ y: number, x: string }[]>([]);
    const [matches] = useOutletContext<[matches: boolean]>();

    const navigate = useNavigate();
    const { id, actuatorId } = useParams();
    const getActuatorValues = useCallback(function (act: Actuator,deviceId: string, actuatorId: string) {
        window.wazigate.getActuatorValues(deviceId, actuatorId)
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
                        value: act.meta.quantity === 'Boolean' ? (value.value ? 'Running' : 'Stopped') : Math.round(value.value * 100) / 100,
                        modified: `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()} ${hours}:${minutes}`
                    }
                });
                setValues(valuesTable);
            })
    }, []);
    useEffect(() => {
        window.wazigate.subscribe(`devices/${id}/actuators/${actuatorId}/#`, () => {
            getActuatorValues(actuator as Actuator,id as string, actuatorId as string);
        });
        return () => {
            window.wazigate.unsubscribe(`devices/${id}/actuators/${actuatorId}/#`,()=>{});
        }
    }, [graphValues, id, actuatorId, values, getActuatorValues, actuator,]);
    async function fetchMoreData() {
        const newValsx:{time:string,value: number}[]= await window.wazigate.getActuatorValues(id as string, actuatorId as string, valsLimit);
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
            const actuator = de.actuators.find((actuator) => actuator.id === actuatorId);
            if (actuator) {
                setActuator({...actuator,name: cleanString(actuator.name)});
                getActuatorValues(actuator,id as string, actuatorId as string);
            }
            setDevice({
                ...de,
                name: cleanString(de.name)
            })
        });
    }, [getActuatorValues, id, actuatorId]);
    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            <RowContainerBetween additionStyles={{ pl:4,py:2, }}>
                <Box>
                    <Typography fontWeight={500} fontSize={24} color={'black'}>{actuator?.name}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/devices">
                                    Devices
                                </Link>
                            </Typography>
                            <Typography fontSize={14} sx={{":hover":{textDecoration:'underline',fontWeight: '300'}}} color="text.primary">
                                <Link  style={{fontSize:14,textDecoration:'none',color:'inherit'}} to={`/devices/${device?.id}`}>
                                    {device?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14} fontWeight={300} color="inherit">{'actuators'} <span style={{fontSize:14,color:'inherit',fontWeight:500}}>/</span>  {cleanString(actuator?.name)}</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                {
                    matches ? (
                        <PrimaryIconButton title={'SETTINGS'} iconname={'settings_two_ton'} onClick={() => navigate(`/devices/${device?.id}/${'actuators'}/${actuator?.id}/setting`)} />
                    ) : null
                }
            </RowContainerBetween>
            <Box sx={{borderTopRightRadius:matches?10:0,bgcolor:'#fff',display:'flex',width:'100%',pt:matches?4:2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <Box px={matches?6:2} width={matches ? '100%' : '95%'} mb={3}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography color={'#1D2129'} fontSize={15} fontWeight={500}> Actuator Readings</Typography>
                        
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
                            <SensorTable
                                title={'Actuator Data'}
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

