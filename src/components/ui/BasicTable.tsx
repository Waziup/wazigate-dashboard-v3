import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, Typography, Box} from '@mui/material';
import { DEFAULT_COLORS } from '../../constants';
import { Sensors,History } from '@mui/icons-material';
import { Device } from 'waziup';
import { capitalizeFirstLetter, differenceInMinutes, isActiveDevice } from '../../utils';
import RowContainerNormal from '../shared/RowContainerNormal';
function createData(
    devType: string,
  name: string,
  runtime: string,
  status: boolean,
) {
  return {devType, name, runtime, status };
}

interface Props{
    devices: Device[]
}
export default function BasicTable({devices}:Props) {
    const rowsData = devices.map((dev)=>{
        return createData(dev.meta.type,dev.name+'*'+Math.round(differenceInMinutes(dev.modified)/60),Math.round(differenceInMinutes(dev.modified)/3600)+'hrs ago',isActiveDevice(dev.modified))
    });
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{minWidth:440, maxWidth:'100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight:'bold'}}></TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
                        <TableCell align="left">
                            <History sx={{fontSize:15,fontWeight:900, color:DEFAULT_COLORS.navbar_dark}}/>
                        </TableCell>
                        <TableCell sx={{fontWeight:'bold'}} align="left">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsData.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>
                                <RowContainerNormal additionStyles={{height:'50%',borderRadius:1,mx:.5,px:.3,bgcolor:DEFAULT_COLORS.primary_blue}}>
                                    <Sensors sx={{fontSize:12,mr:.2, color:'#fff'}}/>
                                    <Typography fontSize={12} color={'white'}>{capitalizeFirstLetter(row.devType)}</Typography>
                                </RowContainerNormal>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography fontSize={[10,11,11,12,10]} color={DEFAULT_COLORS.primary_black}>
                                        {row.name.split('*')[0]}
                                    </Typography> 
                                    <Typography fontSize={[10,11,11,12,10]}  color='#797979'>Last updated {row.name.split('*')[1]} mins</Typography>
                                </Box>
                            </TableCell>
                            <TableCell color='#797979' align="left">{row.runtime}</TableCell>
                            <TableCell color={row.status?'#499DFF':'#797979'} align="left">
                                <Typography color={row.status?'#499DFF':'#797979'} fontWeight={300}>{row.status?'active':'inactive'}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
