import { Box, Button,Grid,CardContent,Typography, SxProps, Theme } from '@mui/material';
import { RowContainerBetween } from './dashboard';
import { Add,DeviceThermostat, Sensors } from '@mui/icons-material';
import { DEFAULT_COLORS } from '../constants';
const IconStyle: SxProps<Theme> = {
    cursor:'pointer',
}
function Devices() {
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Typography fontWeight={700} color={'black'}>Devices</Typography>
                <Button variant={'contained'}>
                    <Add />
                    Add Device
                </Button>
            </RowContainerBetween>
            <Grid container my={2} spacing={2}>
                <Grid item xs={4}>
                    <Box sx={{ height: '100%',position:'relative', bgcolor: 'white', borderRadius:2, }}>
                        <Box sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                            <Sensors sx={{fontSize:15, color:'#fff'}}/>
                            <Typography fontSize={10} mx={1} color={'white'} component={'span'}>WaziDev</Typography>
                        </Box>
                        <Box sx={{borderBottom:'1px solid black',py:1.5, px:2,}}>
                            <RowContainerBetween>
                                <Box>
                                    <Typography color={'black'} fontWeight={700}>WaziDev</Typography>
                                    <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>Last updated: 10 seconds</Typography>
                                </Box>
                                <Add sx={IconStyle} />
                            </RowContainerBetween>
                        </Box>
                        <CardContent sx={{py:2}}>
                            <Box>
                                <RowContainerBetween>
                                    <Box display={'flex'} justifyContent={'space-between'} width={'50%'}>
                                        <DeviceThermostat sx={{ fontSize: 20,color:DEFAULT_COLORS.primary_black }} />
                                        <Typography color={'black'} fontWeight={300}>Room_1 Temp</Typography>
                                    </Box>
                                    <Typography color={DEFAULT_COLORS.primary_blue} fontWeight={300}>25&deg;C </Typography>
                                </RowContainerBetween>
                            </Box>
                        </CardContent>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Devices;