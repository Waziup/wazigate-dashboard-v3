import { Alert, Box,  Snackbar, useMediaQuery, useTheme } from '@mui/material';
import {  DEFAULT_COLORS } from '../constants';
import { LockOpen } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup'
import {useForm,SubmitHandler } from 'react-hook-form'
import * as yup from 'yup';
import {useContext,  useState } from 'react';
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
); // Referesh the token every 10-2 minutes
import Logo from '../assets/wazigate.svg';
export default function Login() {
    const navigate = useNavigate();
    const [showErrSnackbar, setShowErrSnackbar] = useState<boolean>(false);
    const [errorMess, setErrorMessage] = useState<string>('');
    // const handleNavigate = ()=>{navigate('/')}
    const {handleSubmit,register} = useForm<RegistrationInput>({
        resolver: yupResolver(schema),
    });
    const {setAccessToken} = useContext(DevicesContext);
    
    const onSubmit:SubmitHandler<RegistrationInput> = async (data: {username:string,password:string}) => {
        try {
            window.wazigate.authToken(data.username,data.password)
            .then((res)=>{
                setAccessToken(res)
                handleClose();
                window.sessionStorage.setItem("creds",JSON.stringify({username:data.username,password:data.password}))
                window.wazigate.setToken(res);
                navigate('/dashboard',{state:{title:'Dashboard'}})
            })
            .catch((err)=>{
                if(err.message && err.message==='Failed to fetch'){
                    setErrorMessage('Check if the backend server is running')
                }else{
                    setErrorMessage(err as string);
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
                <Box position={'absolute'} sx={{transform:'translate(-50%,-50%)',top:'50%',left:'50%',borderRadius:2, bgcolor:'white',width:matches?'35%':'90%'}}>
                    <Box display={'flex'} justifyContent={'center'} py={2} width={'100%'} alignItems={'center'}>
                        <Box component={'img'} src={Logo} alignSelf="center" mx={"auto"} width={'70%'} mb={1} height={50} />
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box p={2}>
                            <TextInput label='Admin'>
                                <input {...register('username')} required type={'text'} placeholder={'admin'} style={{width:'100%',fontSize:18, border:'none',background:'none',color:DEFAULT_COLORS.third_dark,padding:2, borderBottom:'1px solid #D5D6D8', outline:'none'}} />
                            </TextInput>
                            <TextInput label='Password'>
                                <input {...register('password')} required type='password' placeholder='.....' style={{width:'100%',fontSize:18, border:'none',background:'none',color:DEFAULT_COLORS.third_dark,padding:2, borderBottom:'1px solid #D5D6D8', outline:'none'}} />
                            </TextInput>
                            <Box display={'flex'} justifyContent={'center'} py={1}>
                                <button type='submit'  style={{width:'70%',border:'none',display:'flex',alignItems:'center',justifyContent:'center', borderRadius:5,cursor:'pointer', outline:'none', padding:10, backgroundColor:'#499dff', color:'white'}}>
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