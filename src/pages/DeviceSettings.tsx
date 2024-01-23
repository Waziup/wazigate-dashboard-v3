import { MoreVert, Router, } from "@mui/icons-material";
import { Box, Breadcrumbs, FormControl, Typography, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import RowContainerBetween from "../components/shared/RowContainerBetween";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AddTextShow from "../components/shared/AddTextInput";
import type { Device, } from "waziup";
import { DevicesContext } from "../context/devices.context";
import { toStringHelper } from "../utils";
import { SelectElementString } from "./Automation";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent<string>) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    widthPassed?: string
}
export const SelectElement = ({ handleChange, title, conditions, isDisabled, widthPassed, name, value }: HTMLSelectProps) => (
    <Box minWidth={120} width={widthPassed ? widthPassed : '100%'} my={.5}>
        <Typography fontSize={12} fontWeight={'300'} color={'#292F3F'}>{title}</Typography>
        <FormControl variant="standard" disabled={isDisabled} fullWidth>
            <Select
                inputProps={{
                    name: name,
                    id: 'uncontrolled-native',
                }}
                sx={{ fontWeight: 'bold' }}
                value={value}
                onChange={handleChange}
            >
                <MenuItem defaultChecked disabled value={''}>Select</MenuItem>
                {
                    conditions.map((condition, index) => (
                        <MenuItem key={index} value={condition}>{condition}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    </Box>
);

export default function DeviceSettings() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const { codecsList } = useContext(DevicesContext);
    const { id } = useParams();
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    const [thisDevice, setThisDevice] = useState<Device | null>(null);

    useEffect(() => {
        window.wazigate.getDevice(id as string).then((de) => {
            setThisDevice(de);
        });

    }, [id]);
    const autoGenerateHandlerFc = () => { }
    return (
        <>
            <Box mx={2} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: '.5rem', "::-webkit-slider-thumb": { backgroundColor: 'transparent' } }} m={2}>
                <RowContainerBetween additionStyles={{ mx: 2 }}>
                    <Box>
                        <Typography fontWeight={700} color={'black'}>{thisDevice?.name}</Typography>
                        <div role="presentation" onClick={handleClick}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }} state={{ title: 'Devices' }} color="inherit" to="/devices">
                                    Devices
                                </Link>

                                <Link
                                    color="inherit"
                                    state={{ title: thisDevice?.name }}
                                    to={`/devices/${id}`}
                                    style={{ color: '#292F3F', fontSize: 15, textDecoration: 'none' }}
                                >
                                    {thisDevice?.name ? thisDevice.name.slice(0, 10) + '...' : ''}
                                </Link>
                                <Typography fontSize={15} color="text.primary">
                                    settings
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                </RowContainerBetween>
                <Box m={2} width={matches?'50%':'90%'}>
                    {
                        thisDevice?.meta.lorawan ? (
                            <Box bgcolor={'#fff'} mx={2} my={1} px={2} py={2} borderRadius={2} >
                                <RowContainerBetween>
                                    <Box display={'flex'} my={1} alignItems={'center'}>
                                        <Router sx={{ fontSize: 20, color: '#292F3F' }} />
                                        <Typography fontWeight={500} mx={2} fontSize={16} color={'#292F3F'}>LoRaWAN Settings</Typography>
                                    </Box>
                                    <MoreVert sx={{ color: 'black', fontSize: 20 }} />
                                </RowContainerBetween>
                                <Box my={2}>
                                    <SelectElement title={'LoRAWAN Profile'} handleChange={() => { }} conditions={['Wazidev', 'Other']} value={thisDevice?.meta.lorawan.profile} />
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} name="devAddr" textInputValue={thisDevice?.meta.lorawan.devAddr} text={'Device Addr (Device Address)'} placeholder={'8 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan.devAddr)} />
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} name="nwkSEncKey" textInputValue={thisDevice?.meta.lorawan.nwkSEncKey} text={'NwkSKey(Network Session Key)'} placeholder={'32 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan.nwkSEncKey)} />
                                    <AddTextShow autoGenerateHandler={autoGenerateHandlerFc} name="appSKey" textInputValue={thisDevice?.meta.lorawan.appSKey} text={'AppKey (App Key)'} placeholder={'32 digits required, got ' + toStringHelper(thisDevice?.meta.lorawan.appSKey)} />
                                </Box>
                            </Box>
                        ) : null
                    }
                    <Box bgcolor={'#fff'} mx={2} my={1} px={2} py={2} borderRadius={2}>
                        <RowContainerBetween>
                            <Box display={'flex'} my={1} alignItems={'center'}>
                                <Box component={'img'} src={'/box_download.svg'} width={20} height={20} />
                                <Typography fontWeight={500} mx={2} fontSize={16} color={'#292F3F'}>Device Codec</Typography>
                            </Box>
                        </RowContainerBetween>
                        <Box my={2}>
                            <SelectElementString title={'Codec type.'} handleChange={() => { }} conditions={codecsList ? codecsList : []} value={thisDevice?.meta.codec} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}