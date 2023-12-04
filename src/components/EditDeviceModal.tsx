import { Close, Router } from "@mui/icons-material";
import { Box, FormControl, Modal, Typography } from "@mui/material";
import { Device } from "waziup";
import RowContainerBetween from "./RowContainerBetween";
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1";
import { SelectElementString } from "../pages/Automation";
import AddTextShow from "./AddTextInput";
import { Android12Switch } from "./Switch";
import RowContainerNormal from "./RowContainerNormal";
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
export default function EditDeviceModal({device,openModal,handleToggleModal}:{ handleToggleModal: () => void, device:Device,openModal:boolean}){
    console.log(device);
    const handleChangeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    };
    if(!device)
        return;
    return(
        <Modal open={openModal} sx={{borderRadius:2}} onClose={handleToggleModal} >
            <Box sx={style}>
                <RowContainerBetween>
                    <Box></Box>                
                    <Close onClick={handleToggleModal} sx={{cursor:'pointer',color:'black', fontSize:20}} />
                </RowContainerBetween>
                <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid black'}}>
                    <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                    <input autoFocus onInput={()=>{}} name="name" placeholder='Enter device name' value={device.name} style={{border:'none',width:'100%',padding:'6px 0', outline:'none'}}/>
                </FormControl>
                <DropDownCreateDeviceTab1 
                    age="a"  
                    handleChangeSelect={handleChangeSelect} 
                    selectedValue="b"  
                    options={[{name:'Wazidev Board',imageurl:'wazidev.svg'},{name:'Generic board',imageurl:'/WaziAct.svg'}]} 
                    
                />
                <SelectElementString mx={0} my={2} title='Device Codec' value={'JSON'} handleChange={()=>{}} conditions={['JSON','b']} />
                <RowContainerBetween additionStyles={{my:1}}>
                    <RowContainerNormal>
                        <Router sx={{mx:1, fontSize: 20,color:'primary.main' }} />
                        <Typography color={'primary.main'} fontSize={13}>LoRAWAN Settings</Typography>
                    </RowContainerNormal>
                    <Android12Switch onChange={()=>{}} color='info' />
                </RowContainerBetween>
                <Box my={2}>
                    <SelectElementString mx={0} title={'Label'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                    <AddTextShow text={'Device Addr (Device Address)'}  placeholder={'8 digits required, got 0'} />
                    <AddTextShow text={'NwkSKey(Network Session Key)'}  placeholder={'32 digits required, got 0'} />
                    <AddTextShow text={'AppKey (App Key)'}  placeholder={'32 digits required, got 0'} />
                </Box>
               
            </Box>
        </Modal>
    )
}