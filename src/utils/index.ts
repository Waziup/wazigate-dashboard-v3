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
export function capitalizeFirstLetter(value:string){
    return value.charAt(0).toUpperCase() + value.slice(1);
}