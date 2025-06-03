import React, { createContext, useContext, useEffect,useState } from "react";
import { Cloud } from "waziup";
import { Devices,getNetworkDevices } from "../utils/systemapi";
import { GlobalContext } from "./global.context";
interface ContextValues{
    selectedCloud: Cloud | null
    setSelectedCloud:(cl: Cloud | null)=>void
    networkDevices: Devices
    setNetWorkDevices:()=>void
}

export const SettingsContext = createContext<ContextValues>({
    selectedCloud:null,
    setSelectedCloud:()=>{},
    networkDevices: {},
    setNetWorkDevices:()=>{},
});

export const SettingsProvider = ({children}:{children:React.ReactNode})=>{
    const {token} = useContext(GlobalContext)
    const [networkDevices, setNetWorkDevices] = useState<Devices>({});
    const [selectedCloud, setSelectedCloud] = useState<Cloud | null>(null);
    const setNetWorkDevicesFc = async ()=>{
        await window.wazigate.getClouds().then((clouds) => {
            const waziupCloud = Object.values(clouds)? clouds['waziup']: null;
            setSelectedCloud(waziupCloud);
        });
        const netWorkDevs = await getNetworkDevices();
        setNetWorkDevices(netWorkDevs);
    };
    useEffect(()=>{
        const fc = async () => {
            if(token){
                await setNetWorkDevicesFc();
            }
        }
        fc();
    },[ token]);

    
    const value: React.ProviderProps<ContextValues>['value'] = {
        networkDevices,
        setNetWorkDevices:setNetWorkDevicesFc,
        setSelectedCloud,
        selectedCloud,
    }
    return(
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}