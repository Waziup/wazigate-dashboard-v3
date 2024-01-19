import { Check, Save } from "@mui/icons-material";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import NoImageProfile from "../components/shared/NoImageProfile";
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
const TextInput = ({ type, placeholder, label }: TextInputProps) => (
    <Box py={1}>
        <p style={{ color: DEFAULT_COLORS.third_dark, fontWeight: '300' }}>{label} <span style={{ color: DEFAULT_COLORS.orange }}>*</span></p>
        <input type={type} placeholder={placeholder} style={{ width: '100%', fontSize: 18, border: 'none', background: 'none', color: DEFAULT_COLORS.third_dark, padding: 2, borderBottom: '1px solid #D5D6D8', outline: 'none' }} />
    </Box>
)
function User() {
    const handleNavigate = () => { }
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <Box sx={{ width: '100%', p: 3, position: 'relative', bgcolor: '#F4F7F6', height: '100%', overflowY: 'scroll' }}>
            <Box sx={{ position: 'absolute', transform: 'translate(-50%,-50%)', top: matches ? '56%' : '40%', left: '50%', borderRadius: 2, bgcolor: 'white', width: matches ? '50%' : '95%' }}>
                <Box sx={{ display: 'flex', py: 2, width: '100%', borderBottom: '1px solid #D5D6D8', alignItems: 'center', }}>
                    <Box component={'img'} src='/wazilogo.svg' mx={2} />
                    {/*  */}
                    <Box>
                        <Typography sx={{ fontWeight: 500, color: DEFAULT_COLORS.third_dark }}>John Doe</Typography>
                    </Box>
                </Box>
                <Box py={.5} px={1} width={'100%'} borderBottom={'1px solid #D5D6D8'}>
                    <Typography fontWeight={200} fontSize={13} color={DEFAULT_COLORS.third_dark}>OTHER PROFILES</Typography>
                    <Box m={.5} sx={{ cursor: 'pointer' }}>
                        <RowContainerBetween additionStyles={{ alignItems: 'center', bgcolor: '#D4', ":hover": { bgcolor: '#499DFF' }, cursor: 'pointer', borderRadius: 1, }}>
                            <RowContainerNormal>
                                <Box sx={{ objectFit: 'contain', width: 30, height: 30, mx: 1, bgcolor: DEFAULT_COLORS.primary_blue, borderRadius: '50%' }}></Box>
                                {/* <Box component={'img'} sx={{objectFit:'contain',width:20,height:20, borderRadius:'50%'}} src={'https://picsum.photos/200/300'}  /> */}
                                <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>John Doe</Typography>
                            </RowContainerNormal>
                            <Check sx={{ color: DEFAULT_COLORS.primary_black, mx: 1 }} />
                        </RowContainerBetween>
                    </Box>
                    <Box sx={{ cursor: 'pointer' }} m={.5}>
                        <RowContainerBetween additionStyles={{ alignItems: 'center', ":hover": { bgcolor: '#499DFF' }, borderRadius: 1, }}>
                            <RowContainerNormal>
                                <NoImageProfile />
                                <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>William Smith</Typography>
                            </RowContainerNormal>
                        </RowContainerBetween>
                    </Box>

                </Box>
                <form>
                    <Typography sx={{ fontWeight: 200, fontSize: 13, color: DEFAULT_COLORS.third_dark }}>GENERAL</Typography>
                    <Box p={2}>
                        <TextInput label='Name' type="text" placeholder="admin" />
                        <TextInput label='username' type="password" placeholder="......" />
                        <TextInput label='Password' type="text" placeholder="admin" />
                        <TextInput label='New Password' type="text" placeholder="admin" />
                        <TextInput label='Confirm new Password' type="password" placeholder="......" />
                        <Box display={'flex'} justifyContent={'center'} py={1}>
                            <button onClick={handleNavigate} style={{ width: '50%', border: 'none', justifyContent: 'center', display: 'flex', alignItems: 'center', borderRadius: 5, outline: 'none', padding: 10, backgroundColor: '#2BBBAD', color: 'white' }}>
                                <Save sx={{ fontSize: 20 }} />
                                SAVE
                            </button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default User;