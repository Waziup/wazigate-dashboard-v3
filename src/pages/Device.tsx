import {  Add,  SettingsTwoTone } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Modal,  Typography, SpeedDial, SpeedDialAction, SpeedDialIcon, Grid, } from "@mui/material";
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
    const [sensorName,setSensorName]= useState<{name:string,sensorType:string}>({name:'',sensorType:''});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [actuatorName,setActuatorName] = useState<string>('')
    const [modalProps, setModalProps] = useState<{title:string,placeholder:string}>({title:'',placeholder:''});


    useEffect(() => {
        window.wazigate.getSensors(state.id).then(setSensors);
        window.wazigate.getActuators(state.id).then(setActuators);
    }, [state]);
    const setModalEls = (title:string,placeholder:string) => {
        setModalProps({title,placeholder});
    }
    const handleCreateSensorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Creating a sensor',sensorName);
        const sensor: Sensor = {
            name: sensorName.name,
            id: "",
            meta: {
                kind: sensorName.sensorType
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
            handleToggleModal()
            navigate('/devices');
        })
        .catch((err)=>{
            console.log('Error encounted',err);
        })
    }
    const handleToggleModal = () => setOpenModal(!openModal);
    const handleCreateActuatorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Creating an actuator',actuatorName);
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
            handleToggleModal()
            navigate('/devices');
        })
        .catch((err)=>{
            console.log('Error encounted',err);
            handleToggleModal();
        })
    }
    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.value,e.target.name);
        if(modalProps.title==='sensor'){
            setSensorName({
                name:e.target.value,
                sensorType:sensorName.sensorType
            });
        }else{
            setActuatorName(e.target.value);
        }
    }
    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        console.log(e.target.value,e.target.name);
        
        setSensorName({
            sensorType:e.target.value,
            name:sensorName.name
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
                                            <select required style={{outline:'none',width:'100%',borderRadius:4,margin:'10px 0',background:'none', border:'1px solid black',padding:'5px 2px'}} onChange={handleSelectChange} name="sensorType" id="sensorType">
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
                <Grid container my={2} spacing={2}>
                    {
                        actuators?.map((act)=>(
                            <Grid md={4} item sx={{bgcolor:'#fff',mx:2,borderRadius:2}}>
                                <Typography>{act.name}</Typography>
                            </Grid>
                        ))
                    }
                    
                </Grid>
                <Grid container my={2} spacing={2}>
                    {
                        sensors.length===0?(
                            <Box>
                                <Typography>No Sensors found</Typography>
                            </Box>
                        ):(sensors.map((sens)=>(
                            <Grid md={4} item sx={{bgcolor:'#fff',mx:2,borderRadius:2}}>
                                <Typography>{sens.name}</Typography>
                            </Grid>
                        )))
                    }
                </Grid>
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