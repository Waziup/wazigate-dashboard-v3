import { Box, Typography } from "@mui/material";
import RowContainerBetween from "./RowContainerBetween";
import SVGIcon from "./SVGIcon";
import ontologies from '../../assets/ontologies.json';
import ontologiesicons from '../../assets/ontologies.svg';
export default function SensorActuatorInfo({type, text, name,kind, onClick, iconname }: {kind:string, type:'sensor'|'actuator', text: string | number, name: string, onClick: () => void, iconname: string }) {
    return (
        <RowContainerBetween onClick={onClick} additionStyles={{ my: 2, py: 1, px: .5, ":hover": { bgcolor: '#f5f5f5' } }}>
            <Box sx={{ display: 'flex', width: '50%' }}>
                <SVGIcon 
                    style={{ width: 18, height: 18, marginRight: 5 }}
                    src={`${ontologiesicons}#${iconname?iconname:type==='actuator'?ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices].icon:ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices].icon}`}
                />
                <Typography color={'primary'} ml={1} fontSize={12} fontWeight={300}>{name}</Typography>
            </Box>
            <Typography color={'primary.main'} fontSize={14} fontWeight={300}>{text} </Typography>
        </RowContainerBetween>
    )
}
