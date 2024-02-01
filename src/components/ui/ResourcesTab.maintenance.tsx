import { Box, Stack, Typography,LinearProgress,styled,linearProgressClasses } from "@mui/material";
import ReactSpeedometer from "react-d3-speedometer";
import Chart from 'react-apexcharts';
// import { useEffect } from "react";
/**
    this.state = {
          
            series: [{
              data: data.slice()
            }],
            options: {
              chart: {
                id: 'realtime',
                height: 350,
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
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: 'Dynamic Updating Chart',
                align: 'left'
              },
              markers: {
                size: 0
              },
              xaxis: {
                type: 'datetime',
                range: XAXISRANGE,
              },
              yaxis: {
                max: 100
              },
              legend: {
                show: false
              },
            },
          
          
          };
        }
 */
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
export default function ResourcesTabMaintenance({matches}:Props) {
    
    return (
        <Box  sx={{ p: 3, overflowY: 'auto',scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}, height: '100vh' }}>
            <Stack direction={matches?'row':'column'} justifyContent={'space-evenly'} spacing={2}>
                <ReactSpeedometer
                    maxValue={100}
                    value={3}
                    // needleColor="black"
                    startColor="#fbe9e7"
                    height={200}
                    segments={1000}
                    maxSegmentLabels={5}
                    endColor="#bf360c"
                    currentValueText="CPU: ${value} %"
                />
                <ReactSpeedometer
                    maxValue={100}
                    value={30}
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
                    value={40}
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
                    <Typography>Disk:<span style={{color:'black',fontWeight:'bold'}}>1.2GB</span> of <span style={{color:'black',fontWeight:'bold'}}>4GB</span> used</Typography>
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
                        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
                        data: [30, 40, 25, 50, 49, 21, 70]
                    },
                    {
                        name: 'Memory',
                        data: [23, 12, 54, 61, 32, 56, 81]
                    },
                    {
                        name: 'Disk',
                        data: [25, 30, 24, 31, 42, 50, 70]
                    }
                ]}
                type="area"
                width={'100%'}
                height={290}
            />
        </Box>
    )
}
