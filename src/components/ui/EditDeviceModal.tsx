import { Router } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, SelectChangeEvent, Typography } from "@mui/material";
import { Device } from "waziup";
import RowContainerBetween from "../shared/RowContainerBetween";
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1";
import AddTextShow from "../shared/AddTextInput";
import { Android12Switch } from "../shared/Switch";
import RowContainerNormal from "../shared/RowContainerNormal";
import React, { useContext } from "react";
import { DevicesContext } from "../../context/devices.context";
const style = {
    // width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
};
interface Props {
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleToggleModal: () => void,
    device: Device,
    openModal: boolean
    isFirst?: boolean
    handleChangeSelectDeviceType: (e: SelectChangeEvent<string>) => void
    handleTextInputEditCodec: (e: React.ChangeEvent<HTMLInputElement>) => void
    submitEditDevice: (e: React.FormEvent<HTMLFormElement>) => void
    changeEditMakeLoraWAN: () => void,
    autoGenerateLoraWANOptionsHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
    handleChangeDeviceCodec: (event: SelectChangeEvent<string>) => void
}
import { toStringHelper } from "../../utils";
import PrimaryButton from "../shared/PrimaryButton";
import { DEFAULT_COLORS } from "../../constants";
export default function EditDeviceModal({handleChangeDeviceCodec, isFirst,changeEditMakeLoraWAN, autoGenerateLoraWANOptionsHandler, device, openModal, handleTextInputEditCodec, submitEditDevice, handleNameChange, handleChangeSelectDeviceType, handleToggleModal }: Props) {
    const { codecsList } = useContext(DevicesContext)
    if (!device)
        return;
    return (
        <Dialog open={openModal} onClose={handleToggleModal} PaperProps={{component:'form', onSubmit:(e: React.FormEvent<HTMLFormElement>)=>{e.preventDefault(); submitEditDevice(e) } }}>
            <Box sx={style}>
                <DialogTitle>{device.name}</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ my: 0, width: '100%', borderBottom: '1px solid black' }}>
                        <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                        <input required autoFocus onInput={handleNameChange} name="name" placeholder='Enter device name' value={device.name} style={{background:'none', border: 'none', width: '100%', padding: '6px 0', outline: 'none' }} />
                    </FormControl>
                    {
                        isFirst?null:(
                            <>
                                <DropDownCreateDeviceTab1
                                    handleChangeSelect={handleChangeSelectDeviceType}
                                    value={device.meta.type}
                                    options={[{ name: 'Wazidev Board', id: 'WaziDev' }, { name: 'Generic board', id: 'generic' }]}
                                />
                                <DropDownCreateDeviceTab1
                                    title='Device Codec'
                                    name="codec"
                                    value={device.meta.codec} 
                                    handleChangeSelect={handleChangeDeviceCodec} 
                                    options={codecsList as { id: string, name: string }[]} 
                                />
                                <RowContainerBetween additionStyles={{ my: 1 }}>
                                    <RowContainerNormal>
                                        <Router sx={{ mx: 1, fontSize: 20, color: 'primary.main' }} />
                                        <Typography color={'primary.main'} fontSize={13}>{device.meta.lorawan ? 'LoraWAN Settings' : 'Make LoraWAN'} </Typography>
                                    </RowContainerNormal>
                                    <Android12Switch checked={device.meta.lorawan} onChange={changeEditMakeLoraWAN} color='info' />
                                </RowContainerBetween>
                                {
                                    device.meta.lorawan ? (
                                        <>
                                            <Box my={2}>
                                                <AddTextShow autoGenerateHandler={autoGenerateLoraWANOptionsHandler} name="devAddr" onTextInputChange={handleTextInputEditCodec} textInputValue={device.meta.lorawan.devAddr} text={'Device Addr (Device Address)'} placeholder={'Device Address, 8 digits required, got ' + toStringHelper(device.meta.lorawan.devAddr)} />
                                                <AddTextShow autoGenerateHandler={autoGenerateLoraWANOptionsHandler} name="nwkSEncKey" onTextInputChange={handleTextInputEditCodec} textInputValue={device.meta.lorawan.nwkSEncKey} text={'NwkSKey(Network Session Key)'} placeholder={'Network Session key 32 digits required, got ' + toStringHelper(device.meta.lorawan.nwkSEncKey)} />
                                                <AddTextShow autoGenerateHandler={autoGenerateLoraWANOptionsHandler} name="appSKey" onTextInputChange={handleTextInputEditCodec} textInputValue={device.meta.lorawan.appSKey} text={'AppKey (App Key)'} placeholder={'App Key 32 digits required, got ' + toStringHelper(device.meta.lorawan.appSKey)} />
                                            </Box>
                                        </>
                                    ) : null
                                }
                            </>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggleModal} variant={'text'} sx={{ mx: 1,color:'#ff0000' }} color={'info'}>CLOSE</Button>
                    <PrimaryButton variant="text" textColor={DEFAULT_COLORS.primary_blue} type="submit" title="Save" />
                </DialogActions>
            </Box>
        </Dialog>
    )
}