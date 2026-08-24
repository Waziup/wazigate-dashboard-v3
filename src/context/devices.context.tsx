import { createContext, useCallback, useContext, useEffect,useState } from "react";
import { ID, Value, Device, Meta } from "waziup";
import { GlobalContext } from "./global.context";
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
    getDevicesFc:()=>void,
    sortDevices: (order:'1'|'2'|'3'|'4')=>void,
    codecsList?:{id:string,name:string}[] | null,
}
export const DevicesContext = createContext<ContextValues>({
    devices:[],
    sortDevices:()=>{},
    getDevicesFc:()=> {},
    codecsList:[],
});

export const DevicesProvider = ({children}:{children:React.ReactNode})=>{
    const [devices, setDevices] = useState<DeviceX[]>([]);
    const {token} = useContext(GlobalContext)
    
    const sortDevices=(order:'1'|'2'|'3'|'4')=>{
        if(order==="1"){
            // sort devices by date created
            const createdDevs = [...devices].sort((a,b)=>a.modified.getTime()-b.modified.getTime())
            setDevices(createdDevs)
        }else if(order==='2'){
            // sorts devices by name
            const namesDevs = [...devices].sort((a, b) => a.name.localeCompare(b.name));
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
    useEffect(()=>{
        const fc = async () => {
            if(token){
                getDevices();
            }
        }
        fc();
    },[getDevices, token]);

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
        getDevicesFc:getDevices,
        sortDevices,
        codecsList,
    }
    return(
        <DevicesContext.Provider value={value}>
            {children}
        </DevicesContext.Provider>
    )
};