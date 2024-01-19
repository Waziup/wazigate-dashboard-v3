import { Box, Icon, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";
import RowContainerBetween from "./RowContainerBetween";

export default function SensorActuatorInfo({ text, name, onClick, iconname }: { text: string, name: string, onClick: () => void, iconname: string }) {
    return (
        <RowContainerBetween onClick={onClick} additionStyles={{ my: 2, py: 1, px: .5, ":hover": { bgcolor: '#f5f5f5' } }}>
            <Box sx={{ display: 'flex', width: '50%' }}>
                <Icon sx={{ fontSize: 18, color: DEFAULT_COLORS.primary_black }} >{iconname}</Icon>
                <Typography color={'primary'} ml={1} fontSize={12} fontWeight={300}>{name}</Typography>
            </Box>
            <Typography color={'primary.main'} fontSize={14} fontWeight={300}>{text} </Typography>
        </RowContainerBetween>
    )
}
