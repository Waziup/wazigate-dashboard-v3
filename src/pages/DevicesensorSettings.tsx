import { Box, Breadcrumbs, Button,  SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useLocation, Link, useOutletContext, useParams, useNavigate } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { ArrowForward, Save, ToggleOff, ToggleOn, } from "@mui/icons-material";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import DiscreteSliderMarks from "../components/ui/DiscreteMarks";
import {  useContext, useEffect, useState } from "react";
import { Actuator, Device, Sensor } from "waziup";
import ontologies from "../assets/ontologies.json";
import { DevicesContext } from "../context/devices.context";
import SelectElementString from "../components/shared/SelectElementString";

function DeviceSensorSettings() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const { pathname } = useLocation();
    const { id, sensorId } = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [sensOrActuator, setSensOrActuator] = useState<Sensor | Actuator | null>(null)
    const [conditions, setConditions] = useState<string[]>([]);
    const navigate = useNavigate();
    const { getDevicesFc } = useContext(DevicesContext);
    useEffect(() => {
        window.wazigate.getDevice(id).then((de) => {
            const sensor = de.sensors.find((sensor) => sensor.id === sensorId);
            if (sensor) {
                setSensOrActuator(sensor);
                const rs = Object.keys(ontologies.sensingDevices)
                setConditions(rs);
            }
            const actuator = de.actuators.find((actuator) => actuator.id === sensorId);
            if (actuator) {
                setSensOrActuator(actuator);
                const rs = Object.keys(ontologies.actingDevices)
                setConditions(rs);
            }
            setDevice(de);
        });
    }, [id, pathname, sensorId]);
    const [actuatorValue, setActuatorValue] = useState<number>(0);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setActuatorValue(Number(e.target.value)) }
    const addActuatorValueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.wazigate.addActuatorValue(id as string, sensorId as string, actuatorValue)
            .then(() => {
                alert('Success');
                getDevicesFc()
                navigate('/devices');
            }).catch((err) => {
                alert('Error');
                console.log(err);
            });
    }
    const handleChange = (event: SelectChangeEvent<string>) => {
        const unit = event.target.name === 'unit' ? ontologies.units[event.target.value as keyof typeof ontologies.units].label : sensOrActuator?.meta.unit;
        setSensOrActuator({
            ...sensOrActuator!,
            meta: {
                ...sensOrActuator?.meta,
                [event.target.name]: event.target.value as string,
                unit: unit
            }
        })
    }
    const generateConditions = () => {
        if ((ontologies.actingDevices)[sensOrActuator?.meta.kind as keyof typeof ontologies.actingDevices]) {
            return (ontologies.actingDevices)[sensOrActuator?.meta.kind as keyof typeof ontologies.actingDevices].quantities
        } else {
            setSensOrActuator({
                ...sensOrActuator!,
                meta: {
                    ...sensOrActuator?.meta,
                    quantity: ''
                }
            });
            return []
        }
    }
    return (
        <Box height={'100%'}>
            <Box p={2} px={3}>
                <Typography fontWeight={500} fontSize={18} color={'black'}>Device 1</Typography>
                <div role="presentation" onClick={() => { }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link style={{ fontSize: 12, textDecoration: 'none' }} color="inherit" to="/devices">
                            Device
                        </Link>
                        {
                            matches ? (
                                <Link
                                    style={{ fontSize: 12, textDecoration: 'none' }}
                                    color="inherit"
                                    to={"/devices/" + device?.id + "/settings"}
                                    state={{ ...device }}
                                >
                                    {device?.name}
                                </Link>
                            ) : <Typography fontSize={15} color="text.primary">...</Typography>
                        }
                        <Link
                            style={{ fontSize: 12, textDecoration: 'none' }}
                            color="inherit"
                            to={"/devices/" + device?.id + "/sensors/" + sensOrActuator?.id}
                        >
                            {sensOrActuator?.name}
                        </Link>
                        <Typography fontSize={12} color="text.primary">Settings</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box bgcolor={matches ? '#fff' : 'inherit'} height={'100%'} width={'100%'} px={2} pt={matches ? 2 : 2}  >
                <Typography color={'#292F3F'}>Setup the sensor type, quantity and unit</Typography>
                <Box my={2} width={matches ? '30%' : '100%'}>
                    <TextField id="name" value={(sensOrActuator)?.name} variant="standard" />
                    {

                        pathname.includes('actuators') ? (
                            <>
                                <SelectElementString matches={matches}
                                    isDisabled={false}
                                    title={`${sensOrActuator?.name} Kind`}
                                    handleChange={handleChange}
                                    conditions={conditions}
                                    value={sensOrActuator?.meta.kind}
                                    name="kind"
                                />
                                <SelectElementString matches={matches}
                                    isDisabled={false}
                                    title={`${sensOrActuator?.name} Quantity`}
                                    handleChange={handleChange}
                                    conditions={generateConditions()}
                                    value={sensOrActuator?.meta.quantity}
                                    name="quantity"
                                />
                                {
                                    (ontologies.quantities)[sensOrActuator?.meta.quantity as keyof typeof ontologies.quantities] ? (
                                        <SelectElementString matches={matches}
                                            isDisabled={false}
                                            title={`${sensOrActuator?.name} Unit`}
                                            handleChange={handleChange}
                                            conditions={(() => {
                                                if ((ontologies.quantities)[sensOrActuator?.meta.quantity as keyof typeof ontologies.quantities]) {
                                                    return (ontologies.quantities)[sensOrActuator?.meta.quantity as keyof typeof ontologies.quantities].units
                                                } else {
                                                    setSensOrActuator({
                                                        ...sensOrActuator!,
                                                        meta: {
                                                            ...sensOrActuator?.meta,
                                                            unit: ''
                                                        }
                                                    });
                                                    return []
                                                }
                                            })()}
                                            value={sensOrActuator?.meta.unit}
                                            name="unit"
                                        />
                                    ) : null
                                }
                                <Box width={matches ? '40%' : '90%'}>
                                    <RowContainerNormal additionStyles={{ width: '100%' }}>
                                        <Button sx={{ mx: 1, px: 2 }} startIcon={<Save />} variant={'contained'}>Save</Button>
                                        <Button sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                    </RowContainerNormal>
                                </Box>
                            </>
                        ) : (
                            <>
                                <SelectElementString matches={matches}
                                    isDisabled={false}
                                    title={`${sensOrActuator?.name} Type`}
                                    handleChange={handleChange}
                                    conditions={(conditions)}
                                    value={sensOrActuator?.meta.kind}
                                    name="kind"
                                />
                                <Box width={matches ? '30%' : '90%'}>
                                    <RowContainerNormal>
                                        <Button sx={{ mx: 1 }} startIcon={<Save />} variant={'contained'}>Save</Button>
                                        <Button sx={{ mx: 1, color: '#292F3F' }} variant={'text'}>RESET</Button>
                                    </RowContainerNormal>
                                </Box>
                            </>
                        )
                    }
                </Box>


                {
                    pathname.includes('sensors') ? (
                        <>
                            <Box width={matches ? '30%' : '90%'}>
                                <Typography my={3} color={'#292F3F'}>Setup sync and sync interface</Typography>
                                <RowContainerBetween additionStyles={{ mt: 3 }}>
                                    <Typography fontSize={15} color={'#292F3F'}>Sync Sensor</Typography>
                                    <ToggleOff sx={{ color: DEFAULT_COLORS.secondary_gray, fontSize: 40, }} />
                                </RowContainerBetween>
                                <RowContainerBetween>
                                    <Typography fontSize={15} color={'#292F3F'}>Sync Interval</Typography>
                                    <ToggleOn sx={{ color: DEFAULT_COLORS.primary_blue, fontSize: 40, }} />
                                </RowContainerBetween>
                            </Box>
                            <DiscreteSliderMarks matches={matches} />
                        </>
                    ) : (
                        <>
                            <Box width={matches ? '30%' : '90%'}>
                                <form onSubmit={addActuatorValueSubmit}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Add a value with the current time stamp</Typography>
                                    <input
                                        autoFocus
                                        onInput={onInputChange}
                                        name="name" placeholder='Enter device name'
                                        required
                                        style={{ border: 'none', width: '100%', padding: '6px 0', borderBottom: '1px solid #292F3F', outline: 'none' }}
                                    />
                                    <Button type="submit" sx={{ mx: 1, mt: 2, color: '#fff' }} color="info" startIcon={<ArrowForward />} variant={'contained'}>Push</Button>
                                </form>
                            </Box>
                        </>
                    )
                }
            </Box>
        </Box>
    );
}

export default DeviceSensorSettings;