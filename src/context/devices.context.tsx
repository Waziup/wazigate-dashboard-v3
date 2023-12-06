import { createContext, useEffect,useState } from "react";
import { App, Device } from "waziup";
interface ContextValues{
    devices: Device[]
    apps: App[],
    setDevicesFc:(devices:Device[])=>void,
    setAppsFc:(apps:App[])=>void,
    getApps:()=>void
}
export const DevicesContext = createContext<ContextValues>({
    devices:[],
    apps:[],
    setDevicesFc(devices) {
        console.log(devices);
    },
    setAppsFc(apps) {
        console.log(apps);
    },
    getApps() {
        console.log("get apps");
    }
});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<Device[]>([]);
    const setDevicesFc = ((devices:Device[])=>setDevices(devices));
    const setAppsFc = ((apps:App[])=>setApps(apps));
    const [apps, setApps] = useState<App[]>([]);
    const getApps = ()=>{
        window.wazigate.getApps().then((res)=>{
            setApps(res);
        });
    }
    useEffect(() => {
        window.wazigate.getDevices().then(setDevices);
        getApps();

    }, []);
    const value={
        devices,
        apps,
        setDevicesFc,
        setAppsFc,
        getApps
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
        </DevicesContext.Provider>
    )
};