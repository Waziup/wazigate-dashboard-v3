import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, Typography, Box} from '@mui/material';
import { DEFAULT_COLORS } from '../../constants';
import { Sensors,History, DeviceHub } from '@mui/icons-material';
import { Device } from 'waziup';
import { differenceInMinutes } from '../../utils';
function createData(
  name: string,
  runtime: string,
  interfaces: number,
  status: boolean,
) {
  return { name, runtime, interfaces, status };
}

interface Props{
    devices: Device[]
}
export default function BasicTable({devices}:Props) {
    const rowsData = devices.map((dev)=>{
        return createData(dev.name+'*'+differenceInMinutes(dev.modified),dev.modified.getHours().toString()+'h',4,false)
    });
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{minWidth:440, maxWidth:'100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
                        <TableCell align="right">
                            <History sx={{fontSize:15,fontWeight:900, color:DEFAULT_COLORS.navbar_dark}}/>
                        </TableCell>
                        <TableCell align="right">
                            <DeviceHub sx={{fontSize:15, color:DEFAULT_COLORS.navbar_dark}}/>
                        </TableCell>
                        <TableCell sx={{fontWeight:'bold'}} align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsData.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell width={260}  >
                                <Box alignItems={'center'} display={'flex'}>
                                    <Box height={'50%'} borderRadius={1} mx={.5} p={.5} bgcolor={DEFAULT_COLORS.primary_blue}>
                                        <Sensors sx={{fontSize:15, color:'#fff'}}/>
                                        <Typography fontSize={10} color={'white'} component={'span'}>WaziDev</Typography>
                                    </Box>
                                    <Box>
                                        <Typography fontSize={[10,11,11,12,10]} color={DEFAULT_COLORS.primary_black}>
                                            {row.name.split('*')[0]}
                                        </Typography> 
                                        <Typography fontSize={[10,11,11,12,10]}  color='#797979'>Last updated {row.name.split('*')[1]} secs</Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell color='#797979' align="right">{row.runtime}</TableCell>
                            <TableCell color='#797979' align="right">{row.interfaces}</TableCell>
                            <TableCell color={row.status?'#499DFF':'#797979'} align="right">
                                <Typography color={row.status?'#499DFF':'#797979'} fontWeight={300}>{row.status?'active':'offline'}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
