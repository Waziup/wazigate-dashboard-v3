import { Box, Grid, Stack, Typography } from "@mui/material";
import {Router, CloudOff,Wifi, WaterDrop, WifiTethering} from '@mui/icons-material';
import BasicTable from "../components/BasicTable";
import React, { useEffect } from "react";
import { DEFAULT_COLORS } from "../constants";
import { useOutletContext } from "react-router-dom";
import MobileDashboard from "../components/layout/MobileDashboard";
import RowContainerNormal from "../components/RowContainerNormal";
import RowContainerBetween from "../components/RowContainerBetween";
export const Item=({more,color,children, title}:{more:string,children:React.ReactNode, color:string,title:string})=>(
    <Box width={'33%'} minWidth={250} mx={2} sx={{ height: '100%',borderRadius:2, bgcolor: 'white', p: 2 }}>
        {children}
        <NormalText title={title} />
        <Typography fontSize={14} color={color} fontWeight={300}>{more}</Typography>
    </Box>
);
const DeviceStatus = ()=>(
    <Box sx={{ height: '100%',borderRadius:2, bgcolor: 'white', p: 2}}>
        <NormalText title="Device Status" />
        <BasicTable/>
    </Box>
);
const TextItem = ({text}:{text:string})=>(
    <Typography sx={{fontSize:[10,10,12,13,10],color:DEFAULT_COLORS.secondary_black,fontWeight:300}} >{text}</Typography>

)
const AppStatus = ()=>(
    <Box sx={{ height: '100%', bgcolor: 'white', borderRadius:2, p: 2}}>
        <NormalText title="App Status" />
        <Stack width={'100%'} height={'100%'}>
            <RowContainerBetween>
                <RowContainerNormal >
                    <WaterDrop sx={{ fontSize: [20,35,38,40,40],color:'info.main' }} />
                    <Box>
                        <Typography color={'black'} fontWeight={300}>Intelliris</Typography>
                        <TextItem text="Last active 3h ago"/>
                    </Box>
                </RowContainerNormal>
                <Typography sx={{color:'info.main',fontWeight:300, fontSize:[10,12,16,15,10]}}>active</Typography> 
            </RowContainerBetween>
            <RowContainerBetween>
                <RowContainerNormal>
                    <Box sx={{mr:.5, bgcolor:'secondary.main', textAlign:'center', borderRadius:'50%',height:[20,35,38,40,40],width:[20,35,38,40,40], }}>
                        <WifiTethering sx={{ m:'auto',mt:.5,  color:'#fff', }} />
                    </Box>
                    <Box>
                        <Typography color={'black'} fontWeight={300}>LoraWAN</Typography>
                        <TextItem text="by Waziup"/>
                    </Box>
                </RowContainerNormal>
                <Typography color={'#CCC400'} fontSize={[10,12,16,15,10]} fontWeight={300}>offline</Typography>    
            </RowContainerBetween>
        </Stack>
    </Box>
);
export const NormalText= ({title}:{title:string})=>(<Typography color={'black'}>{title}</Typography>)
function Dashboard() {
    useEffect(()=>{
        const fb = async()=>{

            console.log(await window.wazigate.getClouds())
        }
        fb()
    },[])
    const [matches] = useOutletContext<[matches: boolean]>();
    return (
        <Box sx={{height:'100vh'}}>
            {
                matches?(
                    <Box p={3} sx={{width:'100%'}}>
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
                                <DeviceStatus />
                            </Grid>
                            <Grid py={6} item sm={5} md={4} >
                                <AppStatus />
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