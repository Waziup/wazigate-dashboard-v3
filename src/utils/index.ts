import { App, Device } from "waziup";
export function differenceInMinutes(date:Date){
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    return Math.abs(Math.round(diff));

}
export function toStringHelper(value:string){
    if(value){
        return value.toString().length;
    }
    return 0;
}
export const devEUIGenerateFc = (devAddr: string) => "AA555A00" + devAddr;
export function capitalizeFirstLetter(value:string){
    if(!value){
        return '';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}
export function isActiveDevice(modifiedTime: Date): boolean{
    const now = new Date();
    const modified = new Date(modifiedTime);
    const diff = now.getTime() - modified.getTime();
    const diffInMinutes = Math.floor(diff / 1000 / 60);
    return diffInMinutes < 7;
}
export function allActiveDevices(devices: Device[]): number{
    let count = 0;
    devices.forEach((device)=>{
        if(isActiveDevice(device.modified)){
            count++;
        }
    });
    return count;
}
export function humanFileSize(size: number ) {
    const  i = Math.floor(Math.log(size) / Math.log(1024));
    return (
        ((size / Math.pow(1024, i)).toFixed(2) as unknown as number) * 1 +
        " " +
        ["B", "kB", "MB", "GB", "TB"][i]
    );
}
export function removeFirstChar(value:string,capitalize?:boolean){
    if(value && value.startsWith('#')&& value.length>1){
        const val = value.slice(1);
        if(capitalize){
            return capitalizeFirstLetter(val);
        }
        return value.slice(1);
    }
    return value;
}
export function returnAppURL(app:App): string{
    if(app.id.includes('lora')){
        return `/apps/waziup/${app.name}`;
    }else if(app.waziapp.menu){
        return removeFirstChar(Object.values(app.waziapp.menu? app.waziapp.menu:[]).length>0?Object.values(app.waziapp.menu? app.waziapp.menu:[])[0].href:'')
    }else{
        return ''
    }
}
export const removeSpecialChars = (value:string) => {
    return value.replace(/[/""]/gi, '');
}
export function time_ago(time: string | number | Date | null) {
    if (!time || time === null || time === '') //should be all the same
        return "";

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date)
            time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    const time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - (time as number)) / 1000,
        token = 'ago',
        list_choice = 1;
  
    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    let i = 0,
      format;
    // eslint-disable-next-line no-cond-assign
    while (format = time_formats[i++])
        if (seconds < Number(format[0])) {
            if (typeof format[2] == 'string')
                return "Last updated "+format[list_choice];
            else
                return "Last Updated "+Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
    return time;
  }