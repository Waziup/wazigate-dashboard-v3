// import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/dashboard'
import Devices from './pages/devices'
import Automation from './pages/automation'
import Apps from './pages/apps'
import Settings from './pages/settings'
function App() {
  const router = createBrowserRouter([
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
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
