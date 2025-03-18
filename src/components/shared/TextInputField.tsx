import { FormControl, Typography, Box, TextField, SxProps, Theme } from '@mui/material';
import React from 'react';
interface InputFieldProps extends React.ComponentProps<typeof TextField> {
    label: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    name?: string,
    required?: boolean,
    placeholder?: string,
    type?: string,
    sx?: SxProps<Theme>,
    multiline?: boolean,
    rows?: number
    bgcolor?: string,
    icon?: React.ReactNode
}
export default function TextInputField({ onChange, value, label, icon, placeholder, type, sx, bgcolor, name }: InputFieldProps) {
    return (
        <FormControl sx={{ my: 1, width: '100%', borderBottom: '1px solid #ccc', ...sx }}>
            <Typography textAlign={'left'} mb={.4} fontSize={14}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                {icon}
                <input
                    onInput={onChange}
                    name={name}
                    placeholder={placeholder ? placeholder : 'Enter device name'}
                    value={value}
                    required
                    type={type ? type : 'text'}
                    style={{ border: 'none', width: '100%', fontSize: 16, color: '#888', backgroundColor: bgcolor ? bgcolor : '', margin: '0 3px', outline: 'none' }}
                />
            </Box>
        </FormControl>
    )
}
