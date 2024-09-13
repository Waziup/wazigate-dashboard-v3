import { Box, Breadcrumbs,ListItemText,  Grid,Icon, SxProps,  Theme, Typography, CircularProgress, Grow, LinearProgress, Modal } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import { ArrowBack, CellTower, Close, DesktopWindowsOutlined, LockOutlined, ModeFanOffOutlined, WarningAmber, WifiOutlined } from "@mui/icons-material";
import { Android12Switch } from "../components/shared/Switch";
import PrimaryButton from "../components/shared/PrimaryButton";
import { getWiFiScan,setConf as setConfFc, AccessPoint,getConf, setWiFiConnect, WifiReq, setAPMode, setAPInfo } from "../utils/systemapi";
import React, { useContext, useEffect, useMemo, useState } from "react";
import GridItemEl from "../components/shared/GridItemElement";
const GridItem = ({ children,matches,lg,xl, xs,md,additionStyles }: {xs:number,md:number,xl:number,lg:number,spacing?:number, matches: boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode,  }) => (
    <Grid m={matches?1:0} lg={lg} sm={12} xl={xl} item xs={xs} md={md}  sx={additionStyles} borderRadius={2}  >
        {children}
    </Grid>
);
const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 440,
    // height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // overflowY: 'auto',
    
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
};
const IconStyle: SxProps<Theme> = { fontSize: 20, mr: 2, color: DEFAULT_COLORS.primary_black };
import TextInputField from "../components/shared/TextInputField";
import { Cloud } from "waziup";
import MenuComponent from "../components/shared/MenuDropDown";
import PrimaryIconButton from "../components/shared/PrimaryIconButton";
import { DevicesContext } from "../context/devices.context";
import Backdrop from "../components/Backdrop";
import WaziLogo from '../assets/wazilogo.svg';
export default function SettingsNetworking() {
    const [matches] = useOutletContext<[matches:boolean]>();
    const [scanLoading,setScanLoading]=useState<boolean>(false);
    const [wifiList,setWifiList]=useState<AccessPoint[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [screen, setScreen] = useState<'tab1' | 'tab2'>('tab1');
    const handleScreenChange = (tab: 'tab1' | 'tab2') => {
        setScreen(tab);
    }
    const [selectedWifi,setSelectedWifi]=useState<AccessPoint & {password?:string}|undefined>(undefined);
    const {networkDevices,selectedCloud,setNetWorkDevices,setSelectedCloud} = useContext(DevicesContext)
    const scan = () => {
        setScanLoading(true);
        getWiFiScan()
        .then((res) => {
            setScanLoading(false);
            setWifiList(res);
        }).catch((err) => {
            console.log(err);
            setScanLoading(false);
        });
    }
    const [saving, setSaving] = useState(false);
    const [loading,setLoading] = useState(false);
    const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);
    const [conf, setConf] = useState<{fan_trigger_temp:string,oled_halt_timeout:string }>({
        fan_trigger_temp:'',
        oled_halt_timeout:''
    });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setSelectedCloud({
            ...selectedCloud,
            [name]:value
        } as Cloud);
        sethasUnsavedChanges(true);
    };
    const handleRenameClick = () => {
        const oldName = selectedCloud?.name || selectedCloud?.id;
        const newCloudName = prompt("New cloud name:", oldName);
        if (newCloudName) {
            setSelectedCloud({
                ...selectedCloud,
                name:newCloudName
            } as Cloud);
            window.wazigate.set(`clouds/${selectedCloud?.id}/name`, newCloudName).then(() => {
                // OK
            }, (err) =>  {
                alert("Can not change cloud name:\n"+err);
                setSelectedCloud({
                    ...selectedCloud,
                    name:oldName
                } as Cloud);
            })
        }
    }
    const handleSaveClick =async () => {
        if(hasUnsavedChanges){
            setLoading(true);
            await Promise.all([
                await window.wazigate.set(`clouds/${selectedCloud?.id as string}/rest`, selectedCloud?.rest).catch((err: Error) => {alert("Error saving REST address:\n" + err);return}),
                await window.wazigate.set(`clouds/${selectedCloud?.id}/mqtt`, selectedCloud?.mqtt).catch((err: Error) => {alert("Error saving MQTT address:\n" + err);return}),
                await window.wazigate.setCloudCredentials(selectedCloud?.id as string, selectedCloud?.username as string, selectedCloud?.token as string).catch((err: Error) => {alert("Error saving credentials:\n" + err);return;}),
            ]).then(() => {
                sethasUnsavedChanges(false);
                setLoading(false);
                alert("Changes saved!");
            })
            .catch((err: Error) => {
                alert("There was an error saving the changes:\n" + err);
                setLoading(false);
            });
        }else{
            alert('No changes');
        }
    }
    const handleEnabledChange =async (_event: React.ChangeEvent<HTMLInputElement>,checked: boolean) => {
        if (hasUnsavedChanges) {
            alert("Save all changes before activating the synchronization!");
            return
        }
        setSaving(true);
        const timer = new Promise(resolve => setTimeout(resolve, 2000));
        await window.wazigate.setCloudPaused(selectedCloud?.id as string, !checked)
        .then(async() => {
            alert("Sync activated!");
            setNetWorkDevices()
            timer.then(() => {
                setSaving(false);
            })
        })
        .catch((err:Error)=>{
            setSaving(false);
            alert("There was an error activating the sync!\n Check your credentials and try again.\n\nThe server said:\n" + err);
        });
    }
    const submitConf = (event: React.FormEvent) => {
        event.preventDefault();
        const data = {
          fan_trigger_temp: parseInt(conf.fan_trigger_temp as string,10),
          oled_halt_timeout: parseInt(conf.oled_halt_timeout as string,10)
        };

        setConfFc(data)
        .then(()=>{
            alert('Settings saved');
        })
        .catch((err) => {
            alert('Error:'+err);
        });
    };
    const switchToAPMode = () => {
        // this.setState({ switchToAPModeLoading: true });
        const resp = confirm('Are you sure you want to switch to AP Mode?');
        if (!resp) return;
        setAPMode().then(()=>{
            alert('Switched to AP Mode');
        })
        .catch((error) => {
            alert(error);
        });
    };
    const fcInit = ()=>{
        getConf().then((conf) => {
            setConf(conf);
        }).catch((err) => {
            setConf({
                fan_trigger_temp:'',
                oled_halt_timeout:''
            });
            console.log(err);
        });
    }
    useEffect(() => {
        fcInit();
    }, []);
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const data: WifiReq={
            ssid: selectedWifi?.ssid as string,
            password: selectedWifi?.password,
            autoConnect: true
        }
        setScanLoading(true)
        setWiFiConnect(data).then(() => {
            setScanLoading(false)
            setSelectedWifi(undefined);
            alert('Loading....');
        })
        .catch((error) => {
            setScanLoading(false)
            alert('Error:'+error);
        });
    };
    const submitSSID = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formEl =document.getElementById('submitform') as HTMLFormElement;
        const data = {
            SSID: formEl.SSID.value,
            password: formEl.password.value,
        }
        const confirm = window.confirm('Are you sure you want to change the Access Point settings?');
        if (!confirm) return;
        setAPInfo(data)
        .then(
            (msg) => {
                alert('Success'+msg);
            })
            .catch((error) => {
                alert('Error encountered'+error);
            }
        );
    };
    useEffect(() => {
        scan();
    },[]);
    const [apConn,eth0, accessName] = useMemo(() => {
        const accessName = networkDevices.wlan0? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === "WAZIGATE-AP"): null
        const apCn = networkDevices?.wlan0? networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === networkDevices.wlan0.ActiveConnectionId): null
        const eth0 = networkDevices?.eth0;
        return [apCn, eth0,accessName]; 
    },[networkDevices]);
    const cancelHander = () => {setSelectedWifi(undefined); setOpenModal(false); handleScreenChange('tab1')};
    return (
        <>
            {
                loading?(
                    <Backdrop>
                        <CircularProgress color="info" size={70} />
                    </Backdrop>
                ):null
            }
            <Modal
                open={openModal}
                onClose={cancelHander}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style1}>
                    {
                        screen ==='tab1'?(
                            <Box sx={{}}>
                                <RowContainerBetween additionStyles={{p:2,borderBottom:'1px solid #ccc'}}>
                                    <Box>
                                        <Typography color={'#000'} fontWeight={500} >Available Wifi Networks</Typography>
                                        <Typography fontSize={14} color={'#666'}>Please select a network to connect</Typography>
                                    </Box>
                                    <Close onClick={cancelHander} sx={{ ...IconStyle,cursor: 'pointer', fontSize: 20 }} />
                                </RowContainerBetween>
                                <Box sx={{overflowY:'auto',height:380}}>
                                    {
                                        scanLoading?
                                            <Box sx={{mx:'auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%'}}>
                                                <Typography>Checking for available networks</Typography>
                                                <CircularProgress />
                                            </Box>
                                        :(
                                            wifiList.map((wifi) => (
                                                <Box key={wifi.ssid} onClick={()=>setSelectedWifi(wifi)}>
                                                    <RowContainerBetween additionStyles={{bgcolor:selectedWifi?.ssid===wifi.ssid?'#ccc':'', cursor:'pointer',":hover":{bgcolor:'#ccc'},borderBottom:'1px solid #ccc',p:1}}>
                                                        <Typography>{wifi.ssid}</Typography>
                                                        <Icon sx={IconStyle}>wifi_outlined</Icon>
                                                    </RowContainerBetween>
                                                </Box>
                                            )
                                        ))
                                    }
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between',borderTop:'1px solid #ccc', alignItems: 'center', p: 2 }} >
                                    <Box></Box>
                                    <PrimaryButton title="NEXT" disabled={selectedWifi===undefined} onClick={() => { handleScreenChange('tab2') }} />
                                </Box>
                            </Box>
                        ):(
                            <SelectedNetwork cancelHander={cancelHander} backHandler={()=>{setSelectedWifi(undefined);handleScreenChange('tab1')}} submitHandler={submitHandler} selectedWifi={selectedWifi} setSelectedWifi={setSelectedWifi} />
                        )
                    }
                </Box>
            </Modal>
            <Box sx={{pl:matches?2.5:1,pt:2.5, position: 'relative', width: '100%', height: '100vh' }}>
                <Box>
                    <Typography fontWeight={600} fontSize={24} color={'black'}>Wifi</Typography>
                    <div role="presentation" >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                                <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/settings">
                                    Settings
                                </Link>
                            </Typography>
                            <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                                wifi
                            </p>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Grid container>
                    <GridItem xl={4} lg={4} spacing={2} md={4.6} xs={12} matches={matches} additionStyles={{}}>
                        <GridItemEl text={selectedCloud?.name as string} icon={'cloud'}>
                            <Grow in={saving}>
                                <LinearProgress />
                            </Grow>
                            <RowContainerBetween additionStyles={{borderBottom:'1px solid #ccc'}}>
                                <RowContainerNormal>
                                    <Box component={'img'} src={WaziLogo} mx={2} />
                                    <Box>
                                        <ListItemText
                                            primary={selectedCloud?.name || selectedCloud?.id}
                                            secondary={``}
                                        />
                                    </Box>
                                </RowContainerNormal>
                                <MenuComponent
                                    open={false}
                                    menuItems={[
                                        {
                                            text: 'Rename',
                                            icon: 'edit',
                                            clickHandler:handleRenameClick
                                        }
                                    ]}
                                />
                            </RowContainerBetween>
                            <Box px={2}>
                                <RowContainerNormal additionStyles={{alignItems:'center'}}>
                                    <Android12Switch 
                                        checked={!selectedCloud?.paused}
                                        onChange={handleEnabledChange}
                                        color="info" 
                                    />
                                    <Typography color={'#000'}>Active Sync</Typography>
                                </RowContainerNormal>
                                <TextInputField placeholder="REST Address" label="REST Address *" name="rest" onChange={handleInputChange} value={selectedCloud?.rest} />
                                <TextInputField placeholder="MQTT Address" label="MQTT Address *" name="mqtt" onChange={handleInputChange} value={selectedCloud?.mqtt} />
                                <TextInputField placeholder="Username" label="Username" name="username" onChange={handleInputChange} value={selectedCloud?.username} />
                                <TextInputField 
                                    disabled={selectedCloud?.paused} 
                                    placeholder="****" 
                                    label="Password" 
                                    name="token" 
                                    type="password"
                                    onChange={handleInputChange} 
                                    value={selectedCloud?.token} 
                                />
                            </Box>
                            {
                                hasUnsavedChanges?(
                                    <PrimaryIconButton
                                        disabled={!hasUnsavedChanges}
                                        iconname="save"
                                        onClick={handleSaveClick}
                                        type="button"
                                        title="SAVE"
                                    />
                                ):null
                            }
                        </GridItemEl>
                        
                        <GridItemEl text={'Misc. Settings'} icon={'settings'}>
                            <Box p={2}>
                                <form onSubmit={submitConf}>
                                    <TextInputField 
                                        icon={<ModeFanOffOutlined sx={{fontSize:20,mx:1}}/>} 
                                        label="Fan Trigger Temperature (C)" 
                                        onChange={(e)=>{setConf({
                                            ...conf,
                                            fan_trigger_temp:e.target.value
                                        })}} 
                                        name="fan"
                                        value={conf ? (conf?.fan_trigger_temp as unknown as string) : "Loading..."} 
                                    />
                                    <TextInputField 
                                        icon={<DesktopWindowsOutlined sx={{fontSize:20,mx:1}}/>} 
                                        label="OLED halt timeout (seconds)" 
                                        onChange={(e)=>{setConf({
                                            ...conf,
                                            oled_halt_timeout:e.target.value
                                        })}}
                                        name="oled"
                                        value={   conf ? (conf?.oled_halt_timeout as unknown as string) : "Loading..."}
                                    />
                                    <PrimaryButton title="Save" type="submit" />
                                </form>
                            </Box>
                        </GridItemEl>
                    </GridItem>
                    <GridItem xl={7.5} lg={7.4} md={7} xs={12} matches={matches}  additionStyles={{overflowY:'auto',minHeight:'500px',height:'100%',width:'100%'}}>
                        <GridItemEl text={'Access Point Settings'} icon={'power_settings_new'}>
                            <Box sx={{display:'flex',flexDirection:matches?'row':'column', alignItems:'center'}}>
                                <Box bgcolor={'#D4E3F5'} width={matches?'50%':'90%'} borderRadius={1} p={2} m={1}>
                                    <form id="submitform" onSubmit={submitSSID}>
                                        <TextInputField 
                                            icon={<CellTower sx={{fontSize:20,mx:1,}}/>} 
                                            label="Access Point SSID" 
                                            sx={{}}
                                            bgcolor={'#d4e3f5'}
                                            value={accessName? atob(accessName["802-11-wireless"]?.ssid as string) : ""}
                                            name="SSID"
                                            id="SSID"
                                            placeholder="Enter SSID"
                                        />
                                        <TextInputField 
                                            sx={{bgcolor:'#d4e3f5'}}
                                            icon={<LockOutlined 
                                            sx={{fontSize:20,mx:1,}}/>} 
                                            label="Access Point Pasword" 
                                            placeholder="Enter password"
                                            onChange={()=>{}} 
                                            bgcolor={'#d4e3f5'}
                                            name="password"
                                            id="password"
                                        />
                                        <PrimaryButton title="Save" type="submit" />
                                    </form>
                                </Box>
                                <Box bgcolor={'#D4E3F5'} width={matches?'50%':'90%'} borderRadius={1} p={2} m={1}>
                                    <Box p={2}>
                                        <Typography  fontSize={13} color={'#FA9E0E'}>
                                            <WarningAmber component={'span'} sx={{color:'#FA9E0E',fontWeight:700,fontSize:15}} />
                                            Connect to Wazigate Hotspot after pressing the button to manage your gateway over WiFi.
                                        </Typography>
                                        <PrimaryButton title="Switch " onClick={switchToAPMode} type="button" />
                                    </Box>
                                </Box>
                            </Box>
                        </GridItemEl>
                        <Box bgcolor={'#fff'} boxShadow={3} borderRadius={1}>
                            <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5,border:'.5px solid #d8d8d8', bgcolor: '#f7f7f7', alignItems: 'center' }} p={1} >
                                <WifiOutlined sx={IconStyle}/>
                                <Typography color={'#212529'} fontWeight={500}>Available Wifi</Typography>
                            </Box>
                            <Box bgcolor={'#D4E3F5'} p={1}>
                                <Typography>
                                    {
                                        (eth0 && eth0.IP4Config)?(
                                            <Typography>Connected to Ethernet </Typography>
                                        ):
                                        (apConn && apConn.connection.id==='WAZIGATE_AP')?(
                                            <Typography>Access Point Mode</Typography>
                                        ):(
                                            <Typography>Connected to {"  "}
                                                {
                                                    apConn? atob(apConn["802-11-wireless"]?.ssid as string):"No network"
                                                }
                                            </Typography>
                                        )
                                    } 
                                </Typography>
                            </Box>
                            <Box sx={{p:1,cursor:'pointer'}} onClick={() => setOpenModal(true)}>
                                <Typography color={'#666'}>Click here to change network connection</Typography>
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </>
    )
}
interface Props {
    submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
    backHandler: () => void;
    selectedWifi: AccessPoint | undefined;
    cancelHander: () => void;
    setSelectedWifi: React.Dispatch<React.SetStateAction<AccessPoint & {password?:string} | undefined>>;
}
function SelectedNetwork({submitHandler,selectedWifi,backHandler,cancelHander,setSelectedWifi}:Props){
    return(
        <Box>
            <RowContainerBetween additionStyles={{p:2,borderBottom:'1px solid #ccc'}}>
                <Box sx={{ display: 'flex',  alignItems: 'center' }} >
                    <ArrowBack onClick={backHandler} sx={{ fontSize: 20, mr: 1, color: DEFAULT_COLORS.primary_black, cursor:'pointer'}} />
                    <Typography color={'#212529'} fontWeight={500}>Connect to {(selectedWifi && selectedWifi.ssid && selectedWifi.ssid.length > 10 ? selectedWifi.ssid.slice(0, 10) + '....' : selectedWifi?.ssid)}</Typography>
                </Box>
                <Close onClick={cancelHander} sx={{ ...IconStyle,cursor:'pointer', fontSize: 20 }} />
            </RowContainerBetween>
            <Box sx={{p:2}}>
                <form  onSubmit={submitHandler}>
                    <TextInputField 
                        icon={<CellTower sx={{fontSize:20,mx:1}}/>} 
                        label="Access Point SSID"
                        value={selectedWifi?.ssid}
                        name="SSID"
                        id="SSID"
                        placeholder="Enter SSID"
                    />
                    <TextInputField 
                        icon={<LockOutlined 
                        sx={{fontSize:20,mx:1}}/>} 
                        onChange={(e)=>{
                            setSelectedWifi({
                                ...selectedWifi as AccessPoint,
                                password:e.target.value
                            }) as unknown as AccessPoint;
                        }}
                        label="Access Point Pasword" 
                        placeholder="Enter password" 
                        name="password"
                    />
                    <RowContainerBetween>
                        <PrimaryButton additionStyles={{backgroundColor:'#ff0000'}} color="error" title="Cancel" onClick={cancelHander} />
                        <PrimaryButton title="Connect" type="submit" />
                    </RowContainerBetween>
                </form>
            </Box>
        </Box>
    )
}