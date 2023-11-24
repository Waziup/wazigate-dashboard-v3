import { Box, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { SelectElement, SelectElementString } from "../pages/Automation";
import { Device } from "waziup";
import { Check, Clear, ModeOutlined, MoreVert } from "@mui/icons-material";
import { IconStyle } from "./layout/Sidebar";

export function RuleEditHandler({enableRuleEdit,toggleRuleEdit}:{toggleRuleEdit:()=>void,enableRuleEdit:boolean}){
    return(
        <>
            {
                !enableRuleEdit?(
                    <>
                        <Check onClick={toggleRuleEdit} sx={{...IconStyle,mx:1}} />
                        <Clear onClick={toggleRuleEdit} sx={{...IconStyle,mx:1}} />
                    </>
                ):(
                    <>
                        <ModeOutlined onClick={toggleRuleEdit} sx={{fontSize:20, color:'black',mx:1}}/>
                        <MoreVert sx={{fontSize:20,color:'black',mx:1}}/>
                    </>
                )

            }
        </>
    )
}

export default function AutomationRule({idx,device,handleChange,enableRuleEdit,toggleRuleEdit}:{device:Device,idx:number,age:number,handleChange:()=>void,enableRuleEdit:boolean,toggleRuleEdit:()=>void}){
    return(
        <Box  py={2}>
            <Box sx={{ position:'relative', bgcolor: 'white', borderRadius:2, }}>
                <Box sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                    <Typography  mx={1} color={'white'} component={'span'}>Rule {idx+1}</Typography>
                </Box>
                <Box mx={2} py={2} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} >
                    <Box component={'img'} src={'/if.svg'} height={25} width={'10%'} />
                    <SelectElement isDisabled={enableRuleEdit} title={'Sensor'} handleChange={handleChange} conditions={device.sensors} value={'f'} />
                    <SelectElementString isDisabled={enableRuleEdit} title={'Condition'} handleChange={()=>{}} conditions={device.sensors.length>0?['>','<','==']:[]} value={''} />
                    <SelectElementString isDisabled={enableRuleEdit} title={'Values'} handleChange={()=>{}} conditions={[32,33,34,35,26]} value={''} />
                    <Box component={'img'} src={'/do.svg'} height={25} width={'10%'} />
                    <SelectElement isDisabled={enableRuleEdit} title={'Actuator'} handleChange={()=>{}} conditions={device.actuators} value={''} />
                    <SelectElementString isDisabled={enableRuleEdit} title={'Action'} handleChange={()=>{}} conditions={device.actuators.length>0?['on','off']:[]} value={''} />
                    
                    <RuleEditHandler enableRuleEdit={enableRuleEdit} toggleRuleEdit={toggleRuleEdit} />
                </Box>     
            </Box>
        </Box>
    )
}