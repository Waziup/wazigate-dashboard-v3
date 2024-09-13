import { Router } from "@mui/icons-material";
import { Box, Breadcrumbs, FormControl, Typography, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AddTextShow from "../components/shared/AddTextInput";
import type { Device, } from "waziup";
import { DevicesContext } from "../context/devices.context";
import { cleanString, devEUIGenerateFc, toStringHelper } from "../utils";
import { SelectElementString } from "./Automation";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { DEFAULT_COLORS } from "../constants";
// import { Android12Switch } from "../components/shared/Switch";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    widthPassed?: string
}
export const SelectElement = ({ handleChange, title, conditions, isDisabled, widthPassed, name, value }: HTMLSelectProps) => (
    <Box minWidth={120} width={widthPassed ? widthPassed : '100%'} my={.5}>
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
import BoxDownload from '../assets/box_download.svg';
import PrimaryButton from "../components/shared/PrimaryButton";
import { DropDownCreateDeviceTab1 } from "../components/ui/CreateDeviceTab1";
import WaziDevIcon from '../components/ui/wazidev.svg';
import WaziActIcon from '../components/ui/WaziAct.svg';
export default function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const { codecsList,devices,getDevicesFc } = useContext(DevicesContext);
    const { id } = useParams();
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const [thisDevice, setThisDevice] = useState<Device>({
        id: '',
        name: '',
        actuators:[],
        sensors:[],
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
    const [isEdited,setIsEdited] = useState(false);
    // const [isEditedMakeLoraWAN,setIsEditedMakeLoraWAN] = useState(false);
    const [isEditedCodec,setIsEditedCodec] = useState(false);
    const handleSubmitEditDevice = () => {
        const device = devices.find((dev) => dev.id === thisDevice?.id);
        if (thisDevice?.meta) {
            if (device?.meta !== thisDevice?.meta) {
                window.wazigate.setDeviceMeta(thisDevice?.id as string, thisDevice?.meta as Device)
                    .then(() => {
                        alert("Device meta updated");
                        getDevicesFc();
                        return;
                    }).catch(err => {
                        alert("Error updating device meta"+err);
                    });
            }
            if (device?.name !== thisDevice?.name) {
                window.wazigate.setDeviceName(thisDevice.id as string, thisDevice.name.toString())
                    .then(() => {
                        alert("Device name updated");
                        return;
                    }).catch(err => {
                        alert("Error updating device name"+err);
                    });
            }
        }
        setIsEdited(false);
        setIsEditedCodec(false);
        getDevicesFc();
    }
    useEffect(() => {
        window.wazigate.getDevice(id as string).then((de) => {
            if(de.meta.lorawan){
                setThisDevice({
                    ...de,
                    name: cleanString(de.name),
                });
            }else{
                setThisDevice({
                    ...de,
                    name: cleanString(de.name),
                    meta: {
                        ...de.meta,
                        lorawan: {
                            devEUI: '',
                            devAddr: '',
                            nwkSEncKey: '',
                            appSKey: ''
                        }
                    }
                });
            }
        });
    }, [id]);
    const handleChangeDeviceCodec = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setThisDevice({
            ...thisDevice as Device,
            meta: {
                ...thisDevice?.meta,
                codec: event.target.value
            }
        });
        setIsEditedCodec(true);
    };
    const autoGenerateLoraWANOptions = (title: "devAddr" | "nwkSEncKey" | "appSKey") => {
        let devEUI= thisDevice.meta.lorawan.devEUI;
        let devAddr= thisDevice.meta.lorawan.devAddr;
        let sharedKey= thisDevice.meta.lorawan.nwkSEncKey || thisDevice.meta.lorawan.appSKey;
        if(title==='devAddr'){
            devAddr = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
            devEUI = devEUIGenerateFc(devAddr.toString())
        }else if(title==='nwkSEncKey' || title==='appSKey'){
            sharedKey = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
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
                            nwkSEncKey: sharedKey,
                            appSKey: sharedKey
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
                            nwkSEncKey: sharedKey,
                            appSKey: sharedKey
                        }
                    }
                });
                setIsEdited(true);
                break;
            default:
                break;
        }
    }
    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let devEUI = thisDevice?.meta.lorawan?.devEUI;
        let devAddr = thisDevice?.meta.lorawan?.devAddr;
        const sharedKey= e.target.name==='nwkSEncKey' ? thisDevice?.meta.lorawan?.nwkSEncKey: e.target.name==='appSKey'? thisDevice?.meta.lorawan?.appSKey:'';
        if(e.target.name === 'devAddr'){
            devAddr = e.target.value;
            devEUI = devEUIGenerateFc(e.target.value);
        }
        setThisDevice({
            ...thisDevice,
            meta: {
                ...thisDevice.meta,
                lorawan: {
                    ...thisDevice.meta.lorawan,
                    devAddr,
                    devEUI,
                    nwkSEncKey:  (e.target.name === 'nwkSEncKey' || e.target.name === 'appSKey') ? e.target.value : sharedKey,
                    appSKey: (e.target.name==='appSKey' || e.target.name==='nwkSEncKey') ? e.target.value : sharedKey,
                },
            }
        });
        setIsEdited(true);
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
    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        setThisDevice({
            ...thisDevice,
            meta: {
                ...thisDevice.meta,
                type: event.target.value
            }
        });
        setIsEdited(true);
    };
    return (
        <>
            <Box mx={2} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: '.5rem', "::-webkit-slider-thumb": { backgroundColor: 'transparent' } }} m={2}>
                <RowContainerBetween additionStyles={{ mx: 2 }}>
                    <Box>
                        <Typography fontSize={24} fontWeight={700} color={'black'}>{thisDevice?.name}</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography fontSize={15} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                    <Link style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                        Devices
                                    </Link>
                                </Typography>

                                <Typography fontSize={15} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                    <Link
                                        color="inherit"
                                        state={{ title: thisDevice?.name }}
                                        to={`/devices/${id}`}
                                        style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }}
                                    >
                                        {thisDevice?.name ? thisDevice.name.slice(0, 10) + '...' : ''}
                                    </Link>
                                </Typography>
                                <Typography fontSize={15} color="text.primary">
                                    settings
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                </RowContainerBetween>
                <Box m={2} width={matches?'50%':'95%'}>
                    <Box bgcolor={'#fff'} mx={2} my={1} px={2} py={2} borderRadius={2} >
                        <RowContainerBetween>
                            <Box display={'flex'} my={1} alignItems={'center'}>
                                <Router sx={{ fontSize: 20, color: '#292F3F' }} />
                                <Typography fontWeight={500} mx={2} fontSize={16} color={'#292F3F'}>LoRaWAN Settings</Typography>
                            </Box>
                            {/* <Android12Switch checked={thisDevice.meta.lorawan} onChange={changeMakeLoraWAN} color='info' /> */}
                        </RowContainerBetween>
                        <Box my={2}>
                            <DropDownCreateDeviceTab1
                                showNameOnly
                                title="Application Type"
                                value={thisDevice.meta.type}
                                handleChangeSelect={handleChangeSelect}
                                options={[{name:'Wazidev Board',id:'WaziDev', imageurl:WaziDevIcon},{id:'GenericBoard',name:'Generic board',imageurl:WaziActIcon}]} 
                            />
                            <AddTextShow 
                                name="devAddr"
                                onTextInputChange={handleTextInputChange}
                                autoGenerateHandler={autoGenerateLoraWANOptions}
                                textInputValue={thisDevice?.meta.lorawan? thisDevice.meta.lorawan.devAddr:''} 
                                text={'Device Addr (Device Address)'} 
                                placeholder={'Device Address. 8 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan? thisDevice?.meta.lorawan.devAddr:'')} 
                            />
                            <AddTextShow
                                onTextInputChange={handleTextInputChange}
                                autoGenerateHandler={autoGenerateLoraWANOptions}
                                name="nwkSEncKey"
                                textInputValue={thisDevice?.meta.lorawan? thisDevice?.meta.lorawan.nwkSEncKey:''} 
                                text={'NwkSKey(Network Session Key)'} 
                                placeholder={'Network Session Key. 32 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan? thisDevice?.meta.lorawan.nwkSEncKey:'')}
                            />
                            <AddTextShow
                                onTextInputChange={handleTextInputChange}
                                autoGenerateHandler={autoGenerateLoraWANOptions}
                                name="appSKey"
                                textInputValue={thisDevice?.meta.lorawan? thisDevice?.meta.lorawan.appSKey:''} 
                                text={'AppKey (App Key)'} 
                                placeholder={'App Key. 32 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan? thisDevice?.meta.lorawan.appSKey:'')} 
                            />
                        </Box>
                        {
                            isEdited ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 2 }} >
                                    <PrimaryButton onClick={()=>handleSubmitEditDevice()} type="button" title="Save" />
                                </Box>
                            ) : null
                        }
                    </Box>
                    
                    <Box bgcolor={'#fff'} mx={2} my={2} px={2} py={2} borderRadius={2}>
                        <RowContainerBetween>
                            <Box display={'flex'} my={1} alignItems={'center'}>
                                <Box component={'img'} src={BoxDownload} width={20} height={20} />
                                <Typography fontWeight={500} mx={2} fontSize={16} color={DEFAULT_COLORS.navbar_dark}>Device Codec</Typography>
                            </Box>
                        </RowContainerBetween>
                        <Box my={2}>
                            <SelectElementString title={'Codec type.'} handleChange={handleChangeDeviceCodec} name="codec" conditions={codecsList ? codecsList : []} value={thisDevice?.meta.codec} />
                        </Box>
                        {
                            isEditedCodec ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 2 }} >
                                    <PrimaryButton onClick={()=>handleSubmitEditDevice()} type="button" title="Save" />
                                </Box>
                            ) : null
                        }
                    </Box>
                </Box>
            </Box>
        </>
    )
}