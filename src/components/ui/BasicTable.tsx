import {Table,TableBody,TableCell,TableContainer,TableRow,Paper, Typography, Box} from '@mui/material';
import { DEFAULT_COLORS } from '../../constants';
import { Sensors } from '@mui/icons-material';
import { Device } from 'waziup';
import { capitalizeFirstLetter, differenceInMinutes, isActiveDevice } from '../../utils';
function createData(
    devType: string,
  name: string,
  runtime: string,
  status: boolean,
) {
  return {devType, name, runtime, status };
}

interface Props{
    onDeviceClick:(devId:string)=>void,
    devices: Device[]
}
export default function BasicTable({onDeviceClick, devices}:Props) {
    const rowsData = devices.map((dev)=>{
        return createData(dev.meta.type,dev.name+'*'+differenceInMinutes(dev.modified),differenceInMinutes(dev.modified) ??'',isActiveDevice(dev.modified))
    });
    const devF =(devName:string)=>{
        const deviceF =  devices.find((d)=>d.name===devName);
        if(deviceF){
            onDeviceClick('/devices/'+deviceF.id);
            return
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{minWidth:440, maxWidth:'100%' }} aria-label="simple table">
                {/* <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight:'bold'}}></TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
                        <TableCell align="left">
                            <History sx={{fontSize:15,fontWeight:900, color:DEFAULT_COLORS.navbar_dark}}/>
                        </TableCell>
                        <TableCell sx={{fontWeight:'bold'}} align="left">Status</TableCell>
                    </TableRow>
                </TableHead> */}
                <TableBody>
                    {rowsData.map((row) => (
                        <TableRow
                        onClick={()=>devF(row.name.split('*')[0])}
                        key={row.name}
                        sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            cursor:'pointer',
                            py: 1,
                            '&:hover':{
                                bgcolor:'#f5f5f5'
                            }
                        }}
                        >
                            <TableCell>
                                <Box sx={{display:'flex',alignItems:'center',borderRadius:1, mx:.5,px: 1,py: .5,bgcolor:DEFAULT_COLORS.primary_blue}}>
                                    <Sensors sx={{fontSize:12,mr: .2, color:'#fff'}}/>
                                    <Typography fontSize={12} color={'white'}>{capitalizeFirstLetter(row.devType)}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography fontSize={[10,12,14,16,18]} color={DEFAULT_COLORS.primary_black}>
                                        {row.name.split('*')[0]}
                                    </Typography> 
                                    {/* <Typography fontSize={[8,9,11,13,14]}  color='#797979'>Last updated {row.name.split('*')[1]} mins</Typography> */}
                                </Box>
                            </TableCell>
                            <TableCell color='#797979' align="left">
                                <Typography color={'#797979'} fontWeight={300}>{row.runtime}</Typography>
                            </TableCell>
                            <TableCell color={row.status?'#499DFF':'#797979'} align="left">
                                <Typography color={row.status?'#499DFF':'#797979'} fontWeight={300}>{row.status?'Active':'Inactive'}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
