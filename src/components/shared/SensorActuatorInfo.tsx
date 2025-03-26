import { Box, Stack, Typography } from "@mui/material";
import SVGIcon from "./SVGIcon";
import ontologies from '../../assets/ontologies.json';
import ontologiesicons from '../../assets/ontologies.svg';
import { useMemo } from "react";

interface SensorActuatorInfoProps {
    lastUpdated: string;
    unit: string;
    kind: string;
    type: 'sensor' | 'actuator';
    text: string | number;
    name: string;
    onClick: () => void;
    iconname: string;
}
export default function SensorActuatorInfo({ type, text, unit, name, kind, onClick, lastUpdated, iconname }: SensorActuatorInfoProps) {
    const val = useMemo(() => {
        if (typeof text === 'number') {
            return (Math.round(text * 100) / 100).toFixed(2);
        } else if(Array.isArray(text)){
            return text.toString()
        } else if (typeof text === 'object') {
            const objectString = Object.entries(text)
                .map(([key, value]) => `${key}:${value}`)
                .join(', ');
            return objectString
        }
        return text
    }, [text]);
    const icon = useMemo(() => {
        if (iconname) {
            return iconname
        } else if (type === 'actuator') {
            return (ontologies.actingDevices[kind as keyof typeof ontologies.actingDevices] && ontologies.actingDevices[kind as keyof typeof ontologies.actingDevices]) ? ontologies.actingDevices[kind as keyof typeof ontologies.actingDevices].icon : 'meter'
        } else {
            return (ontologies.sensingDevices[kind as keyof typeof ontologies.sensingDevices] && ontologies.sensingDevices[kind as keyof typeof ontologies.sensingDevices]) ? ontologies.sensingDevices[kind as keyof typeof ontologies.sensingDevices].icon : 'meter'
        }
    }, [iconname, kind, type])
    return (
        <Box onClick={onClick} sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1, ":hover": { bgcolor: '#f5f5f5' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SVGIcon
                    style={{ width: 35, height: 35, }}
                    src={`${ontologiesicons}#${icon}`}
                />
                <Stack flexDirection='column'>
                    <Typography color={'primary'} variant="subtitle1">{name}</Typography>
                    <Typography color={'#797979'} variant="caption">Last updated {lastUpdated}</Typography>
                </Stack>
            </Box>
            <Stack flexDirection='row' alignItems='baseline'>
                <Typography color={'primary.main'} mr={0.5} variant="body1">{val}</Typography>
                <Typography color={'primary'} fontSize={12} fontWeight={300}>{typeof text === 'object' ? '' : unit}</Typography>
            </Stack>
        </Box>
    )
}
