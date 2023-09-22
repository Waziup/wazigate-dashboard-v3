// import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/dashboard'
import Devices from './pages/devices'
import Automation from './pages/automation'
import Apps from './pages/apps'
import Settings from './pages/settings'
import Login from './pages/login'
import Device from './pages/device'
import User from './pages/user'
import DeviceSettings from './pages/device-settings'
import Docspage from './pages/docspage'
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
