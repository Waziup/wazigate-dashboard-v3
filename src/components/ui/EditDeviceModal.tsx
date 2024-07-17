import { Close, Router } from "@mui/icons-material";
import { Box, FormControl, Modal, SelectChangeEvent, Typography } from "@mui/material";
import { Device } from "waziup";
import RowContainerBetween from "../shared/RowContainerBetween";
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1";
import { SelectElementString } from "../../pages/Automation";
import AddTextShow from "../shared/AddTextInput";
import { Android12Switch } from "../shared/Switch";
import RowContainerNormal from "../shared/RowContainerNormal";
import React, { useContext } from "react";
import { DevicesContext } from "../../context/devices.context";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    // 
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
    handleChangeDeviceCodec: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
import { toStringHelper } from "../../utils";
import PrimaryButton from "../shared/PrimaryButton";
import WaziDevIcon from './wazidev.svg';
import WaziActIcon from './WaziAct.svg';
export default function EditDeviceModal({handleChangeDeviceCodec, isFirst,changeEditMakeLoraWAN, autoGenerateLoraWANOptionsHandler, device, openModal, handleTextInputEditCodec, submitEditDevice, handleNameChange, handleChangeSelectDeviceType, handleToggleModal }: Props) {
    console.log(device);
    const { codecsList } = useContext(DevicesContext)
    if (!device)
        return;
    return (
        <Modal open={openModal} sx={{ borderRadius: 2 }} onClose={handleToggleModal} >
            <Box sx={style}>
                <form onSubmit={submitEditDevice}>
                    <Box px={2} py={.6}>
                        <RowContainerBetween additionStyles={{ p: 2 }}>
                            <Box></Box>
                            <Close onClick={handleToggleModal} sx={{ cursor: 'pointer', color: 'black', fontSize: 20 }} />
                        </RowContainerBetween>
                        <FormControl sx={{ my: 1, width: '100%', borderBottom: '1px solid black' }}>
                            <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                            <input required autoFocus onInput={handleNameChange} name="name" placeholder='Enter device name' value={device.name} style={{ border: 'none', width: '100%', padding: '6px 0', outline: 'none' }} />
                        </FormControl>
                        {
                            isFirst?null:(
                                <>
                                    <DropDownCreateDeviceTab1
                                        handleChangeSelect={handleChangeSelectDeviceType}
                                        value={device.meta.type}
                                        options={[{ name: 'Wazidev Board', id: 'WaziDev', imageurl: WaziDevIcon }, { name: 'Generic board', id: 'GenericBoard', imageurl: WaziActIcon }]}
                                    />
                                    <SelectElementString 
                                        mx={0} my={2} 
                                        title='Device Codec'
                                        name="codec"
                                        value={device.meta.codec} 
                                        handleChange={handleChangeDeviceCodec} 
                                        conditions={codecsList as { id: string, name: string }[]} 
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
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 2 }} >
                            <PrimaryButton type="submit" title="Save" />
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}