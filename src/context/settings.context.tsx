import React, { createContext, useContext, useEffect,useState } from "react";
import { Cloud } from "waziup";
import { Devices,getNetworkDevices, getVpnStatus, VPNStatus } from "../utils/systemapi";
import { GlobalContext } from "./global.context";
interface ContextValues{
    selectedCloud: Cloud | null
    setSelectedCloud:(cl: Cloud | null)=>void
    networkDevices: Devices
    vpnStatus: VPNStatus | null
    setNetWorkDevices:()=>Promise<void>
}

export const SettingsContext = createContext<ContextValues>({
    selectedCloud:null,
    vpnStatus: null,
    setSelectedCloud:()=>{},
    networkDevices: {},
    setNetWorkDevices:async()=>{},
});

export const SettingsProvider = ({children}:{children:React.ReactNode})=>{
    const {token} = useContext(GlobalContext)
    const [networkDevices, setNetWorkDevices] = useState<Devices>({});
    const [selectedCloud, setSelectedCloud] = useState<Cloud | null>(null);
    const [vpnStatus, setVPNStatus] = useState<VPNStatus | null>(null);
    const setNetWorkDevicesFc = async ()=>{
        await window.wazigate.getClouds().then((clouds) => {
            const waziupCloud = Object.values(clouds)? clouds['waziup']: null;
            setSelectedCloud(waziupCloud);
        });
        const netWorkDevs = await getNetworkDevices();
        const vpnStatus = await getVpnStatus()
        setVPNStatus(vpnStatus)
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
        vpnStatus,
        setNetWorkDevices: setNetWorkDevicesFc,
        setSelectedCloud,
        selectedCloud,
    }
    return(
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}