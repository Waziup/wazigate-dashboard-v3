import { Box, Typography } from "@mui/material";
import RowContainerBetween from "./RowContainerBetween";
import SVGIcon from "./SVGIcon";
import ontologiesicons from '../../assets/ontologies.svg';
export default function SensorActuatorInfo({ text, name, onClick, iconname }: { text: string, name: string, onClick: () => void, iconname: string }) {
    return (
        <RowContainerBetween onClick={onClick} additionStyles={{ my: 2, py: 1, px: .5, ":hover": { bgcolor: '#f5f5f5' } }}>
            <Box sx={{ display: 'flex', width: '50%' }}>
                <SVGIcon 
                    style={{ width: 18, height: 18, marginRight: 5 }}
                    src={`${ontologiesicons}#${iconname}`}
                />
                <Typography color={'primary'} ml={1} fontSize={12} fontWeight={300}>{name}</Typography>
            </Box>
            <Typography color={'primary.main'} fontSize={14} fontWeight={300}>{text} </Typography>
        </RowContainerBetween>
    )
}
