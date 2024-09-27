import { Box, Typography } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { DataObject, DescriptionOutlined, Language, MailOutline } from '@mui/icons-material';
import React from 'react';
import { Link, To } from 'react-router-dom';
interface TextElement extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
    text: string;
    path: To;
}
const TextEL = ({children,path,text}:TextElement)=>(
    <Link to={path} style={{textDecoration:'none',margin:'5px 0',cursor:'pointer'}}>
        <Typography sx={{fontWeight:500,mt:.5,cursor:'pointer',display:'flex',alignItems:'center',fontSize:15,color:DEFAULT_COLORS.primary_blue}}>
            {children}
            {text}
        </Typography>
    </Link>
)
function Docspage() {
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <Box mx={2}>
                <Typography fontWeight={500} fontSize={20} color={'black'}>WaziGate Help</Typography>
                <Typography>Any problem using the WaziGate? Dont Worry!  Help is on the way.</Typography>
                <Box mt={2}>
                    <TextEL path="https://lab.waziup.io/resources/waziup-e-v/wazigate" text='Wazigate Documetation'>
                        <Language/>
                    </TextEL>
                    <TextEL path="/docs/" text='Wazigate Edge Documetation'>
                        <DescriptionOutlined/>
                    </TextEL>
                    <TextEL path='/apps/waziup.wazigate-system/docs/' text='System API Documentation'>
                        <DataObject/>
                    </TextEL>
                    <TextEL path='mailto:admin@waziup.org' text='Contact'>
                        <MailOutline/>
                    </TextEL>
                </Box>
            </Box>
        </Box>
    );
}

export default Docspage;