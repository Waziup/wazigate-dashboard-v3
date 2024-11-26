import { SelectChangeEvent, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: SelectChangeEvent)=>void,
    title:string,
    conditions:string[] | number[], 
    value: string
    isDisabled?:boolean
    matches?:boolean
    name?:string
    widthPassed?:string
}
export default function SelectElementString({handleChange,name,title,conditions,isDisabled,widthPassed,value}:HTMLSelectProps){
    return(
        <Box minWidth={120} width={widthPassed?widthPassed:'100%'} my={.5}>
            <Typography  fontSize={14} fontWeight={'300'} color={'#292F3F'}>{title}</Typography>
            <FormControl variant="standard" disabled={isDisabled} fullWidth>
                <Select
                    sx={{fontWeight:'bold'}}
                    value={value}
                    labelId="select-label"
                    id="select"
                    name={name}
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