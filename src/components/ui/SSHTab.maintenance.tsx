import { Box, } from '@mui/material';
interface Props{
    matches?:boolean
}
export default function SSHTabMaintenance({matches}:Props) {
    console.log(matches);
    
    return (
        <Box>
            <iframe src="/apps/waziup.wazigate-system/ssh" style={{position: "absolute", width: "100%", height: "90%", border: "none" }} />
        </Box>
    )
}
