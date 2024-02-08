import { Box, Breadcrumbs, FormControl,Paper,styled, Grid,Icon, SxProps, TextField, Theme, Typography, CircularProgress } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import { CellTower, LockOutlined, MoreVert } from "@mui/icons-material";
import { Android12Switch } from "../components/shared/Switch";
import PrimaryButton from "../components/shared/PrimaryButton";
import { getWiFiScan, AccessPoint, setWiFiConnect, WifiReq } from "../utils/systemapi";
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
interface InputFieldProps extends React.ComponentProps<typeof TextField> {
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    name?: string,
    required?: boolean,
    placeholder?: string,
    type?: string,
    sx?: SxProps<Theme>,
    multiline?: boolean,
    rows?: number
    icon?: React.ReactNode
}
const TextInputField = ({onChange,value,label,icon, name}:InputFieldProps)=>(
    <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid #ccc'}}>
        <Typography textAlign={'left'} color={'primary'} mb={.4} fontSize={12}>{label}</Typography>
        <Box sx={{display:'flex',alignItems:'flex-end' }}>
            {icon}
            <input 
                onInput={onChange} 
                name={name} 
                placeholder='Enter device name' 
                value={value}
                required
                
                style={{border:'none',width:'100%',fontSize:14,color:'#888', margin:'0 3px', outline:'none'}}
            />
        </Box>
    </FormControl>
)
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
                    <GridItemEl text={'Network'} icon={'cell_tower'}>
                        <RowContainerBetween additionStyles={{borderBottom:'1px solid #ccc'}}>
                            <RowContainerNormal>
                                <Box component={'img'} src='/wazilogo.svg' mx={2} />
                                <Typography>Waziup Cloud</Typography>
                            </RowContainerNormal>
                            <MoreVert/>
                        </RowContainerBetween>
                        <Box px={2}>
                            <RowContainerNormal>
                                <Android12Switch color="info" checked />
                                <Typography>Active Sync</Typography>
                            </RowContainerNormal>
                            <TextInputField label="REST Address *" onChange={()=>{}} value={'Wazidev'} />
                            <TextInputField label="MQTT Address *" onChange={()=>{}} value={'Wazidev'} />
                            <TextInputField label="Username" onChange={()=>{}} value={'johndoe@gmail.com'} />
                            <TextInputField label="Password" onChange={()=>{}} value={'******'} />

                        </Box>
                    </GridItemEl>
                    {
                        selectedWifi && (
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
                                            value={'Wazidev'} 
                                        />
                                        <PrimaryButton title="Save" onClick={()=>{}} type="button" />
                                    </form>
                                </Box>
                            </GridItemEl>
                        )
                    }
                </GridItem>
                <GridItem md={7} xs={12} matches={matches}  additionStyles={{bgcolor:'#fff'}}>
                    <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, bgcolor: '#D8D8D8', alignItems: 'center' }} p={1} >
                        <Icon sx={IconStyle}>wifi_outlined</Icon>
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
                            <Box>
                                <Typography>Checking for available networks</Typography>
                                <CircularProgress />
                            </Box>
                        )
                    }
                    <Box>
                        <RowContainerBetween additionStyles={{borderBottom:'1px solid #ccc',p:1}}>
                            <Typography>Hesdcscs</Typography>
                            <Icon sx={IconStyle}>wifi_outlined</Icon>
                        </RowContainerBetween>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}
