import { createContext, useContext, useEffect, useState } from "react";
import { App } from "waziup";
import { GlobalContext } from "./global.context";

interface ContextValues{
    apps: App[],
    setAppsFc:(apps: App[])=>void,
    getApps:()=>void,
    addApp:(app:App)=>void
}
export const AppsContext = createContext<ContextValues>({
    apps:[],
    setAppsFc: ()=> {},
    getApps:()=> {},
    addApp:()=> {},
});

export const AppsProvider = ({children}:{children:React.ReactNode})=>{
    const {token} = useContext(GlobalContext)  
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
    useEffect(()=>{
        const fc = async () => {
            if(token){
                getApps();
            }
        }
        fc();
    },[token]);
    const value: React.ProviderProps<ContextValues>['value'] = {
        apps,
        setAppsFc,
        getApps,
        addApp,
    }
    return(
        <AppsContext.Provider value={value}>
            {children}
        </AppsContext.Provider>
    )
}