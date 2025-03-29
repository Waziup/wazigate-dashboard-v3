import React, { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import RowContainerBetween from './RowContainerBetween';
import SVGIcon from './SVGIcon';
import { useNavigate } from 'react-router-dom';
import ontologiesicons from '../../assets/ontologies.svg';
import { Sensor, Actuator } from 'waziup';
import ontologies from '../../assets/ontologies.json';
import MenuComponent from './MenuDropDown';
import { lineClamp, removeSpecialChars, time_ago } from '../../utils';

interface SensorActuatorItemProps {
    errorCallback: (msg: string) => void;
    sensActuator: Sensor | Actuator;
    open: boolean;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    handleClickMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    deviceId: string;
    kind: string;
    icon: string;
    modified: Date;
    type: 'actuator' | 'sensor';
    callbackFc?: () => void;
}

const isActuator = (kind: string): boolean =>
    Object.keys(ontologies.actingDevices).includes(kind);

const SensorActuatorItem: FC<SensorActuatorItemProps> = ({
    kind,
    icon: ontologyIcon,
    errorCallback,
    callbackFc,
    type,
    modified,
    sensActuator: sens,
    handleClose,
    open,
    children,
    deviceId,
}) => {
    // const [matches] = useOutletContext<[boolean, boolean]>();
    const navigate = useNavigate();

    const handleDelete = () => {
        const confirmed = confirm(`Are you sure you want to remove ${sens.name}?`);
        if (!confirmed) return;
        if (type === 'actuator') {
            window.wazigate
                .deleteActuator(deviceId, sens.id)
                .then(() => {
                    handleClose();
                    callbackFc && callbackFc();
                })
                .catch((err) => errorCallback(err));
        } else {
            window.wazigate
                .deleteSensor(deviceId, sens.id)
                .then(() => {
                    handleClose();
                    callbackFc && callbackFc();
                })
                .catch((err) => errorCallback(err));
        }
    };

    const iconPath =
        type === 'actuator'
            ? ontologies.actingDevices[kind as keyof typeof ontologies.actingDevices]
                ? ontologies.actingDevices[kind as keyof typeof ontologies.actingDevices].icon
                : 'motor'
            : ontologies.sensingDevices[kind as keyof typeof ontologies.sensingDevices]
                ? ontologies.sensingDevices[kind as keyof typeof ontologies.sensingDevices].icon
                : 'temperature';

    // Wrap MenuComponent in a Box with stopPropagation so its clicks don't trigger the card's onClick
    const menuIconWrapper = (
        <Box onClick={(e) => e.stopPropagation()}>
            <MenuComponent
                open={open}
                menuItems={[
                    {
                        icon: 'settings',
                        text: 'Settings',
                        clickHandler: () =>
                            navigate(
                                `/devices/${deviceId}/${isActuator(kind) ? 'actuators' : 'sensors'}/${sens.id}/setting`
                            ),
                    },
                    {
                        icon: 'delete',
                        text: 'Delete',
                        clickHandler: handleDelete,
                    },
                ]}
            />
        </Box>
    );

    return (
        <Grid item xs={12} sm={5} md={5} lg={4} sx={{ maxWidth: { md: 350, lg: 350, xl: 350 } }}>
            <Box
                onClick={() => navigate(`/devices/${deviceId}/${isActuator(kind) ? 'actuators' : 'sensors'}/${sens.id}`)}
                sx={{
                    cursor: 'pointer',
                    boxShadow: 1,
                    p: 2,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <RowContainerBetween>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SVGIcon style={{ width: 32, height: 32 }} src={`${ontologiesicons}#${ontologyIcon || iconPath}`} />
                        <Box>
                            <Typography variant="body2" sx={{ ...lineClamp(1) }}>{removeSpecialChars(sens?.name || '')}</Typography>
                            <Typography variant="caption" sx={{ ...lineClamp(1) }}>{sens.meta.kind || ''}</Typography>
                        </Box>
                    </Box>
                    {menuIconWrapper}
                </RowContainerBetween>
                {children}
                <Typography variant="caption" sx={{ ...lineClamp(1) }}>
                    {time_ago(modified).toString()}
                </Typography>
            </Box>
        </Grid>
    );
};

export default SensorActuatorItem;
