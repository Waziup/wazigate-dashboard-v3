import {Box, Button, CircularProgress, FormControl,  Grid,  InputLabel, ListItemIcon, Menu,  MenuItem,  Select,SelectChangeEvent,Tooltip, Typography} from '@mui/material';
import { NormalText,  } from './Dashboard';
import RowContainerBetween from '../components/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import { DeleteForever, Download, FiberNew, MoreVert, Settings, } from '@mui/icons-material';
import React,{useState,useEffect, useContext} from 'react';
import { useOutletContext } from 'react-router-dom';
import { StartAppConfig, type App } from 'waziup';
import Backdrop from '../components/Backdrop';
import { DevicesContext } from '../context/devices.context';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CustomApp from '../components/CustomApp';
type App1 =App &{
    description:string
}
type App2 =App &{
    description:string
    customApp:boolean
}
const customAppProps:App2={
    description:'',
    id:'',
    author:'',
    customApp:true,
    name:'',
    version:'',
    waziapp:{
        hook:'',
        menu:{
            'fdf':{
                href:'',
                icon:'',
                primary:''
            }
        }
    },
    state:{
        running:false,
        status:'',
        error:'',
        finishedAt:'',
        startedAt:'',
        health:'',
        paused:'unhealthy',
        restartPolicy:'',

    }
}
const onCloseHandler= ()=>{
    setTimeout(() => {
        if (document?.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
    }, 0);
            
}
const DropDown = ({handleChange,matches,recommendedApps,customAppInstallHandler, age}:{customAppInstallHandler:()=>void, matches:boolean,recommendedApps:RecomendedApp[], handleChange:(e: SelectChangeEvent)=>void,age: string})=>(
    <FormControl sx={{p:0, border:'none', width: matches?'35%':'45%', }}>
        <InputLabel id="demo-simple-select-helper-label">Install App</InputLabel>
        <Select sx={{width:'100%',py:0,}} 
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper" 
            onClose={onCloseHandler} 
            value={age} label="Age" onChange={handleChange}>
            {
                recommendedApps.map((app)=>(
                    <MenuItem key={app.id} value={app.image + "*"+app.id} sx={{display:'flex',width:'100%', justifyContent:'space-between'}}>
                        <Box display={'flex'} alignItems={'center'}>
                            <Box component={'img'} sx={{width:20,mx:1, height:20}} src='/wazilogo.svg' />
                            <Tooltip color='black' followCursor  title={app.description} placement="top-start">
                                <Typography fontSize={14} color={'#325460'} >{app.description.slice(0,30)+'...'}</Typography>
                            </Tooltip>
                        </Box>
                        <Box display={'flex'} alignItems={'center'}>
                            <Download sx={{fontSize:15,mx:1,color:'#325460'}} />
                            <Typography sx={{textTransform:'uppercase', color:'#325460', fontSize:11}}>
                                Install
                            </Typography>
                        </Box>
                    </MenuItem>
                ))
            }
            <MenuItem onClick={customAppInstallHandler} value={20} sx={{display:'flex',py:1,width:'100%',borderTop:'1px solid black', justifyContent:'space-between'}}>
                <Box display={'flex'} alignItems={'center'}>
                    <FiberNew sx={{fontSize:20,mx:1,color:'#F48652'}}/>
                    <Typography color={'#325460'} fontSize={15}>Install Custom App</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'}>
                    <Download sx={{fontSize:20,mx:1,color:'#325460'}} />
                    <Typography sx={{textTransform:'uppercase', color:'#325460', fontSize:15}}>
                        Install
                    </Typography>
                </Box>
            </MenuItem>
            
        </Select>
        
    </FormControl>
);
export const GridItem=({children}:{ children:React.ReactNode})=>(
    <Grid item md={6} lg={4} xl={4}  sm={6} xs={12} minHeight={100} my={1} px={1} >
        <Box minHeight={100} sx={{px:2, py:1, position:'relative', bgcolor: 'white', borderRadius:2, }}>
            {children}
            <Button  sx={{fontWeight:'500',bgcolor:'#F4F7F6',my:1, color:'info.main',width:'100%'}}>OPEN</Button>
        </Box>
    </Grid>
);
type RecomendedApp={
    description:string,
    id:string,
    image:string,
}
export default function Apps() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loadingUninstall,setLoadingUninstall] = React.useState<boolean>(false);
    const open = Boolean(anchorEl)
    const [modalProps, setModalProps] = useState<{ open: boolean, title: string, children: React.ReactNode }>({ open: false, title: '', children: null });
    const handleClose = () => {
        setAnchorEl(null);
    };
    const {apps,addApp,getApps} =useContext(DevicesContext);
    const [recommendedApps,setRecommendedApps] = useState<RecomendedApp[]>([]);
    const [logs,setLogs] = useState<string>('');
    const logsRef = React.useRef<string>('');
    const [error, setError] = useState<Error | null | string>(null);
    function installAppFunction(image:string,id:string){
        setAppToInstallId(id);
        window.wazigate.installApp(image).then((res)=>{
            console.log(res);
            logsRef.current = res as unknown as string;
            setLogs(res as unknown as string);
            getApps();
        }).catch((err)=>{
            console.log(err);
            setLogs(err as string);
            return;
        })
    }
    useEffect(() => {
        window.wazigate.get<RecomendedApp[]>('apps?available')
        .then((appsr)=>{
            setRecommendedApps(appsr);
        })
        .catch(setError)
    }, []);
    const handleCustomAppIdChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.value); 
        setCustomAppId({
            ...customAppId,
            [e.target.id]:e.target.value 
        })
    }
    const handleSubmitNewCustomApp = ()=>{
        console.log(customAppId);
        const yesNo = confirm('Are you sure you want to install this app?');
        if (!yesNo) {
            return;
        }
        addApp(customAppId);
    }
    const [customAppId,setCustomAppId] = useState<App2>(customAppProps);
    const [appToInstallId,setAppToInstallId] = useState<string>('');
    console.log(customAppId,'custom app id');
    
    function handleInstallAppModal(){
        setModalProps({open:true, title:'Install App', children:<>
            <Box  width={'100%'}  bgcolor={'#fff'}>
                <form onSubmit={(e)=>{e.preventDefault();handleSubmitNewCustomApp()}}>
                    <Box borderBottom={'1px solid black'} px={2} py={2}>
                        <input style={{width:'100%',padding:'8px 4px',borderRadius:5, outline:'none',border:'1px solid  black'}} 
                            onInput={handleCustomAppIdChange}  
                            id="name" required 
                            placeholder="format(owner/image_name:tag)" 
                        />
                        <input style={{width:'100%',padding:'8px 4px',borderRadius:5, outline:'none',border:'1px solid  black'}} 
                            onInput={handleCustomAppIdChange}  
                            id="description" 
                            required 
                            placeholder="Description of app" 
                        />
                    </Box>
                    <Box py={2}>
                        <Button type='submit' variant={'contained'} sx={{mx:2}} color={'primary'}>Install</Button>
                        <Button onClick={()=>{setCustomAppId(customAppProps);setLogs(''); closeModal()}} variant={'contained'} sx={{mx:2}} color={'error'}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </>});
    }
    
    function handleLogsModal(image:string, id:string){
        console.log('ID is: ',id);
        console.log('Image is: ',image);
        setAppToInstallId(id);
        
        const appToInstall = apps.find((app)=>app.id===id);
        console.log(appToInstall);
        setModalProps({open:true, title:'Installing New App', children:<>
            <Box  width={'100%'} bgcolor={'#fff'}>
                <Box px={2} py={1}>
                    <Button onClick={closeModal} variant={'contained'} sx={{mx:2}} color={'error'}>CLOSE</Button>
                </Box>
            </Box>
        </>});
        installAppFunction(image,id);
    }
    const handleChangeLogsModal = (e: SelectChangeEvent)=>{
        console.log(e.target.value);
        if (parseInt(e.target.value) === 20) {
            console.log('we are installing a custom app');
            handleInstallAppModal();
            return;
        }
        const [image,id] = e.target.value.split('*');
        handleLogsModal(image, id);
    }
    const [uninstLoader,setUninstLoader] = useState<boolean>(false);
    const [showAppSettings,setShowAppSettings] = useState<boolean>(false);
    const [appToUninstall,setAppToUninstall] = useState<App | null>(null);
    async function fetchInstallLogs(id:string){
        await window.wazigate.get(`apps/${id}?install_logs`).then((fetchedLogs)=>{
            logsRef.current = (fetchedLogs as {log:string,done:boolean}).log as string;
            if ((fetchedLogs as {log:string,done:boolean}).log !== logs) {
                setLogs((fetchedLogs as {log:string,done:boolean}).log as string);
            }
            console.log((fetchedLogs as {log:string,done:boolean}).log,'logs')
        }).catch((err)=>{
            setLogs('Error encountered while fetching logs: '+err);
        })
    }
    const load = () => {
        window.wazigate.getApp(appToUninstall?appToUninstall.id:'').then(setAppToUninstall, (error) => {
          alert("There was an error loading the app info:\n" + error);
        });
    };
    useEffect(() => {
        console.log('We are installing a new app and the ID is passed as: ',appToInstallId)
        if (modalProps.open && modalProps.title==='Installing New App') {
            fetchInstallLogs(appToInstallId);
            const intervalId = setInterval(async () => {
                await fetchInstallLogs(appToInstallId);
              }, 1000); // Adjust the interval duration (in milliseconds) as needed
              // Clean up the interval on component unmount
            return () => clearInterval(intervalId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[modalProps.open && modalProps.title==='Installing New App']);
    console.log(logs,'logs in app component');
    const setAppToUninstallFc = (id:number)=>{
        console.log(id);
        const appToUninstallFind = apps[id];
        console.log(appToUninstallFind);
        setAppToUninstall(appToUninstallFind);
        // handleClose();
        setUninstLoader(!uninstLoader)
    }
    const uninstall = () => {

        console.log(appToUninstall);
        
        setLoadingUninstall(true)
        window.wazigate.uninstallApp(appToUninstall?appToUninstall?.id:'', false)
        .then((res) => {
            console.log(res);
            setUninstLoader(false);
            load();
            setAppToUninstall(null);
            getApps();
        }).catch((err)=>{
            // setAppToUninstall(null);
            console.log('error encountered',err);
            setLoadingUninstall(false);
            
        })
    };
    function closeModal(){
        setModalProps({open:false, title:'', children:null});
    }
    function startOrStopApp(appId:string,running: boolean){
        console.log('starting an app with this ID:',appId);
        const yesNo=confirm('Are you sure you want to '+ (running?'stop':'start')+' '+appId+'?');
        if (!yesNo) {
            return;
        }
        const config:StartAppConfig={
            action: running?"stop":"start",
            restart:"no"
        }
        console.log(appId,JSON.stringify(config));
        window.wazigate.startStopApp(appId,config)
        .then((res)=>{
            console.log(res);
            getApps();
        }).catch((err)=>{
            console.log(err);
            getApps()
        })
        
    }
    if (error) {
        return <div>Error: {(error as Error).message?(error as Error).message:(error as string)}</div>;
    }
    return (
        <>
            {
                modalProps.open &&
                <Backdrop>
                    <Box  width={matches?'40%':'90%'} bgcolor={'#fff'}>
                        <Box borderBottom={'1px solid black'} px={2} py={2}>
                            <Typography>{modalProps.title}</Typography>
                        </Box>
                        {
                            logs &&(
                                <Box maxWidth={'100%'} overflow={'scroll'} width={'100%'} height={200} bgcolor={'#000'}>
                                    <Typography fontSize={10} color={'#fff'}>
                                        {logs}
                                    </Typography>
                                </Box>
                            )
                        }
                        <Box borderBottom={'1px solid black'}  py={2}>
                            {modalProps.children}
                        </Box>
                    </Box>
                </Backdrop>
            }
            {
                uninstLoader &&(
                    <Backdrop>
                        <Box  width={matches?'40%':'90%'} bgcolor={'#fff'}>
                            <Box borderBottom={'1px solid black'} px={2} py={2}>
                                <Typography>Do you wish to uninstall {appToUninstall?.name}</Typography>
                            </Box>
                            {
                                loadingUninstall &&(
                                    <Box borderBottom={'1px solid black'} width={'100%'} my={1}>
                                        <CircularProgress color='info'  />
                                    </Box>
                                )
                            }
                            <Box px={2} py={1}>
                                <Button onClick={uninstall} variant={'contained'} sx={{mx:2}} color={'primary'}>Uninstall</Button>
                                <Button onClick={()=>{setAppToUninstall(null); setUninstLoader(!uninstLoader)}} variant={'contained'} sx={{mx:2}} color={'error'}>Cancel</Button>
                            </Box>
                        </Box>
                    </Backdrop>
                )
            }
            {
                showAppSettings &&(
                    <Backdrop>
                        <Box width={matches?'40%':'90%'} bgcolor={'#fff'}>
                            <Box borderBottom={'1px solid black'} px={2} py={2}>
                                <Typography>App Settings</Typography>
                            </Box>
                            <Box px={2} py={1}>
                                <Button onClick={()=>{setShowAppSettings(!showAppSettings)}} variant={'contained'} sx={{mx:2}} color={'error'}>CLOSE</Button>
                            </Box>
                        </Box>
                    </Backdrop>
                )
            }
            <Box p={3} onClick={()=> {open?handleClose():null}} sx={{overflowY:'scroll',my:2, height:'100%'}}>
                <RowContainerBetween>
                    <Box maxWidth={'50%'}>
                        <Typography fontWeight={700} fontSize={20} color={'black'}>Apps</Typography>
                        <Typography fontSize={matches?15:13} sx={{color:DEFAULT_COLORS.secondary_black}}>Setup your Wazigate Edge Apps</Typography>
                    </Box>
                    <DropDown
                        customAppInstallHandler={handleInstallAppModal} 
                        recommendedApps={recommendedApps}
                        matches={matches} 
                        handleChange={handleChangeLogsModal} age={''} 
                    />
                </RowContainerBetween>
                <Grid container spacing={2} py={2}>
                    {
                        apps.map((app,idx)=>{
                            return(
                                <>
                                    {
                                        (app as App2).customApp?(
                                            <CustomApp
                                                key={app.id}
                                                app={app}
                                            />
                                        ):(

                                            <GridItem key={app.id}>
                                                <Box px={.4} display={'flex'} alignItems={'center'} sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                                                    <Box component={'img'} src='/wazi_sig.svg' />
                                                    <Typography fontSize={15} mx={1} color={'white'} component={'span'}>{app.author.name}</Typography>
                                                </Box>
                                                <Box display={'flex'} py={2}  justifyContent={'space-between'}>
                                                    <Box>
                                                        <NormalText title={app.name} />
                                                        <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>{app.id}</Typography>
                                                    </Box>
                                                    <Box position={'relative'}>
                                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                                            {(popupState) => (
                                                                <React.Fragment>
                                                                    <Button id="demo-positioned-button"
                                                                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                                                                        aria-haspopup="true"
                                                                        aria-expanded={open ? 'true' : undefined}
                                                                        // onClick={handleClick}
                                                                        {...bindTrigger(popupState)}
                                                                        >
                                                                        <MoreVert sx={{color:'black'}}/>
                                                                    </Button>
                                                                    
                                                                    <Menu {...bindMenu(popupState)}>
                                                                    <MenuItem onClick={(e)=>{console.log(e.currentTarget.value);popupState.close}} value={app.id} >
                                                                        <ListItemIcon>
                                                                            <Settings fontSize="small" />
                                                                        </ListItemIcon>
                                                                        Settings
                                                                    </MenuItem>
                                                                    {
                                                                        idx?(
                                                                            <MenuItem value={idx} onClick={()=>{setAppToUninstallFc(idx);popupState.close}}>
                                                                                <ListItemIcon>
                                                                                    <DeleteForever fontSize="small" />
                                                                                </ListItemIcon>
                                                                                Uninstall
                                                                            </MenuItem>
                                                                        ):null
                                                                    }
                                                                    <MenuItem value={idx} onClick={()=>{startOrStopApp(app.id,app.state.running);popupState.close}}>
                                                                        <ListItemIcon>
                                                                            <DeleteForever fontSize="small" />
                                                                        </ListItemIcon>
                                                                        {app.state?app.state.running?'Stop':'Start':'Start'}
                                                                    </MenuItem>
                                                                    </Menu>
                                                                </React.Fragment>
                                                            )}
                                                        </PopupState>
                                                    </Box>
                                                </Box>
                                                <Typography fontSize={15} fontWeight={200} my={1} color={DEFAULT_COLORS.navbar_dark}>Status: <Typography component={'span'} fontSize={15} color={DEFAULT_COLORS.navbar_dark}>{app.state?app.state.running?'Running':'Stopped':'Running'}</Typography></Typography>
                                                <Typography fontSize={14} my={1} color={DEFAULT_COLORS.secondary_black}>{(app as App1).description.length>40?(app as App1).description.slice(0,39)+'...':(app as App1).description}</Typography>
                                            </GridItem>
                                        )
                                    }
                                </>
                            )
                        })
                    }
                </Grid>
            </Box>
        </>
    );
}
