import { Close, Router } from "@mui/icons-material";
import { Box, Button, FormControl, Modal,  SelectChangeEvent,  Typography } from "@mui/material";
import { Device } from "waziup";
import RowContainerBetween from "./RowContainerBetween";
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1";
import { SelectElementString } from "../pages/Automation";
import AddTextShow from "./AddTextInput";
import { Android12Switch } from "./Switch";
import RowContainerNormal from "./RowContainerNormal";
import React from "react";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius:2,
};
interface Props{
    handleNameChange:(e:React.ChangeEvent<HTMLInputElement>)=>void, 
    handleToggleModal: () => void, 
    device:Device,
    openModal:boolean
    handleChangeSelectDeviceType: (e:SelectChangeEvent<string>)=>void
    handleTextInputEditCodec: (e:React.ChangeEvent<HTMLInputElement>)=>void
    submitEditDevice:(e: React.FormEvent<HTMLFormElement>)=>void
}
export default function EditDeviceModal({device,openModal,handleTextInputEditCodec,submitEditDevice, handleNameChange,handleChangeSelectDeviceType, handleToggleModal}:Props){
    console.log(device);
    if(!device)
        return;
    return(
        <Modal open={openModal} sx={{borderRadius:2}} onClose={handleToggleModal} >
            <Box sx={style}>
                <form onSubmit={submitEditDevice}>
                    <RowContainerBetween>
                        <Box></Box>                
                        <Close onClick={handleToggleModal} sx={{cursor:'pointer',color:'black', fontSize:20}} />
                    </RowContainerBetween>
                    <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid black'}}>
                        <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                        <input required autoFocus onInput={handleNameChange} name="name" placeholder='Enter device name' value={device.name} style={{border:'none',width:'100%',padding:'6px 0', outline:'none'}}/>
                    </FormControl>
                    <DropDownCreateDeviceTab1 
                        handleChangeSelect={handleChangeSelectDeviceType}
                        value={device.meta.type}
                        options={[{name:'Wazidev Board',id:'wazidev', imageurl:'wazidev.svg'},{name:'Generic board',id:'genericboard', imageurl:'/WaziAct.svg'}]}
                    />
                    <SelectElementString mx={0} my={2} title='Device Codec' value={'JSON'} handleChange={()=>{}} conditions={['JSON','b']} />
                    <RowContainerBetween additionStyles={{my:1}}>
                        <RowContainerNormal>
                            <Router sx={{mx:1, fontSize: 20,color:'primary.main' }} />
                            <Typography color={'primary.main'} fontSize={13}>LoRAWAN Settings</Typography>
                        </RowContainerNormal>
                        <Android12Switch checked={device.meta.is_lorawan} onChange={()=>{}} color='info' />
                    </RowContainerBetween>
                    <Box my={2}>
                        <SelectElementString mx={0} title={'Label'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                        <AddTextShow name="device_addr" onTextInputChange={handleTextInputEditCodec} textInputValue={device.meta.device_addr} text={'Device Addr (Device Address)'}  placeholder={'8 digits required, got 0'} />
                        <AddTextShow name="nwkskey" onTextInputChange={handleTextInputEditCodec} textInputValue={device.meta.nwkskey} text={'NwkSKey(Network Session Key)'}  placeholder={'32 digits required, got 0'} />
                        <AddTextShow name="appkey" onTextInputChange={handleTextInputEditCodec} textInputValue={device.meta.appkey} text={'AppKey (App Key)'}  placeholder={'32 digits required, got 0'} />
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'space-between', alignItems:'center',pt:2}} >
                        <Box></Box>
                        <Button type="submit" sx={{mx:2, color:'#fff'}} variant="contained" color="info" >EDIT</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}