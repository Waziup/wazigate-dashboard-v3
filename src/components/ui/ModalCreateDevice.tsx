import { Box, SelectChangeEvent, Typography, Button, Dialog, DialogContent, DialogActions, FormControl, DialogTitle, Input, Stack } from "@mui/material"
import { DropDownCreateDeviceTab1 } from "./CreateDeviceTab1"
import RowContainerBetween from "../shared/RowContainerBetween";
import { Device } from "waziup";
import PrimaryButton from "../shared/PrimaryButton";
import { DEFAULT_COLORS } from "../../constants";
import { RouterOutlined } from "@mui/icons-material";
import AddTextShow from "../shared/AddTextInput";
import RowContainerNormal from "../shared/RowContainerNormal";
import { Android12Switch } from "../shared/Switch";
import { useContext } from "react";
import { DevicesContext } from "../../context/devices.context";
import { TextInput } from "../../pages/Login";

interface CreateDeviceModalWindowProps {
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

export default function CreateDeviceModalWindow(props: CreateDeviceModalWindowProps) {
    const { openModal, handleToggleModal, submitCreateDevice, handleChange, handleChangeSelect, handleChangeDeviceCodec, fullWidth, handleScreenChange, newDevice, changeMakeLoraWAN, onTextInputChange, autoGenerateLoraWANOptionsHandler } = props;
    const { codecsList } = useContext(DevicesContext);
    return (
        <Dialog fullWidth={fullWidth ? undefined : true} open={openModal} onClose={handleToggleModal} PaperProps={{ component: 'form', onSubmit: (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); submitCreateDevice(e) } }}>
            <Box sx={{ ...style, width: fullWidth ? 400 : undefined }}>
                <DialogTitle>Creating New Device</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ my: 0, width: '100%', }}>
                        <TextInput label="Device Name" mendatory>
                            <Input
                                fullWidth
                                placeholder="Enter device name"
                                onInput={handleChange}
                                value={newDevice.name}
                                required
                                sx={{
                                    borderBottom: '1px solid #D5D6D8',
                                    '&:before, &:after': { borderBottom: 'none' }
                                }}
                            />
                        </TextInput>
                    </FormControl>

                    <DropDownCreateDeviceTab1
                        title='Device Codec'
                        name="codec"
                        mt={0}
                        my={2}
                        value={newDevice.meta.codec}
                        handleChangeSelect={handleChangeDeviceCodec}
                        options={codecsList as { id: string, name: string }[]}
                    />
                    <RowContainerBetween additionStyles={{ my: 1 }}>
                        <Stack direction="row" spacing={2}>
                            <RouterOutlined sx={{ mr: 2, fontSize: 24, color: DEFAULT_COLORS.navbar_dark }} />
                            <Typography color={DEFAULT_COLORS.navbar_dark}>Set as LoRaWAN Device</Typography>
                        </Stack>
                        <Android12Switch checked={newDevice.meta.lorawan} onChange={changeMakeLoraWAN} color='secondary' />
                    </RowContainerBetween>
                    {
                        (newDevice.meta.lorawan) && (
                            <Box my={2}>
                                {/* <RowContainerNormal additionStyles={{ gap: 1, alignItems: 'center' }}>
                                    <RouterOutlined sx={{ mr: 2, fontSize: 24, color: DEFAULT_COLORS.navbar_dark }} />
                                    <Typography color={DEFAULT_COLORS.navbar_dark} variant="body2">LoRaWAN Settings</Typography>
                                </RowContainerNormal> */}
                                {/* <SelectElementString mx={0} title={'Label'} handleChange={()=>{}} conditions={['Input','Level','Humidity']} value={'Temperature'} /> */}
                                <AddTextShow autoGenerateHandler={autoGenerateLoraWANOptionsHandler} textInputValue={newDevice.meta.lorawan.devAddr} onTextInputChange={onTextInputChange} name="devAddr" text={'Device Addr (Device Address)'} placeholder={'8 digits required, got 0'} />
                                <AddTextShow autoGenerateHandler={autoGenerateLoraWANOptionsHandler} textInputValue={newDevice.meta.lorawan.nwkSEncKey} onTextInputChange={onTextInputChange} name="nwkSEncKey" text={'NwkSKey(Network Session Key)'} placeholder={'32 digits required, got 0'} />
                                <AddTextShow autoGenerateHandler={autoGenerateLoraWANOptionsHandler} textInputValue={newDevice.meta.lorawan.appSKey} onTextInputChange={onTextInputChange} name="appSKey" text={'AppKey (App Key)'} placeholder={'32 digits required, got 0'} />
                            </Box>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleScreenChange('tab1');
                            handleToggleModal()
                        }}
                        variant={'text'}
                        sx={{ mx: 1, color: '#ff0000' }}
                        color={'info'}
                    >
                        CLOSE
                    </Button>
                    <PrimaryButton
                        title="CREATE"
                        type="submit"
                        variant="text"
                        textColor={(!newDevice.name) ? '#d9d9d9' : DEFAULT_COLORS.primary_blue}
                        disabled={!newDevice.name}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    )
}