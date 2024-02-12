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
}
export default function ResourcesTabMaintenance({matches}:Props) {
    const [usageGraph,setUsageGraph] = useState<UsageInfoGraph>({
        cpu_usage:[0],
        mem_usage:[0],
        temp:[0],
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
                setUsageGraph({
                    cpu_usage: usageGraph.cpu_usage.length>50?[...usageGraph.cpu_usage.filter((_x,i)=>i),parseInt(res.cpu_usage)]:[...usageGraph.cpu_usage,parseInt(res.cpu_usage)],
                    mem_usage: usageGraph.mem_usage.length>50?[...usageGraph.mem_usage.filter((_x,i)=>i),parseInt(res.mem_usage.used)]:[...usageGraph.cpu_usage,parseInt(res.mem_usage.used)],
                    temp: usageGraph.temp.length>50?[...usageGraph.temp.filter((_x,i)=>i),parseInt(res.temp)]:[...usageGraph.cpu_usage,parseInt(res.temp)], 
                })
            });
        },2000);
        return ()=>clearInterval(fetchInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <Box  sx={{ p: 3, overflowY: 'auto',scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}, height: '100vh' }}>
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
                        height: 600,
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
                        }
                    },
                    xaxis: {
                        type:'datetime'
                    },
                    yaxis: {
                        max: 100
                    },
                    legend: {
                        show: true
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    colors: ['#4592F6', '#ac64ad', '#F6BB45'],
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
                type="area"
                width={'100%'}
                height={290}
            />
        </Box>
    )
}
