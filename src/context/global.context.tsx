import { createContext, useCallback, useEffect, useState } from "react"
import GlobalDialog from "../components/shared/GlobalDialog"

interface ContextValues{
    wazigateId: string
    profile: User | null
    showDialog : ({ title, content,acceptBtnTitle, onAccept, onCancel }: {hideCloseButton?:boolean, title: string, acceptBtnTitle:string,  content: React.ReactNode | string,   onAccept: ()=>void | Promise<void>,onCancel: ()=>void,}) =>void,
    closeDialog:()=>void,
    setProfile: (profile:User | null)=>void
    loadProfile: ()=>void,
    token:string
    setAccessToken:(token:string) =>void
}
interface User {
    id?: string
    name: string;
    username:string;
    password: string;
    newPassword: string;
    newPasswordConfirm: string;
}
export const GlobalContext = createContext<ContextValues>({
    wazigateId:'',
    showDialog:()=>{},
    closeDialog:()=>{},
    profile: null,
    loadProfile: ()=>{},
    setProfile: ()=>{},
    token:'',
    setAccessToken:()=> {},
});
export const GlobalProvider = ({children}:{children:React.ReactNode})=>{
    const [token,setToken] = useState<string>(()=>{
        const token = window.sessionStorage.getItem('token');
        if(token){
            return token;
        }
        return '';
    });
    const [profile,setProfile] = useState<User | null>(null);
    const setProfileFc = (profile:User | null)=>{
        setProfile(profile);
    }
    const loadProfile = () => {
        window.wazigate.getProfile().then((res) => {
            setProfile({
                ...res,
                newPasswordConfirm: '',
            });
        }).catch((err) => {
            console.error(err);
        });
    }
        
    const [wazigateId, setWazigateId] = useState<string>(''); 
    
    const setAccessToken = useCallback(async (accessToken:string)=>{
        window.sessionStorage.setItem('token',accessToken as unknown as string);
        setToken(accessToken);
        // window.localStorage.removeItem('token');
    },[]);
    useEffect(()=>{
        const fc = async () => {
            if(token){
                setAccessToken(token);
                await window.wazigate.setToken(token);
                await window.wazigate.getID().then(setWazigateId);
                window.wazigate.reconnectMQTT();
                loadProfile();
            }
        }
        fc();
    },[ setAccessToken, token]);
    
    const [dialogState, setDialogState] = useState<{open: boolean,title: string, content: React.ReactNode | string, hideCloseButton: boolean, acceptBtnTitle: string,onAccept:()=>void,onCancel:()=>void}>({
        open: false,
        title: '',
        content: '',
        hideCloseButton:false,
        acceptBtnTitle:'',
        onAccept: async ()=>{},
        onCancel: ()=>{},
    });
    const showDialog = ({ title, content,hideCloseButton, onAccept,acceptBtnTitle, onCancel }: {acceptBtnTitle:string,hideCloseButton?:boolean,  title: string,   content: React.ReactNode | string, onAccept: ()=>void | Promise<void>,onCancel: ()=>void,}) => {
        setDialogState({
            open: true,
            title,
            hideCloseButton: hideCloseButton?hideCloseButton:false,
            acceptBtnTitle,
            content,
            async onAccept(){
                await onAccept()
                closeDialog();
            },
            onCancel(){onCancel();closeDialog()},
        });
    };
        
    const closeDialog = () => {
        setDialogState({ ...dialogState, open: false });
    };
        
    const value: React.ProviderProps<ContextValues>['value'] = {
        profile,
        wazigateId,
        loadProfile,
        setProfile:setProfileFc,
        token,
        setAccessToken,
        showDialog,
        closeDialog
    }
    return(
        <GlobalContext.Provider value={value}>
            {children}
            <GlobalDialog {...dialogState} />
        </GlobalContext.Provider>
    )
}