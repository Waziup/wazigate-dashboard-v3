
import { Backdrop, Box,  Button,  Grid, Typography } from '@mui/material';
import RowContainerBetween from '../shared/RowContainerBetween';
import React, { useEffect, useState } from 'react';
import RowContainerNormal from '../shared/RowContainerNormal';
import { cInfo, getAllContainers, getContainerLogs } from '../../utils/systemapi';
import MenuComponent from '../shared/MenuDropDown';
interface Props{
    matches?:boolean
}
export default function ContainersTabMaintenance({matches}:Props) {
    console.log(matches);
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
            <Backdrop open={openModal}>
                <Box sx={{width: matches?'40%':'90%',zIndex:99,bgcolor:'#fff'}}>
                    <RowContainerBetween additionStyles={{ borderBottom: '1px solid black', px: 2, py: 2 }}>
                        <Typography>Container Logs</Typography>
                        <Button onClick={() =>{setOpenModal(false)}} sx={{ textTransform: 'initial', color: '#ff0000' }} variant={'text'} >cancel</Button>
                        
                    </RowContainerBetween>
                    {
                        logs.success? (
                            <Box maxWidth={'90%'} overflow={'auto'} width={'90%'} height={200} bgcolor={'#000'}>
                                <Typography fontSize={10} color={'#fff'}>
                                    {logs.logs}
                                </Typography>
                            </Box>
                        ):(
                            <Box maxWidth={'90%'} overflow={'auto'} width={'90%'} height={200} bgcolor={'#fff'}>
                                <Typography fontSize={18} fontWeight={900} color={'#ff0000'}>
                                    {logs.logs}
                                </Typography>
                            </Box>
                        )
                    }
                </Box>
            </Backdrop>
            <Box px={2}>
                <Grid spacing={2} py={2} container>
                    {
                        containers.map((container, id) => (
                            <Grid key={id} lg={4} my={1} xl={4} md={6} xs={12} sm={6} item sx={{ bgcolor: '#fff', cursor: 'pointer', borderRadius: 2 }}>
                                <RowContainerBetween additionStyles={{ p: matches ? 1 : .3 }}>
                                    <RowContainerNormal>
                                        <Box component={'img'} src={'/docker.svg'} width={30} height={30} />
                                        <Box mx={.5}>
                                            <Typography fontSize={12}>{container.Names[0]}</Typography>
                                            <Typography fontSize={10} color={'#666'}>{container.State}</Typography>
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
                                    <Typography fontWeight={100} fontSize={15} color={'#2BBBAD'}>
                                        Status: {container.Status}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </>
    )
}
