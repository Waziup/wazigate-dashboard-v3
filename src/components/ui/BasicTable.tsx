import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Device } from 'waziup';
import { differenceInMinutes, isActiveDevice, lineClamp } from '../../utils';
import { Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  padding:13,
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
//   flexGrow:1,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  cursor:'pointer',
  ":hover":{
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function createData( name: string,runtime: string,status: string,) {
  return { name, runtime, status };
}

interface Props{
    onDeviceClick:(devId:string)=>void,
    devices: Device[]
}
export default function CustomizedTables({devices,onDeviceClick}:Props) {
    const rows = devices.map((dev)=>{
        return createData(dev.name+'*'+differenceInMinutes(dev.modified),differenceInMinutes(dev.modified) ??'',isActiveDevice(dev.modified)+'*'+(dev.meta.type?dev.meta.type:'Generic'))
    });
    const devF =(devName:string)=>{
        const deviceF =  devices.find((d)=>d.name===devName);
        if(deviceF){
            onDeviceClick('/devices/'+deviceF.id);
            return
        }
    }
    return (
        <TableContainer elevation={0} component={Paper}>
            <Table sx={{ minWidth: 700, tableLayout:'fixed' }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Last update</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow onClick={()=>devF(row.name.split('*')[0])} key={row.name}>
                            {/* <StyledTableCell align="left">
                                <Box>
                                    <Box sx={{display:'inline-flex',alignItems:'center',borderRadius:3,px: 1.5,py: .4,bgcolor:DEFAULT_COLORS.primary_blue}}>
                                        <Sensors sx={{fontSize:12,mr: .2, color:'#fff'}}/>
                                        <Typography sx={{...lineClamp(1),fontSize:12, color: 'white'}} >{capitalizeFirstLetter(row.status.split('*')[1])}</Typography>
                                    </Box>
                                </Box>
                            </StyledTableCell> */}
                            <StyledTableCell  scope="row">
                                <Typography sx={{...lineClamp(1),fontWeight:300}} >{row.name.split('*')[0]}</Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                <Typography color='#797979' fontWeight={300}>{row.runtime}</Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                <Typography color={(row.status.split('*')[0] === "true")?'#499DFF':'#797979'} fontWeight={300}>
                                    {(row.status.split('*')[0] === "true")?'active':'offline'}
                                </Typography>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
