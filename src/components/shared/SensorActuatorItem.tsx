import { Box, Grid, Typography,  } from '@mui/material';
import RowContainerBetween from './RowContainerBetween';
import SVGIcon from './SVGIcon'
import { useNavigate, useOutletContext } from 'react-router-dom'
import ontologiesicons from '../../assets/ontologies.svg';
import { Sensor,Actuator } from 'waziup';
import ontologies from '../../assets/ontologies.json';
import MenuComponent from './MenuDropDown';
import { removeSpecialChars, time_ago } from '../../utils';
import { DEFAULT_COLORS } from '../../constants';
interface SensorActuatorItemProps {
    sensActuator: Sensor | Actuator;
    open:boolean,
    anchorEl:HTMLElement | null,
    handleClose:()=>void
    handleClickMenu?:(event: React.MouseEvent<HTMLButtonElement>)=>void,
    children?:React.ReactNode
    deviceId:string
    kind:string
    icon:string
    modified: Date,
    type: "actuator" | "sensor",
    callbackFc?:()=>void,
}
const isActuator = (kind:string): boolean => {
    return Object.keys(ontologies.actingDevices).includes(kind);
}
export default function SensorActuatorItem({kind, icon, callbackFc,type, modified, sensActuator: sens,handleClose,open,children,deviceId}: SensorActuatorItemProps) {
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const navigate = useNavigate();
    const handleDelete = () => {
        const cf = confirm(`Are you sure you want to delete ${sens.name}?`);
        if (!cf) return;
        if(type === 'actuator'){
            window.wazigate.deleteActuator(deviceId, sens.id).then(() => {
                handleClose();
                callbackFc &&callbackFc();
            }).catch((err) => {
                console.log(err);
            })
            return;
        }
        window.wazigate.deleteSensor(deviceId, sens.id).then(() => {
            handleClose();
            callbackFc &&callbackFc();
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <Grid lg={3} my={1} xl={3} md={4} xs={5.5} sm={6}  item sx={{boxShadow:3, bgcolor: '#fff',cursor:'pointer', mx: matches?2:.8, borderRadius: 2 }}>
            <RowContainerBetween additionStyles={{px:matches?1:0}}>
                <Box onClick={()=>{navigate(`/devices/${deviceId}/${isActuator(kind)?'actuators':'sensors'}/${sens.id}`)}} >
                    <Typography sx={{fontSize:15,fontWeight:'600'}}>{removeSpecialChars(sens? sens.name:'')}</Typography>
                    <Typography color={DEFAULT_COLORS.secondary_black} fontSize={matches?12:10} fontWeight={300}>
                        {time_ago(modified).toString()}
                    </Typography>
                </Box>
                <MenuComponent
                    open={open}
                    menuItems={[
                        {
                            icon: 'delete',
                            text: 'Delete',
                            clickHandler: handleDelete
                        },
                        {
                            icon: 'settings',
                            text: 'Settings',
                            clickHandler: ()=>{navigate(`/devices/${deviceId}/${isActuator(kind)?'actuators':'sensors'}/${sens.id}/settings`);}
                        }
                    ]}
                />
            </RowContainerBetween>
            <Box sx={{display:'flex',alignItems:'center',mb:.5}} onClick={()=>{navigate(`/devices/${deviceId}/${isActuator(kind)?'actuators':'sensors'}/${sens.id}`)}}>
                <SVGIcon
                    style={{ width: 35, height: 35, marginRight: 5 }}
                    src={`${ontologiesicons}#${
                        icon ?
                        icon:
                            type==='actuator'?ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices].icon:ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices].icon}`}
                />
                {children}
            </Box>
        </Grid>
    )
}
