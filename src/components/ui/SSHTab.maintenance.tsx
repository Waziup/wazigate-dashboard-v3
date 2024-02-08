import { Box, Typography } from '@mui/material';
interface Props{
    matches?:boolean
}
export default function SSHTabMaintenance({matches}:Props) {
    console.log(matches);
    
    return (
        <Box>
            <Typography>SSH tab</Typography>
            <iframe src="../ssh" style={{position: "absolute", width: "100%", height: "90%", border: "none" }} />
        </Box>
    )
}
