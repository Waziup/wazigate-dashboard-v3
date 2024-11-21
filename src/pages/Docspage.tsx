import { Box, Breadcrumbs, Card, CardActions, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { DataObject, DescriptionOutlined, Language, MailOutline } from '@mui/icons-material';
import React from 'react';
import { Link, To, useOutletContext, } from 'react-router-dom';
import { lineClamp } from '../utils';

interface CardProps{
    title: string,
    description: string,
    path: To,
    icon?:React.ReactNode
}
const CardComponent = ({description,path,title,icon}:CardProps)=>(
    <Card sx={{width:[400,250,250,300,300], m:.5,bgcolor:'transparent'}} variant='outlined'>
        <Box px={2}>
            {icon}
            <Typography sx={{ fontWeight:'700',...lineClamp(1) }}>
                {title}
            </Typography>
        </Box>
        <CardContent>
            <Tooltip color='black' followCursor title={description} placement="top-start">
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14,...lineClamp(2) }}>
                    {description}
                </Typography>
            </Tooltip>
        </CardContent>
        <CardActions sx={{px:2}}>
            <Link to={path} style={{textDecoration:'none',margin:'0px 0',cursor:'pointer'}}>
                <Typography sx={{fontWeight:500,mt:.5,cursor:'pointer',display:'flex',alignItems:'center',fontSize:15,color:DEFAULT_COLORS.primary_blue}}>
                    LEARN MORE
                </Typography>
            </Link>
        </CardActions>
    </Card>
)
function Docspage() {
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();
    return (
        <Box sx={{px:matches?4:2,py:2, height:'100%'}}>
            <Box>
                <Typography fontWeight={600} fontSize={24} color={'black'}>Help</Typography>
                <div role="presentation" onClick={()=>{}}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography fontSize={16} sx={{":hover":{textDecoration:'underline'}}} color="text.primary">
                            <Link style={{ color: 'black',textDecoration:'none',fontWeight:'300',fontSize:16 }} state={{ title: 'Devices' }} color="inherit" to="/">
                                Home
                            </Link>
                        </Typography>
                        <p style={{color: 'black',textDecoration:'none',fontWeight:300,fontSize:16 }} color="text.primary">
                            Wazigate Help
                        </p>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box mt={2}>
                <Stack mt={2} alignItems={'center'} flexWrap={'wrap'} direction={'row'}>
                    <CardComponent
                        title='Wazigate Documentation'
                        description='Checkout the wazigate Documentation on Wazilab and learn more about the gateway'
                        path="https://lab.waziup.io/resources/waziup-e-v/wazigate"
                        icon={<Language sx={{my:1}} />}
                    />
                    <CardComponent
                        title='Wazigate Edge Documentation'
                        description='Checkout the Edge API Documentation to learn how you can manage the gateway interfaces'
                        path="/docs/"
                        icon={<DescriptionOutlined sx={{my:1}}/>}
                    />
                    <CardComponent
                        title='System API Documentation'
                        description='Checkout the Wazigate System API Documentation to learn how you can interact with Wazigate system features'
                        path='/apps/waziup.wazigate-system/docs/'
                        icon={<DataObject sx={{my:1}}/>}
                    />
                    <CardComponent
                        title='Contact Us'
                        description='Reach out to us. Send an email for more information and clarification'
                        path='mailto:admin@waziup.org'
                        icon={<MailOutline sx={{my:1}}/>}
                    />  
                </Stack>
            </Box>
        </Box>
    );
}
export default Docspage;