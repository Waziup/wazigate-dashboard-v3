import { Box, Button, } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getContainerLogs, dlContainerLogs, getAllContainers, cInfo } from '../../utils/systemapi';
import { useEffect, useState } from 'react';
import PrimaryIconButton from '../shared/PrimaryIconButton';
import SnackbarComponent from '../shared/Snackbar';

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {
                error ? (
                    <SnackbarComponent
                        autoHideDuration={5000}
                        severity={error.severity}
                        message={(error.message as Error).message ? (error.message as Error).message : (error.message as string)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    />
                ) : null
            }
            <Box sx={{ bgcolor: 'white', boxShadow: 1, width: '100%', p: 3, borderRadius: 2, position: 'relative', }}>
                <pre style={{ fontSize: 13, flexWrap: 'wrap', textWrap: 'wrap' }}>
                    {data}
                </pre>
            </Box>
            {/* <PrimaryIconButton onClick={downloadLogs} iconName='download' title={'Download Logs'} /> */}
            <Button onClick={downloadLogs} variant='contained' color='secondary' disableElevation sx={{ width: 'auto', alignSelf: 'flex-start' }} startIcon={<DownloadIcon />}>Download Logs</Button>
        </Box>
    )
}
