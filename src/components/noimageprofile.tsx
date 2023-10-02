import { Box } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';

function NoImageProfile() {
    return (
        <Box sx={{objectFit:'contain',width:30,height:30,mx:1, bgcolor:DEFAULT_COLORS.primary_blue, borderRadius:'50%'}}></Box>
    );
}

export default NoImageProfile;