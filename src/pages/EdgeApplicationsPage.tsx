import { Alert, Box, Breadcrumbs, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Snackbar, Tooltip, Typography } from '@mui/material';
import RowContainerBetween from '../components/shared/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import { Download, FiberNew, } from '@mui/icons-material';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StartAppConfig, type App } from 'waziup';
import { DevicesContext } from '../context/devices.context';
import CustomApp from '../components/CustomApp';
import { SelectElement } from './devices/DeviceSettings';
import { LoadingButton } from '@mui/lab';
import { lineClamp, returnAppURL } from '../utils';
import TextInputField from '../components/shared/TextInputField';
import MenuComponent from '../components/shared/MenuDropDown';
import Logo from '../assets/wazilogo.svg';
import WaziAppIcon from '../assets/WaziApp.svg';
import CustomEdgeAppIcon from '../assets/CustomApp.svg';
import Logo404 from '../assets/search.svg';
import RowContainerNormal from '../components/shared/RowContainerNormal';
import PrimaryIconButton from '../components/shared/PrimaryIconButton';

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
export const DropDown = ({ handleChange, matches, recommendedApps, customAppInstallHandler, age }: { customAppInstallHandler: () => void, matches: boolean, recommendedApps: RecomendedApp[], handleChange: (e: SelectChangeEvent) => void, age: string }) => (
    <FormControl color='info' size='small' sx={{ p: 0, border: 'none', width: matches ? '25%' : '45%', }}>
        <InputLabel color='info' id="demo-simple-select-helper-label">Install App</InputLabel>
        <Select sx={{ borderColor: '#499dff', width: '100%', py: 0, }}
            labelId="Recommended Apps"
            id="recommeded_apps _selecter"
            onClose={onCloseHandler}
            value={age} label="Install App" onChange={handleChange}>
            <ListSubheader>WaziApps</ListSubheader>
            {
                recommendedApps.map((app) => (
                    <MenuItem key={app.id} value={app.image + "*" + app.id} sx={{ ":hover": { bgcolor: '#D4E3F5' }, display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Box display={'flex'} alignItems={'center'}>
                            <Box component={'img'} sx={{ width: 20, mx: 1, height: 20 }} src={Logo} />
                            <Tooltip color='black' followCursor title={app.description} placement="top-start">
                                <Typography sx={{ fontSize: 14, color: '#325460', ...lineClamp(1) }} >{app.description.slice(0, 30) + '...'}</Typography>
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
                <MenuItem onClick={customAppInstallHandler} value={20} sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
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
interface AppProp {
    children: React.ReactNode
}
export const GridItem = ({ children, }: AppProp) => (
    <Grid item xs={12} sm={5} md={5} lg={4} sx={{ maxWidth: { md: 350, lg: 350, xl: 350 }, minHeight: 100, my: 1, px: 0 }}>
        <Box minHeight={100} sx={{ boxShadow: 1, py: 1, position: 'relative', bgcolor: 'white', borderRadius: 2, }}>
            {children}
        </Box>
    </Grid>
);
type RecomendedApp = {
    description: string,
    id: string,
    image: string,
}
type UpdateStatus = {
    logs: string | null;
    isChecking: boolean;
    hasCheckedUpdates: boolean;
    hasUpdate: boolean;
    newVersion: string | null;
};

export default function EdgeApplicationsPage() {
    const [customAppId, setCustomAppId] = useState<App2>(customAppProps);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loadingUninstall, setLoadingUninstall] = React.useState<boolean>(false);
    const [installAppDialogOpen,setInstallAppDialogOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const open = Boolean(anchorEl)
    const [modalProps, setModalProps] = useState<{ open: boolean, title: string, children: React.ReactNode, otherArgs?: string }>({ open: false, title: '', children: null, otherArgs: '' });
    const handleClose = () => { setAnchorEl(null) };
    const { apps, getApps, showDialog } = useContext(DevicesContext);
    const [recommendedApps, setRecommendedApps] = useState<RecomendedApp[]>([]);
    const [logs, setLogs] = useState<{ logs: string, done: boolean, error?: string }>({ logs: '', done: false, error: undefined });
    const logsRef = React.useRef<string>('');
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    function installAppFunction(image: string, id: string) {
        setAppToInstallId(id);
        window.wazigate.installApp(image).then((res) => {
            logsRef.current = res as unknown as string;
            setLogs({
                done: logsRef.current ? true : false,
                logs: res as unknown as string
            });
            getApps();
            getRecApps()
        }).catch((err) => {
            setError({ message: 'Error: '+(err as string).toString(), severity: 'error' })
            setLogs({
                done: true,
                logs: err,
                error: err as string
            });
            setAppToInstallId('');
            return;
        })
    }
    const getRecApps = async () => {
        window.wazigate.get<RecomendedApp[]>('apps?available')
        .then((appsr) => {
            setRecommendedApps(appsr);
        })
    }
    useEffect(() => {
        if (apps.length === 0) {
            getApps()
        }
        if (recommendedApps.length === 0) {
            getRecApps()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSubmitNewCustomApp = () => {
        showDialog({
            title: "Install app",
            acceptBtnTitle: "INSTALL",
            content: "Are you sure you want to install this app?",
            onAccept: () => {
                handleLogsModal(customAppId.image, customAppId.image.replace("/", ".").split(":")[0]);
            },
            onCancel: () => { }
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
        setModalProps({ ...modalProps, title: 'Install App', children: <></> });
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
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [appToUninstall, setAppToUninstall] = useState<App | null>(null);
    const fetchInstallLogs = useCallback(async (id: string) => {
        await window.wazigate.get(`apps/${id}?install_logs`).then((fetchedLogs) => {
            logsRef.current = (fetchedLogs as { log: string, done: boolean }).log as string;
            if ((fetchedLogs as { log: string, done: boolean }).log !== logs.logs) {
                setLogs({
                    done: (fetchedLogs as { log: string, done: boolean }).done,
                    logs: (fetchedLogs as { log: string, done: boolean }).log as string
                });
            }
        }).catch((err) => {
            setError({ message: 'Error: '+(err as string).toString(), severity: 'error' })
            setLogs({
                done: true,
                logs: '',
                error: err
            });
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const load = () => {
        window.wazigate.getApp(appToUninstall ? appToUninstall.id : '').then(setAppToUninstall, (err) => {
            setError({message: 'Error encountered '+err && err.message ? err.message : err as string,severity:"error"})
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
                setError({ message: 'Installation complete', severity: 'success' })
                setModalProps({ open: false, title: '', children: null, otherArgs: '' });
                setAppToInstallId('');
                getApps();
                getRecApps()
                return;
            }
            return () => clearInterval(intervalId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appToInstallId, fetchInstallLogs, getApps, logs.done, modalProps.open, modalProps.title]);
    useEffect(() => {
        if (modalProps.open && modalProps.title.startsWith('Updating')) {
            fetchInstallLogs(selectedApp?.id ?? '')
            const intervalId = setInterval(async () => {
                await fetchInstallLogs(selectedApp?.id ?? '');
            }, 1500);
            if (logs.done) {
                clearInterval(intervalId);
                setLogs({
                    ...logs,
                    done: false,
                });
                setSelectedApp(null)
                setError({ message: 'Installation complete', severity: 'success' })
                setModalProps({ open: false, title: '', children: null, otherArgs: '' });
                getApps();
                getRecApps()
                return;
            }
            return () => clearInterval(intervalId);
        }
    }, [fetchInstallLogs, modalProps.open, selectedApp?.id, modalProps.title, logs, getApps])
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
                setError({ message: `${appToUninstall?.name} removed successfully`, severity: 'success' })
                setUninstLoader(false);
                load();
                getRecApps()
                setAppToUninstall(null);
                getApps();
            }).catch((err) => {
                setError({message: 'Error encountered '+err && err.message ? err.message : err as string,severity:"error"})
            })
        setAppToUninstall(null);
        setUninstLoader(false);
        getApps();
        getRecApps()
        setLoadingUninstall(false);
    };
    const checkUpdates = (app: App | null) => {
        type AppUpdate = {
            newUpdate: string;
        };
        setSelectedApp(app)
        setUpdateStatus({
            logs: null,
            isChecking: true,
            hasCheckedUpdates: false,
            hasUpdate: false,
            newVersion: null,
        });
        window.wazigate.get<AppUpdate>(`update/${selectedApp?.id}`)
            .then((res) => {
                if (res.newUpdate) {
                    setUpdateStatus((status) => ({
                        logs: status ? status.logs : '',
                        isChecking: false,
                        hasCheckedUpdates: true,
                        hasUpdate: true,
                        newVersion: res.newUpdate,
                    }));
                } else {
                    setUpdateStatus((status) => ({
                        logs: status ? status.logs : '',
                        isChecking: false,
                        hasCheckedUpdates: true,
                        hasUpdate: false,
                        newVersion: null,
                    }));
                    setError({ message: 'The latest version is already installed', severity: 'success' })
                }
            }, (error) => {
                setError({ message: 'Error checking for update:\n ' + error, severity: 'error' });
            }
            );
    };
    function closeModal() {
        setLogs({
            done: false,
            logs: ''
        });
        setModalProps({ open: false, title: '', children: null, otherArgs: '' });
    }
    const handleUpdateApp = () => {
        setModalProps({
            open: true,
            title: 'Updating ' + selectedApp?.name,
            children: <>
                <Box width={'100%'} bgcolor={'#fff'}>

                </Box>
            </>
        });
        window.wazigate.set("update/" + selectedApp?.id, {})
            .then(() => {
                setUpdateStatus({
                    ...updateStatus,
                    isChecking: false,
                    hasUpdate: false,
                    logs: updateStatus?.logs ?? null,
                    hasCheckedUpdates: updateStatus?.hasCheckedUpdates ?? false,
                    newVersion: updateStatus?.newVersion ?? null,
                });
                return;
            })
    }
    const updateSettings = (event: SelectChangeEvent<string>) => {
        setLoading(true);
        window.wazigate.setAppConfig(selectedApp?.id as string, {
            restart: event.target.value as "no" | "always" | "on-failure" | "unless-stopped" | undefined,
            state: 'started'
        })
            .then(() => {
                setError({ message: 'Config set successfully', severity: 'success' })
                setLoading(false);
                getApps();
                setShowAppSettings(!showAppSettings);
            })
            .catch((err) => {
                setLoading(false);
                setError({ message: 'Error encountered '+err, severity: 'warning' })
                setShowAppSettings(!showAppSettings);
            });
    }
    function startOrStopApp(appId: string, running: boolean) {
        showDialog({
            title: (running ? 'Stopping' : 'Starting') + ' ' + appId + '?',
            acceptBtnTitle: running ? 'STOP' : 'START',
            content: 'Are you sure you want to ' + (running ? 'stop' : 'start') + ' ' + appId + '?',
            async onAccept() {
                const config: StartAppConfig = {
                    action: running ? "stop" : "start",
                }
                try {
                    setLoading(true);
                    const rsff = await window.wazigate.startStopApp(appId, config)
                    setError({
                        message: rsff+ " successful",
                        severity: 'success'
                    });
                    getApps();
                } catch (error) {
                    console.log(error)
                    setError({
                        message: `Could not ${running ? 'stop' : 'start'} ${appId}`,
                        severity: 'error'
                    });
                    getApps();
                } finally {
                    setLoading(false);
                }
            },
            onCancel() {

            },
        })
    }
    return (
        <>
            {
                error ? (
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={error !==null} autoHideDuration={3000} onClose={()=>setError(null)}>
                        <Alert onClose={()=>setError(null)} severity={error.severity} sx={{ width: '100%' }}>
                            {error.message as string}
                        </Alert>
                    </Snackbar>
                ) : null
            }
            {
                <Dialog open={loading} sx={{ bgcolor: 'none' }} onClose={() => { }}>
                    <DialogContent sx={{ bgcolor: 'red', background: 'none' }}>
                        <CircularProgress sx={{}} color="info" size={70} />
                    </DialogContent>
                </Dialog>
            }
            <Dialog open={installAppDialogOpen} onClose={()=>setInstallAppDialogOpen(!installAppDialogOpen)}>
                <DialogTitle>Install App</DialogTitle>
                <DialogContent sx={{ borderTop: '1px solid black', overflow: 'auto',  }}>
                    <ListSubheader>WaziApps</ListSubheader>
                    {
                        recommendedApps.map((app) => (
                            <Box onClick={() => { setInstallAppDialogOpen(!installAppDialogOpen); setModalProps({ open: true,  title: 'Confirm Installation', children: <></>, otherArgs: app.image + "*" + app.id }) }} key={app.id} sx={{cursor:'pointer', ":hover": { bgcolor: '#D4E3F5' }, display: 'flex', width: '100%',my:1, py: 1,borderBottom:'1px solid #ccc', justifyContent: 'space-between' }}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <Box component={'img'} sx={{ width: 20, mx: 1, height: 20 }} src={Logo} />
                                    <Tooltip color='black' followCursor title={app.description} placement="top-start">
                                        <Typography sx={{ fontSize: 14, color: '#325460', ...lineClamp(1) }} >{app.description.slice(0, 30) + '...'}</Typography>
                                    </Tooltip>
                                </Box>
                                <Box display={'flex'} alignItems={'center'}>
                                    <Download sx={{ fontSize: 15, mx: 1, color: '#325460' }} />
                                    <Typography sx={{ textTransform: 'uppercase', color: '#325460', fontSize: 11 }}>
                                        Install
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    }
                    <Box  mt={1}>
                        <ListSubheader >Custom App</ListSubheader>
                        <Box onClick ={() => {setInstallAppDialogOpen(!installAppDialogOpen); setModalProps({ open: true, title: 'Confirm Installation', children: <></>, otherArgs: undefined }) }} sx={{cursor:'pointer',":hover": { bgcolor: '#D4E3F5' }, display: 'flex',p:1, width: '100%', justifyContent: 'space-between' }}>
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
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={modalProps.open && modalProps.title.startsWith('Updating')} onClose={closeModal}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{ borderTop: '1px solid black', bgcolor: '#000', overflow: 'auto', height: 250 }}>
                    {
                        logs && (
                            <Box p={2} maxWidth={'100%'} overflow={'auto'} width={'100%'} bgcolor={'#000'}>
                                <pre style={{ fontSize: 13, color: '#fff' }}>
                                    {logs.logs}
                                </pre>
                            </Box>
                        )
                    }
                    {
                        logs.error && (
                            <Box px={2} py={1} bgcolor={'#fec61f'}>
                                <Typography color={'error'}>{logs.error}</Typography>
                            </Box>
                        )
                    }
                </DialogContent>

                <DialogActions>
                    <Button disabled={!logs.done} onClick={() => { setUpdateStatus(null); setSelectedApp(null); setLogs({ done: false, logs: '' }) }} variant={'text'} sx={{ mx: 2, color: '#ff0000' }} color={'info'}>CLOSE</Button>
                    <LoadingButton disabled loading={true} onClick={closeModal} variant={'contained'} sx={{ mx: 2 }} color={'primary'}>CLOSE</LoadingButton>

                </DialogActions>
            </Dialog>
            <Dialog open={modalProps.open && modalProps.title === 'Installing New App'} onClose={closeModal}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{ borderTop: '1px solid black', bgcolor: '#000', overflow: 'auto', height: 250 }}>
                    {
                        logs && (
                            <Box p={2} maxWidth={'100%'} overflow={'auto'} width={'100%'} bgcolor={'#000'}>
                                <pre style={{ fontSize: 13, color: '#fff' }}>
                                    {logs.logs}
                                </pre>
                            </Box>
                        )
                    }
                    {
                        logs.error && (
                            <Box px={2} py={1} bgcolor={'#fec61f'}>
                                <Typography color={'error'}>{logs.error}</Typography>
                            </Box>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button disabled={!logs.done} onClick={closeModal} variant={'text'} sx={{ mx: 2, color: '#ff0000' }} color={'info'}>CLOSE</Button>
                    <LoadingButton disabled loading={true} onClick={closeModal} variant={'contained'} sx={{ mx: 2 }} color={'primary'}>CLOSE</LoadingButton>

                </DialogActions>
            </Dialog>
            <Dialog fullWidth PaperProps={{ component: 'form', onSubmit: (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSubmitNewCustomApp() } }} open={modalProps.open && modalProps.title === 'Install App'} onClose={() => { setCustomAppId(customAppProps); setLogs({ done: false, logs: '' }); closeModal() }} >
                <DialogTitle>{modalProps.title}</DialogTitle>
                <RowContainerBetween additionStyles={{ borderBottom: '1px solid black', p: 0 }} />
                <DialogContent sx={{ my: 0, borderBottom: '1px solid black', }} >
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
                <DialogTitle>Do you wish to uninstall {appToUninstall?.name}?</DialogTitle>
                <DialogContent sx={{ my: 2, }} >
                    <DialogContentText>
                        This app will be uninstalled and removed from the gateway.
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
                    <Button disabled={loadingUninstall} onClick={() => { setAppToUninstall(null); setUninstLoader(!uninstLoader) }} sx={{ mx: 2, color: '#ff0000', }} variant="text" color="warning" >CANCEL</Button>
                    <Button autoFocus disabled={loadingUninstall} onClick={uninstall} sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >UNINSTALL</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={showAppSettings} onClose={() => { setShowAppSettings(!showAppSettings) }}>
                <Box borderRadius={2} bgcolor={'#fff'}>
                    <DialogTitle> {selectedApp?.name} Settings</DialogTitle>
                    <DialogContent>
                        <FormControl sx={{ width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} mb={.4} fontSize={12}>App name</Typography>
                            <input
                                autoFocus
                                name="name"
                                placeholder='Application name'
                                value={selectedApp?.name}
                                required
                                readOnly
                                style={{ background: 'none', border: 'none', width: '100%', padding: '6px 0', outline: 'none' }}
                            />
                        </FormControl>
                        <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Author</Typography>
                            <Typography color={'primary'} my={1} fontSize={12}>{selectedApp?.author.name ? (selectedApp?.author.name) : (selectedApp?.author)}</Typography>
                        </Box>
                        <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>App ID</Typography>
                            <Typography color={'primary'} my={1} fontSize={12}>{selectedApp?.id}</Typography>
                        </Box>
                        <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Current version</Typography>
                            <Typography color={'primary'} my={1} fontSize={12}>
                                {selectedApp?.version}
                                {updateStatus?.hasUpdate ? " (New update available)" : (updateStatus?.hasCheckedUpdates ? " (Latest)" : "")}
                            </Typography>
                        </Box>
                        {
                            selectedApp?.state ? (
                                <>
                                    <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                                        <Typography color={'primary'} my={1} fontSize={12}>Health</Typography>
                                        <Typography color={'primary'} my={1} fontSize={12}>{selectedApp?.state.health ?? 'Unknow'}</Typography>
                                    </Box>
                                    <SelectElement
                                        my={1}
                                        id="restartPolicy"
                                        name='restartPolicy'
                                        value={(selectedApp as App)?.state ? (selectedApp as App)?.state.restartPolicy : ''}
                                        handleChange={updateSettings}
                                        conditions={['no', 'unless-stopped', 'on-failure', 'always']}
                                        title='Restart Policy'
                                    />
                                </>
                            ) : null
                        }
                        <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Description</Typography>
                            <Typography color={'primary'} my={1} fontSize={12}>{(selectedApp as App1)?.description as string}</Typography>
                        </Box>
                        <Box sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F' }}>
                            <Typography color={'primary'} my={1} fontSize={12}>Version</Typography>
                            <Typography color={'primary'} mb={1} fontSize={12}>{selectedApp?.version}</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ mx: 1 }}>
                        <Button onClick={() => { setUpdateStatus(null); setShowAppSettings(!showAppSettings) }} sx={{ textTransform: 'initial', color: '#ff0000' }} color='warning' variant={'text'} >CANCEL</Button>
                        {
                            updateStatus?.hasUpdate ? (
                                <Button autoFocus onClick={handleUpdateApp} sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >Update</Button>
                            ) : updateStatus?.isChecking ? (
                                <LoadingButton disabled loading={true} onClick={closeModal} variant={'contained'} sx={{ mx: 2 }} color={'primary'}>CHECK FOR UPDATES</LoadingButton>
                            ) : (
                                <Button autoFocus onClick={() => checkUpdates(selectedApp)} sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >Check for updates</Button>
                            )
                        }
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={modalProps.open && modalProps.title === 'Confirm Installation'} onClose={() => { setModalProps({ open: false, title: '', children: null, otherArgs: undefined }) }}>
                <DialogTitle>{modalProps.title}</DialogTitle>
                <DialogContent sx={{ my: 2, }} >
                    <DialogContentText>
                        Do you wish to install {modalProps.otherArgs ? modalProps.otherArgs.split('*')[1] : 'a new app'}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setModalProps({ open: false, title: '', children: null, otherArgs: undefined }) }} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'} >CANCEL</Button>
                    <Button autoFocus
                        onClick={() => {
                            modalProps.otherArgs ? handleLogsModal(modalProps.otherArgs.split('*')[0], modalProps.otherArgs.split('*')[1]) : handleInstallAppModal()
                        }}
                        sx={{ textTransform: 'initial', color: '#499dff' }}
                        variant={'text'}
                    >
                        INSTALL
                    </Button>
                </DialogActions>
            </Dialog>
            <Box onClick={() => { open ? handleClose() : null }} sx={{ px: [2, 4], py: [0, 2], overflowY: 'auto', height: '100%' }}>
                <RowContainerBetween>
                    <Box >
                        <Typography variant='h5'>Apps</Typography>
                        <div role="presentation" onClick={() => { }}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography fontSize={16} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                                    <Link style={{ color: 'black', textDecoration: 'none', fontWeight: 300 }} state={{ title: 'Devices' }} color="inherit" to="/">
                                        Home
                                    </Link>
                                </Typography>
                                <p style={{ color: 'black', textDecoration: 'none', fontWeight: 300 }} color="text.primary">Apps</p>
                            </Breadcrumbs>
                        </div>
                    </Box>
                </RowContainerBetween>
                <PrimaryIconButton onClick={()=>setInstallAppDialogOpen(!installAppDialogOpen)} additionStyles={{mt:3}} color="secondary" title="Install App" iconName="add" />
                {/* {
                    matches?(
                        <Typography fontSize={matches ? 15 : 13} sx={{fontSize:matches ? 15 : 13,my:2, color: DEFAULT_COLORS.secondary_black }}>Setup your Wazigate Edge Apps</Typography>
                    ):null
                } */}
                <Grid container mt={2} spacing={2}>
                    {
                        apps.length > 0 ? apps.map((app, idx) => {
                            return ((app as App2).customApp ?
                                <CustomApp
                                    key={app.id}
                                    app={app}
                                />
                                :
                                // working fine
                                <Grid item key={idx} xs={12} sm={6} lg={4} px={0}>
                                    <Box sx={{ boxShadow: 1, height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 1, }}>
                                        <RowContainerBetween additionStyles={{ p: 2, borderBottom: '1px solid #dddddd', py: 1.5, }}>
                                            <RowContainerNormal additionStyles={{ my: 1, gap: 1, flexGrow: 1, cursor: 'pointer' }}>
                                                <Box component={'img'} src={app.author ? WaziAppIcon : CustomEdgeAppIcon} width={35} height={35} mr={1} />
                                                <Box>
                                                    <Typography variant='body1' sx={{ ...lineClamp(1) }} >{app.name}</Typography>
                                                    <Typography variant='body2'>{`Version: ${app.version}`}</Typography>
                                                </Box>
                                            </RowContainerNormal>
                                            <MenuComponent
                                                open={open}
                                                menuItems={[
                                                    app.state && app.state.running ? {
                                                        icon: `stop_circle`,
                                                        text: app.state ? app.state.running ? 'Stop' : 'Start' : 'Start',
                                                        clickHandler: () => { startOrStopApp(app.id, app.state ? app.state.running : false) }
                                                    } : null,
                                                    {
                                                        icon: 'settings',
                                                        text: 'Settings',
                                                        clickHandler: () => { setSelectedApp(app); setShowAppSettings(!showAppSettings) }
                                                    },
                                                    {
                                                        icon: 'delete_forever',
                                                        text: 'Uninstall',
                                                        menuItemAdditionalStyle: { borderTop: '0.1px solid #797979' },
                                                        clickHandler: () => { setAppToUninstallFc(idx) }
                                                    },
                                                ]}
                                            />
                                        </RowContainerBetween>

                                        <Box display='flex' flexDirection='column' justifyContent='space-between' pt={2}>
                                            <Box sx={{ px: 2, height: 80 }}>
                                                <Typography variant='body2'>Status: <Typography component={'span'} fontWeight={600} color={app.state ? app.state.running ? DEFAULT_COLORS.primary_blue : DEFAULT_COLORS.navbar_dark : DEFAULT_COLORS.navbar_dark}>{app.state ? app.state.running ? 'Running' : 'Stopped' : 'Stopped'}</Typography></Typography>
                                                <Typography variant='body2' sx={{ ...lineClamp(2), my: 1 }}>{(app as App1).description}</Typography>
                                            </Box>
                                            <Box sx={{ px: 1 }}>
                                                {
                                                    app.state && app.state.running ? (
                                                        <Link style={{ width: '100%' }} to={returnAppURL(app)} >
                                                            <Button disabled={app.state ? !app.state.running : true} variant='text' color='secondary' fullWidth sx={{ my: 1, bgcolor: '#e8f0fd' }}>OPEN</Button>
                                                        </Link>
                                                    ) : (
                                                        <Button onClick={() => { startOrStopApp(app.id, app.state ? app.state.running : false) }} variant='text' color='secondary' fullWidth sx={{ my: 1, bgcolor: '#e8f0fd' }}>START APP</Button>
                                                    )
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>

                            )
                        }) : (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Logo404} style={{ filter: 'invert(80%) sepia(0%) saturate(0%) brightness(85%)', width: 140, height: 140 }} alt="Search Icon" />
                                <Typography fontSize={20} color={'#325460'}>No Apps Installed</Typography>
                            </Box>
                        )
                    }

                    {/* test section */}

                    {/* test section  */}
                </Grid>
            </Box>
        </>
    );
}
