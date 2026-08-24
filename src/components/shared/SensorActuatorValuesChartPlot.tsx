interface Props{
    graphValues: {x: string,y:number}[]
    matches: boolean    
}
import Chart from 'react-apexcharts';
export default function SensorActuatorValuesChartPlot({graphValues,matches}:Props) {
    return (
        <Chart
            options={{
                chart: {
                    id: 'sensor_actuator_plot',
                    // height: 350,
                    type: 'area',
                    zoom: {
                        enabled: true,
                    },
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 1000
                        }
                    },
                },
                xaxis: {
                    categories: graphValues.map((value) => value.x),
                    tickAmount: 10,
                    // type: 'numeric',
                },
                markers: {
                    size: 0,
                },
                dataLabels: {
                    enabled: false
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
                    data: graphValues.map((value) => value.y)
                }
            ]}
            type="area"
            width={'100%'}
            height={matches ? 350 : 290}
        />
    )
}
