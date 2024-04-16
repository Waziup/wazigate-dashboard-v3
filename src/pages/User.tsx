import { Check, Save } from "@mui/icons-material";
import { Alert, Box, CircularProgress, ListItemText, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm, SubmitHandler } from 'react-hook-form';
import Backdrop from "../components/Backdrop";

interface User {
    id?: string
    name: string;
    username:string;
    password: string;
    newPassword: string;
    newPasswordConfirm: string;
}
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    children: React.ReactNode;
}
const schema = yup.object({
    name: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    newPassword: yup.string().required(),
    newPasswordConfirm: yup.string().required(),
}).required()
const TextInput = ({ children, label }: TextInputProps) => (
    <Box py={1}>
        <p style={{ color: DEFAULT_COLORS.third_dark, fontWeight: '300' }}>{label} <span style={{ color: DEFAULT_COLORS.orange }}>*</span></p>
        {children}
    </Box>
)
import Logo from '../assets/wazilogo.svg';
const textinputStyle = { width: '100%', fontSize: 18, border: 'none', background: 'none', color: DEFAULT_COLORS.third_dark, padding: 2, borderBottom: '1px solid #D5D6D8', outline: 'none' }
function User() {
    const {handleSubmit,setValue} = useForm<Omit<User,'ID'>>({
        resolver: yupResolver(schema),
    });
    const handleNavigate = () => { }
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<User  | null>(null);
    const [err, setErr] = useState(false);
    const [msg, setMsg] = useState("");
    const loadProfile = () => {
        setLoading(true);
        window.wazigate.getProfile().then((res) => {
            setLoading(false);
            setProfile({
                ...res,
                newPasswordConfirm: '',
            });
            setValue('username',res.username);
            setValue('name',res.name)
        },
        (error) => {
            setLoading(false);
            console.log(error);
        });
    };
    const onTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.name as keyof Omit<User,'ID'>, e.target.value);
        setProfile({
            name: profile?.name ?? '',
            username: profile?.username ?? '',
            password: profile?.password ?? '',
            newPassword: profile?.newPassword ?? '',
            newPasswordConfirm: profile?.newPasswordConfirm ?? '',
            [e.target.name]: e.target.value ?? '',
        }) as unknown as User;
    }
    useEffect(()=>{
        loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const saveProfile: SubmitHandler<User> = (data:User) => {
        if (data.password.length > 0 && data.newPassword != data.newPasswordConfirm) {
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
            alert("Profile updated successfully!");
        })
        .catch((error) => {
            setLoading(false);
            console.log(error);
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
            <Box sx={{ width: '100%', p: 3, position: 'relative', bgcolor: '#F4F7F6', height: '100%', overflowY: 'scroll' }}>
                <Box sx={{ mx:'auto', left: '50%', borderRadius: 2, bgcolor: 'white', width: matches ? '50%' : '95%' }}>
                    <Box sx={{ display: 'flex', py: 2, width: '100%', borderBottom: '1px solid #D5D6D8', alignItems: 'center', }}>
                        <Box component={'img'} src={Logo} mx={2} />
                        {/*  */}
                        <ListItemText
                            primary={profile?.name}
                            secondary={`ID ${profile?.id}`}
                        />
                    </Box>
                    <Box py={.5} px={1} width={'100%'} borderBottom={'1px solid #D5D6D8'}>
                        <Typography fontWeight={200} fontSize={13} color={'#9CA4AB'}>PROFILES</Typography>
                        <Box m={.5} sx={{ cursor: 'pointer' }}>
                            <RowContainerBetween additionStyles={{ alignItems: 'center', bgcolor: '#D4',  cursor: 'pointer', borderRadius: 1, }}>
                                <RowContainerNormal>
                                    <Box sx={{ objectFit: 'contain', width: 30, height: 30, mx: 1, bgcolor: DEFAULT_COLORS.primary_blue, borderRadius: '50%' }}></Box>
                                    {/* <Box component={'img'} sx={{objectFit:'contain',width:20,height:20, borderRadius:'50%'}} src={'https://picsum.photos/200/300'}  /> */}
                                    <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>{profile?.name}</Typography>
                                </RowContainerNormal>
                                <Check sx={{ color: DEFAULT_COLORS.primary_black, mx: 1 }} />
                            </RowContainerBetween>
                        </Box>
                    </Box>
                    <form onSubmit={handleSubmit(saveProfile)}>
                        <Typography sx={{ fontWeight: 200, fontSize: 13, color: DEFAULT_COLORS.third_dark }}>GENERAL</Typography>
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

                            <TextInput label='Username'>
                                <input
                                    type={'text'} 
                                    onChange={onTextInputChange}
                                    name="username"
                                    placeholder={'name'}
                                    readOnly
                                    value={profile?.username}
                                    style={textinputStyle}
                                />
                            </TextInput>
                            <TextInput label='Password'>
                                <input 
                                    type={'text'}
                                    onChange={onTextInputChange}
                                    name="password"
                                    placeholder={'****'} 
                                    style={textinputStyle}
                                    value={profile?.password}

                                />
                            </TextInput>
                            <TextInput label='New Password'>
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
                            <Box display={'flex'} justifyContent={'center'} py={1}>
                                <button type="submit" onClick={handleNavigate} style={{ width: '50%', border: 'none', justifyContent: 'center', display: 'flex', alignItems: 'center', borderRadius: 5, outline: 'none', padding: 10, backgroundColor: '#2BBBAD', color: 'white' }}>
                                    <Save sx={{ fontSize: 20 }} />
                                    SAVE
                                </button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    );
}

export default User;