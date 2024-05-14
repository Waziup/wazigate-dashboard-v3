
import { Box,  Button,  Grid, ListItemText, Tooltip, Typography } from '@mui/material';
import RowContainerBetween from '../shared/RowContainerBetween';
import React, { useEffect, useState } from 'react';
import RowContainerNormal from '../shared/RowContainerNormal';
import { cInfo, getAllContainers, getContainerLogs, setContainerAction } from '../../utils/systemapi';
import MenuComponent from '../shared/MenuDropDown';
import { Android12Switch } from '../shared/Switch';
import { removeFirstChar } from '../../utils';
import Backdrop from '../Backdrop';
interface Props{
    matches?:boolean
}
import DockerSVG from '../../assets/docker.svg';
export default function ContainersTabMaintenance({matches}:Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [containers, setContainers] = React.useState<cInfo[]>([]);
    const [logs,setLogs] = useState<{success:boolean,logs:string}>({success:false,logs:''});
    const [openModal,setOpenModal] = useState(false);
    const open = Boolean(anchorEl);
    const handleClickMenu = (id:string) => {
        handleClose();
        getContainerLogs(id,10)
        .then((res)=>{
            setLogs({
                success:true,
                logs:res
            });
            setOpenModal(true)
        }).catch((err)=>{
            console.log(err);
            setLogs({
                success:false,
                logs:'Error Encountered, could not fetch logs'
            });
        })
    };
    const startStopContainer =(containerId:string,action:string)=>{
        const conFirmed = window.confirm('Are you sure you want to '+action+' this container?');
        if(!conFirmed){
            return;
        }
        setContainerAction(containerId, action)
        .then((msg) => {
            alert('Started successfully: '+msg);
            getAllContainers().then((cInfo) => {
                setContainers(cInfo);
            })
        })
        .catch((error) => {
            alert('Error Encountered'+ error);
            console.log(error);
        });
    }
    useEffect(() => {
        getAllContainers().then((res) => {
            console.log(res);
            setContainers(res);
        });
    },[]);
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {openModal?(
                <Backdrop>
                    <Box sx={{borderRadius:5, width: matches?'50%':'90%',bgcolor:'#fff'}}>
                        <RowContainerBetween additionStyles={{ borderBottom: '1px solid black', px: 2, py: 2 }}>
                            <Typography>Container Logs</Typography>
                            <Button onClick={() =>{setOpenModal(false)}} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'} >cancel</Button>
                            
                        </RowContainerBetween>
                        {
                            logs.success? (
                                <Box maxWidth={'90%'} p={1} overflow={'auto'} width={'90%'} height={200} bgcolor={'#000'}>
                                    <Typography fontSize={10} color={'#fff'}>
                                        {logs.logs}
                                    </Typography>
                                </Box>
                            ):(
                                <Box maxWidth={'90%'} p={1} overflow={'auto'} width={'90%'} height={200} bgcolor={'#fff'}>
                                    <Typography fontSize={18} fontWeight={900} color={'#ff0000'}>
                                        {logs.logs}
                                    </Typography>
                                </Box>
                            )
                        }
                    </Box>
                </Backdrop>
            ):null}
            <Box px={2}>
                <Grid spacing={2} py={2} container>
                    {
                        containers.map((container, id) => (
                            <Grid key={id} lg={3.6} m={1} xl={3.6} md={6} xs={12} sm={6} item sx={{ bgcolor: '#fff', cursor: 'pointer', borderRadius: 2 }}>
                                <RowContainerBetween additionStyles={{ p: .3 }}>
                                    <RowContainerNormal>
                                        <Box component={'img'} src={DockerSVG} width={30} height={30} />
                                        <Box mx={.5}>
                                            <ListItemText
                                                primary={container.Names[0]? 
                                                    <Tooltip title={container.Names[0]}>
                                                        <Typography fontSize={12}>
                                                            {removeFirstChar(container.Names[0].slice(0,10)+'...',true)}
                                                        </Typography>
                                                    </Tooltip>
                                                    :'No Name'}
                                                secondary={<Typography color={'#888'} fontWeight={100} fontSize={10}>{`State ${container.State}`}</Typography>}
                                            />
                                        </Box>
                                    </RowContainerNormal>
                                    <MenuComponent
                                        menuItems={[
                                            {
                                                icon:'info_outlined',
                                                text:'Logs',
                                                clickHandler:()=>{handleClickMenu(container.Id)}
                                            }
                                        ]}
                                        open={open}
                                    />
                                </RowContainerBetween>
                                <Box p={2}>
                                    <Typography fontWeight={100} fontSize={14} color={'#2BBBAD'}>
                                        Status: {container.Status}
                                    </Typography>
                                </Box>
                                <RowContainerBetween>
                                    <Typography fontWeight={100} fontSize={14}>
                                        {
                                            container.State==='running' ? 'Stop' : 'Start'
                                        }
                                    </Typography>
                                    <Android12Switch 
                                        checked={container.State==='running' ? true : false}
                                        onChange={()=>{startStopContainer(container.Id,container.State==='running' ? 'stop' : 'start')}}
                                        color="info" 
                                    />
                                </RowContainerBetween>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </>
    )
}
