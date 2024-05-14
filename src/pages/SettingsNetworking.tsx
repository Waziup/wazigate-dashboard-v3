import { Box, Breadcrumbs,ListItemText,  Grid,Icon, SxProps,  Theme, Typography, CircularProgress, Grow, LinearProgress, Modal } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import { CellTower, Close, DesktopWindowsOutlined, LockOutlined, ModeFanOffOutlined, WifiOutlined } from "@mui/icons-material";
import { Android12Switch } from "../components/shared/Switch";
import PrimaryButton from "../components/shared/PrimaryButton";
import { getWiFiScan,setConf as setConfFc, AccessPoint,getConf, setWiFiConnect, WifiReq, setAPMode, setAPInfo } from "../utils/systemapi";
import React, { useContext, useEffect, useMemo, useState } from "react";
import GridItemEl from "../components/shared/GridItemElement";
const GridItem = ({ children,matches,lg, xs,md,additionStyles }: {xs:number,md:number,lg:number,spacing?:number, matches: boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode,  }) => (
    <Grid m={matches?2:0} lg={lg} sm={12} xl={lg} item xs={xs} md={md} spacing={3} sx={additionStyles} borderRadius={2}  >
        {children}
    </Grid>
);
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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
import WaziLogo from '../assets/wazilogo.svg'
export default function SettingsNetworking() {
    const [matches] = useOutletContext<[matches:boolean]>();
    const [scanLoading,setScanLoading]=useState<boolean>(false);
    const [wifiList,setWifiList]=useState<AccessPoint[]>([]);
    const [selectedWifi,setSelectedWifi]=useState<AccessPoint & {password?:string}|undefined>(undefined);
    const {networkDevices} = useContext(DevicesContext)
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
    const [selectedCloud, setSelectedCloud] = useState<Cloud | null>(null);
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
        .then(() => {
            alert("Sync activated!");
            fcInit();
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
        window.wazigate.getClouds().then((clouds) => {
            setSelectedCloud(Object.values(clouds)? Object.values(clouds)[0]:null);
        });
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
        console.log("data from submitSSID form: ",data);
        
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
    const apConn = useMemo(() => {
        const apConn = networkDevices?.wlan0.AvailableConnections.find(conn => conn.connection.id === "WAZIGATE-AP");
        return apConn; 
    },[networkDevices]);
    console.log('ApCONN: ',apConn);
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
                open={selectedWifi !== undefined}
                onClose={() => setSelectedWifi(undefined)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <RowContainerBetween additionStyles={{bgcolor: '#D8D8D8',borderRadius:2,}}>
                        <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, bgcolor: '#D8D8D8', alignItems: 'center' }} p={1} >
                            <WifiOutlined sx={IconStyle}/>
                            <Typography color={'#212529'} fontWeight={500}>Connect to Wifi</Typography>
                        </Box>
                        <Close sx={{ ...IconStyle, fontSize: 20 }} onClick={()=>setSelectedWifi(undefined)} />
                    </RowContainerBetween>
                    <Box sx={{p:2}}>
                        <form id="submitform" onSubmit={submitHandler}>
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
                            <PrimaryButton title="Save"  type="submit" />
                        </form>
                    </Box>
                </Box>
            </Modal>
            <Box p={2.5} sx={{ position: 'relative', width: '100%',overflowY:'auto', height: '100vh' }}>
                <Box>
                    <Typography fontWeight={600} fontSize={24} color={'black'}>Wifi</Typography>
                    <div role="presentation" >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/settings">
                                Settings
                            </Link>
                            <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                                wifi
                            </p>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Grid container>
                    
                    <GridItem lg={4} spacing={2} md={4.6} xs={12} matches={matches} additionStyles={{}}>
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
                                            secondary={`ID ${selectedCloud?.id}`}
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
                                <RowContainerNormal>
                                    <Android12Switch 
                                        checked={!selectedCloud?.paused}
                                        onChange={handleEnabledChange}
                                        color="info" 
                                    />
                                    <Typography>Active Sync</Typography>
                                </RowContainerNormal>
                                <TextInputField placeholder="REST Address" label="REST Address *" name="rest" onChange={handleInputChange} value={selectedCloud?.rest} />
                                <TextInputField placeholder="MQTT Address" label="MQTT Address *" name="mqtt" onChange={handleInputChange} value={selectedCloud?.mqtt} />
                                <TextInputField placeholder="Username" label="Username" name="username" onChange={handleInputChange} value={selectedCloud?.username} />
                                <TextInputField disabled={selectedCloud?.paused} placeholder="****" label="Password" name="token" onChange={handleInputChange} value={selectedCloud?.token} />
                            </Box>
                            <PrimaryIconButton
                                disabled={!hasUnsavedChanges}
                                iconname="save"
                                onClick={handleSaveClick}
                                type="button"
                                title="SAVE"
                            />
                        </GridItemEl>
                        
                        <GridItemEl text={'Access Point'} icon={'power_settings_new'}>
                            <Box p={2}>
                                <form onSubmit={submitSSID}>
                                    <TextInputField 
                                        icon={<CellTower sx={{fontSize:20,mx:1}}/>} 
                                        label="Access Point SSID" 
                                        value={apConn? atob(apConn["802-11-wireless"]?.ssid as string) : ""}
                                        name="SSID"
                                        id="SSID"
                                        placeholder="Enter SSID"
                                    />
                                    <TextInputField 
                                        icon={<LockOutlined 
                                        sx={{fontSize:20,mx:1}}/>} 
                                        label="Access Point Pasword" 
                                        placeholder="Enter password"
                                        onChange={()=>{}} 
                                        name="password"
                                        id="password"
                                    />
                                    <PrimaryButton title="Save" type="submit" />
                                </form>
                            </Box>
                        </GridItemEl>
                        
                        <GridItemEl text={'Access Point Mode'} icon={'settings'}>
                            <Box p={2}>
                                <Typography fontSize={13} color={'#FA9E0E'}>
                                    Warning: If you're using WiFi to access your gateway, 
                                    after pressing this button you will need to connect to the Wazigate Hotspot in prder to control
                                    your gateway
                                </Typography>
                                <PrimaryButton title="Switch " onClick={switchToAPMode} type="button" />
                            </Box>
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
                    <GridItem lg={7} md={6} xs={12} matches={matches}  additionStyles={{bgcolor:'#fff',width:'100%'}}>
                        <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, bgcolor: '#D8D8D8', alignItems: 'center' }} p={1} >
                            <WifiOutlined sx={IconStyle}/>
                            <Typography color={'#212529'} fontWeight={500}>Available Wifi</Typography>
                        </Box>
                        <Box bgcolor={'#D4E3F5'} p={1}>
                            <Typography>Connection activated | Access Point Mode</Typography>
                        </Box>
                        <Box p={1} borderBottom={'1px solid #ccc'}>
                            <Typography color={'#666'}>Please select a network</Typography>
                        </Box>
                        {
                            scanLoading?
                                <Box sx={{mx:'auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%'}}>
                                    <Typography>Checking for available networks</Typography>
                                    <CircularProgress />
                                </Box>
                            :(
                                wifiList.map((wifi) => (
                                    <Box key={wifi.ssid} onClick={()=>setSelectedWifi(wifi)}>
                                        <RowContainerBetween additionStyles={{cursor:'pointer',":hover":{bgcolor:'#ccc'},borderBottom:'1px solid #ccc',p:1}}>
                                            <Typography>{wifi.ssid}</Typography>
                                            <Icon sx={IconStyle}>wifi_outlined</Icon>
                                        </RowContainerBetween>
                                    </Box>
                                )
                            ))
                        }
                    </GridItem>
                </Grid>
            </Box>
        </>
    )
}
