import { Alert, Box, Button, Snackbar, } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getContainerLogs, dlContainerLogs, getAllContainers, cInfo } from '../../utils/systemapi';
import { useEffect, useState } from 'react';
export default function LogsTabMaintenance() {
    const [data, setData] = useState<string>('');
    const [sysContainer, setSysContainer] = useState<cInfo | undefined>(undefined);
    const [error, setError] = useState<{ message: Error | null | string, severity: "error" | "warning" | "info" | "success" } | null>(null);

    const loopLoad = async () => {
        if (sysContainer?.Id) {
            try {
                const res = await getContainerLogs(sysContainer?.Id as string, 50);
                setData(res);
            } catch (err) {
                setData('Could not fetch logs ' + err);
            }
        }
    }
    useEffect(() => {
        const cc = async () => {
            const systemContainer = await getAllContainers();
            const sysContainerF = systemContainer.find((c) => c.Names[0].includes('wazigate-system'));
            setSysContainer(sysContainerF as cInfo);
            if (sysContainerF) {
                const id = sysContainerF.Id;
                const res = await getContainerLogs(id, 50);
                setData(res);
            }
        }
        cc();
        const interval = setInterval(loopLoad, 4000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const downloadLogs = async () => {
        dlContainerLogs(sysContainer?.Id as string).then(
            (res) => {
                res.blob().then((blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;

                    const today = new Date();
                    const fileName =
                        sysContainer?.Names[0] +
                        "_" +
                        today.getFullYear() +
                        "-" +
                        (today.getMonth() + 1) +
                        "-" +
                        today.getDate() +
                        "_" +
                        today.getHours() +
                        "-" +
                        today.getMinutes() +
                        "-" +
                        today.getSeconds() +
                        ".logs";

                    a.download = fileName;
                    a.click();
                });
                setError({
                    message: "Downloaded successfully:\n ",
                    severity: 'success'
                });
            },
            (error) => {
                setError({
                    message: 'Could not fetch logs ' + error,
                    severity: 'warning'
                });
            }
        );
    }
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={error !==null} autoHideDuration={5000} onClose={()=>setError(null)}>
                <Alert onClose={()=>setError(null)} severity={error ? error.severity:'info'} sx={{ width: '100%' }}>
                    {error?error.message as string:''}
                </Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ bgcolor: 'white', boxShadow: 1, width: '100%', p: 3, borderRadius: 2, position: 'relative', }}>
                    <pre style={{ fontSize: 13, flexWrap: 'wrap', textWrap: 'wrap' }}>
                        {data}
                    </pre>
                </Box>
                <Button onClick={downloadLogs} variant='contained' color='secondary' disableElevation sx={{ width: 'auto', alignSelf: 'flex-start' }} startIcon={<DownloadIcon />}>Download Logs</Button>
            </Box>
        </>
    )
}
