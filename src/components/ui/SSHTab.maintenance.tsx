import { Box, Typography } from '@mui/material';
interface Props{
    matches?:boolean
}
export default function SSHTabMaintenance({matches}:Props) {
    console.log(matches);
    
    return (
        <Box>
            <Typography>SSH tab</Typography>
        </Box>
    )
}
