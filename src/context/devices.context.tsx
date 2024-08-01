import { createContext, useCallback, useEffect,useState } from "react";
import { App, Cloud ,ID, Value, Device, Meta } from "waziup";
import { Devices,getNetworkDevices } from "../utils/systemapi";
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
    setProfile: (profile:User | null)=>void
    selectedCloud: Cloud | null
    getDevicesFc:()=>void,
    setAppsFc:(apps:App[])=>void,
    getApps:()=>void,
    loadProfile: ()=>void,
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
        const token = window.localStorage.getItem('token');
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
    const getDevices = useCallback(()=>{
        window.wazigate.getDevices().then((res)=>{
            // remove duplicate device with the same id
            const devFilter = res.filter((dev,id)=>res.findIndex((d)=>d.id===dev.id)===id).map((dev)=>{
                // subscribe to device changes
                window.wazigate.subscribe<DeviceX>(`devices/${dev.id}/meta/#`, ()=>{
                    getDevices();
                })
                window.wazigate.subscribe<DeviceX>(`devices/${dev.id}/sensors/#`, ()=>{
                    getDevices();
                })
                window.wazigate.subscribe<DeviceX>(`devices/${dev.id}/actuators/#`, ()=>{
                    getDevices();
                });
                return dev;
            });
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
            setSelectedCloud(Object.values(clouds)? Object.values(clouds)[0]:null);
        });
        const netWorkDevices = await getNetworkDevices();
        setNetWorkDevices(netWorkDevices);
    },[]);
    const setAccessToken = useCallback(async (accessToken:string)=>{
        window.localStorage.setItem('token',accessToken as unknown as string);
        setToken(accessToken);
        // window.localStorage.removeItem('token');
    },[]);
    useEffect(()=>{
        const fc = async () => {
            if(token){
                setAccessToken(token);
                await window.wazigate.setToken(token);
                await window.wazigate.getID().then(setWazigateId);
                getApps();
                getDevices();
                setNetWorkDevicesFc();
                loadProfile();
                window.wazigate.subscribe<DeviceX[]>("devices", getDevices);
                return async () => window.wazigate.unsubscribe("devices", getDevices);
            }
            // else{
            //     const token = window.localStorage.getItem('token');
            //     if(token){
            //         window.wazigate.setToken(token as unknown as string);
            //         setAccessToken(token);
            //     }
            // }
        }
        fc();
    },[getDevices, setAccessToken, setNetWorkDevicesFc, token]);

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
        loadProfile,
        setProfile:setProfileFc,
        token,
        selectedCloud,
        setAccessToken,
        codecsList
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
        </DevicesContext.Provider>
    )
};