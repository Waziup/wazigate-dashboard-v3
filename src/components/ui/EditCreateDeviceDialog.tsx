import { RouterOutlined } from "@mui/icons-material"
import { SelectChangeEvent, Dialog, Box, DialogTitle, DialogContent, FormControl, Input, Stack, Typography, DialogActions, Button } from "@mui/material"
import { useContext } from "react"
import { Device } from "waziup"
import { DEFAULT_COLORS } from "../../constants"
import { DevicesContext } from "../../context/devices.context"
import { InputField } from "../../pages/Login"
import { toStringHelper } from "../../utils"
import AddTextShow from "../shared/AddTextInput"
import RowContainerBetween from "../shared/RowContainerBetween"
import { Android12Switch } from "../shared/Switch"
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1"

interface EditCreateDeviceDialogProps {
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleToggleModal: () => void,
    device: Device,
    openModal: boolean
    isFirst?: boolean
    mode: "edit" | "create"
    matchesWidth?: boolean
    handleChangeSelectDeviceType: (e: SelectChangeEvent<string>) => void
    handleTextInputChangeEditCreateDevice : (e: React.ChangeEvent<HTMLInputElement>) => void
    submitEditDevice: (e: React.FormEvent<HTMLFormElement>) => void
    changeEditMakeLoraWANDevice: () => void,
    autoGenerateLoraWANOptionsHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
    handleChangeDeviceCodec: (event: SelectChangeEvent<string>) => void
}
export default function EditeCreateDeviceDialog(props: EditCreateDeviceDialogProps){
    const { handleNameChange, handleToggleModal,mode, device, openModal, isFirst, matchesWidth, handleChangeDeviceCodec, handleTextInputChangeEditCreateDevice, submitEditDevice, changeEditMakeLoraWANDevice, autoGenerateLoraWANOptionsHandler } = props
    const {codecsList} = useContext(DevicesContext);
    if (!device)
        return;
    return(
        <Dialog fullWidth={matchesWidth ? undefined : true}  open={openModal} onClose={handleToggleModal}  PaperProps={{ component: 'form', onSubmit: (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); submitEditDevice(e) }  }} >
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: matchesWidth ? 400 : undefined }}>
                <DialogTitle>
                    {
                        mode==='edit'?(
                            <p>Edit Device: <em style={{ fontWeight: 400 }}>{device.name}</em></p>
                        ):(
                            'Creating New Device'
                        )
                    }
                </DialogTitle>
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
                                        onChange={changeEditMakeLoraWANDevice}
                                        color='secondary'
                                    />
                                </RowContainerBetween>
                                {
                                    device.meta.lorawan && (
                                        <Box my={2}>
                                            <AddTextShow
                                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                                                name="devAddr"
                                                color={ device.meta.lorawan.devAddr && device.meta.lorawan.devAddr.length > 8 ?"red":"" }
                                                onTextInputChange={handleTextInputChangeEditCreateDevice}
                                                textInputValue={device.meta.lorawan.devAddr}
                                                text={'Device Addr (Device Address)'}
                                                placeholder={'Device Address, 8 digits required, got ' + toStringHelper(device.meta.lorawan.devAddr)}
                                            />
                                            <AddTextShow
                                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                                                name="nwkSEncKey"
                                                color={ (device.meta.lorawan.nwkSEncKey && device.meta.lorawan.nwkSEncKey.length) > 32 ?"red":"" }
                                                onTextInputChange={handleTextInputChangeEditCreateDevice}
                                                textInputValue={device.meta.lorawan.nwkSEncKey}
                                                text={'NwkSKey(Network Session Key)'}
                                                placeholder={'Network Session key 32 digits required, got ' + toStringHelper(device.meta.lorawan.nwkSEncKey)}
                                            />
                                            <AddTextShow
                                                autoGenerateHandler={autoGenerateLoraWANOptionsHandler}
                                                name="appSKey" onTextInputChange={handleTextInputChangeEditCreateDevice}
                                                textInputValue={device.meta.lorawan.appSKey}
                                                color={ (device.meta.lorawan.appSKey &&device.meta.lorawan.appSKey.length) > 32 ?"red":"" }
                                                text={'AppKey (App Key)'}
                                                placeholder={'App Key 32 digits required, got ' + toStringHelper(device.meta.lorawan.appSKey)}
                                            />
                                        </Box>
                                    )
                                }
                            </>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggleModal} variant={'text'} sx={{ mx: 1, color: '#ff0000' }}  color={'info'}>Cancel</Button>
                    <Button disabled={!device.name || (device.meta.lorawan && ((device.meta.lorawan.nwkSEncKey && device.meta.lorawan.nwkSEncKey.length > 32) || (device.meta.lorawan.appSKey && device.meta.lorawan.appSKey.length > 32) || (device.meta.lorawan.devAddr && device.meta.lorawan.devAddr.length > 8))) } variant="text" type="submit" sx={{color: (!device.name) ? '#d9d9d9' :DEFAULT_COLORS.primary_blue}}>Save Changes</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}