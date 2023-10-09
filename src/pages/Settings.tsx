import { Box, Grid, Typography } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { CellTower, CheckCircle } from '@mui/icons-material';
import RowContainerBetween from '../components/RowContainerBetween';
function Settings() {
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <Box>
                <Typography fontWeight={700} color={'black'}>Devices</Typography>
                <Typography sx={{color:DEFAULT_COLORS.secondary_black}}>Setup your Wazigate Edge Apps</Typography>
            </Box>
            <Grid container mt={2}>
                <Grid item xs={5} m={2} borderRadius={2} bgcolor={'#fff'} >
                    <Box display={'flex'} sx={{borderTopLeftRadius:5,borderTopRightRadius:5}} bgcolor={'#D8D8D8'} p={1} alignItems={'center'}>
                        <CellTower sx={{ fontSize: 20,mr:2, color:DEFAULT_COLORS.primary_black }} />
                        <Typography color={'black'} fontWeight={500}>Network</Typography>
                    </Box>
                    <Box my={2}>
                        <RowContainerBetween additionStyles={{alignItems:'center',bgcolor:'#D4E3F5', m:1, borderRadius:1, p:1}}>
                            <Typography color={DEFAULT_COLORS.primary_black} sx={{textTransform:'uppercase'}} fontWeight={300}>Wazigate</Typography>
                            <CheckCircle sx={{color:DEFAULT_COLORS.primary_black,fontSize:17}} />
                        </RowContainerBetween>
                        <RowContainerBetween additionStyles={{alignItems:'center',bgcolor:'#D4E3F5', m:1, borderRadius:1, p:1}}>
                            <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>IP address</Typography>
                            <Typography color={DEFAULT_COLORS.primary_black} fontWeight={700}>192.168.88.1</Typography>
                        </RowContainerBetween>
                    </Box>
                </Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={5}></Grid>
            </Grid>
        </Box>
    );
}

export default Settings;