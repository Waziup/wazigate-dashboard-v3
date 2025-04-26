
import { Alert, Box, Button, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Tooltip, Typography } from '@mui/material';
import RowContainerBetween from '../shared/RowContainerBetween';
import React, { useContext, useEffect, useState } from 'react';
import { cInfo, getAllContainers, getContainerLogs, setContainerAction } from '../../utils/systemapi';
import MenuComponent from '../shared/MenuDropDown';
import { Android12Switch } from '../shared/Switch';
import { capitalizeFirstLetter, lineClamp, removeFirstChar, removeSpecialChars } from '../../utils';
import DockerSVG from '../../assets/docker.svg';
import { DevicesContext } from '../../context/devices.context';
export default function ContainersTabMaintenance() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [containers, setContainers] = React.useState<cInfo[]>([]);
    const [logs, setLogs] = useState<{ success: boolean, logs: string }>({ success: false, logs: '' });
    const [openModal, setOpenModal] = useState(false);
    const { showDialog } = useContext(DevicesContext)
    const open = Boolean(anchorEl);
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);
    const handleClickMenu = (id: string) => {
        handleClose();
        getContainerLogs(id, 10)
            .then((res) => {
                setLogs({
                    success: true,
                    logs: res
                });
                setOpenModal(true)
            }).catch((err) => {
                setLogs({
                    success: false,
                    logs: 'Could not fetch logs ' + err
                });
            })
    };
    const startStopContainer = (containerId: string, action: string) => {
        showDialog({
            title: `${capitalizeFirstLetter(action)}ing container`,
            acceptBtnTitle: action.toUpperCase(),
            content: 'Are you sure you want to ' + action + ' this container?',
            onAccept() {
                setContainerAction(containerId, action)
                    .then((msg) => {
                        setError({
                            message: action+" successful:\n " + msg,
                            severity: 'success'
                        });
                        getAllContainers().then((cInfo) => {
                            setContainers(cInfo);
                        })
                    })
                    .catch((error) => {
                        setError({
                            message: error,
                            severity: 'error'
                        });
                    });
            },
            onCancel() { },
        })
    }
    useEffect(() => {
        getAllContainers().then((res) => {
            setContainers(res);
        });
    }, []);
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={error !==null} autoHideDuration={5000} onClose={()=>setError(null)}>
                <Alert onClose={handleClose} severity={error ? error.severity:'info'} sx={{ width: '100%' }}>
                    {error?error.message as string:''}
                </Alert>
            </Snackbar>
            <Dialog fullWidth open={openModal} onClose={() => { setOpenModal(false); setLogs({ success: false, logs: '' }) }}>
                <DialogTitle>Container Logs</DialogTitle>
                <DialogContent>
                    {
                        logs.success ? (
                            <Box p={1} overflow={'auto'} height={300} bgcolor={'#000'}>
                                <pre style={{ fontSize: 13, color: '#fff', flexWrap: 'wrap', textWrap: 'wrap' }}>
                                    {logs.logs}
                                </pre>
                            </Box>
                        ) : (
                            <Box p={1} overflow={'auto'} height={300} bgcolor={'#fff'}>
                                <pre style={{ fontSize: 18, fontWeight: 900, color: '#ff0000', flexWrap: 'wrap', textWrap: 'wrap' }}>
                                    {logs.logs}
                                </pre>
                            </Box>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenModal(false); setLogs({ success: false, logs: '' }) }} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'} >CANCEL</Button>
                </DialogActions>
            </Dialog>

            <Grid container gap={2} py={2} width='100%'>
                {
                    containers.map((container, id) => (
                        <Grid item key={id} p={2} xs={12} sm={6} md={6} lg={3.6} xl={3.6} sx={{ bgcolor: '#fff', boxShadow: 1, cursor: 'pointer', borderRadius: 2 }}>
                            {/* <Card sx={{ p: 2 }}> */}
                            <CardHeader
                                avatar={<Box component={'img'} src={DockerSVG} width={30} height={30} />}
                                title={container.Names[0] ?
                                    <Tooltip title={container.Names[0]}>
                                        <Typography sx={{ ...lineClamp(1) }} variant='body1'>
                                            {removeFirstChar(removeSpecialChars(container.Names[0]), true)}
                                        </Typography>
                                    </Tooltip> : 'No Name'
                                }
                                sx={{ px: 0, pr: 2, pt: 0 }}
                                subheader={<Typography variant='caption'>{`State: ${container.State}`}</Typography>}
                                action={
                                    <MenuComponent
                                        menuItems={[
                                            {
                                                icon: 'info_outlined',
                                                text: 'Logs',
                                                clickHandler: () => { handleClickMenu(container.Id) }
                                            }
                                        ]}
                                        open={open}
                                    />
                                }
                            />
                            <CardContent sx={{ px: 0 }}>
                                <Box>
                                    <Typography variant='body2' color='#282c35'>
                                        Status: {container.Status}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ width: '100%', px: 0, pr: 2 }}>
                                <RowContainerBetween additionStyles={{ width: '100%' }}>
                                    <Typography fontWeight={100} fontSize={14}>
                                        {
                                            container.State === 'running' ? 'Stop' : 'Start'
                                        }
                                    </Typography>
                                    <Android12Switch
                                        checked={container.State === 'running' ? true : false}
                                        onChange={() => { startStopContainer(container.Id, container.State === 'running' ? 'stop' : 'start') }}
                                        color="secondary"
                                    />
                                </RowContainerBetween>
                            </CardActions>
                            {/* </Card> */}
                        </Grid>
                    ))
                }
            </Grid>

        </>
    )
}
