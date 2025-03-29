import React from 'react';
import { Box, CardContent, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import SensorActuatorInfo from '../../components/shared/SensorActuatorInfo';
import MenuComponent from '../../components/shared/MenuDropDown';
import RowContainerNormal from '../../components/shared/RowContainerNormal';
import DeviceImage from '../../assets/device.png';
import { Device } from "waziup";
import { SensorX } from "../../context/devices.context";
import { differenceInMinutes, lineClamp } from '../../utils';

interface DeviceCardProps {
    device: Device,
    navigate: ReturnType<typeof useNavigate>,
    handleSelectDevice: (device: Device) => void,
    handleDeleteDevice: (device: Device) => void,
    wazigateId: string,
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, navigate, handleSelectDevice, handleDeleteDevice, wazigateId }) => {
    return (
        <Grid item key={device.id} xs={12} sm={6} lg={4} my={1} px={0} bgcolor='#fff'>
            <Box sx={{ boxShadow: 1, height: '100%', position: 'relative', bgcolor: 'white', borderRadius: 1 }}>
                <RowContainerNormal additionStyles={{ p: 2, borderBottom: '1px solid #dddddd', py: 1.5, gap: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component={'img'} src={DeviceImage} width={35} height={35} mr={1} />
                        <Box onClick={() => navigate(`/devices/${device.id}`, { state: { title: device.name } })}>
                            <Typography sx={{ ...lineClamp(1) }}>{device.name || 'New Device'}</Typography>
                            <Typography color={DEFAULT_COLORS.secondary_black} variant='caption'>
                                Last updated {differenceInMinutes(new Date(device.modified).toISOString())} before
                            </Typography>
                        </Box>
                    </Box>
                    <MenuComponent
                        open={false}
                        menuItems={[
                            {
                                clickHandler: () => handleSelectDevice(device),
                                icon: 'mode_outlined',
                                text: 'Edit',
                            },
                            device.id === wazigateId ? null : {
                                clickHandler: () => handleDeleteDevice(device),
                                icon: 'delete',
                                text: 'Delete',
                            },
                        ]}
                    />
                </RowContainerNormal>
                <CardContent
                    sx={{
                        p: 0,
                        maxHeight: (device.sensors.length + device.actuators.length) > 3 ? 200 : null,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { width: '5px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: DEFAULT_COLORS.primary_blue, borderRadius: '8px' },
                    }}
                >
                    {device.sensors.length === 0 && device.actuators.length === 0 && (
                        <Box m={5} position={'relative'} textAlign={'center'} top={'50%'}>
                            <Typography color={'#797979'} fontSize={14} fontWeight={400}>No interfaces found</Typography>
                            <Typography color={'#797979'} fontWeight={300} component={'span'}>
                                Click <Link style={{ textDecoration: 'none', color: '#499dff' }} to={device.id}>here</Link> to create
                            </Typography>
                        </Box>
                    )}
                    {device.sensors.map((sensor) => (
                        <Box key={sensor.id}>
                            <SensorActuatorInfo
                                type='sensor'
                                onClick={() => navigate(`/devices/${device.id}/sensors/${sensor.id}`, { state: { devicename: device.name, sensorId: sensor.id, deviceId: device.id, sensorname: sensor.name } })}
                                lastUpdated={differenceInMinutes(new Date(sensor.time ? sensor.time : sensor.modified).toISOString()) ?? ''}
                                kind={(sensor.meta?.kind) || (sensor as SensorX).kind || 'AirThermometer'}
                                iconname={sensor.meta?.icon || ''}
                                name={sensor.name}
                                unit={sensor.meta?.unitSymbol || ''}
                                text={sensor.value ? sensor.value : 0}
                            />
                        </Box>
                    ))}
                    {device.actuators.map((act) => (
                        <Box key={act.id}>
                            <SensorActuatorInfo
                                type='actuator'
                                onClick={() => navigate(`/devices/${device.id}/actuators/${act.id}`, { state: { deviceId: device.id, actuatordId: act.id, actuatorname: act.name } })}
                                lastUpdated={differenceInMinutes(new Date(act.time ? act.time as Date : act.modified).toISOString()) ?? ''}
                                iconname={act.meta?.icon || ''}
                                name={act.name}
                                unit={act.meta?.unit && act.value ? act.meta.unit : ''}
                                kind={act.meta?.kind || 'Motor'}
                                text={act.meta?.quantity === 'Boolean' ? act.value ? 'Running' : 'Closed' : Math.round(act.value * 100) / 100}
                            />
                        </Box>
                    ))}
                </CardContent>
            </Box>
        </Grid>
    );
};

export default DeviceCard;