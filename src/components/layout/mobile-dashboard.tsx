import { CloudOff,Router, Wifi } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";
const Item = ({more,color,children, title}:{more:string,children:React.ReactNode, color:string,title:string})=>(
    <Box width={'50%'} minWidth={190} mx={2} sx={{ borderRadius:1,border:'1px solid #ccc', height: '100%', bgcolor: 'white', p: 2 }}>
        {children}
        <Typography fontSize={13} color={'black'}>{title}</Typography>
        <Typography color={color} fontSize={13} fontWeight={300}>{more}</Typography>
    </Box>
)
export default function MobileDashboard() {
    return (
        <Box>
            <Stack direction={'row'} overflow={'scroll'} m={2} spacing={2}>
                <Item color={DEFAULT_COLORS.primary_blue} title="Gateway Status" more="Good" >
                    <Router sx={{ fontSize: 20,color:'black' }} />
                </Item>
                <Item color="#CCC400" title="Cloud Synchronization" more="Last active 3h ago" >
                    <CloudOff sx={{ fontSize: 20,color:'#D9D9D9' }} />
                </Item>
                <Item color={DEFAULT_COLORS.secondary_black} title="Access point mode" more="Wifi Name: 'Wazigate E55344'" >
                    <Wifi sx={{ fontSize: 20,color:'black' }} />
                </Item>
            </Stack>
        </Box>
    );
}