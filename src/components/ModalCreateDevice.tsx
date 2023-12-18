import { ArrowBack, Close } from "@mui/icons-material"
import { Modal, Box, Button, SelectChangeEvent } from "@mui/material"
import CreateDeviceTab1 from "./CreateDeviceTab1"
import CreateDeviceTabTwo from "./CreateDeviceTab2"
import RowContainerBetween from "./RowContainerBetween";
import { Device } from "waziup";
interface Props{
    openModal:boolean
    handleToggleModal:()=>void
    submitCreateDevice:(e: React.FormEvent<HTMLFormElement>)=>void
    handleChange:(event: React.ChangeEvent<HTMLInputElement>)=>void
    handleChangeSelect:(event: SelectChangeEvent<string>)=>void
    handleChangeDeviceCodec:(event: React.ChangeEvent<HTMLSelectElement>)=>void
    selectedValue:string
    screen:string
    handleScreenChange:(tab:'tab1'|'tab2')=>void
    blockOnClick: (va:string)=>void,
    newDevice: Device,
    changeMakeLoraWAN:()=>void
    onTextInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void

}
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
const IconStyle = {
    cursor:'pointer',
    color:'black',
}
export default function CreateDeviceModalWindow({openModal,onTextInputChange, handleChangeDeviceCodec, handleToggleModal,submitCreateDevice,handleChange,handleChangeSelect,selectedValue,screen,handleScreenChange,blockOnClick,newDevice,changeMakeLoraWAN,}:Props){
    return(
        <Modal
                open={openModal}
                onClose={handleToggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Box sx={style}>
                        <RowContainerBetween>
                            {
                                screen==='tab2'?(
                                    <ArrowBack onClick={()=>{handleScreenChange('tab1')}} sx={{...IconStyle, fontSize:20}} />
                                ):(
                                    <Box></Box>
                                )
                            }
                            <Close onClick={handleToggleModal} sx={{...IconStyle, fontSize:20}} />
                        </RowContainerBetween>
                        <Box p={2}>
                            <form onSubmit={submitCreateDevice}>
                                {
                                    screen==='tab1'?(
                                        <CreateDeviceTab1
                                            blockOnClick={blockOnClick} 
                                            newDevice={newDevice}
                                            handleChange={handleChange} 
                                            handleChangeSelect={handleChangeSelect}
                                        />
                                    ):(
                                        <CreateDeviceTabTwo
                                            handleChangeDeviceCodec={handleChangeDeviceCodec}
                                            changeMakeLoraWAN={changeMakeLoraWAN}
                                            makeLoraWAN={newDevice.meta.is_lorawan}
                                            onTextInputChange={onTextInputChange as (e:React.ChangeEvent<HTMLInputElement>)=>void}
                                            newDevice={newDevice}
                                            selectedValue={selectedValue} 
                                        />
                                    )
                                }
                                <Box sx={{display:'flex',justifyContent:'space-between', alignItems:'center',pt:2}} >
                                    <Box></Box>
                                    {
                                        screen==='tab2'?(
                                            <Button sx={{mx:2, color:'#fff'}} variant="contained" color="info" type="submit">CREATE</Button>
                                        ):null
                                    }
                                    {
                                        screen==='tab1'?(
                                            <Button onClick={()=>{handleScreenChange('tab2')}} sx={{mx:2, color:'#fff'}} variant="contained" color="info" type="button">NEXT</Button>
                                        ):null
                                    }
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
        </Modal>
    )
}