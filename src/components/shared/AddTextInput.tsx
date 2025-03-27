import { AutoFixNormal } from "@mui/icons-material";
import { Box, Button, IconButton, Input, Tooltip, Typography } from "@mui/material";

interface AddTextProps {
    text: string;
    placeholder: string;
    textInputValue?: string;
    onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    isPlusHidden?: boolean;
    isReadOnly?: boolean;
    matchesWidth?: boolean;
    autoGenerateHandler?: (title: "devAddr" | "nwkSEncKey" | "appSKey") => void;
}

export default function AddTextShow({
    text,
    isReadOnly,
    name,
    matchesWidth,
    isPlusHidden,
    autoGenerateHandler,
    placeholder,
    onTextInputChange,
    textInputValue,
}: AddTextProps) {
    return (
        <Box sx={{ my: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Input
                    fullWidth={!matchesWidth}
                    readOnly={isReadOnly}
                    onChange={onTextInputChange}
                    required
                    name={name}
                    value={textInputValue}
                    placeholder={text}
                    sx={{
                        borderBottom: '1px solid #D5D6D8',
                        '&:before, &:after': { borderBottom: 'none' },
                        width: matchesWidth ? 'auto' : '100%',
                        fontSize: '0.875rem',
                    }}
                />
                {!isPlusHidden && (
                    // <Button
                    //     size="small"
                    //     variant="contained"
                    //     startIcon={<AutoFixNormal />}
                    //     onClick={() => autoGenerateHandler && autoGenerateHandler(name as "devAddr" | "nwkSEncKey" | "appSKey")}
                    //     disableElevation
                    //     sx={{
                    //         textTransform: 'none',
                    //         backgroundColor: '#fdeee7',
                    //         '&:hover': {
                    //             backgroundColor: '#f25f16',
                    //             color: '#fff',
                    //         },
                    //         padding: '4px 8px',
                    //         fontSize: '0.875rem',
                    //         minWidth: 'auto',
                    //         whiteSpace: 'nowrap',
                    //         color: '#f25f16',
                    //     }}
                    // >
                    //     Generate
                    // </Button>

                    <Tooltip onClick={() => autoGenerateHandler && autoGenerateHandler(name as "devAddr" | "nwkSEncKey" | "appSKey")} title={"AutoGenerate " + name}>

                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => autoGenerateHandler && autoGenerateHandler(name as "devAddr" | "nwkSEncKey" | "appSKey")}
                        >
                            <AutoFixNormal fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Typography fontSize={10} my={0} color={'#292F3F'} fontWeight={200}>{placeholder}</Typography>
        </Box>
    );
}
