import { Box, Button,CircularProgress,Icon, Stack, Typography } from "@mui/material";
import React, { useTransition } from "react";
import ResourcesTabMaintenance from "../components/ui/ResourcesTab.maintenance";
import SSHTabMaintenance from "../components/ui/SSHTab.maintenance";
import ContainersTabMaintenance from "../components/ui/ContainersTab.maintenance";
import ExportTabMaintenance from "../components/ui/ExportTab.maintenance";
import LogsTabMaintenance from "../components/ui/LogsTab.maintenance";
import { useOutletContext } from "react-router-dom";
const BTN = ({title,icon,onClick,activeTab,children,idx}:{idx:string,title:string,activeTab:string,children?:React.ReactNode, icon?:string,onClick:(idx:string)=>void})=>(
    <Box  bgcolor={activeTab===idx?'#D1ECF1':'inherit'} >
        <Button onClick={()=>onClick(idx)} sx={{display:'flex',alignItems:'center', color:activeTab===idx?'#000':'#fff',py:1,px:2}}  variant="text" startIcon={
            icon?<Icon sx={{color:activeTab===idx?'#000':'#fff'}} >{icon}</Icon>:null
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
        <Box sx={{ overflowY: 'auto', height: '100%',position:'relative' }}>
            <Stack bgcolor={'primary.main'} overflow={'auto'}  direction={'row'} spacing={0}>
                <BTN activeTab={activeTab} idx='0' onClick={handleTabChange} title={'Resources'} icon={'folder_copy'}/>
                <BTN activeTab={activeTab} idx='1' onClick={handleTabChange} title={'SSH'} icon={'terminal_outlined'}/>
                <BTN activeTab={activeTab} idx='2'onClick={handleTabChange} title={'Containers'}>
                    <Box component={'img'} mr={.5} src="/docker.svg" color={activeTab?'#fff':'#000'} height={20} width={20} />
                </BTN>
                <BTN activeTab={activeTab} idx='3' onClick={handleTabChange} title={'Logs'} icon={'description'}/>
                <Box minWidth={240}>
                    <BTN activeTab={activeTab} idx='4' onClick={handleTabChange} title={'Export gateway data'}>
                        <Box component={'img'} mr={.5} src="/export_notes.svg" color={activeTab?'#fff':'#000'} height={15} width={15} />
                    </BTN>
                </Box>
            </Stack>
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
