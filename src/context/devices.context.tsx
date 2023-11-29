import { createContext, useEffect,useState } from "react";
import { App, Device } from "waziup";
interface ContextValues{
    devices: Device[]
    apps: App[]
}
export const DevicesContext = createContext<ContextValues>({devices:[],apps:[]});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<Device[]>([]);
    const [apps, setApps] = useState<App[]>([]);
    useEffect(() => {
        window.wazigate.getDevices().then(setDevices);
        window.wazigate.getApps().then((res)=>{
            setApps(res);
        });

    }, []);
    const value={
        devices,
        apps
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
        </DevicesContext.Provider>
    )
};