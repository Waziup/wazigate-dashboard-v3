import { Box, Typography } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { DataObject, DescriptionOutlined, MailOutline } from '@mui/icons-material';
import React from 'react';
interface TextElement extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
    text: string;
}
const TextEL = ({children,text}:TextElement)=>(
    <Typography fontWeight={500} mt={.5} display={'flex'} alignItems={'center'} fontSize={15} color={DEFAULT_COLORS.primary_blue}>
        {children}
        {text}
    </Typography>
)
function Docspage() {
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <Box mx={2}>
                <Typography fontWeight={500} fontSize={20} color={'black'}>WaziGate Help</Typography>
                <Typography>Any problem using the WaziGate? Dont Worry!  Help is on the way.</Typography>
                <Box mt={2}>
                    <TextEL text='Wazigate Documetation'>
                        <DescriptionOutlined/>
                    </TextEL>
                    <TextEL text='API Documentation'>
                        <DataObject/>
                    </TextEL>
                    <TextEL text='Contact'>
                        <MailOutline/>
                    </TextEL>
                </Box>
            </Box>
        </Box>
    );
}

export default Docspage;