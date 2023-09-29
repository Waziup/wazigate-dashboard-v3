import { SettingsTwoTone } from "@mui/icons-material";
import { Box, Typography, Button, Link,  Breadcrumbs } from "@mui/material";
import RowContainerBetween from "../components/rowcontainerbetween";
import EnhancedTable from "../components/devicetable";
import { useNavigate } from "react-router-dom";
import Chart from 'react-apexcharts';  
function Device() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const navigate = useNavigate();
    const handleNav = (path:string)=>{navigate(path)}
    return (
        <Box sx={{ height:'100%'}}>
            <RowContainerBetween >
                <Box>
                    <Typography fontWeight={700} color={'black'}>Device 1</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href="/">
                                Devices
                            </Link>
                            <Link
                                underline="hover"
                                color="inherit"
                                href="/material-ui/getting-started/installation/"
                            >
                                Device 1
                            </Link>
                            <Typography color="text.primary">Settings</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Button onClick={()=>handleNav('/devices/3/setting')} variant={'contained'}>
                    <SettingsTwoTone/>
                    SETTINGS
                </Button>
            </RowContainerBetween>
            <Box bgcolor={'#fff'} height={'100%'} display={'flex'} width={'100%'} mt={9} flexDirection={'column'} alignItems={'center'}  justifyContent={'center'}>
                <Box width={'80%'} mb={3}>
                    <RowContainerBetween additionStyles={{width:'100%'}}>
                        <Typography>Current Temperature</Typography>
                        <Typography>25.5 °C</Typography>
                    </RowContainerBetween>
                    <Chart
                        options={{
                            chart: {
                                id: "basic-bar"
                            },
                            xaxis: {
                                categories: [1,2,3,4,5,6,7,8,9,10]
                            },
                            stroke:{
                                curve:'smooth',
                                width:2
                            }
                        }}
                        series={[
                            {
                                name: "series-1",
                                data: [30,40,45,50,49,60,70,91,125,100]
                            }
                        ]}
                        type="line"
                        width={'100%'}
                        height={300}
                    />
                </Box>
                <Box bgcolor={'#fff'} width={'80%'}>
                    <EnhancedTable  />
                </Box>
            </Box>
        </Box>
    );
}

export default Device;