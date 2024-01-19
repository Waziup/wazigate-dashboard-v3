import { SelectChangeEvent, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: SelectChangeEvent<string>)=>void,
    title:string,
    conditions:string[] | number[], 
    value: string
    isDisabled?:boolean
    matches?:boolean
    widthPassed?:string
}
export default function SelectElementString({handleChange,title,conditions,isDisabled,widthPassed,name,value}:HTMLSelectProps){
    return(
        <Box minWidth={120} width={widthPassed?widthPassed:'100%'} my={.5}>
            <Typography  fontSize={12} fontWeight={'300'} color={'#292F3F'}>{title}</Typography>
            <FormControl variant="standard" disabled={isDisabled} fullWidth>
                <Select
                    inputProps={{
                        name: name,
                        id: 'uncontrolled-native',
                    }}
                    sx={{fontWeight:'bold'}}
                    value={value}
                    onChange={handleChange}
                >
                    <MenuItem defaultChecked disabled value={''}>Select</MenuItem>
                    {
                        conditions.map((condition,index)=>(
                            <MenuItem key={index} value={condition}>{condition}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    )
}