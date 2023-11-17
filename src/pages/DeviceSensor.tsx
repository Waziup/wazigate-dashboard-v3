import { SettingsTwoTone, ToggleOff } from "@mui/icons-material";
import { Box, Typography, Button, Link,  Breadcrumbs } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
import EnhancedTable from "../components/DeviceTable";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Chart from 'react-apexcharts';  
import { DEFAULT_COLORS } from "../constants";
import { useEffect,useState } from "react";
import { Device } from "waziup";
function Device() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const [device, setDevice] = useState<Device | null>(null);
    const [matches] = useOutletContext<[matches:boolean]>();
    console.log(matches);
    const navigate = useNavigate();
    const handleNav = (path:string)=>{navigate(path)}
    const {id} = useParams();
        console.log(id);
    useEffect(() => {
        window.wazigate.getDevice(id).then(setDevice);
    },[id]);
    console.log(device);
    
    return (
        <Box sx={{height:'100%',overflowY:'scroll'}}>
            <RowContainerBetween additionStyles={{px:2,py:2}}>
                <Box>
                    <Typography fontWeight={500} fontSize={18} color={'black'}>Device 1</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link fontSize={14} underline="hover" color="inherit" href="/">
                                Devices
                            </Link>
                            <Link
                                fontSize={14}
                                underline="hover"
                                color="inherit"
                                href="/device"
                            >
                                Device 1
                            </Link>
                            <Typography fontSize={14} color="text.primary">Settings</Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                {
                    matches?(
                        <Button onClick={()=>handleNav('/devices/3/setting')} variant={'contained'}>
                            <SettingsTwoTone/>
                            SETTINGS
                        </Button>
                    ):null
                }
            </RowContainerBetween>
            <Box bgcolor={'#fff'} display={'flex'} width={'100%'} pt={matches?5:2} flexDirection={'column'} alignItems={'center'}  justifyContent={'center'}>
                <Box width={matches?'85%':'95%'} mb={3}>
                    <Box sx={{width:'100%',display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                        <Typography color={'#1D2129'} fontSize={18} fontWeight={500}>Current Temperature</Typography>
                        <Box sx={{display:'flex',alignItems:'center'}}>
                            <Typography fontWeight={100} fontSize={18} color={'#949494'}>°F</Typography>
                            <ToggleOff sx={{color:DEFAULT_COLORS.secondary_gray,fontSize:40, }} />
                            <Typography fontWeight={100} fontSize={18} color={'#949494'}>°C</Typography>
                        </Box>
                    </Box>
                    <Chart
                        options={{
                            chart: {
                                id: "basic-bar",
                                
                            },
                            xaxis: {
                                categories: [1,2,3,4,5,6,7,8,9,10],
                                type: 'numeric',
                                
                            },
                            stroke:{
                                curve:'smooth',
                                width:2
                            },
                            legend:{
                                show:false
                            },
                            labels: ['Temperature', 'Humidity', 'Pressure', 'Wind Speed', 'Wind Direction', 'Rainfall', 'Soil Moisture', 'Soil Temperature', 'Soil Conductivity', 'Soil PH']
                        }}
                        series={[
                            {
                                name: "series-1",
                                data: [30,40,45,50,49,60,70,91,125,100]
                            }
                        ]}
                        type="line"
                        width={'100%'}
                        height={matches?350:290}
                    />
                </Box>
                <Box bgcolor={'#fff'} width={matches?'80%':'90%'}>
                    <EnhancedTable  />
                </Box>
            </Box>
        </Box>
    );
}

export default Device;