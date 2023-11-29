import { Box, Grid, Stack, Typography } from "@mui/material";
import {Router, CloudOff,Wifi, WaterDrop,} from '@mui/icons-material';
import BasicTable from "../components/BasicTable";
import React, { useContext, useEffect } from "react";
import { DEFAULT_COLORS } from "../constants";
import { useOutletContext } from "react-router-dom";
import MobileDashboard from "../components/layout/MobileDashboard";
import RowContainerNormal from "../components/RowContainerNormal";
import RowContainerBetween from "../components/RowContainerBetween";
import { DevicesContext } from "../context/devices.context";
import { App, Device } from "waziup";
export const Item=({more,color,children, title}:{more:string,children:React.ReactNode, color:string,title:string})=>(
    <Box width={'33%'} minWidth={250} mx={2} sx={{ height: '100%',borderRadius:2, bgcolor: 'white', p: 2 }}>
        {children}
        <NormalText title={title} />
        <Typography fontSize={14} color={color} fontWeight={300}>{more}</Typography>
    </Box>
);
const DeviceStatus = ({devices}:{devices:Device[]})=>{
    console.log(devices);
    return(
        <Box sx={{ height: '100%',borderRadius:2, bgcolor: 'white', p: 2}}>
            <NormalText title="Device Status" />
            <BasicTable/>
        </Box>
    );
}
const TextItem = ({text}:{text:string})=>(
    <Typography sx={{fontSize:[10,10,12,13,10],color:DEFAULT_COLORS.secondary_black,fontWeight:300}} >{text}</Typography>

)
const AppStatus = ({apps}:{apps:App[]})=>(
    <Box sx={{ height: '100%', bgcolor: 'white', borderRadius:2, p: 2}}>
        <NormalText title="App Status" />
        <Stack width={'100%'} height={'100%'}>
            {
                apps.map((app,index)=>(
                    <RowContainerBetween key={index}>
                        <RowContainerNormal >
                            <WaterDrop sx={{ fontSize: [20,35,38,40,40],color:'info.main' }} />
                            <Box>
                                <Typography color={'black'} fontWeight={300}>{app.name}</Typography>
                                <TextItem text="Last active 3h ago"/>
                            </Box>
                        </RowContainerNormal>
                        <Typography sx={{color:app.state?app.state.running?'info.main':'#CCC400':'info.main',fontWeight:300, fontSize:[10,12,16,15,10]}}>{app.state?app.state.running?'Running':'Stopped':'Running'}</Typography> 
                    </RowContainerBetween>
                ))
            }
        </Stack>
    </Box>
);
export const NormalText= ({title}:{title:string})=>(<Typography color={'black'}>{title}</Typography>)
function Dashboard() {
    const {devices,apps}=useContext(DevicesContext);
    useEffect(()=>{
        const fb = async()=>{
            window.wazigate.getDevices().then((res)=>{
                console.log('Devices: ',res);
            }).catch(err=>{
                console.log('Error encountered: ',err)
            });
        }
        fb()
    },[])
    const [matches] = useOutletContext<[matches: boolean]>();
    console.log(devices);
    
    return (
        <Box sx={{height:'100%',overflowY:'scroll'}}>
            {
                matches?(
                    <Box p={3} sx={{ width:'100%'}}>
                        <Typography color={'black'} fontWeight={700}>Gateway Dashboard</Typography>
                        <Stack direction={'row'} mt={2} spacing={2}>
                            <Item color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                                <Router sx={{mb:2, fontSize: 42,color:'black' }} />
                            </Item>
                            <Item color="#CCC400" title="Cloud Synchronization" more="Last active 3h ago" >
                                <CloudOff sx={{mb:2, fontSize: 42,color:'#D9D9D9' }} />
                            </Item>
                            <Item color={DEFAULT_COLORS.secondary_black} title="Access point mode" more="Wifi Name: 'Wazigate E55344'" >
                                <Wifi sx={{mb:2, fontSize: 42,color:'black' }} />
                            </Item>
                        </Stack>
                        <Grid mt={2} container spacing={2}>
                            <Grid item py={6} sm={7} md={8} >
                                <DeviceStatus devices={devices} />
                            </Grid>
                            <Grid py={6} item sm={5} md={4} >
                                <AppStatus apps={apps} />
                            </Grid>
                        </Grid>
                    </Box>
                ):(
                    <>
                        <MobileDashboard/>
                    </>
                )
            }
        </Box>
    );
}

export default Dashboard;