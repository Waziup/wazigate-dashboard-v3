import { Box, Button, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel,  ListSubheader,  MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import { NormalText, } from './Dashboard';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import {  Download, FiberNew,  } from '@mui/icons-material';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { StartAppConfig, type App } from 'waziup';
import { DevicesContext } from '../context/devices.context';
import CustomApp from '../components/CustomApp';
import { SelectElement } from './DeviceSettings';
import { LoadingButton } from '@mui/lab';
import { lineClamp, returnAppURL } from '../utils';
import TextInputField from '../components/shared/TextInputField';
import MenuComponent from '../components/shared/MenuDropDown';
type App1 = App & {
    description: string
}
type App2 = App & {
    description: string
    customApp: boolean
    image: string
}
const customAppProps: App2 = {
    description: '',
    id: '',
    author: '',
    customApp: true,
    name: '',
    image: '',
    version: '',
    waziapp: {
        hook: '',
        menu: {
            'fdf': {
                href: '',
                icon: '',
                primary: ''
            }
        }
    },
    state: {
        running: false,
        status: '',
        error: '',
        finishedAt: '',
        startedAt: '',
        health: '',
        paused: 'unhealthy',
        restartPolicy: '',
    }
}
const onCloseHandler = () => {
    setTimeout(() => {
        if (document?.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
    }, 0);
}
import Logo from '../assets/wazilogo.svg';
import LogoSig from '../assets/wazi_sig.svg';
import SnackbarComponent from '../components/shared/Snackbar';
const DropDown = ({ handleChange, matches, recommendedApps, customAppInstallHandler, age }: { customAppInstallHandler: () => void, matches: boolean, recommendedApps: RecomendedApp[], handleChange: (e: SelectChangeEvent) => void, age: string }) => (
    <FormControl color='info' size='small' sx={{ p: 0, border: 'none', width: matches ? '25%' : '45%', }}>
        <InputLabel color='info' id="demo-simple-select-helper-label">Install App</InputLabel>
        <Select sx={{borderColor:'#499dff', width: '100%', py: 0, }}
            labelId="Recommended Apps"
            id="recommeded_apps _selecter"
            onClose={onCloseHandler}
            value={age} label="Install App" onChange={handleChange}>
                <ListSubheader>WaziApps</ListSubheader>
                {
                    recommendedApps.map((app,idx) => (
                        <MenuItem key={app.id} value={app.image + "*" + app.id} sx={{":hover":{bgcolor:'#D4E3F5'}, display: 'flex',bgcolor:idx%2?'#eaeaea':'', width: '100%', justifyContent: 'space-between' }}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Box component={'img'} sx={{ width: 20, mx: 1, height: 20 }} src={Logo} />
                                <Tooltip color='black' followCursor title={app.description} placement="top-start">
                                    <Typography sx={{fontSize:14, color:'#325460', ...lineClamp(1)}} >{app.description.slice(0, 30) + '...'}</Typography>
                                </Tooltip>
                            </Box>
                            <Box display={'flex'} alignItems={'center'}>
                                <Download sx={{ fontSize: 15, mx: 1, color: '#325460' }} />
                                <Typography sx={{ textTransform: 'uppercase', color: '#325460', fontSize: 11 }}>
                                    Install
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                }
                <Box borderTop={'1px solid #d9d9d9'} mt={1}>
                    <ListSubheader >Custom App</ListSubheader>
                    <MenuItem onClick={customAppInstallHandler} value={20} sx={{ display: 'flex',  width: '100%', justifyContent: 'space-between' }}>
                        <Box display={'flex'} alignItems={'center'}>
                            <FiberNew sx={{ fontSize: 20, mx: 1, color: '#F48652' }} />
                            <Typography color={'#325460'} fontSize={15}>Install Custom App</Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'}>
                            <Download sx={{ fontSize: 15, mx: 1, color: '#325460' }} />
                            <Typography sx={{ textTransform: 'uppercase', color: '#325460', fontSize: 11 }}>
                                Install
                            </Typography>
                        </Box>
                    </MenuItem>
                </Box>

        </Select>

    </FormControl>
);
interface AppProp{
    children: React.ReactNode
}
export const GridItem = ({ children, }:AppProp) => (
    <Grid item md={6} lg={4} xl={4} sm={6} xs={12} minHeight={100} my={1} px={0} >
        <Box minHeight={100} sx={{ py: 1, position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
            {children}
        </Box>
    </Grid>
);
type RecomendedApp = {
    description: string,
    id: string,
    image: string,
}
import Logo404 from '../assets/search.svg';
export default function Apps() {
    const [customAppId, setCustomAppId] = useState<App2>(customAppProps);
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loadingUninstall, setLoadingUninstall] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const open = Boolean(anchorEl)
    const [modalProps, setModalProps] = useState<{ open: boolean, title: string, children: React.ReactNode,otherArgs?:string }>({ open: false, title: '', children: null,otherArgs:'' });
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { apps,  getApps,showDialog } = useContext(DevicesContext);
    const [recommendedApps, setRecommendedApps] = useState<RecomendedApp[]>([]);
    const [logs, setLogs] = useState<{ logs: string, done: boolean,error?:string }>({ logs: '', done: false,error: undefined });
    const logsRef = React.useRef<string>('');
    const [error, setError] = useState<{message: Error | null | string,severity: "error" | "warning" | "info" | "success"} | null>(null);
    function installAppFunction(image: string, id: string) {
        setAppToInstallId(id);
        window.wazigate.installApp(image).then((res) => {
            logsRef.current = res as unknown as string;
            setLogs({
                done: logsRef.current ? true : false,
                logs: res as unknown as string
            });
            getApps();
        }).catch((err) => {
            setLogs({
                done: true,
                logs: 'Error encountered while installing app: ' + err,
                error: err as string
            });
            setAppToInstallId('');
            return;
        })
    }
    const getRecApps = async()=>{
        window.wazigate.get<RecomendedApp[]>('apps?available')
        .then((appsr) => {
            setRecommendedApps(appsr);
        })
        .catch(setError)
    }
    useEffect(() => {
        if(apps.length ===0){
            getApps()
        }
        getRecApps()
    }, [apps, getApps]);
    const handleSubmitNewCustomApp = () => {
        showDialog({
            title:"Install app",
            acceptBtnTitle:"INSTALL",
            content:"Are you sure you want to install this app?",
            onAccept:()=>{
                handleLogsModal(customAppId.image, customAppId.image.replace("/", ".").split(":")[0]);
            },
            onCancel:()=>{}
        })
    }
    const [appToInstallId, setAppToInstallId] = useState<string>('');
    const handleCustomAppIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAppId({
            ...customAppId,
            [e.target.name]: e.target.value
        }) as unknown as App2;
    }
    function handleInstallAppModal() {
        setModalProps({...modalProps, title: 'Install App', children: <></> });
    }

    function handleLogsModal(image: string, id: string) {
        setAppToInstallId(id);
        setModalProps({
            open: true, 
            title: 'Installing New App', 
            children: <>
                <Box width={'100%'} bgcolor={'#fff'}>
                    
                </Box>
            </>
        });
        installAppFunction(image, id);
    }
    const [uninstLoader, setUninstLoader] = useState<boolean>(false);
    const [showAppSettings, setShowAppSettings] = useState<boolean>(false);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [appToUninstall, setAppToUninstall] = useState<App | null>(null);
    const fetchInstallLogs = useCallback(async (id: string)=>{
        await window.wazigate.get(`apps/${id}?install_logs`).then((fetchedLogs) => {
            logsRef.current = (fetchedLogs as { log: string, done: boolean }).log as string;
            if ((fetchedLogs as { log: string, done: boolean }).log !== logs.logs) {
                setLogs({
                    done: (fetchedLogs as { log: string, done: boolean }).done,
                    logs: (fetchedLogs as { log: string, done: boolean }).log as string
                });
            }
        }).catch((err) => {
            setLogs({
                done: true,
                logs: '',
                error: 'Error encountered while fetching logs: ' + err
            });
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const load = () => {
        window.wazigate.getApp(appToUninstall ? appToUninstall.id : '').then(setAppToUninstall, (error) => {
            showDialog({
                content: "There was an error loading the app info:\n" + error,
                onAccept:()=>{},
                onCancel:()=>{},
                hideCloseButton: true,
                acceptBtnTitle:"Close",
                title:"Error encountered"
            });
        });
    };
    useEffect(() => {
        if ((modalProps.open && modalProps.title === 'Installing New App')) {
            // || (modalProps.open && modalProps.title === 'Install App') && appToInstallId
            fetchInstallLogs(appToInstallId);
            const intervalId = setInterval(async () => {
                await fetchInstallLogs(appToInstallId);
            }, 1500); // Adjust the interval duration (in milliseconds) as needed
            // Clean up the interval on component unmount
            if (logs.done) {
                clearInterval(intervalId);
                setLogs({
                    ...logs,
                    done: false,
                });
                setModalProps({ open: false, title: '', children: null,otherArgs:'' });
                setAppToInstallId('');
                getApps();
                return;
            }
            return () => clearInterval(intervalId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appToInstallId, fetchInstallLogs, getApps, logs.done, modalProps.open, modalProps.title]);
    const setAppToUninstallFc = (id: number) => {
        const appToUninstallFind = apps[id];
        setAppToUninstall(appToUninstallFind);
        // handleClose();
        setUninstLoader(!uninstLoader)
    }
    const uninstall = async () => {
        setLoadingUninstall(true)
        await window.wazigate.uninstallApp(appToUninstall ? appToUninstall?.id : '', false)
        .then(() => {
            setUninstLoader(false);
            load();
            getRecApps()
            setAppToUninstall(null);
            getApps();
        }).catch(() => {
            showDialog({
                content:'Could not uninstall ' + appToUninstall?.name,
                onAccept:()=>{ },
                onCancel:()=>{},
                hideCloseButton: true,
                acceptBtnTitle:"Close",
                title:"Error encountered"
            });
        })
        setAppToUninstall(null);
        setUninstLoader(false);
        getApps();
        getRecApps()
        setLoadingUninstall(false);
    };
    function closeModal() {
        setLogs({
            done: false,
            logs: ''
        });
        setModalProps({ open: false, title: '', children: null, otherArgs:'' });
    }
    const updateSettings = (event: SelectChangeEvent<string>) => {
        setLoading(true);
        window.wazigate.setAppConfig(selectedApp?.id as string, {
            restart: event.target.value as "no" | "always" | "on-failure" | "unless-stopped" | undefined,
            state:'started'
        })
        .then(() => {
            setLoading(false);
            getApps();
            setShowAppSettings(!showAppSettings);
        })
        .catch((err) => {
            setLoading(false);
            showDialog({
                content:"Error Encountered: "+err,
                onAccept:()=>{

                },
                hideCloseButton: true,
                onCancel:()=>{},
                acceptBtnTitle:"Close",
                title:"Error encountered"
            });
            setShowAppSettings(!showAppSettings);
        });
    }
    function startOrStopApp(appId: string, running: boolean) {
        showDialog({
            title: (running ? 'Stopping' : 'Starting') + ' ' + appId + '?',
            acceptBtnTitle: running ? 'STOP' : 'START',
            content: 'Are you sure you want to ' + (running ? 'stop' : 'start') + ' ' + appId + '?',
            onAccept() {
                const config: StartAppConfig = {
                    action: running ? "stop" : "start",
                    restart: "no"
                }
                setLoading(true);
                window.wazigate.startStopApp(appId, config)
                .then(() => {
                    setError({
                        message: 'App ' + appId + ' ' + (running ? 'stopped' : 'started') + ' successfully',
                        severity:'success'
                    })
                    getApps();
                    setLoading(false);
                }).catch(() => {
                    setError({
                        message: 'Could not ' + (running ? 'stop' : 'start') + ' ' + appId,
                        severity:'error'
                    })
                    getApps();
                    setLoading(false);
                })
            },
            onCancel() {
                
            },
        })
    }
    return (
        <>
            {
                error ? (
                    <SnackbarComponent
                        autoHideDuration={5000}
                        severity={error.severity}
                        message={error && (error).message ? (error.message as Error).message : ''}
                        anchorOrigin={{vertical:'top',horizontal:'center'}}
                    />
                ):null
            }
            {
                <Dialog open={loading} sx={{bgcolor:'none'}} onClose={()=>{}}>
                    <DialogContent  sx={{bgcolor:'red',background:'none'}}>
                        <CircularProgress sx={{}} color="info" size={70} />
                    </DialogContent>
                </Dialog>
            }
            <Dialog open={modalProps.open && modalProps.title === 'Installing New App'} onClose={closeModal}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{borderTop:'1px solid black',bgcolor:'#000',overflow:'auto',height:250}}>
                    {
                        logs && (
                            <Box p={2} maxWidth={'100%'} overflow={'auto'} width={'100%'} bgcolor={'#000'}>
                                <pre style={{fontSize:13,color:'#fff'}}>
                                    {logs.logs}
                                </pre>
                            </Box>
                        )
                    }
                    {
                        logs.error &&(
                            <Box px={2} py={1} bgcolor={'#fec61f'}>
                                <Typography color={'error'}>{logs.error}</Typography>
                            </Box>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button disabled={!logs.done} onClick={closeModal} variant={'text'} sx={{ mx: 2,color:'#ff0000' }} color={'info'}>CLOSE</Button>
                    <LoadingButton disabled loading={true} onClick={closeModal} variant={'contained'} sx={{ mx: 2 }} color={'primary'}>CLOSE</LoadingButton>
                    
                </DialogActions>
            </Dialog>
            <Dialog  fullWidth PaperProps={{component:'form', onSubmit:(e: React.FormEvent<HTMLFormElement>)=>{e.preventDefault(); handleSubmitNewCustomApp() } }} open={modalProps.open && modalProps.title === 'Install App'} onClose={() => { setCustomAppId(customAppProps); setLogs({ done: false, logs: '' }); closeModal() }} >
                <DialogTitle>{modalProps.title}</DialogTitle>
                <RowContainerBetween additionStyles={{ borderBottom: '1px solid black', p: 0 }}/>
                <DialogContent sx={{my:0,borderBottom:'1px solid black',}} >
                    <TextInputField
                        placeholder="Docker Image: format(owner/image_name:tag)"
                        label='Image'
                        required
                        name='image'
                        value={customAppId.image}
                        onChange={handleCustomAppIdChange}
                    />
                </DialogContent>
                <DialogActions>
                    {/* <PrimaryButton color={'secondary'} variant='text' title='Install' type='submit'/> */}
                    <Button onClick={() => { setCustomAppId(customAppProps); setLogs({ done: false, logs: '' }); closeModal() }} sx={{ mx: 2, color: '#ff0000', }} variant="text" color="warning" >CANCEL</Button>
                    <Button sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >INSTALL</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={uninstLoader} onClose={() => { setAppToUninstall(null); setUninstLoader(!uninstLoader) }}>
                <DialogTitle>Do you wish to uninstall {appToUninstall?.name}</DialogTitle>
                <DialogContent sx={{my:2,}} >
                    <DialogContentText>
                        This app will be removed and uninstalled from the gateway, you can still reinstall it for have it running in the gateway.
                    </DialogContentText>
                    {
                        loadingUninstall && (
                            <Box alignItems={'center'} justifyContent={'center'} width={'100%'} my={1}>
                                <CircularProgress color='info' />
                            </Box>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setAppToUninstall(null); setUninstLoader(!uninstLoader) }} sx={{ mx: 2, color: '#ff0000', }} variant="text" color="warning" >CANCEL</Button>
                    <Button autoFocus onClick={uninstall} sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >UNINSTALL</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={showAppSettings} onClose={() => { setShowAppSettings(!showAppSettings) }}>
                <Box   borderRadius={2} bgcolor={'#fff'}>
                    <DialogTitle> {selectedApp?.name} Settings</DialogTitle>
                    <DialogContent>
                        <FormControl sx={{  width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} mb={.4} fontSize={12}>App name</Typography>
                            <input
                                autoFocus
                                name="name" placeholder='Enter device name'
                                value={selectedApp?.name}
                                required
                                readOnly
                                style={{background:'none', border: 'none', width: '100%', padding: '6px 0', outline: 'none' }}
                            />
                        </FormControl>
                        <Box sx={{ my: 2, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Author</Typography>
                            <Typography color={'primary'} my={1} fontSize={12}>{selectedApp?.author.name ? (selectedApp?.author.name) : (selectedApp?.author)}</Typography>
                        </Box>
                        {
                            selectedApp?.state ? (
                                <SelectElement
                                    my={2}
                                    id="restartPolicy"
                                    name='restartPolicy'
                                    value={(selectedApp as App)?.state ? (selectedApp as App)?.state.restartPolicy : ''}
                                    handleChange={updateSettings}
                                    conditions={['no','unless-stopped', 'on-failure', 'always']}
                                    title='Restart Policy'
                                />
                            ):null
                        }
                        <Box sx={{ my: 2, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Description</Typography>
                            <Typography color={'primary'} my={1} fontSize={12}>{(selectedApp as App1)?.description as string}</Typography>
                        </Box>
                        <Box sx={{ my: 2, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Version</Typography>
                            <Typography color={'primary'} mb={1} fontSize={12}>{selectedApp?.version}</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ mx:1 }}>
                        <Button onClick={() => { setShowAppSettings(!showAppSettings) }} sx={{ textTransform: 'initial', color: '#ff0000' }} color='warning' variant={'text'} >CANCEL</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={modalProps.open && modalProps.title ==='Confirm Installation'} onClose={() => { setModalProps({ open: false, title: '', children: null,otherArgs:undefined }) }}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{my:2,}} >
                    <DialogContentText>
                        Do you wish to install {modalProps.otherArgs?modalProps.otherArgs.split('*')[1] :'a new app'}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setModalProps({ open: false, title: '', children: null,otherArgs:undefined }) }} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'} >CANCEL</Button>
                    <Button autoFocus
                        onClick={() => {
                            modalProps.otherArgs ? handleLogsModal(modalProps.otherArgs.split('*')[0], modalProps.otherArgs.split('*')[1]) : handleInstallAppModal() 
                        }}
                        sx={{textTransform: 'initial', color: '#499dff'}}
                        variant={'text'}
                        >
                            INSTALL
                    </Button>
                </DialogActions>
            </Dialog>
            <Box  onClick={() => { open ? handleClose() : null }} sx={{px:matches?4:2,py:2, overflowY: 'auto',  height: '100%' }}>
                <RowContainerBetween>
                    <Box >
                        <Typography fontWeight={700} fontSize={24} color={'black'}>Apps</Typography>
                        {
                            matches?(
                                <Typography fontSize={matches ? 15 : 13} sx={{ color: DEFAULT_COLORS.secondary_black }}>Setup your Wazigate Edge Apps</Typography>
                            ):null
                        }
                    </Box>
                    <DropDown
                        customAppInstallHandler={()=>{ setModalProps({ open: true, title: 'Confirm Installation', children: <></>,otherArgs: undefined }) }}
                        // customAppInstallHandler={handleInstallAppModal}
                        recommendedApps={recommendedApps}
                        matches={matches}
                        handleChange={(e)=>{
                            setModalProps({ 
                                open: true, 
                                title: 'Confirm Installation',
                                children: <></>,
                                otherArgs: isNaN(parseInt(e.target.value))?e.target.value: undefined
                            })
                        }}
                        // handleChange={handleChangeLogsModal}
                        age={''}
                    />
                </RowContainerBetween>
                <Grid container spacing={2} py={2}>
                    {
                        apps.length >0?apps.map((app, idx) => {
                            return (
                                <>
                                    {
                                        (app as App2).customApp ? (
                                            <CustomApp
                                                key={app.id}
                                                app={app}
                                            />
                                        ) : (
                                            <GridItem key={app.id}>
                                                <Box px={.4} display={'flex'} alignItems={'center'} sx={{ position: 'absolute', top: -5, my: -1, }} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                                                    <Box component={'img'} src={LogoSig} />
                                                    <Typography fontSize={15} mx={1} color={'white'} component={'span'}>{app.author?app.author.name??'Generic':''}</Typography>
                                                </Box>
                                                <CardHeader
                                                    title={<NormalText title={app.name} />}
                                                    subheader={<Typography color={'#325460'} fontWeight={300}><Typography component={'span'}fontWeight={200} fontSize={14}>App ID:</Typography> {app.id}</Typography>}
                                                    action={
                                                        <MenuComponent
                                                            open={open}
                                                            menuItems={[
                                                                app.state && app.state.running?{
                                                                    icon: `stop_circle`,
                                                                    text: app.state ? app.state.running ? 'Stop' : 'Start' : 'Start',
                                                                    clickHandler: () => { startOrStopApp(app.id, app.state ? app.state.running : false) }
                                                                }:null,
                                                                {
                                                                    icon: 'settings',
                                                                    text: 'Settings',
                                                                    clickHandler: () => { setSelectedApp(app); setShowAppSettings(!showAppSettings) }
                                                                },
                                                                {
                                                                    icon: 'delete_forever',
                                                                    text: 'Uninstall',
                                                                    menuItemAdditionalStyle:{borderTop:'0.1px solid #797979'},
                                                                    clickHandler: () => { setAppToUninstallFc(idx) }
                                                                },
                                                            ]}
                                                        />
                                                    }
                                                />
                                                <Box sx={{px:2}}>
                                                    <Typography fontSize={15} fontWeight={100} my={0} color={DEFAULT_COLORS.secondary_black}>Status: <Typography component={'span'} fontSize={15} color={app.state ? app.state.running ? DEFAULT_COLORS.primary_blue : DEFAULT_COLORS.navbar_dark : DEFAULT_COLORS.navbar_dark}>{app.state ? app.state.running ? 'Running' : 'Stopped' : 'Stopped'}</Typography></Typography>
                                                    <Typography sx={{fontWeight:'100',fontSize:14, my:1,color: DEFAULT_COLORS.secondary_black, ...lineClamp(2)}}>{(app as App1).description.length > 40 ? (app as App1).description.slice(0, 39) + '...' : (app as App1).description}</Typography>
                                                </Box>
                                                <Box sx={{px:2}}>
                                                    {
                                                        app.state && app.state.running?(
                                                            <Link style={{width:'100%'}} to={returnAppURL(app)} >
                                                                <Button disabled={app.state ?!app.state.running:true} sx={{ fontWeight: '500', bgcolor: '#F4F7F6', my: 1, color: 'info.main', width: '100%' }}>OPEN</Button>
                                                            </Link>
                                                        ):(
                                                            <Button onClick={() => { startOrStopApp(app.id, app.state ? app.state.running : false) }}  sx={{ fontWeight: '500', bgcolor: '#F4F7F6', my: 1, color: 'info.main', width: '100%' }}>START APP</Button>
                                                        )
                                                    }
                                                </Box>
                                            </GridItem>
                                        )
                                    }
                                </>
                            )
                        }):(
                            <Box sx={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <img src={Logo404}  style={{ filter: 'invert(80%) sepia(0%) saturate(0%) brightness(85%)',width:140,height:140 }}  alt="Search Icon" />
                                <Typography fontSize={20} color={'#325460'}>No Apps Installed</Typography>
                            </Box>
                        )
                    }
                </Grid>
            </Box>
        </>
    );
}
