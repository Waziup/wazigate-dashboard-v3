import { CloudOff,Router, WaterDrop, Wifi, WifiTethering } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";
import { RowContainerBetween, RowContainerNormal } from "../../pages/dashboard";
const Item = ({more,color,children, title}:{more:string,children:React.ReactNode, color:string,title:string})=>(
    <Box width={'30%'} minWidth={190} mx={1} sx={{ borderRadius:1,border:'1px solid #ccc', height: '100%', bgcolor: 'white', p: 2 }}>
        {children}
        <Typography fontSize={13} color={'black'}>{title}</Typography>
        <Typography color={color} fontSize={13} fontWeight={300}>{more}</Typography>
    </Box>
)
export default function MobileDashboard() {
    return (
        <Box>
            <Stack direction={'row'} overflow={'scroll'} m={2} spacing={1}>
                <Item color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                    <Router sx={{ fontSize: 20,color:'black' }} />
                </Item>
                <Item color="#E9C68F" title="Cloud Synchronization" more="3h ago" >
                    <CloudOff sx={{ fontSize: 20,color:'#D9D9D9' }} />
                </Item>
                <Item color={DEFAULT_COLORS.secondary_black} title="Access point mode" more="Wifi Name: 'Wazigate E55344'" >
                    <Wifi sx={{ fontSize: 20,color:'black' }} />
                </Item>
            </Stack>
            <Box mt={5} px={1}>
                <Typography color={'#666666'}>Device status</Typography>
                <Box display={'flex'} flexDirection={'column'} mt={2} py={1}  alignItems={'center'}>
                    <Box onClick={()=>{}} sx={{cursor:'pointer',my:1, ":hover":{bgcolor:'rgba(0,0,0,.1)'},width:'95%', height: '100%',position:'relative', bgcolor: 'white', borderRadius:2, }}>
                        <Box sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                            <Typography fontSize={10} mx={1} color={'white'} component={'span'}>WaziDev</Typography>
                        </Box>
                        <Box sx={{py:1.5, px:2,}}>
                            <RowContainerBetween>
                                <Typography color={'black'} fontSize={18} fontWeight={500}>Block 1</Typography>
                                <Typography color={DEFAULT_COLORS.primary_blue} lineHeight={.8} fontWeight={300}>active</Typography> 
                            </RowContainerBetween>
                            <RowContainerBetween>
                                <Typography fontSize={13} color={'#797979'}>Last updated: 10sec ago</Typography>
                                <Typography fontSize={10} color={'#797979'} my={1} lineHeight={.8} fontWeight={300}>placeholder text</Typography> 
                            </RowContainerBetween>
                        </Box>
                    </Box>
                    <Box onClick={()=>{}} sx={{cursor:'pointer',my:2, ":hover":{bgcolor:'rgba(0,0,0,.1)'},width:'95%', height: '100%',position:'relative', bgcolor: 'white', borderRadius:2, }}>
                        <Box sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                            <Typography fontSize={10} mx={1} color={'white'} component={'span'}>WaziDev</Typography>
                        </Box>
                        <Box sx={{py:1.5, px:2,}}>
                            <RowContainerBetween>
                                <Typography color={'black'} fontSize={18} fontWeight={500}>Block 1</Typography>
                                <Typography color={DEFAULT_COLORS.primary_blue} lineHeight={.8} fontWeight={300}>active</Typography> 
                            </RowContainerBetween>
                            <RowContainerBetween>
                                <Typography fontSize={13} color={'#797979'}>Last updated: 10sec ago</Typography>
                                <Typography fontSize={10} color={'#797979'} my={1} lineHeight={.8} fontWeight={300}>placeholder text</Typography> 
                            </RowContainerBetween>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box mt={5} px={1}>
                <Typography color={'#666666'}>App status</Typography>
                <Box display={'flex'} flexDirection={'column'} mt={1} borderRadius={2} bgcolor={'#fff'}  alignItems={'center'}>
                    <Box onClick={()=>{}} sx={{cursor:'pointer',":hover":{bgcolor:'rgba(0,0,0,.1)'},borderBottom:'1px solid #E2E2E2', width:'95%', height: '100%',position:'relative',px:1, bgcolor: 'white',  }}>
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
                    </Box>
                    <Box onClick={()=>{}} sx={{cursor:'pointer',":hover":{bgcolor:'rgba(0,0,0,.1)'},width:'95%',px:1,borderBottom:'1px solid #E2E2E2', height: '100%',position:'relative', bgcolor: 'white',  }}>
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
                            <Typography color={'#C5C5C5'} fontWeight={300}>offline</Typography>    
                        </RowContainerBetween>
                    </Box> 
                </Box>
            </Box>
        </Box>
    );
}