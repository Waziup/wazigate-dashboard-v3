// import './App.css'
import { HashRouter, Route,  Routes, } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
// import Automation from './pages/Automation'
import Apps from './pages/Apps'
import Settings from './pages/Settings'
import Login from './pages/Login';
import DeviceSensor from './pages/DeviceSensor'
import User from './pages/User'
import Device from './pages/Device'
import Docspage from './pages/Docspage'
import DeviceSensorSettings from './pages/DevicesensorSettings';
import { Box, createTheme, ThemeProvider } from '@mui/material'
import DeviceSettings from './pages/DeviceSettings';
import SettingsNetworking from './pages/SettingsNetworking'
import SettingsMaintenance from './pages/SettingsMaintenance';
import AppUI from './pages/App';
import { useContext } from 'react'
import { DevicesContext } from './context/devices.context'
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
    return (
            <ThemeProvider theme={theme}>
                <Box bgcolor={'#F0F2F5'}>
                    <HashRouter>
                        <Routes>
                            <Route  path='*' element={<Login/>}
                            />
                            {
                                token ? (
                                    <Route >
                                        <Route element={<Layout/>}>
                                            <Route path='/dashboard' element={<Dashboard/>}/>
                                            <Route path='/devices' element={<Devices/>}/>
                                            <Route path='/devices/:id' element={<Device/>}/>
                                            <Route path='/devices/:id/settings' element={<DeviceSettings/>}/>
                                            <Route path='/devices/:id/sensors/:sensorId' element={<DeviceSensor/>}/>
                                            <Route path='/devices/:id/sensors/:sensorId/settings' element={<DeviceSensorSettings/>}/>
                                            <Route path='/devices/:id/actuators/:sensorId' element={<DeviceSensor/>}/>
                                            <Route path='/devices/:id/actuators/:sensorId/settings' element={<DeviceSensorSettings/>}/>
                                            <Route path='/apps' element={<Apps/>}/>
                                            <Route path='/apps/:id/:id2/' element={<AppUI/>}/>
                                            <Route path='/settings' element={<Settings/>}/>
                                            <Route path='/settings/networking' element={<SettingsNetworking/>}/>
                                            <Route path='/settings/maintenance' element={<SettingsMaintenance/>}/>
                                            <Route path='/user' element={<User/>}/>
                                            <Route path='/help' element={<Docspage/>}/>
                                            <Route path='/docs' element={<Box height={'100vh'}><iframe width="100%" height="100%" className="app" src="/docs/" /></Box>}/>
                                            <Route path='*' element={<div>Not Found</div>}/>
                                        </Route>
                                    </Route>
                                ) : (
                                    <Route path='/' element={<Login/>}/>
                                )
                            }
                        </Routes>
                        {/* <RouterProvider router={router}/> */}
                    </HashRouter>
                </Box>
            </ThemeProvider>
    )
}

export default App
