import { Alert, Box,  Snackbar,  Typography, useMediaQuery, useTheme } from '@mui/material';
import {  DEFAULT_COLORS } from '../constants';
import { LockOpen } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup'
import {useForm,SubmitHandler } from 'react-hook-form'
import * as yup from 'yup';
import { useContext, useState } from 'react';
import { DevicesContext } from '../context/devices.context';

interface RegistrationInput{
    username:string
    password:string
}
const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
}).required()
interface TextInputProps {
    children: React.ReactNode;
    label: string
}
const TextInput = ({children,label}:TextInputProps)=>(
    <Box py={1}>
        <Box  sx={{color:DEFAULT_COLORS.third_dark,fontWeight:'300',display:'flex'}}>
            {label} 
            <Box component={'p'} sx={{color:DEFAULT_COLORS.orange}}>{' '}*</Box></Box>
        {children}
    </Box>
);
const reToken = () => {
    const oldToken = window.localStorage.getItem('token');
    window.wazigate.set<string>("auth/retoken", {
        token: oldToken,
    }).then(
        (res) => {
            console.log("Refresh token", res);
            window.localStorage.setItem('token',res as unknown as string);
            // setTimeout(reToken, 1000 * 60 * 8); // Referesh the token every 10-2 minutes
        },
        (error) => {
            console.log(error);
            // window.location.href='/'
        }
    );
}
setInterval(reToken, 1000 * 60 * 8); // Referesh the token every 10-2 minutes
export default function Login() {
    const navigate = useNavigate();
    const [showErrSnackbar, setShowErrSnackbar] = useState<boolean>(false);
    const [errorMess, setErrorMessage] = useState<string>('');
    // const handleNavigate = ()=>{navigate('/')}
    const {handleSubmit,register} = useForm<RegistrationInput>({
        resolver: yupResolver(schema),
    });
    const {setAccessToken,token} = useContext(DevicesContext);
    
    const onSubmit:SubmitHandler<RegistrationInput> = async (data: {username:string,password:string}) => {
        try {
            window.wazigate.authToken(data.username,data.password)
            .then((res)=>{
                setAccessToken(res)
                handleClose()
                console.log(token);
                window.wazigate.setToken(token);
                navigate('/dashboard',{state:{title:'Dashboard'}})
            })
            .catch((err)=>{
                if(err.message && err.message==='Failed to fetch'){
                    setErrorMessage('Check if the backend server is running')
                }else{
                    setErrorMessage('Invalid username or password')
                }
                handleClose()
            })
        } catch (error ) {
            setErrorMessage((error as {message:string}).message)
        }
    }
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const handleClose= ()=>{setShowErrSnackbar(!showErrSnackbar)}
    return (
        <>
            <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={showErrSnackbar} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMess}
                </Alert>
            </Snackbar>
            <Box height={'100vh'} position={'relative'} width={'100%'} bgcolor={'#F4F7F6'}>
                <Box position={'absolute'} sx={{transform:'translate(-50%,-50%)',top:'50%',left:'50%',borderRadius:2, bgcolor:'white',width:matches?'40%':'95%'}}>
                    <Box display={'flex'} justifyContent={'center'} py={2} width={'100%'} borderBottom={'1px solid #D5D6D8'} alignItems={'center'}>
                        <Box component={'img'}  src='/wazilogo.svg' mx={2} />
                        <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>Login to Wazigate Dashboard</Typography>
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box p={2}>
                            <TextInput label='Admin'>
                                <input {...register('username')} required type={'text'} placeholder={'admin'} style={{width:'100%',fontSize:18, border:'none',background:'none',color:DEFAULT_COLORS.third_dark,padding:2, borderBottom:'1px solid #D5D6D8', outline:'none'}} />
                            </TextInput>
                            <TextInput label='Password'>
                                <input {...register('password')} required type='password' placeholder='.....' style={{width:'100%',fontSize:18, border:'none',background:'none',color:DEFAULT_COLORS.third_dark,padding:2, borderBottom:'1px solid #D5D6D8', outline:'none'}} />
                            </TextInput>
                            <Box borderBottom={'1px solid #D5D6D8'} display={'flex'} justifyContent={'center'} py={1}>
                                <button type='submit'  style={{width:'70%',border:'none', borderRadius:5, outline:'none', padding:10, backgroundColor:'#2BBBAD', color:'white'}}>
                                    <LockOpen sx={{fontSize:20}} />
                                    LOGIN
                                </button>
                            </Box>
                        </Box>
                    </form>
                    <Box px={2} py={2}>
                        <Box component={'p'} sx={{ color: DEFAULT_COLORS.third_dark, fontWeight: '300', fontStyle: 'oblique' }}>Default Username: admin </Box>
                        <Box component={'p'} sx={{ color: DEFAULT_COLORS.third_dark, fontWeight: '300' }}>Default Password: loragateway </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}