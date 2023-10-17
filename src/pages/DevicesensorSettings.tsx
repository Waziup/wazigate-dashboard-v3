import { Box, Breadcrumbs, Button, FormControl, Link, NativeSelect, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { DEFAULT_COLORS } from "../constants";
import { HTMLSelectProps } from "./Automation";
import RowContainerBetween from "../components/RowContainerBetween";
import { Save,  Sensors,  ToggleOff, ToggleOn,  } from "@mui/icons-material";
import RowContainerNormal from "../components/RowContainerNormal";
import DiscreteSliderMarks from "../components/DiscreteMarks";
export const SelectElement = ({handleChange,title,conditions,isDisabled,matches, value}:HTMLSelectProps)=>(
    <Box minWidth={120} mx={2}>
        <Typography  fontSize={12} color={DEFAULT_COLORS.secondary_black}>{title}</Typography>
        <RowContainerNormal additionStyles={{borderBottom:'2px solid black', backgroundColor:matches?'inherit':'#F0F2F5'}}>
            <Sensors sx={{color:'#292F3F',mx:1}} />
            <FormControl disabled={isDisabled} fullWidth>
                <NativeSelect
                    defaultValue={30}
                    inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                    }}
                    sx={{border:0}}
                    value={value}
                    onChange={handleChange}
                >
                    {conditions.map((condition,index)=>(
                        <option key={index} value={condition}>{condition}</option>
                    ))}
                </NativeSelect>
            </FormControl>
        </RowContainerNormal>
    </Box>
);
function DeviceSensorSettings() {
    const [matches] = useOutletContext<[matches:boolean]>()
    return (
        <Box height={'100%'}>
            <Box p={2} px={3}>
                <Typography fontWeight={500} fontSize={18} color={'black'}>Device 1</Typography>
                <div role="presentation" onClick={()=>{}}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link fontSize={12} underline="hover" color="inherit" href="/">
                            Devices
                        </Link>
                        <Link
                            fontSize={12}
                            underline="hover"
                            color="inherit"
                            href="/device"
                        >
                            Device 1
                        </Link>
                        <Typography fontSize={12} color="text.primary">Settings</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box bgcolor={matches?'#fff':'inherit'} height={'100%'} width={'100%'} px={2} pt={matches?2:2}  >
                <Typography color={'#292F3F'}>Setup the sensor type, quantity and unit</Typography>
                <Box my={2} width={matches?'30%':'100%'}>
                    <SelectElement matches={matches} isDisabled={false} title={'Sensor'} handleChange={()=>{}} conditions={['Temperature','Level','Humidity']} value={'Temperature'} />
                </Box>
                <Box width={matches?'30%':'90%'}>
                    <Typography my={3} color={'#292F3F'}>Setup sync and sync interface</Typography>
                    <RowContainerBetween additionStyles={{mt:3}}>
                        <Typography fontSize={15} color={'#292F3F'}>Sync Sensor</Typography>
                        <ToggleOff sx={{color:DEFAULT_COLORS.secondary_gray,fontSize:40, }} />
                    </RowContainerBetween>
                    <RowContainerBetween>
                        <Typography fontSize={15} color={'#292F3F'}>Sync Interval</Typography>
                        <ToggleOn sx={{color:DEFAULT_COLORS.primary_blue,fontSize:40, }} />
                    </RowContainerBetween>
                </Box>
                <DiscreteSliderMarks matches={matches}/>
                <Box width={matches?'30%':'90%'}>
                    <RowContainerNormal>
                        <Button sx={{mx:1}} startIcon={<Save/>} variant={'contained'}>Save</Button>
                        <Button sx={{mx:1,color:'#292F3F'}} variant={'text'}>Cancel</Button>
                    </RowContainerNormal>
                </Box>
            </Box>
        </Box>
    );
}

export default DeviceSensorSettings;