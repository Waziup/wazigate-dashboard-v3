import { Box, Grid, Typography, Icon, Button, styled, Paper, SxProps, Theme, FormControl, Input, FormControlLabel, Checkbox, Stack, } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { DEFAULT_COLORS } from '../../constants';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { InputField } from '../../pages/Login';
interface Props {
    matches?: boolean
}
const GridItem = ({ children, xs, md, additionStyles }: { xs: number, md: number, spacing?: number, matches: boolean, additionStyles?: SxProps<Theme>, children: React.ReactNode, }) => (
    <Grid item xs={xs} md={md} spacing={3} sx={{ borderRadius: 2, my: 1, mr: 2, ...additionStyles }}  >
        {children}
    </Grid>
);
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
}));
const IconStyle: SxProps<Theme> = {mr:1 , color: DEFAULT_COLORS.primary_black };

const GridItemEl = ({ children, text, additionStyles, icon }: { additionStyles?: SxProps<Theme>, text: string, children: React.ReactNode, icon: string }) => (
    <Item sx={{ boxShadow: 0, ...additionStyles }}>
        <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5, border: '.5px solid #d8d8d8', bgcolor: '#F7F7F7', alignItems: 'center' }} p={1} >
            <Icon sx={IconStyle}>{icon}</Icon>
            <Typography color={'#212529'} fontWeight={500}>{text}</Typography>
        </Box>
        {children}
    </Item>
)
export default function ExportTabMaintenance({ matches }: Props) {
    const [searchParams, setSearchParams] = useSearchParams()
    const today = new Date();
    const updateSearchParams = (key: string, value: string) => {
        setSearchParams({
            ...Object.fromEntries(searchParams),
            [key]: value
        })
    }
    return (
        <Box >
            <Typography fontSize={20}>Export Usage Data</Typography>
            <Grid container>
                <GridItem spacing={2} md={4.6} xs={12} matches={matches as boolean}>
                    <GridItemEl additionStyles={{ pb: 2, boxShadow: 1 }} icon={'sensors_outlined'} text={'Export Sensor Data'}>
                        <Box m={1} borderRadius={1}>
                            <Box borderRadius={1} p={1} >
                                <Button href='/exporttree' disableElevation variant="contained" color='secondary' startIcon={<DownloadIcon />}>
                                    EXPORT AS CSV FILES TREE
                                </Button>
                            </Box>
                            <Box p={1}>
                                <Button href='/exportall' disableElevation variant="contained" color='secondary' startIcon={<DownloadIcon />}>
                                    EXPORT AS ONE CSV FILE
                                </Button>
                            </Box>
                        </Box>
                    </GridItemEl>
                </GridItem>
                <GridItem spacing={2} md={7} xs={12} matches={matches as boolean} >
                    <GridItemEl additionStyles={{ boxShadow: 1 }} icon='sensor' text='Export Actuator and Sensor Data' >
                        <Box borderRadius={1} px={2} py={2} display='flex' flexDirection='column' justifyContent='space-between' gap={2}>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography>From:</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker',]}>
                                            <DemoItem label="">
                                                <DesktopDatePicker
                                                    onChange={(newValue) => {
                                                        updateSearchParams('from', (newValue as dayjs.Dayjs).toISOString())
                                                    }}
                                                    sx={{ p: 0 }}
                                                    defaultValue={dayjs(searchParams.get('from') ? searchParams.get('from') : today.toLocaleDateString().toString().replaceAll('/', '-' + " "))}
                                                />
                                            </DemoItem>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography>To:</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                            components={[
                                                'DatePicker',
                                            ]}
                                        >
                                            <DemoItem label="">
                                                <DesktopDatePicker
                                                    sx={{ p: 0 }}
                                                    onChange={(newValue) => {
                                                        updateSearchParams('to', (newValue as dayjs.Dayjs).toISOString())
                                                    }}
                                                    defaultValue={dayjs(searchParams.get('to') ? searchParams.get('to') : today.toLocaleDateString().toString().replaceAll('/', '-' + " "))}
                                                />
                                            </DemoItem>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                            <Box display='flex' flexDirection={'column'}>
                                <Box>
                                    <FormControl sx={{ width: '100%', }}>

                                        <InputField label='Bin Size in seconds'>
                                            <Input
                                                onChange={(ev) => { updateSearchParams('duration', ev.target.value) }}
                                                type='number'
                                                value={searchParams.get('duration') as string}
                                                name="name"
                                                placeholder='Bit Size'
                                                required
                                            />
                                        </InputField>
                                    </FormControl>
                                </Box>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={searchParams.get('check') === 'true'}
                                                onChange={(ev) => {
                                                    setSearchParams({
                                                        ...Object.fromEntries(searchParams),
                                                        'check': ev.target.checked ? 'true' : 'false'
                                                    });
                                                }}
                                            />
                                        }
                                        label=""
                                    />
                                    <Typography variant='body2'>Omit deviating values (20%) in between bins : </Typography>
                                </Stack>
                            </Box>

                            <Button
                                variant="contained"
                                color="secondary"
                                disableElevation
                                sx={{ width: 'auto', alignSelf: 'flex-start' }}  // Added width and alignment
                                href={
                                    `/exportbins?from=${searchParams.get('from')}&to=${searchParams.get('to')}&duration=${searchParams.get('duration')}s&check=${searchParams.get('check')}`
                                }
                            >
                                EXPORT
                            </Button>

                        </Box>
                    </GridItemEl>
                </GridItem>
            </Grid>
        </Box>
    )
}
