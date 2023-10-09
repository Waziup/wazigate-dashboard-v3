import { Box, Grid, Stack, Typography } from "@mui/material";
import {Router, CloudOff,Wifi, WaterDrop, WifiTethering} from '@mui/icons-material';
import BasicTable from "../components/BasicTable";
import React from "react";
import { DEFAULT_COLORS } from "../constants";
import { useOutletContext } from "react-router-dom";
import MobileDashboard from "../components/layout/MobileDashboard";
import RowContainerNormal from "../components/RowContainerNormal";
import RowContainerBetween from "../components/RowContainerBetween";
export const Item=({more,color,children, title}:{more:string,children:React.ReactNode, color:string,title:string})=>(
    <Box width={'25%'} mx={2} sx={{ height: '100%',borderRadius:2, bgcolor: 'white', p: 2 }}>
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
const AppStatus = ()=>(
    <Box sx={{ height: '100%', bgcolor: 'white', borderRadius:2, p: 2}}>
        <NormalText title="App Status" />
        <Stack>
            <RowContainerBetween>
                <RowContainerNormal >
                    <WaterDrop sx={{ fontSize: 40,color:DEFAULT_COLORS.primary_blue }} />
                    <Box>
                        <Typography color={'black'} fontWeight={300}>Intelliris</Typography>
                        <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>Last active 3h ago</Typography>
                    </Box>
                </RowContainerNormal>
                <Typography color={DEFAULT_COLORS.primary_blue} fontWeight={300}>active</Typography> 
            </RowContainerBetween>
            <RowContainerBetween>
                <RowContainerNormal>
                    <Box sx={{ bgcolor:DEFAULT_COLORS.orange,  borderRadius:'50%',height:35,width:35, }}>
                        <WifiTethering sx={{ textAlign:'center',  color:'#fff', }} />
                    </Box>
                    <Box>
                        <Typography color={'black'} fontWeight={300}>LoraWAN</Typography>
                        <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>by Waziup</Typography>
                    </Box>
                </RowContainerNormal>
                <Typography color={'#CCC400'} fontWeight={300}>offline</Typography>    
            </RowContainerBetween>
        </Stack>
    </Box>
);
export const NormalText= ({title}:{title:string})=>(<Typography color={'black'}>{title}</Typography>)
function Dashboard() {

    const [matches] = useOutletContext<[matches: boolean]>();
    return (
        <>
            {
                matches?(
                    <Box p={3} sx={{ height:'100%'}}>
                        <Typography color={'black'} fontWeight={700}>Gateway Dashboard</Typography>
                        <Stack direction={'row'} mt={2} spacing={2}>
                            <Item color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                                <Router sx={{ fontSize: 50,color:'black' }} />
                            </Item>
                            <Item color="#CCC400" title="Cloud Synchronization" more="Last active 3h ago" >
                                <CloudOff sx={{ fontSize: 50,color:'#D9D9D9' }} />
                            </Item>
                            <Item color={DEFAULT_COLORS.secondary_black} title="Access point mode" more="Wifi Name: 'Wazigate E55344'" >
                                <Wifi sx={{ fontSize: 50,color:'black' }} />
                            </Item>
                        </Stack>
                        <Grid mt={2} container spacing={2}>
                            <Grid item py={6} xs={8}>
                                <DeviceStatus />
                            </Grid>
                            <Grid py={6} item xs={4}>
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
        </>
    );
}

export default Dashboard;