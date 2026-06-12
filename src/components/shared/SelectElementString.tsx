import { SelectChangeEvent, Box, FormControl, Select, MenuItem } from "@mui/material";
import { InputField } from "../../pages/Login";

export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange: (event: SelectChangeEvent) => void,
    title: string,
    conditions: string[] | number[],
    value: string
    isDisabled?: boolean
    matches?: boolean
    name?: string
    widthPassed?: string
}
export default function SelectElementString({ handleChange, name, title, conditions, isDisabled, value }: HTMLSelectProps) {
    return (
        <Box minWidth={120} width={['100%', '45%']} my={.5}>
            <FormControl variant="standard" disabled={isDisabled} fullWidth>
                <InputField label={title} mendatory>
                    <Select
                        sx={{ width: '100%', }}
                        value={value}
                        labelId="select-label"
                        id="select"
                        name={name}
                        onChange={handleChange}
                    >
                        <MenuItem defaultChecked disabled value={''}>Select</MenuItem>
                        {
                            conditions.map((condition, index) => (
                                <MenuItem key={index} value={condition}>{condition}</MenuItem>
                            ))
                        }
                    </Select>
                </InputField>
            </FormControl>
        </Box>
    )
}