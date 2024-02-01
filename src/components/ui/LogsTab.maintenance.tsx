import { Box,Typography } from '@mui/material'
interface Props{
    matches?:boolean
}
export default function LogsTabMaintenance({matches}:Props) {
    console.log(matches);
    return (
        <Box>
            <Typography>Logs tab</Typography>
        </Box>
    )
}
