import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom'

const removeLeadingLashes = (path: string)=>{
    if (path.startsWith("/")) {
        return path.replace(/^\/+/, "");
    }
    return path;
}

export default function AppUI() {
    const {pathname}=useLocation()
    return (
        <Box sx={{overflowY:'hidden',height:'100%'}}>
            <iframe src={removeLeadingLashes(pathname)} title="Apps" width="100%" height="100%"></iframe>
        </Box>
    )
}
