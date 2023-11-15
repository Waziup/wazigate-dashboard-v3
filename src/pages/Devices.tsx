import { Box, Button,Grid,CardContent,Typography, } from '@mui/material';
import RowContainerBetween from '../components/RowContainerBetween';
import { Add,CompareArrows,DeviceThermostat, OnlinePrediction, Sensors } from '@mui/icons-material';
import { DEFAULT_COLORS } from '../constants';
import { useNavigate,  } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { type Device } from 'waziup';
const IconStyle = {
    cursor:'pointer',
    color:'black',
}
function Devices() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState<Device[]>([]);
    useEffect(() => {
        window.wazigate.getDevices().then(setDevices);
    }, []);
    return (
        <Box sx={{p:3, height:'100%'}}>
            <RowContainerBetween>
                <Typography fontWeight={700} color={'black'}>Devices</Typography>
                <Button variant={'contained'}>
                    <Add />
                    Add Device
                </Button>
            </RowContainerBetween>
            <Grid container my={2} spacing={2}>
                {
                    devices.map((device)=>(
                        <Grid item md={6} lg={4} xl={4} sm={8} xs={12} >
                            <Box onClick={()=>{navigate(`/devices/${device.id}`,{state:{...device,title:device.name}})}} sx={{cursor:'pointer',":hover":{bgcolor:'#fffff1'}, height: '100%',position:'relative', bgcolor: 'white', borderRadius:2, }}>
                                <Box sx={{display:'flex',alignItems:'center', position:'absolute',top:-5,my:-1,borderRadius:1,mx:1,bgcolor:DEFAULT_COLORS.primary_blue}}>
                                    <Sensors sx={{fontSize:15, color:'#fff'}}/>
                                    <Typography fontSize={13} mx={1} color={'white'} component={'span'}>WaziDev</Typography>
                                </Box>
                                <Box sx={{borderBottom:'1px solid black',py:1.5, px:2,}}>
                                    <RowContainerBetween>
                                        <Box>
                                            <Typography color={'black'} fontWeight={700}>{device.name.slice(0,10)+'....'}</Typography>
                                            <Typography color={DEFAULT_COLORS.secondary_black} fontSize={15} fontWeight={300}>Last updated: 10 seconds</Typography>
                                        </Box>
                                        <Add sx={IconStyle} />
                                    </RowContainerBetween>
                                </Box>
                                <CardContent sx={{py:2}}>
                                    <Button variant="text" sx={{bgcolor:'#F7F7F7',textTransform:'full-width', color:DEFAULT_COLORS.primary_black}} startIcon={<Add />}>
                                        New Interface
                                    </Button>
                                    {
                                        device.sensors.length>0?device.sensors.map(()=>(
                                            <Box >
                                                <RowContainerBetween additionStyles={{my:2}}>
                                                    <Box sx={{display:'flex',width:'50%'}}>
                                                        <DeviceThermostat sx={{ fontSize: 20,color:DEFAULT_COLORS.primary_black }} />
                                                        <Typography color={'black'} mx={1} fontSize={12} fontWeight={300}>Room_1 Temp</Typography>
                                                    </Box>
                                                    <Typography color={DEFAULT_COLORS.primary_blue}fontSize={14} fontWeight={300}>25&deg;C </Typography>
                                                </RowContainerBetween>
                                                <RowContainerBetween additionStyles={{my:2}}>
                                                    
                                                    <Box sx={{display:'flex',width:'50%'}}>
                                                        <OnlinePrediction sx={{ fontSize: 20,color:DEFAULT_COLORS.primary_black }} />
                                                        <Typography color={'black'} mx={1} fontSize={12} fontWeight={300}>Object Detector</Typography>
                                                    </Box>
                                                    <Typography color={DEFAULT_COLORS.primary_blue}fontSize={14} fontWeight={300}>On </Typography>
                                                </RowContainerBetween>
                                                <RowContainerBetween additionStyles={{my:2}}>
                                                    
                                                    <Box sx={{display:'flex',width:'50%'}}>
                                                        <DeviceThermostat sx={{ fontSize: 20,color:DEFAULT_COLORS.primary_black }} />
                                                        <Typography color={'black'} mx={1} fontSize={12} fontWeight={300}>Thermometer</Typography>
                                                    </Box>
                                                    <Typography color={DEFAULT_COLORS.primary_blue}fontSize={14} fontWeight={300}>36&deg;C </Typography>
                                                </RowContainerBetween>
                                                <RowContainerBetween additionStyles={{my:2}}>
                                                    
                                                    <Box sx={{display:'flex',width:'50%'}}>
                                                        <CompareArrows sx={{ fontSize: 20,color:DEFAULT_COLORS.primary_black }} />
                                                        <Typography color={'black'} ml={1} fontSize={12} fontWeight={300}>Soil Pressure Loan</Typography>
                                                    </Box>
                                                    <Typography color={DEFAULT_COLORS.primary_blue}fontSize={14} fontWeight={300}>On </Typography>
                                                </RowContainerBetween>
                                            </Box>
                                        )):(
                                            <Box my={2}>
                                                <Typography sx={{textAlign:'center',fontWeight:'bold'}}>This device has no sensor</Typography>
                                            </Box>
                                        )
                                    }
                                </CardContent>
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}

export default Devices;