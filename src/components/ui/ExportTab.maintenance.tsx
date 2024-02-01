import { Box,Grid, Typography,Icon,Button, styled,Paper,SxProps,Theme, } from '@mui/material';
import { DEFAULT_COLORS } from '../../constants';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
interface Props{
    matches?:boolean
}
const GridItem = ({ children, xs,md,additionStyles }: {xs:number,md:number,spacing?:number, matches: boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode,  }) => (
    <Grid m={1} item xs={xs} md={md} spacing={3} sx={additionStyles} borderRadius={2}  >
        {children}
    </Grid>
);
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
}));
const IconStyle: SxProps<Theme> = { fontSize: 20, mr: 2, color: DEFAULT_COLORS.primary_black };

const GridItemEl=({ children, text, additionStyles, icon }: { additionStyles?: SxProps<Theme>, text: string, children: React.ReactNode, icon: string })=>(
    <Item sx={additionStyles}>
        <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, bgcolor: '#D8D8D8', alignItems: 'center' }} p={1} >
            <Icon sx={IconStyle}>{icon}</Icon>
            <Typography color={'#212529'} fontWeight={500}>{text}</Typography>
        </Box>
        {children}
    </Item>
)
export default function ExportTabMaintenance({matches}:Props) {
    console.log(matches);
    const today = new Date();
    return (
        <Box p={2}>
            <Typography fontWeight={900} fontSize={20}>Export Usage Data</Typography>
            <Typography fontSize={15} color={'#666666'}>
                In this section you are able to download the gateways data of all devices at once. You can use to perform a backup, to have all data in one place and for machine learning applications.
            </Typography>
            <Grid container>
                <GridItem  spacing={2} md={4.6} xs={12} matches={matches as boolean} >
                    <GridItemEl  icon={'sensors_outlined'} text={'Export Sensor Data'} >
                        <Typography m={1} fontSize={12} color={'#666666'}>
                            You can export the data of all sensors and actuators to a tree of CSV files:
                        </Typography>
                        <Button variant="text" sx={{ color: '#fff', m: 1, bgcolor: 'info.main' }} >
                            EXPORT
                        </Button>
                    </GridItemEl>
                    <GridItemEl icon={'precision_manufacturing'} text={'Export Actuator data'} >
                        <Typography m={1} fontSize={12} color={'#666666'}>
                            You can export the data of all sensors and actuators to a tree of CSV files:
                        </Typography>
                        <Button variant="text" sx={{ color: '#fff', m: 1, bgcolor: 'info.main' }} >
                            EXPORT
                        </Button>
                    </GridItemEl>
                </GridItem>
                <GridItem  spacing={2} md={7} xs={12} matches={matches as boolean} >
                    <GridItemEl icon={'sensor'} text={'Export Actuator and Sensor Data'} >
                        <Typography m={1} fontSize={12} color={'#666666'}>
                            You can export the data of all sensors and actuators to one CSV file. Additionally it also includes custom timespans and all data can be summarized in time bins. This is perfect for machine learning applications
                        </Typography>
                        <Box bgcolor={'#D4E3F5'} display={'flex'} justifyContent={'space-between'} borderRadius={1} p={1} m={2}>
                            <Box width={'45%'}>
                                <Typography>From:</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',

                                        ]}
                                    >
                                        <DemoItem label="">
                                            <DesktopDatePicker  sx={{ p: 0 }} defaultValue={dayjs(today.toLocaleDateString().toString().replaceAll('/', '-' + " "))} />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                            <Box>
                                <Typography>To:</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem label="">
                                            <DesktopDatePicker  sx={{ p: 0 }} defaultValue={dayjs(today.toLocaleDateString().toString().replaceAll('/', '-' + " "))} />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                            
                        </Box>
                        <Button variant="text" sx={{ color: '#fff', m: 1, bgcolor: 'info.main' }} >
                            EXPORT
                        </Button>
                    </GridItemEl>
                </GridItem>
            </Grid>
        </Box>
    )
}
