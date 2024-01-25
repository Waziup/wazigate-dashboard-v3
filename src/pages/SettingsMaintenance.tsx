import { Box, Button,Icon, Stack, Typography } from "@mui/material";
import React, { useTransition } from "react";
import ResourcesTabMaintenance from "../components/ui/ResourcesTab.maintenance";
import SSHTabMaintenance from "../components/ui/SSHTab.maintenance";
import ContainersTabMaintenance from "../components/ui/ContainersTab.maintenance";
import ExportTabMaintenance from "../components/ui/ExportTab.maintenance";
import LogsTabMaintenance from "../components/ui/LogsTab.maintenance";
const BTN = ({title,icon,onClick,activeTab,idx}:{idx:string,title:string,activeTab:string, icon:string,onClick:(idx:string)=>void})=>(
    <Box bgcolor={activeTab===idx?'#D1ECF1':'inherit'} >
        <Button onClick={()=>onClick(idx)} sx={{color:activeTab===idx?'#000':'#fff',py:1,px:2}}  variant="text" startIcon={<Icon sx={{color:activeTab===idx?'#000':'#fff'}} >{icon}</Icon>}>
            {title}
        </Button>
    </Box>
);

const PendingTab =()=>(
    <Box>
        <Typography>isPending</Typography>
    </Box>
)
type Tabs={
    [key:string]:{
        title:string,
        component:()=>JSX.Element
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
    const TabComponent = tabs[activeTab].component;
    return (
        <Box position={'relative'}>
            <Stack bgcolor={'primary.main'}  direction={'row'} spacing={0}>
                <BTN activeTab={activeTab} idx='0' onClick={handleTabChange} title={'Resources'} icon={'folder_copy'}/>
                <BTN activeTab={activeTab} idx='1' onClick={handleTabChange} title={'SSH'} icon={'terminal_outlined'}/>
                <BTN activeTab={activeTab} idx='2'onClick={handleTabChange} title={'Containers'} icon={'terminal_outlined'}/>
                <BTN activeTab={activeTab} idx='3' onClick={handleTabChange} title={'Logs'} icon={'description'}/>
                <BTN activeTab={activeTab} idx='4' onClick={handleTabChange} title={'Export gateway data'} icon={'terminal_outlined'}/>
            </Stack>
            {
                isPending?(
                    <PendingTab/>
                ):(
                    <TabComponent/>
                )
            }
        </Box>
    )
}
