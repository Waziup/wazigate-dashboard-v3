import { ArrowBack, } from "@mui/icons-material"
import { Box, SelectChangeEvent, Typography, Button, Dialog, DialogContent, DialogActions } from "@mui/material"
import CreateDeviceTab1 from "./CreateDeviceTab1"
import CreateDeviceTabTwo from "./CreateDeviceTab2"
import RowContainerBetween from "../shared/RowContainerBetween";
import { Device } from "waziup";
import PrimaryButton from "../shared/PrimaryButton";
import RowContainerNormal from "../shared/RowContainerNormal";
import { DEFAULT_COLORS } from "../../constants";
interface Props {
    openModal: boolean
    handleToggleModal: () => void
    submitCreateDevice: (e: React.FormEvent<HTMLFormElement>) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleChangeSelect: (event: SelectChangeEvent<string>) => void
    handleChangeDeviceCodec: (e: SelectChangeEvent<string>) => void
    selectedValue: string
    screen: string
    fullWidth: boolean,
    handleScreenChange: (tab: 'tab1' | 'tab2') => void
    blockOnClick: (va: string) => void,
    newDevice: Device,
    changeMakeLoraWAN: () => void
    onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    autoGenerateLoraWANOptionsHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
}
const style = {
    bgcolor: 'background.paper',
    p: 0,
};
const IconStyle = {
    cursor: 'pointer',
    color: 'black',
}
export default function CreateDeviceModalWindow({fullWidth, openModal, autoGenerateLoraWANOptionsHandler, onTextInputChange, handleChangeDeviceCodec, handleToggleModal, submitCreateDevice, handleChange, handleChangeSelect, selectedValue, screen, handleScreenChange, blockOnClick, newDevice, changeMakeLoraWAN, }: Props) {
    return (
        <Dialog fullWidth={fullWidth?undefined:true} open={openModal} onClose={handleToggleModal}  PaperProps={{component:'form', onSubmit:(e: React.FormEvent<HTMLFormElement>)=>{e.preventDefault(); submitCreateDevice(e) } }}>
            <Box sx={{...style,width:fullWidth?400:undefined}}>
                <RowContainerBetween additionStyles={{p:2}}>
                    {
                        screen === 'tab2' ? (
                            <RowContainerNormal>
                                <ArrowBack onClick={() => { handleScreenChange('tab1') }} sx={{ ...IconStyle, fontSize: 20 }} />
                                <Typography mx={2}>{newDevice.name} settings</Typography>
                            </RowContainerNormal>
                        ) : (
                            <Box>
                                <Typography color={'#000'} fontWeight={600} >Create a new Device</Typography>
                            </Box>
                        )
                    }
                </RowContainerBetween>
                <DialogContent>
                    {
                        screen === 'tab1' ? (
                            <CreateDeviceTab1
                                blockOnClick={blockOnClick}
                                newDevice={newDevice}
                                handleChange={handleChange}
                                handleChangeSelect={handleChangeSelect}
                            />
                        ) : (
                            <CreateDeviceTabTwo
                                handleChangeDeviceCodec={handleChangeDeviceCodec}
                                changeMakeLoraWAN={changeMakeLoraWAN}
                                makeLoraWAN={newDevice.meta.lorawan}
                                onTextInputChange={onTextInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                                newDevice={newDevice}
                                selectedValue={selectedValue}
                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                            />
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleScreenChange('tab1'); handleToggleModal() }} variant={'text'} sx={{ mx: 1,color:'#ff0000' }} color={'info'}>CLOSE</Button>
                    {
                        screen === 'tab2' ? (
                            <PrimaryButton textColor={(!newDevice.name || !newDevice.meta.type)?'#d9d9d9':DEFAULT_COLORS.primary_blue} variant="text" disabled={!newDevice.name || !newDevice.meta.type} title="CREATE" type="submit" />
                        ) : null
                    }
                    {
                        screen === 'tab1' ? (
                            <PrimaryButton textColor={(!newDevice.name || !newDevice.meta.type)?'#d9d9d9':DEFAULT_COLORS.primary_blue} variant="text" disabled={!newDevice.name || !newDevice.meta.type} title="NEXT" onClick={() => { handleScreenChange('tab2') }} />
                        ) : null
                    }
                </DialogActions>
            </Box>
        </Dialog>
    )
}