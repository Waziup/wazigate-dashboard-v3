export const DEFAULT_COLORS={
    primary_blue:'#3693c4',
    primary_blue_light:'#e5f6fd',
    orange: '#F35E19',
    primary_black:'#000',
    secondary_black:'#000000',
    third_dark:'#325460',
    secondary_gray:'#D5D6D8',
    navbar_dark:'#292F3F'
}
export const WaziGateApiUrl=import.meta.env.VITE_WAZIGATE_API_URL || '.'

// set WaziGateApiUrl to localhost when running with a local wazigate-edge server
//export const WaziGateApiUrl='http://localhost'