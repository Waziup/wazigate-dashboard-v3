import { Box, Breadcrumbs, Button, FormControl, Typography, Icon, MenuItem, Select, SelectChangeEvent, Input, Paper, Theme, useMediaQuery, Snackbar, Alert } from "@mui/material";
import { Link, useOutletContext, useParams, useNavigate, } from "react-router-dom";
import { DEFAULT_COLORS } from "../../constants";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import DiscreteSliderMarks from "../../components/ui/DiscreteMarks";
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { Device, Sensor } from "waziup";
import ontologies from "../../assets/ontologies.json";
import { DevicesContext, SensorX } from "../../context/devices.context";
import React from "react";
import OntologyKindInput from "../../components/shared/OntologyKindInput";
import { cleanString } from "../../utils";
import { InputField } from "../Login";
import { ArrowForward } from "@mui/icons-material";
import { GlobalContext } from "../../context/global.context";


export interface HTMLSelectPropsString extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (e: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[],
    value: string
    my?: number
    isDisabled?: boolean
    matches?: boolean
}
export const SelEl = ({ handleChange, title, my, name, conditions, isDisabled, value }: HTMLSelectPropsString) => (
    <Box minWidth={120} my={my !== undefined ? my : 2} >
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
                    conditions.map((op, idx) => (
                        <MenuItem key={idx} value={op} sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Typography variant="body1" >{op}</Typography>

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
    const [sensor, setSensor] = useState<SensorX | null>(null)
    const [device, setDevice] = useState<Device | null>(null);
    const [rsensor, setRemotesensor] = useState<SensorX | null>(null);
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    const { getDevicesFc } = useContext(DevicesContext);
    const { showDialog } = useContext(GlobalContext);
    const [graphValues, setGraphValues] = useState<{ y: number, x: string }[]>([]);
    const [values, setValues] = useState<{ value: number | string, modified: string }[]>([]);
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));


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

    useLayoutEffect(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensor({ ...sensor, name: cleanString(sensor.name) } as SensorX);
                getGraphValues(id as string, sensorId as string);
            }
            setDevice({
                ...de,
                name: cleanString(de.name)
            })
        });
    }, [getGraphValues, id, sensorId]);

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
            ...rsensor!,
            name: cleanString(rsensor?.name)
        });
    }

    const init = useCallback(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensor({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);
                setRemotesensor({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);

                // const rs = Object.keys(ontologies.sensingDevices)
                // setConditions(rs);
            }

            setDevice(de);
        });
    }, [id, sensorId])

    useEffect(() => {
        init();
    }, [init]);
    const [sensorValue, setSensorValue] = useState<number | undefined>(undefined);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSensorValue(Number(e.target.value)) }
    const addSensorValueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.wazigate.addSensorValue(id as string, sensorId as string, sensorValue)
        .then(() => {
            setError({
                message: 'Sensor value added successfully',
                severity: 'success'
            });
            setSensorValue(undefined);
            getDevicesFc();
        }).catch((err) => {
            setError({
                message: "Error: " + err,
                severity: 'error'
            });
        });
    }

    const [quantitiesCondition, setQuantitiesCondition] = React.useState<string[]>([]);
    const [unitsCondition, setUnitsCondition] = React.useState<string[]>([]);

    useEffect(() => {
        const kind = sensor?.meta?.kind ? sensor.meta.kind : sensor?.kind;
        if (sensor?.meta.kind) {
            setQuantitiesCondition(
                (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices] ?
                    (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices].quantities : []);
        }
    }, [sensor?.kind, sensor?.meta.kind]);

    useEffect(() => {
        const qty = sensor?.meta.quantity ? sensor.meta.quantity : sensor?.quantity? sensor?.quantity:'';
        if (qty) {
            setUnitsCondition((ontologies.quantities)[qty as keyof typeof ontologies.quantities].units);
        } else {
            setUnitsCondition([]);
        }
    }, [sensor?.meta.quantity, sensor?.quantity])

    const onSliderChange = (val: string) => {
        setSensor({
            ...sensor!,
            meta: {
                ...sensor?.meta,
                syncInterval: val
            }
        })
    }

    const handleChange = (name: string, value: string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : sensor?.meta.unitSymbol;
        let quantity = sensor?.meta.quantity ? sensor.meta.quantity : sensor?.quantity;
        let unit = sensor?.meta.unit ? sensor.meta.unit : sensor?.unit;
        let icon = '';
        if (name === 'kind' && value in ontologies.sensingDevices) {
            icon = ontologies.sensingDevices[value as keyof typeof ontologies.sensingDevices].icon;
        } else if (name === 'kind' && !(value in ontologies.sensingDevices)) {
            icon = '';
            unitSymbol = '';
            unit = '';
            quantity = '';
        } else {
            icon = sensor?.meta.icon ? sensor.meta.icon : '';
        }
        if (name === 'quantity') {
            unit = ''
            unitSymbol = ''
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
        if (sensor?.name !== rsensor?.name) {
            showDialog({
                title: "Change name",
                acceptBtnTitle: "CHANGE",
                content: `Are you sure you want to change the name of ${rsensor?.name} to ${sensor?.name}?`,
                onAccept: () => {
                    window.wazigate.setSensorName(id as string, sensor?.id as string, sensor?.name as string).then(() => {
                        init();
                        getDevicesFc();
                        setError({message:"Name updated successfully",severity:'success'})
                    }).catch((err) => {
                        setError({
                            message: "Error: " + err,
                            severity: 'error'
                        });
                    })
                },
                onCancel: () => { },
            });
        }
        if ((sensor?.meta !== rsensor?.meta)) {
            showDialog({
                title: "Change Meta fields",
                acceptBtnTitle: "CHANGE",
                content: `Are you sure you want to change fields of ${sensor?.name}?`,
                onAccept: () => {
                    window.wazigate.setSensorMeta(id as string, sensor?.id as string, sensor?.meta as Sensor['meta']).then(() => {
                        init();
                        setError({
                            message: "Meta fields changed successfully",
                            severity: 'success'
                        })
                        getDevicesFc();
                    }).catch((err) => {
                        setError({
                            message: "Error: " + err,
                            severity: 'warning'
                        });
                    });
                },
                onCancel: () => { },
            });
        }
    }
    const deleteSensor = () => {
        showDialog({
            title: `Deleting ${sensor?.name}`,
            acceptBtnTitle: "DELETE",
            content: `Deleting ${sensor?.name} will lose all data. Are you sure you want to delete ? `,
            onAccept: () => {
                window.wazigate.deleteSensor(id as string, sensor?.id as string).then(() => {
                    getDevicesFc();
                    navigate('/devices/' + id)
                    setError({message:sensor?.name+" removed successfully",severity:'success'})
                }).catch((err) => {
                    setError({
                        message: "Error: " + err,
                        severity: 'error'
                    });
                });
            },
            onCancel: () => { },
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
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={error !==null} autoHideDuration={3000} onClose={()=>setError(null)}>
                <Alert onClose={()=>setError(null)} severity={error ? error.severity:'info'} sx={{ width: '100%' }}>
                    {error?error.message as string:''}
                </Alert>
            </Snackbar>
            <Box>
                <Box sx={{ px: [2, 4], py: [0, 2], }}>
                    <Typography variant="h5">{sensor?.name} Settings</Typography>
                    <Box role="presentation" onClick={() => { }}>
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
                            {
                                matches ? (
                                    <Typography fontSize={14} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
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
                            <Typography fontSize={14} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                <Link
                                    style={{ fontSize: 14, color: 'black', fontWeight: '300', textDecoration: 'none' }}
                                    color="black"
                                    to={"/devices/" + device?.id + "/sensors/" + sensor?.id}
                                >
                                    {sensor?.name}
                                </Link>
                            </Typography>
                            <Typography fontSize={14}>settings</Typography>
                        </Breadcrumbs>
                    </Box>
                </Box>

                <Box display='flex' flexDirection={['column', 'row']} py={2}>
                    <Box sx={{ borderTopRightRadius: 2, display: 'flex', flexDirection: 'column', px: [2, 4], gap: 2, mb: 2, height: 'auto', width: ['100%', undefined, '50%'] }} >
                        <Box boxShadow={1} borderRadius={2} p={2}>
                            <Typography variant="h6">Sensor settings</Typography>
                            <Box>
                                <form onSubmit={handleChangeSensorSubmission}>
                                    <FormControl sx={{ my: 1, width: '100%', }}>
                                        <InputField label="Name" mendatory>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder='Enter device name'
                                                autoFocus
                                                required
                                                onInput={handleTextInputChange}
                                                value={(sensor)?.name}
                                                style={{ width: '100%' }}
                                            />
                                        </InputField>
                                    </FormControl>
                                    <Box width={'100%'}>
                                        <Box >
                                            <OntologyKindInput
                                                title={`Measurement Kind`}
                                                value={sensor?.meta.kind ? sensor.meta.kind : sensor?.kind}
                                                onChange={(name, value) => handleChange(name, value as string)}
                                                deviceType={'sensor'}
                                                name="kind"
                                            />
                                        </Box>
                                        {((quantitiesCondition.length > 0)) ?
                                            <SelEl
                                                my={3}
                                                handleChange={(event) => handleChange('quantity', event.target.value)}
                                                title={`Measurement Type`}
                                                conditions={quantitiesCondition}
                                                value={(sensor?.meta.quantity) ? sensor.meta.quantity : sensor?.quantity}
                                                name="quantity"
                                                id="quantity"
                                            /> : null
                                        }
                                        {
                                            ((unitsCondition.length > 0)) ?
                                                <SelEl
                                                    conditions={unitsCondition}
                                                    handleChange={(event) => handleChange('unit', event.target.value)}
                                                    title={`Measurement Unit`}
                                                    value={sensor?.meta.unit ? sensor.meta.unit : sensor?.unit}
                                                    name="unit"
                                                    id="unit"
                                                /> : null
                                        }
                                    </Box>
                                    <Box mt={4}>
                                        <Box>
                                            <Typography variant="h6">Cloud Synchronization</Typography>
                                            <RowContainerBetween>
                                                <Typography>Sync Sensor</Typography>
                                                <Icon
                                                    onClick={handleToggleEnableSwitch}
                                                    sx={{ cursor: 'pointer', color: sensor?.meta.doNotSync ? DEFAULT_COLORS.secondary_gray : DEFAULT_COLORS.orange, fontSize: 40, }}
                                                >
                                                    {
                                                        sensor?.meta.doNotSync ? 'toggle_off' : 'toggle_on'
                                                    }
                                                </Icon>
                                            </RowContainerBetween>
                                        </Box>

                                        <Box>
                                            <Typography>Sync Interval</Typography>
                                            <DiscreteSliderMarks
                                                value={sensor?.meta.syncInterval ? sensor.meta.syncInterval : "5s"}
                                                onSliderChange={onSliderChange}
                                                matches={matches}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', mt: 2, gap: 1, justifyContent: 'end' }} >
                                        <Button onClick={resetHandler} variant={'text'}>RESET</Button>
                                        <Button type="submit" disabled={JSON.stringify(sensor)===JSON.stringify(rsensor)} variant="contained" color='secondary' disableElevation>Save Changes</Button>
                                    </Box>
                                </form>
                            </Box>

                        </Box>

                        <Paper sx={{ p: 2, width: '100%' }}>
                            <Typography variant="h6">Add sensor value</Typography>
                            <form onSubmit={addSensorValueSubmit} style={{ display: 'flex', flexDirection: 'row', }}>
                                <Input
                                    type="number"
                                    name="name"
                                    placeholder='Sensor value'
                                    required
                                    value={sensorValue??''}
                                    onInput={onInputChange}
                                    sx={{ width: '100%', mr: 2 }}
                                />
                                <Button type="submit" color="secondary" disableElevation startIcon={<ArrowForward />} variant={'contained'}>Push</Button>
                            </form>
                        </Paper>
                        <Paper sx={{ p: 2, }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#DE3629' }}>Danger Zone</Typography>
                            <Box display='flex' flexDirection={['column', 'row']} alignItems='center' gap={1}>
                                <Box display='flex' flexDirection='column' flexGrow={1} gap={1}>
                                    <Typography>Delete Sensor</Typography>
                                    <Typography variant="body2" color="text.secondary">Once you delete the sensor, there is no going back.</Typography>
                                </Box>
                                <Button variant="outlined" color="error" fullWidth={isMobile} onClick={deleteSensor}> Delete </Button>
                            </Box>
                        </Paper>

                    </Box>


                </Box>
            </Box>
        </>
    );
}
