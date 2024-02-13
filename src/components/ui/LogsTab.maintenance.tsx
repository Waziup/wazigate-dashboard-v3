import { Box,Typography } from '@mui/material';
import { getContainerLogs } from '../../utils/systemapi';
import { useEffect, useState } from 'react';
interface Props{
    matches?:boolean
}
export default function LogsTabMaintenance({matches}:Props) {
    console.log(matches);
    const [data, setData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const loopLoad = ()=> {
        setLoading(true);
        window.wazigate.getID()
        .then((id) => {
            getContainerLogs(id, 50)
            .then((res) => {
                setData(res);
                setLoading(false);
            },() => {
                setLoading(false);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    useEffect(() => {
        const interval = setInterval(loopLoad,2000);
        return () => clearInterval(interval);
    }, []);
    if (loading) {
        return (
            <Box>
                <Typography>
                    Loading...
                </Typography>
            </Box>
        )
    }
    return (
        <Box>
            <Typography>
                {data}
            </Typography>
        </Box>
    )
}
