import { Router } from "@mui/icons-material";
import { Box, Breadcrumbs, FormControl, Typography, MenuItem, Select, SelectChangeEvent, Button, Input, Paper, useMediaQuery, Theme } from "@mui/material";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AddTextShow from "../../components/shared/AddTextInput";
import type { Device, } from "waziup";
import { DevicesContext } from "../../context/devices.context";
import { devEUIGenerateFc, lineClamp, toStringHelper } from "../../utils";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import { DEFAULT_COLORS } from "../../constants";
import BoxDownload from '../../assets/box_download.svg';
import { DropDownCreateDeviceTab1 } from "../../components/ui/CreateDeviceTab1";
import { InputField } from "../Login";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    my?: number,
    widthPassed?: string
}
export const SelectElement = ({ handleChange, title, conditions, isDisabled, my, widthPassed, name, value }: HTMLSelectProps) => (
    <Box minWidth={120} width={widthPassed ? widthPassed : '100%'} my={my ? my : .5}>
        <Typography fontSize={12} fontWeight={'300'} color={'#292F3F'}>{title}</Typography>
        <FormControl variant="standard" disabled={isDisabled} fullWidth>
            <Select
                inputProps={{
                    name: name,
                    id: 'uncontrolled-native',
                }}
                sx={{ fontWeight: 'bold' }}
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
        </FormControl>
    </Box>
);

/**
 * dialog on changing timezone also have option for saving it, don't save on select
 */
export default function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const { codecsList, devices, getDevicesFc, showDialog } = useContext(DevicesContext);
    const { id } = useParams();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const [thisDevice, setThisDevice] = useState<Device>({
        id: '',
        name: '',
        actuators: [],
        sensors: [],
        created: new Date(),
        modified: new Date(),
        meta: {
            type: '',
            codec: '',
            lorawan: {
                devEUI: '',
                devAddr: '',
                nwkSEncKey: '',
                appSKey: ''
            }
        }
    });
    const [isEdited, setIsEdited] = useState(false);
    // const [isEditedMakeLoraWAN,setIsEditedMakeLoraWAN] = useState(false);
    const [isEditedCodec, setIsEditedCodec] = useState(false);
    const handleSubmitEditDevice = () => {
        const device = devices.find((dev) => dev.id === thisDevice?.id);
        if (thisDevice?.meta) {
            if (device?.meta !== thisDevice?.meta) {
                window.wazigate.setDeviceMeta(thisDevice?.id as string, thisDevice?.meta as Device)
                    .then(() => {
                        showDialog({
                            content: "Device meta updated ",
                            onAccept: () => { },
                            onCancel: () => { },
                            hideCloseButton: true,
                            acceptBtnTitle: "Close",
                            title: "Update successfull."
                        });
                        getDevicesFc();
                        return;
                    }).catch(err => {
                        showDialog({
                            content: err,
                            onAccept: () => { },
                            onCancel: () => { },
                            hideCloseButton: true,
                            acceptBtnTitle: "Close",
                            title: "Error encountered"
                        });
                    });
            }
            if (device?.name !== thisDevice?.name) {
                window.wazigate.setDeviceName(thisDevice.id as string, thisDevice.name.toString())
                    .then(() => {
                        showDialog({
                            content: "Device name updated ",
                            onAccept: () => { },
                            onCancel: () => { },
                            hideCloseButton: true,
                            acceptBtnTitle: "Close",
                            title: "Update successfull."
                        });
                        getDevicesFc();
                        return;
                        return;
                    }).catch(err => {
                        showDialog({
                            content: err,
                            onAccept: () => { },
                            onCancel: () => { },
                            acceptBtnTitle: "Close",
                            hideCloseButton: true,
                            title: "Error encountered"
                        });
                        getDevicesFc();
                        return;
                    });
            }
        }
        setIsEdited(false);
        setIsEditedCodec(false);
        getDevicesFc();
    }
    useEffect(() => {
        window.wazigate.getDevice(id as string).then((de) => {
            if (de.meta.lorawan) {
                setThisDevice({
                    ...de,
                    name: de.name,
                });
            } else {
                setThisDevice({
                    ...de,
                    name: de.name,
                    meta: {
                        ...de.meta,
                        lorawan: {
                            devEUI: '',
                            devAddr: '',
                            nwkSEncKey: '',
                            appSKey: '',
                            profile: "WaziDev",
                        }
                    }
                });
            }
        });
    }, [id]);
    const handleChangeDeviceCodec = (event: SelectChangeEvent<string>) => {
        setThisDevice({
            ...thisDevice as Device,
            meta: {
                ...thisDevice?.meta,
                codec: event.target.value
            }
        });
        setIsEditedCodec(true);
    };
    // Autogenerate LoraWAN keys
    const autoGenerateLoraWANOptions = (title: "devAddr" | "nwkSEncKey" | "appSKey") => {
        let devEUI = thisDevice.meta.lorawan.devEUI;
        let devAddr = thisDevice.meta.lorawan.devAddr;
        if (title === 'devAddr') {
            devAddr = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
            devEUI = devEUIGenerateFc(devAddr.toString())
        }
        switch (title) {
            case 'devAddr':
                setThisDevice({
                    ...thisDevice,
                    meta: {
                        ...thisDevice.meta,
                        lorawan: {
                            ...thisDevice.meta.lorawan,
                            devAddr,
                            devEUI,
                            profile: "WaziDev",
                        }
                    }
                });
                setIsEdited(true);
                break;
            case 'nwkSEncKey':
                setThisDevice({
                    ...thisDevice,
                    meta: {
                        ...thisDevice.meta,
                        lorawan: {
                            ...thisDevice.meta.lorawan,
                            nwkSEncKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
                            profile: "WaziDev",
                        }
                    }
                });
                setIsEdited(true);
                break;
            case 'appSKey':
                setThisDevice({
                    ...thisDevice,
                    meta: {
                        ...thisDevice.meta,
                        lorawan: {
                            ...thisDevice.meta.lorawan,
                            appSKey: [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
                            profile: "WaziDev",
                        }
                    }
                });
                setIsEdited(true);
                break;
            default:
                break;
        }
    }
    const navigate = useNavigate();
    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let devEUI = thisDevice?.meta.lorawan?.devEUI;
        let devAddr = thisDevice?.meta.lorawan?.devAddr;
        if (e.target.name === 'devAddr') {
            devAddr = e.target.value;
            devEUI = devEUIGenerateFc(e.target.value);
        }
        if (e.target.name === 'name') {
            setThisDevice({ ...thisDevice, name: e.target.value })
        } else {
            setThisDevice({
                ...thisDevice,
                meta: {
                    ...thisDevice.meta,
                    lorawan: {
                        ...thisDevice.meta.lorawan,
                        devAddr,
                        devEUI,
                        nwkSEncKey: (e.target.name === 'nwkSEncKey') ? e.target.value : thisDevice?.meta.lorawan?.nwkSEncKey,
                        appSKey: (e.target.name === 'appSKey') ? e.target.value : thisDevice?.meta.lorawan?.appSKey,
                        profile: "WaziDev",
                    },
                }
            });
        }
        setIsEdited(true);
    }
    function handleDeleteDevice() {
        showDialog({
            title: "Remove " + thisDevice.name,
            acceptBtnTitle: "OK",
            content: `Are you sure you want to remove ${thisDevice.name}?`,
            onAccept() {
                window.wazigate.deleteDevice(thisDevice.id)
                    .then(() => {
                        navigate('/devices');
                        getDevicesFc();
                    })
                    .catch(err => {
                        showDialog({
                            content: err,
                            onAccept: () => { },
                            onCancel: () => { },
                            acceptBtnTitle: "Close",
                            hideCloseButton: true,
                            title: "Error encountered"
                        });
                    })
            },
            onCancel() { },
        })

    }
    // const changeMakeLoraWAN = () => {
    //     setThisDevice({
    //         ...thisDevice,
    //         meta: {
    //             ...thisDevice.meta,
    //             type: thisDevice.meta.lorawan ? null : 'WaziDev',
    //             lorawan: thisDevice.meta.lorawan ? null : {
    //                 profile: "WaziDev",
    //             },
    //         }
    //     });
    //     setIsEdited(true);
    // }
    return (
        <>
            <Box sx={{ px: [2, 4], py: [0, 2], height: '100%', overflowY: 'auto', scrollbarWidth: '.5rem', "::-webkit-slider-thumb": { backgroundColor: 'transparent' } }}>
                <RowContainerBetween>
                    <Box>
                        <Typography sx={{ ...lineClamp(1) }} variant="h5" >{thisDevice?.name} Settings</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography fontSize={matches ? 15 : 12} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                    <Link style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                        Devices
                                    </Link>
                                </Typography>

                                <Typography fontSize={matches ? 15 : 12} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                    <Link
                                        color="inherit"
                                        state={{ title: thisDevice?.name }}
                                        to={`/devices/${id}`}
                                        style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }}
                                    >
                                        {thisDevice?.name ? thisDevice.name : ''}
                                    </Link>
                                </Typography>
                                <Typography fontSize={matches ? 15 : 12} color="text.primary">
                                    Settings
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                </RowContainerBetween>
                <Box width={['100%', '50%']} my={2}>
                    <Box boxShadow={1} bgcolor={'#fff'} my={1} px={2} pb={2} borderRadius={2} >
                        <FormControl sx={{ my: 1, width: '100%', }}>
                            <InputField label="Device Name">
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder='Enter device name'
                                    autoFocus
                                    onInput={handleTextInputChange}
                                    value={(thisDevice)?.name}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </InputField>
                        </FormControl>
                        <RowContainerBetween>
                            <Box display={'flex'} my={1} alignItems={'center'}>
                                <Router sx={{ fontSize: 20, color: '#292F3F' }} />
                                <Typography fontWeight={500} mx={2} fontSize={16} color={'#292F3F'}>LoRaWAN Settings</Typography>
                            </Box>
                            {/* <Android12Switch checked={thisDevice.meta.lorawan} onChange={changeMakeLoraWAN} color='info' /> */}
                        </RowContainerBetween>
                        <Box my={2}>
                            <AddTextShow
                                name="devAddr"
                                onTextInputChange={handleTextInputChange}
                                autoGenerateHandler={autoGenerateLoraWANOptions}
                                textInputValue={thisDevice?.meta.lorawan ? thisDevice.meta.lorawan.devAddr : ''}
                                text={'Device Addr (Device Address)'}
                                placeholder={'Device Address. 8 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan ? thisDevice?.meta.lorawan.devAddr : '')}
                            />
                            <AddTextShow
                                onTextInputChange={handleTextInputChange}
                                autoGenerateHandler={autoGenerateLoraWANOptions}
                                name="nwkSEncKey"
                                textInputValue={thisDevice?.meta.lorawan ? thisDevice?.meta.lorawan.nwkSEncKey : ''}
                                text={'NwkSKey(Network Session Key)'}
                                placeholder={'Network Session Key. 32 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan ? thisDevice?.meta.lorawan.nwkSEncKey : '')}
                            />
                            <AddTextShow
                                onTextInputChange={handleTextInputChange}
                                autoGenerateHandler={autoGenerateLoraWANOptions}
                                name="appSKey"
                                textInputValue={thisDevice?.meta.lorawan ? thisDevice?.meta.lorawan.appSKey : ''}
                                text={'AppKey (App Key)'}
                                placeholder={'App Key. 32 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan ? thisDevice?.meta.lorawan.appSKey : '')}
                            />
                        </Box>
                        
                        <Button variant="contained" disabled={!isEdited} fullWidth color="secondary" type="button" onClick={() => handleSubmitEditDevice()}>Save Changes</Button>
                    </Box>

                    <Box boxShadow={1} bgcolor={'#fff'} my={2} px={2} py={2} borderRadius={2}>
                        <RowContainerBetween>
                            <Box display={'flex'} my={1} alignItems={'center'}>
                                <Box component={'img'} src={BoxDownload} width={20} height={20} />
                                <Typography fontWeight={500} mx={2} fontSize={16} color={DEFAULT_COLORS.navbar_dark}>Device Codec</Typography>
                            </Box>
                        </RowContainerBetween>
                        <Box my={0}>
                            <DropDownCreateDeviceTab1
                                title="Codec Type"
                                name="codec"
                                value={thisDevice?.meta.codec}
                                handleChangeSelect={handleChangeDeviceCodec}
                                options={codecsList ? codecsList : []}
                            />
                        </Box>
                        <Button variant="contained" disabled={!isEditedCodec} fullWidth color="secondary" type="button" onClick={() => handleSubmitEditDevice()}>Save Change</Button>
                    </Box>

                    <Paper sx={{ p: 2, }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#DE3629' }}>Danger Zone</Typography>
                        <Box display='flex' flexDirection={['column', 'row']} alignItems='center' gap={1}>
                            <Box display='flex' flexDirection='column' flexGrow={1} gap={1}>
                                <Typography>Delete this device</Typography>
                                <Typography variant="body2" color="text.secondary">All information on this device will be lost, this action cannot be undone</Typography>
                            </Box>
                            <Button variant="outlined" color="error" fullWidth={isMobile} onClick={handleDeleteDevice}> Delete </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </>
    )
}
