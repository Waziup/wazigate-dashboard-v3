import {  Add,  SettingsTwoTone } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Modal,  Typography, SpeedDial, SpeedDialAction, SpeedDialIcon, } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
// import { SelectElement } from "./Automation";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useEffect,useState } from "react";
import { Sensor,Actuator } from "waziup";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    py: 2,
};
function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
    }
    const {state} = useLocation();
    const navigate = useNavigate();
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [actuators,setActuators] = useState<Actuator[]>();
    const [modalProps, setModalProps] = useState<{title:string,placeholder:string}>({title:'',placeholder:''});
    useEffect(() => {
        window.wazigate.getSensors(state.id).then(setSensors);
        window.wazigate.getActuators(state.id).then(setActuators);
    }, [state]);
    const setModalEls = (title:string,placeholder:string) => {
        setModalProps({title,placeholder});
    }
    const [sensorName,setSensorName]= useState<{name:string,sensorType:string}>({name:'',sensorType:''});
    const [actuatorName,setActuatorName] = useState<string>('')
    const handleCreateSensorClick = () => {
        const sensor: Sensor = {
            name: sensorName.name,
            id: "",
            meta: {
                kind:sensorName.sensorType
            },
            value: 0,
            time: new Date(),
            modified: new Date(),
            created: new Date(),
        };
        console.log(sensor);
        window.wazigate.addSensor(state.id,sensor)
        .then((res)=>{
            console.log(res);
            navigate(1);
        })
        .catch((err)=>{
            console.log('Error encounted',err);
        })
    }
    const [openModal, setOpenModal] = useState(false);
    const handleToggleModal = () => setOpenModal(!openModal);
    const handleCreateActuatorClick = () => {
        console.log('Creating an actuator');
        const actuator: Actuator = {
            name: actuatorName,
            id: "",
            meta: {
                kind:'Motor'
            },
            value: false,
            time: null,
            modified: new Date(),
            created: new Date(),
        };
        console.log(actuator);
        window.wazigate.addActuator(state.id,actuator)
        .then((res)=>{
            console.log(res);
            navigate(1);
            handleToggleModal()
        })
        .catch((err)=>{
            console.log('Error encounted',err);
            handleToggleModal();
        })
    }
    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(modalProps.title==='sensor'){
            setSensorName({
                [e.target.name]:e.target.value,
               ...sensorName
            });
        }else{
            setActuatorName(e.target.value);
        }
    }
    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        setSensorName({
            [e.target.name]:e.target.value,
           ...sensorName
        });
    }
    console.log(actuators)
    return (
        <>
            <Modal
                    open={openModal}
                    onClose={handleToggleModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box>
                        <Box sx={style}>
                            <Box px={2} borderBottom={'1px solid black'}>
                                <Typography>Enter {modalProps.title} Details</Typography>
                            </Box>
                            <Box p={2} borderBottom={'1px solid #000'}>
                                <form onSubmit={modalProps.title==='actuator'?handleCreateActuatorClick:handleCreateSensorClick}>
                                    <input name="name" style={{outline:'none',width:'100%',borderRadius:4, border:'1px solid black',padding:'5px 2px'}} onInput={handleNameChange} required type="text" placeholder={modalProps.placeholder} />    
                                    {
                                        modalProps.title==='sensor' &&(
                                            <select onChange={handleSelectChange} name="sensorType" id="sensorType">
                                                <option defaultValue={''} disabled selected>Select Sensor Type</option>
                                                <option value="WaterThermometer">Water Thermometer</option>
                                                <option value="WaterLevel">Water Level</option>
                                                <option value="WaterPollutantSensor">Water Pollutant Sensor</option>
                                            </select>
                                        )
                                    }
                                    <Box pt={2}>
                                        <Button sx={{mx:2, color:'#fff'}} variant="contained" color="info" type="submit">Save</Button>
                                        <Button variant="contained" color="warning" onClick={handleToggleModal}>Close</Button>
                                    </Box>
                                </form>
                            </Box>
                        </Box>
                    </Box>
            </Modal>
            <Box p={3} sx={{position:'relative',width:'100%', height:'100%'}}>
                <RowContainerBetween>
                    <Box>
                        <Typography fontWeight={700} color={'black'}>{state.name}</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link style={{color:'black'}} state={{title:'Devices'}} color="inherit" to="/devices">
                                    Devices
                                </Link>
                                {/* <Link
                                    underline="hover"
                                    color="inherit"
                                    href="/material-ui/getting-started/installation/"
                                >
                                    Device 1
                                </Link> */}
                                <Typography color="text.primary">
                                    {state.name?state.name.slice(0,10)+'...':''}
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                    <Button onClick={()=>{navigate(`/devices/${state.id}/settings`,{state})}} color="info" variant={'contained'}>
                        <SettingsTwoTone sx={{color:'#fff'}}/>
                        <Typography color={'#fff'}>Settings</Typography>
                    </Button>
                </RowContainerBetween>
                {
                    (actuators as Actuator[])?.length===0 && sensors.length===0 &&(
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} height={'100%'} alignItems={'center'}>
                            <Box component={'img'} src="/404.svg" width={200} height={200}/>
                            <Typography>Hi there</Typography>
                            <Typography>No Sensors and Actuators found found</Typography>
                        </Box>
                    )
                }
                {
                    actuators?.map((act)=>(
                        <Box>
                            <Typography>{act.name}</Typography>
                        </Box>
                    ))
                }
                {
                    sensors.length===0?(
                        <Box>
                            <Typography>No Sensors found</Typography>
                        </Box>
                    ):(sensors.map((sens)=>(
                        <Box>
                            <Typography>{sens.name}</Typography>
                        </Box>
                    )))
                }
                <Box sx={{ height: 320, flexGrow: 1 }}>
                    <SpeedDial ariaLabel="Add device"
                        sx={{ position: 'absolute', bottom: 30, right: 16 }}
                        icon={<SpeedDialIcon />}
                    >
                        <SpeedDialAction
                            key={'1'}
                            icon={<Add />}
                            tooltipTitle={'Sensor'}
                            tooltipOpen
                            onClick={()=>{setModalEls('sensor','Sensor Name'); handleToggleModal()}}
                        />
                        <SpeedDialAction
                            key={'2'}
                            icon={<Add />}
                            tooltipOpen
                            sx={{fontSize:10}}
                            onClick={()=>{setModalEls('actuator','Actuator Name'); handleToggleModal()}}
                            tooltipTitle={'Actuator'}
                        />
                    </SpeedDial>
                </Box>
            </Box>
        </>
    );
}

export default DeviceSettings;