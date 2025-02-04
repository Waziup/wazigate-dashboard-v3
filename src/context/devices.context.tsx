import { createContext, useCallback, useEffect,useState } from "react";
import { App, Cloud ,ID, Value, Device, Meta } from "waziup";
import { Devices,getNetworkDevices } from "../utils/systemapi";
import GlobalDialog from "../components/shared/GlobalDialog";
export type SensorX =  {
    id: ID;
    name: string;
    value: Value;
    modified: Date;
    created: Date;
    time: Date;
    meta: Meta;
    kind: string
    quantity: string
    unit: string
}
export type ActuatorX =  {
    id: ID;
    name: string;
    value: Value;
    modified: Date;
    created: Date;
    time: Date;
    meta: Meta;
    kind: string
    quantity: string
    unit: string
}
type DeviceX = Device & {
    sensors: SensorX[]
}
interface ContextValues{
    devices: DeviceX[]
    apps: App[],
    wazigateId: string
    profile: User | null
    showDialog : ({ title, content,acceptBtnTitle, onAccept, onCancel }: {hideCloseButton?:boolean, title: string, acceptBtnTitle:string,  content: string,   onAccept: ()=>void,onCancel: ()=>void,}) =>void,
    closeDialog:()=>void,
    setProfile: (profile:User | null)=>void
    selectedCloud: Cloud | null
    setSelectedCloud:(cl: Cloud | null)=>void
    getDevicesFc:()=>void,
    setAppsFc:(apps:App[])=>void,
    getApps:()=>void,
    loadProfile: ()=>void,
    sortDevices: (order:'1'|'2'|'3'|'4')=>void,
    codecsList?:{id:string,name:string}[] | null,
    addApp:(app:App)=>void
    token:string
    networkDevices: Devices
    setNetWorkDevices:()=>void
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
export const DevicesContext = createContext<ContextValues>({
    devices:[],
    apps:[],
    wazigateId:'',
    selectedCloud:null,
    setSelectedCloud:()=>{},
    showDialog:()=>{},
    closeDialog:()=>{},
    sortDevices:()=>{},
    profile: null,
    loadProfile: ()=>{},
    setProfile: ()=>{},
    getDevicesFc() {
        console.log("get devices");
    },
    setAppsFc(apps) {
        console.log(apps);
    },
    getApps() {
        console.log("get apps");
    },
    addApp(app) {
        console.log(app);
    },
    codecsList:[],
    token:'',
    setAccessToken(userData) {
        console.log(userData);
    },
    networkDevices: {},
    setNetWorkDevices:()=>{},
});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<DeviceX[]>([]);
    const [token,setToken] = useState<string>(()=>{
        const token = window.sessionStorage.getItem('token');
        if(token){
            return token;
        }
        return '';
    });
    const [profile,setProfile] = useState<User | null>(null);
    const setAppsFc = ((apps:App[])=>setApps(apps));
    const [apps, setApps] = useState<App[]>([]);
    const addApp = (app:App)=>{
        setApps([...apps,app]);
    }
    const getApps = ()=>{
        window.wazigate.getApps().then((res)=>{
            const appFiltered = res.filter((a)=> !(a.id.includes("wazigate"))); // remove wazigate apps
            setApps(appFiltered);
        });
    }
    const sortDevices=(order:'1'|'2'|'3'|'4')=>{
        if(order==="1"){
            // sort devices by date created
            const createdDevs = [...devices].sort((a,b)=>a.modified.getTime()-b.modified.getTime())
            setDevices(createdDevs)
        }else if(order==='2'){
            // sorts devices by name
            const namesDevs = [...devices].sort((a, b) => a.name.localeCompare(b.name));
            console.log(namesDevs);
            setDevices(namesDevs)
        }else if(order==="3"){
            const modifiedDevs = [...devices].sort((a,b)=>b.modified.getTime()-a.modified.getTime())
            setDevices(modifiedDevs)
        }else if(order==='4'){
            // sort devices by latest
            const filteredDevs = [...devices].sort((a,b)=>b.created.getTime()-a.created.getTime())
            setDevices(filteredDevs)
        }
    }
    const getDevices = useCallback(()=>{
        window.wazigate.getDevices().then(res=>{
            const devFilter = res.filter((dev,id)=>res.findIndex((d)=>d.id===dev.id)===id).map((dev)=>dev)
            setDevices(devFilter as DeviceX[]);
        });
    },[]);
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
    const [networkDevices, setNetWorkDevices] = useState<Devices>({});
    const [selectedCloud, setSelectedCloud] = useState<Cloud | null>(null);
    const [wazigateId, setWazigateId] = useState<string>(''); 
    const setNetWorkDevicesFc = useCallback(async ()=>{
        window.wazigate.getClouds().then((clouds) => {
            const waziupCloud = Object.values(clouds)? clouds['waziup']: null;
            setSelectedCloud(waziupCloud);
        });
        const netWorkDevs = await getNetworkDevices();
        setNetWorkDevices(netWorkDevs);
    },[]);
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
                getApps();
                getDevices();
                setNetWorkDevicesFc();
                loadProfile();
            }
        }
        fc();
    },[getDevices, setAccessToken, setNetWorkDevicesFc, token]);

    const [dialogState, setDialogState] = useState({
        open: false,
        title: '',
        content: '',
        hideCloseButton:false,
        acceptBtnTitle:'',
        onAccept: ()=>{},
        onCancel: ()=>{},
    });
    const showDialog = ({ title, content,hideCloseButton, onAccept,acceptBtnTitle, onCancel }: {acceptBtnTitle:string,hideCloseButton?:boolean,  title: string,   content: string, onAccept: ()=>void,onCancel: ()=>void,}) => {
        setDialogState({
            open: true,
            title,
            hideCloseButton: hideCloseButton?hideCloseButton:false,
            acceptBtnTitle,
            content,
            onAccept(){
                onAccept()
                closeDialog();
            },
            onCancel(){onCancel();closeDialog()},
        });
    };
    
    const closeDialog = () => {
        setDialogState({ ...dialogState, open: false });
    };
    useEffect(() => {
        if(token){
            loadCodecsList();
        }
    }, [token]);
    const [codecsList, setCodecsList] = useState<{id:string,name:string}[] | null>(null);
    const loadCodecsList = () => {
        window.wazigate.get('/codecs').then(res => {
            setCodecsList(res as {id:string,name:string}[]);
        }, (err: Error) => {
            console.error("There was an error loading codecs:\n" + err)
        });
    }
    const value={
        devices,
        apps,
        getDevicesFc:getDevices,
        setAppsFc,
        getApps,
        profile,
        wazigateId,
        networkDevices,
        setNetWorkDevices:setNetWorkDevicesFc,
        addApp,
        sortDevices,
        loadProfile,
        setSelectedCloud,
        setProfile:setProfileFc,
        token,
        selectedCloud,
        setAccessToken,
        codecsList,
        showDialog,
        closeDialog
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
            <GlobalDialog {...dialogState} />
        </DevicesContext.Provider>
    )
};