import { Box, FormControl, Typography, MenuItem, Select, SelectChangeEvent, TextField, } from "@mui/material";
import { Device } from "waziup";
import { InputField } from "../../pages/Login";

interface DropDownProps {
    name?: string;
    title?: string;
    value: string;
    options: { id: string; name: string }[];
    handleChangeSelect: (e: SelectChangeEvent<string>) => void;
    matchesWidth?: boolean;
    mt?: number;
    my?: number;
}

export const DropDownCreateDeviceTab1 = ({ name, title = 'Select board Type', value, options, handleChangeSelect, matchesWidth = true, mt = 2, my = 0, }: DropDownProps) => (
    <FormControl variant="standard" sx={{ p: 0, mt, my, width: '100%', minWidth: matchesWidth ? 300 : '100%', }}>
        {/* <InputLabel id={`${name}-select-label`}>{title}</InputLabel> */}
        <InputField id={`${name}-select-label`} label={title} mendatory>
            <Select
                placeholder="Select device codec"
                name={name}
                value={value}
                onChange={handleChangeSelect}
                labelId={`${name}-select-label`}
                onClose={() => {
                    setTimeout(() => {
                        (document?.activeElement as HTMLElement)?.blur();
                    }, 0);
                }}
                sx={{ width: '100%', py: 0 }}
                required
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box display="flex" alignItems="center">
                            <Typography variant="body1">{option.name}</Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </InputField>
    </FormControl>
);

interface CreateDeviceTab1Props {
    newDevice: Device;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeSelect: (event: SelectChangeEvent<string>) => void;
    blockOnClick: (value: string) => void;
}

export default function CreateDeviceTab1({
    newDevice,
    handleChange,
    handleChangeSelect,
}: CreateDeviceTab1Props) {
    return (
        <Box>
            <FormControl sx={{ my: 1, width: '100%', borderBottom: '1px solid #292F3F', }}>
                <Typography color="#325460" mb={0.4} fontSize={14}>Device name</Typography>
                <TextField
                    name="name"
                    value={newDevice.name}
                    placeholder="Enter device name"
                    onChange={handleChange}
                    autoFocus
                    variant="standard"
                    fullWidth
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            fontSize: 14,
                            color: '#325460',
                            padding: '6px 0',
                        },
                    }}
                />
            </FormControl>

            <DropDownCreateDeviceTab1
                name="deviceType"
                value={newDevice.meta.type}
                handleChangeSelect={handleChangeSelect}
                options={[
                    { name: 'Wazidev Board', id: 'WaziDev' },
                    { name: 'Generic board', id: 'generic' },
                ]}
            />
        </Box>
    );
}
