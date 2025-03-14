import { Router, RouterOutlined } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { Device } from "waziup";
import RowContainerBetween from "../shared/RowContainerBetween";
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1";
import AddTextShow from "../shared/AddTextInput";
import { Android12Switch } from "../shared/Switch";
import RowContainerNormal from "../shared/RowContainerNormal";
import React, { useContext } from "react";
import { DevicesContext } from "../../context/devices.context";
import { toStringHelper } from "../../utils";
import PrimaryButton from "../shared/PrimaryButton";
import { DEFAULT_COLORS } from "../../constants";
import { InputField } from "../../pages/Login";

interface EditDeviceModalProps {
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleToggleModal: () => void,
    device: Device,
    openModal: boolean
    isFirst?: boolean
    matchesWidth?: boolean
    handleChangeSelectDeviceType: (e: SelectChangeEvent<string>) => void
    handleTextInputEditCodec: (e: React.ChangeEvent<HTMLInputElement>) => void
    submitEditDevice: (e: React.FormEvent<HTMLFormElement>) => void
    changeEditMakeLoraWAN: () => void,
    autoGenerateLoraWANOptionsHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
    handleChangeDeviceCodec: (event: SelectChangeEvent<string>) => void
}
export default function EditDeviceModal(props: EditDeviceModalProps) {
    const { handleNameChange, handleToggleModal, device, openModal, isFirst, matchesWidth, handleChangeDeviceCodec, handleTextInputEditCodec, submitEditDevice, changeEditMakeLoraWAN, autoGenerateLoraWANOptionsHandler } = props
    const { codecsList } = useContext(DevicesContext)
    if (!device)
        return;
    return (
        <Dialog
            fullWidth={matchesWidth ? undefined : true}
            open={openModal}
            onClose={handleToggleModal}
            PaperProps={{
                component: 'form',
                onSubmit: (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); submitEditDevice(e) }
            }}
        >
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: matchesWidth ? 400 : undefined }}>
                <DialogTitle>Edit Device: <em style={{ fontWeight: 400 }}>{device.name}</em></DialogTitle>
                <DialogContent>
                    <FormControl sx={{ my: 0, width: '100%', }}>
                        <InputField label="Device Name" mendatory>
                            <Input
                                fullWidth
                                autoFocus
                                required
                                placeholder="Enter device name"
                                name="name"
                                onInput={handleNameChange}
                                value={device.name}
                                sx={{
                                    borderBottom: '1px solid #D5D6D8',
                                    '&:before, &:after': { borderBottom: 'none' }
                                }}
                            />
                        </InputField>
                    </FormControl>
                    {
                        isFirst ? null : (
                            <>
                                <DropDownCreateDeviceTab1
                                    title='Device Codec'
                                    name="codec"
                                    my={2}
                                    // matchesWidth={matchesWidth}
                                    value={device.meta.codec}
                                    handleChangeSelect={handleChangeDeviceCodec}
                                    options={codecsList as { id: string, name: string }[]}
                                />
                                <RowContainerBetween additionStyles={{ my: 1 }}>
                                    <Stack direction="row" spacing={1}>
                                        <RouterOutlined sx={{ mr: 2, fontSize: 24, color: DEFAULT_COLORS.navbar_dark }} />
                                        <Typography color={DEFAULT_COLORS.navbar_dark}>Set as LoRaWAN Device</Typography>
                                    </Stack>
                                    <Android12Switch
                                        checked={device.meta.lorawan}
                                        onChange={changeEditMakeLoraWAN}
                                        color='secondary'
                                    />
                                </RowContainerBetween>
                                {
                                    device.meta.lorawan && (
                                        <Box my={2}>
                                            <AddTextShow
                                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                                                name="devAddr"
                                                onTextInputChange={handleTextInputEditCodec}
                                                textInputValue={device.meta.lorawan.devAddr}
                                                text={'Device Addr (Device Address)'}
                                                placeholder={'Device Address, 8 digits required, got ' + toStringHelper(device.meta.lorawan.devAddr)}
                                            />
                                            <AddTextShow
                                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                                                name="nwkSEncKey"
                                                onTextInputChange={handleTextInputEditCodec}
                                                textInputValue={device.meta.lorawan.nwkSEncKey}
                                                text={'NwkSKey(Network Session Key)'}
                                                placeholder={'Network Session key 32 digits required, got ' + toStringHelper(device.meta.lorawan.nwkSEncKey)}
                                            />
                                            <AddTextShow
                                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                                                name="appSKey" onTextInputChange={handleTextInputEditCodec}
                                                textInputValue={device.meta.lorawan.appSKey}
                                                text={'AppKey (App Key)'}
                                                placeholder={'App Key 32 digits required, got ' + toStringHelper(device.meta.lorawan.appSKey)}
                                            />
                                        </Box>
                                    )}
                            </>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleToggleModal}
                        variant={'text'}
                        sx={{ mx: 1, color: '#ff0000' }}
                        color={'info'}
                    >
                        Cancel
                    </Button>
                    <PrimaryButton
                        title="Save Changes"
                        type="submit"
                        variant="text"
                        textColor={DEFAULT_COLORS.primary_blue}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    )
}