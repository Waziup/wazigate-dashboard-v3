import React, { useCallback, useContext, useLayoutEffect, useState } from "react";
import { Box, Breadcrumbs, Button, Typography, Grid, SelectChangeEvent, FormControl, MenuItem, Select, Dialog, DialogActions, DialogContent, Theme, useMediaQuery, DialogTitle, Input, } from "@mui/material";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import ontologies from '../../assets/ontologies.json';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Sensor, Actuator, Device } from "waziup";
import { DevicesContext, SensorX } from "../../context/devices.context";
import PrimaryIconButton from "../../components/shared/PrimaryIconButton";
import CreateSensorModal from "../../components/ui/CreateSensorModal";
import CreateActuatorModal from "../../components/ui/CreateActuatorModal";
import { Android12Switch } from "../../components/shared/Switch";
import SensorActuatorItem from "../../components/shared/SensorActuatorItem";
import { BrowserNotSupported, Settings } from "@mui/icons-material";
import { InputField } from "../Login";

export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    widthPassed?: string
}

export const SelectElement = (props: HTMLSelectProps) => {
    const { handleChange, title, conditions, value, isDisabled, widthPassed } = props;
    return <Box minWidth={120} width={widthPassed ? widthPassed : '100%'} my={.5}>
        {/* <Typography fontSize={12} fontWeight={'300'} color={'#292F3F'}>{title}</Typography> */}

        <FormControl variant="standard" disabled={isDisabled} fullWidth>
            <InputField label={title} mendatory>
                <Select
                    inputProps={{
                        name: name,
                        id: 'uncontrolled-native',
                    }}
                    sx={{ width: '100%', py: 0 }}
                    value={value}
                    onChange={handleChange}
                >
                    <MenuItem defaultChecked disabled value={''}>Select</MenuItem>
                    {
                        conditions.map((condition, index) => (
                            <MenuItem key={index} value={condition}>{condition}</MenuItem>
                        ))
                    }
                </Select>
            </InputField>
        </FormControl>
    </Box>
}

const initialState = {
    name: '',
    kind: '',
    quantity: '',
    icon: '',
    unitSymbol: ''
}

function DeviceSettings() {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [newSensOrAct, setNewSensOrAct] = useState<{ name: string, unitSymbol?: string, kind: string, icon: string, quantity: string, unit?: string }>(initialState);
    const [device, setDevice] = useState<Device | null>(null);
    const [modalProps, setModalProps] = useState<{ title: string, placeholder: string }>({ title: '', placeholder: '' });
    const { getDevicesFc, showDialog } = useContext(DevicesContext)
    const { id } = useParams();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const getDevice = useCallback(async () => {
        await window.wazigate.getDevice(id)
        .then((dev) => {
            setDevice(dev);
        })
    }, [id]);

    useLayoutEffect(() => {
        getDevice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }

    const setModalEls = (title: string, placeholder: string) => {
        setModalProps({ title, placeholder });
    }
    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCreateSensorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sensor = {
            name: newSensOrAct.name,
            id: "",
            kind: newSensOrAct.kind,
            unit: newSensOrAct.unit as string,
            quantity: newSensOrAct.quantity,
            meta: {
                kind: newSensOrAct.kind,
                quantity: newSensOrAct.quantity,
                unit: newSensOrAct.unit,
                icon: newSensOrAct.icon,
                unitSymbol: newSensOrAct.unitSymbol
            },
            time: new Date(),
            modified: new Date(),
            created: new Date(),
        };
        window.wazigate.addSensor(id as string, sensor as unknown as Sensor)
            .then(() => {
                handleToggleModal();
                getDevice();
                getDevicesFc();
                setNewSensOrAct(initialState);
                setModalEls('', '');
            })
            .catch((err) => {
                showDialog({
                    content: err,
                    onAccept: () => { },
                    onCancel: () => { },
                    hideCloseButton: true,
                    acceptBtnTitle: "Close",
                    title: "Error encountered"
                });
            })
    }

    const handleToggleModal = () => setOpenModal(!openModal);

    const handleCreateActuatorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const actuator = {
            name: newSensOrAct.name,
            id: "",
            kind: newSensOrAct.kind,
            quantity: newSensOrAct.quantity,
            unit: newSensOrAct.unit,
            meta: {
                kind: newSensOrAct.kind,
                quantity: newSensOrAct.quantity,
                unit: newSensOrAct.unit,
                icon: newSensOrAct.icon,
                unitSymbol: newSensOrAct.unitSymbol
            },
            time: null,
            modified: new Date(),
            created: new Date(),
        };
        window.wazigate.addActuator(id as string, actuator as unknown as Actuator)
            .then(() => {
                handleToggleModal();
                getDevice();
                getDevicesFc();
                setNewSensOrAct(initialState);
                setModalEls('', '');
            })
            .catch((err) => {
                showDialog({
                    content: err,
                    onAccept: () => { },
                    onCancel: () => { },
                    hideCloseButton: true,
                    acceptBtnTitle: "Close",
                    title: "Error encountered"
                });
                handleToggleModal();
            })
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSensOrAct({
            ...newSensOrAct,
            name: e.target.value
        });
    }

    const handleSelectChange = (name: string, value: string) => {
        let unitSymbol = name === 'unit' ? ontologies.units[value as keyof typeof ontologies.units].label : newSensOrAct.unit;
        let quantity = newSensOrAct.quantity ? newSensOrAct.quantity : '';
        let unit = newSensOrAct.unit ? newSensOrAct.unit : '';
        let icon = '';
        if (name === 'kind' && modalProps.title === 'sensor' && value in ontologies.sensingDevices) {
            icon = ontologies.sensingDevices[value as keyof typeof ontologies.sensingDevices].icon;
        } else if (name === 'kind' && modalProps.title === 'actuator' && value in ontologies.actingDevices) {
            // reset the unit, quantity and icon
            icon = ontologies.actingDevices[value as keyof typeof ontologies.actingDevices].icon;
        } else if (name === 'kind' && !(value in ontologies.sensingDevices) && !(value in ontologies.actingDevices)) {
            icon = 'meter'
            quantity = '';
            unit = '';
            unitSymbol = '';
        } else {
            icon = newSensOrAct.icon ? newSensOrAct.icon : 'meter';
        }
        setNewSensOrAct({
            ...newSensOrAct,
            quantity,
            unit,
            [name]: value,
            unitSymbol,
            icon,
        });
    }

    const handleSwitchChange = (actuatorId: string, value: boolean | number) => {
        window.wazigate.addActuatorValue(id as string, actuatorId, !value)
            .then(() => {
                getDevice();
                getDevicesFc();
            })
            .catch((err) => {
                showDialog({
                    content: err,
                    onAccept: () => { },
                    onCancel: () => { },
                    hideCloseButton: true,
                    acceptBtnTitle: "Close",
                    title: "Error encountered"
                });
                getDevicesFc();
            })
    }

    const handleCloseModal = () => {
        setModalProps({ title: '', placeholder: '', });
        setNewSensOrAct(initialState);
        handleToggleModal()
    }

    const selectHandler = (e: SelectChangeEvent) => {
        setNewSensOrAct(initialState);
        setModalEls(e.target.value === 'actuator' ? 'actuator' : 'sensor', e.target.value)
    }
    if (device===null) {
        return(
            <Box display='flex' flexDirection='column' justifyContent='center' height='100%' alignItems='center'>
                <Typography>Getting device...</Typography>
            </Box>
        )
    }

    return (
        <>
            <Dialog
                onClose={handleCloseModal}
                PaperProps={{
                    component: 'form',
                    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        modalProps.title === 'actuator' ? handleCreateActuatorClick(e) : handleCreateSensorClick(e)
                    }
                }}
                open={openModal}
            >
                {/* <Box sx={style}> */}
                {/* <RowContainerBetween additionStyles={{ p: 2, }}>
                        {
                            modalProps.title ? (
                                <Typography>Adding a new interface</Typography>
                            ) : (
                                <Typography>Select Interface Type</Typography>
                            )
                        }
                    </RowContainerBetween> */}
                <DialogTitle>Adding New Interface </DialogTitle>

                <DialogContent >
                    <Box p={0} width={[250, 350]}>
                        <SelectElement
                            conditions={['actuator', 'sensor']}
                            handleChange={selectHandler}
                            title="Interface Type"
                            value={modalProps.title}
                        />

                        {
                            modalProps.title ? (
                                <Box my={1} >
                                    <InputField label='Name' mendatory>
                                        <Input
                                            value={newSensOrAct.name}
                                            onInput={handleNameChange}
                                            sx={{ width: '100%', my: 1 }}
                                            placeholder={modalProps.placeholder}
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                        />
                                    </InputField>

                                    {
                                        modalProps.title === 'sensor' ? (
                                            <CreateSensorModal newSensOrAct={newSensOrAct} handleSelectChange={handleSelectChange} />
                                        ) : (
                                            <CreateActuatorModal newSensOrAct={newSensOrAct} handleSelectChange={handleSelectChange} />
                                        )
                                    }
                                </Box>
                            ) : null
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    {
                        modalProps.title ? (
                            <>
                                <Button onClick={handleCloseModal} sx={{ color: '#ff0000' }} variant="text" color="warning" >CANCEL</Button>
                                <Button disabled={!newSensOrAct.name} autoFocus variant="text" color="info" type="submit">ADD</Button>
                            </>
                        ) : (
                            <>
                                <Box />
                                <Button onClick={handleCloseModal} sx={{ color: '#ff0000' }} variant="text" color="warning">CANCEL</Button>
                            </>
                        )
                    }
                </DialogActions>
                {/* </Box> */}
            </Dialog>

            <Box sx={{ px: [2, 4], py: [0, 2], position: 'relative', overflowY: device ? (device?.actuators as Actuator[])?.length === 0 && device?.sensors.length === 0 ? 'hidden' : 'auto' : 'hidden', height: '100%' }}>
                <RowContainerBetween>
                    <Box>
                        <Typography variant="h5" color={'black'}>{device?.name}</Typography>
                        <Box role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography fontSize={16} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                    <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/">
                                        Home
                                    </Link>
                                </Typography>
                                <Typography fontSize={16} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                    <Link style={{ color: 'black', textDecoration: 'none', fontWeight: '300', fontSize: 16 }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                        Devices
                                    </Link>
                                </Typography>
                                <Typography sx={{  textDecoration: 'none', fontWeight: 300,  }} color="text.primary">
                                    {device ? device.name.length > 10 ? device.name.slice(0, 10) + '....' : device?.name : ''}
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                    </Box>
                    {/* {
                        matches ? (
                            <Box>
                                <PrimaryIconButton hideText={!matches} title="Device Settings" iconName="settingstwotone" onClick={() => { navigate(`/devices/${device?.id}/setting`) }} />
                                <PrimaryIconButton hideText={!matches} title="New Interface" iconName="add" onClick={handleToggleModal} />
                            </Box>
                        ) : null
                    } */}
                </RowContainerBetween>

                <Box display='flex' gap={1} my={2}>
                    <PrimaryIconButton color="secondary" title="New Interface" iconName="add" onClick={handleToggleModal} />
                    {isTablet && <Button
                        onClick={() => navigate(`/devices/${device?.id}/setting`)}
                        variant="text"
                        startIcon={<Settings />}
                        sx={{
                            color: 'gray',       // Text and icon color
                            '& .MuiButton-startIcon': {
                                color: 'gray',
                            }
                        }}
                    >
                        Device Settings
                    </Button>
                    }
                </Box>

                {
                    (device?.actuators as Actuator[])?.length === 0 && device?.sensors.length === 0 && (
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} height={'100%'} alignItems={'center'}>
                            {/* <img src={Logo404} style={{ filter: 'invert(80%) sepia(0%) saturate(0%) brightness(85%)', width: 140, height: 140 }} alt="Search Icon" /> */}
                            <BrowserNotSupported sx={{ fontSize: 150, color: '#cecdcd' }} />
                            <Typography>No Sensors and Actuators for this device.</Typography>
                        </Box>
                    )
                }

                {/* Individual Sensors and Actuators */}
                <Box mt={2}>
                    {
                        device && device?.sensors.length > 0 ? (
                            <Box>
                                <Typography variant="subtitle1" color='GrayText'>Sensors</Typography>
                                <Grid container gap={2}>
                                    {
                                        device?.sensors.length === 0 ? (
                                            <Box>
                                                <Typography>No Sensors found</Typography>
                                            </Box>
                                        ) : (
                                            device?.sensors.map((sens) => (
                                                <SensorActuatorItem
                                                    key={sens.id}
                                                    errorCallback={(msg) => {
                                                        showDialog({
                                                            title: 'Error Encountered',
                                                            acceptBtnTitle: "CLOSE",
                                                            hideCloseButton: true,
                                                            content: msg,
                                                            onAccept: () => { },
                                                            onCancel: () => { },
                                                        })
                                                    }}
                                                    type="sensor"
                                                    callbackFc={() => {
                                                        getDevice();
                                                        getDevicesFc();
                                                    }}
                                                    deviceId={device.id}
                                                    sensActuator={sens}
                                                    open={open}
                                                    modified={sens.time ? sens.time : sens.modified}
                                                    anchorEl={anchorEl}
                                                    icon={(sens.meta && sens.meta.icon) ? sens.meta.icon : ''}
                                                    kind={(sens.meta && sens.meta.kind) ? sens.meta.kind : (sens as SensorX).kind ? (sens as SensorX).kind : 'AirThermometer'}
                                                    handleClose={handleClose}
                                                    handleClickMenu={handleClickMenu}
                                                >
                                                    {
                                                        (sens.value && Array.isArray(sens.value))?(<Typography>{sens.value.toString()}</Typography>):(sens.value && typeof sens.value === 'object') ? (
                                                            <Typography variant="body1" >
                                                                {
                                                                    Object.entries(sens.value)
                                                                        .map(([key, value]) => `${key}:${(value as number).toFixed(2)}`)
                                                                        .join(', ')
                                                                }
                                                            </Typography>
                                                        ):(
                                                            <Typography variant="h4"  >
                                                                
                                                                {isNaN(parseFloat(sens.value))? sens.value??'0.00 ': Math.round(sens.value * 100) / 100}
                                                                <Typography component={'span'} variant="h4"> 
                                                                    {' ' +sens.meta.unitSymbol? sens.meta.unitSymbol: ' '}
                                                                </Typography>
                                                            </Typography>
                                                        )
                                                    }
                                                </SensorActuatorItem>
                                            ))
                                        )
                                    }
                                </Grid>
                            </Box>
                        ) : null
                    }
                    {
                        device && device?.actuators.length > 0 ? (
                            <Box mt={2}>
                                <Typography variant="subtitle1" color='GrayText'>Actuators</Typography>
                                <Grid container gap={2}>
                                    {
                                        device?.actuators?.map((act) => {
                                            return (
                                                <SensorActuatorItem
                                                    key={act.id}
                                                    errorCallback={(msg) => { showDialog({ acceptBtnTitle: "CLOSE", hideCloseButton: true, content: msg, onAccept: () => { }, onCancel: () => { }, title: 'Error Encountered' }) }}
                                                    type={"actuator"}
                                                    callbackFc={() => { getDevice(); getDevicesFc(); }}
                                                    deviceId={device.id}
                                                    sensActuator={act}
                                                    open={open}
                                                    modified={act.time ? act.time : act.modified}
                                                    anchorEl={anchorEl}
                                                    icon={(act.meta && act.meta.icon) ? act.meta.icon : ''}
                                                    kind={(act.meta && act.meta.kind) ? act.meta.kind : 'Motor'}
                                                    handleClose={handleClose}
                                                    handleClickMenu={handleClickMenu}
                                                >
                                                    <RowContainerBetween>
                                                        {
                                                            act.meta.quantity === 'Boolean' ? (
                                                                <Typography fontWeight={100} color={'rgba(0,0,0,.7)'} fontSize={15}>{act.value ? 'Stop' : 'Start'}</Typography>
                                                            ) : null
                                                        }
                                                        {
                                                            act.meta.quantity === 'Boolean' ? (
                                                                <Android12Switch checked={act.value} onChange={() => { handleSwitchChange(act.id, act.value) }} color='info' />
                                                            ) : (
                                                                <Typography variant="h4">
                                                                    {
                                                                        (act.value && Array.isArray(act.value))?(<Typography>{act.value.toString()}</Typography>):act.value && typeof act.value === 'object' ? (
                                                                            Object.entries(act.value)
                                                                                .map(([key, value]) => `${key}:${(value as number).toFixed(2)}`)
                                                                                .join(', ')
                                                                        ) : null
                                                                    }
                                                                    {Math.round(act.value * 100) / 100}
                                                                    {' ' + act.meta.unitSymbol ? act.meta.unitSymbol : ''}
                                                                </Typography>
                                                            )
                                                        }
                                                    </RowContainerBetween>
                                                </SensorActuatorItem>

                                            )
                                        })
                                    }
                                </Grid>
                            </Box>
                        ) : null
                    }
                </Box>
            </Box>
        </>
    );
}

export default DeviceSettings;