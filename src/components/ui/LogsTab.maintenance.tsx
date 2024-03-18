import { Box,Typography } from '@mui/material';
import { getContainerLogs } from '../../utils/systemapi';
import { useEffect, useState } from 'react';
interface Props{
    matches?:boolean
}
export default function LogsTabMaintenance({matches}:Props) {
    console.log(matches);
    const [data, setData] = useState<string>('');
    const loopLoad = async ()=> {
        try{
            const id = await window.wazigate.getID();
            const res = await getContainerLogs(id, 50);
            setData(res);
        }catch(err){
            setData('Error Encountered, could not fetch logs '+err);
        }
        const id = await window.wazigate.getID();
        const res = await getContainerLogs(id, 50);
        setData(res);
    }
    useEffect(() => {
        const interval = setInterval(loopLoad,2000);
        return () => clearInterval(interval);
    }, []);
    return (
        <Box>
            <Typography>
                {data}
            </Typography>
        </Box>
    )
}
