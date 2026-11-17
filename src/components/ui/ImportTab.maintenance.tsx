import { useContext, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { GridItem, GridItemEl } from './ExportTab.maintenance';
import { importTree, type ImportMode, type ImportReport } from '../../utils/systemapi';
import { GlobalContext } from '../../context/global.context';
import { DevicesContext } from '../../context/devices.context';

interface Props {
    matches?: boolean
}

const MODES: { value: ImportMode, label: string, description: string }[] = [
    {
        value: 'merge',
        label: 'Merge (recommended)',
        description: 'Keep existing devices and add missing sensors, actuators and values. Values that already exist are skipped, so importing the same file twice does not create duplicates.',
    },
    {
        value: 'replace',
        label: 'Replace',
        description: 'Delete devices that already exist with the same ID, including all their stored values, and import them again from the file.',
    },
];

export default function ImportTabMaintenance({ matches }: Props) {
    const { showDialog } = useContext(GlobalContext);
    const { getDevicesFc } = useContext(DevicesContext);
    const fileInput = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [mode, setMode] = useState<ImportMode>('merge');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<ImportReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runImport = async () => {
        if (!file) return;
        setLoading(true);
        setReport(null);
        setError(null);
        try {
            const res = await importTree(file, mode);
            setReport(res);
            getDevicesFc();
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    const onImportClick = () => {
        if (mode === 'replace') {
            showDialog({
                title: 'Replace existing devices?',
                acceptBtnTitle: 'REPLACE',
                content: 'Devices on this gateway with the same ID as in "' + file?.name + '" will be deleted together with all their values before importing. This can not be undone.',
                onAccept: runImport,
                onCancel() { },
            });
        } else {
            runImport();
        }
    };

    return (
        <Box mt={2}>
            <Typography fontSize={20}>Import Usage Data</Typography>
            <Grid container>
                <GridItem spacing={2} md={4.6} xs={12} matches={matches as boolean}>
                    <GridItemEl additionStyles={{ pb: 2, boxShadow: 1 }} icon={'upload'} text={'Import Sensor Data'}>
                        <Box m={1} p={1} display='flex' flexDirection='column' gap={2}>
                            <input
                                ref={fileInput}
                                type='file'
                                accept='.zip,application/zip'
                                hidden
                                onChange={(ev) => {
                                    setFile(ev.target.files?.[0] ?? null);
                                    setReport(null);
                                    setError(null);
                                }}
                            />
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Button variant='outlined' color='secondary' startIcon={<AttachFileIcon />} onClick={() => fileInput.current?.click()} disabled={loading}>
                                    CHOOSE ZIP FILE
                                </Button>
                                <Typography variant='body2' noWrap title={file?.name}>
                                    {file ? file.name : 'No file selected'}
                                </Typography>
                            </Stack>

                            <RadioGroup value={mode} onChange={(ev) => setMode(ev.target.value as ImportMode)}>
                                {MODES.map((m) => (
                                    <FormControlLabel key={m.value} value={m.value} control={<Radio color='primary' size='small' />} label={<Typography variant='body2'>{m.label}</Typography>} disabled={loading} />
                                ))}
                            </RadioGroup>

                            <Box>
                                <Button
                                    onClick={onImportClick}
                                    disabled={!file || loading}
                                    disableElevation
                                    variant='contained'
                                    color='secondary'
                                    startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <UploadIcon />}
                                >
                                    {loading ? 'IMPORTING...' : 'IMPORT CSV FILES TREE'}
                                </Button>
                            </Box>

                            {error && <Alert severity='error' sx={{ whiteSpace: 'pre-wrap' }}>{error}</Alert>}
                            {report && (
                                <Alert severity={report.errors.length ? 'warning' : 'success'}>
                                    <Typography variant='body2'>
                                        Devices: {report.devicesCreated} created, {report.devicesMerged} merged, {report.devicesReplaced} replaced<br />
                                        Sensors created: {report.sensorsCreated}, actuators created: {report.actuatorsCreated}<br />
                                        Values imported: {report.valuesImported}, skipped (already present): {report.valuesSkipped}
                                    </Typography>
                                    {report.errors.length > 0 && (
                                        <Box component='ul' sx={{ m: 0, mt: 1, pl: 2 }}>
                                            {report.errors.map((e, i) => <li key={i}><Typography variant='caption'>{e}</Typography></li>)}
                                        </Box>
                                    )}
                                </Alert>
                            )}
                        </Box>
                    </GridItemEl>
                </GridItem>
                <GridItem spacing={2} md={7} xs={12} matches={matches as boolean}>
                    <GridItemEl additionStyles={{ boxShadow: 1 }} icon='info_outlined' text='How the import works'>
                        <Box px={2} py={2} display='flex' flexDirection='column' gap={1.5}>
                            <Typography variant='body2'>
                                The import restores data that was exported with <b>"Export as CSV files tree"</b> above, e.g. from another gateway.
                                Select the downloaded ZIP file as it is, it does not need to be extracted. Devices, sensors and actuators keep their IDs,
                                names and metadata (e.g. codec and LoRaWAN settings), together with all their recorded values.
                            </Typography>
                            {MODES.map((m) => (
                                <Typography variant='body2' key={m.value}>
                                    <b>{m.label}:</b> {m.description}
                                </Typography>
                            ))}
                            <Typography variant='body2' fontWeight={500} mt={1}>Please note:</Typography>
                            <Box component='ul' sx={{ m: 0, pl: 2.5 }}>
                                <li><Typography variant='body2'>"Export as one CSV file" and the binned export can not be imported, they do not contain all the required information.</Typography></li>
                                <li><Typography variant='body2'>The device of this gateway itself is never deleted, it is always merged.</Typography></li>
                                <li><Typography variant='body2'>The exporting gateway shows up as a regular device on this gateway.</Typography></li>
                                <li><Typography variant='body2'>Creation dates are set to the time of the import. Value timestamps are kept with a precision of one second.</Typography></li>
                                <li><Typography variant='body2'>If a cloud synchronization is active, the imported values will be uploaded to the cloud.</Typography></li>
                            </Box>
                        </Box>
                    </GridItemEl>
                </GridItem>
            </Grid>
        </Box>
    )
}
