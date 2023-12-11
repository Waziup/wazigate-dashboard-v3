import { Box, Button, Grid, CardContent, Typography, Icon, ListItemIcon, ListItemText, Menu, MenuItem, SelectChangeEvent, } from '@mui/material';
import RowContainerBetween from '../components/RowContainerBetween';
import { Add, DeleteOutline, ModeOutlined, MoreVert, Sensors, } from '@mui/icons-material';
import { DEFAULT_COLORS } from '../constants';
import { useNavigate, } from 'react-router-dom';
import { useContext, useState } from 'react';
import { type Device } from 'waziup';
import CreateDeviceModalWindow from '../components/ModalCreateDevice';
import EditDeviceModal from '../components/EditDeviceModal';
import { DevicesContext } from '../context/devices.context';
export const SensorInfo = ({ text, name, onClick, iconname }: { text: string, name: string, onClick: () => void, iconname: string }) => (
    <RowContainerBetween onClick={onClick} additionStyles={{ my: 2, py: 1, px: .5, ":hover": { bgcolor: '#f5f5f5' } }}>
        <Box sx={{ display: 'flex', width: '50%' }}>
            <Icon sx={{ fontSize: 18, color: DEFAULT_COLORS.primary_black }} >{iconname}</Icon>
            <Typography color={'primary'} ml={1} fontSize={12} fontWeight={300}>{name}</Typography>
        </Box>
        <Typography color={'primary.main'} fontSize={14} fontWeight={300}>{text} </Typography>
    </RowContainerBetween>
);
function differenceInMinutes(date:Date){
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    return Math.abs(Math.round(diff));

}
const initialNewDevice:Device = {
    actuators:[],
    created:new Date(),
    id:'',
    meta:{
        type:'',
        codec:'',
        is_lorawan:false,
        appkey:'',
        device_addr:'',
        nwkskey:'',
    },
    modified:new Date(),
    name:'',
    sensors:[],
}
function Devices() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const {devices,setDevicesFc} = useContext(DevicesContext);
    const [selectedDevice, setSelectedDevice] = useState<null | Device>(null);
    const [newDevice, setNewDevice] = useState<Device>(initialNewDevice);
    const handleToggleModal = () => {
        setOpenModal(!openModal);
        if (!openModal) {
            setNewDevice(initialNewDevice);
        }
    };
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const handleToggleEditModal = () => {
        setOpenEditModal(!openEditModal);
    }
    const handleToggleEditModalClose = () => {
        setSelectedDevice(null);
        setOpenEditModal(!openEditModal);
    }
    const changeMakeLoraWAN = () => {
        setNewDevice({
            ...newDevice,
            meta:{
                ...newDevice.meta,
                is_lorawan: !newDevice.meta.is_lorawan,
            }
        })
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name, event.target.value);
        
        setNewDevice({
            ...newDevice,
            name: event.target.value,
        })
        // setDeviceName(event.target.value);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    function submitCreateDevice(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('Creating device', newDevice);
        const device: Device = {
            ...newDevice,
        }
        window.wazigate.addDevice(device)
            .then((res) => {
                console.log('Device created: ', res);
                handleToggleModal();
                window.wazigate.getDevices().then(setDevicesFc);
            }).catch(err => {
                console.log('Error encountered: ', err)
            });
    }
    const [selectedValue, setSelectedValue] = useState('');
    const blockOnClick = (value: string) => {
        setSelectedValue(value);
    }
    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        setSelectedValue(event.target.value);
        console.log(event.target.value);
        
        setNewDevice({
            ...newDevice,
            meta:{
                ...newDevice.meta,
                type: event.target.value
            }
        })
    };
    const handleTextInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.name,e.target.value);
        setNewDevice({
            ...newDevice,
            meta:{
                ...newDevice.meta,
                [e.target.name]:e.target.value
            }
        })
    }
    const handleChangeDeviceCodec = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // setSelectedValue(event.target.value);
        console.log(event.target.name,event.target.value);
        
        setNewDevice({
            ...newDevice,
            meta:{
                codec: event.target.value
            }
        })
    };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [screen, setScreen] = useState<'tab1' | 'tab2'>('tab1');
    const handleScreenChange = (screen: 'tab1' | 'tab2') => {
        setScreen(screen);
    }
    function handleDeleteDevice(device:Device){
        const delEL=confirm(`Are you sure you want to remove ${device.name}?`)
        if (!delEL) {
            return;
        }else{
            window.wazigate.deleteDevice(device.id)
            .then((res)=>{
                console.log(res);
                window.wazigate.getDevices().then(setDevicesFc);
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
    function handleSelectDevice(device: Device) {
        console.log(device);
        setSelectedDevice(device);
        handleClose();
        handleToggleEditModal();
    }
    return (
        <>
            <CreateDeviceModalWindow
                openModal={openModal}
                handleToggleModal={handleToggleModal}
                submitCreateDevice={submitCreateDevice}
                handleChange={handleChange}
                handleChangeSelect={handleChangeSelect}
                selectedValue={selectedValue}
                screen={screen}
                handleScreenChange={handleScreenChange}
                blockOnClick={blockOnClick}
                newDevice={newDevice}
                changeMakeLoraWAN={changeMakeLoraWAN}
                handleChangeDeviceCodec={handleChangeDeviceCodec}
                onTextInputChange={handleTextInputChange}
            />
            <EditDeviceModal device={selectedDevice as Device}
                openModal={openEditModal}
                handleToggleModal={handleToggleEditModalClose}
            />
            <Box sx={{ p: 3, height: '100%' }}>
                <RowContainerBetween>
                    <Typography fontWeight={700} color={'black'}>Devices</Typography>
                    <Button color='info' onClick={handleToggleModal} variant={'contained'}>
                        <Add sx={{color:'#fff',mx:1}}/>
                        <Typography color={'#fff'}>New Device</Typography>
                    </Button>
                </RowContainerBetween>
                <Grid container my={2} spacing={2}>
                    {
                        devices.map((device, id) => {
                            return (
                                <Grid item m={1} key={id} md={6} lg={4} xl={4} sm={8} xs={12} >
                                    <Box sx={{ cursor: 'pointer', ":hover": { bgcolor: '#fffff1' }, height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: -5, my: -1, borderRadius: 1, mx: 1, bgcolor: DEFAULT_COLORS.primary_blue }}>
                                            <Sensors sx={{ fontSize: 15, color: '#fff' }} />
                                            <Typography fontSize={13} mx={1} color={'white'} component={'span'}>WaziDev</Typography>
                                        </Box>
                                        <Box  sx={{ borderBottom: '1px solid black', py: 1.5, ":hover": { py: 1.5 }, px: 2, }}>
                                            <RowContainerBetween additionStyles={{}} >
                                                <Box onClick={() => {navigate(`${device.id}/settings`,{state:{...device}}) }}>
                                                    <Typography color={'info'} fontWeight={700}>{device.name.length > 10 ? device.name.slice(0, 10) + '....' : device.name}</Typography>
                                                    <Typography color={DEFAULT_COLORS.secondary_black} fontSize={12} fontWeight={300}>Last Updated {differenceInMinutes(device.modified)} mins ago</Typography>
                                                </Box>

                                                <Box>
                                                    <Button id="demo-positioned-button"
                                                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={handleClick}
                                                    >
                                                        <MoreVert sx={{ color: 'primary' }} />
                                                    </Button>
                                                    <Menu
                                                        id="demo-positioned-menu"
                                                        aria-labelledby="demo-positioned-button"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        }}
                                                    >
                                                        <MenuItem onClick={() => { handleSelectDevice(device); handleClose() }}>
                                                            <ListItemIcon>
                                                                <ModeOutlined fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText sx={{ fontSize: 10 }}>Edit</ListItemText>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => { handleDeleteDevice(device); handleClose() }}>
                                                            <ListItemIcon>
                                                                <DeleteOutline fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText>Delete</ListItemText>
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            </RowContainerBetween>
                                        </Box>
                                        <CardContent sx={{ py: 2 }}>
                                            <RowContainerBetween>
                                                <Box></Box>
                                                <Button variant="text" sx={{ bgcolor: '#F7F7F7',fontSize:10, textTransform: 'initial', color: DEFAULT_COLORS.primary_black }} startIcon={<Add color='primary' sx={{fontSize:10,}} />}>
                                                    New Interface
                                                </Button>
                                            </RowContainerBetween>
                                            {
                                                device.sensors.length > 0 ? device.sensors.map((sensor) => (
                                                    <Box key={sensor.id}>
                                                        <SensorInfo onClick={() => { console.log('Navigation handler'); navigate(`/devices/${device.id}/sensors/${sensor.id}`, { state: { devicename: device.name, sensorId: sensor.id, deviceId: device.id, sensorname: sensor.name } }) }} iconname='device_thermostat' name={sensor.name} text='25&deg;C' />
                                                    </Box>
                                                )) : (
                                                    <Box my={2}></Box>
                                                )
                                            }
                                            {
                                                device.actuators.length > 0 ? device.actuators.map((act) => (
                                                    <Box key={act.id}>
                                                        <SensorInfo onClick={() => { console.log('Navigation handler'); navigate(`/devices/${device.id}/sensors/${act.id}`, { state: { deviceId: device.id, actuatorname: act.name } }) }} iconname='precision_manufacturing' name={act.name} text='25&deg;C' />
                                                    </Box>
                                                )) : (
                                                    <Box my={2}></Box>
                                                )
                                            }
                                        </CardContent>
                                    </Box>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>
        </>
    );
}

export default Devices;