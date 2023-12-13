import { Add } from "@mui/icons-material";
import { Box, Button,FormControl,NativeSelect,Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import React, { ChangeEvent, } from "react";
import { useOutletContext } from "react-router-dom";
import RowContainerBetween from "../components/RowContainerBetween";
import { Actuator, Sensor } from "waziup";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: ChangeEvent<HTMLSelectElement>)=>void,
    title:string,
    conditions:Actuator[] | Sensor[], 
    value: string
    isDisabled?:boolean
    matches?:boolean
}
export interface HTMLSelectPropsString extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: ChangeEvent<HTMLSelectElement>)=>void,
    title:string,
    conditions:string[] | number[], 
    value: string
    mx?:number
    my?:number
    isDisabled?:boolean
    matches?:boolean
}

export const SelectElement = ({handleChange,title,conditions,isDisabled, value}:HTMLSelectProps)=>(
    <Box minWidth={120} mx={2}>
        <Typography  fontSize={12} color={DEFAULT_COLORS.secondary_black}>{title}</Typography>
        <FormControl disabled={isDisabled} fullWidth>
            <NativeSelect
                defaultValue={30}
                inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                }}

                value={value}
                onChange={handleChange}
            >
                {conditions.map((condition,index)=>(
                    <option key={index} value={condition.id}>{condition.name}</option>
                ))}
            </NativeSelect>
        </FormControl>
    </Box>
);
export const SelectElementString = ({handleChange,title,mx,my,  conditions,isDisabled, value}:HTMLSelectPropsString)=>(
    <Box minWidth={120} my={my !==undefined?my:0} mx={mx !==undefined?mx:2}>
        <Typography  fontSize={12} color={DEFAULT_COLORS.navbar_dark}>{title}</Typography>
        <FormControl color="primary" disabled={isDisabled} fullWidth>
            <NativeSelect
                defaultValue={30}
                inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                }}
                required
                value={value}
                onChange={handleChange}
            >
                {conditions.map((condition,index)=>(
                    <option color={DEFAULT_COLORS.navbar_dark} key={index} value={condition}>{condition}</option>
                ))}
            </NativeSelect>
        </FormControl>
    </Box>
);
function Automation() {
    const [matches] = useOutletContext<[matches: boolean]>()
    return (
        <Box sx={{ height:'100%',p:3}}>
            <RowContainerBetween>
                <Box>
                    <Typography fontWeight={700} color={'black'}>Automation</Typography>
                    <Typography sx={{color:DEFAULT_COLORS.secondary_black}}>Setup your Actuation Logics</Typography>
                </Box>
                <Button color="info" variant={'contained'}>
                    <Add />
                    New Rule
                </Button>
            </RowContainerBetween>
            {
                matches?(
                    <Box my={2} >
                        <Typography>Automation Rule Desktop list</Typography>
                    </Box>
                ):(
                    <Box position={'relative'} height={'100%'} width={'100%'}>
                        <Typography>Automation RUle mobile list</Typography>
                    </Box>
                )
            }
        </Box>
    );
}

export default Automation;