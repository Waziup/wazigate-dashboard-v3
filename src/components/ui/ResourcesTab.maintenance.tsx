import { Box, Stack, Typography,LinearProgress,styled,linearProgressClasses } from "@mui/material";
import ReactSpeedometer from "react-d3-speedometer";
import Chart from 'react-apexcharts';
// import { useEffect } from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
export default function ResourcesTabMaintenance() {
    
    return (
        <Box m={3}>
            <Typography>Resources tab</Typography>
            <Stack direction={'row'} justifyContent={'space-evenly'} spacing={2}>
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
                <Typography>Storage</Typography>
                <Box mt={1}>
                    <Typography>Used: 1.2GB of 4GB</Typography>
                    <BorderLinearProgress variant="determinate" value={30} />
                </Box>
            </Box>
            <Chart
                options={{
                    chart: {
                        // height: 350,
                        type: 'rangeArea',
                    },
                    xaxis: {
                        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        // type: 'numeric',

                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    colors: ['#4592F6'],
                }}
                series={[
                    {
                        name: "series-1",
                        data: [
                            {
                                x: 'Mon',
                                y: [
                                    1,
                                    10
                                ]
                            },
                            {
                                x: 'Tue',
                                y: [
                                    5,
                                    15
                                ]
                            },
                            {
                                x: 'Wed',
                                y: [
                                    3,
                                    10
                                ]
                            },
                            {
                                x: 'Thu',
                                y: [
                                    5,
                                    12
                                ]
                            },
                            {
                                x: 'Fri',
                                y: [
                                    4,
                                    15
                                ]
                            },
                            {
                                x: 'Sat',
                                y: [
                                    2,
                                    10
                                ]
                            },
                            {
                                x: 'Sun',
                                y: [
                                    1,
                                    10
                                ]
                            },
                        ]
                    }
                ]}
                type="area"
                width={'100%'}
                height={290}
            />
        </Box>
    )
}
