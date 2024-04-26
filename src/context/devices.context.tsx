import { createContext, useCallback, useEffect,useState } from "react";
import { App, Cloud, Device } from "waziup";
import { Devices,getNetworkDevices } from "../utils/systemapi";
interface ContextValues{
    devices: Device[]
    apps: App[],
    selectedCloud: Cloud | null
    getDevicesFc:()=>void,
    setAppsFc:(apps:App[])=>void,
    getApps:()=>void,
    codecsList?:{id:string,name:string}[] | null,
    addApp:(app:App)=>void
    token:string
    networkDevices:Devices | null 
    setNetWorkDevices:()=>void
    setAccessToken:(token:string) =>void
}
export const DevicesContext = createContext<ContextValues>({
    devices:[],
    apps:[],
    selectedCloud:null,
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
    networkDevices:null,
    setNetWorkDevices:()=>{},
});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<Device[]>([]);
    const [token,setToken] = useState<string>('');
    const setAppsFc = ((apps:App[])=>setApps(apps));
    const [apps, setApps] = useState<App[]>([]);
    const addApp = (app:App)=>{
        setApps([...apps,app]);
    }
    const getApps = ()=>{
        window.wazigate.getApps().then((res)=>{
            setApps(res);
        });
    }
    const getDevices = ()=>{
        window.wazigate.getDevices().then((res)=>{
            const devFilter = res.filter((_dev,id)=>id);
            setDevices(devFilter);
        });
    }
    const [networkDevices, setNetWorkDevices] = useState<Devices | null>(null);
    const [selectedCloud, setSelectedCloud] = useState<Cloud | null>(null);
    const setNetWorkDevicesFc = useCallback(async ()=>{
        window.wazigate.getClouds().then((clouds) => {
            setSelectedCloud(Object.values(clouds)? Object.values(clouds)[0]:null);
        });
        const netWorkDevices = await getNetworkDevices();
        setNetWorkDevices(netWorkDevices);
    },[]);
    const setAccessToken = useCallback(async (accessToken:string)=>{
        setToken(accessToken);
        window.localStorage.removeItem('token');
        window.localStorage.setItem('token',accessToken as unknown as string);
    },[]);
    useEffect(()=>{
        const fc = async () => {
            if(token){
                await window.wazigate.setToken(token);
                getApps();
                getDevices();
                setNetWorkDevicesFc();
                window.wazigate.subscribe<Device[]>("devices", getDevices);
                return async () => window.wazigate.unsubscribe("devices", getDevices);
            }
            else{
                const token = window.localStorage.getItem('token');
                if(token){
                    window.wazigate.setToken(token as unknown as string);
                    setAccessToken(token);
                }
            }
        }
        fc();
    },[setAccessToken, setNetWorkDevicesFc, token]);

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
        networkDevices,
        setNetWorkDevices:setNetWorkDevicesFc,
        addApp,
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