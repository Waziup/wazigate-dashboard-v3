import { ExpandMore, Home, SettingsTwoTone } from "@mui/icons-material";
import { Box, Typography, Button, Chip, emphasize, styled, Breadcrumbs } from "@mui/material";
import { RowContainerBetween } from "./dashboard";
import EnhancedTable from "../components/devicetable";
import { useNavigate } from "react-router-dom";
export const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  }) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
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