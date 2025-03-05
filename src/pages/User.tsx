import { Save } from "@mui/icons-material";
import { Alert, Box, Breadcrumbs, CircularProgress,  ListItemText, Paper, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { useContext, useCallback, useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm, SubmitHandler } from 'react-hook-form';
import Backdrop from "../components/Backdrop";
import {AccountCircle} from '@mui/icons-material'
// import Logo from '../assets/wazilogo.svg';
import { DevicesContext } from "../context/devices.context";
import { Link } from "react-router-dom";
interface User {
    id?: string
    name?: string;
    username?:string;
    password?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isReadOnly?:boolean
    disabled?: boolean,
    children: React.ReactNode;
}
const schema = yup.object({
    name: yup.string().optional(),
    username: yup.string().optional(),
    password: yup.string().optional(),
    newPassword: yup.string().optional(),
    newPasswordConfirm: yup.string().optional(),
});
const TextInput = ({disabled, children, label }: TextInputProps) => (
    <Box py={1} sx={{ width: '100%',  }}>
        <p style={{ color: disabled?'#D5D6D8': DEFAULT_COLORS.third_dark, fontWeight: '300' }}>{label} <span style={{ color :disabled?'#D5D6D8': DEFAULT_COLORS.orange }}>*</span></p>
        {children}
    </Box>
)
const textinputStyle = { width: '100%', fontSize: 18, fontWeight:'lighter', border: 'none', background: 'none', color: DEFAULT_COLORS.third_dark, padding: 2, borderBottom: '1px solid #D5D6D8', outline: 'none' }
function User() {
    const {handleSubmit,setValue} = useForm<Omit<User,'ID'>>({
        resolver: yupResolver(schema),
    });
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const [loading, setLoading] = useState(false);
    const {profile,setProfile,loadProfile, showDialog, closeDialog} = useContext(DevicesContext);
    const [rProfile,] = useState<User | null>(profile);
    const [err, setErr] = useState(false);
    const [msg, setMsg] = useState("");
    const loadProfileFc = useCallback(() => {
        setLoading(true);
        setValue('username',profile?profile.username:'');
        setValue('name',profile?profile?.name:'')
        setLoading(false);
    }, [profile, setValue]);
    const onTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.name as keyof Omit<User,'ID'>, e.target.value);
        setProfile({
            ...profile,
            name: profile?.name ?? '',
            username: profile?.username ?? '',
            password: profile?.password ?? '',
            newPassword: profile?.newPassword ?? '',
            newPasswordConfirm: profile?.newPasswordConfirm ?? '',
            [e.target.name]: e.target.value ?? '',
        }) as unknown as User;
    }
    useEffect(()=>{
        if(!profile){
            loadProfile();
        }
        if(profile?.id){
            loadProfileFc();
        }
    },[loadProfileFc, loadProfile, profile])
    const saveProfile: SubmitHandler<User> = (data:User) => {
        if (data.password&& data.password?.length > 0 && data.newPassword != data.newPasswordConfirm) {
            setErr(true);
            setMsg("The new password doesn't match with the confirm new password!");
            return;
        }
    
        const formData = {
            "name": data.name,
            "password": data.password,
            "newPassword": data.newPassword,
        };
        setLoading(true);
        window.wazigate.set<User>("auth/profile", formData)
        .then(() => {
            setLoading(false);
            setErr(false);
            loadProfile();
            showDialog({
                content:"Profile updated Successfully.",
                onAccept: ()=>{},
                acceptBtnTitle:"Close",
                onCancel: closeDialog,
                hideCloseButton: true,
                title:"Profile Update",
            });
        })
        .catch((error) => {
            setLoading(false);
            setErr(true);
            setMsg(error as string);
        });
    };
    const handleClose = () => {setErr(false)}

    return (
        <>
            {
                loading?(
                    <Backdrop>
                        <CircularProgress color="info" size={70} />
                    </Backdrop>
                ):null
            }
            <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={err} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
            <Box sx={{px:matches?4:1,py:2, width: '100%',  position: 'relative', height: '100%', }}>
            <Box>
                <Typography fontWeight={600} fontSize={24} color={'black'}>Profile</Typography>
                <div role="presentation" onClick={()=>{}}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography fontSize={16} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                            <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/">
                                Home
                            </Link>
                        </Typography>
                        <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                            Profile
                        </p>
                    </Breadcrumbs>
                </div>
            </Box>
                <Paper sx={{ mx:'auto', left: '50%', borderRadius: 2, bgcolor: 'white', width: matches ? '50%' : '95%' }}>
                    <Box sx={{ display: 'flex', py: 2, width: '100%', borderBottom: '1px solid #D5D6D8', alignItems: 'center', }}>
                        {/* <Box component={'img'} src={Logo} mx={2} /> */}
                        <AccountCircle sx={{mx: 2,color:'#000',fontSize:50}} />
                        <ListItemText
                            primary={'User Profile:'+profile?.username}
                            secondary={`ID ${profile?.id}`}
                        />
                    </Box>
                    <form onSubmit={handleSubmit(saveProfile)}>
                        <Typography  sx={{ fontWeight: 200, fontSize: 13,mx:1,my:.5, color: '#9CA4AB' }}></Typography>
                        <Box p={2}>
                            <TextInput label='Name'>
                                <input 
                                    type={'text'}
                                    onChange={onTextInputChange}
                                    name="name"
                                    placeholder={'admin'} 
                                    value={profile?.name}
                                    style={textinputStyle}
                                />
                            </TextInput>
                            <TextInput  label='Password'>
                                <input 
                                    type={'text'}
                                    onChange={onTextInputChange}
                                    name="password"
                                    placeholder={'****'}
                                    style={textinputStyle}
                                    value={profile?.password}
                                />
                            </TextInput>
                            <TextInput  label='New Password'>
                                <input
                                    type={'text'}
                                    onChange={onTextInputChange}
                                    name="newPassword"
                                    placeholder={'****'} 
                                    style={textinputStyle}
                                    value={profile?.newPassword}
                                />
                            </TextInput>
                            <TextInput label='Confirm New Password' type="text" placeholder="admin">
                                <input
                                    type={'text'} 
                                    onChange={onTextInputChange}
                                    name="newPasswordConfirm"
                                    value={profile?.newPasswordConfirm}
                                    placeholder={'****'}
                                    style={textinputStyle}
                                />
                            </TextInput>
                            {
                                ((profile?.name!=rProfile?.name) || (profile?.password!=rProfile?.password))?(
                                    <Box display={'flex'} justifyContent={'center'} py={1}>
                                        <button type="submit" style={{cursor:'pointer', width: '50%', border: 'none', justifyContent: 'center', display: 'flex', alignItems: 'center', borderRadius: 5, outline: 'none', padding: 10, backgroundColor: '#499dff', color: 'white' }}>
                                            <Save sx={{ fontSize: 20 }} />
                                            SAVE CHANGES
                                        </button>
                                    </Box>
                                ):null
                            }
                        </Box>
                    </form>
                </Paper>
            </Box>
        </>
    );
}

export default User;