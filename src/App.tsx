// import './App.css'
import { HashRouter, Navigate, Route,  Routes, } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Devices from './pages/devices/Devices'
// import Automation from './pages/Automation'
import EdgeApplicationsPage from './pages/EdgeApplicationsPage'
import Settings from './pages/settings/Settings'
import Login from './pages/Login';
import DeviceSensor from './pages/devices/Sensor'
import User from './pages/User'
import Device from './pages/devices/Device'
import Docspage from './pages/Docspage'
import DeviceSensorSettings from './pages/devices/SensorSettings';
import { Box, createTheme, ThemeProvider } from '@mui/material'
import DeviceSettings from './pages/devices/DeviceSettings';
import SettingsNetworking from './pages/settings/SettingsNetworking'
import SettingsMaintenance from './pages/settings/SettingsMaintenance';
import AppUI from './pages/App';
import { useContext } from 'react'
import { DevicesContext } from './context/devices.context'
import Actuator from './pages/devices/Actuator'
import ActuatorSettings from './pages/devices/ActuatorSettings'
function App() {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#292F3F'
            },
            secondary: {
                main: '#F35E19'
            },
            background: {
                default: '#F0F2F5',
            },
            info:{
                main:'#499DFF'
            },
        },
    });
    const { token } = useContext(DevicesContext);
    const creds = window.sessionStorage.getItem("creds");
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor={'#F0F2F5'}>
                <HashRouter>
                    <Routes>
                        {
                            (token && creds) ? (
                                <Route >
                                    <Route element={<Layout/>}>
                                        <Route path='/' element={<Navigate to='/dashboard' replace />}/>
                                        <Route path='/dashboard' element={<Dashboard/>}/>
                                        <Route path='/devices' element={<Devices/>}/>
                                        <Route path='/devices/:id' element={<Device/>}/>
                                        <Route path='/devices/:id/setting' element={<DeviceSettings/>}/>
                                        <Route path='/devices/:id/sensors/:sensorId' element={<DeviceSensor/>}/>
                                        <Route path='/devices/:id/sensors/:sensorId/setting' element={<DeviceSensorSettings/>}/>
                                        <Route path='/devices/:id/actuators/:actuatorId' element={<Actuator/>}/>
                                        <Route path='/devices/:id/actuators/:actuatorId/setting' element={<ActuatorSettings/>}/>
                                        <Route path='/apps' element={<EdgeApplicationsPage/>}/>
                                        <Route path='/apps/:id/:id2/' element={<AppUI/>}/>
                                        <Route path='/settings' element={<Settings/>}/>
                                        <Route path='/settings/networking' element={<SettingsNetworking/>}/>
                                        <Route path='/settings/maintenance' element={<SettingsMaintenance/>}/>
                                        <Route path='/user' element={<User/>}/>
                                        <Route path='/help' element={<Docspage/>}/>
                                        <Route path='/docs' element={<Box sx={{overflow:'hidden',height:'100vh'}}><iframe width="100%" height="100%" className="app" src="/docs/" /></Box>}/>
                                        <Route path='*' element={<div>Not Found</div>}/>
                                    </Route>
                                </Route>
                            ) : (
                                <Route path='/' element={<Login/>}/>
                            )
                        }
                        <Route  path='*' element={<Login/>}  />
                    </Routes>
                </HashRouter>
            </Box>
        </ThemeProvider>
    )
}

export default App
