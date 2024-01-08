import { createContext, useEffect,useState } from "react";
import { App, Device } from "waziup";
interface ContextValues{
    devices: Device[]
    apps: App[],
    getDevicesFc:()=>void,
    setAppsFc:(apps:App[])=>void,
    getApps:()=>void,
    addApp:(app:App)=>void
}
export const DevicesContext = createContext<ContextValues>({
    devices:[],
    apps:[],
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
});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<Device[]>([]);
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
    useEffect(() => {
        getDevices();
        getApps();

    }, []);
    const value={
        devices,
        apps,
        getDevicesFc:getDevices,
        setAppsFc,
        getApps,
        addApp
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
        </DevicesContext.Provider>
    )
};