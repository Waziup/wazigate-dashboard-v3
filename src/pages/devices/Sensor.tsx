import { Box, Typography, Breadcrumbs, Button, Theme, useMediaQuery, Paper, Stack, Card, CardContent } from "@mui/material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { Device, Sensor } from "waziup";
import { Link } from "react-router-dom";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import SensorTable from "../../components/ui/DeviceTable";
import { cleanString, differenceInMinutes, lineClamp } from "../../utils";
import { Settings } from "@mui/icons-material";
import SVGIcon from "../../components/shared/SVGIcon";
import OntologiesIcons from '../../assets/ontologies.svg';
import SensorActuatorValuesChartPlot from "../../components/shared/SensorActuatorValuesChartPlot";


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
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

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
                        modified: `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${hours}:${minutes}`
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
            window.wazigate.unsubscribe(`devices/${id}/sensors/${sensorId}/#`, () => { });
        }
    }, [graphValues, id, sensorId, values, sensor, getGraphValues]);

    async function fetchMoreData() {
        const newValsx: { time: string, value: number }[] = await window.wazigate.getSensorValues(id as string, sensorId as string, valsLimit);
        setValsLimit(valsLimit + 200);
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
                modified: `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${hours}:${minutes}`
            }
        });
        setValues(valuesTable);
    }

    useLayoutEffect(() => {
        window.wazigate.getDevice(id).then((deviceResponse) => {
            const sensor = deviceResponse.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensor({ ...sensor, name: cleanString(sensor.name) });
                getGraphValues(id as string, sensorId as string);
            }
            setDevice({
                ...deviceResponse,
                name: cleanString(deviceResponse.name)
            })
        });
    }, [getGraphValues, id, sensorId]);

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', px: [2, 4], py: [0, 2], }}>
            <RowContainerBetween>
                <Box>
                    <Typography variant="h5">{sensor?.name}</Typography>
                    <Box role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/">
                                    Home
                                </Link>
                            </Typography>
                            <Typography fontSize={14} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/devices">
                                    Devices
                                </Link>
                            </Typography>
                            <Typography fontSize={14} sx={{ fontWeight: '300', ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                <Link style={{ fontSize: 14, fontWeight: '300', textDecoration: 'none', color: 'inherit' }} to={`/devices/${device?.id}`}>
                                    {device?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14} fontWeight={300} color="inherit">sensors <span style={{ fontSize: 14, color: 'inherit', fontWeight: 500 }}>/</span>  {cleanString(sensor?.name)}</Typography>
                        </Breadcrumbs>
                    </Box>
                </Box>
            </RowContainerBetween>

            <Box my={2} >
                {isTablet && <Button
                    onClick={() => navigate(`/devices/${device?.id}/sensors/${sensor?.id}/setting`)}
                    variant="text"
                    startIcon={<Settings />}
                    sx={{
                        px: 2,
                        color: 'gray',       // Text and icon color
                        '& .MuiButton-startIcon': {
                            color: 'gray',
                        },
                        bgcolor: '#e5e5e5'
                    }}
                >
                    Settings
                </Button>
                }
            </Box>

            <Box display='flex' flexDirection={['column']} gap={2} px={[]} py={[]}>
                <Box width={['100%',]} display='flex' flexDirection='column' gap={1}>
                    <Card elevation={1} sx={{ width: ['100%', 350] }}>
                        <CardContent>
                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                                <Stack>
                                    <SVGIcon style={{ width: 32, height: 32 }} src={`${OntologiesIcons}#${sensor?.meta.icon}`} />
                                    <Typography gutterBottom sx={{ ...lineClamp(1) }}>{sensor?.name}</Typography>
                                    <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary', ...lineClamp(2) }}>{`Type: ${sensor?.meta.Kind} `}</Typography>
                                </Stack>
                                <Typography variant="h4" >
                                    {Math.round(sensor?.value * 100) / 100}
                                    <Typography component={'span'} variant="h4">
                                        {' ' + sensor?.meta.unitSymbol ? sensor?.meta.unitSymbol : ''}
                                    </Typography>
                                </Typography>
                            </Box>

                            <Typography variant="subtitle2" color={'text.primary'} fontWeight={400}>
                                {
                                    sensor?.modified
                                        ? `Last updated: ${differenceInMinutes(new Date(sensor.modified).toISOString())} ago`
                                        : 'Last updated: N/A'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ display: 'flex', width: ['100%',], flexDirection: ['column', 'row'], gap: [1, 2], }}>
                    <Paper sx={{ width: ['100%', '50%'], px: [1], py: [1] }}>
                        <Typography variant="h6" pl={1}> Sensor Readings</Typography>
                        <SensorActuatorValuesChartPlot
                            graphValues={graphValues}
                            matches={matches}
                        />
                    </Paper>
                    <Paper sx={{ width: ['100%', '50%'] }} >
                        {
                            values.length > 0 ? (
                                <SensorTable
                                    title={'Sensor Data'}
                                    fetchMoreData={fetchMoreData}
                                    values={values}
                                />
                            ) : (
                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                                    <Typography fontSize={14} fontWeight={300} color={'#1D2129'}>No readings available</Typography>
                                </Box>
                            )
                        }
                    </Paper>
                </Box>
            </Box>

        </Box>
    );
}
