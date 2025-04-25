import { Box, Typography, Breadcrumbs, useMediaQuery, Theme, Button, Paper, Card, CardContent, Stack } from "@mui/material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { Actuator, Device, } from "waziup";
import { Link } from "react-router-dom";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import SensorTable from "../../components/ui/DeviceTable";
import { cleanString, differenceInMinutes, lineClamp } from "../../utils";
import { Settings } from "@mui/icons-material";
import SVGIcon from "../../components/shared/SVGIcon";
import OntologiesIcons from '../../assets/ontologies.svg';
import SensorActuatorValuesChartPlot from "../../components/shared/SensorActuatorValuesChartPlot";



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
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const navigate = useNavigate();
    const { id, actuatorId } = useParams();
    const getActuatorValues = useCallback(function (act: Actuator, deviceId: string, actuatorId: string) {
        window.wazigate.getActuatorValues(deviceId, actuatorId)
            .then((res) => {
                const values = (res as { time: string, value: number }[]).map((value) => {
                    const date = new Date(value.time);
                    const hours = String(date.getUTCHours()).padStart(2, '0');

                    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                    return {
                        y: (typeof value.value === 'boolean') ? (value.value ? 1 : 0) : Math.round(value.value * 100) / 100,
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
                        modified: `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${hours}:${minutes}`
                    }
                });
                setValues(valuesTable);
            })
    }, []);
    useEffect(() => {
        window.wazigate.subscribe(`devices/${id}/actuators/${actuatorId}/#`, () => {
            getActuatorValues(actuator as Actuator, id as string, actuatorId as string);
        });
        return () => {
            window.wazigate.unsubscribe(`devices/${id}/actuators/${actuatorId}/#`, () => { });
        }
    }, [graphValues, id, actuatorId, values, getActuatorValues, actuator,]);
    async function fetchMoreData() {
        const newValsx: { time: string, value: number }[] = await window.wazigate.getActuatorValues(id as string, actuatorId as string, valsLimit);
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
            const actuator = deviceResponse.actuators.find((actuator) => actuator.id === actuatorId);
            if (actuator) {
                setActuator({ ...actuator, name: cleanString(actuator.name) });
                getActuatorValues(actuator, id as string, actuatorId as string);
            }
            setDevice({
                ...deviceResponse,
                name: cleanString(deviceResponse.name)
            })
        });
    }, [getActuatorValues, id, actuatorId]);
    return (
        <Box sx={{ height: '100%', overflowY: 'auto', px: [2, 4], py: [0, 2], }}>
            <RowContainerBetween>
                <Box>
                    <Typography variant="h5">{actuator?.name}</Typography>
                    <Box role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'black', fontWeight: '300' }} color="black" to="/devices">
                                    Devices
                                </Link>
                            </Typography>
                            <Typography fontSize={14} sx={{ ":hover": { textDecoration: 'underline', fontWeight: '300' } }} color="text.primary">
                                <Link style={{ fontSize: 14, textDecoration: 'none', color: 'inherit' }} to={`/devices/${device?.id}`}>
                                    {device?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14} fontWeight={300} color="inherit">{'actuators'} <span style={{ fontSize: 14, color: 'inherit', fontWeight: 500 }}>/</span>  {cleanString(actuator?.name)}</Typography>
                        </Breadcrumbs>
                    </Box>
                </Box>
            </RowContainerBetween>

            <Box my={2} >
                {isTablet && <Button
                    onClick={() => navigate(`/devices/${device?.id}/${'actuators'}/${actuator?.id}/setting`)}
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
                                    <SVGIcon style={{ width: 32, height: 32 }} src={`${OntologiesIcons}#${actuator?.meta.icon}`} />
                                    <Typography gutterBottom sx={{ ...lineClamp(1) }}>{actuator?.name}</Typography>
                                    <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary', ...lineClamp(2) }}>{`Type: ${actuator?.meta.kind} `}</Typography>
                                </Stack>
                                <Typography variant="h4" >
                                    {Math.round(actuator?.value * 100) / 100}
                                    <Typography component={'span'} variant="h4">
                                        {' ' + actuator?.meta.unitSymbol ? actuator?.meta.unitSymbol : ''}
                                    </Typography>
                                </Typography>
                            </Box>

                            <Typography variant="subtitle2" color={'text.primary'} fontWeight={400}>
                                {
                                    actuator?.modified
                                        ? `Last updated: ${differenceInMinutes(new Date(actuator.modified).toISOString())} ago`
                                        : 'Last updated: N/A'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>


                <Box sx={{ display: 'flex', width: ['100%',], flexDirection: ['column', 'row'], gap: [1, 2], }}>
                    <Paper sx={{ width: ['100%', '50%'], px: [1], py: [1] }}>
                        <Typography variant="h6" pl={1}> Actuator Readings</Typography>
                        <SensorActuatorValuesChartPlot
                            matches={matches}
                            graphValues={graphValues}
                        />
                    </Paper>
                    <Paper sx={{ width: ['100%', '50%'] }} >
                        {
                            values.length > 0 ? (
                                <SensorTable
                                    title={'Actuator Data'}
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

