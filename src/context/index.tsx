import React from 'react'
import { DevicesProvider } from './devices.context'
import { SettingsProvider } from './settings.context'
import { GlobalProvider } from './global.context'
import { AppsProvider } from './apps.context'

export default function WazigateProvider({children}:{children: React.ReactNode}) {
    return (
        <GlobalProvider>
            <DevicesProvider>
                <AppsProvider>
                    <SettingsProvider>
                        {children}
                    </SettingsProvider>
                </AppsProvider>
            </DevicesProvider>
        </GlobalProvider>
    )
}