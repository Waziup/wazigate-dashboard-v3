import { useEffect, useState } from 'react';
import { Snackbar ,Alert } from '@mui/material';
interface SnackbarProps {
    anchorOrigin: {
        vertical: "top" | "bottom";
        horizontal: "center" | "left" | "right";
    };
    message: string;
    autoHideDuration: number;
}
export default function SnackbarComponent({anchorOrigin,message,autoHideDuration}: SnackbarProps) {
    const [showErrSnackbar, setShowErrSnackbar] = useState<boolean>(false);
    const handleClose= ()=>{setShowErrSnackbar(!showErrSnackbar)}
    useEffect(() => {
        if(message){
            handleClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Snackbar anchorOrigin={anchorOrigin} open={showErrSnackbar} autoHideDuration={autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}
