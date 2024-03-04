import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, ListItemIcon, Menu, MenuItem, Select, SelectChangeEvent, TextField, Tooltip, Typography } from '@mui/material';
import { NormalText, } from './Dashboard';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import { DeleteForever, Download, FiberNew, MoreVert, Settings, } from '@mui/icons-material';
import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StartAppConfig, type App } from 'waziup';
import Backdrop from '../components/Backdrop';
import { DevicesContext } from '../context/devices.context';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CustomApp from '../components/CustomApp';
import { SelectElement } from './DeviceSettings';
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
const DropDown = ({ handleChange, matches, recommendedApps, customAppInstallHandler, age }: { customAppInstallHandler: () => void, matches: boolean, recommendedApps: RecomendedApp[], handleChange: (e: SelectChangeEvent) => void, age: string }) => (
    <FormControl sx={{ p: 0, border: 'none', width: matches ? '35%' : '45%', }}>
        <InputLabel id="demo-simple-select-helper-label">Install App</InputLabel>
        <Select sx={{ width: '100%', py: 0, }}
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            onClose={onCloseHandler}
            value={age} label="Age" onChange={handleChange}>
            {
                recommendedApps.map((app) => (
                    <MenuItem key={app.id} value={app.image + "*" + app.id} sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Box display={'flex'} alignItems={'center'}>
                            <Box component={'img'} sx={{ width: 20, mx: 1, height: 20 }} src='/wazilogo.svg' />
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
        <Box minHeight={100} sx={{ px: 2, py: 1, position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
            {children}
            <Button href={appUrl?appUrl:''} disabled={disabled} sx={{ fontWeight: '500', bgcolor: '#F4F7F6', my: 1, color: 'info.main', width: '100%' }}>OPEN</Button>
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
    const open = Boolean(anchorEl)
    const [modalProps, setModalProps] = useState<{ open: boolean, title: string, children: React.ReactNode }>({ open: false, title: '', children: null });
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { apps, addApp, getApps } = useContext(DevicesContext);
    const [recommendedApps, setRecommendedApps] = useState<RecomendedApp[]>([]);
    const [logs, setLogs] = useState<{ logs: string, done: boolean }>({ logs: '', done: false });
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
                logs: err as string
            });
            return;
        })
    }
    useEffect(() => {
        if(apps.length ===0){
            getApps()
        }
        window.wazigate.get<RecomendedApp[]>('apps?available')
            .then((appsr) => {
                setRecommendedApps(appsr);
            })
            .catch(setError)
    }, [apps, getApps]);
    const handleSubmitNewCustomApp = () => {
        const yesNo = confirm('Are you sure you want to install this app?');
        if (!yesNo) {
            return;
        }
        addApp(customAppId as unknown as App);
    }
    const [appToInstallId, setAppToInstallId] = useState<string>('');
    const handleCustomAppIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAppId({
            ...customAppId,
            [e.target.name]: e.target.value
        }) as unknown as App2;
    }
    function handleInstallAppModal() {
        setModalProps({ open: true, title: 'Install App', children: <></> });
    }

    function handleLogsModal(image: string, id: string) {
        setAppToInstallId(id);
        setModalProps({
            open: true, title: 'Installing New App', children: <>
                <Box width={'100%'} bgcolor={'#fff'}>
                    <Box px={2} py={1}>
                        <Button onClick={closeModal} variant={'contained'} sx={{ mx: 2 }} color={'error'}>CLOSE</Button>
                    </Box>
                </Box>
            </>
        });
        installAppFunction(image, id);
    }
    const handleChangeLogsModal = (e: SelectChangeEvent) => {
        if (parseInt(e.target.value) === 20) {
            handleInstallAppModal();
            return;
        }
        const [image, id] = e.target.value.split('*');
        handleLogsModal(image, id);
    }
    const [uninstLoader, setUninstLoader] = useState<boolean>(false);
    const [showAppSettings, setShowAppSettings] = useState<boolean>(false);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [appToUninstall, setAppToUninstall] = useState<App | null>(null);
    async function fetchInstallLogs(id: string) {

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
                logs: 'Error encountered while fetching logs: ' + err
            });
        })
    }
    const load = () => {
        window.wazigate.getApp(appToUninstall ? appToUninstall.id : '').then(setAppToUninstall, (error) => {
            alert("There was an error loading the app info:\n" + error);
        });
    };
    useEffect(() => {
        if (modalProps.open && modalProps.title === 'Installing New App') {
            fetchInstallLogs(appToInstallId);
            const intervalId = setInterval(async () => {
                await fetchInstallLogs(appToInstallId);
            }, 1000); // Adjust the interval duration (in milliseconds) as needed
            // Clean up the interval on component unmount
            if (logs.done) {
                clearInterval(intervalId);
                setLogs({
                    done: false,
                    logs: ''
                });
                setModalProps({ open: false, title: '', children: null });
                getApps();
                return;
            }
            return () => clearInterval(intervalId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalProps.open && modalProps.title === 'Installing New App']);
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
                setAppToUninstall(null);
                getApps();
            }).catch(() => {
                setLoadingUninstall(false);
            })
    };
    function closeModal() {
        setLogs({
            done: false,
            logs: ''
        });
        setModalProps({ open: false, title: '', children: null });
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
        window.wazigate.startStopApp(appId, config)
            .then(() => {
                getApps();
            }).catch(() => {
                getApps()
            })

    }
    if (error) {
        return <div>Error: {(error as Error).message ? (error as Error).message : (error as string)}</div>;
    }
    return (
        <>
            {
                modalProps.open && modalProps.title === 'Installing New App' && (
                    <Backdrop>
                        <Box width={matches ? '40%' : '90%'} bgcolor={'#fff'}>
                            <Box borderBottom={'1px solid black'} px={2} py={2}>
                                <Typography>{modalProps.title}</Typography>
                            </Box>
                            {
                                logs && (
                                    <Box maxWidth={'100%'} overflow={'auto'} width={'100%'} height={200} bgcolor={'#000'}>
                                        <Typography fontSize={10} color={'#fff'}>
                                            {logs.logs}
                                        </Typography>
                                    </Box>
                                )
                            }
                            <Box borderBottom={'1px solid black'} py={2}>
                                {modalProps.children}
                            </Box>
                        </Box>
                    </Backdrop>
                )
            }
            {
                (modalProps.open && modalProps.title === 'Install App') ? (
                    <Backdrop>
                        <Box width={matches ? '40%' : '90%'} bgcolor={'#fff'}>
                            <RowContainerBetween additionStyles={{ borderBottom: '1px solid black', p: 2 }}>
                                <Typography>{modalProps.title}</Typography>
                                <Button onClick={() => { setCustomAppId(customAppProps); setLogs({ done: false, logs: '' }); closeModal() }} variant={'contained'} sx={{ mx: 2 }} color={'error'}>Cancel</Button>
                            </RowContainerBetween>

                            <Box borderBottom={'1px solid black'} py={2}></Box>
                            <Box width={'90%'} bgcolor={'#fff'}>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmitNewCustomApp() }}>
                                    <Box borderBottom={'1px solid black'} px={2} >
                                        <TextField
                                            id="name"
                                            name='name'
                                            onChange={handleCustomAppIdChange}
                                            required
                                            variant="standard"
                                            value={customAppId.name}
                                        />
                                        <TextField
                                            id="image"
                                            onChange={handleCustomAppIdChange}
                                            name="image"
                                            required
                                            variant="standard"
                                            value={customAppId.image}
                                            placeholder="Docker Image: format(owner/image_name:tag)"
                                        />
                                        <TextField
                                            id="author"
                                            onChange={handleCustomAppIdChange}
                                            name="author"
                                            required
                                            value={customAppId.author}
                                            placeholder="Author of app"
                                        />
                                        <TextField
                                            id="description"
                                            onChange={handleCustomAppIdChange}
                                            name="description"
                                            required
                                            value={customAppId.description}
                                            placeholder="Description of app"
                                        />
                                    </Box>
                                    <RowContainerBetween additionStyles={{ py: 2 }}>
                                        <Box></Box>
                                        <Button onClick={() => { setCustomAppId(customAppProps); setLogs({ done: false, logs: '' }); closeModal() }} variant={'contained'} sx={{ mx: 2 }} color={'error'}>Cancel</Button>
                                    </RowContainerBetween>
                                </form>
                            </Box>
                        </Box>
                    </Backdrop>
                ) : null
            }
            {
                uninstLoader && (
                    <Backdrop>
                        <Box width={matches ? '40%' : '90%'} bgcolor={'#fff'}>
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
                                <Button onClick={() => { setAppToUninstall(null); setUninstLoader(!uninstLoader) }} variant={'contained'} sx={{ mx: 2 }} color={'error'}>Cancel</Button>
                            </Box>
                        </Box>
                    </Backdrop>
                )
            }
            {
                showAppSettings ? (
                    <Backdrop>
                        <Box zIndex={50} width={matches ? matchesMd ? '50%' : '30%' : '90%'} borderRadius={2} bgcolor={'#fff'}>
                            <RowContainerBetween additionStyles={{ p: 1, borderBottom: '.5px solid #ccc' }}>
                                <Typography fontWeight={700} fontSize={15} color={'black'}>{selectedApp?.name} Settings</Typography>
                                <Button onClick={() => { setShowAppSettings(!showAppSettings) }} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'} >cancel</Button>
                            </RowContainerBetween>
                            <form style={{ padding: '0 10px' }} onSubmit={(e) => { e.preventDefault(); }}>
                                <FormControl sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                                    <input
                                        autoFocus
                                        name="name" placeholder='Enter device name'
                                        value={selectedApp?.name}
                                        required
                                        style={{ border: 'none', width: '100%', padding: '6px 0', outline: 'none' }}
                                    />
                                </FormControl>
                                <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Author</Typography>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>{selectedApp?.author.name ? (selectedApp?.author.name) : (selectedApp?.author)}</Typography>
                                </Box>
                                <SelectElement
                                    id="restartPolicy"
                                    name='restartPolicy'
                                    value={(selectedApp as App)?.state ? (selectedApp as App)?.state.restartPolicy : ''}
                                    handleChange={() => { }}
                                    conditions={['no', 'on-failure', 'always']}
                                    title='Restart Policy'
                                />
                                <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Description</Typography>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>{(selectedApp as App1)?.description as string}</Typography>
                                </Box>
                                <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>Version</Typography>
                                    <Typography color={'primary'} mb={.4} fontSize={12}>{selectedApp?.version}</Typography>
                                </Box>
                            </form>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'space-evenly'} px={2} py={1}>
                                <Button onClick={() => { setShowAppSettings(!showAppSettings) }} variant={'contained'} sx={{ mx: 2, color: '#fff' }} color={'info'}>Uninstall</Button>
                                <Button onClick={() => { setShowAppSettings(!showAppSettings) }} variant={'contained'} sx={{ mx: 2 }} color={'info'}>START</Button>
                            </Box>
                        </Box>
                    </Backdrop>
                ) : null
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
                        customAppInstallHandler={handleInstallAppModal}
                        recommendedApps={recommendedApps}
                        matches={matches}
                        handleChange={handleChangeLogsModal} age={''}
                    />
                </RowContainerBetween>
                <Grid container spacing={2} py={2}>
                    {
                        apps.map((app, idx) => {
                            return (
                                <>
                                    {
                                        (app as App2).customApp ? (
                                            <CustomApp
                                                key={app.id}
                                                app={app}
                                            />
                                        ) : (

                                            <GridItem appUrl={(Object.values(app.waziapp.menu? app.waziapp?.menu:{df:{href:''}})[0]).href} disabled={app.state ?app.state.running:true} key={app.id}>
                                                <Box px={.4} display={'flex'} alignItems={'center'} sx={{ position: 'absolute', top: -5, my: -1, }} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                                                    <Box component={'img'} src='/wazi_sig.svg' />
                                                    <Typography fontSize={15} mx={1} color={'white'} component={'span'}>{app.author.name}</Typography>
                                                </Box>
                                                <Box display={'flex'} py={2} justifyContent={'space-between'}>
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
                                                                        {...bindTrigger(popupState)}
                                                                    >
                                                                        <MoreVert sx={{ color: 'black' }} />
                                                                    </Button>

                                                                    <Menu {...bindMenu(popupState)}>
                                                                        <MenuItem onClick={() => { setSelectedApp(app); setShowAppSettings(!showAppSettings); popupState.close; }} value={app.id} >
                                                                            <ListItemIcon>
                                                                                <Settings fontSize="small" />
                                                                            </ListItemIcon>
                                                                            Settings
                                                                        </MenuItem>
                                                                        <MenuItem value={idx} onClick={() => { setAppToUninstallFc(idx); popupState.close }}>
                                                                            <ListItemIcon>
                                                                                <DeleteForever fontSize="small" />
                                                                            </ListItemIcon>
                                                                            Uninstall
                                                                        </MenuItem>
                                                                        
                                                                        <MenuItem value={idx} onClick={() => { startOrStopApp(app.id, app.state ?app.state.running:false); popupState.close }}>
                                                                            <ListItemIcon>
                                                                                <DeleteForever fontSize="small" />
                                                                            </ListItemIcon>
                                                                            {app.state ? app.state.running ? 'Stop' : 'Start' : 'Start'}
                                                                        </MenuItem>
                                                                    </Menu>
                                                                </React.Fragment>
                                                            )}
                                                        </PopupState>
                                                    </Box>
                                                </Box>
                                                <Typography fontSize={15} fontWeight={200} my={1} color={DEFAULT_COLORS.navbar_dark}>Status: <Typography component={'span'} fontSize={15} color={DEFAULT_COLORS.navbar_dark}>{app.state ? app.state.running ? 'Running' : 'Stopped' : 'Running'}</Typography></Typography>
                                                <Typography fontSize={14} my={1} color={DEFAULT_COLORS.secondary_black}>{(app as App1).description.length > 40 ? (app as App1).description.slice(0, 39) + '...' : (app as App1).description}</Typography>
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
