import { Box, Breadcrumbs, Button, FormControl, Typography, Icon, MenuItem, Select, SelectChangeEvent, Input, Paper, Theme, useMediaQuery } from "@mui/material";
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
import SnackbarComponent from "../../components/shared/Snackbar";
import { InputField } from "../Login";


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
    const [sensor, setSensor] = useState<Sensor | null>(null)
    const [device, setDevice] = useState<Device | null>(null);
    const [sensorX, setSensorX] = useState<SensorX | null>(null);
    const [rSensorX, setRemoteSensorX] = useState<SensorX | null>(null);
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    const { getDevicesFc, showDialog } = useContext(DevicesContext);
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
                setSensor({ ...sensor, name: cleanString(sensor.name) });
                getGraphValues(id as string, sensorId as string);
            }
            setDevice({
                ...de,
                name: cleanString(de.name)
            })
        });
    }, [getGraphValues, id, sensorId]);

    const handleToggleEnableSwitch = () => {
        setSensorX({
            ...sensorX!,
            name: cleanString(sensorX?.name),
            meta: {
                ...sensorX?.meta,
                doNotSync: !sensorX?.meta.doNotSync
            }
        })

    }

    const resetHandler = () => {
        setSensorX({
            ...rSensorX!,
            name: cleanString(rSensorX?.name)
        });
    }

    const init = useCallback(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensorX({
                    ...sensor,
                    name: cleanString(sensor.name)
                } as SensorX);
                setRemoteSensorX({
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

    const [quantitiesCondition, setQuantitiesCondition] = React.useState<string[]>([]);
    const [unitsCondition, setUnitsCondition] = React.useState<string[]>([]);

    useEffect(() => {
        const kind = sensorX?.meta?.kind ? sensorX.meta.kind : sensorX?.kind;
        if (sensorX?.meta.kind) {
            setQuantitiesCondition(
                (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices] ?
                    (ontologies.sensingDevices)[kind as keyof typeof ontologies.sensingDevices].quantities : []);
        }
    }, [sensorX?.kind, sensorX?.meta.kind]);

    useEffect(() => {
        const quantity = sensorX?.meta.quantity ? sensorX.meta.quantity : sensorX?.quantity;
        if (sensorX?.meta.quantity) {
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        } else if (sensorX?.quantity) {
            setUnitsCondition((ontologies.quantities)[quantity as keyof typeof ontologies.quantities].units);
        } else {
            setUnitsCondition([]);
        }
    }, [sensorX?.meta.quantity, sensorX?.quantity])

    const onSliderChange = (val: string) => {
        setSensorX({
            ...sensorX!,
            meta: {
                ...sensorX?.meta,
                syncInterval: val
            }
        })
    }

    const handleChange = (name: string, value: string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : sensorX?.meta.unitSymbol;
        let quantity = sensorX?.meta.quantity ? sensorX.meta.quantity : sensorX?.quantity;
        let unit = sensorX?.meta.unit ? sensorX.meta.unit : sensorX?.unit;
        let icon = '';
        if (name === 'kind' && value in ontologies.sensingDevices) {
            icon = ontologies.sensingDevices[value as keyof typeof ontologies.sensingDevices].icon;
        } else if (name === 'kind' && !(value in ontologies.sensingDevices)) {
            icon = '';
            unitSymbol = '';
            unit = '';
            quantity = '';
        } else {
            icon = sensorX?.meta.icon ? sensorX.meta.icon : '';
        }
        if (name === 'quantity') {
            unit = ''
            unitSymbol = ''
        }

        setSensorX({
            ...sensorX!,
            [name]: value as string,
            meta: {
                ...sensorX?.meta,
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
        if (sensorX?.name !== rSensorX?.name) {
            showDialog({
                title: "Change name",
                acceptBtnTitle: "CHANGE",
                content: `Are you sure you want to change the name of ${rSensorX?.name} to ${sensorX?.name}?`,
                onAccept: () => {
                    window.wazigate.setSensorName(id as string, sensorX?.id as string, sensorX?.name as string).then(() => {
                        init();
                        getDevicesFc();
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
        if ((sensorX?.meta !== rSensorX?.meta)) {
            showDialog({
                title: "Change Meta fields",
                acceptBtnTitle: "CHANGE",
                content: `Are you sure you want to change fields of ${sensorX?.name}?`,
                onAccept: () => {
                    window.wazigate.setSensorMeta(id as string, sensorX?.id as string, sensorX?.meta as Sensor['meta']).then(() => {
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
            title: `Deleting ${sensorX?.name}`,
            acceptBtnTitle: "DELETE",
            content: `Deleting ${sensorX?.name} will lose all data. Are you sure you want to delete ? `,
            onAccept: () => {
                window.wazigate.deleteSensor(id as string, sensorX?.id as string).then(() => {
                    getDevicesFc();
                    navigate('/devices/' + id)
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
        setSensorX({
            ...sensorX!,
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
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    />
                ) : null
            }
            <Box>
                <Box sx={{ px: [2, 4], py: [0, 2], }}>
                    <Typography variant="h5">{sensorX?.name} Settings</Typography>
                    <Box role="presentation" onClick={() => { }}>
                        <Breadcrumbs aria-label="breadcrumb">
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
                                    to={"/devices/" + device?.id + "/sensors/" + sensorX?.id}
                                >
                                    {sensorX?.name}
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
                                                value={(sensorX)?.name}
                                                style={{ width: '100%' }}
                                            />
                                        </InputField>
                                    </FormControl>
                                    <Box width={'100%'}>
                                        <Box >
                                            <OntologyKindInput
                                                title={`Measurement Kind`}
                                                value={sensorX?.meta.kind ? sensorX.meta.kind : sensorX?.kind}
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
                                                value={(sensorX?.meta.quantity) ? sensorX.meta.quantity : sensorX?.quantity}
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
                                                    value={sensorX?.meta.unit ? sensorX.meta.unit : sensorX?.unit}
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
                                                    sx={{ cursor: 'pointer', color: sensorX?.meta.doNotSync ? DEFAULT_COLORS.secondary_gray : DEFAULT_COLORS.orange, fontSize: 40, }}
                                                >
                                                    {
                                                        sensorX?.meta.doNotSync ? 'toggle_off' : 'toggle_on'
                                                    }
                                                </Icon>
                                            </RowContainerBetween>
                                        </Box>

                                        <Box>
                                            <Typography>Sync Interval</Typography>
                                            <DiscreteSliderMarks
                                                value={sensorX?.meta.syncInterval ? sensorX.meta.syncInterval : "5s"}
                                                onSliderChange={onSliderChange}
                                                matches={matches}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', mt: 2, gap: 1, justifyContent: 'end' }} >
                                        <Button onClick={resetHandler} variant={'text'}>RESET</Button>
                                        <Button type="submit" disabled={JSON.stringify(sensor)===JSON.stringify(rSensorX)} variant="contained" color='secondary' disableElevation>Save Changes</Button>
                                    </Box>
                                </form>
                            </Box>

                        </Box>

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