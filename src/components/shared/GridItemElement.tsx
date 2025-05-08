import { styled, Paper, Typography, Box, Icon, SxProps, Theme } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
}));
export default function GridItemEl({ children, text, additionStyles, icon }: { additionStyles?: SxProps<Theme>, text: string, children: React.ReactNode, icon: string }) {
    return (
        <Item sx={{ ...additionStyles, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', borderTopLeftRadius: 4, borderTopRightRadius: 4, bgcolor: '#dddfe8', p: 1, alignItems: 'center', gap: 1 }} >
                <Icon>{icon}</Icon>
                <Typography color={DEFAULT_COLORS.primary_black} fontWeight={500}>{text}</Typography>
            </Box>
            {children}
        </Item>
    )
}