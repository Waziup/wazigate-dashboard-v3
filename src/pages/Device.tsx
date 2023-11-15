import {  SettingsTwoTone } from "@mui/icons-material";
import { Box, Breadcrumbs, Button,  Typography, } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
// import { SelectElement } from "./Automation";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const {state} = useLocation();
    const navigate = useNavigate()
    console.log(state);
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Box>
                    <Typography fontWeight={700} color={'black'}>{state.name}</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link style={{color:'black'}} color="inherit" to="/devices">
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
            <Typography>Device page</Typography>
        </Box>
    );
}

export default DeviceSettings;