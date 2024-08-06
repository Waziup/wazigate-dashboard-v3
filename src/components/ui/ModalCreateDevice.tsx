import { ArrowBack, Close } from "@mui/icons-material"
import { Modal, Box, SelectChangeEvent, Typography } from "@mui/material"
import CreateDeviceTab1 from "./CreateDeviceTab1"
import CreateDeviceTabTwo from "./CreateDeviceTab2"
import RowContainerBetween from "../shared/RowContainerBetween";
import { Device } from "waziup";
import PrimaryButton from "../shared/PrimaryButton";
import RowContainerNormal from "../shared/RowContainerNormal";
interface Props {
    openModal: boolean
    handleToggleModal: () => void
    submitCreateDevice: (e: React.FormEvent<HTMLFormElement>) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleChangeSelect: (event: SelectChangeEvent<string>) => void
    handleChangeDeviceCodec: (event: React.ChangeEvent<HTMLSelectElement>) => void
    selectedValue: string
    screen: string
    handleScreenChange: (tab: 'tab1' | 'tab2') => void
    blockOnClick: (va: string) => void,
    newDevice: Device,
    changeMakeLoraWAN: () => void
    onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    autoGenerateLoraWANOptionsHandler: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void
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
    borderRadius: 2,
};
const IconStyle = {
    cursor: 'pointer',
    color: 'black',
}
export default function CreateDeviceModalWindow({ openModal, autoGenerateLoraWANOptionsHandler, onTextInputChange, handleChangeDeviceCodec, handleToggleModal, submitCreateDevice, handleChange, handleChangeSelect, selectedValue, screen, handleScreenChange, blockOnClick, newDevice, changeMakeLoraWAN, }: Props) {
    return (
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
                        <Close onClick={() => { handleScreenChange('tab1'); handleToggleModal() }} sx={{ ...IconStyle, fontSize: 20 }} />
                    </RowContainerBetween>
                    <Box p={2}>
                        <form onSubmit={submitCreateDevice}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }} >
                                <Box></Box>
                                {
                                    screen === 'tab2' ? (
                                        <PrimaryButton title="CREATE" type="submit" />
                                    ) : null
                                }
                                {
                                    screen === 'tab1' ? (
                                        <PrimaryButton title="NEXT" onClick={() => { handleScreenChange('tab2') }} />
                                    ) : null
                                }
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}