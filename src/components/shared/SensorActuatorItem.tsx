import { Grid, Typography,  } from '@mui/material';
import RowContainerBetween from './RowContainerBetween'
import RowContainerNormal from './RowContainerNormal'
import SVGIcon from './SVGIcon'
import { useNavigate, useOutletContext } from 'react-router-dom'
import ontologiesicons from '../../assets/ontologies.svg';
import { Sensor,Actuator } from 'waziup';
import ontologies from '../../assets/ontologies.json';
import MenuComponent from './MenuDropDown';
interface SensorActuatorItemProps {
    sensActuator: Sensor | Actuator;
    open:boolean,
    anchorEl:HTMLElement | null,
    handleClose:()=>void
    handleClickMenu?:(event: React.MouseEvent<HTMLButtonElement>)=>void,
    children?:React.ReactNode
    deviceId:string
}
const isActuator = (sensActuator: Sensor | Actuator): sensActuator is Actuator => {
    return Object.keys(ontologies.actingDevices).includes(sensActuator.meta.kind);
}
export default function SensorActuatorItem({ sensActuator: sens,handleClose,open,children,deviceId}: SensorActuatorItemProps) {
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const navigate = useNavigate();
    return (
        <Grid lg={3} my={1} xl={3} md={4} xs={5.5} sm={5.5} onClick={()=>{navigate(`/devices/${deviceId}/${isActuator(sens)?'actuators':'sensors'}/${sens.id}`)}}  item sx={{ bgcolor: '#fff',cursor:'pointer', mx: matches?2:1, borderRadius: 2 }}>
            <RowContainerBetween additionStyles={{px:matches?1:.3}}>
                <RowContainerNormal>
                    <SVGIcon
                        src={`${ontologiesicons}#${sens.meta.icon}`}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    <Typography fontSize={12}>{sens.name}</Typography>
                </RowContainerNormal>
                <MenuComponent
                    open={open}
                    menuItems={[
                        {
                            icon: 'delete',
                            text: 'Delete',
                            clickHandler: handleClose
                        },
                        {
                            icon: 'settings',
                            text: 'Settings',
                            clickHandler: handleClose
                        }
                    ]}
                />
            </RowContainerBetween>
            {children}
        </Grid>
    )
}
