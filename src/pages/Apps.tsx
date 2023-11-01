import {Box, Button, FormControl,  Grid,  InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Select, Typography} from '@mui/material';
import { NormalText,  } from './Dashboard';
import RowContainerBetween from '../components/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import { DeleteForever, Download, FiberNew, MoreVert, SettingsTwoTone, Terminal } from '@mui/icons-material';
import React from 'react';
import { useOutletContext } from 'react-router-dom';
const DropDown = ({handleChange,matches, age}:{matches:boolean, handleChange:()=>void,age: string})=>(
    <FormControl sx={{p:0, border:'none', width: matches?'35%':'45%', }}>
        <InputLabel id="demo-simple-select-helper-label">Install App</InputLabel>
        <Select sx={{width:'100%',py:0,}} labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper" onClose={()=>{
                setTimeout(() => {
                    if (document?.activeElement) {
                        (document.activeElement as HTMLElement).blur();
                    }
                }, 0);
            }} value={age} label="Age" onChange={handleChange}>
            <MenuItem value={10} sx={{display:'flex',width:'100%', justifyContent:'space-between'}}>
                <Box display={'flex'} alignItems={'center'}>
                    <Box component={'img'} sx={{width:20,mx:1, height:20}} src='/wazilogo.svg' />
                    <Typography color={'#325460'} fontSize={15}>Wazigate System</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'}>
                    <Download sx={{fontSize:20,mx:1,color:'#325460'}} />
                    <Typography sx={{textTransform:'uppercase', color:'#325460', fontSize:15}}>
                        Install
                    </Typography>
                </Box>
            </MenuItem>
            <MenuItem value={20} sx={{display:'flex',py:1,width:'100%', justifyContent:'space-between'}}>
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
const GridItem=({children}:{children:React.ReactNode})=>(
    <Grid item md={6} lg={4} xl={4} sm={6} xs={12} minHeight={100} my={1} px={1} >
        <Box minHeight={100} sx={{px:2, py:1, position:'relative', bgcolor: 'white', borderRadius:2, }}>
            {children}
            <Button sx={{fontWeight:'700'}}>OPEN</Button>
        </Box>
    </Grid>
)
function Apps() {
    const [matches] = useOutletContext<[matches: boolean]>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Box maxWidth={'50%'}>
                    <Typography fontWeight={700} fontSize={20} color={'black'}>Devices</Typography>
                    <Typography fontSize={matches?15:13} sx={{color:DEFAULT_COLORS.secondary_black}}>Setup your Wazigate Edge Apps</Typography>
                </Box>
                <DropDown matches={matches} handleChange={()=>{}} age={''} />
            </RowContainerBetween>
            <Grid container spacing={2} py={2}>
                <GridItem>
                    <Box px={.4} display={'flex'} alignItems={'center'} sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                        <Box component={'img'} src='/wazi_sig.svg' />
                        <Typography  mx={1} color={'white'} component={'span'}>Waziup App</Typography>
                    </Box>
                    <Box display={'flex'} py={2}  justifyContent={'space-between'}>
                        <Box>
                            <NormalText title="Waziup App" />
                            <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>wazigate-edge</Typography>
                        </Box>
                        <Box>
                            <Button id="demo-positioned-button"
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                >
                                <MoreVert sx={{color:'black'}}/>
                            </Button>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <SettingsTwoTone fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Settings</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <DeleteForever fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Uninstall</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                    <Typography color={DEFAULT_COLORS.secondary_black}>Status: <span color='red'>Running</span></Typography>
                    <Typography color={DEFAULT_COLORS.secondary_black}>Waziup firmware for Edge Computing</Typography>
                   
                </GridItem>
                <GridItem>
                    <Box px={.4} display={'flex'} alignItems={'center'} sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.orange}>
                        <Terminal />
                        <Typography  mx={1} color={'white'} component={'span'}>Custom App</Typography>
                    </Box>
                    <Box display={'flex'} py={2}  justifyContent={'space-between'}>
                        <Box>
                            <NormalText title="Waziup App" />
                            <Typography color={DEFAULT_COLORS.secondary_black} fontWeight={300}>wazigate-edge</Typography>
                        </Box>
                        <MoreVert sx={{color:'black'}}/>
                    </Box>
                    <Typography color={DEFAULT_COLORS.secondary_black}>Status: <span color='red'>Running</span></Typography>
                    <Typography color={DEFAULT_COLORS.secondary_black}>Waziup firmware for Edge Computing</Typography>
                    
                </GridItem>
            </Grid>
        </Box>
    );
}

export default Apps;