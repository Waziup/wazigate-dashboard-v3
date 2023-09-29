import { Router, Add, MoreVert } from "@mui/icons-material";
import { Box, Breadcrumbs, Button,Link, Grid, Typography, } from "@mui/material";
import RowContainerBetween from "../components/rowcontainerbetween";
import { SelectElement } from "./automation";
function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Box>
                    <Typography fontWeight={700} color={'black'}>Device 1</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href="/devices">
                                Devices
                            </Link>
                            <Link
                                underline="hover"
                                color="inherit"
                                href="/material-ui/getting-started/installation/"
                            >
                                Device 1
                            </Link>
                            <Typography color="text.primary">Device 1</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Button onClick={()=>{}} variant={'contained'}>
                    <Add/>
                    NEW DEVICE
                </Button>
            </RowContainerBetween>
            <Grid container mt={4} spacing={1}>
                <Grid item xs={4} borderRadius={2} py={2} px={1} bgcolor={'#fff'}>
                    <RowContainerBetween additionStyles={{my:1}}>
                        <Box display={'flex'} my={1} alignItems={'center'}>
                            <Router sx={{ fontSize: 17,mx:1, color:'#292F3F' }} />
                            <Typography fontWeight={500} fontSize={16} color={'#292F3F'}>LoRaWAN Settings</Typography>
                        </Box>
                        <MoreVert sx={{color:'black', fontSize:20}} />
                    </RowContainerBetween>
                    <Box>
                        <SelectElement title={'Application Type'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                        <RowContainerBetween>
                            <SelectElement title={'Condition'} handleChange={()=>{}} conditions={['>','<','==']} value={'>'} />
                        </RowContainerBetween>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DeviceSettings;