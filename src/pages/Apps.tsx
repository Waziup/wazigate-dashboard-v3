import { Box, Button, CircularProgress, FormControl, Grid, InputLabel,  MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import { NormalText, } from './Dashboard';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import {  Close, Download, FiberNew, SearchOff,  } from '@mui/icons-material';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { StartAppConfig, type App } from 'waziup';
import Backdrop from '../components/Backdrop';
import { DevicesContext } from '../context/devices.context';
import CustomApp from '../components/CustomApp';
import { SelectElement } from './DeviceSettings';
import { LoadingButton } from '@mui/lab';
import { returnAppURL } from '../utils';
import TextInputField from '../components/shared/TextInputField';
import MenuComponent from '../components/shared/MenuDropDown';
import PrimaryButton from '../components/shared/PrimaryButton';
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
    <FormControl sx={{ p: 0, border: 'none', width: matches ? '35%' : '45%', }}>
        <InputLabel color='info' id="demo-simple-select-helper-label">Install App</InputLabel>
        <Select sx={{borderColor:'#499dff', width: '100%', py: 0, }}
            labelId="Recommended Apps"
            id="recommeded_apps _selecter"
            onClose={onCloseHandler}
            value={age} label="Age" onChange={handleChange}>
            {
                recommendedApps.map((app) => (
                    <MenuItem key={app.id} value={app.image + "*" + app.id} sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Box display={'flex'} alignItems={'center'}>
                            <Box component={'img'} sx={{ width: 20, mx: 1, height: 20 }} src={Logo} />
                            <Tooltip color='black' followCursor title={app.description} placement="top-start">
                                <Typography fontSize={14} color={'#325460'} >{app.description.slice(0, 30) + '...'}</Typography>
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
            <MenuItem onClick={customAppInstallHandler} value={20} sx={{ display: 'flex', py: 1, width: '100%', borderTop: '1px solid black', justifyContent: 'space-between' }}>
                <Box display={'flex'} alignItems={'center'}>
                    <FiberNew sx={{ fontSize: 20, mx: 1, color: '#F48652' }} />
                    <Typography color={'#325460'} fontSize={15}>Install Custom App</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'}>
                    <Download sx={{ fontSize: 20, mx: 1, color: '#325460' }} />
                    <Typography sx={{ textTransform: 'uppercase', color: '#325460', fontSize: 15 }}>
                        Install
                    </Typography>
                </Box>
            </MenuItem>

        </Select>

    </FormControl>
);
interface AppProp{
    disabled?:boolean,
    appUrl?:string
    children: React.ReactNode
}
export const GridItem = ({appUrl, children,disabled }:AppProp) => (
    <Grid item md={6} lg={4} xl={4} sm={6} xs={12} minHeight={100} my={1} px={1} >
        <Box minHeight={100} sx={{ px: 2, py: 1,boxShadow:3, position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
            {children}
            <Link to={appUrl?appUrl:''} >
                <Button disabled={disabled} sx={{ fontWeight: '500', bgcolor: '#F4F7F6', my: 1, color: 'info.main', width: '100%' }}>OPEN</Button>
            </Link>
        </Box>
    </Grid>
);
type RecomendedApp = {
    description: string,
    id: string,
    image: string,
}
export default function Apps() {
    const [customAppId, setCustomAppId] = useState<App2>(customAppProps);
    const [matches, matchesMd] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loadingUninstall, setLoadingUninstall] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const open = Boolean(anchorEl)
    const [modalProps, setModalProps] = useState<{ open: boolean, title: string, children: React.ReactNode,otherArgs?:string }>({ open: false, title: '', children: null,otherArgs:'' });
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { apps,  getApps } = useContext(DevicesContext);
    const [recommendedApps, setRecommendedApps] = useState<RecomendedApp[]>([]);
    const [logs, setLogs] = useState<{ logs: string, done: boolean,error?:string }>({ logs: '', done: false,error: undefined });
    const logsRef = React.useRef<string>('');
    const [error, setError] = useState<Error | null | string>(null);
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
        const yesNo = confirm('Are you sure you want to install this app?');
        if (!yesNo) {
            return;
        }
        handleLogsModal(customAppId.image, customAppId.image.replace("/", ".").split(":")[0]);
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
            alert("There was an error loading the app info:\n" + error);
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
    const uninstall = () => {
        setLoadingUninstall(true)
        window.wazigate.uninstallApp(appToUninstall ? appToUninstall?.id : '', false)
        .then(() => {
            setUninstLoader(false);
            load();
            getRecApps()
            setAppToUninstall(null);
            getApps();
        }).catch(() => {
            alert('Could not uninstall ' + appToUninstall?.name);
            setAppToUninstall(null);
            getApps();
            getRecApps()
        })
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
            alert('Error: ' + err);
            setShowAppSettings(!showAppSettings);
        });
    }
    function startOrStopApp(appId: string, running: boolean) {
        const yesNo = confirm('Are you sure you want to ' + (running ? 'stop' : 'start') + ' ' + appId + '?');
        if (!yesNo) {
            return;
        }
        const config: StartAppConfig = {
            action: running ? "stop" : "start",
            restart: "no"
        }
        setLoading(true);
        window.wazigate.startStopApp(appId, config)
        .then(() => {
            alert('App ' + appId + ' ' + (running ? 'stopped' : 'started') + ' successfully');
            getApps();
            setLoading(false);
        }).catch(() => {
            alert('Could not ' + (running ? 'stop' : 'start') + ' ' + appId);
            getApps();
            setLoading(false);
        })

    }
    return (
        <>
            {
                error ? (
                    <SnackbarComponent
                        autoHideDuration={5000}
                        severity='error'
                        message={(error as Error).message ? (error as Error).message : (error as string)}
                        anchorOrigin={{vertical:'top',horizontal:'center'}}
                    />
                ):null
            }
            {
                loading?(
                    <Backdrop>
                        <CircularProgress color="info" size={70} />
                    </Backdrop>
                ):null
            }
            {
                modalProps.open && modalProps.title === 'Installing New App' && (
                    <Backdrop>
                        <Box sx={{width:matches?'40%':'90%',bgcolor:'#fff',borderRadius:1.5,boxShadow:3}} width={matches ? '40%' : '90%'} bgcolor={'#fff'}>
                            <Box borderBottom={'1px solid black'} p={2}>
                                <Typography>{modalProps.title}</Typography>
                            </Box>
                            {
                                logs && (
                                    <Box p={2} maxWidth={'100%'} overflow={'auto'} width={'100%'} height={250} bgcolor={'#000'}>
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
                            <Box py={2}>
                                {modalProps.children}
                                <RowContainerBetween additionStyles={{px:2,py:1}}>
                                    <Button disabled={!logs.done} onClick={closeModal} variant={'contained'} sx={{ mx: 2,color:'#fff' }} color={'info'}>CLOSE</Button>
                                    {
                                        <Box sx={{display:'flex',justifyContent: 'flex-end',alignItems:'center'}}>
                                            <LoadingButton disabled loading={true} onClick={closeModal} variant={'contained'} sx={{ mx: 2 }} color={'primary'}>CLOSE</LoadingButton>
                                        </Box>
                                    }
                                </RowContainerBetween>
                            </Box>
                        </Box>
                    </Backdrop>
                )
            }
            {
                (modalProps.open && modalProps.title === 'Install App') ? (
                    <Backdrop>
                        <Box sx={{width: matches ? '30%' : '90%',borderRadius:1.5,boxShadow:3,bgcolor:'#fff'}} >
                            <RowContainerBetween additionStyles={{ borderBottom: '1px solid black', p: 2 }}>
                                <Typography>{modalProps.title}</Typography>
                                <Close sx={{ cursor: 'pointer',color: 'black', fontSize: 20 }} onClick={() => { setCustomAppId(customAppProps); setLogs({ done: false, logs: '' }); closeModal() }} />
                            </RowContainerBetween>
                            <Box my={2} bgcolor={'#fff'}>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmitNewCustomApp() }}>
                                    <Box borderBottom={'1px solid black'} p={2} >
                                        <TextInputField
                                            placeholder="Docker Image: format(owner/image_name:tag)"
                                            label='Image'
                                            required
                                            name='image'
                                            value={customAppId.image}
                                            onChange={handleCustomAppIdChange}
                                        />
                                    </Box>
                                    <RowContainerBetween additionStyles={{ py: 2 }}>
                                        <PrimaryButton title='Install' type='submit'/>
                                        <Box></Box>
                                    </RowContainerBetween>
                                </form>
                            </Box>
                        </Box>
                    </Backdrop>
                ) : null
            }
            {
                uninstLoader ? (
                    <Backdrop>
                        <Box width={matches ? '30%' : '90%'} bgcolor={'#fff'}>
                            <Box borderBottom={'1px solid black'} px={2} py={2}>
                                <Typography>Do you wish to uninstall {appToUninstall?.name}</Typography>
                            </Box>
                            {
                                loadingUninstall && (
                                    <Box borderBottom={'1px solid black'} width={'100%'} my={1}>
                                        <CircularProgress color='info' />
                                    </Box>
                                )
                            }
                            <Box px={2} py={1}>
                                <Button onClick={uninstall} variant={'contained'} sx={{ mx: 2 }} color={'primary'}>Uninstall</Button>
                                <Button onClick={() => { setAppToUninstall(null); setUninstLoader(!uninstLoader) }} variant={'contained'} sx={{ mx: 2 }} color={'error'}>CANCEL</Button>
                            </Box>
                        </Box>
                    </Backdrop>
                ): null
            }
            {
                showAppSettings ? (
                    <Backdrop>
                        <Box zIndex={50} width={matches ? matchesMd ? '50%' : '30%' : '90%'} borderRadius={2} bgcolor={'#fff'}>
                            <RowContainerBetween additionStyles={{ p:2, borderBottom: '.5px solid #ccc' }}>
                                <Typography fontWeight={700} fontSize={15} color={'black'}>{selectedApp?.name} Settings</Typography>
                            </RowContainerBetween>
                            <form style={{ padding: '0 10px' }} onSubmit={(e) => { e.preventDefault(); }}>
                                <FormControl sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                                    <input
                                        autoFocus
                                        name="name" placeholder='Enter device name'
                                        value={selectedApp?.name}
                                        required
                                        readOnly
                                        style={{ border: 'none', width: '100%', padding: '6px 0', outline: 'none' }}
                                    />
                                </FormControl>
                                <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Author</Typography>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>{selectedApp?.author.name ? (selectedApp?.author.name) : (selectedApp?.author)}</Typography>
                                </Box>
                                {
                                    selectedApp?.state ? (
                                        <SelectElement
                                            id="restartPolicy"
                                            name='restartPolicy'
                                            value={(selectedApp as App)?.state ? (selectedApp as App)?.state.restartPolicy : ''}
                                            handleChange={updateSettings}
                                            conditions={['no','unless-stopped', 'on-failure', 'always']}
                                            title='Restart Policy'
                                        />
                                    ):null
                                }
                                <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Description</Typography>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>{(selectedApp as App1)?.description as string}</Typography>
                                </Box>
                                <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Version</Typography>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>{selectedApp?.version}</Typography>
                                </Box>
                            </form>
                            <RowContainerBetween additionStyles={{ p: 1,my: 1, borderTop: '.5px solid #ccc' }}>
                                <Box/>
                                <Button onClick={() => { setShowAppSettings(!showAppSettings) }} sx={{ textTransform: 'initial', backgroundColor: '#ff0000' }} variant={'contained'} >CANCEL</Button>
                            </RowContainerBetween>
                        </Box>
                    </Backdrop>
                ) : null
            }
            {
                (modalProps.open && modalProps.title ==='Confirm Installation') ? (
                    <Backdrop>
                        <Box zIndex={50} width={matches ? matchesMd ? '50%' : '30%' : '90%'} borderRadius={1} bgcolor={'#fff'}>
                            <RowContainerBetween additionStyles={{ p:2, borderBottom: '.5px solid #ccc' }}>
                                <Typography fontWeight={700} fontSize={15} color={'black'}>{modalProps.title}</Typography>
                            </RowContainerBetween>
                            <Box height={100} p={2}>
                                <Typography>
                                    {/* Do you wish to install {JSON.stringify(modalProps)}? */}
                                    Do you wish to install {modalProps.otherArgs?modalProps.otherArgs.split('*')[1] :'a new app'}?
                                </Typography>
                            </Box>
                            <RowContainerBetween additionStyles={{ p: 1, borderTop: '.5px solid #ccc' }}>
                                <Button onClick={() => { setModalProps({ open: false, title: '', children: null,otherArgs:undefined }) }} sx={{ textTransform: 'initial', backgroundColor: '#ff0000' }} variant={'contained'} >CANCEL</Button>
                                <Button 
                                    // onClick={() => { setModalProps({ open: false, title: '', children: null }) }} 
                                    onClick={() => {
                                        modalProps.otherArgs ? handleLogsModal(modalProps.otherArgs.split('*')[0], modalProps.otherArgs.split('*')[1]) : handleInstallAppModal() 
                                    }}
                                    sx={{textTransform: 'initial', backgroundColor: '#499dff'}}
                                    variant={'contained'}
                                    >
                                        INSTALL
                                </Button>
                            </RowContainerBetween>
                        </Box>
                    </Backdrop>
                ): null
            }
            <Box px={2} onClick={() => { open ? handleClose() : null }} sx={{ overflowY: 'auto', my: 2, height: '100%' }}>
                <RowContainerBetween>
                    <Box >
                        <Typography fontWeight={700} fontSize={20} color={'black'}>Apps</Typography>
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
                                            <GridItem appUrl={returnAppURL(app)} disabled={app.state ?!app.state.running:true} key={app.id}>
                                                <Box px={.4} display={'flex'} alignItems={'center'} sx={{ position: 'absolute', top: -5, my: -1, }} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                                                    <Box component={'img'} src={LogoSig} />
                                                    <Typography fontSize={15} mx={1} color={'white'} component={'span'}>{app.author.name}</Typography>
                                                </Box>
                                                <Box display={'flex'} py={2} justifyContent={'space-between'}>
                                                    <Box>
                                                        <NormalText title={app.name} />
                                                        <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>{app.id}</Typography>
                                                    </Box>
                                                    <MenuComponent
                                                        open={open}
                                                        menuItems={[
                                                            {
                                                                icon: 'settings',
                                                                text: 'Settings',
                                                                clickHandler: () => { setSelectedApp(app); setShowAppSettings(!showAppSettings) }
                                                            },
                                                            {
                                                                icon: 'delete_forever',
                                                                text: 'Uninstall',
                                                                clickHandler: () => { setAppToUninstallFc(idx) }
                                                            },
                                                            {
                                                                icon: `pause`,
                                                                text: app.state ? app.state.running ? 'Stop' : 'Start' : 'Start',
                                                                clickHandler: () => { startOrStopApp(app.id, app.state ? app.state.running : false) }
                                                            },
                                                        ]}
                                                    />
                                                </Box>
                                                <Typography fontSize={15} fontWeight={100} my={1} color={DEFAULT_COLORS.secondary_black}>Status: <Typography component={'span'} fontSize={15} color={DEFAULT_COLORS.navbar_dark}>{app.state ? app.state.running ? 'Running' : 'Stopped' : 'Running'}</Typography></Typography>
                                                <Typography fontWeight={100} fontSize={14} my={1} color={DEFAULT_COLORS.secondary_black}>{(app as App1).description.length > 40 ? (app as App1).description.slice(0, 39) + '...' : (app as App1).description}</Typography>
                                            </GridItem>
                                        )
                                    }
                                </>
                            )
                        }):(
                            <Box sx={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <SearchOff sx={{fontSize:100,color:'#325460'}}/>
                                <Typography fontSize={20} color={'#325460'}>No Apps Installed</Typography>
                            </Box>
                        )
                    }
                </Grid>
            </Box>
        </>
    );
}
