import { Home, ExpandMore,Router, Add, MoreVert } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Grid, Typography, } from "@mui/material";
import { RowContainerBetween, RowContainerNormal } from "./dashboard";
import { StyledBreadcrumb } from "./device";
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
                            <StyledBreadcrumb
                                component="a"
                                href="/devices"
                                label="Devices"
                                icon={<Home fontSize="small" />}
                            />
                            <StyledBreadcrumb component="a" href="/device/3" label="Device 1" />
                            <StyledBreadcrumb
                                label="Sensors"
                                deleteIcon={<ExpandMore />}
                                onDelete={handleClick}
                            />
                        </Breadcrumbs>
                    </div>
                </Box>
                <Button onClick={()=>{}} variant={'contained'}>
                    <Add/>
                    NEW DEVICE
                </Button>
            </RowContainerBetween>
            <Grid container mt={4} spacing={1}>
                <Grid component={'a'} href="/devices/3/setting" item xs={4} borderRadius={2} py={2} px={1} bgcolor={'#fff'}>
                    <RowContainerBetween>
                        <RowContainerNormal>
                            <Router sx={{ fontSize: 20,mx:1, color:'black' }} />
                            <Typography fontWeight={700} color={'black'}>Device 1</Typography>
                        </RowContainerNormal>
                        <MoreVert sx={{color:'black', fontSize:20}} />
                    </RowContainerBetween>
                    <Box>
                        <SelectElement title={'Sensor'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
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