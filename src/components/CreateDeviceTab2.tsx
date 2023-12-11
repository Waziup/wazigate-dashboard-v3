import { Box, Typography } from "@mui/material";
import { SelectElementString } from "../pages/Automation";
import RowContainerBetween from "./RowContainerBetween";
import { Android12Switch } from "./Switch";
import { AddCircleOutline } from "@mui/icons-material";
import { Device } from "waziup";
interface AddTextProps{
    text:string
    placeholder:string
    textInputValue?:string
    onTextInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
    name?:string
}
interface TabTwoProps{
    selectedValue:string, 
    handleChangeDeviceCodec:(event:  React.ChangeEvent<HTMLSelectElement>)=>void,
    changeMakeLoraWAN:()=>void, 
    makeLoraWAN:boolean
    newDevice: Device
    onTextInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
}
const AddTextShow=({text,name, placeholder,onTextInputChange,textInputValue}:AddTextProps)=>(
    <Box sx={{my:2}}>
        <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center', borderBottom:'1px solid #ccc'}}>
            <input name={name} value={textInputValue} onChange={onTextInputChange} placeholder={text} style={{border:'none',color:'#757474',fontWeight:200, outline:'none',width:'100%',padding:'6px 0'}} />
            <AddCircleOutline sx={{color:'#292F3F', fontSize:20}} />
        </Box>
        <Typography fontSize={10} my={.5} color={'#292F3F'} fontWeight={200}>{placeholder}</Typography>
    </Box>
)
export default function CreateDeviceTabTwo({selectedValue,onTextInputChange,newDevice, changeMakeLoraWAN, handleChangeDeviceCodec,makeLoraWAN}:TabTwoProps){
    return(
        <Box>
            <SelectElementString mx={0} title='Device Codec' value={selectedValue} handleChange={handleChangeDeviceCodec} conditions={['JSON','b']} />
            <RowContainerBetween additionStyles={{my:1}}>
                <Typography fontSize={13}>LoRAWAN Device</Typography>
                <Android12Switch onChange={changeMakeLoraWAN} color='info' />
            </RowContainerBetween>
            {
                makeLoraWAN && (
                    <Box my={2}>
                        <SelectElementString mx={0} title={'Label'} handleChange={()=>{}} conditions={['Input','Level','Humidity']} value={'Temperature'} />
                        <AddTextShow textInputValue={newDevice.meta.device_addr} onTextInputChange={onTextInputChange} name="device_addr" text={'Device Addr (Device Address)'}  placeholder={'8 digits required, got 0'} />
                        <AddTextShow textInputValue={newDevice.meta.nwkskey} onTextInputChange={onTextInputChange} name="nwkskey" text={'NwkSKey(Network Session Key)'}  placeholder={'32 digits required, got 0'} />
                        <AddTextShow textInputValue={newDevice.meta.appkey} onTextInputChange={onTextInputChange} name="appkey" text={'AppKey (App Key)'}  placeholder={'32 digits required, got 0'} />
                    </Box>
                )
            }
            
        </Box>
    )
    
}