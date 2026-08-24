import { AutoFixNormal, ContentCopy } from "@mui/icons-material";
import { Box, IconButton, Input, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

interface AddTextProps {
    color: string
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
    color,
    matchesWidth,
    isPlusHidden,
    autoGenerateHandler,
    placeholder,
    onTextInputChange,
    textInputValue,
}: AddTextProps) {
    const [msg,setMsg] = useState("Copy to clipboard")
    const unsecuredCopyToClipboard = (text: string) => { 
        const textArea = document.createElement("textarea"); 
        textArea.value=text; 
        document.body.appendChild(textArea); 
        textArea.focus();textArea.select(); 
        try{
            setMsg("Copied to clipboard 👍👍");
            document.execCommand('copy')
        }catch(err){
            setMsg("Could not copy "+(err as unknown as string).toString())
        }
        document.body.removeChild(textArea)
    };
    function copyToClipboard(text: string | undefined) {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(text??'')
            .then(() =>{
                setMsg("Copied to clipboard 👍👍");
            })
            .catch(err => {
                setMsg("Could not copy "+err.toString())
            });
        }else{
            unsecuredCopyToClipboard(text??'');
        }
    }
    return (
        <>
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
                            color: color,
                            borderBottom: '1px solid #D5D6D8',
                            '&:before, &:after': { borderBottom: 'none' },
                            width: matchesWidth ? 'auto' : '100%',
                            fontSize: '0.875rem',
                        }}
                    />
                    <Stack direction="row">
                        {!isPlusHidden ? (
                            <Tooltip onClick={() => autoGenerateHandler && autoGenerateHandler(name as "devAddr" | "nwkSEncKey" | "appSKey")} title={"AutoGenerate " + name}>

                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => autoGenerateHandler && autoGenerateHandler(name as "devAddr" | "nwkSEncKey" | "appSKey")}
                                >
                                    <AutoFixNormal fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        ):null}
                        <Tooltip onMouseLeave={() => setMsg("Copy to clipboard")} onClick={()=>copyToClipboard(textInputValue)} title={msg}>
                            <IconButton aria-label="copy" size="small" onMouseLeave={() => setMsg("Copy to clipboard")} onClick={()=>copyToClipboard(textInputValue)}   >
                                <ContentCopy fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
                <Typography fontSize={10} my={0} color={'#292F3F'} fontWeight={200}>{placeholder}</Typography>
            </Box>
        </>
    );
}
