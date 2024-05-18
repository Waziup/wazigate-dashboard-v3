import { App } from "waziup";
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