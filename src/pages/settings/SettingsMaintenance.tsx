import { Box, Breadcrumbs, Button,CircularProgress,Icon, Typography } from "@mui/material";
import React, { useTransition } from "react";
import ResourcesTabMaintenance from "../../components/ui/ResourcesTab.maintenance";
import SSHTabMaintenance from "../../components/ui/SSHTab.maintenance";
import ContainersTabMaintenance from "../../components/ui/ContainersTab.maintenance";
import ExportTabMaintenance from "../../components/ui/ExportTab.maintenance";
import LogsTabMaintenance from "../../components/ui/LogsTab.maintenance";
import { Link, useOutletContext } from "react-router-dom";
import DockerSVG from '../../assets/docker.svg';
import RowContainerNormal from "../../components/shared/RowContainerNormal";
const BTN = ({title,icon,onClick,activeTab,children,idx}:{idx:string,title:string,activeTab:string,children?:React.ReactNode, icon?:string,onClick:(idx:string)=>void})=>(
    <Box sx={{mr:2,color:activeTab===idx?'#000':'#fff',":hover":{bgcolor:'#499dff',color:'white'},border:`1px solid ${activeTab===idx?'#499dff':'#535353'}`,borderRadius:20,bgcolor:activeTab===idx?'#499dff':'inherit',}}  bgcolor={activeTab===idx?'#ccc':'inherit'} >
        <Button onClick={()=>onClick(idx)} sx={{display:'flex',alignItems:'center',":hover":{color:'white'}, color:activeTab===idx?'#000':'#535353',py:0.5,px:3}} variant="text" startIcon={icon?<Icon sx={{":hover":{color:'white'}, color:activeTab===idx?'#fff':'inherit'}} >{icon}</Icon>:null }>
            {children}
            <Typography  sx={{color:activeTab===idx?'#fff':'inherit'}} >
                {title}
            </Typography>
        </Button>
    </Box>
);
// const BTN = ({title,icon,onClick,activeTab,children,idx}:{idx:string,title:string,activeTab:string,children?:React.ReactNode, icon?:string,onClick:(idx:string)=>void})=>(
//     <Box sx={{color:activeTab?'#000':'#535353',":hover":{bgcolor:'#ccc',borderBottom:'2px solid #499DFF'},bgcolor:activeTab===idx?'#ccc':'inherit',borderBottom:activeTab===idx?'2px solid #499DFF':'none'}}  bgcolor={activeTab===idx?'#ccc':'inherit'} >
//         <Button onClick={()=>onClick(idx)} sx={{display:'flex',alignItems:'center', color:activeTab===idx?'#000':'#535353',py:1,px:2}}  variant="text" startIcon={
//             icon?<Icon sx={{color:activeTab===idx?'#000':'#535353'}} >{icon}</Icon>:null
//         }>
//             {children}
//             {title}
//         </Button>
//     </Box>
// );

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
        <Box sx={{px:matches?4:2,py:2,}}>
            <Box>
                <Typography fontWeight={600} fontSize={24} color={'black'}>Maintenance</Typography>
                <div role="presentation" >
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography fontSize={14} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                            <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/settings">
                                Settings
                            </Link>
                        </Typography>
                        <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                            maintenance
                        </p>
                    </Breadcrumbs>
                </div>
            </Box>
            
            <RowContainerNormal additionStyles={{display:'flex',width:'100%', '&::-webkit-scrollbar': {display:'none',}, overflow:'auto',direction:'row'}}>
                <BTN activeTab={activeTab} idx='0' onClick={handleTabChange} title={'Resources'} icon={'folder_copy'}/>
                <BTN activeTab={activeTab} idx='1' onClick={handleTabChange} title={'SSH'} icon={'terminal_outlined'}/>
                <BTN activeTab={activeTab} idx='2'onClick={handleTabChange} title={'Containers'}>
                    <Box component={'img'} mr={.5} src={DockerSVG} color={activeTab?'#fff':'#000'} height={20} width={20} />
                </BTN>
                <BTN activeTab={activeTab} idx='3' onClick={handleTabChange} title={'Logs'} icon={'description'}/>
                <BTN activeTab={activeTab} idx='4' onClick={handleTabChange} icon="article" title={'Export'}/>
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
