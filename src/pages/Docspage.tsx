import React from 'react';
import { Box, Breadcrumbs, Card, CardActions, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { DataObject, DescriptionOutlined, Language, MailOutline } from '@mui/icons-material';
import { Link, To, useOutletContext } from 'react-router-dom';
import { DEFAULT_COLORS } from '../constants';
import { lineClamp } from '../utils';

interface CardProps {
    title: string;
    description: string;
    path: To;
    newTab?: boolean;
    icon?: React.ReactNode;
}

const CardComponent = ({ description, path, title, newTab, icon }: CardProps) => (
    <Card elevation={1} sx={{ width: ['100%', 300] }}>
        <CardContent>
            {icon}
            <Typography gutterBottom sx={{ ...lineClamp(1) }}>{title}</Typography>
            <Tooltip color="black" followCursor title={description} placement="top-start">
                <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary', ...lineClamp(2) }}>{description}</Typography>
            </Tooltip>
        </CardContent>
        <CardActions>
            <Link to={path} target={newTab ? '_blank' : undefined} style={{ textDecoration: 'none', cursor: 'pointer', padding: 6, }}>
                <Typography variant='button' sx={{ color: DEFAULT_COLORS.primary_blue }}>LEARN MORE</Typography>
            </Link>
        </CardActions>
    </Card>
);

function Docspage() {
    const [matches] = useOutletContext<[matches: boolean, matchesMd: boolean]>();

    const cards = [
        {
            title: 'Wazigate Documentation',
            description: 'Checkout the wazigate Documentation on Wazilab and learn more about the gateway',
            path: 'https://lab.waziup.io/resources/waziup-e-v/wazigate',
            icon: <Language sx={{ my: 1 }} />,
            newTab: true,
        },
        {
            title: 'Wazigate Edge Documentation',
            description: 'Checkout the Edge API Documentation to learn how you can manage the gateway interfaces',
            path: '/docs/',
            icon: <DescriptionOutlined sx={{ my: 1 }} />,
        },
        {
            title: 'System API Documentation',
            description: 'Checkout the Wazigate System API Documentation to learn how you can interact with Wazigate system features',
            path: '/apps/waziup.wazigate-system/docs/',
            icon: <DataObject sx={{ my: 1 }} />,
        },
        {
            title: 'Contact Us',
            description: 'Reach out to us. Send an email for more information and clarification',
            path: 'mailto:admin@waziup.org',
            icon: <MailOutline sx={{ my: 1 }} />,
        },
    ];

    return (
        <Box sx={{ px: matches ? 4 : 2, py: 2, height: '100%' }}>
            <Box>
                <Typography fontWeight={600} fontSize={24} color="black">Help</Typography>
                <div role="presentation" onClick={() => { }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography fontSize={16} sx={{ ":hover": { textDecoration: 'underline' } }} color="text.primary">
                            <Link style={{ color: 'black', textDecoration: 'none', fontWeight: 300, }} state={{ title: 'Devices' }} color="inherit" to="/">Home</Link>
                        </Typography>
                        <Typography color="text.primary" sx={{ color: 'black', textDecoration: 'none', fontWeight: 300, }}>Wazigate Help</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            <Box mt={2}>
                <Stack mt={2} alignItems="center" flexWrap="wrap" direction="row" gap={2}>
                    {cards.map((card, index) => (
                        <CardComponent key={index} {...card} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default Docspage;