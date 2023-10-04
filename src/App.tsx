// import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Automation from './pages/Automation'
import Apps from './pages/Apps'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Device from './pages/Device'
import User from './pages/User'
import DeviceSettings from './pages/device-settings'
import Docspage from './pages/Docspage'
import DeviceSensorSettings from './pages/device-sensor-settings'
function App() {
  const router = createBrowserRouter([
    {
      path:'/auth',
      element:<Login/>
    },
    {
      element: <Layout/>,
      children: [
        {
          path: '/',
          element: <Dashboard/>
        },
        {
          path:'/devices',
          element: <Devices/>
        },
        {
          path:'/devices/:id',
          element:<DeviceSettings/>
        },
        {
          path:'/devices/:id/setting',
          element: <Device/>
        },
        {
          path:'/devices/:id/sensor/setting',
          element: <DeviceSensorSettings/>
        },
        {
          path: '*',
          element: <div>Not Found</div>
        },
        {
          path: '/automation',
          element: <Automation/>
        },
        {
          path:'/apps',
          element:<Apps/>
        },
        {
          path:'/settings',
          element: <Settings/>
        },
        {
          path:'/settings/networking',
          element: <Settings/>
        },
        {
          path:'/settings/maintenance',
          element: <Settings/>
        },
        {
          path:'/user',
          element: <User/>
        },
        {
          path:'/help',
          element: <Docspage/>
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
