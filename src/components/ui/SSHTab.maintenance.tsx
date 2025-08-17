import { Box, } from '@mui/material';
export default function SSHTabMaintenance() {
    return (
        <Box sx={{overflowY:'auto',height:'100%'}}>
            <iframe src="/apps/waziup.wazigate-system/ssh/" style={{position: "absolute", width: "100%", height: "90%", border: "none" }} />
        </Box>
    )
}
