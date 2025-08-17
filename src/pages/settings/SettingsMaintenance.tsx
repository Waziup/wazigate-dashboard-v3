import React, { useState, useTransition } from "react";
import { Box, Breadcrumbs, CircularProgress, Icon, Tab, Tabs, Typography } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import DockerSVG from '../../assets/docker.svg';
import ResourcesTabMaintenance from "../../components/ui/ResourcesTab.maintenance";
import SSHTabMaintenance from "../../components/ui/SSHTab.maintenance";
import ContainersTabMaintenance from "../../components/ui/ContainersTab.maintenance";
import ExportTabMaintenance from "../../components/ui/ExportTab.maintenance";
import LogsTabMaintenance from "../../components/ui/LogsTab.maintenance";


interface TabConfig {
    title: string;
    component: React.FC<{ matches?: boolean }>;
    icon?: string | React.ReactNode;
}

const tabs: Record<string, TabConfig> = {
    '0': { title: 'Resources', component: ResourcesTabMaintenance, icon: 'folder_copy' },
    '1': { title: 'SSH', component: SSHTabMaintenance, icon: 'terminal_outlined' },
    '2': { title: 'Logs', component: LogsTabMaintenance, icon: 'description' },
    '3': { title: 'Export', component: ExportTabMaintenance, icon: 'download' },
    '4':{title:'Docker Containers', component: ContainersTabMaintenance, icon:''}
};

const PendingTab: React.FC = () => (
    <Box
        sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.5)'
        }}
    >
        <CircularProgress />
        <Typography>Loading...</Typography>
    </Box>
);
function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
const SettingsMaintenance: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('0');
    const [isPending, startTransition] = useTransition();
    const [matches] = useOutletContext<[matches: boolean]>();
    const handleTabChange = (_event: React.SyntheticEvent,newValue: string) => startTransition(() => setActiveTab(newValue));
    const TabComponent = tabs[activeTab].component;

    return (
        <Box sx={{ px: matches ? 4 : 2, py: [0, 2], }}>
            <Typography variant="h5">Maintenance</Typography>
            <Breadcrumbs>
                <Typography component={Link} to="/settings" sx={{ textDecoration: 'none', fontWeight: 300,  }}>
                    Settings
                </Typography>
                <Typography sx={{ fontWeight: 300 }}>Maintenance</Typography>
            </Breadcrumbs>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={parseInt(activeTab)} onChange={handleTabChange} aria-label="basic tabs example">
                    {Object.entries(tabs).map(([key, tab],idx) => (
                        <Tab key={key} sx={{py:-10}} icon={tab.icon?<Icon>{tab.icon}</Icon>: <Box component='img' src={DockerSVG} height={20} width={20} sx={{ mr: 1 }} />} iconPosition="start" label={tab.title} {...a11yProps(idx)} />
                    ))}
                </Tabs>
            </Box>

            {isPending ? <PendingTab /> : <TabComponent matches={matches} />}
        </Box>
    );
};

export default SettingsMaintenance;
