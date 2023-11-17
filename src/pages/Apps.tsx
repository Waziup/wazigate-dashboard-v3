import {Box, Button, FormControl,  Grid,  InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Select, TextField, Tooltip, Typography} from '@mui/material';
import { NormalText,  } from './Dashboard';
import RowContainerBetween from '../components/RowContainerBetween';
import { DEFAULT_COLORS } from '../constants';
import { DeleteForever, Download, FiberNew, MoreVert, SettingsTwoTone, } from '@mui/icons-material';
import React,{useState,useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import { type App } from 'waziup';
import Backdrop from '../components/Backdrop';
type App1 =App &{
    description:string
} 
const DropDown = ({handleChange,matches,recommendedApps,customAppInstallHandler,installApp, age}:{installApp:(id:string)=>void, customAppInstallHandler:()=>void, matches:boolean,recommendedApps:RecomendedApp[], handleChange:()=>void,age: string})=>(
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
            {
                recommendedApps.map((app)=>(
                    <MenuItem onClick={()=>installApp(app.id)} key={app.id} value={app.id} sx={{display:'flex',width:'100%', justifyContent:'space-between'}}>
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
export const GridItem=({children}:{children:React.ReactNode})=>(
    <Grid item md={6} lg={4} xl={4}  sm={6} xs={12} minHeight={100} my={1} px={1} >
        <Box minHeight={100} sx={{px:2, py:1, position:'relative', bgcolor: 'white', borderRadius:2, }}>
            {children}
            <Button sx={{fontWeight:'700'}}>OPEN</Button>
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
    const open = Boolean(anchorEl);
    const [modalProps, setModalProps] = useState<{ open: boolean, title: string, children: React.ReactNode }>({ open: false, title: '', children: null });
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [apps, setApps] = useState<App[]>([]);
    const [recommendedApps,setRecommendedApps] = useState<RecomendedApp[]>([])
    const [error, setError] = useState<Error | null | string>(null);
    useEffect(() => {
        window.wazigate.getApps().then(setApps, setError);
        window.wazigate.get<RecomendedApp[]>('apps?available').then((appsr)=>{
            setRecommendedApps(appsr);
        }
        , setError);
    }, []);
    console.log(apps,error);
    function handleInstallAppModal(){
        setModalProps({open:true, title:'Install App', children:<>
            <Box  width={'100%'}  bgcolor={'#fff'}>
                <Box borderBottom={'1px solid black'} px={2} py={2}>
                    <TextField fullWidth id="outlined-basic" required label="Full docker  image name and associated tag(image_name:tag)" variant="outlined" />
                </Box>
                <Box py={2}>
                    <Button variant={'contained'} sx={{mx:2}} color={'primary'}>Install</Button>
                    <Button onClick={closeModal} variant={'contained'} sx={{mx:2}} color={'error'}>Cancel</Button>
                </Box>
            </Box>
        </>});
    }
    function handleLogsModal(id:string){
        console.log(id);
        
        setModalProps({open:true, title:'Installing waizgate-j....', children:<>
            <Box  width={'100%'} bgcolor={'#fff'}>
                <Box borderBottom={'1px solid black'} bgcolor={'black'} width={'100%'} mb={1} height={200} px={2} py={2}>
                </Box>
                <Box  px={2} py={1}>
                    <Button variant={'contained'} sx={{mx:2}} color={'primary'}>DOWNLOAD</Button>
                    <Button onClick={closeModal} variant={'contained'} sx={{mx:2}} color={'error'}>CLOSE</Button>
                </Box>
            </Box>
        </>});
    }
    function closeModal(){
        setModalProps({open:false, title:'', children:null});
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
                        <Box borderBottom={'1px solid black'}  py={2}>
                            {modalProps.children}
                        </Box>
                    </Box>
                </Backdrop>
            }
            
            <Box p={3} sx={{ height:'100%'}}>
                <RowContainerBetween>
                    <Box maxWidth={'50%'}>
                        <Typography fontWeight={700} fontSize={20} color={'black'}>Apps</Typography>
                        <Typography fontSize={matches?15:13} sx={{color:DEFAULT_COLORS.secondary_black}}>Setup your Wazigate Edge Apps</Typography>
                    </Box>
                    <DropDown installApp={handleLogsModal} customAppInstallHandler={handleInstallAppModal} recommendedApps={recommendedApps} matches={matches} handleChange={()=>{}} age={''} />
                </RowContainerBetween>
                <Grid container spacing={2} py={2}>
                    {
                        apps.map((app)=>(
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
                                <Typography fontSize={15} color={DEFAULT_COLORS.secondary_black}>Status: <Typography component={'span'} fontSize={15} color={'red'}>Running</Typography></Typography>
                                <Typography color={DEFAULT_COLORS.secondary_black}>{(app as App1).description}</Typography>
                            
                            </GridItem>
                        ))
                    }
                </Grid>
            </Box>
        </>
    );
}
