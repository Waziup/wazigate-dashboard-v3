import { Box, Stack, Typography,LinearProgress,styled,linearProgressClasses } from "@mui/material";
import ReactSpeedometer from "react-d3-speedometer";
import Chart from 'react-apexcharts';
import { getUsageInfo,UsageInfo } from "../../utils/systemapi";
import { useEffect,useState } from "react";
import { humanFileSize } from "../../utils";
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
interface Props{
    matches?:boolean
}
type UsageInfoGraph = {
    cpu_usage:number[]
    mem_usage:number[],
    temp:number[]
    xaxis:string[]
}
const returnDate = (i:number)=>{
    const date = new Date();
    date.setSeconds(date.getSeconds()-i);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
export default function ResourcesTabMaintenance({matches}:Props) {
    const [usageGraph,setUsageGraph] = useState<UsageInfoGraph>({
        cpu_usage:[0],
        mem_usage:[0],
        temp:[0],
        xaxis:[],
    })
    const [usageInfo, setUsageInfo] = useState<UsageInfo>({
        cpu_usage:'',
        mem_usage:{total:'',used:''}, 
        disk: {
            available: '',
            device: '',
            mountpoint: '',
            percent: '',
            size: '',
            used: ''
        },
        temp:''
    });
    useEffect(() => {
        getUsageInfo().then((res) => {
            console.log(res);
            setUsageInfo(res);
        });
        const fetchInterval = setInterval(()=>{
            getUsageInfo().then((res) => {
                setUsageInfo(res);
                setUsageGraph((prev)=>({
                    cpu_usage: prev.cpu_usage.length>50?[...prev.cpu_usage.slice(),parseInt(res.cpu_usage)]:[...prev.cpu_usage,parseInt(res.cpu_usage)],
                    mem_usage: prev.mem_usage.length>50?[...prev.mem_usage.slice(),Math.round(parseInt(res.mem_usage.used)/1024)]:[...prev.mem_usage,Math.round(parseInt(res.mem_usage.used)/1024)],
                    temp: prev.temp.length>50?[...prev.temp.slice(),parseInt(res.temp)]:[...prev.temp,parseInt(res.temp)],
                    xaxis: prev.xaxis.length>50?[...prev.xaxis.slice(),returnDate(0)]:[...prev.xaxis,returnDate(0)]
                }));
            });
        },2000);
        return ()=>clearInterval(fetchInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <Box  sx={{ height: '100vh' }}>
            <Stack direction={matches?'row':'column'} justifyContent={'space-evenly'} spacing={2}>
                <ReactSpeedometer
                    maxValue={100}
                    value={parseInt(usageInfo.cpu_usage)}
                    // needleColor="black"
                    startColor="#fbe9e7"
                    height={200}
                    segments={1000}
                    maxSegmentLabels={5}
                    endColor="#bf360c"
                    currentValueText="CPU: ${value} %"
                />
                <ReactSpeedometer
                    maxValue={Math.round(
                        parseInt(usageInfo.mem_usage.total) / 1024
                    )}
                    value={Math.round(
                        parseInt(usageInfo.mem_usage.used) / 1024
                    )}
                    // needleColor="black"
                    startColor="#e3f2fd"
                    height={200}
                    segments={1000}
                    maxSegmentLabels={4}
                    endColor="#0d47a1"
                    currentValueText="Memory: ${value} MB"
                />
                <ReactSpeedometer
                    maxValue={100}
                    value={parseInt(usageInfo.temp)}
                    // needleColor="black"
                    startColor="#fff3e0"
                    height={200}
                    segments={1000}
                    maxSegmentLabels={5}
                    endColor="#e65100"
                    currentValueText="Temperature: ${value} C"
                />

            </Stack>
            <Box mt={3} width={'80%'}>
                <Box mt={1}>
                    <Typography>Disk:<span style={{color:'black',fontWeight:'bold'}}>{humanFileSize(parseFloat(usageInfo.mem_usage.used))}</span> of <span style={{color:'black',fontWeight:'bold'}}>{humanFileSize(parseFloat(usageInfo.mem_usage.total))}</span> used</Typography>
                    <BorderLinearProgress variant="determinate" value={30} />
                </Box>
            </Box>
            <Chart
                options={{
                    chart: {
                        id: 'realtime',
                        height: 400,
                        type: 'line',
                        animations: {
                            enabled: true,
                            easing: 'linear',
                            dynamicAnimation: {
                                speed: 1000
                            }
                        },
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        },
                    },
                    xaxis: {
                        categories: usageGraph.xaxis,
                        labels:{
                            show: false
                        }
                    },
                    yaxis: {
                        min: 0, // Minimum value for the y-axis
                        // max: 1000, // Maximum value for the y-axis
                        tickAmount: 4,
                    },
                    dataLabels:{
                        enabled:false
                    },
                    markers:{
                        size:0
                    },
                    legend: {
                        show: true
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    colors: ['#4592F6', '#F35E19', '#54C6BF'],
                }}
                series={[
                    {
                        name: 'CPU',
                        data: usageGraph.cpu_usage,
                    },
                    {
                        name: 'Memory',
                        data: usageGraph.mem_usage
                    },
                    {
                        name: 'Temperature',
                        data: usageGraph.temp
                    }
                ]}
                type="line"
                width={'100%'}
                height={400}
            />
        </Box>
    )
}
