// import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
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
    const router = createBrowserRouter([
        {
            path:'/',
            element:<Login/>
        },
        {
            element: <Layout/>,
            children: [
                {
                    path: '/dashboard',
                    element: <Dashboard/>
                },
                {
                    path:'/devices',
                    element: <Devices/>
                },
                {
                    path:'/devices/:id',
                    element:<Device/>
                },
                {
                    path:'/devices/:id/settings',
                    element:<DeviceSettings/>
                },
                {
                    path:'/devices/:id/sensors/:sensorId',
                    element: <DeviceSensor/>
                },
                {
                    path:'/devices/:id/sensors/:sensorId/settings',
                    element: <DeviceSensorSettings/>
                },
                {
                    path:'/devices/:id/actuators/:sensorId',
                    element: <DeviceSensor/>
                },
                {
                    path:'/devices/:id/actuators/:sensorId/settings',
                    element: <DeviceSensorSettings/>
                },
                {
                    path: '*',
                    element: <div>Not Found</div>
                },
                // {
                //     path: '/automation',
                //     element: <Automation/>
                // },
                {
                    path:'/apps',
                    element:<Apps/>
                },
                {
                    path:'/apps/:id/:id2/',
                    element: <AppUI/>
                },
                {
                    path:'/settings',
                    element: <Settings/>
                },
                {
                    path:'/settings/networking',
                    element: <SettingsNetworking/>
                },
                {
                    path:'/settings/maintenance',
                    element: <SettingsMaintenance/>
                },
                {
                    path:'/user',
                    element: <User/>
                },
                {
                    path:'/help',
                    element: <Docspage/>
                },
                {
                    path:'/docs',
                    element: <Box height={'100vh'}><iframe width="100%" height="100%" className="app" src="/docs/" /></Box>
                }
            ]
        }
    ])
    return (
        <DevicesProvider>
            <ThemeProvider theme={theme}>
                <Box bgcolor={'#F0F2F5'}>
                    <RouterProvider router={router}/>
                </Box>
            </ThemeProvider>
        </DevicesProvider>
    )
}

export default App
