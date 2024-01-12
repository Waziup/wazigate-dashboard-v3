import { Stack, Box, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { SelectElement, SelectElementString } from "../pages/Automation";
import RowContainerBetween from "./RowContainerBetween";
import { Device } from "waziup";
import { RuleEditHandler } from "./AutomationRule";
export default function AutomationRuleMobile({idx,device,handleChange,enableRuleEdit,toggleRuleEdit}:{device:Device,idx:number,handleChange:()=>void,enableRuleEdit:boolean,toggleRuleEdit:()=>void}) {
    return (
        <Stack  flexDirection={'column'} width={'100%'} mt={4} display={'flex'} alignItems={'center'}>
            <Box onClick={()=>{}} sx={{cursor:'pointer',width:'90%',py:2, height: '100%',position:'relative', bgcolor: 'white', borderRadius:2, }}>
                <Box sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                    <Typography fontSize={16} mx={1} color={'white'} component={'span'}>Rules {idx+1}</Typography>
                </Box>
                <Box sx={{px:2,}}>
                    <RowContainerBetween>
                        <Box component={'img'} sx={{m:1}} src={'/if.svg'} height={25} width={25} />
                        <Box>
                            <RuleEditHandler enableRuleEdit={enableRuleEdit} toggleRuleEdit={toggleRuleEdit} />
                        </Box>
                    </RowContainerBetween>
                </Box>
                <SelectElement isDisabled={enableRuleEdit} title={'Sensor'} handleChange={handleChange} conditions={device.sensors} value={''} />
                <SelectElementString isDisabled={enableRuleEdit} title={'Condition'} handleChange={()=>{}} conditions={[]} value={''} />
                <SelectElementString isDisabled={enableRuleEdit} title={'Values'} handleChange={()=>{}} conditions={[]} value={''} />
                <Box sx={{ px:2,}}>
                    <Box component={'img'} sx={{m:1}} src={'/do.svg'} height={'10%'} width={'10%'} />
                </Box>
                <Box my={2}>
                    <SelectElement isDisabled={enableRuleEdit} title={'Actuator'} handleChange={()=>{}} conditions={device.actuators} value={''} />
                    <SelectElementString isDisabled={enableRuleEdit} title={'Action'} handleChange={()=>{}} conditions={[]} value={''} />
                </Box>
            </Box>
        </Stack>
    )
}