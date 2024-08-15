import { Box, Breadcrumbs, Button,CircularProgress,Icon, Typography } from "@mui/material";
import React, { useTransition } from "react";
import ResourcesTabMaintenance from "../components/ui/ResourcesTab.maintenance";
import SSHTabMaintenance from "../components/ui/SSHTab.maintenance";
import ContainersTabMaintenance from "../components/ui/ContainersTab.maintenance";
import ExportTabMaintenance from "../components/ui/ExportTab.maintenance";
import LogsTabMaintenance from "../components/ui/LogsTab.maintenance";
import { Link, useOutletContext } from "react-router-dom";
const BTN = ({title,icon,onClick,activeTab,children,idx}:{idx:string,title:string,activeTab:string,children?:React.ReactNode, icon?:string,onClick:(idx:string)=>void})=>(
    <Box sx={{color:activeTab?'#000':'#535353',":hover":{bgcolor:'#ccc',borderBottom:'4px solid #535353'},bgcolor:activeTab===idx?'#ccc':'inherit',borderBottom:activeTab===idx?'4px solid #535353':'none'}}  bgcolor={activeTab===idx?'#ccc':'inherit'} >
        <Button onClick={()=>onClick(idx)} sx={{display:'flex',alignItems:'center', color:activeTab===idx?'#000':'#535353',py:1,px:2}}  variant="text" startIcon={
            icon?<Icon sx={{color:activeTab===idx?'#000':'#535353'}} >{icon}</Icon>:null
        }>
            {children}
            {title}
        </Button>
    </Box>
);

const PendingTab =()=>(
    <Box sx={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center',bgcolor:'rgba(255,255,255,0.5)'}}>
        <CircularProgress />
        <Typography>Loading...</Typography>
    </Box>
)
interface Props{
    matches?:boolean
}
type Tabs={
    [key:string]:{
        title:string,
        component:({ matches }: Props)=>JSX.Element
    }
}
const tabs:Tabs = {
    '0':{
        title:'Resources',
        component:ResourcesTabMaintenance
    },
    '1':{
        title:'SSH',
        component: SSHTabMaintenance
    },
    '2':{
        title:'Containers',
        component:ContainersTabMaintenance
    },
    '3':{
        title:'Logs',
        component: LogsTabMaintenance
    },
    '4':{
        title:'Export',
        component:ExportTabMaintenance
    }
}
import DockerSVG from '../assets/docker.svg';
import ExportSVG from '../assets/export_notes.svg';
import RowContainerNormal from "../components/shared/RowContainerNormal";
export default function SettingsMaintenance() {
    const [activeTab, setActiveTab] = React.useState<string>('0');
    const [isPending, startTransition] = useTransition();
    const handleTabChange = ( newValue: string) => {
        startTransition(() => {
            setActiveTab(newValue);
        });
    };
    const [matches] = useOutletContext<[matches: boolean]>();
    const TabComponent = tabs[activeTab].component;
    return (
        <Box sx={{ p:2,width:'100%', height: '100%',position:'relative' }}>
            <Box>
                <Typography fontWeight={600} fontSize={24} color={'black'}>Maintenance</Typography>
                <div role="presentation" >
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/settings">
                            Settings
                        </Link>
                        <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                            maintenance
                        </p>
                    </Breadcrumbs>
                </div>
            </Box>
            
            <RowContainerNormal additionStyles={{display:'flex',width:'100%', overflow:'auto',direction:'row',borderBottom:'2px solid #ccc'}}>
                <BTN activeTab={activeTab} idx='0' onClick={handleTabChange} title={'Resources'} icon={'folder_copy'}/>
                <BTN activeTab={activeTab} idx='1' onClick={handleTabChange} title={'SSH'} icon={'terminal_outlined'}/>
                <BTN activeTab={activeTab} idx='2'onClick={handleTabChange} title={'Containers'}>
                    <Box component={'img'} mr={.5} src={DockerSVG} color={activeTab?'#fff':'#000'} height={20} width={20} />
                </BTN>
                <BTN activeTab={activeTab} idx='3' onClick={handleTabChange} title={'Logs'} icon={'description'}/>
                <Box minWidth={240}>
                    <BTN activeTab={activeTab} idx='4' onClick={handleTabChange} title={'Export gateway data'}>
                        <Box component={'img'} mr={.5} src={ExportSVG} color={activeTab?'#000':'#535353'} height={15} width={15} />
                    </BTN>
                </Box>
            </RowContainerNormal>
            {
                isPending?(
                    <PendingTab/>
                ):(
                    <TabComponent
                        matches={matches}
                    />
                )
            }
        </Box>
    )
}
