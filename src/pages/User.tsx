import { Check, Save } from "@mui/icons-material";
import { Alert, Box, CircularProgress, ListItemText, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import RowContainerNormal from "../components/shared/RowContainerNormal";
import { useContext, useCallback, useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm, SubmitHandler } from 'react-hook-form';
import Backdrop from "../components/Backdrop";

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
    children: React.ReactNode;
}
const schema = yup.object({
    name: yup.string().optional(),
    username: yup.string().optional(),
    password: yup.string().optional(),
    newPassword: yup.string().optional(),
    newPasswordConfirm: yup.string().optional(),
});
const TextInput = ({ children, label }: TextInputProps) => (
    <Box py={1} sx={{ width: '100%',  }}>
        <p style={{ color: DEFAULT_COLORS.third_dark, fontWeight: '300' }}>{label} <span style={{ color: DEFAULT_COLORS.orange }}>*</span></p>
        {children}
    </Box>
)
import Logo from '../assets/wazilogo.svg';
import { DevicesContext } from "../context/devices.context";
import NoImageProfile from "../components/shared/NoImageProfile";
const textinputStyle = { width: '100%', fontSize: 18, border: 'none', background: 'none', color: DEFAULT_COLORS.third_dark, padding: 2, borderBottom: '1px solid #D5D6D8', outline: 'none' }
function User() {
    const {handleSubmit,setValue} = useForm<Omit<User,'ID'>>({
        resolver: yupResolver(schema),
    });
    const theme = useTheme();
    const [isEdited,setIsEdited] = useState(false);
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const [loading, setLoading] = useState(false);
    // const [profile, setProfile] = useState<User  | null>(null);
    const {profile,setProfile,loadProfile} = useContext(DevicesContext);
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
        setIsEdited(true);
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
            alert("Profile updated successfully!");
        })
        .catch((error) => {
            setLoading(false);
            console.log(error);
            setErr(true);
            setMsg(error as string);
        });
        setIsEdited(false);
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
            <Box sx={{ width: '100%',  p: 2, position: 'relative', bgcolor: '#F4F7F6', height: '100%', overflowY: 'scroll' }}>
                <Box sx={{ mx:'auto', left: '50%',boxShadow: 3, borderRadius: 2, bgcolor: 'white', width: matches ? '50%' : '95%' }}>
                    <Box sx={{ display: 'flex', py: 2, width: '100%', borderBottom: '1px solid #D5D6D8', alignItems: 'center', }}>
                        <Box component={'img'} src={Logo} mx={2} />
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
                                    <NoImageProfile/>
                                    <Typography fontWeight={500} color={DEFAULT_COLORS.third_dark}>{profile?.name}</Typography>
                                </RowContainerNormal>
                                <Check sx={{ color: DEFAULT_COLORS.primary_black, mx: 1 }} />
                            </RowContainerBetween>
                        </Box>
                    </Box>
                    <form onSubmit={handleSubmit(saveProfile)}>
                        <Typography  sx={{ fontWeight: 200, fontSize: 13,mx:1,my:.5, color: '#9CA4AB' }}>GENERAL</Typography>
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

                            <TextInput isReadOnly label='Username'>
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
                            {
                                isEdited?(
                                    <Box display={'flex'} justifyContent={'center'} py={1}>
                                        <button type="submit" style={{cursor:'pointer', width: '50%', border: 'none', justifyContent: 'center', display: 'flex', alignItems: 'center', borderRadius: 5, outline: 'none', padding: 10, backgroundColor: '#499dff', color: 'white' }}>
                                            <Save sx={{ fontSize: 20 }} />
                                            SAVE
                                        </button>
                                    </Box>
                                ):null
                            }
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    );
}

export default User;