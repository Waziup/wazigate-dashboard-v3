import { Box, Typography } from "@mui/material";
import { SelectElementString } from "../pages/Automation";
import { AddTextShow } from "../pages/DeviceSettings";
import RowContainerBetween from "./RowContainerBetween";
import { Android12Switch } from "./Switch";

export default function CreateDeviceTabTwo({selectedValue}:{selectedValue:string}){
    return(
        <Box>
            <SelectElementString mx={0} title='Device Codec' value={selectedValue} handleChange={()=>{}} conditions={['JSON','b']} />
            <RowContainerBetween additionStyles={{my:1}}>
                <Typography fontSize={13}>LoRAWAN Device</Typography>
                <Android12Switch color='info' />
            </RowContainerBetween>
            <Box my={2}>
                <SelectElementString mx={0} title={'Label'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                <AddTextShow text={'Device Addr (Device Address)'}  placeholder={'8 digits required, got 0'} />
                <AddTextShow text={'NwkSKey(Network Session Key)'}  placeholder={'32 digits required, got 0'} />
                <AddTextShow text={'AppKey (App Key)'}  placeholder={'32 digits required, got 0'} />
            </Box>
        </Box>
    )
    
}