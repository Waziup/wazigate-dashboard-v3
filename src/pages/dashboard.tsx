import { Box, Stack, Typography } from "@mui/material";
import {Router} from '@mui/icons-material';
const Item=({more,color, title}:{more:string,color:string,title:string})=>(
    <Box width={'25%'} mx={2} sx={{ height: '100%', bgcolor: 'white', p: 2 }}>
        <Router sx={{ fontSize: 50,color:'white' }} />
        <Typography color={'black'}>{title}</Typography>
        <Typography color={color} fontWeight={300}>{more}</Typography>
    </Box>
)
function Dashboard() {
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <Typography color={'black'} fontWeight={700}>Gateway Dashboard</Typography>
            <Stack direction={'row'} mt={2} spacing={2}>
                
                <Item color="#499DFF" title="Gateway Status" more="Good" />
                <Item color="#CCC400" title="Cloud Synchronization" more="Last active 3h ago" />
            </Stack>
        </Box>
    );
}

export default Dashboard;