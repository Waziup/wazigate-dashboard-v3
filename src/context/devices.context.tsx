import { createContext, useEffect,useState } from "react";
import { Device } from "waziup";
interface ContextValues{
    devices: Device[]
}
export const DevicesContext = createContext<ContextValues>({devices:[]});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<Device[]>([]);
    useEffect(() => {
        window.wazigate.getDevices().then(setDevices);
    }, []);
    const value={
        devices
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
        </DevicesContext.Provider>
    )
};