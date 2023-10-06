import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { LockOpen } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup'
import {useForm,SubmitHandler } from 'react-hook-form'
import * as yup from 'yup';
interface RegistrationInput{
    username:string
    password:string
}
const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
}).required()
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
const TextInput = ({type,placeholder,label,...rest}:TextInputProps)=>(
    <Box>
        <p style={{color:DEFAULT_COLORS.third_dark,fontWeight:'300'}}>{label} <span style={{color:DEFAULT_COLORS.orange}}>*</span></p>
        <input {...rest} type={type} placeholder={placeholder} style={{width:'100%',fontSize:18, border:'none',background:'none',color:DEFAULT_COLORS.third_dark,padding:2, borderBottom:'1px solid #D5D6D8', outline:'none'}} />
    </Box>
)
function Login() {
    const navigate = useNavigate();
    const handleNavigate = ()=>{navigate('/')}
    const {handleSubmit,register} = useForm<RegistrationInput>({
        resolver: yupResolver(schema),
    });
    const onSubmit:SubmitHandler<RegistrationInput> = async (data: {username:string,password:string}) => {
        const userData = {
            username: data.username,
            password: data.password,
        }
        console.log(userData);
        try {
            
            navigate('/home');
        } catch (error ) {
            // const err = error as ErrorType
            console.log('Error encountered: ',error)
        }
    }
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <Box height={'100vh'} position={'relative'} width={'100%'} bgcolor={'#F4F7F6'}>
            <Box position={'absolute'} sx={{transform:'translate(-50%,-50%)',top:'50%',left:'50%',borderRadius:2, bgcolor:'white',width:matches?'40%':'95%'}}>
                <Box display={'flex'} justifyContent={'center'} py={2} width={'100%'} borderBottom={'1px solid #D5D6D8'} alignItems={'center'}>
                    <Box component={'img'}  src='/wazilogo.svg' mx={2} />
                    <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>Login to Wazigate Dashboard</Typography>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box p={2}>
                        <Box py={1}>
                            <TextInput {...register('username')} label='Username' type="text" placeholder="admin" />
                        </Box>
                        <Box py={1}>
                            <TextInput {...register('password')} label='Password' type="password" placeholder="......" />
                        </Box>
                        <Box borderBottom={'1px solid #D5D6D8'} display={'flex'} justifyContent={'center'} py={1}>
                            <button onClick={handleNavigate} style={{width:'70%',border:'none', borderRadius:5, outline:'none', padding:10, backgroundColor:'#2BBBAD', color:'white'}}>
                                <LockOpen sx={{fontSize:20}} />
                                LOGIN
                            </button>
                        </Box>
                    </Box>
                </form>
                <Box px={2} py={2}>
                    <p style={{color:DEFAULT_COLORS.third_dark,fontWeight:'300',fontStyle:'oblique'}}>Default Username: admin </p>
                    <p style={{color:DEFAULT_COLORS.third_dark,fontWeight:'300'}}>Default Password: loragateway </p>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;