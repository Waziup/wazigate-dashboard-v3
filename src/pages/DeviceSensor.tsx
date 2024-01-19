import { SettingsTwoTone, ToggleOff } from "@mui/icons-material";
import { Box, Typography, Button, Breadcrumbs } from "@mui/material";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import EnhancedTable from "../components/ui/DeviceTable";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Chart from 'react-apexcharts';
import { DEFAULT_COLORS } from "../constants";
import { useCallback, useEffect, useState } from "react";
import type { Actuator, Device, Sensor } from "waziup";
import { Link } from "react-router-dom";
function Device() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const { pathname } = useLocation();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensOrActuator, setSensOrActuator] = useState<Sensor | Actuator | null>(null)
    const [values, setValues] = useState<{ value: number, modified: string }[]>([]);
    const [graphValues, setGraphValues] = useState<{ y: number, x: string }[]>([]);
    const [matches] = useOutletContext<[matches: boolean]>();

    const navigate = useNavigate();
    const { id, sensorId } = useParams();
    console.log(id);
    const getGraphValues = useCallback(function (deviceId: string, sensorId: string) {
        window.wazigate.getSensor(sensorId).then((value) => {
            setSensOrActuator(value)
        });
        window.wazigate.getSensorValues(deviceId, sensorId)
            .then((res) => {
                const values = (res as { time: string, value: number }[]).map((value) => {
                    return { y: value.value, x: value.time }
                })
                const valuesTable = (res as { time: string, value: number }[]).map((value) => {
                    const date = new Date(value.time);
                    const hours = String(date.getUTCHours()).padStart(2, '0');

                    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                    return {
                        value: value.value,
                        modified: `${hours}:${minutes}`
                    }
                })
                setValues(valuesTable);
                setGraphValues(values);
            })
    }, []);

    useEffect(() => {
        console.log(pathname.includes('actuators'));
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensOrActuator(sensor);
                window.wazigate.getSensor(sensorId as string).then(setSensOrActuator);
                getGraphValues(id as string, sensorId as string);
            }
            const actuator = de.actuators.find((actuator) => actuator.id === sensorId);
            if (actuator) {
                setSensOrActuator(actuator);
                window.wazigate.getActuatorValues(id as string, sensorId as string)
                    .then((res) => {
                        console.log('Res as actuator values', res);

                        const values = (res as { time: string, value: number }[]).map((value) => {
                            return { y: value.value, x: value.time }
                        });
                        const valuesTable = (res as { time: string, value: number }[]).map((value) => {
                            const date = new Date(value.time);
                            const hours = String(date.getUTCHours()).padStart(2, '0');

                            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                            return {
                                value: value.value ? 1 : 0,
                                modified: `${hours}:${minutes}`
                            }
                        })
                        console.log('values', valuesTable);

                        setValues(valuesTable);
                        setGraphValues(values);
                    })
            }
            setDevice(de)
        });
    }, [getGraphValues, id, pathname, sensorId]);
    console.log('Values for table: ', values);
    return (
        <Box sx={{ height: '100%', overflowY: 'scroll' }}>
            <RowContainerBetween additionStyles={{ py: 2 }}>
                <Box>
                    <Typography fontWeight={500} fontSize={18} color={'black'}>{device?.name}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link  style={{fontSize:14,textDecoration:'underline',color:'inherit'}} to={`/devices/${device?.id}`}>
                                {device?.name}
                            </Link>
                            <Typography fontSize={14} fontWeight={300} color="inherit">{pathname.includes('actuators') ? 'actuators' : 'sensors'} / {sensOrActuator?.name.toLocaleLowerCase()}</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                {
                    matches ? (
                        <Button onClick={() => navigate(`/devices/${device?.id}/${pathname.includes('actuators') ? 'actuators' : 'sensors'}/${sensOrActuator?.id}/settings`)} variant={'contained'}>
                            <SettingsTwoTone />
                            SETTINGS
                        </Button>
                    ) : null
                }
            </RowContainerBetween>
            <Box bgcolor={'#fff'} display={'flex'} width={'100%'} pt={matches ? 5 : 2} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Box width={matches ? '85%' : '95%'} mb={3}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography color={'#1D2129'} fontSize={18} fontWeight={500}>Current Temperature</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography fontWeight={100} fontSize={18} color={'#949494'}>°F</Typography>
                            <ToggleOff sx={{ color: DEFAULT_COLORS.secondary_gray, fontSize: 40, }} />
                            <Typography fontWeight={100} fontSize={18} color={'#949494'}>°C</Typography>
                        </Box>
                    </Box>
                    <Chart
                        options={{
                            chart: {
                                // height: 350,
                                type: 'rangeArea',
                            },
                            xaxis: {
                                categories: graphValues.map((value) => value.x),
                                // type: 'numeric',

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
                    <EnhancedTable
                        values={values}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Device;