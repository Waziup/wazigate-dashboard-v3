import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import * as waziup from 'waziup';
import 'material-icons/iconfont/material-icons.css';
import { DevicesProvider } from './context/devices.context.tsx';
declare global {
    interface Window {
        wazigate: waziup.Waziup;
    }
}
waziup.connect({
    host: '.',
}).then((res) => {
    window.wazigate = res.waziup;
    window.wazigate.connectMQTT(() => {
        console.log("MQTT Connected.");
    }, (err: Error) => {
        console.error("MQTT Err", err);
    }, {
        reconnectPeriod: 0,
    });
    console.log('Connected to Wazigate')
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <DevicesProvider>
                <App />
            </DevicesProvider>
        </React.StrictMode>,
    )
}).catch(()=>{
    (document.getElementById("dashboard") as HTMLElement).innerHTML = "<div style='margin-top: 10%;color:black; text-align: center;border: 1px solid #BBB;border-radius: 5px;padding: 5%;margin-left: 10%;margin-right: 10%;background-color: #EEE;'><h1>Wazigate is not accessible...</h1></div>";
})
