import { Add,Mode, MoreVert } from "@mui/icons-material";
import { Box, Button,FormControl,NativeSelect,Typography } from "@mui/material";
import { RowContainerBetween } from "./dashboard";
import { DEFAULT_COLORS } from "../constants";
import React, { ChangeEvent, } from "react";

const SelectElement = ({handleChange,title,conditions, value}:{title:string,handleChange:(event: ChangeEvent<HTMLSelectElement>)=>void,conditions:string[] | number[], value: string})=>(
    <Box minWidth={120} mx={2}>
        <Typography fontSize={12} color={DEFAULT_COLORS.secondary_black}>{title}</Typography>
        <FormControl fullWidth>
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
                    <option key={index} value={condition}>{condition}</option>
                ))}
            </NativeSelect>
        </FormControl>
    </Box>
)
function Automation() {
    const [age, setAge] = React.useState('');
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setAge(event.target.value);
    };
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Box>
                    <Typography fontWeight={700} color={'black'}>Automation</Typography>
                    <Typography sx={{color:DEFAULT_COLORS.secondary_black}}>Setup your Actuation Logics</Typography>
                </Box>
                <Button variant={'contained'}>
                    <Add />
                    New Rule
                </Button>
            </RowContainerBetween>
            <Box py={2}>
                <Box sx={{ position:'relative', bgcolor: 'white', borderRadius:2, }}>
                    <Box sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.primary_blue}>
                        <Typography  mx={1} color={'white'} component={'span'}>Rule 1</Typography>
                    </Box>
                    <Box mx={2} py={2} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} >
                        <Typography color={DEFAULT_COLORS.primary_black} p={1} height={'10%'} fontSize={14} borderRadius={'100%'} bgcolor={'#D9D9D9'}>if</Typography>
                        <SelectElement title={'Sensor'} handleChange={handleChange} conditions={['Tempeature','Level','Humidity']} value={age} />
                        <SelectElement title={'Condition'} handleChange={()=>{}} conditions={['>','<','==']} value={''} />
                        <SelectElement title={'Values'} handleChange={()=>{}} conditions={[32,33,34,35,26]} value={''} />
                        <Typography color={DEFAULT_COLORS.primary_black} p={1} height={'10%'} fontSize={14} borderRadius={'100%'} bgcolor={'#D9D9D9'}>do</Typography>
                        <SelectElement title={'Actuator'} handleChange={()=>{}} conditions={['WaterPump','<','==']} value={''} />
                        <SelectElement title={'Action'} handleChange={()=>{}} conditions={['on','off']} value={''} />
                        <Box>
                            <Mode sx={{color:'black',mx:1}}/>
                            <MoreVert sx={{color:'black',mx:1}}/>
                        </Box>
                    </Box>     
                </Box>
            </Box>
        </Box>
    );
}

export default Automation;