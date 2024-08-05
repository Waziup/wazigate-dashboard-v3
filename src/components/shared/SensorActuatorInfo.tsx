import { Box, Typography } from "@mui/material";
import RowContainerBetween from "./RowContainerBetween";
import SVGIcon from "./SVGIcon";
import ontologies from '../../assets/ontologies.json';
import ontologiesicons from '../../assets/ontologies.svg';
export default function SensorActuatorInfo({type, text,unit, name,kind, onClick, iconname }: {unit:string, kind:string, type:'sensor'|'actuator', text: string | number, name: string, onClick: () => void, iconname: string }) {
    return (
        <RowContainerBetween onClick={onClick} additionStyles={{ my: 2, py: 1, px: .5, ":hover": { bgcolor: '#f5f5f5' } }}>
            <Box sx={{ display: 'flex',alignItems:'center', width: '70%' }}>
                <SVGIcon 
                    style={{ width: 35, height: 35, marginRight: 5 }}
                    src={`${ontologiesicons}#${iconname?iconname:type==='actuator'?ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices].icon:ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices].icon}`}
                />
                <Typography color={'primary'} ml={1} fontSize={12} fontWeight={300}>{name}</Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'}>
                <Typography color={'primary.main'}mr={0.5} fontSize={14} fontWeight={300}>{text} </Typography>
                <Typography color={'primary'} fontSize={12} fontWeight={300}>{unit}</Typography>
            </Box>
        </RowContainerBetween>
    )
}
