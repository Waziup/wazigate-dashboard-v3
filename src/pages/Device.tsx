import {  SettingsTwoTone } from "@mui/icons-material";
import { Box, Breadcrumbs, Button,  Typography, } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
// import { SelectElement } from "./Automation";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
import { Sensor } from "waziup";
function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    
    const {state} = useLocation();
    const navigate = useNavigate();
    const [sensors, setSensors] = useState<Sensor[]>([]);
    useEffect(() => {
        // console.log(state);
        window.wazigate.getSensors(state.id).then(setSensors);
    }, [state])
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Box>
                    <Typography fontWeight={700} color={'black'}>{state.name}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link style={{color:'black'}} state={{title:'Devices'}} color="inherit" to="/devices">
                                Devices
                            </Link>
                            {/* <Link
                                underline="hover"
                                color="inherit"
                                href="/material-ui/getting-started/installation/"
                            >
                                Device 1
                            </Link> */}
                            <Typography color="text.primary">
                                {state.name?state.name.slice(0,10)+'...':''}
                            </Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Button onClick={()=>{navigate(`/devices/${state.id}/settings`,{state})}} color="info" variant={'contained'}>
                    <SettingsTwoTone sx={{color:'#fff'}}/>
                    <Typography color={'#fff'}>Settings</Typography>
                </Button>
            </RowContainerBetween>
            <Typography>{state.name}</Typography>
            <Typography>Sensors</Typography>
            {
                sensors.length>0? sensors.map((sensor)=>(
                    <Box>
                        <Typography>{sensor.name}</Typography>
                    </Box>
                )):(
                    <Typography>No sensors found</Typography>
                )
            }
        </Box>
    );
}

export default DeviceSettings;