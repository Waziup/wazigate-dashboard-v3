import { DEFAULT_COLORS } from '../../constants';
import { AccountCircle } from '@mui/icons-material';

function NoImageProfile() {
    return (
        <AccountCircle sx={{color:DEFAULT_COLORS.secondary_gray, width:30, height:30}}/>
    );
}

export default NoImageProfile;