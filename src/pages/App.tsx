import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom'

export default function AppUI() {
    const {pathname}=useLocation()
    return (
        <Box height={'100vh'}>
            <iframe src={pathname} title="Apps" width="100%" height="100%"></iframe>
        </Box>
    )
}
