import { Router } from "@mui/icons-material";
import { Box, Breadcrumbs, FormControl, Typography, MenuItem, Select, SelectChangeEvent, Button } from "@mui/material";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AddTextShow from "../../components/shared/AddTextInput";
import type { Device, } from "waziup";
import { DevicesContext } from "../../context/devices.context";
import { devEUIGenerateFc, lineClamp, toStringHelper } from "../../utils";
import RowContainerBetween from "../../components/shared/RowContainerBetween";
import { DEFAULT_COLORS } from "../../constants";
import BoxDownload from '../../assets/box_download.svg';
import PrimaryButton from "../../components/shared/PrimaryButton";
import { DropDownCreateDeviceTab1 } from "../../components/ui/CreateDeviceTab1";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    my?:number,
    widthPassed?: string
}
export const SelectElement = ({ handleChange, title, conditions, isDisabled,my, widthPassed, name, value }: HTMLSelectProps) => (
    <Box minWidth={120} width={widthPassed ? widthPassed : '100%'} my={my?my:.5}>
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
    const { codecsList,devices,getDevicesFc,showDialog } = useContext(DevicesContext);
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
                        showDialog({
                            content:"Device meta updated ",
                            onAccept:()=>{},
                            onCancel:()=>{},
                            hideCloseButton: true,
                            acceptBtnTitle:"Close",
                            title:"Update successfull."
                        });
                        getDevicesFc();
                        return;
                    }).catch(err => {
                        showDialog({
                            content: err,
                            onAccept:()=>{},
                            onCancel:()=>{},
                            hideCloseButton: true,
                            acceptBtnTitle:"Close",
                            title:"Error encountered"
                        });
                    });
            }
            if (device?.name !== thisDevice?.name) {
                window.wazigate.setDeviceName(thisDevice.id as string, thisDevice.name.toString())
                .then(() => {
                    showDialog({
                        content:"Device name updated ",
                        onAccept:()=>{},
                        onCancel:()=>{},
                        hideCloseButton: true,
                        acceptBtnTitle:"Close",
                        title:"Update successfull."
                    });
                    getDevicesFc();
                    return;
                    return;
                }).catch(err => {
                    showDialog({
                        content: err,
                        onAccept:()=>{},
                        onCancel:()=>{},
                        acceptBtnTitle:"Close",
                        hideCloseButton: true,
                        title:"Error encountered"
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
            if(de.meta.lorawan){
                setThisDevice({
                    ...de,
                    name: de.name,
                });
            }else{
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
        let devEUI= thisDevice.meta.lorawan.devEUI;
        let devAddr= thisDevice.meta.lorawan.devAddr;
        if(title==='devAddr'){
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
        if(e.target.name === 'devAddr'){
            devAddr = e.target.value;
            devEUI = devEUIGenerateFc(e.target.value);
        }
        if(e.target.name ==='name'){
            setThisDevice({...thisDevice, name: e.target.value})
        }else{
            setThisDevice({
                ...thisDevice,
                meta: {
                    ...thisDevice.meta,
                    lorawan: {
                        ...thisDevice.meta.lorawan,
                        devAddr,
                        devEUI,
                        nwkSEncKey:  (e.target.name === 'nwkSEncKey') ? e.target.value : thisDevice?.meta.lorawan?.nwkSEncKey,
                        appSKey: (e.target.name==='appSKey') ? e.target.value : thisDevice?.meta.lorawan?.appSKey,
                        profile: "WaziDev",
                    },
                }
            });
        }
        setIsEdited(true);
    }
    function handleDeleteDevice() {
        showDialog({
            title:"Remove "+thisDevice.name,
            acceptBtnTitle:"OK",
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
                        onAccept:()=>{},
                        onCancel:()=>{},
                        acceptBtnTitle:"Close",
                        hideCloseButton: true,
                        title:"Error encountered"
                    });
                })
            },
            onCancel() {},
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
            <Box sx={{px:matches?4:2,py:matches?2:0, height: '100%', overflowY: 'auto', scrollbarWidth: '.5rem', "::-webkit-slider-thumb": { backgroundColor: 'transparent' } }}>
                <RowContainerBetween>
                    <Box>
                        <Typography sx={{...lineClamp(1),fontSize:24,fontWeight:700,color:'black'}} >{thisDevice?.name} Settings</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography fontSize={matches?15:12} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                    <Link style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }} state={{ title: 'Devices' }} color="inherit" to="/">
                                        Home
                                    </Link>
                                </Typography>
                                <Typography fontSize={matches?15:12} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                    <Link style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                        Devices
                                    </Link>
                                </Typography>

                                <Typography fontSize={matches?15:12} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                    <Link
                                        color="inherit"
                                        state={{ title: thisDevice?.name }}
                                        to={`/devices/${id}`}
                                        style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }}
                                    >
                                        {thisDevice?.name ? thisDevice.name : ''}
                                    </Link>
                                </Typography>
                                <Typography fontSize={matches?15:12} color="text.primary">
                                    Settings
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                </RowContainerBetween>
                <Box width={matches?'50%':'95%'}>
                    <Box boxShadow={1} bgcolor={'#fff'} my={1} px={2} py={4} borderRadius={2} >
                        <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid #292F3F'}}>
                            <Typography color={'primary'} mb={.4} fontSize={12}>Device Name</Typography>
                            <input 
                                autoFocus 
                                onInput={handleTextInputChange} 
                                name="name"
                                placeholder='Enter device name' 
                                value={(thisDevice)?.name}
                                required
                                id="name"
                                style={{border:'none',background:'none',width:'100%',padding:'6px 0', outline:'none'}}
                            />
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
                        {
                            isEditedCodec ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 2 }} >
                                    <PrimaryButton onClick={()=>handleSubmitEditDevice()} type="button" title="Save" />
                                </Box>
                            ) : null
                        }
                    </Box>
                    <Box boxShadow={1} sx={{borderRadius:2, bgcolor:'#fff', minHeight: 150, mt:0,  py: 2,px:3, mb: 6 }}>
                        <RowContainerBetween additionStyles={{my:1}}>
                            <Typography fontWeight={500}  fontSize={16} variant="h4" color={'error.main'}>Danger Zone</Typography>
                        </RowContainerBetween>
                        <RowContainerBetween>
                            <Box maxWidth={'70%'}>
                                <Typography fontSize={14} variant="body2">Delete this device</Typography>
                                <Typography variant="body2" color={'#797979'}  fontSize={12} fontWeight={400}>All information on this device will be lost, this action cannot be undone</Typography>
                            </Box>
                            <Button variant="outlined" color="error" onClick={handleDeleteDevice}>Delete</Button>
                        </RowContainerBetween>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
