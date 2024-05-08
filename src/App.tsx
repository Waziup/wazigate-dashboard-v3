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
import DeviceSettings from './pages/DeviceSettings'
import { DevicesProvider } from './context/devices.context'
import SettingsNetworking from './pages/SettingsNetworking'
import SettingsMaintenance from './pages/SettingsMaintenance';
import AppUI from './pages/App';
const reToken = () => {
    const oldToken = window.localStorage.getItem('token');
    window.wazigate.set<string>("auth/retoken", {
        token: oldToken,
    })
    .then((res)=>{
        console.log("Refresh token", res);
        window.localStorage.setItem('token',res as unknown as string);
        // setTimeout(reToken, 1000 * 60 * 8); // Referesh the token every 10-2 minutes
    })
    .catch((error)=>{
        console.log(error);
        // window.location.href='/'
    });
}
setInterval(reToken, 1000 * 60 * 5);
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
    return (
        <DevicesProvider>
            <ThemeProvider theme={theme}>
                <Box bgcolor={'#F0F2F5'}>
                    <HashRouter>
                        <Routes>
                            <Route >
                                <Route path='/' element={<Login/>}/>
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
                        </Routes>
                        {/* <RouterProvider router={router}/> */}
                    </HashRouter>
                </Box>
            </ThemeProvider>
        </DevicesProvider>
    )
}

export default App
