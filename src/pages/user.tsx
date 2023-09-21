import { Check, Save } from "@mui/icons-material";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { RowContainerBetween, RowContainerNormal } from "./dashboard";
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
const TextInput = ({type,placeholder,label}:TextInputProps)=>(
    <Box>
        <p style={{color:DEFAULT_COLORS.third_dark,fontWeight:'300'}}>{label} <span style={{color:DEFAULT_COLORS.orange}}>*</span></p>
        <input type={type} placeholder={placeholder} style={{width:'100%',fontSize:18, border:'none',background:'none',color:DEFAULT_COLORS.third_dark,padding:2, borderBottom:'1px solid #D5D6D8', outline:'none'}} />
    </Box>
)
function User() {
    const handleNavigate = ()=>{}
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <Box position={'relative'} width={'100%'} bgcolor={'#F4F7F6'} p={3} sx={{ height:'100%',overflowY:'scroll'}}>
            <Box position={'absolute'} sx={{transform:'translate(-50%,-50%)',top:matches?'60%':'40%',left:'50%',borderRadius:2, bgcolor:'white',width:matches?'40%':'95%'}}>
                <Box display={'flex'}  py={2} width={'100%'} borderBottom={'1px solid #D5D6D8'} alignItems={'center'}>
                    <Box component={'img'}  src='/wazilogo.svg' mx={2} />
                    <Box>
                        <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>John Doe</Typography>
                        <Typography fontWeight={200} fontSize={13} color={DEFAULT_COLORS.third_dark}>johndoe@waziup.org</Typography>
                    </Box>
                </Box>
                <Box py={.5} px={1} width={'100%'} borderBottom={'1px solid #D5D6D8'}>
                    <Typography fontWeight={200} fontSize={13}  color={DEFAULT_COLORS.third_dark}>OTHER PROFILES</Typography>
                    <Box m={.5}>
                        <RowContainerBetween additionStyles={{alignItems:'center',bgcolor:'#D4',":hover":{bgcolor:'#499DFF'},cursor:'pointer', borderRadius:1, }}>
                            <RowContainerNormal>
                                <Box component={'img'} sx={{objectFit:'contain',width:20,height:20, borderRadius:'50%'}} src={'https://picsum.photos/200/300'}  />
                                <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>John Doe</Typography>
                            </RowContainerNormal>
                            <Check sx={{color:DEFAULT_COLORS.primary_black,mx:1}} />
                        </RowContainerBetween>
                    </Box>
                    <Box m={.5}>
                        <RowContainerBetween additionStyles={{alignItems:'center',borderRadius:1, }}>
                            <RowContainerNormal>
                                <Box component={'img'} sx={{objectFit:'contain',width:20,height:20, borderRadius:'50%'}} src={'https://picsum.photos/200/300'}  />
                                <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>William Smith</Typography>
                            </RowContainerNormal>
                            {/* <Check sx={{color:DEFAULT_COLORS.primary_blue,mx:1}} /> */}
                        </RowContainerBetween>
                    </Box>
                    
                </Box>
                <form>
                    <Typography fontWeight={200} fontSize={13}  color={DEFAULT_COLORS.third_dark}>GENERAL</Typography>

                    <Box p={2}>
                        <Box py={1}>
                            <TextInput label='Name' type="text" placeholder="admin" />
                        </Box>
                        <Box py={1}>
                            <TextInput label='username' type="password" placeholder="......" />
                        </Box>
                        <Box py={1}>
                            <TextInput label='Password' type="text" placeholder="admin" />
                        </Box>
                        <Box py={1}>
                            <TextInput label='New Password' type="text" placeholder="admin" />
                        </Box>
                        <Box py={1}>
                            <TextInput label='Confirm new Password' type="password" placeholder="......" />
                        </Box>
                        <Box display={'flex'} justifyContent={'center'} py={1}>
                            <button onClick={handleNavigate} style={{width:'50%',border:'none',justifyContent:'center', display:'flex',alignItems:'center', borderRadius:5, outline:'none', padding:10, backgroundColor:'#2BBBAD', color:'white'}}>
                                <Save sx={{fontSize:20}} />
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