import { Box, Tooltip, Typography } from "@mui/material";
import { SelectElementString } from "../../pages/Automation";
import RowContainerBetween from "../shared/RowContainerBetween";
import { Android12Switch } from "../shared/Switch";
import { AddCircleOutline, RouterOutlined } from "@mui/icons-material";
import { Device } from "waziup";
import { DEFAULT_COLORS } from "../../constants";
import RowContainerNormal from "../shared/RowContainerNormal";
import { useContext } from "react";
import { DevicesContext } from "../../context/devices.context";
interface AddTextProps {
    text: string
    isPlusHidden?: boolean
    isReadOnly?: boolean
    placeholder: string
    textInputValue?: string
    onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
    autoGenerateHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
}
interface TabTwoProps {
    selectedValue: string,
    handleChangeDeviceCodec: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    changeMakeLoraWAN: () => void,
    makeLoraWAN: boolean
    newDevice: Device
    onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    autoGenerateHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
}
const AddTextShow = ({ text,isPlusHidden,isReadOnly, name, autoGenerateHandler, placeholder, onTextInputChange, textInputValue }: AddTextProps) => (
    <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
            <input readOnly={isReadOnly} name={name} value={textInputValue} onInput={onTextInputChange} onChange={onTextInputChange} placeholder={text} style={{ border: 'none', color: '#757474', fontWeight: 200, outline: 'none', width: '100%', padding: '6px 0' }} />
            {
                isPlusHidden ? null : (
                    <Tooltip onClick={() => autoGenerateHandler(name as "devAddr" | "nwkSEncKey" | "appSKey")} title="AutoGenerate">
                        <AddCircleOutline sx={{ color: '#292F3F', fontSize: 20 }} />
                    </Tooltip>
                )
            }
        </Box>
        <Typography fontSize={10} my={.5} color={'#292F3F'} fontWeight={200}>{placeholder}</Typography>
    </Box>
)
export default function CreateDeviceTabTwo({ onTextInputChange, newDevice, autoGenerateHandler, changeMakeLoraWAN, handleChangeDeviceCodec, makeLoraWAN }: TabTwoProps) {
    const { codecsList } = useContext(DevicesContext);
    return (
        <Box>
            <SelectElementString mx={0} title='Device Codec' value={newDevice.meta.codec} handleChange={handleChangeDeviceCodec} conditions={codecsList as { id: string, name: string }[]} />
            <RowContainerBetween additionStyles={{ my: 1 }}>
                <Typography color={DEFAULT_COLORS.navbar_dark} fontSize={13}>LoRaWAN Device</Typography>
                <Android12Switch checked={makeLoraWAN} onChange={changeMakeLoraWAN} color='info' />
            </RowContainerBetween>
            {
                makeLoraWAN && (
                    <Box my={2}>
                        <RowContainerNormal>
                            <RouterOutlined sx={{ mr: 2, fontSize: 20, color: DEFAULT_COLORS.navbar_dark }} />
                            <Typography color={DEFAULT_COLORS.navbar_dark} fontSize={13}>LoRaWAN Settings</Typography>
                        </RowContainerNormal>
                        {/* <SelectElementString mx={0} title={'Label'} handleChange={()=>{}} conditions={['Input','Level','Humidity']} value={'Temperature'} /> */}
                        <AddTextShow autoGenerateHandler={autoGenerateHandler} textInputValue={newDevice.meta.lorawan.devAddr} onTextInputChange={onTextInputChange} name="devAddr" text={'Device Addr (Device Address)'} placeholder={'8 digits required, got 0'} />
                        <AddTextShow isPlusHidden autoGenerateHandler={autoGenerateHandler} textInputValue={newDevice.meta.lorawan.devEUI} onTextInputChange={onTextInputChange} name="devEUI" text={'Device EUI (Generated from Device address)'} placeholder={'Generated from Device address, got 0'} />
                        <AddTextShow autoGenerateHandler={autoGenerateHandler} textInputValue={newDevice.meta.lorawan.nwkSEncKey} onTextInputChange={onTextInputChange} name="nwkSEncKey" text={'NwkSKey(Network Session Key)'} placeholder={'32 digits required, got 0'} />
                        <AddTextShow autoGenerateHandler={autoGenerateHandler} textInputValue={newDevice.meta.lorawan.appSKey} onTextInputChange={onTextInputChange} name="appSKey" text={'AppKey (App Key)'} placeholder={'32 digits required, got 0'} />
                    </Box>
                )
            }
        </Box>
    )

}