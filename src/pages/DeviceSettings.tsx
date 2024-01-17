import {  Add, MoreVert,Router,} from "@mui/icons-material";
import { Box,Breadcrumbs,FormControl,Grid,Modal,Button,  Typography, TextField, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
import { Link, useNavigate, useParams } from "react-router-dom";
import {  useContext,useEffect,useState } from "react";
import AddTextShow from "../components/AddTextInput";
import { Actuator, Device, Sensor } from "waziup";
import { DevicesContext } from "../context/devices.context";
import ontologies from "../ontologies.json";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: SelectChangeEvent<string>)=>void,
    title:string,
    conditions:string[] | number[], 
    value: string
    isDisabled?:boolean
    matches?:boolean
    widthPassed?:string
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:2,
    py: 2,
};
export const SelectElement = ({handleChange,title,conditions,isDisabled,widthPassed,name,value}:HTMLSelectProps)=>(
    <Box minWidth={120} width={widthPassed?widthPassed:'100%'} my={.5}>
        <Typography  fontSize={12} fontWeight={'300'} color={'#292F3F'}>{title}</Typography>
        <FormControl variant="standard" disabled={isDisabled} fullWidth>
            <Select
                inputProps={{
                    name: name,
                    id: 'uncontrolled-native',
                }}
                sx={{fontWeight:'bold'}}
                value={value}
                onChange={handleChange}
            >
                <MenuItem defaultChecked disabled value={''}>Select</MenuItem>
                {
                    conditions.map((condition,index)=>(
                        <MenuItem key={index} value={condition}>{condition}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    </Box>
);
function selectOptionsHelper(option:string,interfaceType:string):string[]{
    const filterType = interfaceType==='sensor'?ontologies.sensingDevices:ontologies.actingDevices;
    if (option) {
        return (filterType)[option as keyof typeof filterType]?(
            (filterType)[option as keyof typeof filterType]
        ):(
            []
        )
    }
    return[]
}
export default function DeviceSettings(){
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const {getDevicesFc} = useContext(DevicesContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {id} = useParams();

    const handleToggleModal = () => setOpenModal(!openModal);
    const navigate = useNavigate();
    const [modalProps, setModalProps] = useState<{title:string,placeholder:string}>({title:'',placeholder:''});
    const setModalEls = (title:string,placeholder:string) => {
        setModalProps({title,placeholder});
    }
    const [newSensor,setNewSensor]= useState<{name:string,sensorType:string}>({name:'',sensorType:''});
    const handleCreateSensorClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Creating a sensor',newSensor);
        const sensor: Sensor = {
            name: newSensor.name,
            id: "",
            meta: {
                kind: newSensor.sensorType
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
    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        console.log(e.target.value,e.target.name);
        
        setNewSensor({
            sensorType:e.target.value,
            name:newSensor.name
        });
    }
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
            setNewSensor({
                name:e.target.value,
                sensorType:newSensor.sensorType
            });
        }else{
            setActuatorName(e.target.value);
        }
    }
    const {state} = useLocation();
    console.log(state);
    
    const [codecsList, setCodecsList] = useState<{id:string,name:string}[] | null>(null);
    const loadCodecsList = () => {
        window.wazigate.get('/codecs').then(res => {
            setCodecsList(res as {id:string,name:string}[]);
        }, (err: Error) => {
            console.error("There was an error loading codecs:\n" + err)
        });
    }
    useEffect(()=>{
        loadCodecsList();
    },[]);
    const autoGenerateHandlerFc=()=>{}
    return(
        <>
            <Modal
                    open={openModal}
                    onClose={()=>{setModalProps({title:'',placeholder:''}); handleToggleModal()}}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{borderRadius:14}}
                >
                    <Box>
                        <Box sx={style}>
                            <Box px={2} borderBottom={'1px solid black'}>
                                {
                                    modalProps.title?(
                                        <Typography>Enter {modalProps.title} Details</Typography>
                                    ):(
                                        <Typography>Choose Type</Typography>
                                    )
                                }
                            </Box>
                            <SelectElement
                                conditions={['actuator','sensor']}
                                handleChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{setModalEls(e.target.value==='actuator'?'actuator':'sensor',e.target.value)}}
                                title="Select Type"
                                value={modalProps.title}
                            />
                            {
                                modalProps.title?(
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
                                                <Button variant="contained" color="warning" onClick={()=>{setModalProps({title:'',placeholder:''}); handleToggleModal()}}>Close</Button>
                                            </Box>
                                        </form>
                                    </Box>
                                ):null
                            }
                        </Box>
                    </Box>
            </Modal>
            <Box mx={2} sx={{ height: '100%',overflowY:'scroll', scrollbarWidth:'.5rem', "::-webkit-slider-thumb":{backgroundColor:'transparent'}}} m={2}>
                <RowContainerBetween additionStyles={{mx:2}}>
                    <Box>
                        <Typography fontWeight={700} color={'black'}>{state.name}</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link style={{color:'#292F3F', fontSize:15, textDecoration:'none'}} state={{title:'Devices'}} color="inherit" to="/devices">
                                    Devices
                                </Link>
                                
                                <Link
                                    color="inherit"
                                    state={{title:state.name}}
                                    to={`/devices/${state.id}`}
                                    style={{color:'#292F3F',fontSize:15, textDecoration:'none'}}
                                >
                                    {state.name?state.name.slice(0,10)+'...':''}
                                </Link>
                                <Typography fontSize={15} color="text.primary">
                                    settings
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                    <Button color='info' onClick={handleToggleModal} variant={'contained'}>
                        <Add sx={{color:'#fff',mx:1}}/>
                        <Typography color={'#fff'}>New Interface</Typography>
                    </Button>
                </RowContainerBetween>
                <Grid m={2} container >
                    {
                        state.meta.lorawan?(
                            <Grid bgcolor={'#fff'} mx={2} my={1} item md={6} px={2} py={2} borderRadius={2} lg={5} xl={5} sm={8} xs={11}>
                                <RowContainerBetween>
                                    <Box display={'flex'} my={1} alignItems={'center'}>
                                        <Router sx={{ fontSize: 20, color:'#292F3F' }} />
                                        <Typography fontWeight={500} mx={2}  fontSize={16} color={'#292F3F'}>LoRaWAN Settings</Typography>
                                    </Box>
                                    <MoreVert sx={{color:'black', fontSize:20}} />
                                </RowContainerBetween>
                                <Box my={2}>
                                    <SelectElement title={'Application Type'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} name="devAddr" textInputValue={state.meta.lorawan.devAddr} text={'Device Addr (Device Address)'}  placeholder={'8 digits required, got '+state.meta.lorawan.devAddr.toString().length} />
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} name="nwkSEncKey" textInputValue={state.meta.lorawan.nwkSEncKey} text={'NwkSKey(Network Session Key)'}  placeholder={'32 digits required, got '+state.meta.lorawan.nwkSEncKey.toString().length} />
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} name="appSKey" textInputValue={state.meta.lorawan.appSKey} text={'AppKey (App Key)'}  placeholder={'32 digits required, got '+state.meta.lorawan.appSKey.toString().length} />
                                </Box>
                            </Grid>
                        ):null
                    }
                    <Grid bgcolor={'#fff'} mx={2} my={1} item md={6} px={2} py={2} borderRadius={2} lg={5} xl={5} sm={8} xs={11}>
                        <RowContainerBetween>
                            <Box display={'flex'} my={1} alignItems={'center'}>
                                <Box component={'img'} src={'/box_download.svg'} width={20} height={20} />
                                <Typography fontWeight={500} mx={2}  fontSize={16} color={'#292F3F'}>Device Codec</Typography>
                            </Box>
                            <MoreVert sx={{color:'black', fontSize:20}} />
                        </RowContainerBetween>
                        <Box my={2}>
                            <SelectElement title={'Application Type'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                            {
                                codecsList? codecsList.map((codec,id)=>(
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} key={id} text={codec.name}  placeholder={`${id===0?'8':'32'}digits required, got 0`} />
                                )):null
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}