import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import * as waziup from 'waziup';
import { BACKEND_URL } from './constants/index.ts';

declare global {
    interface Window {
        wazigate: waziup.Waziup;
    }
}
console.log(waziup);
waziup.connect({
    host: BACKEND_URL,
}).then((wazigate: waziup.Waziup) => {
    window.wazigate = wazigate;
    console.log('Connected to Wazigate')
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}).catch(()=>{
    console.log('Cannot connect to Wazigate');
    (document.getElementById("dashboard") as HTMLElement).innerHTML = "<div style='margin-top: 20%;color:black; text-align: center;border: 1px solid #BBB;border-radius: 5px;padding: 5%;margin-left: 10%;margin-right: 10%;background-color: #EEE;'><h1>Wazigate is not accessible...</h1></div>";
})
