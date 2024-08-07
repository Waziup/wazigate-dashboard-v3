import { Box, Grid, Typography,  } from '@mui/material';
import RowContainerBetween from './RowContainerBetween'
import RowContainerNormal from './RowContainerNormal'
import SVGIcon from './SVGIcon'
import { useNavigate, useOutletContext } from 'react-router-dom'
import ontologiesicons from '../../assets/ontologies.svg';
import { Sensor,Actuator } from 'waziup';
import ontologies from '../../assets/ontologies.json';
import MenuComponent from './MenuDropDown';
import { removeSpecialChars } from '../../utils';
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
    type: "actuator" | "sensor",
    callbackFc?:()=>void,
}
const isActuator = (kind:string): boolean => {
    return Object.keys(ontologies.actingDevices).includes(kind);
}
export default function SensorActuatorItem({kind, icon, callbackFc,type, sensActuator: sens,handleClose,open,children,deviceId}: SensorActuatorItemProps) {
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
        <Grid lg={3} my={1} xl={3} md={4} xs={5.2} sm={5.2}  item sx={{ bgcolor: '#fff',cursor:'pointer', mx: matches?2:1, borderRadius: 2 }}>
            <RowContainerBetween additionStyles={{px:matches?1:.3}}>
                <RowContainerNormal onClick={()=>{navigate(`/devices/${deviceId}/${isActuator(kind)?'actuators':'sensors'}/${sens.id}`)}} >
                    <SVGIcon
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        src={`${ontologiesicons}#${
                            icon ?
                            icon:
                                type==='actuator'?ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices].icon:ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices].icon}`}
                    />
                    <Typography sx={{fontSize:15,fontWeight:'600'}}>{removeSpecialChars(sens? sens.name:'')}</Typography>
                </RowContainerNormal>
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
            <Box onClick={()=>{navigate(`/devices/${deviceId}/${isActuator(kind)?'actuators':'sensors'}/${sens.id}`)}}>
                {children}
            </Box>
        </Grid>
    )
}
