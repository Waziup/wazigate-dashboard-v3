import { ArrowBack, Close } from "@mui/icons-material"
import { Modal, Box, Button } from "@mui/material"
import CreateDeviceTab1 from "./CreateDeviceTab1"
import CreateDeviceTabTwo from "./CreateDeviceTab2"
import RowContainerBetween from "./RowContainerBetween";
interface Props{
    openModal:boolean
    handleToggleModal:()=>void
    submitCreateDevice:(e: React.FormEvent<HTMLFormElement>)=>void
    handleChange:(event: React.ChangeEvent<HTMLInputElement>)=>void
    handleChangeSelect:(event: React.ChangeEvent<HTMLInputElement>)=>void
    selectedValue:string
    screen:string
    handleScreenChange:(tab:'tab1'|'tab2')=>void
    blockOnClick: (va:string)=>void,
    deviceName:string
    changeMakeLoraWAN:()=>void
    makeLoraWAN:boolean

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
export default function CreateDeviceModalWindow({openModal,handleToggleModal,submitCreateDevice,handleChange,handleChangeSelect,selectedValue,screen,handleScreenChange,blockOnClick,deviceName,changeMakeLoraWAN,makeLoraWAN}:Props){
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
                                        <CreateDeviceTab1 blockOnClick={blockOnClick} deviceName={deviceName} handleChange={handleChange} handleChangeSelect={handleChangeSelect} selectedValue={selectedValue} />
                                    ):(
                                        <CreateDeviceTabTwo
                                            handleChange={()=>{}}
                                            changeMakeLoraWAN={changeMakeLoraWAN}
                                            makeLoraWAN={makeLoraWAN} 
                                            selectedValue={selectedValue} 
                                        />
                                    )
                                }
                                <Box pt={2}>
                                    <Button onClick={()=>{handleScreenChange('tab2')}} sx={{mx:2, color:'#fff'}} variant="contained" color="info" type={'button'}>{screen==='tab1'?'NEXT':'CREATE'}</Button>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
        </Modal>
    )
}