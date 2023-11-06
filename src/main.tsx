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

waziup.connect({
    host: BACKEND_URL,
}).then((wazigate: waziup.Waziup) => {
    window.wazigate = wazigate;

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
})
