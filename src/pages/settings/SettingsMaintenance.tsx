import React, { useState, useTransition } from "react";
import { Box, Breadcrumbs, Button, CircularProgress, Icon, Typography } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import DockerSVG from '../../assets/docker.svg';
import ResourcesTabMaintenance from "../../components/ui/ResourcesTab.maintenance";
import SSHTabMaintenance from "../../components/ui/SSHTab.maintenance";
import ContainersTabMaintenance from "../../components/ui/ContainersTab.maintenance";
import ExportTabMaintenance from "../../components/ui/ExportTab.maintenance";
import LogsTabMaintenance from "../../components/ui/LogsTab.maintenance";
import RowContainerNormal from "../../components/shared/RowContainerNormal";

interface TabProps {
    idx: string;
    title?: string;
    icon?: string;
    onClick: (idx: string) => void;
    activeTab: string;
    sx?: object;
}

const TabButton: React.FC<TabProps> = ({ title, icon, onClick, activeTab, idx, sx }) => (
    <Button
        onClick={() => onClick(idx)}
        variant="outlined"
        sx={{
            minWidth: 140,
            flexShrink: 0,
            scrollSnapAlign: 'start',
            borderRadius: 20,
            color: activeTab === idx ? "#fff" : "#535353",
            backgroundColor: activeTab === idx ? "#f55e19" : "inherit",
            borderColor: activeTab === idx ? "#f55e19" : "#535353",
            '&:hover': {
                backgroundColor: "#f55e19",
                color: "#fff",
                borderColor: "#f55e19",
                transition: "all 0.3s ease"
            },
            display: 'flex',
            alignItems: 'center',
            py: 0.5,
            px: 3,
            ...sx
        }}
        startIcon={icon && <Icon>{icon}</Icon>}
    >
        {title}
    </Button>
);

const DockerTabButton: React.FC<{ onClick: (idx: string) => void; activeTab: string }> = ({ onClick, activeTab }) => (
    <Button
        onClick={() => onClick('2')}
        variant="outlined"
        sx={{
            minWidth: 140,
            flexShrink: 0,
            scrollSnapAlign: 'start',
            mr: 2,
            borderRadius: 20,
            color: activeTab === '2' ? "#fff" : "#535353",
            backgroundColor: activeTab === '2' ? "#f55e19" : "inherit",
            borderColor: activeTab === '2' ? "#f55e19" : "#535353",
            '&:hover': {
                backgroundColor: "#f55e19",
                color: "#fff",
                borderColor: "#f55e19",
                transition: "all 0.3s ease"
            },
            display: 'flex',
            alignItems: 'center',
            py: 0.5,
            px: 3,
        }}
    >
        <Box component='img' src={DockerSVG} height={20} width={20} sx={{ mr: 1 }} />
        <Typography>Docker Containers</Typography>
    </Button>
);

interface TabConfig {
    title: string;
    component: React.FC<{ matches?: boolean }>;
    icon?: string;
}

const tabs: Record<string, TabConfig> = {
    '0': { title: 'Resources', component: ResourcesTabMaintenance, icon: 'folder_copy' },
    '1': { title: 'SSH', component: SSHTabMaintenance, icon: 'terminal_outlined' },
    '3': { title: 'Logs', component: LogsTabMaintenance, icon: 'description' },
    '4': { title: 'Export', component: ExportTabMaintenance, icon: 'download' }
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

const SettingsMaintenance: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('0');
    const [isPending, startTransition] = useTransition();
    const [matches] = useOutletContext<[matches: boolean]>();

    const handleTabChange = (newValue: string) => startTransition(() => setActiveTab(newValue));
    const TabComponent = activeTab === '2' ? ContainersTabMaintenance : tabs[activeTab].component;

    return (
        <Box sx={{ px: matches ? 4 : 2, py: 2 }}>
            <Typography fontWeight={600} fontSize={24}>Maintenance</Typography>
            <Breadcrumbs>
                <Typography component={Link} to="/settings" sx={{ textDecoration: 'none', fontWeight: 300, color: 'black' }}>
                    Settings
                </Typography>
                <Typography sx={{ fontWeight: 300 }}>Maintenance</Typography>
            </Breadcrumbs>

            <RowContainerNormal additionStyles={{
                display: 'flex',
                flexWrap: 'nowrap',
                width: '100%',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                gap: 1,
                scrollSnapType: 'x mandatory',
                mb: 3
            }}>
                {Object.entries(tabs).map(([key, tab]) => (
                    <TabButton
                        key={key}
                        idx={key}
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        title={tab.title}
                        icon={tab.icon}
                    />
                ))}

                <DockerTabButton activeTab={activeTab} onClick={handleTabChange} />
            </RowContainerNormal>

            {isPending ? <PendingTab /> : <TabComponent matches={matches} />}
        </Box>
    );
};

export default SettingsMaintenance;
