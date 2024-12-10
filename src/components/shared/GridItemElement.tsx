import {styled,Paper,Typography, Box, Icon, SxProps, Theme } from "@mui/material";
import { IconStyle } from "../layout/Sidebar";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
}));
export default function GridItemEl({ children, text, additionStyles, icon }: { additionStyles?: SxProps<Theme>, text: string, children: React.ReactNode, icon: string }){
    return(
        <Item sx={{...additionStyles,boxShadow:1}}>
            <Box sx={{ display: 'flex', borderTopLeftRadius: 5, borderTopRightRadius: 5,border:'.5px solid #d8d8d8', bgcolor: '#F7F7F7', p:1, alignItems: 'center' }} >
                <Icon sx={IconStyle}>{icon}</Icon>
                <Typography color={'#212529'} fontWeight={500}>{text}</Typography>
            </Box>
            {children}
        </Item>
    )
}