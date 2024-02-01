import { MoreVert, InfoOutlined } from '@mui/icons-material';
import { Box, Button, Grid, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import RowContainerBetween from '../shared/RowContainerBetween';
import React from 'react';
import { Android12Switch } from '../shared/Switch';
import RowContainerNormal from '../shared/RowContainerNormal';
interface Props{
    matches?:boolean
}
export default function ContainersTabMaintenance({matches}:Props) {
    console.log(matches);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Box p={3}>
                <Grid container>
                    <Grid lg={3.5} my={1} xl={4} md={4} xs={5.5} sm={3.5}  item sx={{ bgcolor: '#fff',cursor:'pointer', mx: matches?2:1, borderRadius: 2 }}>
                        <RowContainerBetween additionStyles={{p:matches?1:.3}}>
                            <RowContainerNormal>
                                <Box component={'img'} src={'/docker.svg'} width={30} height={30} />
                                <Box mx={.5}>
                                    <Typography fontSize={12}>Waziup.wazigate-system</Typography>
                                    <Typography fontSize={10} color={'#666'}>Up 20 mins ago</Typography>
                                </Box>
                            </RowContainerNormal>
                            <Button
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClickMenu}
                            >
                                <MoreVert sx={{fontSize:16,cursor:'pointer'}} />
                            </Button>
                            <Menu id="sensor-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}} >
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <InfoOutlined fontSize="small" />
                                    </ListItemIcon>
                                    <Typography variant="inherit">Info</Typography>
                                </MenuItem>
                            </Menu>
                        </RowContainerBetween>
                        <Box p={2}>
                            <Typography fontWeight={100} fontSize={15} color={'#2BBBAD'}>
                                Status: 
                                <Typography component={'span'} fontSize={15} fontWeight={300} color={'#ff0000'}>{'   Stopped'}</Typography>
                            </Typography>
                            <RowContainerBetween>
                                <Typography fontWeight={100} color={'rgba(0,0,0,.7)'} fontSize={15}>{'Start'}</Typography>
                                <Android12Switch checked={false} onChange={() => { }} color='info' />
                            </RowContainerBetween>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
