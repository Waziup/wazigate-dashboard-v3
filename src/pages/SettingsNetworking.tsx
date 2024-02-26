import { Box, Breadcrumbs,ListItemText, Paper,styled, Grid,Icon, SxProps,  Theme, Typography, CircularProgress, Grow, LinearProgress } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import { CellTower, DesktopWindowsOutlined, LockOutlined, ModeFanOffOutlined, WifiOutlined } from "@mui/icons-material";
import { Android12Switch } from "../components/shared/Switch";
import PrimaryButton from "../components/shared/PrimaryButton";
import { getWiFiScan,setConf as setConfFc, AccessPoint,getConf, setWiFiConnect, WifiReq } from "../utils/systemapi";
import { useEffect, useState } from "react";
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
}));
const GridItemEl=({ children, text, additionStyles, icon }: { additionStyles?: SxProps<Theme>, text: string, children: React.ReactNode, icon: string })=>(
    <Item sx={additionStyles}>
        <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, bgcolor: '#D8D8D8', alignItems: 'center' }} p={1} >
            <Icon sx={IconStyle}>{icon}</Icon>
            <Typography color={'#212529'} fontWeight={500}>{text}</Typography>
        </Box>
        {children}
    </Item>
)
const GridItem = ({ children, xs,md,additionStyles }: {xs:number,md:number,spacing?:number, matches: boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode,  }) => (
    <Grid m={1} item xs={xs} md={md} spacing={3} sx={additionStyles} borderRadius={2}  >
        {children}
    </Grid>
);
const IconStyle: SxProps<Theme> = { fontSize: 20, mr: 2, color: DEFAULT_COLORS.primary_black };
import TextInputField from "../components/shared/TextInputField";
import { Cloud } from "waziup";
import MenuComponent from "../components/shared/MenuDropDown";
import PrimaryIconButton from "../components/shared/PrimaryIconButton";
export default function SettingsNetworking() {
    const [matches] = useOutletContext<[matches:boolean]>();
    const [scanLoading,setScanLoading]=useState<boolean>(false);
    const [wifiList,setWifiList]=useState<AccessPoint[]>([]);
    const [selectedWifi,setSelectedWifi]=useState<AccessPoint|undefined>(undefined);
    const scan = () => {
        setScanLoading(true);
        getWiFiScan().then((res) => {
            console.log(res);
            setWifiList(res);
            setScanLoading(false);
        }).catch((err) => {
            console.log(err);
            setScanLoading(false);
        });
    }
    const [clouds, setClouds] = useState<Cloud[]>([]);
    const [saving, setSaving] = useState(false);
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
    const handleSaveClick = () => {
        if(hasUnsavedChanges){
            Promise.all([
                window.wazigate.set(`clouds/${selectedCloud?.id as string}/rest`, selectedCloud?.rest),
                window.wazigate.set(`clouds/${selectedCloud?.id}/mqtt`, selectedCloud?.mqtt),
                window.wazigate.setCloudCredentials(selectedCloud?.id as string, selectedCloud?.username as string, selectedCloud?.token as string),
            ]).then(() => {
                sethasUnsavedChanges(false);
            }, (err: Error) => {
                alert("There was an error saving the changes:\n" + err);
            });
        }else{
            alert('No changes');
        }
    }
    const handleEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (hasUnsavedChanges) {
            alert("Save all changes before activating the synchronization!");
            return
        }
        const enabled = event.target.checked;
        setSelectedCloud({
            ...selectedCloud,
            paused: !enabled
        } as Cloud);
        setSaving(true);
        const timer = new Promise(resolve => setTimeout(resolve, 2000));
        window.wazigate.setCloudPaused(selectedCloud?.id as string, !enabled).then(() => {
            timer.then(() => {
                setSaving(false);
            })
        }, (err: Error) => {
            setSaving(false);
            setSelectedCloud({
                ...selectedCloud,
                paused: !enabled
            } as Cloud);
            if(enabled) {
                alert("There was an error activating the sync!\n Check your credentials and try again.\n\nThe server said:\n" + err);
            } else {
                alert("There was an error saving the changes:\n" + err);
            }
        });
    }
    const submitConf = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const fan_trigger_temp =formData.get('fan')?.toString();
        const oled_halt_timeout = formData.get('oled')?.toString();
        const data = {
          fan_trigger_temp: parseInt(fan_trigger_temp as string),
          oled_halt_timeout: parseInt(oled_halt_timeout as string,10),
        };
        setConfFc(data).then(
          (msg:string) => {
            alert(msg);
          }, 
          (error) => {
            alert(error);
          }
        );
    };
    useEffect(() => {
        window.wazigate.getClouds().then((clouds) => setClouds(Object.values(clouds)));
        getConf().then((conf) => {
            setConf(conf);
        }).catch((err) => {
            setConf({
                fan_trigger_temp:'',
                oled_halt_timeout:''
            });
            console.log(err);
        });
        
    }, []);
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
    
        const data: WifiReq = {
          ssid: target.SSID.value,
          password: target.password.value,
          autoConnect: true
        };
        setScanLoading(true)
            setWiFiConnect(data).then(() => {
                setScanLoading(false)
                setSelectedWifi(undefined);
            });
        };
    useEffect(() => {
        scan();
    },[]);
    return (
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
                <GridItem spacing={2} md={4.6} xs={12} matches={matches} additionStyles={{}}>
                    {
                        clouds.map((cloud)=>(
                            <GridItemEl text={cloud.name} icon={'cloud'}>
                                <Grow in={saving}>
                                    <LinearProgress />
                                </Grow>
                                <RowContainerBetween additionStyles={{borderBottom:'1px solid #ccc'}}>
                                    <RowContainerNormal>
                                        <Box component={'img'} src='/wazilogo.svg' mx={2} />
                                        <Box>
                                            <ListItemText
                                                primary={cloud.name || cloud.id}
                                                secondary={`ID ${cloud.id}`}
                                                
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
                                            checked={!cloud.paused}
                                            onChange={handleEnabledChange}
                                            color="info" 
                                        />
                                        <Typography>Active Sync</Typography>
                                    </RowContainerNormal>
                                    <TextInputField label="REST Address *" name="rest" onChange={handleInputChange} value={'Wazidev'} />
                                    <TextInputField label="MQTT Address *" name="mqtt" onChange={handleInputChange} value={'Wazidev'} />
                                    <TextInputField label="Username" name="username" onChange={handleInputChange} value={'johndoe@gmail.com'} />
                                    <TextInputField label="Password" name="password" onChange={handleInputChange} value={'******'} />
                                </Box>
                                <Grow in={hasUnsavedChanges}>
                                    <PrimaryIconButton
                                        iconname="save"
                                        onClick={handleSaveClick}
                                        type="button"
                                        title="SAVE"
                                    />
                                </Grow>
                            </GridItemEl>
                        ))
                    }
                    {
                        selectedWifi ? (
                            <GridItemEl text={'Access Point'} icon={'power_settings_new'}>
                                <Box p={2}>
                                    <form onSubmit={submitHandler}>
                                        <TextInputField 
                                            icon={<CellTower sx={{fontSize:20,mx:1}}/>} 
                                            label="Access Point SSID" onChange={()=>{}} 
                                            value={selectedWifi.ssid} 
                                        />
                                        <TextInputField 
                                            icon={<LockOutlined 
                                            sx={{fontSize:20,mx:1}}/>} 
                                            label="Access Point Pasword" 
                                            onChange={()=>{}} 
                                            value={''} 
                                        />
                                        <PrimaryButton title="Save" onClick={()=>{}} type="button" />
                                    </form>
                                </Box>
                            </GridItemEl>
                        ):null
                    }
                    <GridItemEl text={'Misc. Settings'} icon={'settings'}>
                        <Box p={2}>
                            <form onSubmit={submitConf}>
                                <TextInputField 
                                    icon={<ModeFanOffOutlined sx={{fontSize:20,mx:1}}/>} 
                                    label="Fan Trigger Temperature (C)" 
                                    onChange={()=>{}} 
                                    name="fan"
                                    value={
                                        conf ? (conf?.fan_trigger_temp as unknown as string) : "Loading..."} 
                                />
                                <TextInputField 
                                    icon={<DesktopWindowsOutlined sx={{fontSize:20,mx:1}}/>} 
                                    label="OLED halt timeout (seconds)" 
                                    onChange={()=>{}}
                                    name="oled"
                                    value={   conf ? (conf?.oled_halt_timeout as unknown as string) : "Loading..."}
                                />
                                <PrimaryButton title="Save" onClick={()=>{}} type="button" />
                            </form>
                        </Box>
                    </GridItemEl>
                </GridItem>
                <GridItem md={7} xs={12} matches={matches}  additionStyles={{bgcolor:'#fff',width:'100%'}}>
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
                        scanLoading?wifiList.map((wifi) => (
                            <Box key={wifi.ssid} onClick={()=>setSelectedWifi(wifi)}>
                                <RowContainerBetween additionStyles={{borderBottom:'1px solid #ccc',p:1}}>
                                    <Typography>{wifi.ssid}</Typography>
                                    <Icon sx={IconStyle}>wifi_outlined</Icon>
                                </RowContainerBetween>
                            </Box>
                        )):(
                            <Box sx={{mx:'auto',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%'}}>
                                <Typography>Checking for available networks</Typography>
                                <CircularProgress />
                            </Box>
                        )
                    }
                </GridItem>
            </Grid>
        </Box>
    )
}
