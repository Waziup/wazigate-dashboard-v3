import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, Typography, Box} from '@mui/material';
import { DEFAULT_COLORS } from '../constants';
import { Sensors } from '@mui/icons-material';
function createData(
  name: string,
  runtime: number,
  interfaces: number,
  status: boolean,
) {
  return { name, runtime, interfaces, status };
}

const rows = [
  createData('Block - D1', 159, 6.0, false),
  createData('Ice cream sandwich', 237, 9.0, true),
  createData('Waziup central', 262, 16.0, true),
];

export default function BasicTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650,maxWidth:'100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Run Time</TableCell>
                        <TableCell align="right">Interfaces</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box alignItems={'center'} display={'flex'}>
                                    <Box height={'50%'} borderRadius={1} mx={1} p={.5} bgcolor={DEFAULT_COLORS.primary_blue}>
                                        <Sensors sx={{fontSize:15, color:'#fff'}}/>
                                        <Typography fontSize={10} mx={1} color={'white'} component={'span'}>WaziDev</Typography>
                                    </Box>
                                    <Box>
                                        <Typography color={DEFAULT_COLORS.primary_black}>
                                            {row.name}
                                        </Typography> 
                                        <Typography color={DEFAULT_COLORS.secondary_black}>Last updated: 10 seconds</Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{row.runtime}</TableCell>
                            <TableCell align="right">{row.interfaces}</TableCell>
                            <TableCell color={row.status?'#499DFF':'orange'} align="right">
                                <Typography color={row.status?'#499DFF':'orange'} fontWeight={300}>{row.status?'active':'offline'}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
