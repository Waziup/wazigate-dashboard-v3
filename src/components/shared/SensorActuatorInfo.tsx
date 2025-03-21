import { Box, Typography } from "@mui/material";
import SVGIcon from "./SVGIcon";
import ontologies from '../../assets/ontologies.json';
import ontologiesicons from '../../assets/ontologies.svg';
import { useMemo } from "react";
export default function SensorActuatorInfo({type, text,unit, name,kind, onClick,lastUpdated, iconname }: {lastUpdated: string, unit:string, kind:string, type:'sensor'|'actuator', text: string | number, name: string, onClick: () => void, iconname: string }) {
    const val = useMemo(() => {
        if (typeof text === 'number') {
            return (Math.round(text * 100) / 100).toFixed(2);
        }else if(typeof text === 'object'){
            const objectString = Object.entries(text)
            .map(([key, value]) => `${key}:${value}`)
            .join(', ');
            return objectString
        }
        return text
    },[text]);
    const icon = useMemo(() => {
        if(iconname){
            return iconname
        }else if(type==='actuator'){
            return (ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices] && ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices])?ontologies.actingDevices[kind as  keyof typeof ontologies.actingDevices].icon:'meter'
        }else{
            return (ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices] && ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices])? ontologies.sensingDevices[kind as  keyof typeof ontologies.sensingDevices].icon:'meter'
        }
    },[iconname,kind,type])
    return (
        <Box onClick={onClick} sx={{display:'flex',justifyContent:'space-between',  px: 2,py:1.4,  ":hover": { bgcolor: '#f5f5f5' } }}>
            <Box sx={{ display: 'flex',alignItems:'center', }}>
                <SVGIcon 
                    style={{ width: 35, height: 35, }}
                    src={`${ontologiesicons}#${icon}`}
                />
                <Box sx={{ml:1}}>
                    <Typography color={'primary'}  fontSize={12} fontWeight={300}>{name}</Typography>
                    <Typography color={'#797979'}  fontSize={12} fontWeight={400}>Last updated {lastUpdated}</Typography>
                </Box>
            </Box>
            <Box display={'flex'} alignItems={'center'}>    
                <Typography color={'primary.main'}mr={0.5} fontSize={14} fontWeight={300}>{val}</Typography>
                <Typography color={'primary'} fontSize={12} fontWeight={300}>{typeof text==='object'?'':unit}</Typography>
            </Box>
        </Box>
    )
}
